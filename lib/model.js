const MusixmatchClient = require('.');

class Track {
    /**
     * @param {object} raw
     */
    constructor(raw) {
        if (!raw) return;

        /** @type {Number} */ this.track_id = raw.track_id;
        /** @type {String} */ this.track_mbid = raw.track_mbid;
        /** @type {String} */ this.track_isrc = raw.track_isrc;
        /** @type {String[]} */ this.commontrack_isrcs = raw.commontrack_isrcs;
        /** @type {String} */ this.track_spotify_id = raw.track_spotify_id;
        /** @type {String[]} */ this.commontrack_spotify_ids = raw.commontrack_spotify_ids;
        /** @type {Number} */ this.track_soundcloud_id = raw.track_soundcloud_id;
        /** @type {String} */ this.track_xboxmusic_id = raw.track_xboxmusic_id;
        /** @type {String} */ this.track_name = raw.track_name;
        /** @type {Number[]} */ this.track_name_translation_list = raw.track_name_translation_list;
        /** @type {Number} */ this.track_rating = raw.track_rating;
        /** @type {Number} */ this.track_length = raw.track_length;
        /** @type {Number} */ this.commontrack_id = raw.commontrack_id;
        /** @type {Boolean} */ this.instrumental = raw.instrumental;
        /** @type {Boolean} */ this.explicit = raw.explicit;
        /** @type {Boolean} */ this.has_lyrics = raw.has_lyrics;
        /** @type {Boolean} */ this.has_lyrics_crowd = raw.has_lyrics_crowd;
        /** @type {Boolean} */ this.has_subtitles = raw.has_subtitles;
        /** @type {Boolean} */ this.has_richsync = raw.has_richsync;
        /** @type {Boolean} */ this.has_track_structure = raw.has_track_structure;
        /** @type {Number} */ this.num_favourite = raw.num_favourite;
        /** @type {Number} */ this.lyrics_id = raw.lyrics_id;
        /** @type {Number} */ this.subtitle_id = raw.subtitle_id;
        /** @type {Number} */ this.album_id = raw.album_id;
        /** @type {String} */ this.album_name = raw.album_name;
        /** @type {Number} */ this.artist_id = raw.artist_id;
        /** @type {String} */ this.artist_mbid = raw.artist_mbid;
        /** @type {String} */ this.artist_name = raw.artist_name;
        /** @type {String} */ this.album_coverart_100x100 = raw.album_coverart_100x100;
        /** @type {String} */ this.album_coverart_350x350 = raw.album_coverart_350x350;
        /** @type {String} */ this.album_coverart_500x500 = raw.album_coverart_500x500;
        /** @type {String} */ this.album_coverart_800x800 = raw.album_coverart_800x800;
        /** @type {String} */ this.track_share_url = raw.track_share_url;
        /** @type {String} */ this.track_edit_url = raw.track_edit_url;
        /** @type {String} */ this.commontrack_vanity_id = raw.commontrack_vanity_id;
        /** @type {Boolean} */ this.restricted = raw.restricted;
        /** @type {Date} */ this.first_release_date = raw.first_release_date;
        /** @type {Date} */ this.updated_time = raw.updated_time;
        /** @type {{ music_genre_list: { music_genre: Genre }[] }} */ this.primary_genres = raw.primary_genres;
        /** @type {{ music_genre_list: { music_genre: Genre }[] }} */ this.secondary_genres = raw.secondary_genres;

        this.primary_genres.music_genre_list = this.primary_genres.music_genre_list.map(g => ({ music_genre: new Genre(g.music_genre) }));
        this.secondary_genres.music_genre_list = this.secondary_genres.music_genre_list.map(g => ({ music_genre: new Genre(g.music_genre) }));
    }

    /**
     * Bind an instance to the client.
     * @param {MusixmatchClient} client 
     */
    bind(client) {
        /** @type {MusixmatchClient} */
        this.client = client;
    }

    /**
     * Fetch lyrics for track.
     * @returns {Promise<Lyrics>}
     */
    async fetchLyrics() {
        let response = await this.client.request.get('track.lyrics.get', {
            track_id: this.track_id,
            part: 'user,lyrics_verified_by'
        });
        return response?.message?.body?.lyrics ? new Lyrics(response.message.body.lyrics) : null;
    }

    /**
     * Fetch lyrics snippet for track.
     * @returns {Promise<Snippet>}
     */
    async fetchSnippet() {
        let response = await this.client.request.get('track.snippet.get', {
            track_id: this.track_id
        });
        return response?.message?.body?.snippet ? new Snippet(response.message.body.snippet) : null;
    }

    /**
     * Fetch lyrics syncronization for track.
     * @param {('lrc'|'dfxp'|'stledu'|'mxm')} format Lyrics format.
     * @returns {Promise<Subtitle>}
     */
    async fetchSubtitles(format = 'mxm') {
        let response = await this.client.request.get('track.subtitle.get', {
            track_id: this.track_id,
            subtitle_format: format
        });
        return response?.message?.body?.subtitle ? new Subtitle(response.message.body.subtitle) : null;
    }

