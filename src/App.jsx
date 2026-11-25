import { useEffect, useState } from 'react'
import { finishLogin, getToken, login } from './spotify'
import Songs from './components/Songs'
import './index.css'

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID

export default function App() {
  const [token, setToken] = useState(getToken)
  const [songs, setSongs] = useState([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) finishLogin(code).then(setToken).catch((error) => setMessage(error.message))
    if (code || params.has('error')) window.history.replaceState({}, '', window.location.pathname)
  }, [])

  async function fetchSongs(timeRange) {
    const response = await fetch(`https://api.spotify.com/v1/me/top/tracks?limit=20&time_range=${timeRange}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    const data = await response.json()
    if (!response.ok) return setMessage(data.error?.message || 'Could not fetch songs.')
    setSongs(data.items)
    setMessage('')
  }

  return (
    <main className="page">
      <h1>Most Listened To</h1>
      {!CLIENT_ID && <p>Set <code>VITE_SPOTIFY_CLIENT_ID</code> in your <code>.env</code> file.</p>}
      <div className="buttons">
        <button disabled={!CLIENT_ID} onClick={login}>Log in with Spotify</button>
      </div>
      <h2>Show top 20 for:</h2>
      <div className="buttons">
        <button disabled={!token} onClick={() => fetchSongs('short_term').catch((error) => setMessage(error.message))}>Last 4 weeks</button>
        <button disabled={!token} onClick={() => fetchSongs('medium_term').catch((error) => setMessage(error.message))}>Last 6 months</button>
        <button disabled={!token} onClick={() => fetchSongs('long_term').catch((error) => setMessage(error.message))}>About 1 year</button>
      </div>
      <p className="range-note">Spotify provides 4-week, 6-month, and 1-year ranges.</p>
      {message && <p>{message}</p>}
      <Songs songs={songs} />
    </main>
  )
}
