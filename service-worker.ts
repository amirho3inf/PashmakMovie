const CACHE_NAME = 'pashmak-movie-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Main app logic
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  // Services
  '/services/api.ts',
  '/services/config.ts',
  '/services/favorites.ts',
  '/services/recentlyWatched.ts',
  // Components
  '/components/BottomNavBar.tsx',
  '/components/BrowseView.tsx',
  '/components/CountryCard.tsx',
  '/components/CountryRow.tsx',
  '/components/DetailView.tsx',
  '/components/FavoritesView.tsx',
  '/components/FilterBar.tsx',
  '/components/FilterModal.tsx',
  '/components/GenreCard.tsx',
  '/components/GenreRow.tsx',
  '/components/HomeView.tsx',
  '/components/icons.tsx',
  '/components/Loader.tsx',
  '/components/OpenWithModal.tsx',
  '/components/PosterCard.tsx',
  '/components/PosterRow.tsx',
  '/components/SearchView.tsx',
  '/components/Sidebar.tsx',
  '/components/VideoPlayer.tsx',
  // Hooks
  '/hooks/useMediaQuery.ts',
  // Contexts
  '/contexts/ScrollContainerContext.ts',
  // PWA files
  '/manifest.json',
  '/public/favicon.svg'
];

// Use `self` to refer to the service worker scope
// FIX: The type 'ServiceWorkerGlobalScope' is not available in the current TypeScript context. Changed the type assertion to 'any' to resolve the "Cannot find name 'ServiceWorkerGlobalScope'" error.
const sw: any = self;

sw.addEventListener('install', (event: any) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

sw.addEventListener('fetch', (event: any) => {
  const url = new URL(event.request.url);

  // Always fetch API requests from the network and don't cache them
  if (url.hostname === 'corsproxy.io' || url.hostname === 'raw.githubusercontent.com') {
    event.respondWith(fetch(event.request));
    return;
  }
  
  // For other requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, cache, and return
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(err => {
            console.error('Fetch failed; returning offline page instead.', err);
            // Optional: return a fallback offline page
            // return caches.match('/offline.html');
            return new Response('Network error occurred', { status: 408, headers: { 'Content-Type': 'text/plain' } });
        });
      })
  );
});

sw.addEventListener('activate', (event: any) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});