# News Reader Frontend

A modern, responsive React application for discovering and reading news articles with advanced search, filtering, and caching capabilities.

## Features

- ✅ **Modern UI** - Built with React 18 and Tailwind CSS
- ✅ **Fast Performance** - TanStack Query for data fetching and caching
- ✅ **Search Functionality** - Debounced search with real-time results
- ✅ **Category Filtering** - 7 news categories to explore
- ✅ **Responsive Design** - Works seamlessly on mobile, tablet, and desktop
- ✅ **Error Handling** - Comprehensive error boundaries and error states
- ✅ **Loading States** - Skeleton loaders for better UX
- ✅ **Accessibility** - ARIA labels and keyboard navigation support
- ✅ **Optimized Images** - Lazy loading with fallbacks
- ✅ **Type Safety** - Full TypeScript support

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:5000`

## Installation

1. Navigate to the frontend directory:

```bash
cd frontend
npm install
```

2. Create a `.env.local` file based on `.env.example`:

```bash
cp .env.example .env.local
```

3. Update `.env.local` if needed (default is fine for local development):

```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development

```bash
npm run dev
```

The application will start on `http://localhost:5173`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── news/            # News-related components
│   │   ├── filters/         # Filter components
│   │   └── layout/          # Layout components
│   ├── hooks/               # Custom React hooks
│   ├── services/            # API services
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # React entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── index.html               # HTML entry point
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts           # Vite configuration
└── package.json
```

## Components

### Common Components

- **Header** - Navigation header with branding
- **LoadingSpinner** - Animated loading indicator
- **ErrorMessage** - Error display with retry option
- **ErrorBoundary** - React error boundary for crash handling

### News Components

- **NewsCard** - Individual article card
- **NewsGrid** - Grid layout for articles
- **NewsSkeleton** - Loading skeleton for cards
- **EmptyState** - No results message
- **SearchResultsHeader** - Search metadata display

### Filter Components

- **SearchBar** - Debounced search input
- **CategoryFilter** - Category selection pills

### Layout Components

- **Layout** - Main page layout wrapper
- **Navigation** - Header navigation

## Hooks

### useNews()
Fetch top headlines with optional category filter.

```typescript
const { data, isLoading, error } = useNews(category, page);
```

### useNewsSearch()
Search for news articles by query.

```typescript
const { data, isLoading, error } = useNewsSearch(query, page);
```

### useSearch()
Combined search hook with debouncing.

```typescript
const { searchInput, handleSearch, clearSearch, data } = useSearch();
```

### useDebounce()
Generic debounce hook.

```typescript
const debouncedValue = useDebounce(value, delay);
```

## API Integration

The frontend communicates with the backend API at `http://localhost:5000`.

### Endpoints Used

- `GET /api/news/top-headlines` - Fetch top headlines
- `GET /api/news/search?q=query` - Search articles
- `GET /api/news/categories/:category` - Fetch by category
- `GET /api/health` - Health check

## Styling

The project uses **Tailwind CSS** for styling with:
- Utility-first approach
- Responsive design (mobile-first)
- Dark mode ready
- Custom animations and utilities

### Key Classes

- `line-clamp-1`, `line-clamp-2`, `line-clamp-3` - Text truncation
- `animate-slide-in` - Slide animation
- Custom scrollbar styling
- Focus visible states for accessibility

## Performance Optimizations

1. **Code Splitting** - Routes and components are code-split by default with Vite
2. **Image Optimization** - Lazy loading with fallback images
3. **Caching** - TanStack Query caches responses (5min articles, 10min search, 15min categories)
4. **Debouncing** - Search input debounced to 300ms to reduce API calls
5. **Memoization** - Components memoized where appropriate

## Accessibility Features

- ✅ Semantic HTML (`<article>`, `<header>`, `<main>`)
- ✅ ARIA labels on buttons and interactive elements
- ✅ Keyboard navigation support
- ✅ Focus visible indicators
- ✅ Color contrast compliance
- ✅ Reduced motion support
- ✅ Error messages linked to form fields

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | http://localhost:5000 | Backend API URL |

## Troubleshooting

### API Connection Error

1. Ensure backend is running: `npm run dev` in `backend/` directory
2. Check `VITE_API_URL` in `.env.local`
3. Verify API is accessible at the configured URL

### Slow Performance

1. Clear browser cache (Cmd+Shift+Delete)
2. Check network tab in DevTools
3. Verify backend Redis is running

### Build Issues

```bash
# Clear dependencies
rm -rf node_modules
npm install

# Clear cache
npm run build
```

## Development Workflow

1. Make changes to components/hooks/services
2. Changes auto-reload with Vite HMR
3. Check console for errors
4. Test responsiveness with DevTools device toolbar
5. Build and test production build

## Testing

Consider adding tests with:
- **Vitest** - Unit tests
- **React Testing Library** - Component tests
- **Cypress** - E2E tests

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari 12+

## License

MIT
