import axios, { AxiosResponse } from 'axios';

const API_URL = 'https://api.spotify.com/v1';

class SpotifyApi {
  private token: string;

  private tokenType: string;

  private userId: string;

  private headers = {};

  public constructor(token: string, tokenType: string, userId: string) {
    this.tokenType = tokenType;
    this.token = token;
    this.userId = userId;
    this.headers = {
      Authorization: `${this.tokenType} ${this.token}`,
      ContentType: 'application/json',
    };
  }

  /**
   * Metodo utilizado para buscar os artistas no Spotify
   * @param artistName - Nome do artista que sera buscado
   * @author Douglas Nickson
   */
  public getArtists = async (artistName): Promise<AxiosResponse> => axios.get(`${API_URL}/search`, {
    params: {
      q: artistName,
      type: 'artist',
    },
    headers: this.headers,
  }).then((response): AxiosResponse => response)
    .catch((error) => { console.log(error.response.data); return error; });

  /**
   * Metodo utilizado para buscar os albums dos artistas no Spotify
   * @param artistId - Id do artista que sera buscado os albums
   * @author Douglas Nickson
   */
  public getArtistsAlbums = async (artistId): Promise<AxiosResponse> => axios.get(`${API_URL}/artists/${artistId}/albums`, {
    params: {
      q: artistId,
      type: 'album',
      limit: '30',
    },
    headers: this.headers,
  }).then((response): AxiosResponse => response)
    .catch((error) => { console.log(error.response.data); return error; });

  /**
   * Metodo utilizado para buscar as musicas dos albums no Spotify
   * @param albumId - Id do album que sera buscado as musicas
   * @author Douglas Nickson
   */
  public getAlbumTracks = async (albumId): Promise<AxiosResponse> => axios.get(`${API_URL}/albums/${albumId}/tracks`, {
    params: {
      q: albumId,
      type: 'album',
    },
    headers: this.headers,
  }).then((response): AxiosResponse => response)
    .catch((error) => { console.log(error.response.data); return error; });

  /**
   * Metodo utilizado para buscar os artistas no Spotify
   * @param artistName - Nome do artista que sera buscado
   * @author Douglas Nickson
   */
  public createPlaylist = async (data): Promise<AxiosResponse> => axios.post(`${API_URL}/users/${this.userId}/playlists`, data, { headers: this.headers })
    .then((response): AxiosResponse => { console.log(response); return response; })
    .catch((error) => { console.log(error.response.data); return error; });

  /**
   * Metodo utilizado para adicionar as musicas na playlist
   * @param artistName - Nome do artista que sera buscado
   * @author Douglas Nickson
   */
  public setPlaylistTracks = async (playlistId, data): Promise<AxiosResponse> => axios.post(`${API_URL}/playlists/${playlistId}/tracks`, data, { headers: this.headers })
    .then((response): AxiosResponse => { console.log(response); return response; })
    .catch((error) => { console.log(error.response.data); return error; });

  /**
   * Metodo utilizado para adicionar as musicas na playlist
   * @param artistName - Nome do artista que sera buscado
   * @author Douglas Nickson
   */
  public getCategoryPlaylists = async (categoryId: string): Promise<AxiosResponse> => axios.get(`${API_URL}/browse/categories/${categoryId}/playlists`, {
    params: {
      country: 'BR',
      locale: 'pt-br',
    },
    headers: this.headers,
  })
    .then((response): AxiosResponse => { console.log(response); return response; })
    .catch((error) => { console.log(error.response.data); return error; });

  /**
   * Metodo utilizado para buscar as musicas de determinadas playlists
   * @param playlistId - Id da playlist que sera buscado as musicas
   * @author Douglas Nickson
   */
  public getPlaylistTracks = async (playlistId: string): Promise<AxiosResponse> => axios.get(`${API_URL}/playlists/${playlistId}/tracks`, {
    headers: this.headers,
  }).then((response): AxiosResponse => response)
    .catch((error) => { console.log(error.response.data); return error; });

  /**
   * Metodo utilizado para buscar as musicas top rated dos artistas
   * @param artistId - Id do artista que sera buscado as musicas top rated
   * @author Douglas Nickson
   */
  public getArtistTopRatedTracks = async (artistId: string): Promise<AxiosResponse> => axios.get(`${API_URL}/artists/${artistId}/top-tracks`, {
    headers: this.headers,
  }).then((response): AxiosResponse => response)
    .catch((error) => { console.log(error.response.data); return error; });
}

export default SpotifyApi;
