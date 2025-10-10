import { NextRequest, NextResponse } from 'next/server';
import { GitHubClient, parseRepositoryUrl } from '@/lib/github/client';
import { CommitSummarizer } from '@/lib/ai/summarizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { forkUrl, upstreamUrl, branch, githubToken } = body;

    if (!forkUrl || !upstreamUrl) {
      return NextResponse.json(
        { error: "Both fork and upstream repository URLs are required" },
        { status: 400 }
      );
    }

    // Parse repository URLs
    let forkOwner: string, forkRepo: string;
    let upstreamOwner: string, upstreamRepo: string;
    
    try {
      ({ owner: forkOwner, repo: forkRepo } = parseRepositoryUrl(forkUrl));
      ({ owner: upstreamOwner, repo: upstreamRepo } = parseRepositoryUrl(upstreamUrl));
    } catch (error) {
      return NextResponse.json(
        { error: "Invalid GitHub repository URL format" },
        { status: 400 }
      );
    }

    // Initialize GitHub client and AI summarizer
    const github = new GitHubClient(githubToken);
    const summarizer = new CommitSummarizer();

    try {
      // Get repository information for both repos
      const [forkRepository, upstreamRepository] = await Promise.all([
        github.getRepository(forkOwner, forkRepo),
        github.getRepository(upstreamOwner, upstreamRepo),
      ]);

      // Determine the branch to compare (default to main/master)
      const targetBranch = branch || forkRepository.default_branch || 'main';
      const upstreamBranch = branch || upstreamRepository.default_branch || 'main';

      // Compare the repositories
      const comparison = await github.compareRepositories(
        upstreamOwner,
        upstreamRepo,
        upstreamBranch,
        forkOwner,
        forkRepo,
        targetBranch
      );

      // Get detailed commit information for analysis
      const aheadCommits = comparison.commits || [];
      const behindCommits: typeof comparison.commits = [];

      // If fork is behind, we need to get the commits it's missing
      if (comparison.behind_by > 0) {
        try {
          // Get commits from upstream that fork doesn't have
          const upstreamCommits = await github.getCommits(upstreamOwner, upstreamRepo, {
            sha: upstreamBranch,
            per_page: Math.min(comparison.behind_by, 50), // Limit to 50 for performance
          });

          // Filter out commits that exist in both (find commits unique to upstream)
          const forkCommitShas = new Set(aheadCommits.map(c => c.sha));
          const uniqueUpstreamCommits = upstreamCommits.filter(c => !forkCommitShas.has(c.sha));

          behindCommits.push(...uniqueUpstreamCommits.slice(0, comparison.behind_by));
        } catch (error) {
          console.warn('Failed to fetch behind commits:', error);
        }
      }

      // Get detailed commit information
      const [detailedAheadCommits, detailedBehindCommits] = await Promise.all([
        Promise.all(
          aheadCommits.slice(0, 20).map(async (commit) => { // Limit to 20 for performance
            try {
              return await github.getCommit(forkOwner, forkRepo, commit.sha);
            } catch (error) {
              console.warn(`Failed to get detailed info for ahead commit ${commit.sha}:`, error);
              return commit;
            }
          })
        ),
        Promise.all(
          behindCommits.slice(0, 20).map(async (commit) => { // Limit to 20 for performance
            try {
              return await github.getCommit(upstreamOwner, upstreamRepo, commit.sha);
            } catch (error) {
              console.warn(`Failed to get detailed info for behind commit ${commit.sha}:`, error);
              return commit;
            }
          })
        ),
      ]);

      // Analyze commits with AI
      const [analyzedAheadCommits, analyzedBehindCommits] = await Promise.all([
        Promise.all(
          detailedAheadCommits.map(async (commit) => {
            const aiSummary = await summarizer.analyzeCommit(commit);
            
            return {
              sha: commit.sha,
              message: commit.commit.message,
              author: {
                name: commit.commit.author.name,
                email: commit.commit.author.email,
                username: commit.author?.login,
              },
              date: commit.commit.author.date,
              stats: commit.stats || { additions: 0, deletions: 0, total: 0 },
              files_changed: (commit.files || []).map(file => ({
                filename: file.filename,
                status: file.status,
                additions: file.additions,
                deletions: file.deletions,
              })),
              ai_summary: aiSummary,
              html_url: commit.html_url,
            };
          })
        ),
        Promise.all(
          detailedBehindCommits.map(async (commit) => {
            const aiSummary = await summarizer.analyzeCommit(commit);
            
            return {
              sha: commit.sha,
              message: commit.commit.message,
              author: {
                name: commit.commit.author.name,
                email: commit.commit.author.email,
                username: commit.author?.login,
              },
              date: commit.commit.author.date,
              stats: commit.stats || { additions: 0, deletions: 0, total: 0 },
              files_changed: (commit.files || []).map(file => ({
                filename: file.filename,
                status: file.status,
                additions: file.additions,
                deletions: file.deletions,
              })),
              ai_summary: aiSummary,
              html_url: commit.html_url,
            };
          })
        ),
      ]);

      // Generate AI summary of the comparison
      const forkSummary = await summarizer.generateForkSummary(
        comparison,
        detailedAheadCommits,
        detailedBehindCommits
      );

      return NextResponse.json({
        fork_repository: {
          full_name: forkRepository.full_name,
          html_url: forkRepository.html_url,
          is_fork: forkRepository.fork,
          default_branch: forkRepository.default_branch,
        },
        upstream_repository: {
          full_name: upstreamRepository.full_name,
          html_url: upstreamRepository.html_url,
          is_fork: upstreamRepository.fork,
          default_branch: upstreamRepository.default_branch,
        },
        comparison: {
          status: comparison.status,
          ahead_by: comparison.ahead_by,
          behind_by: comparison.behind_by,
          total_commits: comparison.total_commits,
          base_commit: {
            sha: comparison.base_commit.sha,
            message: comparison.base_commit.commit.message,
          },
          merge_base_commit: {
            sha: comparison.merge_base_commit.sha,
            message: comparison.merge_base_commit.commit.message,
          },
        },
        commits_analysis: {
          ahead_commits: analyzedAheadCommits,
          behind_commits: analyzedBehindCommits,
        },
        summary: forkSummary,
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('404')) {
        return NextResponse.json(
          { error: "One or both repositories not found, or branch does not exist" },
          { status: 404 }
        );
      } else if (errorMessage.includes('403')) {
        return NextResponse.json(
          { error: "Access denied. Repositories may be private or rate limit exceeded" },
          { status: 403 }
        );
      } else if (errorMessage.includes('422')) {
        return NextResponse.json(
          { error: "Invalid repository parameters or branch names" },
          { status: 422 }
        );
      } else {
        console.error('Fork comparison error:', error);
        return NextResponse.json(
          { error: `Comparison failed: ${errorMessage}` },
          { status: 500 }
        );
      }
    }
  } catch (error) {
    console.error('Request processing error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}