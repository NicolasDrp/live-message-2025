const assetVersion = 1;
const assetCacheKey = 'assets-v' + assetVersion;
const assetList = [
    '/'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(assetCacheKey).then(cache => {
            return cache.addAll(assetList);
        })
    )
});

self.addEventListener('fetch', e => {
    e.respondWith(fetch(e));
});

const fetch = async (e) => {
    let response = await caches.match(e.request);
    if (response) {
        return response;
    }

    return fetch(e.request);
}
