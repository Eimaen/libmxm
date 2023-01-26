const { Track } = require('./model');
const { ApiContext, MusixmatchToken } = require('./types');
const { MusixmatchRequestManager } = require('./util/request');

class MusixmatchClient {
    /**
     * Create a new Musixmatch client.
     * @param {string} token Musixmatch token for the given API context.
     * @param {('desktop'|'ios')} apiContext API context to operate in.
     */
    constructor(token, apiContext = new ApiContext('desktop')) {
        if (token === '')
            this.token = new MusixmatchToken(this.generateToken())
        if (apiContext instanceof ApiContext)
            this.token = new MusixmatchToken(token, apiContext);
        else
            this.token = new MusixmatchToken(token, new ApiContext(apiContext));

        this.request = new MusixmatchRequestManager(this.token);
    }

    /**
     * Find a track.
     * @param {{ query: String, lyrics: string, artist: string, trackTitle: string, album: string, hasLyrics: boolean, hasSubtitle: boolean, language: string }} 
     * @returns { Promise<Track[]> }
     */
    async trackSearch({ query, lyrics, artist, trackTitle, album, hasLyrics, hasSubtitle, language }) {
        let response = await this.request.get('track.search', {
            q: query,
            q_lyrics: lyrics,
            q_artist: artist,
            q_track: trackTitle,
            q_album: album,
            f_has_lyrics: hasLyrics,
            f_has_subtitle: hasSubtitle,
            f_lyrics_language: language
        });
        return response.message.body.track_list.map(track => { let t = new Track(track.track); t.bind(this); return t; });
    }

    /**
     * Make an explicit request to the API method. 
     * @param {String} method 
     * @param {Object} params 
     * @returns {Object}
     */
    async makeRequest(method, params) {
        return await this.request.get(method, params);
    }
}

module.exports = MusixmatchClient;