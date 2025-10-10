import { NextRequest, NextResponse } from 'next/server';
import { GitHubClient, parseRepositoryUrl } from '@/lib/github/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { repositoryUrl, githubToken } = body;

    if (!repositoryUrl) {
      return NextResponse.json(
        { error: "Repository URL is required" },
        { status: 400 }
      );
    }

    // Parse the repository URL
    let owner: string, repo: string;
    try {
      ({ owner, repo } = parseRepositoryUrl(repositoryUrl));
    } catch (error) {
      return NextResponse.json(
        { 
          valid: false, 
          error: "Invalid GitHub repository URL format" 
        },
        { status: 200 }
      );
    }

    // Initialize GitHub client
    const github = new GitHubClient(githubToken);

    try {
      // Attempt to fetch repository information
      const repository = await github.getRepository(owner, repo);

      return NextResponse.json({
        valid: true,
        repository: {
          id: repository.id,
          name: repository.name,
          full_name: repository.full_name,
          owner: repository.owner.login,
          is_fork: repository.fork,
          default_branch: repository.default_branch,
          html_url: repository.html_url,
          parent: repository.parent ? {
            full_name: repository.parent.full_name,
            html_url: repository.parent.html_url,
          } : undefined,
        },
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      if (errorMessage.includes('404')) {
        return NextResponse.json({
          valid: false,
          error: "Repository not found or not accessible",
        });
      } else if (errorMessage.includes('403')) {
        return NextResponse.json({
          valid: false,
          error: "Access denied. Repository may be private or rate limit exceeded",
        });
      } else {
        return NextResponse.json({
          valid: false,
          error: `GitHub API error: ${errorMessage}`,
        });
      }
    }
  } catch (error) {
    console.error('Repository validation error:', error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}