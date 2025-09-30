// frontend/src/service-worker.js (আপডেট করা কোড)

const CACHE_NAME = 'my-ecommerce-cache-v1'; // একটি ভার্সন নম্বর দিন
const urlsToCache = [
  '/',
  '/index.html',
  // আপনার অন্যান্য গুরুত্বপূর্ণ ফাইল এখানে যোগ করতে পারেন
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // নতুন সার্ভিস ওয়ার্কারকে দ্রুত فعال করুন
});

// ✅ নতুন কোড: পুরোনো ক্যাশ পরিষ্কার করার জন্য
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // যদি ক্যাশের নাম নতুন নামের সাথে না মেলে, তবে পুরোনো ক্যাশ ডিলিট করে দাও
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim(); // সকল ক্লায়েন্টকে নিয়ন্ত্রণ করুন
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});