    /**
     * Fetch richsync for track.
     * @returns {Promise<String>}
     */
    async fetchRichsync() {
        let response = await this.client.request.get('track.richsync.get', {
            track_id: this.track_id
        });
        return response?.message?.body ?? null;
    }

    /**
     * Fetch line translations for track.
     * @param {String} language
     * @returns {(Promise<Translation[]>|null)}
     */
    async fetchTranslations(language) {
        let response = await this.client.request.get('crowd.track.translations.get', {
            track_id: this.track_id,
            selected_language: language
        });
        return response?.message?.body?.translations_list?.map(t => new Translation(t.translation)) ?? null;
    }

    /**
     * Submit lyrics for a track
     * @param {String} lyrics
     * @returns {Boolean} 
     */
    async submitLyrics(lyrics, num_keypressed = undefined, time_spent = undefined) {
        let response = await this.client.request.post('track.lyrics.post', {
            commontrack_id: this.commontrack_id,
            q_track: this.track_name,
            q_artist: this.artist_name,
            trusted_user_validation: 0,
            num_keypressed: num_keypressed,
            time_spent: time_spent,
            length: this.track_length,
            sync_tool_version: '3.0',
            original_uri: this.track_spotify_id
        }, {
            lyrics_body: lyrics
        });
        return response?.message?.header?.status_code == 200;
    }
}

class Genre {
    /**
     * @param {object} raw
     */
    constructor(raw) {
        if (!raw) return;

        /** @type {Number} */ this.music_genre_id = raw.music_genre_id;
        /** @type {Number} */ this.music_genre_parent_id = raw.music_genre_parent_id;
        /** @type {String} */ this.music_genre_name = raw.music_genre_name;
        /** @type {String} */ this.music_genre_name_extended = raw.music_genre_name_extended;
        /** @type {String} */ this.music_genre_vanity = raw.music_genre_vanity;
    }
}

class Lyrics {
    /**
     * @param {object} raw
     */
    constructor(raw) {
        if (!raw) return;

        /** @type {Number} */ this.lyrics_id = raw.lyrics_id;
        /** @type {Boolean} */ this.can_edit = raw.can_edit;
        /** @type {Boolean} */ this.locked = raw.locked;
        /** @type {Number} */ this.published_status = raw.published_status;
        /** @type {String} */ this.action_requested = raw.action_requested;
        /** @type {Boolean} */ this.verified = raw.verified;
        /** @type {Boolean} */ this.restricted = raw.restricted;
        /** @type {Boolean} */ this.instrumental = raw.instrumental;
        /** @type {Boolean} */ this.explicit = raw.explicit;
        /** @type {String} */ this.lyrics_body = raw.lyrics_body;
        /** @type {String} */ this.lyrics_language = raw.lyrics_language;
        /** @type {String} */ this.lyrics_language_description = raw.lyrics_language_description;
        /** @type {String} */ this.script_tracking_url = raw.script_tracking_url;
        /** @type {String} */ this.pixel_tracking_url = raw.pixel_tracking_url;
        /** @type {String} */ this.html_tracking_url = raw.html_tracking_url;
        /** @type {String} */ this.lyrics_copyright = raw.lyrics_copyright;
        /** @type {Object[]} */ this.writer_list = raw.writer_list;
        /** @type {Object[]} */ this.publisher_list = raw.publisher_list;
        /** @type {String} */ this.backlink_url = raw.backlink_url;
        /** @type {String} */ this.updated_time = raw.updated_time;
        /** @type {{ user: User }} */ this.lyrics_user = { user: new User(raw.lyrics_user.user) };
    }
}

class User {
    /**
     * @param {object} raw
     */
    constructor(raw) {
        if (!raw) return;

        /** @type {String} */ this.uaid = raw.uaid;
        /** @type {Boolean} */ this.is_mine = raw.is_mine;
        /** @type {String} */ this.user_name = raw.user_name;
        /** @type {String} */ this.user_profile_photo = raw.user_profile_photo;
        /** @type {Boolean} */ this.has_private_profile = raw.has_private_profile;
        /** @type {Number} */ this.score = raw.score;
        /** @type {Number} */ this.position = raw.position;
        /** @type {Number} */ this.weekly_score = raw.weekly_score;
        /** @type {String} */ this.level = raw.level;
        /** @type {String} */ this.key = raw.key;
        /** @type {Number} */ this.rank_level = raw.rank_level;
        /** @type {Number} */ this.points_to_next_level = raw.points_to_next_level;
        /** @type {Number} */ this.ratio_to_next_level = raw.ratio_to_next_level;
        /** @type {String} */ this.rank_name = raw.rank_name;
        /** @type {String} */ this.next_rank_name = raw.next_rank_name;
        /** @type {Number} */ this.ratio_to_next_rank = raw.ratio_to_next_rank;
        /** @type {String} */ this.rank_color = raw.rank_color;
        /** @type {Object} */ this.rank_colors = raw.rank_colors;
        /** @type {String} */ this.rank_image_url = raw.rank_image_url;
        /** @type {String} */ this.next_rank_color = raw.next_rank_color;
        /** @type {Object} */ this.next_rank_colors = raw.next_rank_colors;
        /** @type {String} */ this.next_rank_image_url = raw.next_rank_image_url;
        /** @type {Object} */ this.counters = raw.counters;
        /** @type {Boolean} */ this.moderator = raw.moderator;
        /** @type {Number} */ this.artist_manager = raw.artist_manager;
        /** @type {Boolean} */ this.academy_completed = raw.academy_completed;
    }
}

