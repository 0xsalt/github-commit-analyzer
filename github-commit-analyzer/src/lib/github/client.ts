export interface GitHubRepository {
  id: number;
  name: string;
  full_name: string;
  owner: {
    login: string;
    id: number;
    type: string;
  };
  private: boolean;
  html_url: string;
  description: string | null;
  fork: boolean;
  default_branch: string;
  parent?: {
    id: number;
    full_name: string;
    html_url: string;
    owner: {
      login: string;
    };
  };
  source?: {
    id: number;
    full_name: string;
    html_url: string;
  };
}

export interface GitHubCommit {
  sha: string;
  node_id: string;
  commit: {
    author: {
      name: string;
      email: string;
      date: string;
    };
    committer: {
      name: string;
      email: string;
      date: string;
    };
    message: string;
    tree: {
      sha: string;
      url: string;
    };
  };
  url: string;
  html_url: string;
  author: {
    login: string;
    id: number;
  } | null;
  committer: {
    login: string;
    id: number;
  } | null;
  parents: Array<{
    sha: string;
    url: string;
    html_url: string;
  }>;
  stats?: {
    total: number;
    additions: number;
    deletions: number;
  };
  files?: Array<{
    sha: string;
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
  }>;
}

export interface GitHubComparison {
  url: string;
  html_url: string;
  permalink_url: string;
  diff_url: string;
  patch_url: string;
  base_commit: GitHubCommit;
  merge_base_commit: GitHubCommit;
  status: "ahead" | "behind" | "identical" | "diverged";
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  commits: GitHubCommit[];
  files: Array<{
    sha: string;
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    blob_url: string;
    raw_url: string;
    contents_url: string;
    patch?: string;
  }>;
}

export class GitHubClient {
  private baseUrl = "https://api.github.com";
  private token?: string;

  constructor(token?: string) {
    this.token = token;
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = {
      "Accept": "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "GitHub-Commit-Analyzer/1.0",
      ...options.headers as Record<string, string>,
    };

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || 
        `GitHub API error: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  }

  async getRepository(owner: string, repo: string): Promise<GitHubRepository> {
    return this.makeRequest<GitHubRepository>(`/repos/${owner}/${repo}`);
  }

  async getCommits(
    owner: string, 
    repo: string, 
    options: {
      sha?: string;
      since?: string;
      until?: string;
      per_page?: number;
      page?: number;
      path?: string;
      author?: string;
    } = {}
  ): Promise<GitHubCommit[]> {
    const params = new URLSearchParams();
    
    Object.entries(options).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });

    const queryString = params.toString();
    const endpoint = `/repos/${owner}/${repo}/commits${queryString ? `?${queryString}` : ''}`;
    
    return this.makeRequest<GitHubCommit[]>(endpoint);
  }

  async getCommit(owner: string, repo: string, ref: string): Promise<GitHubCommit> {
    return this.makeRequest<GitHubCommit>(`/repos/${owner}/${repo}/commits/${ref}`);
  }

  async compareCommits(
    owner: string, 
    repo: string, 
    base: string, 
    head: string
  ): Promise<GitHubComparison> {
    return this.makeRequest<GitHubComparison>(`/repos/${owner}/${repo}/compare/${base}...${head}`);
  }

  async compareRepositories(
    baseOwner: string,
    baseRepo: string,
    baseBranch: string,
    headOwner: string,
    headRepo: string,
    headBranch: string
  ): Promise<GitHubComparison> {
    // Use the base repository as the context for comparison
    const base = `${baseOwner}:${baseBranch}`;
    const head = `${headOwner}:${headBranch}`;
    
    return this.makeRequest<GitHubComparison>(`/repos/${baseOwner}/${baseRepo}/compare/${base}...${head}`);
  }

  async getRateLimit(): Promise<{
    limit: number;
    remaining: number;
    reset: number;
    used: number;
  }> {
    const response = await this.makeRequest<{
      rate: {
        limit: number;
        remaining: number;
        reset: number;
        used: number;
      };
    }>('/rate_limit');
    
    return response.rate;
  }
}

export function parseRepositoryUrl(url: string): { owner: string; repo: string } {
  // Remove trailing .git if present
  const cleanUrl = url.replace(/\.git$/, '');
  
  // Handle different GitHub URL formats
  const patterns = [
    /github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/,  // https://github.com/owner/repo or https://github.com/owner/repo/...
    /github\.com:([^\/]+)\/([^\/]+)(?:\.git)?$/,  // git@github.com:owner/repo.git
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match) {
      return {
        owner: match[1],
        repo: match[2],
      };
    }
  }

  throw new Error(`Invalid GitHub repository URL: ${url}`);
}

export function validateRepositoryUrl(url: string): boolean {
  try {
    parseRepositoryUrl(url);
    return true;
  } catch {
    return false;
  }
}