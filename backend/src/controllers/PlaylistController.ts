import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';
import SpotifyApi from '../api/SpotifyApi';

class PlaylistController {
  /**
   * Metodo principal utilizado para tratar a requisicao do usuario
   * @param req - Request recebida do usuario
   * @param res - Response retornada para o usuario
   * @author Douglas Nickson
  */
  public async init(req: Request, res: Response): Promise<Response> {
    const spotifyApi = new SpotifyApi(req.body.token, req.body.tokenType, req.body.userId);

    // Buscando os artistas no Spotify
    let artists = req.body.bands;
    artists = artists.split(',');
    const artistsList = await Promise.all(Object.values(artists)
      .map(async (artistsName): Promise<AxiosResponse> => spotifyApi.getArtists(artistsName)));

    if (!this.isValid(artistsList)) {
      return res.send({ message: 'Ocorreu um erro ao buscar os artistas. Por favor, tente novamente!' });
    }

    // Buscando os albums dos artistas no spotify
    const artistsIdList = this.getArtistsIds(artistsList);
    const albumsList = await Promise.all(artistsIdList
      .map(async (ids): Promise<AxiosResponse> => spotifyApi.getArtistsAlbums(ids)));

    if (!this.isValid(albumsList)) {
      return res.send({ message: 'Ocorreu um erro ao buscar os albums dos artistas. Por favor, tente novamente!' });
    }

    // Buscando as musicas dos albums retornados
    const albumsIdList = this.getAlbumsIds(albumsList);
    const trackList = await Promise.all(albumsIdList
      .map(async (ids): Promise<AxiosResponse> => spotifyApi.getAlbumTracks(ids)));

    if (!this.isValid(trackList)) {
      return res.send({ message: 'Ocorreu um erro ao buscar as músicas dos albums. Por favor, tente novamente!' });
    }

    // Criando a lista de musicas da Playlist que sera criada
    const tracksIdList = this.getTracksIds(trackList);
    const playlistTracks = this.buildPlaylistTracks(tracksIdList);

    if (playlistTracks.length < 1) {
      return res.send({ message: 'Ocorreu um erro ao criar a lista de músicas para a playlist. Por favor, tente novamente!' });
    }

    // Criando a Playlist no Spotify
    const data = {
      name: req.body.name,
      collaborative: req.body.collaborative,
      description: req.body.description,
      public: req.body.public,
    };
    const playlist = await spotifyApi.createPlaylist(data);
    if (playlist.status !== 201) {
      return res.send({ message: 'Ocorreu um erro ao criar a Playlist no Spotify. Por favor, tente novamente!' });
    }

    // Adicionando as Musicas na Playlist
    const tracksData = {
      uris: playlistTracks,
    };
    const addPlaylist = await spotifyApi.setPlaylistTracks(playlist.data.id, tracksData);
    if (addPlaylist.status !== 201) {
      return res.send({ message: 'Ocorreu um erro ao adicionar as musicas na Playlist do Spotify. Por favor, tente novamente!' });
    }

    return res.send({ message: 'Playlist gerada com sucesso!' });
  }

  /**
   * Metodo utilizado para gerar a Playlist no Spotify
   * @param trackList - Lista contendo o ID das possiveis musicas a serem geradas
   * @author Douglas Nickson
   */
  private buildPlaylistTracks = (trackList): string[] => {
    const randomTracks: string[] = [];
    for (let i = 0; i < 100; i += 1) {
      const track: string = this.getRandomTrack(trackList);
      const trackFormatted = `spotify:track:${track}`;
      randomTracks.push(trackFormatted);
    }
    return randomTracks;
  }

  /**
   * Metodo utilizado para pegar o ID dos artistas encontrados
   * @param artistsList - lista contendo todos os artistas retornados
   * @author Douglas Nickson
   */
  private getArtistsIds = (artistsList: AxiosResponse<any>[]): string[] => {
    const listArtistsIds: string[] = [];

    artistsList.forEach((results): void => {
      const artistsId = results.data.artists.items[0].id;
      listArtistsIds.push(artistsId);
    });

    return listArtistsIds;
  }

  /**
   * Metodo utilizado para pegar os IDS dos albums encontrados
   * @param albumList
   * @author Douglas Nickson
   */
  private getAlbumsIds = (albumList: AxiosResponse<any>[]): string[] => {
    const listAlbumsIds = albumList.map((albums): any[] => albums.data.items)
      .reduce((prev, curr): any[] => [...prev, ...curr], [])
      .map((album): string => album.id);

    return listAlbumsIds;
  }

  /**
   * Metodo utilizado para pegar os IDS dos albums encontrados
   * @param trackList
   * @author Douglas Nickson
   */
  private getTracksIds = (trackList: AxiosResponse<any>[]): string[] => {
    const listTracksIds = trackList.map((tracks): any[] => tracks.data.items)
      .reduce((prev, curr): any[] => [...prev, ...curr], [])
      .map((track): string => track.id);

    return listTracksIds;
  }

  /**
   * Metodo utilizado para verificar se o retorno do Spotify e valido
   * @param values - Array contenndo os valores retornados do Spotify
   * @author Douglas Nickson
   */
  private isValid = (values: AxiosResponse<any>[]): boolean => {
    let statusValid = true;

    values.forEach((result): void => {
      if (statusValid) {
        if (result.status !== 200) { statusValid = false; }
      }
    });
    return statusValid;
  }

  /**
   * Metodo utilizado para criar uma lista de musicas aleatorias dos artistas
   * @param - Array contendo todas as musicas dos artistas
   * @author - Douglas Nickson
   */
  private getRandomTrack = (trackArray): string => {
    const randonNum = Math.floor(Math.random() * trackArray.length);
    return trackArray[randonNum];
  }
}

export default new PlaylistController();
