import { NextRequest, NextResponse } from 'next/server';
import { GitHubClient, parseRepositoryUrl } from '@/lib/github/client';
import { CommitSummarizer } from '@/lib/ai/summarizer';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repositoryUrl, commitCount, branch, githubToken } = body;

    if (!repositoryUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    if (!commitCount || commitCount < 1 || commitCount > 100) {
      return NextResponse.json(
        { error: "Commit count must be between 1 and 100" },
        { status: 400 }
      );
    }

    // Parse the repository URL
    let owner: string, repo: string;
    try {
      ({ owner, repo } = parseRepositoryUrl(repositoryUrl));
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
      // Get repository information
      const repository = await github.getRepository(owner, repo);
      const targetBranch = branch || repository.default_branch;

      // Fetch commits
      const commits = await github.getCommits(owner, repo, {
        sha: targetBranch,
        per_page: commitCount,
      });

      if (commits.length === 0) {
        return NextResponse.json(
          { error: "No commits found in the specified branch" },
          { status: 404 }
        );
      }

      // Get detailed information for each commit (including file changes)
      const detailedCommits = await Promise.all(
        commits.map(async (commit) => {
          try {
            return await github.getCommit(owner, repo, commit.sha);
          } catch (error) {
            // If we can't get detailed info, return the basic commit
            console.warn(`Failed to get detailed info for commit ${commit.sha}:`, error);
            return commit;
          }
        })
      );

      // Analyze commits with AI
      const commitAnalyses = await Promise.all(
        detailedCommits.map(async (commit) => {
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
      );

      // Generate overall summary
      const summary = await summarizer.generateCommitSummary(detailedCommits);

      return NextResponse.json({
        repository: {
          full_name: repository.full_name,
          html_url: repository.html_url,
          default_branch: repository.default_branch,
        },
        commits: commitAnalyses,
        summary,
        metadata: {
          total_commits_analyzed: commitAnalyses.length,
          analysis_date: new Date().toISOString(),
          branch_analyzed: targetBranch,
        },
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('404')) {
        return NextResponse.json(
          { error: "Repository not found or branch does not exist" },
          { status: 404 }
        );
      } else if (errorMessage.includes('403')) {
        return NextResponse.json(
          { error: "Access denied. Repository may be private or rate limit exceeded" },
          { status: 403 }
        );
      } else if (errorMessage.includes('422')) {
        return NextResponse.json(
          { error: "Invalid branch name or repository parameters" },
          { status: 422 }
        );
      } else {
        console.error('Commit analysis error:', error);
        return NextResponse.json(
          { error: `Analysis failed: ${errorMessage}` },
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