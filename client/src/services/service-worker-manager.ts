class ServiceWorkerManager {
    private registration: ServiceWorkerRegistration;

    register(): void {
        navigator.serviceWorker.register('service-worker.js').then(registration => {
            this.registration = registration
        });
    }

    getRegistration(): ServiceWorkerRegistration {
        return this.registration;
    }
}

export const serviceWorkerManager = new ServiceWorkerManager();
