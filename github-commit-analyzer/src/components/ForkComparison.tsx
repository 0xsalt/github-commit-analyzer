"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { 
  GitCompare, 
  GitFork, 
  ArrowRight, 
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Equal,
  GitBranch,
  Calendar,
  User,
  FileText,
  Plus,
  Minus
} from "lucide-react";

interface CommitData {
  sha: string;
  message: string;
  author: {
    name: string;
    email: string;
    username?: string;
  };
  date: string;
  stats: {
    additions: number;
    deletions: number;
    total: number;
  };
  files_changed: Array<{
    filename: string;
    status: string;
    additions: number;
    deletions: number;
  }>;
  ai_summary: string;
  html_url: string;
}

interface ForkComparison {
  status: "ahead" | "behind" | "identical" | "diverged";
  ahead_by: number;
  behind_by: number;
  total_commits: number;
  base_commit: {
    sha: string;
    message: string;
  };
  merge_base_commit: {
    sha: string;
    message: string;
  };
}

interface ForkSummary {
  sync_status: string;
  recommendation: string;
  key_differences: string[];
  upstream_highlights: string[];
  fork_unique_features: string[];
}

interface Repository {
  full_name: string;
  html_url: string;
  is_fork: boolean;
  default_branch: string;
}

interface ComparisonResult {
  fork_repository: Repository;
  upstream_repository: Repository;
  comparison: ForkComparison;
  commits_analysis: {
    ahead_commits: CommitData[];
    behind_commits: CommitData[];
  };
  summary: ForkSummary;
}

