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
     * @param {String} url 
     * @param {Object} params 
     * @returns {Object}
     */
    async getRaw(url, params = {}) {
        let response = await axios.get(url, {
            params,
            withCredentials: true,
            headers: {
                'Cookie': this.cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
            },
            maxRedirects: 0
        }).catch(async error => {
            if (error.response.status == 301) {
                this.cookies = error.response.headers.get('Set-Cookie');
                return await this.getRaw(url, params);
            }
        });
        return response;
    }

    /**
     * @param {String} url 
     * @param {Object} params 
     * @returns {Object}
     */
    async get(method, params = {}) {
        let requestData = this.token.getMethodUrl(method);
        let paramsFiltered = { ...requestData.query, ...params, format: 'json' };
        Object.keys(paramsFiltered).forEach((k) => paramsFiltered[k] == null && delete paramsFiltered[k]);
        let response = (await this.getRaw(requestData.url, { ...requestData.query, ...params, format: 'json' }))?.data;
        if (!response?.message)
            return null;
        return response;
    }

    /**
     * @param {String} url 
     * @param {Object} params 
     * @param {Object} data
     * @returns {Object}
     */
    async postRaw(url, params = {}, data = {}) {
        let response = await axios.post(url, JSON.stringify(data), {
            params,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Cookie': this.cookies,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36'
            },
            maxRedirects: 0
        }).catch(async error => {
            if (error.response.status == 301) {
                this.cookies = error.response.headers.get('Set-Cookie');
                return await this.postRaw(url, params, data);
            }
        });
        return response;
    }

    /**
     * @param {String} url 
     * @param {Object} params 
     * @param {Object} data
     * @returns {Object}
     */
    async post(method, params = {}, data = {}) {
        for (let param in params)
            params[param] = encodeURIComponent(params[param]);
            console.log(params);
        let requestData = this.token.getMethodUrl(method);
        let paramsFiltered = { ...requestData.query, ...params, format: 'json' };
        Object.keys(paramsFiltered).forEach((k) => paramsFiltered[k] == null && delete paramsFiltered[k]);
        let response = (await this.postRaw(requestData.url, paramsFiltered, data))?.data;
        if (!response?.message)
            return null;
        return response;
    }
}

module.exports = { MusixmatchRequestManager };