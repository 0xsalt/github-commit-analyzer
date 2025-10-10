import type { GitHubCommit } from '../github/client';

export interface CommitAnalysis {
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

export interface CommitSummary {
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

export interface ForkSummary {
  sync_status: string;
  recommendation: string;
  key_differences: string[];
  upstream_highlights: string[];
  fork_unique_features: string[];
}

export class CommitSummarizer {
  async analyzeCommit(commit: GitHubCommit): Promise<string> {
    // For now, we'll create a rule-based summary
    // This can be replaced with actual AI/LLM integration later
    const message = commit.commit.message.toLowerCase();
    const files = commit.files || [];
    const stats = commit.stats || { additions: 0, deletions: 0, total: 0 };

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

  private generateBugFixSummary(commit: GitHubCommit): string {
    const files = commit.files || [];
    const stats = commit.stats || { additions: 0, deletions: 0, total: 0 };
    
    const mainFiles = files.slice(0, 3).map(f => f.filename);
    const fileCount = files.length;
    
    let summary = "Bug fix addressing ";
    
    if (mainFiles.length > 0) {
      if (mainFiles.some(f => f.includes('.test.') || f.includes('.spec.'))) {
        summary += "test-related issues";
      } else if (mainFiles.some(f => f.includes('api') || f.includes('service'))) {
        summary += "API or service functionality";
      } else if (mainFiles.some(f => f.includes('component') || f.includes('ui'))) {
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

  private generateFeatureSummary(commit: GitHubCommit): string {
    const files = commit.files || [];
    const stats = commit.stats || { additions: 0, deletions: 0, total: 0 };
    
    const mainFiles = files.slice(0, 3).map(f => f.filename);
    
    let summary = "New feature implementation ";
    
    if (mainFiles.some(f => f.includes('component') || f.includes('ui'))) {
      summary += "adding UI components and user interface elements";
    } else if (mainFiles.some(f => f.includes('api') || f.includes('route'))) {
      summary += "introducing new API endpoints and backend functionality";
    } else if (mainFiles.some(f => f.includes('service') || f.includes('util'))) {
      summary += "adding utility functions and service integrations";
    } else if (mainFiles.some(f => f.includes('config') || f.includes('env'))) {
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

  private generateRefactoringSummary(commit: GitHubCommit): string {
    const files = commit.files || [];
    const stats = commit.stats || { additions: 0, deletions: 0, total: 0 };
    
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

  private generateDocumentationSummary(commit: GitHubCommit): string {
    const files = commit.files || [];
    
    let summary = "Documentation update ";
    
    if (files.some(f => f.filename.toLowerCase().includes('readme'))) {
      summary += "improving project README and setup instructions";
    } else if (files.some(f => f.filename.includes('.md'))) {
      summary += "enhancing project documentation and guides";
    } else {
      summary += "adding code comments and inline documentation";
    }
    
    return summary + ".";
  }

  private generateTestingSummary(commit: GitHubCommit): string {
    const files = commit.files || [];
    const stats = commit.stats || { additions: 0, deletions: 0, total: 0 };
    
    let summary = "Testing improvements ";
    
    if (stats.additions > stats.deletions * 2) {
      summary += "adding comprehensive test coverage";
    } else if (stats.deletions > stats.additions) {
      summary += "removing outdated tests and cleaning up test suite";
    } else {
      summary += "updating and enhancing existing tests";
    }
    
    const testTypes = [];
    if (files.some(f => f.filename.includes('unit'))) testTypes.push("unit tests");
    if (files.some(f => f.filename.includes('integration'))) testTypes.push("integration tests");
    if (files.some(f => f.filename.includes('e2e'))) testTypes.push("end-to-end tests");
    
    if (testTypes.length > 0) {
      summary += ` for ${testTypes.join(" and ")}`;
    }
    
    return summary + ".";
  }

  private generateGenericSummary(commit: GitHubCommit): string {
    const files = commit.files || [];
    const stats = commit.stats || { additions: 0, deletions: 0, total: 0 };
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

  async generateCommitSummary(commits: GitHubCommit[]): Promise<CommitSummary> {
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
      other: 0,
    };

    const keyChanges: string[] = [];
    let totalFilesModified = 0;
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;

    for (const commit of commits) {
      const message = commit.commit.message.toLowerCase();
      const stats = commit.stats || { additions: 0, deletions: 0, total: 0 };
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
    const maxCategory = Object.entries(categories).reduce((a, b) => 
      categories[a[0] as keyof typeof categories] > categories[b[0] as keyof typeof categories] ? a : b
    );

    switch (maxCategory[0]) {
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

    const sortedDates = commits
      .map(c => c.commit.author.date)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

    // Analyze themes and patterns
    const themeAnalysis = this.analyzeThemes(commits);
    const trajectoryAnalysis = this.analyzeTrajectory(commits, categories);

    return {
      overall_purpose: overallPurpose,
      key_changes: keyChanges.slice(0, 10), // Limit to top 10 key changes
      categories,
      total_changes: {
        files_modified: totalFilesModified,
        lines_added: totalLinesAdded,
        lines_deleted: totalLinesDeleted,
      },
      time_period: {
        first_commit_date: sortedDates[0],
        last_commit_date: sortedDates[sortedDates.length - 1],
      },
      themes: themeAnalysis,
      trajectory: trajectoryAnalysis,
    };
  }

  async generateForkSummary(
    comparison: { status: string; ahead_by: number; behind_by: number },
    aheadCommits: GitHubCommit[],
    behindCommits: GitHubCommit[]
  ): Promise<ForkSummary> {
    const { status, ahead_by, behind_by } = comparison;

    // Generate sync status
    let syncStatus = "";
    switch (status) {
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
    const keyDifferences: string[] = [];
    const upstreamHighlights: string[] = [];
    const forkUniqueFeatures: string[] = [];

    // Analyze behind commits (missing from fork)
    behindCommits.slice(0, 5).forEach(commit => {
      const message = commit.commit.message.split('\n')[0];
      upstreamHighlights.push(message);
    });

    // Analyze ahead commits (unique to fork)
    aheadCommits.slice(0, 5).forEach(commit => {
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
      fork_unique_features: forkUniqueFeatures,
    };
  }

  private analyzeThemes(commits: GitHubCommit[]): {
    big_picture_summary: string;
    dominant_themes: string[];
    technical_focus_areas: string[];
  } {
    // Collect all commit messages and file patterns
    const allMessages = commits.map(c => c.commit.message.toLowerCase()).join(' ');
    const allFiles = commits.flatMap(c => (c.files || []).map(f => f.filename.toLowerCase()));
    
    // Identify dominant themes based on commit patterns
    const themeKeywords = {
      'Performance & Optimization': ['performance', 'optimize', 'speed', 'fast', 'cache', 'memory', 'efficient'],
      'Security & Authentication': ['security', 'auth', 'permission', 'secure', 'vulnerability', 'jwt', 'oauth'],
      'User Experience': ['ui', 'ux', 'interface', 'user', 'design', 'accessibility', 'responsive'],
      'API & Integration': ['api', 'endpoint', 'integration', 'webhook', 'service', 'client'],
      'Testing & Quality': ['test', 'testing', 'spec', 'coverage', 'quality', 'lint', 'format'],
      'Infrastructure & DevOps': ['deploy', 'build', 'ci', 'cd', 'docker', 'kubernetes', 'infrastructure'],
      'Data & Database': ['database', 'sql', 'migration', 'schema', 'data', 'query'],
      'Mobile & Cross-Platform': ['mobile', 'ios', 'android', 'react-native', 'cross-platform'],
      'Developer Experience': ['dx', 'developer', 'tooling', 'debug', 'logging', 'error'],
      'Configuration & Setup': ['config', 'setup', 'environment', 'settings', 'install'],
    };

    const themeScores: { [key: string]: number } = {};
    
    for (const [theme, keywords] of Object.entries(themeKeywords)) {
      let score = 0;
      for (const keyword of keywords) {
        // Count occurrences in commit messages
        const messageMatches = (allMessages.match(new RegExp(keyword, 'g')) || []).length;
        // Count occurrences in file paths
        const fileMatches = allFiles.filter(f => f.includes(keyword)).length;
        score += messageMatches * 2 + fileMatches; // Weight messages higher
      }
      themeScores[theme] = score;
    }

    // Get top themes
    const sortedThemes = Object.entries(themeScores)
      .filter(([_, score]) => score > 0)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5)
      .map(([theme]) => theme);

    // Analyze technical focus areas based on file types and patterns
    const technicalAreas = this.identifyTechnicalFocusAreas(allFiles, commits);

    // Generate big picture summary
    let bigPictureSummary = "Development is primarily focused on ";
    if (sortedThemes.length > 0) {
      if (sortedThemes.length === 1) {
        bigPictureSummary += `${sortedThemes[0].toLowerCase()}`;
      } else if (sortedThemes.length === 2) {
        bigPictureSummary += `${sortedThemes[0].toLowerCase()} and ${sortedThemes[1].toLowerCase()}`;
      } else {
        const lastTheme = sortedThemes.pop();
        bigPictureSummary += `${sortedThemes.map(t => t.toLowerCase()).join(', ')}, and ${lastTheme?.toLowerCase()}`;
      }
    } else {
      bigPictureSummary += "general code maintenance and improvements";
    }
    
    // Add context based on commit volume and changes
    const avgChangesPerCommit = commits.length > 0 ? 
      commits.reduce((sum, c) => sum + ((c.stats?.total) || 0), 0) / commits.length : 0;
    
    if (avgChangesPerCommit > 100) {
      bigPictureSummary += " with significant code changes and substantial feature development";
    } else if (avgChangesPerCommit > 50) {
      bigPictureSummary += " with moderate development activity and incremental improvements";
    } else {
      bigPictureSummary += " with focused, targeted improvements and refinements";
    }
    
    bigPictureSummary += ".";

    return {
      big_picture_summary: bigPictureSummary,
      dominant_themes: sortedThemes.slice(0, 4),
      technical_focus_areas: technicalAreas,
    };
  }

  private identifyTechnicalFocusAreas(files: string[], commits: GitHubCommit[]): string[] {
    const areas: { [key: string]: number } = {};
    
    // Analyze file patterns
    const patterns = {
      'Frontend Components': ['.tsx', '.jsx', 'component', 'ui/', '/components/'],
      'Backend APIs': ['/api/', 'route.ts', 'controller', 'service.ts'],
      'Database & Schema': ['migration', 'schema', '.sql', 'database', 'prisma'],
      'Testing Infrastructure': ['.test.', '.spec.', '__tests__/', 'cypress', 'jest'],
      'Build & Tooling': ['webpack', 'vite', 'build', 'config', 'package.json'],
      'Styling & Design': ['.css', '.scss', 'tailwind', 'style', 'theme'],
      'Documentation': ['.md', 'readme', 'docs/', 'documentation'],
      'Type Definitions': ['.d.ts', 'types/', 'interfaces/'],
      'Mobile Development': ['ios/', 'android/', 'mobile/', 'react-native'],
      'DevOps & Deployment': ['dockerfile', '.yml', '.yaml', 'deploy', 'ci/'],
    };

    for (const [area, patterns_list] of Object.entries(patterns)) {
      let score = 0;
      for (const pattern of patterns_list) {
        score += files.filter(f => f.includes(pattern.toLowerCase())).length;
      }
      if (score > 0) {
        areas[area] = score;
      }
    }

    return Object.entries(areas)
      .sort(([_, a], [__, b]) => b - a)
      .slice(0, 5)
      .map(([area]) => area);
  }

  private analyzeTrajectory(commits: GitHubCommit[], categories: {
    bug_fixes: number;
    features: number;
    refactoring: number;
    documentation: number;
    testing: number;
    other: number;
  }): {
    project_direction: string;
    development_momentum: string;
    upcoming_priorities: string[];
    architectural_evolution: string;
  } {
    const recentCommits = commits.slice(0, Math.min(5, commits.length));
    const allMessages = commits.map(c => c.commit.message.toLowerCase()).join(' ');
    
    // Analyze project direction based on recent commit patterns
    let projectDirection = "";
    
    if (categories.features > categories.bug_fixes) {
      projectDirection = "The project is in an active feature development phase, ";
      if (recentCommits.some(c => c.commit.message.toLowerCase().includes('major'))) {
        projectDirection += "working towards a major release with significant new capabilities";
      } else {
        projectDirection += "continuously expanding functionality and user-facing features";
      }
    } else if (categories.bug_fixes > categories.features * 2) {
      projectDirection = "The project is in a stabilization phase, ";
      projectDirection += "focusing on reliability, bug resolution, and code quality improvements";
    } else if (categories.refactoring > 0 || allMessages.includes('refactor')) {
      projectDirection = "The project is undergoing architectural improvements, ";
      projectDirection += "modernizing codebase structure and enhancing maintainability";
    } else {
      projectDirection = "The project maintains steady development momentum, ";
      projectDirection += "balancing new features with maintenance and improvements";
    }
    projectDirection += ".";

    // Analyze development momentum
    const totalChanges = commits.reduce((sum, c) => sum + ((c.stats?.total) || 0), 0);
    const avgChangesPerCommit = commits.length > 0 ? totalChanges / commits.length : 0;
    
    let momentum = "";
    if (avgChangesPerCommit > 100) {
      momentum = "High-velocity development with substantial code changes per commit, indicating rapid feature development or major architectural work";
    } else if (avgChangesPerCommit > 50) {
      momentum = "Steady development pace with meaningful progress on features and improvements";
    } else if (avgChangesPerCommit > 20) {
      momentum = "Measured development approach with focused, incremental changes";
    } else {
      momentum = "Careful, targeted development with small, precise modifications";
    }

    // Identify upcoming priorities based on recent commit patterns
    const priorities: string[] = [];
    
    if (recentCommits.some(c => c.commit.message.toLowerCase().includes('performance'))) {
      priorities.push("Performance optimization and speed improvements");
    }
    if (recentCommits.some(c => c.commit.message.toLowerCase().includes('security'))) {
      priorities.push("Security enhancements and vulnerability fixes");
    }
    if (recentCommits.some(c => c.commit.message.toLowerCase().includes('test'))) {
      priorities.push("Test coverage and quality assurance");
    }
    if (recentCommits.some(c => c.commit.message.toLowerCase().includes('ui') || c.commit.message.toLowerCase().includes('ux'))) {
      priorities.push("User interface and experience improvements");
    }
    if (recentCommits.some(c => c.commit.message.toLowerCase().includes('api'))) {
      priorities.push("API development and integration work");
    }
    if (recentCommits.some(c => c.commit.message.toLowerCase().includes('doc'))) {
      priorities.push("Documentation and developer experience");
    }
    
    // If no specific priorities detected, infer from categories
    if (priorities.length === 0) {
      if (categories.features > 0) priorities.push("Feature development and functionality expansion");
      if (categories.bug_fixes > 0) priorities.push("Bug resolution and stability improvements");
      if (categories.testing > 0) priorities.push("Quality assurance and testing");
    }

    // Analyze architectural evolution
    const architecturalKeywords = ['migrate', 'upgrade', 'refactor', 'modernize', 'restructure', 'architecture'];
    const hasArchitecturalWork = architecturalKeywords.some(keyword => 
      allMessages.includes(keyword)
    );
    
    let architecturalEvolution = "";
    if (hasArchitecturalWork) {
      if (allMessages.includes('migrate') || allMessages.includes('upgrade')) {
        architecturalEvolution = "Active migration and modernization efforts are underway to upgrade dependencies and architectural patterns";
      } else if (allMessages.includes('refactor') || allMessages.includes('restructure')) {
        architecturalEvolution = "Ongoing refactoring initiatives to improve code organization and architectural clarity";
      } else {
        architecturalEvolution = "Architectural considerations are being addressed through systematic improvements";
      }
    } else {
      if (categories.features > categories.bug_fixes) {
        architecturalEvolution = "Architecture is evolving organically through feature development and iterative improvements";
      } else {
        architecturalEvolution = "Architecture appears stable with focus on refinement and optimization rather than major structural changes";
      }
    }

    return {
      project_direction: projectDirection,
      development_momentum: momentum,
      upcoming_priorities: priorities.slice(0, 4),
      architectural_evolution: architecturalEvolution,
    };
  }
}