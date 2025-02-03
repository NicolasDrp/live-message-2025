class NetworkObserver {
    private bannerElement = document.getElementById("offline-status");

    init(): void {
        this.bindEvents();
    }

    private bindEvents(): void {
        window.addEventListener('online', () => {
            this.bannerElement.classList.add('hidden');
        });

        window.addEventListener('offline', () => {
            this.bannerElement.classList.remove('hidden');
        });
    }
}

export const networkObserver = new NetworkObserver();
