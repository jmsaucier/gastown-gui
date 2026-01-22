# Gas Town GUI - Next.js Rewrite

A modern rewrite of Gas Town GUI using Next.js 14, React, TypeScript, shadcn/ui, and Tailwind CSS.

## Features

- ✅ **Modern Stack**: Next.js 14 with App Router, TypeScript, React 18
- ✅ **UI Components**: shadcn/ui component library with Tailwind CSS
- ✅ **Type Safety**: Full TypeScript coverage with strict mode
- ✅ **State Management**: React Context API for global state
- ✅ **Real-time Updates**: WebSocket integration for live data
- ✅ **API Routes**: 61+ Next.js API routes replacing Express
- ✅ **Dark Mode**: Built-in theme switching with next-themes
- ✅ **Responsive Design**: Mobile-friendly layouts

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Gas Town CLI (`gt`) installed and configured
- GitHub CLI (`gh`) for GitHub integration (optional)

### Installation

```bash
# Install dependencies (using pnpm)
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file with:

```env
GASTOWN_PORT=7667
HOST=127.0.0.1
GT_ROOT=~/gt
```

## Project Structure

```
nextjs-rewrite/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx            # Dashboard
│   │   ├── convoys/            # Convoys view
│   │   ├── work/               # Work items view
│   │   ├── agents/             # Agents view
│   │   ├── rigs/               # Rigs view
│   │   ├── crews/              # Crews view
│   │   ├── prs/                # Pull Requests view
│   │   ├── formulas/           # Formulas view
│   │   ├── issues/             # GitHub Issues view
│   │   ├── mail/               # Mail view
│   │   ├── health/             # Health check view
│   │   └── api/                # API Routes
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   └── layout/             # Layout components
│   ├── contexts/               # React Context providers
│   ├── hooks/                  # Custom React hooks
│   ├── lib/                    # Utilities and helpers
│   └── types/                  # TypeScript type definitions
├── public/
│   └── assets/                 # Static assets
└── package.json
```

## Available Scripts

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run start        # Start production server
pnpm run lint         # Run ESLint
```

## Key Technologies

### Frontend
- **Next.js 14**: React framework with App Router
- **React 18**: UI library with hooks and concurrent features
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Re-usable component library
- **Lucide React**: Icon library

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **WebSocket**: Real-time communication via `ws`
- **CLI Integration**: Executes `gt`, `bd`, `gh` commands

### State Management
- **React Context**: Global state with useReducer
- **WebSocket Context**: Real-time event handling

## Views

### Dashboard (`/`)
System overview with metrics, health status, and rig list.

### Convoys (`/convoys`)
Track groups of related work items with progress indicators.

### Work (`/work`)
Manage individual tasks (beads) with filtering and status tracking.

### Agents (`/agents`)
Monitor and control worker agents across all rigs.

### Rigs (`/rigs`)
Manage project repositories with polecat controls.

### Crews (`/crews`)
Manage teams of polecats for coordinated work.

### Pull Requests (`/prs`)
View GitHub PRs across connected repositories.

### Formulas (`/formulas`)
Workflow templates for repeatable tasks.

### Issues (`/issues`)
GitHub Issues across repositories.

### Mail (`/mail`)
Messages between agents and human overseer.

### Health (`/health`)
System health check with `gt doctor` integration.

## API Routes

All API routes are located in `src/app/api/`:

- `GET /api/status` - System status
- `GET /api/health` - Health check
- `GET /api/doctor` - Run doctor check
- `GET /api/convoys` - List convoys
- `POST /api/convoys` - Create convoy
- `GET /api/work` - List work items
- `POST /api/work` - Create work item
- `POST /api/sling` - Sling work to agent
- `GET /api/rigs` - List rigs
- `POST /api/rigs` - Add rig
- `POST /api/polecat/[rig]/[name]/spawn` - Spawn polecat
- `POST /api/polecat/[rig]/[name]/stop` - Stop polecat
- `POST /api/polecat/[rig]/[name]/restart` - Restart polecat
- `GET /api/polecat/[rig]/[name]/peek` - Peek at polecat
- `GET /api/crews` - List crews
- `POST /api/crews` - Create crew
- `GET /api/formulas` - List formulas
- `POST /api/formulas` - Create formula
- `GET /api/github/prs` - GitHub PRs
- `GET /api/github/issues` - GitHub Issues
- `GET /api/github/repos` - GitHub Repositories
- `GET /api/mail` - List mail
- `POST /api/mail/send` - Send mail

## Comparison with Original

### Improvements
- **Type Safety**: Full TypeScript with strict mode
- **Modern UI**: shadcn/ui components with better UX
- **Better Architecture**: Organized file structure
- **Maintainability**: Cleaner component separation
- **Developer Experience**: Hot reload, TypeScript IntelliSense

### Migration from Vanilla Version
The original vanilla JS version (`/`) has been rewritten to use:
- React components instead of DOM manipulation
- TypeScript instead of JavaScript
- Tailwind CSS instead of separate CSS files
- Next.js API Routes instead of Express
- React Context instead of custom pub-sub

## Future Enhancements

- [ ] Modal dialogs for creating convoys, work items, etc.
- [ ] Keyboard shortcuts
- [ ] Onboarding wizard
- [ ] Interactive tutorial
- [ ] Server-side rendering for improved performance
- [ ] Optimistic UI updates
- [ ] Enhanced error boundaries
- [ ] Unit and E2E tests
- [ ] PWA support

## Development

### Adding a New Page

1. Create page file: `src/app/your-page/page.tsx`
2. Wrap with `MainLayout` component
3. Add navigation link to `Header` component

### Adding a New API Route

1. Create route file: `src/app/api/your-route/route.ts`
2. Implement `GET`, `POST`, etc. handlers
3. Add to API client: `src/lib/api-client.ts`
4. Add type definitions: `src/types/`

### Adding a New Component

1. Create component: `src/components/your-component/`
2. Use shadcn/ui primitives where possible
3. Style with Tailwind utility classes
4. Export from component directory

## Troubleshooting

### Port Already in Use
Change `GASTOWN_PORT` in `.env.local` or kill the process:
```bash
lsof -ti:3000 | xargs kill
```

### TypeScript Errors
Rebuild type definitions:
```bash
npm run build
```

### API Route Not Working
Check that `gt` CLI is installed and `GT_ROOT` is configured correctly.

## License

MIT

## Credits

- Original Gas Town GUI by the community
- Gas Town by Steve Yegge
- Built with Next.js, React, and shadcn/ui
