const { default: axios } = require('axios');
const { MusixmatchToken } = require('../types');

class MusixmatchRequestManager {
    /**
     * Create a new request manager.
     * @param {MusixmatchToken} token 
     */
    constructor(token) {
        this.token = token;
        this.cookies = '';
    }

    /**
     * @param {string} url 
     * @param {object} params 
     * @returns {object}
     */
    async getRaw(url, params) {
        let response = await axios.get(url, {
            params,
            withCredentials: true,
            headers: {
                'Cookie': this.cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
            },
            maxRedirects: 0
        }).catch(async error => {
            this.cookies = error.response.headers.get('Set-Cookie');
            return await this.getRaw(url, params).catch(() => { return { data: '' } });
        });
        return response;
    }

    /**
     * @param {string} url 
     * @param {object} params 
     * @returns {object}
     */
    async get(method, params) {
        let data = this.token.getMethodUrl(method);
        return (await this.getRaw(data.url, { ...data.query, ...params, format: 'json' })).data;
    }
}

module.exports = { MusixmatchRequestManager };