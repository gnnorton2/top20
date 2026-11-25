const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI || window.location.origin
const tokenKey = 'spotify_access_token'

function base64Url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export async function login() {
  const verifier = base64Url(crypto.getRandomValues(new Uint8Array(64)))
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))
  sessionStorage.setItem('spotify_code_verifier', verifier)

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: 'code',
    redirect_uri: redirectUri,
    scope: 'user-top-read',
    code_challenge_method: 'S256',
    code_challenge: base64Url(digest),
  })
  window.location.assign(`https://accounts.spotify.com/authorize?${params}`)
}

export function getToken() {
  return sessionStorage.getItem(tokenKey)
}

export async function finishLogin(code) {
  const verifier = sessionStorage.getItem('spotify_code_verifier')
  if (!verifier) throw new Error('Login expired. Please try again.')

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: verifier,
    }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error_description || 'Spotify login failed.')

  sessionStorage.setItem(tokenKey, data.access_token)
  sessionStorage.removeItem('spotify_code_verifier')
  return data.access_token
}
