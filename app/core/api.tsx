export interface Track {
  id: string;
  title: string;
  artist: string;
  artwork: string;
  audio: string;
}

export const getTrendingTracks = async (limit: number = 30): Promise<Track[]> => {
  try {
    const res = await fetch(`https://api.deezer.com/chart/0/tracks?limit=${limit}`);
    const data = await res.json();
    return data.data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      artist: item.artist.name,
      artwork: item.album.cover_medium,
      audio: item.preview,
    }));
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return [];
  }
};


export const getTopArtists = async (limit: number = 30): Promise<any[]> => {
  try {
    const res = await fetch(`https://api.deezer.com/chart/0/artists?limit=${limit}`);
    const data = await res.json();
    return data.data.map((artist: any) => ({
      id: artist.id.toString(),
      name: artist.name,
      picture: artist.picture_medium,
    }));
  } catch (error) {
    console.error("Error fetching artists:", error);
    return [];
  }
};


export async function searchTracks(query: string) {
  try {
    const res = await fetch(
      `https://api.deezer.com/search?q=${encodeURIComponent(query)}`
    );
    const data = await res.json();
    return data.data.map((item: any) => ({
      id: item.id,
      title: item.title,
      artist: item.artist.name,
      artwork: item.album.cover_medium,
      audio: item.preview,
    }));
  } catch (error) {
    console.error("Search error:", error);
    return [];
  }
}

export const getGenres = async (): Promise<any[]> => {
  try {
    const res = await fetch("https://api.deezer.com/genre");
    const data = await res.json();
    // Filter agar genre 'Podcasts' (id=0) tidak muncul
    return data.data.filter((g: any) => g.id !== 0);
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const getTracksByGenre = async (genreId: string): Promise<Track[]> => {
  try {
    const res = await fetch(`https://api.deezer.com/chart/${genreId}/tracks`);
    const data = await res.json();
    return data.data.map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      artist: item.artist.name,
      artwork: item.album.cover_medium,
      audio: item.preview,
    }));
  } catch (error) {
    console.error("Error fetching genre tracks:", error);
    return [];
  }
};

export const getTopPlaylists = async (limit: number = 30): Promise<any[]> => {
  try {
    const res = await fetch(`https://api.deezer.com/chart/0/playlists?limit=${limit}`);
    const data = await res.json();
    return data.data.map((p: any) => ({
      id: p.id.toString(),
      title: p.title,
      picture: p.picture_medium,
    }));
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return [];
  }
};


export const getPlaylistTracks = async (playlistId: string): Promise<Track[]> => {
  try {
    const res = await fetch(`https://api.deezer.com/playlist/${playlistId}`);
    const data = await res.json();
    return data.tracks.data.map((t: any) => ({
      id: t.id.toString(),
      title: t.title,
      artist: t.artist.name,
      artwork: t.album.cover_medium,
      audio: t.preview,
    }));
  } catch (error) {
    console.error("Error fetching playlist tracks:", error);
    return [];
  }
};

export async function getLyrics(trackTitle: string, artistName: string) {
  try {
    const query = `${artistName} ${trackTitle}`;
    const res = await fetch(
      `https://api.vagalume.com.br/search.php?art=${encodeURIComponent(artistName)}&mus=${encodeURIComponent(trackTitle)}`
    );
    const data = await res.json();

    if (data.type === "exact" && data.mus && data.mus.length > 0) {
      return data.mus[0].text;
    } else {
      return "Lyrics not available for this track.";
    }
  } catch (error) {
    console.error("Failed to fetch lyrics:", error);
    return "Lyrics not available.";
  }
}

export async function getArtistDetails(id: string) {
  const res = await fetch(`https://api.deezer.com/artist/${id}`);
  return res.json();
}

export async function getArtistTracks(id: string) {
  const res = await fetch(`https://api.deezer.com/artist/${id}/top?limit=50`);
  const data = await res.json();
  return data.data || [];
}

export const getPlaylistDetails = async (id: string) => {
  const res = await fetch(`https://api.deezer.com/playlist/${id}`);
  if (!res.ok) throw new Error("Failed to fetch playlist details");
  return res.json();
};