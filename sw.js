const CACHE_NAME = 'music-v3';
const AUDIO_FILES = [
  'assets/audio/jatuh-suka.mp3',
  'assets/audio/interaksi.mp3',
  'assets/audio/The 1975 - About You (Official).mp3',
  'assets/audio/Oasis - Wonderwall (Lyrics).mp3',
  'assets/audio/Oasis - Stand By Me (Official Lyric Video).mp3'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(AUDIO_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('.mp3')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        return cached || fetch(e.request).then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(e.request, response.clone());
            return response;
          });
        });
      })
    );
  }
});
