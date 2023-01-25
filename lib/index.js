const { Track } = require('./model');
const { ApiContext, MusixmatchToken } = require('./types');
const { MusixmatchRequestManager } = require('./util/request');

class MusixmatchClient {
    /**
     * Create a new Musixmatch client.
     * @param {string} token 
     * @param {('desktop'|'ios')} apiContext 
     */
    constructor(token, apiContext) {
        if (apiContext instanceof ApiContext)
            this.token = new MusixmatchToken(token, apiContext);
        else
            this.token = new MusixmatchToken(token, new ApiContext(apiContext));
        this.request = new MusixmatchRequestManager(this.token);
    }

    /**
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
}

module.exports = MusixmatchClient;