# GitHub Commit Analyzer - Project Specification

**Version**: 0.1.0
**Last Updated**: 2025-10-09
**Status**: Production-Ready for Vercel Deployment

---

## Overview

A Next.js application that analyzes GitHub repository commits and compares forks using intelligent rule-based analysis. Built for deployment on Vercel with zero external dependencies and no API keys required.

## Tech Stack

### Framework & Runtime
- **Next.js**: 15.3.2 (App Router)
- **React**: 18.3.1
- **TypeScript**: 5.8.3
- **Node.js**: 20.x (recommended for Vercel)
- **Package Manager**: npm (standardized for Vercel compatibility)

### Build Tools
- **Turbopack**: Enabled for fast development (Next.js 15 feature)
- **Biome**: Modern linter/formatter (faster than ESLint)
- **TypeScript Compiler**: Strict mode enabled

### UI Framework
- **Tailwind CSS**: 3.4.17
- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Headless UI primitives
  - `@radix-ui/react-select`
  - `@radix-ui/react-separator`
  - `@radix-ui/react-slot`
  - `@radix-ui/react-tabs`
- **Lucide React**: Icon library
- **CVA**: `class-variance-authority` for component variants

### Architecture Patterns
- **App Router** (Next.js 15): Server components by default
- **API Routes**: RESTful endpoints in `/app/api/`
- **Server Components**: For static/cached content
- **Client Components**: Interactive UI with `'use client'` directive

---

## Project Structure

```
github-commit-analyzer/
├── src/
│   ├── app/
│   │   ├── page.tsx                   # Home page (Server Component)
│   │   ├── layout.tsx                 # Root layout
│   │   ├── globals.css                # Tailwind + custom styles
│   │   ├── ClientBody.tsx             # Client wrapper component
│   │   └── api/
│   │       ├── commits/
│   │       │   └── analyze/route.ts   # POST: Analyze commits
│   │       ├── forks/
│   │       │   └── compare/route.ts   # POST: Compare forks
│   │       └── repository/
│   │           └── validate/route.ts  # POST: Validate repo URL
│   ├── components/
│   │   ├── CommitAnalyzer.tsx         # Main commit analysis UI
│   │   ├── ForkComparison.tsx         # Fork comparison UI
│   │   └── ui/                        # shadcn/ui components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── input.tsx
│   │       ├── tabs.tsx
│   │       ├── select.tsx
│   │       ├── badge.tsx
│   │       ├── alert.tsx
│   │       ├── spinner.tsx
│   │       ├── separator.tsx
│   │       └── textarea.tsx
│   └── lib/
│       ├── utils.ts                   # Tailwind merge utilities
│       ├── github/
│       │   └── client.ts              # GitHub API client
│       └── ai/
│           └── summarizer.ts          # Rule-based analysis engine
├── public/                            # Static assets
├── .env.local                         # Local env vars (gitignored)
├── .gitignore                         # Comprehensive gitignore
├── package.json                       # Dependencies & scripts
├── next.config.js                     # Next.js configuration
├── tsconfig.json                      # TypeScript config
├── tailwind.config.ts                 # Tailwind configuration
├── components.json                    # shadcn/ui config
├── biome.json                         # Biome linter config
└── PROJECT_SPEC.md                    # This file
```

---

## Core Features

### 1. Commit Analysis
- **Endpoint**: `POST /api/commits/analyze`
- **Input**: Repository URL, optional GitHub token
- **Output**: Categorized commit analysis with themes, trajectory, and insights
- **Analysis Types**:
  - Bug fixes, features, refactoring, documentation, testing
  - Dominant themes (10 categories)
  - Technical focus areas (file patterns)
  - Project trajectory and momentum

### 2. Fork Comparison
- **Endpoint**: `POST /api/forks/compare`
- **Input**: Fork URL, upstream URL, branch, optional token
- **Output**: Sync status, recommendations, divergence analysis
- **Features**:
  - Ahead/behind commit analysis
  - Unique changes in each branch
  - Merge recommendations

