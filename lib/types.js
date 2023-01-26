const { MusixmatchRequestManager } = require('./util/request');

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
     * @param {String} method
     * @returns {{ url: String, query: Object }} Formatted URL
     */
    getMethodUrl(method) {
        return { url: `${this.baseUrl}${method}`, query: { app_id: this.clientId } };
    }
}

class MusixmatchToken {
    /**
     * Create a new MusixmatchToken from existing token and context, or generate a new one.
     * @param {String} token 
     * @param {ApiContext} apiContext 
     */
    constructor(token, apiContext) {
        this.token = token;
        this.context = apiContext;
    }

    /**
     * Generate a URL to access a method with the given API context and token.
     * @param {String} method
     * @returns {{ url: String, query: Object }} Formatted URL
     */
    getMethodUrl(method) {
        let methodUrl = this.context.getMethodUrl(method);
        methodUrl.query.usertoken = this.token;
        return methodUrl;
    }

    /**
     * Generate a new token.
     * @param {'desktop'|'ios'|ApiContext} context 
     * @returns {Promise<{ user_token: String, app_config: Object, location: Object }>}
     */
    static async generate(context) {
        if (context instanceof String)
            context = new ApiContext(context);
        let response = await new MusixmatchRequestManager(new MusixmatchToken(undefined, context)).get('token.get', {});
        return response.message.body;
    }
}

module.exports = { ApiContext, MusixmatchToken };