export default function ForkComparison() {
  const [forkUrl, setForkUrl] = useState("");
  const [upstreamUrl, setUpstreamUrl] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ComparisonResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const compareRepositories = async () => {
    if (!forkUrl.trim() || !upstreamUrl.trim()) {
      setError("Please enter both repository URLs");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/forks/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          forkUrl: forkUrl.trim(),
          upstreamUrl: upstreamUrl.trim(),
          githubToken: githubToken.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to compare repositories");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ahead": return <TrendingUp className="h-4 w-4 text-green-600" />;
      case "behind": return <TrendingDown className="h-4 w-4 text-red-600" />;
      case "identical": return <Equal className="h-4 w-4 text-green-600" />;
      case "diverged": return <GitBranch className="h-4 w-4 text-yellow-600" />;
      default: return <Clock className="h-4 w-4 text-slate-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ahead": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "behind": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "identical": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "diverged": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default: return "bg-slate-100 text-slate-800 dark:bg-slate-900 dark:text-slate-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Input Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Fork Repository URL
            </label>
            <Input
              placeholder="https://github.com/user/forked-repo"
              value={forkUrl}
              onChange={(e) => setForkUrl(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Upstream Repository URL
            </label>
            <Input
              placeholder="https://github.com/original/repo"
              value={upstreamUrl}
              onChange={(e) => setUpstreamUrl(e.target.value)}
              className="font-mono text-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            GitHub Token (Optional)
          </label>
          <Input
            type="password"
            placeholder="ghp_xxxxxxxxxxxx"
            value={githubToken}
            onChange={(e) => setGithubToken(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <Button 
          onClick={compareRepositories} 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Comparing Repositories...
            </>
          ) : (
            <>
              <GitCompare className="mr-2 h-4 w-4" />
              Compare Repositories
            </>
          )}
        </Button>
      </div>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Results */}
      {result && (
        <div className="space-y-6">
          {/* Repository Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitFork className="h-5 w-5" />
                Repository Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-center flex-1">
                  <div className="font-semibold text-lg">{result.fork_repository.full_name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Fork Repository</div>
                  <a 
                    href={result.fork_repository.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm mt-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on GitHub
                  </a>
                </div>
                
                <div className="flex flex-col items-center">
                  <ArrowRight className="h-6 w-6 text-slate-400" />
                  <div className="text-xs text-slate-500 mt-1">vs</div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="font-semibold text-lg">{result.upstream_repository.full_name}</div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Upstream Repository</div>
                  <a 
                    href={result.upstream_repository.html_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm mt-1"
                  >
                    <ExternalLink className="h-3 w-3" />
                    View on GitHub
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Status */}
          <Card>
            <CardHeader>
              <CardTitle>Synchronization Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(result.comparison.status)}`}>
                  {getStatusIcon(result.comparison.status)}
                  <span className="font-semibold capitalize">{result.comparison.status}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 mt-2">{result.summary.sync_status}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                  <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 mb-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="font-bold text-lg">{result.comparison.ahead_by}</span>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">Commits Ahead</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 mb-1">
                    <TrendingDown className="h-4 w-4" />
                    <span className="font-bold text-lg">{result.comparison.behind_by}</span>
                  </div>
                  <p className="text-sm text-red-700 dark:text-red-300">Commits Behind</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                    <GitBranch className="h-4 w-4" />
                    <span className="font-bold text-lg">{result.comparison.total_commits}</span>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">Total Difference</p>
                </div>
              </div>

              {result.summary.recommendation && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Recommendation</h4>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
                      <p className="text-blue-800 dark:text-blue-200">{result.summary.recommendation}</p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Key Differences */}
          {(result.summary.key_differences.length > 0 || 
            result.summary.upstream_highlights.length > 0 || 
            result.summary.fork_unique_features.length > 0) && (
            <Card>
              <CardHeader>
                <CardTitle>Key Differences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {result.summary.key_differences.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3">Overall Differences</h4>
                    <ul className="space-y-2">
                      {result.summary.key_differences.map((difference, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{difference}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.summary.upstream_highlights.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3">Missing from Fork (Upstream Changes)</h4>
                      <ul className="space-y-2">
                        {result.summary.upstream_highlights.map((highlight, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                {result.summary.fork_unique_features.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h4 className="font-semibold mb-3">Unique to Fork</h4>
                      <ul className="space-y-2">
                        {result.summary.fork_unique_features.map((feature, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          )}

          {/* Commit Details */}
          {(result.commits_analysis.ahead_commits.length > 0 || result.commits_analysis.behind_commits.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Ahead Commits */}
              {result.commits_analysis.ahead_commits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                      <TrendingUp className="h-5 w-5" />
                      Fork Ahead ({result.commits_analysis.ahead_commits.length})
                    </CardTitle>
                    <CardDescription>
                      Commits in fork that are not in upstream
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.commits_analysis.ahead_commits.map((commit, index) => (
                      <div key={commit.sha} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {commit.sha.substring(0, 7)}
                          </Badge>
                        </div>
                        <h5 className="font-medium text-sm">{commit.message}</h5>
                        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {commit.author.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(commit.date)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Plus className="h-3 w-3" />
                            {commit.stats.additions}
                          </div>
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <Minus className="h-3 w-3" />
                            {commit.stats.deletions}
                          </div>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <FileText className="h-3 w-3" />
                            {commit.files_changed.length} files
                          </div>
                        </div>
                        {commit.ai_summary && (
                          <div className="bg-green-50 dark:bg-green-900/20 rounded-md p-2">
                            <p className="text-xs text-green-800 dark:text-green-200">{commit.ai_summary}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Behind Commits */}
              {result.commits_analysis.behind_commits.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
                      <TrendingDown className="h-5 w-5" />
                      Fork Behind ({result.commits_analysis.behind_commits.length})
                    </CardTitle>
                    <CardDescription>
                      Commits in upstream that are not in fork
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {result.commits_analysis.behind_commits.map((commit, index) => (
                      <div key={commit.sha} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-mono text-xs">
                            {commit.sha.substring(0, 7)}
                          </Badge>
                        </div>
                        <h5 className="font-medium text-sm">{commit.message}</h5>
                        <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {commit.author.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(commit.date)}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs">
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <Plus className="h-3 w-3" />
                            {commit.stats.additions}
                          </div>
                          <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                            <Minus className="h-3 w-3" />
                            {commit.stats.deletions}
                          </div>
                          <div className="flex items-center gap-1 text-slate-600 dark:text-slate-400">
                            <FileText className="h-3 w-3" />
                            {commit.files_changed.length} files
                          </div>
                        </div>
                        {commit.ai_summary && (
                          <div className="bg-red-50 dark:bg-red-900/20 rounded-md p-2">
                            <p className="text-xs text-red-800 dark:text-red-200">{commit.ai_summary}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}