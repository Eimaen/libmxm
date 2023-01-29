const { MusixmatchClient, Track } = require('.');
const { test, describe, expect } = require('@jest/globals');

const client = new MusixmatchClient(process.env.MUSIXMATCH_TOKEN, 'desktop');

describe('Track search', () => {
    test('Find track (query)', async () => {
        let tracks = await client.trackSearch({ query: 'Kobaryo - Bookmaker' });
        expect(tracks.length).toBeGreaterThanOrEqual(0);
    });
    test('Find track (trackTitle, artist)', async () => {
        let tracks = await client.trackSearch({ trackTitle: 'Bookmaker', artist: 'Kobaryo' });
        expect(tracks.length).toBeGreaterThanOrEqual(0);
    });
    test('Find track (lyrics)', async () => {
        let tracks = await client.trackSearch({ lyrics: 'It\'s just a shot away' });
        expect(tracks.length).toBeGreaterThanOrEqual(0);
    });
    test('Find track (non-existent track)', async () => {
        let tracks = await client.trackSearch({ artist: 'THIS1ARTIST3DOES3NOT7EXIST', trackTitle: 'THIS1TRACK3DOES3NOT7EXIST' });
        expect(tracks).toHaveLength(0);
    });
    test('Find track (empty arguments)', async () => {
        await client.trackSearch({});
    });
});

describe('Track information (稲葉曇 - Lost Umbrella)', () => {
    const track = new Track();
    track.bind(client);
    track.track_id = 247979107;

    test('Fetch track lyrics', async () => {
        let trackLyrics = await track.fetchLyrics();
        expect(trackLyrics).not.toBeNull();
    });

    test('Fetch track subtitles', async () => {
        let trackSubtitles = await track.fetchSubtitles();
        expect(trackSubtitles).not.toBeNull();
    });

    test('Fetch track richsync', async () => {
        let trackRichsync = await track.fetchRichsync();
        expect(trackRichsync).not.toBeNull();
    });

    test('Fetch track translations (to \'rja\')', async () => {
        let trackTranslations = await track.fetchTranslations('rja');
        expect(trackTranslations).not.toBeNull();
    });

    test('Fetch track snippet', async () => {
        let trackSnippet = await track.fetchSnippet();
        expect(trackSnippet).not.toBeNull();
    });
});