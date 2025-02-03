const assetVersion = 1;
const assetCacheKey = 'assets-v' + assetVersion;
const assetList = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/webfonts/fa-solid-900.woff2',
    '/',
    'manifest.json',
    'index.js',
    'index.css',
    'logo.svg',
    'http://localhost:4000/messages'
];

self.addEventListener('install', e => {
    e.waitUntil(install(e));
});

self.addEventListener('fetch', e => {
    e.respondWith(fetch(e));
});


const install = async e => {
    caches.open(assetCacheKey).then(cache => {
        return cache.addAll(assetList);
    })
}

const fetch = async e => {
    if (!e.request) {
        return;
    }

    const isDataRequest = e.request.url.startsWith('http://localhost:4000');

    let response = await caches.match(e.request);
     if (response) {
         if (isDataRequest) {
             return fetch(e.request).catch(() => response);
         } else {
             return response;
         }
    }

    return fetch(e.request);
}
