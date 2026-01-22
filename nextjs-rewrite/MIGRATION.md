# Migration Guide: Vanilla JS to Next.js

This document outlines the migration from the original vanilla JavaScript Gas Town GUI to the Next.js rewrite.

## Overview

The Next.js rewrite maintains all functionality of the original while modernizing the architecture, adding type safety, and improving developer experience.

## Architecture Changes

### Frontend

**Before (Vanilla JS):**
- Manual DOM manipulation
- Custom pub-sub state management
- Separate CSS files
- Direct HTML templates in JS strings

**After (Next.js/React):**
- React component-based UI
- React Context for state management
- Tailwind CSS with utility classes
- JSX for templating

### Backend

**Before (Express):**
- Standalone Express server (`server.js`)
- WebSocket server on same port
- Static file serving

**After (Next.js API Routes):**
- Next.js API routes (`src/app/api/`)
- WebSocket via custom integration
- Built-in static asset handling

### State Management

**Before:**
```javascript
// js/state.js
const store = { status: null, convoys: [], agents: [] };
function notify(key) { /* ... */ }
```

**After:**
```typescript
// src/contexts/app-state-context.tsx
const AppStateContext = createContext<AppStateContextType | null>(null);
function appStateReducer(state: AppState, action: Action): AppState { /* ... */ }
```

## Component Migration

### Example: Dashboard

**Before (`js/components/dashboard.js`):**
```javascript
export function renderDashboard(container) {
  container.innerHTML = `
    <div class="dashboard">
      <div class="metric-card">...</div>
    </div>
  `;
}
```

**After (`src/app/page.tsx`):**
```typescript
export default function DashboardPage() {
  return (
    <MainLayout>
      <Card>...</Card>
    </MainLayout>
  );
}
```

### Example: API Client

**Before (`js/api.js`):**
```javascript
export const api = {
  getStatus() {
    return fetch('/api/status').then(r => r.json());
  }
};
```

**After (`src/lib/api-client.ts`):**
```typescript
class APIClient {
  async getStatus(): Promise<StatusResponse> {
    return this.get<StatusResponse>('/api/status');
  }
}
```

## Type Definitions

All data structures now have TypeScript types in `src/types/`:

```typescript
// src/types/agent.ts
export interface Agent {
  name: string;
  role: 'coordinator' | 'worker' | 'monitor' | 'merger' | 'health-check';
  running: boolean;
  has_work?: boolean;
  hook?: string;
}
```

## Styling Migration

### CSS Variables

**Before (`css/variables.css`):**
```css
:root {
  --color-primary: #a855f7;
  --color-background: #0f172a;
}
```

**After (`src/app/globals.css`):**
```css
:root {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  --primary: 210 40% 98%;
}
```

### Component Styles

**Before:**
```css
/* css/components.css */
.metric-card {
  padding: 1rem;
  border: 1px solid var(--color-border);
}
```

**After:**
```tsx
<Card className="p-4 border">
  {/* Tailwind utility classes */}
</Card>
```

## API Route Migration

### Example: Status Endpoint

**Before (`server.js`):**
```javascript
app.get('/api/status', async (req, res) => {
  try {
    const output = await execGT(['status', '--json', '--fast']);
    res.json(JSON.parse(output));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

**After (`src/app/api/status/route.ts`):**
```typescript
export async function GET(request: NextRequest) {
  try {
    const status = await getCachedOrExecute<StatusResponse>(
      'status',
      async () => {
        const result = await execGTJSON(['status', '--json', '--fast']);
        return { ...result, timestamp: new Date().toISOString() };
      },
      CACHE_TTL.status
    );
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to get status' },
      { status: 500 }
    );
  }
}
```

## Running Both Versions

You can run both versions simultaneously on different ports:

**Original (Vanilla JS):**
```bash
cd /path/to/gastown-gui
npm start  # Runs on port 7667
```

**Next.js Rewrite:**
```bash
cd /path/to/gastown-gui/nextjs-rewrite
npm run dev  # Runs on port 3000
```

## Migration Checklist

If migrating your own customizations:

- [ ] Identify custom components in `js/components/`
- [ ] Create equivalent React components in `src/components/`
- [ ] Migrate CSS styles to Tailwind classes
- [ ] Add TypeScript types for custom data structures
- [ ] Migrate custom API endpoints to Next.js API routes
- [ ] Update state management to use React Context
- [ ] Test all functionality in new version
- [ ] Update documentation

## Breaking Changes

### 1. No Direct DOM Access
React manages the DOM. Use refs for direct access:
```typescript
const ref = useRef<HTMLDivElement>(null);
<div ref={ref}>...</div>
```

### 2. Different Routing
Use Next.js file-based routing instead of manual route handling.

### 3. State Updates Are Asynchronous
React state updates are batched. Use callbacks for sequential updates.

### 4. CSS Class Names
Tailwind uses utility classes. Custom classes need migration.

## Performance Improvements

1. **Code Splitting**: Next.js automatically splits bundles
2. **Tree Shaking**: Unused code is removed
3. **Image Optimization**: Built-in with `next/image`
4. **Caching**: API routes use smart caching strategies
5. **Type Safety**: TypeScript catches errors at build time

## Debugging

### Enable Verbose Logging

```typescript
// src/lib/cli-wrapper.ts
console.log('[CLI]', command, args);
```

### React DevTools
Install React DevTools browser extension to inspect component tree.

### TypeScript Errors
Check `tsconfig.json` and ensure all types are properly defined.

## Common Issues

### Issue: "Module not found"
**Solution:** Check import paths use `@/` alias correctly

### Issue: "Type 'X' is not assignable to type 'Y'"
**Solution:** Check type definitions in `src/types/`

### Issue: "API route not working"
**Solution:** Ensure `gt` CLI is in PATH and `GT_ROOT` is set

## Getting Help

- Check existing issues in the repository
- Review the original implementation for reference
- Read Next.js documentation: https://nextjs.org/docs
- Check shadcn/ui docs: https://ui.shadcn.com/

## Contributing

When contributing to the Next.js rewrite:

1. Follow TypeScript strict mode conventions
2. Use existing shadcn/ui components
3. Add types for all new data structures
4. Write descriptive commit messages
5. Test across all views before submitting PR
