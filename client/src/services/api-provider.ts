class ApiProvider {
    private readonly url: string = "http://localhost:4000";

    fetch(endpoint: string, options?: RequestInit) {
        const url = this.url + endpoint;

        return fetch(url, options)
            .then(response => response.json())
        ;
    }
}

export const apiProvider = new ApiProvider();
