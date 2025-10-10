module.exports = {

"[project]/.next-internal/server/app/api/commits/analyze/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/lib/github/client.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GitHubClient": (()=>GitHubClient),
    "parseRepositoryUrl": (()=>parseRepositoryUrl),
    "validateRepositoryUrl": (()=>validateRepositoryUrl)
});
class GitHubClient {
    baseUrl = "https://api.github.com";
    token;
    constructor(token){
        this.token = token;
    }
    async makeRequest(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const headers = {
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "GitHub-Commit-Analyzer/1.0",
            ...options.headers
        };
        if (this.token) {
            headers["Authorization"] = `Bearer ${this.token}`;
        }
        const response = await fetch(url, {
            ...options,
            headers
        });
        if (!response.ok) {
            const errorData = await response.json().catch(()=>({}));
            throw new Error(errorData.message || `GitHub API error: ${response.status} ${response.statusText}`);
        }
        return response.json();
    }
    async getRepository(owner, repo) {
        return this.makeRequest(`/repos/${owner}/${repo}`);
    }
    async getCommits(owner, repo, options = {}) {
        const params = new URLSearchParams();
        Object.entries(options).forEach(([key, value])=>{
            if (value !== undefined) {
                params.append(key, value.toString());
            }
        });
        const queryString = params.toString();
        const endpoint = `/repos/${owner}/${repo}/commits${queryString ? `?${queryString}` : ''}`;
        return this.makeRequest(endpoint);
    }
    async getCommit(owner, repo, ref) {
        return this.makeRequest(`/repos/${owner}/${repo}/commits/${ref}`);
    }
    async compareCommits(owner, repo, base, head) {
        return this.makeRequest(`/repos/${owner}/${repo}/compare/${base}...${head}`);
    }
    async compareRepositories(baseOwner, baseRepo, baseBranch, headOwner, headRepo, headBranch) {
        // Use the base repository as the context for comparison
        const base = `${baseOwner}:${baseBranch}`;
        const head = `${headOwner}:${headBranch}`;
        return this.makeRequest(`/repos/${baseOwner}/${baseRepo}/compare/${base}...${head}`);
    }
    async getRateLimit() {
        const response = await this.makeRequest('/rate_limit');
        return response.rate;
    }
}
function parseRepositoryUrl(url) {
    // Remove trailing .git if present
    const cleanUrl = url.replace(/\.git$/, '');
    // Handle different GitHub URL formats
    const patterns = [
        /github\.com\/([^\/]+)\/([^\/]+)(?:\/.*)?$/,
        /github\.com:([^\/]+)\/([^\/]+)(?:\.git)?$/
    ];
    for (const pattern of patterns){
        const match = cleanUrl.match(pattern);
        if (match) {
            return {
                owner: match[1],
                repo: match[2]
            };
        }
    }
    throw new Error(`Invalid GitHub repository URL: ${url}`);
}
function validateRepositoryUrl(url) {
    try {
        parseRepositoryUrl(url);
        return true;
    } catch  {
        return false;
    }
}
}}),
"[project]/src/lib/ai/summarizer.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "CommitSummarizer": (()=>CommitSummarizer)
});
class CommitSummarizer {
    async analyzeCommit(commit) {
        // For now, we'll create a rule-based summary
        // This can be replaced with actual AI/LLM integration later
        const message = commit.commit.message.toLowerCase();
        const files = commit.files || [];
        const stats = commit.stats || {
            additions: 0,
            deletions: 0,
            total: 0
        };
        // Categorize the commit
        let category = "other";
        let summary = "";
        if (message.includes("fix") || message.includes("bug") || message.includes("error")) {
            category = "bug_fixes";
            summary = this.generateBugFixSummary(commit);
        } else if (message.includes("feat") || message.includes("add") || message.includes("new")) {
            category = "features";
            summary = this.generateFeatureSummary(commit);
        } else if (message.includes("refactor") || message.includes("cleanup") || message.includes("reorganize")) {
            category = "refactoring";
            summary = this.generateRefactoringSummary(commit);
        } else if (message.includes("doc") || message.includes("readme") || message.includes("comment")) {
            category = "documentation";
            summary = this.generateDocumentationSummary(commit);
        } else if (message.includes("test") || message.includes("spec")) {
            category = "testing";
            summary = this.generateTestingSummary(commit);
        } else {
            summary = this.generateGenericSummary(commit);
        }
        return summary;
    }
    generateBugFixSummary(commit) {
        const files = commit.files || [];
        const stats = commit.stats || {
            additions: 0,
            deletions: 0,
            total: 0
        };
        const mainFiles = files.slice(0, 3).map((f)=>f.filename);
        const fileCount = files.length;
        let summary = "Bug fix addressing ";
        if (mainFiles.length > 0) {
            if (mainFiles.some((f)=>f.includes('.test.') || f.includes('.spec.'))) {
                summary += "test-related issues";
            } else if (mainFiles.some((f)=>f.includes('api') || f.includes('service'))) {
                summary += "API or service functionality";
            } else if (mainFiles.some((f)=>f.includes('component') || f.includes('ui'))) {
                summary += "UI component behavior";
            } else {
                summary += "core functionality";
            }
        } else {
            summary += "system issues";
        }
        if (stats.deletions > stats.additions) {
            summary += " by removing problematic code";
        } else if (stats.additions > stats.deletions * 2) {
            summary += " with additional error handling and validation";
        } else {
            summary += " through code corrections";
        }
        if (fileCount > 5) {
            summary += ` across ${fileCount} files`;
        }
        return summary + ".";
    }
    generateFeatureSummary(commit) {
        const files = commit.files || [];
        const stats = commit.stats || {
            additions: 0,
            deletions: 0,
            total: 0
        };
        const mainFiles = files.slice(0, 3).map((f)=>f.filename);
        let summary = "New feature implementation ";
        if (mainFiles.some((f)=>f.includes('component') || f.includes('ui'))) {
            summary += "adding UI components and user interface elements";
        } else if (mainFiles.some((f)=>f.includes('api') || f.includes('route'))) {
            summary += "introducing new API endpoints and backend functionality";
        } else if (mainFiles.some((f)=>f.includes('service') || f.includes('util'))) {
            summary += "adding utility functions and service integrations";
        } else if (mainFiles.some((f)=>f.includes('config') || f.includes('env'))) {
            summary += "introducing configuration and environment setup";
        } else {
            summary += "expanding application capabilities";
        }
        if (stats.additions > 100) {
            summary += " with extensive code additions";
        } else if (stats.additions > 50) {
            summary += " with moderate code expansion";
        }
        return summary + ".";
    }
    generateRefactoringSummary(commit) {
        const files = commit.files || [];
        const stats = commit.stats || {
            additions: 0,
            deletions: 0,
            total: 0
        };
        let summary = "Code refactoring ";
        if (stats.deletions > stats.additions) {
            summary += "simplifying and cleaning up existing code";
        } else if (Math.abs(stats.additions - stats.deletions) < 20) {
            summary += "restructuring code for better organization";
        } else {
            summary += "improving code quality and maintainability";
        }
        if (files.length > 10) {
            summary += " across multiple modules";
        } else if (files.length > 5) {
            summary += " affecting several files";
        }
        return summary + ".";
    }
    generateDocumentationSummary(commit) {
        const files = commit.files || [];
        let summary = "Documentation update ";
        if (files.some((f)=>f.filename.toLowerCase().includes('readme'))) {
            summary += "improving project README and setup instructions";
        } else if (files.some((f)=>f.filename.includes('.md'))) {
            summary += "enhancing project documentation and guides";
        } else {
            summary += "adding code comments and inline documentation";
        }
        return summary + ".";
    }
    generateTestingSummary(commit) {
        const files = commit.files || [];
        const stats = commit.stats || {
            additions: 0,
            deletions: 0,
            total: 0
        };
        let summary = "Testing improvements ";
        if (stats.additions > stats.deletions * 2) {
            summary += "adding comprehensive test coverage";
        } else if (stats.deletions > stats.additions) {
            summary += "removing outdated tests and cleaning up test suite";
        } else {
            summary += "updating and enhancing existing tests";
        }
        const testTypes = [];
        if (files.some((f)=>f.filename.includes('unit'))) testTypes.push("unit tests");
        if (files.some((f)=>f.filename.includes('integration'))) testTypes.push("integration tests");
        if (files.some((f)=>f.filename.includes('e2e'))) testTypes.push("end-to-end tests");
        if (testTypes.length > 0) {
            summary += ` for ${testTypes.join(" and ")}`;
        }
        return summary + ".";
    }
    generateGenericSummary(commit) {
        const files = commit.files || [];
        const stats = commit.stats || {
            additions: 0,
            deletions: 0,
            total: 0
        };
        const message = commit.commit.message;
        let summary = "Code changes ";
        if (stats.additions > stats.deletions * 3) {
            summary += "introducing new functionality";
        } else if (stats.deletions > stats.additions * 2) {
            summary += "removing and cleaning up code";
        } else {
            summary += "modifying existing functionality";
        }
        // Try to extract meaningful information from commit message
        const firstLine = message.split('\n')[0];
        if (firstLine.length > 10 && firstLine.length < 100) {
            summary += ` - ${firstLine.toLowerCase()}`;
        }
        return summary + ".";
    }
    async generateCommitSummary(commits) {
        if (commits.length === 0) {
            throw new Error("No commits to analyze");
        }
        // Analyze each commit and categorize
        const categories = {
            bug_fixes: 0,
            features: 0,
            refactoring: 0,
            documentation: 0,
            testing: 0,
            other: 0
        };
        const keyChanges = [];
        let totalFilesModified = 0;
        let totalLinesAdded = 0;
        let totalLinesDeleted = 0;
        for (const commit of commits){
            const message = commit.commit.message.toLowerCase();
            const stats = commit.stats || {
                additions: 0,
                deletions: 0,
                total: 0
            };
            const files = commit.files || [];
            totalFilesModified += files.length;
            totalLinesAdded += stats.additions;
            totalLinesDeleted += stats.deletions;
            // Categorize commit
            if (message.includes("fix") || message.includes("bug") || message.includes("error")) {
                categories.bug_fixes++;
            } else if (message.includes("feat") || message.includes("add") || message.includes("new")) {
                categories.features++;
            } else if (message.includes("refactor") || message.includes("cleanup") || message.includes("reorganize")) {
                categories.refactoring++;
            } else if (message.includes("doc") || message.includes("readme") || message.includes("comment")) {
                categories.documentation++;
            } else if (message.includes("test") || message.includes("spec")) {
                categories.testing++;
            } else {
                categories.other++;
            }
            // Extract key changes from significant commits
            if (stats.total > 50 || files.length > 5) {
                const firstLine = commit.commit.message.split('\n')[0];
                if (firstLine.length > 10 && firstLine.length < 150) {
                    keyChanges.push(firstLine);
                }
            }
        }
        // Generate overall purpose
        let overallPurpose = "Recent development activity focused on ";
        const maxCategory = Object.entries(categories).reduce((a, b)=>categories[a[0]] > categories[b[0]] ? a : b);
        switch(maxCategory[0]){
            case "bug_fixes":
                overallPurpose += "fixing bugs and resolving issues";
                break;
            case "features":
                overallPurpose += "implementing new features and functionality";
                break;
            case "refactoring":
                overallPurpose += "code refactoring and organizational improvements";
                break;
            case "documentation":
                overallPurpose += "documentation updates and improvements";
                break;
            case "testing":
                overallPurpose += "testing enhancements and quality assurance";
                break;
            default:
                overallPurpose += "general code maintenance and improvements";
        }
        if (commits.length > 20) {
            overallPurpose += " across a large number of commits";
        } else if (commits.length > 10) {
            overallPurpose += " with consistent development progress";
        }
        overallPurpose += ".";
        const sortedDates = commits.map((c)=>c.commit.author.date).sort((a, b)=>new Date(a).getTime() - new Date(b).getTime());
        return {
            overall_purpose: overallPurpose,
            key_changes: keyChanges.slice(0, 10),
            categories,
            total_changes: {
                files_modified: totalFilesModified,
                lines_added: totalLinesAdded,
                lines_deleted: totalLinesDeleted
            },
            time_period: {
                first_commit_date: sortedDates[0],
                last_commit_date: sortedDates[sortedDates.length - 1]
            }
        };
    }
    async generateForkSummary(comparison, aheadCommits, behindCommits) {
        const { status, ahead_by, behind_by } = comparison;
        // Generate sync status
        let syncStatus = "";
        switch(status){
            case "identical":
                syncStatus = "Fork is perfectly synchronized with upstream repository";
                break;
            case "ahead":
                syncStatus = `Fork is ${ahead_by} commit${ahead_by !== 1 ? 's' : ''} ahead of upstream`;
                break;
            case "behind":
                syncStatus = `Fork is ${behind_by} commit${behind_by !== 1 ? 's' : ''} behind upstream`;
                break;
            case "diverged":
                syncStatus = `Fork has diverged with ${ahead_by} unique commits and missing ${behind_by} upstream commits`;
                break;
            default:
                syncStatus = "Unable to determine sync status";
        }
        // Generate recommendation
        let recommendation = "";
        if (status === "identical") {
            recommendation = "Fork is up to date. No action needed.";
        } else if (status === "ahead" && behind_by === 0) {
            recommendation = "Fork contains new changes that could be contributed back to upstream via pull request.";
        } else if (status === "behind" && ahead_by === 0) {
            recommendation = "Consider pulling latest changes from upstream to stay current.";
        } else if (status === "diverged") {
            recommendation = "Fork has diverged significantly. Consider rebasing or merging upstream changes, and evaluate which fork changes should be contributed back.";
        }
        // Analyze key differences
        const keyDifferences = [];
        const upstreamHighlights = [];
        const forkUniqueFeatures = [];
        // Analyze behind commits (missing from fork)
        behindCommits.slice(0, 5).forEach((commit)=>{
            const message = commit.commit.message.split('\n')[0];
            upstreamHighlights.push(message);
        });
        // Analyze ahead commits (unique to fork)
        aheadCommits.slice(0, 5).forEach((commit)=>{
            const message = commit.commit.message.split('\n')[0];
            forkUniqueFeatures.push(message);
        });
        // Generate general differences
        if (ahead_by > 0 && behind_by > 0) {
            keyDifferences.push(`Fork has ${ahead_by} unique commits and is missing ${behind_by} upstream commits`);
        }
        if (ahead_by > 10) {
            keyDifferences.push("Fork contains significant unique development work");
        }
        if (behind_by > 10) {
            keyDifferences.push("Fork is missing substantial upstream improvements");
        }
        return {
            sync_status: syncStatus,
            recommendation,
            key_differences: keyDifferences,
            upstream_highlights: upstreamHighlights,
            fork_unique_features: forkUniqueFeatures
        };
    }
}
}}),
"[project]/src/app/api/commits/analyze/route.ts [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "POST": (()=>POST)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/github/client.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$summarizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/ai/summarizer.ts [app-route] (ecmascript)");
;
;
;
async function POST(request) {
    try {
        const body = await request.json();
        const { repositoryUrl, commitCount, branch, githubToken } = body;
        if (!repositoryUrl) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Repository URL is required"
            }, {
                status: 400
            });
        }
        if (!commitCount || commitCount < 1 || commitCount > 100) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Commit count must be between 1 and 100"
            }, {
                status: 400
            });
        }
        // Parse the repository URL
        let owner, repo;
        try {
            ({ owner, repo } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["parseRepositoryUrl"])(repositoryUrl));
        } catch (error) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: "Invalid GitHub repository URL format"
            }, {
                status: 400
            });
        }
        // Initialize GitHub client and AI summarizer
        const github = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$github$2f$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["GitHubClient"](githubToken);
        const summarizer = new __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$ai$2f$summarizer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["CommitSummarizer"]();
        try {
            // Get repository information
            const repository = await github.getRepository(owner, repo);
            const targetBranch = branch || repository.default_branch;
            // Fetch commits
            const commits = await github.getCommits(owner, repo, {
                sha: targetBranch,
                per_page: commitCount
            });
            if (commits.length === 0) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "No commits found in the specified branch"
                }, {
                    status: 404
                });
            }
            // Get detailed information for each commit (including file changes)
            const detailedCommits = await Promise.all(commits.map(async (commit)=>{
                try {
                    return await github.getCommit(owner, repo, commit.sha);
                } catch (error) {
                    // If we can't get detailed info, return the basic commit
                    console.warn(`Failed to get detailed info for commit ${commit.sha}:`, error);
                    return commit;
                }
            }));
            // Analyze commits with AI
            const commitAnalyses = await Promise.all(detailedCommits.map(async (commit)=>{
                const aiSummary = await summarizer.analyzeCommit(commit);
                return {
                    sha: commit.sha,
                    message: commit.commit.message,
                    author: {
                        name: commit.commit.author.name,
                        email: commit.commit.author.email,
                        username: commit.author?.login
                    },
                    date: commit.commit.author.date,
                    stats: commit.stats || {
                        additions: 0,
                        deletions: 0,
                        total: 0
                    },
                    files_changed: (commit.files || []).map((file)=>({
                            filename: file.filename,
                            status: file.status,
                            additions: file.additions,
                            deletions: file.deletions
                        })),
                    ai_summary: aiSummary,
                    html_url: commit.html_url
                };
            }));
            // Generate overall summary
            const summary = await summarizer.generateCommitSummary(detailedCommits);
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                repository: {
                    full_name: repository.full_name,
                    html_url: repository.html_url,
                    default_branch: repository.default_branch
                },
                commits: commitAnalyses,
                summary,
                metadata: {
                    total_commits_analyzed: commitAnalyses.length,
                    analysis_date: new Date().toISOString(),
                    branch_analyzed: targetBranch
                }
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            if (errorMessage.includes('404')) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Repository not found or branch does not exist"
                }, {
                    status: 404
                });
            } else if (errorMessage.includes('403')) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Access denied. Repository may be private or rate limit exceeded"
                }, {
                    status: 403
                });
            } else if (errorMessage.includes('422')) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: "Invalid branch name or repository parameters"
                }, {
                    status: 422
                });
            } else {
                console.error('Commit analysis error:', error);
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    error: `Analysis failed: ${errorMessage}`
                }, {
                    status: 500
                });
            }
        }
    } catch (error) {
        console.error('Request processing error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Internal server error"
        }, {
            status: 500
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__598fd9e8._.js.map