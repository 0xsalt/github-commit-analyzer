# GitHub Commit Analyzer

Analyze GitHub repository commits and compare forks with an intuitive web interface.

## Features

- **Commit Analysis**: Deep dive into repository commit history with detailed statistics
- **Fork Comparison**: Compare commits between original repository and forks

---

## Quick Start (Docker - Recommended)

The fastest way to run this application is using the pre-compiled Docker image:

```bash
# Clone the repository
git clone https://github.com/0xsalt/github-commit-analyzer.git
cd github-commit-analyzer

# Pull and run the pre-compiled image
docker compose pull && docker compose up -d

# Access at http://localhost:3030
```

That's it! The application is now running.

### View Logs
```bash
docker compose logs -f
```

### Stop the Application
```bash
docker compose down
```

---

## Alternative: Local Development

If you want to run the application locally for development:

### Prerequisites
- Node.js 20+
- npm or bun

### Installation
```bash
# Clone the repository
git clone https://github.com/0xsalt/github-commit-analyzer.git
cd github-commit-analyzer

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3030](http://localhost:3030) with your browser.

---

## Configuration

### Environment Variables (Optional)

Create a `.env.local` file for optional configuration:

```bash
# Increase GitHub API rate limits (optional but recommended)
GITHUB_TOKEN=your_github_personal_access_token
```

**GitHub Token Benefits:**
- Without token: 60 requests/hour
- With token: 5000 requests/hour

Get a token at: https://github.com/settings/tokens

---

## Deployment Options

### Option 1: Docker (Recommended)

See [DOCKER.md](./DOCKER.md) for detailed Docker deployment instructions.

**Benefits:**
- Pre-compiled image (no build required)
- Instant deployment
- Consistent environment
- Easy updates

### Option 2: Vercel

Deploy directly to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/0xsalt/github-commit-analyzer)

Or manually:
```bash
npm install -g vercel
vercel
```

Read [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## Documentation

- [DOCKER.md](./DOCKER.md) - Complete Docker deployment guide
- [UPDATE_WORKFLOW.md](./UPDATE_WORKFLOW.md) - Developer update and publishing workflow
- [PROJECT_SPEC.md](./PROJECT_SPEC.md) - Project specifications and architecture

---

## Technology Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Theme**: next-themes for dark mode
- **Runtime**: Node.js 20 (Alpine Linux in Docker)

---

## Development

### Project Structure
```
├── src/
│   ├── app/              # Next.js App Router pages and API routes
│   ├── components/       # React components
│   │   ├── ui/          # shadcn/ui components
│   │   └── theme-*.tsx  # Theme provider and toggle
│   └── lib/             # Utility functions
├── public/              # Static assets
├── Dockerfile           # Docker build configuration
├── docker-compose.yaml  # Docker Compose configuration
└── UPDATE_WORKFLOW.md   # Developer workflow documentation
```

### Available Scripts

```bash
npm run dev      # Start development server (http://localhost:3030)
npm run build    # Build production bundle
npm start        # Start production server
npm run lint     # Run ESLint
```

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Support

For issues, questions, or contributions, please open an issue on GitHub.
