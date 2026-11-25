# Spotify Top Songs

A small React + Vite app with two actions: log in to Spotify, then fetch and display your top 20 tracks.

## Run locally

1. Create an app in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Copy `.env.example` to `.env` and set `VITE_SPOTIFY_CLIENT_ID` to your app's client ID.
3. Add `http://127.0.0.1:8888/callback` as a Redirect URI in your Spotify app settings. Keep `VITE_SPOTIFY_REDIRECT_URI` set to that exact URI.
4. Run `npm run dev` and open `http://127.0.0.1:8888`.
5. Click **Log in with Spotify**, then **Fetch my top 20 songs**.

The app uses Spotify's Authorization Code with PKCE flow and asks for the `user-top-read` permission. No client secret is used in the browser.
