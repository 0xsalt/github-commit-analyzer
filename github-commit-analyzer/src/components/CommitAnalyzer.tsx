"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import { 
  Search, 
  GitCommit, 
  Calendar, 
  FileText, 
  Plus, 
  Minus, 
  User, 
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Code,
  Bug,
  Wrench
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

interface CommitSummary {
  overall_purpose: string;
  key_changes: string[];
  categories: {
    bug_fixes: number;
    features: number;
    refactoring: number;
    documentation: number;
    testing: number;
    other: number;
  };
  total_changes: {
    files_modified: number;
    lines_added: number;
    lines_deleted: number;
  };
  time_period: {
    first_commit_date: string;
    last_commit_date: string;
  };
  themes: {
    big_picture_summary: string;
    dominant_themes: string[];
    technical_focus_areas: string[];
  };
  trajectory: {
    project_direction: string;
    development_momentum: string;
    upcoming_priorities: string[];
    architectural_evolution: string;
  };
}

interface AnalysisResult {
  repository: {
    full_name: string;
    html_url: string;
    default_branch: string;
  };
  commits: CommitData[];
  summary: CommitSummary;
  metadata: {
    total_commits_analyzed: number;
    analysis_date: string;
    branch_analyzed: string;
  };
}

export default function CommitAnalyzer() {
  const [repositoryUrl, setRepositoryUrl] = useState("");
  const [commitCount, setCommitCount] = useState("10");
  const [githubToken, setGithubToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const analyzeCommits = async () => {
    if (!repositoryUrl.trim()) {
      setError("Please enter a repository URL");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/commits/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repositoryUrl: repositoryUrl.trim(),
          commitCount: parseInt(commitCount),
          githubToken: githubToken.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to analyze commits");
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "bug_fixes": return <Bug className="h-4 w-4" />;
      case "features": return <TrendingUp className="h-4 w-4" />;
      case "refactoring": return <Wrench className="h-4 w-4" />;
      case "documentation": return <FileText className="h-4 w-4" />;
      case "testing": return <CheckCircle2 className="h-4 w-4" />;
      default: return <Code className="h-4 w-4" />;
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
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            GitHub Repository URL
          </label>
          <Input
            placeholder="https://github.com/owner/repository"
            value={repositoryUrl}
            onChange={(e) => setRepositoryUrl(e.target.value)}
            className="font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Number of Commits
            </label>
            <Select value={commitCount} onValueChange={setCommitCount}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 commits</SelectItem>
                <SelectItem value="10">10 commits</SelectItem>
                <SelectItem value="20">20 commits</SelectItem>
                <SelectItem value="50">50 commits</SelectItem>
                <SelectItem value="100">100 commits</SelectItem>
              </SelectContent>
            </Select>
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
        </div>

        <Button 
          onClick={analyzeCommits} 
          disabled={loading}
          className="w-full md:w-auto"
        >
          {loading ? (
            <>
              <Spinner className="mr-2 h-4 w-4" />
              Analyzing Commits...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Analyze Commits
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
          {/* Repository Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCommit className="h-5 w-5" />
                {result.repository.full_name}
              </CardTitle>
              <CardDescription className="flex items-center gap-4">
                <span>Branch: {result.metadata.branch_analyzed}</span>
                <span>•</span>
                <span>Analyzed: {formatDate(result.metadata.analysis_date)}</span>
                <a 
                  href={result.repository.html_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                >
                  <ExternalLink className="h-3 w-3" />
                  View on GitHub
                </a>
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Overall Purpose</h4>
                <p className="text-slate-700 dark:text-slate-300">{result.summary.overall_purpose}</p>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Commit Categories</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(result.summary.categories).map(([category, count]) => (
                    <div key={category} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                      {getCategoryIcon(category)}
                      <span className="text-sm font-medium capitalize">
                        {category.replace("_", " ")}: {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Change Statistics</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
                    <div className="flex items-center justify-center gap-1 text-green-600 dark:text-green-400 mb-1">
                      <Plus className="h-4 w-4" />
                      <span className="font-bold text-lg">{result.summary.total_changes.lines_added}</span>
                    </div>
                    <p className="text-sm text-green-700 dark:text-green-300">Lines Added</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center justify-center gap-1 text-red-600 dark:text-red-400 mb-1">
                      <Minus className="h-4 w-4" />
                      <span className="font-bold text-lg">{result.summary.total_changes.lines_deleted}</span>
                    </div>
                    <p className="text-sm text-red-700 dark:text-red-300">Lines Deleted</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                    <div className="flex items-center justify-center gap-1 text-blue-600 dark:text-blue-400 mb-1">
                      <FileText className="h-4 w-4" />
                      <span className="font-bold text-lg">{result.summary.total_changes.files_modified}</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300">Files Modified</p>
                  </div>
                </div>
              </div>

              {result.summary.key_changes.length > 0 && (
                <>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-3">Key Changes</h4>
                    <ul className="space-y-2">
                      {result.summary.key_changes.map((change, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                          <span className="text-slate-700 dark:text-slate-300">{change}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Development Themes</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Big Picture Analysis</h5>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {result.summary.themes.big_picture_summary}
                    </p>
                  </div>
                  
                  {result.summary.themes.dominant_themes.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Dominant Themes</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.summary.themes.dominant_themes.map((theme, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {theme}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.summary.themes.technical_focus_areas.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Technical Focus Areas</h5>
                      <div className="flex flex-wrap gap-2">
                        {result.summary.themes.technical_focus_areas.map((area, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-3">Project Trajectory</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Project Direction</h5>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {result.summary.trajectory.project_direction}
                    </p>
                  </div>

                  <div>
                    <h5 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Development Momentum</h5>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {result.summary.trajectory.development_momentum}
                    </p>
                  </div>

                  {result.summary.trajectory.upcoming_priorities.length > 0 && (
                    <div>
                      <h5 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Upcoming Priorities</h5>
                      <ul className="space-y-1">
                        {result.summary.trajectory.upcoming_priorities.map((priority, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <TrendingUp className="h-3 w-3 text-blue-600 dark:text-blue-400 mt-1 flex-shrink-0" />
                            <span className="text-slate-700 dark:text-slate-300 text-sm">{priority}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div>
                    <h5 className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Architectural Evolution</h5>
                    <p className="text-slate-700 dark:text-slate-300 text-sm leading-relaxed">
                      {result.summary.trajectory.architectural_evolution}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Individual Commits */}
          <Card>
            <CardHeader>
              <CardTitle>Commit Details</CardTitle>
              <CardDescription>
                Showing {result.commits.length} commits with AI-powered analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {result.commits.map((commit, index) => (
                <div key={commit.sha} className="border rounded-lg p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs">
                          {commit.sha.substring(0, 7)}
                        </Badge>
                        <span className="text-sm text-slate-500">#{result.commits.length - index}</span>
                      </div>
                      <h4 className="font-medium text-slate-900 dark:text-slate-100">{commit.message}</h4>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {commit.author.name}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(commit.date)}
                        </div>
                        <a 
                          href={commit.html_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          <ExternalLink className="h-3 w-3" />
                          View
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
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
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-md p-3">
                      <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">AI Summary</h5>
                      <p className="text-sm text-blue-800 dark:text-blue-200">{commit.ai_summary}</p>
                    </div>
                  )}

                  {commit.files_changed.length > 0 && (
                    <div className="space-y-2">
                      <h5 className="font-medium text-sm">Files Changed</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {commit.files_changed.slice(0, 6).map((file, fileIndex) => (
                          <div key={fileIndex} className="flex items-center gap-2 text-xs bg-slate-50 dark:bg-slate-800 rounded px-2 py-1">
                            <Badge variant="outline" className="text-xs">
                              {file.status}
                            </Badge>
                            <span className="font-mono truncate">{file.filename}</span>
                          </div>
                        ))}
                        {commit.files_changed.length > 6 && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            +{commit.files_changed.length - 6} more files...
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}