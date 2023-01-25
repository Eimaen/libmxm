class ApiContext {
    /**
     * Create a new API context.
     * @param {('desktop'|'ios')} client 
     */
    constructor(client) {
        switch (client) {
            case 'desktop':
                this.baseUrl = 'https://apic-desktop.musixmatch.com/ws/1.1/';
                this.clientId = 'web-desktop-app-v1.0';
                break;
            case 'ios':
                this.baseUrl = 'https://apic.musixmatch.com/ws/1.1/';
                this.clientId = 'mac-ios-v2.0';
                break;
        }
    }

    /**
     * Generate a URL to access a method with the given API context.
     * @param {string} method
     * @returns {{ url: string, query: object }} Formatted URL
     */
    getMethodUrl(method) {
        return { url: `${this.baseUrl}${method}`, query: { app_id: this.clientId } };
    }
}

class MusixmatchToken {
    /**
     * Create a new MusixmatchToken from existing token and context, or generate a new one.
     * @param {string} token 
     * @param {ApiContext} apiContext 
     */
    constructor(token, apiContext) {
        this.token = token;
        this.context = apiContext;
    }

    /**
     * Generate a URL to access a method with the given API context and token.
     * @param {string} method
     * @returns {{ url: string, query: object }} Formatted URL
     */
    getMethodUrl(method) {
        let methodUrl = this.context.getMethodUrl(method);
        methodUrl.query.usertoken = this.token;
        return methodUrl;
    }
}

module.exports = { ApiContext, MusixmatchToken };