class Snippet {
    /**
     * @param {object} raw
     */
    constructor(raw) {
        if (!raw) return;

        /** @type {Number} */ this.snippet_id = raw.snippet_id;
        /** @type {String} */ this.snippet_language = raw.snippet_language;
        /** @type {Boolean} */ this.restricted = raw.restricted;
        /** @type {Boolean} */ this.instrumental = raw.instrumental;
        /** @type {String} */ this.snippet_body = raw.snippet_body;
        /** @type {String} */ this.script_tracking_url = raw.script_tracking_url;
        /** @type {String} */ this.pixel_tracking_url = raw.pixel_tracking_url;
        /** @type {String} */ this.html_tracking_url = raw.html_tracking_url;
        /** @type {String} */ this.updated_time = raw.updated_time;
    }
}

class Subtitle {
    /**
     * @param {object} raw
     */
    constructor(raw) {
        if (!raw) return;

        /** @type {Number} */ this.subtitle_id = raw.subtitle_id;
        /** @type {Number} */ this.restricted = raw.restricted;
        /** @type {Number} */ this.published_status = raw.published_status;
        /** @type {String} */ this.subtitle_body = raw.subtitle_body;
        /** @type {Number} */ this.subtitle_avg_count = raw.subtitle_avg_count;
        /** @type {String} */ this.lyrics_copyright = raw.lyrics_copyright;
        /** @type {Number} */ this.subtitle_length = raw.subtitle_length;
        /** @type {String} */ this.subtitle_language = raw.subtitle_language;
        /** @type {String} */ this.subtitle_language_description = raw.subtitle_language_description;
        /** @type {String} */ this.script_tracking_url = raw.script_tracking_url;
        /** @type {String} */ this.pixel_tracking_url = raw.pixel_tracking_url;
        /** @type {String} */ this.html_tracking_url = raw.html_tracking_url;
        /** @type {Object[]} */ this.writer_list = raw.writer_list;
        /** @type {Object[]} */ this.publisher_list = raw.publisher_list;
        /** @type {String} */ this.updated_time = raw.updated_time;

        try { this.subtitle_body = JSON.parse(this.subtitle_body); } catch { }
    }
}

class Translation {
    /**
     * @param {object} raw
     */
    constructor(raw) {
        if (!raw) return;

        /** @type {String} */ this.type_id = raw.type_id;
        /** @type {Number} */ this.artist_id = raw.artist_id;
        /** @type {String} */ this.language_from = raw.language_from;
        /** @type {String} */ this.app_id = raw.app_id;
        /** @type {String} */ this.description = raw.description;
        /** @type {Number} */ this.num_keypressed = raw.num_keypressed;
        /** @type {String} */ this.snippet = raw.snippet;
        /** @type {String} */ this.selected_language = raw.selected_language;
        /** @type {Number} */ this.position = raw.position;
        /** @type {String} */ this.language = raw.language;
        /** @type {Boolean} */ this.wantkey = raw.wantkey;
        /** @type {Boolean} */ this._validated = raw._validated;
        /** @type {Number} */ this.create_timestamp = raw.create_timestamp;
        /** @type {Number} */ this.type_id_weight = raw.type_id_weight;
        /** @type {Number} */ this.effectiveness = raw.effectiveness;
        /** @type {Number} */ this.days_in_chart = raw.days_in_chart;
        /** @type {String} */ this.last_updated = raw.last_updated;
        /** @type {String} */ this.key = raw.key;
        /** @type {Number} */ this.published_status_macro = raw.published_status_macro;
        /** @type {String} */ this.matched_line = raw.matched_line;
        /** @type {String} */ this.subtitle_matched_line = raw.subtitle_matched_line;
        /** @type {Number} */ this.confidence = raw.confidence;
        /** @type {Number} */ this.image_id = raw.image_id;
        /** @type {Number} */ this.video_id = raw.video_id;
        /** @type {Number} */ this.lyrics_id = raw.lyrics_id;
        /** @type {Number} */ this.subtitle_id = raw.subtitle_id;
        /** @type {String} */ this.created_date = raw.created_date;
        /** @type {Number} */ this.commontrack_id = raw.commontrack_id;
        /** @type {Boolean} */ this.is_expired = raw.is_expired;
        /** @type {String} */ this.group_key = raw.group_key;
        /** @type {Boolean} */ this.can_translate = raw.can_translate;
        /** @type {Boolean} */ this.can_delete = raw.can_delete;
        /** @type {Boolean} */ this.is_mine = raw.is_mine;
        /** @type {Boolean} */ this.can_approve = raw.can_approve;
    }
}

module.exports = { Track, Genre, Lyrics, User, Snippet, Subtitle };