### 3. Repository Validation
- **Endpoint**: `POST /api/repository/validate`
- **Input**: GitHub URL
- **Output**: Validation status, parsed owner/repo

---

## Vercel Deployment Configuration

### ✅ Vercel-Ready Features

1. **Auto-Detection**: Next.js 15 automatically detected
2. **Build Command**: `npm run build` (auto-configured)
3. **Output Directory**: `.next` (auto-configured)
4. **Node.js Version**: 20.x (Vercel default)
5. **Package Manager**: npm (via package-lock.json)

### Environment Variables

**Local Development** (`.env.local`):
```bash
PORT=3030  # Development port (optional)
```

**Vercel Dashboard** (Production):
```bash
# No environment variables required for base functionality
# Optional: GITHUB_TOKEN for higher rate limits (5000/hour vs 60/hour)
```

### Image Optimization

**Current**: Enabled (Vercel's default)
```javascript
// next.config.js
images: {
  remotePatterns: [
    { protocol: "https", hostname: "source.unsplash.com", pathname: "/**" },
    { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    { protocol: "https", hostname: "ext.same-assets.com", pathname: "/**" },
    { protocol: "https", hostname: "ugc.same-assets.com", pathname: "/**" }
  ]
}
```

**Note**: Vercel automatically optimizes images from these domains.

---

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install

# Start development server (Turbopack enabled)
npm run dev
# Accessible at http://localhost:3030 and http://0.0.0.0:3030

# Lint and type-check
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Start production server locally
npm start
```

### Scripts Explained

| Script | Command | Purpose |
|--------|---------|---------|
| `dev` | `next dev -H 0.0.0.0 -p 3030 --turbopack` | Dev server with Turbopack |
| `build` | `next build` | Production build |
| `start` | `next start -H 0.0.0.0` | Production server |
| `lint` | `bunx biome lint --write && bunx tsc --noEmit` | Lint + type-check |
| `format` | `bunx biome format --write` | Format code |

---

## GitHub API Integration

### Rate Limits
- **Unauthenticated**: 60 requests/hour
- **Authenticated**: 5000 requests/hour

### Optional Token Setup

Users can add a personal GitHub token to `.env.local`:

```bash
GITHUB_TOKEN=ghp_your_token_here
```

**Not required** - app works without authentication, just with lower rate limits.

---

## Analysis Engine: Rule-Based Intelligence

### How It Works

The "AI" is a sophisticated rule-based system:

1. **Keyword Matching**: Detects commit types from message patterns
2. **File Pattern Analysis**: Categorizes changes by file types
3. **Statistical Analysis**: Analyzes additions/deletions ratios
4. **Theme Detection**: Scores commits across 10 theme categories
5. **Trajectory Modeling**: Determines project direction and momentum

### Analysis Categories

**Commit Types**:
- Bug Fixes
- Features
- Refactoring
- Documentation
- Testing
- Other

**Theme Categories**:
- Performance & Optimization
- Security & Authentication
- User Experience
- API & Integration
- Testing & Quality
- Infrastructure & DevOps
- Data & Database
- Mobile & Cross-Platform
- Developer Experience
- Configuration & Setup

**Technical Focus Areas**:
- Frontend Components
- Backend APIs
- Database & Schema
- Testing Infrastructure
- Build & Tooling
- Styling & Design
- Documentation
- Type Definitions
- Mobile Development
- DevOps & Deployment

---

## Performance Characteristics

### Build Metrics (from successful build)

```
Route (app)                            Size     First Load JS
┌ ○ /                               44.6 kB         146 kB
├ ○ /_not-found                       977 B         102 kB
├ ƒ /api/commits/analyze              141 B         101 kB
├ ƒ /api/forks/compare                141 B         101 kB
└ ƒ /api/repository/validate          141 B         101 kB
+ First Load JS shared by all        101 kB
```

**Legend**:
- `○` Static: Pre-rendered
- `ƒ` Dynamic: Server-rendered on demand

### Optimization Features

- ✅ Server Components by default (reduced JavaScript)
- ✅ API routes optimized as serverless functions
- ✅ Turbopack for fast development rebuilds
- ✅ Image optimization via Vercel
- ✅ Automatic code splitting
- ✅ CSS optimization (Tailwind JIT)

---

## Deployment Checklist

### Pre-Deployment

- [x] TypeScript errors resolved (build passes)
- [x] ESLint errors resolved
- [x] .gitignore comprehensive (no secrets/build artifacts)
- [x] Environment variables documented
- [x] Package manager standardized (npm)
- [x] Build tested locally (`npm run build`)
- [x] Image optimization enabled
- [x] No hardcoded secrets in code

### Vercel Deployment Steps

1. **Connect Repository**
   - Import from GitHub/GitLab/Bitbucket
   - Vercel auto-detects Next.js

2. **Configure (Optional)**
   - Framework Preset: Next.js (auto-detected)
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

3. **Environment Variables** (if needed)
   - Add `GITHUB_TOKEN` for higher rate limits (optional)

4. **Deploy**
   - Click "Deploy"
   - Wait ~2-3 minutes for build
   - Visit generated URL

---

## Future Enhancements (Optional)

### AI Integration (User Self-Hosted)

Users can clone and add their own AI:

```typescript
// .env.local
OPENAI_API_KEY=sk-...
# or
ANTHROPIC_API_KEY=sk-ant-...
```

The system will automatically:
- Detect API keys
- Use AI when available
- Fallback to rule-based system on failure

**Benefits of Current Approach**:
- Zero cost for hosted version
- Privacy-first (no data sent to third parties)
- Fast (instant analysis)
- Reliable (no external dependencies)

### Docker Support (Planned)

Provide `Dockerfile` and `docker-compose.yml` for:
- Local containerized development
- Self-hosted deployments
- Reproducible builds

---

## Design Philosophy

### Goals

1. **Sleek**: Modern UI with Tailwind + shadcn/ui
2. **Slim**: Minimal dependencies, fast builds
3. **Performant**: Server components, optimized bundles
4. **Amazing UX**: Instant analysis, no waiting, clear insights

### Principles

- **Zero Config**: Works immediately on Vercel
- **Privacy First**: No external AI services by default
- **Developer Joy**: Fast dev server, TypeScript, clear errors
- **User Delight**: Instant feedback, beautiful UI, helpful insights

---

## Known Limitations & Trade-offs

### Limitations

1. **GitHub API Rate Limits**: 60 req/hour without token
2. **Analysis Depth**: Rule-based (not ML-powered by default)
3. **No Database**: Stateless analysis (no history storage)

### Why These Are Okay

1. **Rate Limits**: Reasonable for analysis tool, token optional for power users
2. **Rule-Based**: Surprisingly accurate, instant, free, private
3. **Stateless**: Simpler deployment, no data management needed

---

## Support & Resources

### Official Documentation
- [Next.js 15 Docs](https://nextjs.org/docs)
- [Vercel Platform](https://vercel.com/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com/docs)

### API References
- [GitHub REST API](https://docs.github.com/en/rest)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

## Maintenance

### Dependencies

**Update Strategy**: Conservative
- Major versions: Review breaking changes
- Minor versions: Safe to update
- Patch versions: Auto-update recommended

**Update Command**:
```bash
npm update  # Update within semver ranges
npm outdated  # Check for newer versions
```

### Security

**Automated Security**:
- Dependabot enabled (GitHub)
- npm audit on build
- Vercel security scanning

---

## License & Attribution

**License**: MIT (or as specified)

**Built With**:
- Next.js (Vercel)
- shadcn/ui (shadcn)
- Tailwind CSS (Tailwind Labs)
- Radix UI (WorkOS)

---

## Contact & Contribution

For issues, suggestions, or contributions:
- File an issue on GitHub
- Submit a pull request
- Reach out to maintainers

---

**End of Specification**
