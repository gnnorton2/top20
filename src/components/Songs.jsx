export default function Songs({ songs }) {
  return (
    <ol className="song-list">
      {songs.map((song) => (
        <li key={song.id}>
          <strong>{song.name}</strong>
          <span>{song.artists.map((artist) => artist.name).join(', ')}</span>
        </li>
      ))}
    </ol>
  )
}
