import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';

import SpotifyApi from '../api/SpotifyApi';
import Util from '../util/Util';

class PlaylistArtistController {
  /**
   * Metodo principal utilizado para tratar a requisicao do usuario
   * @param req - Request recebida do usuario
   * @param res - Response retornada para o usuario
   * @author Douglas Nickson
  */
  public async init(req: Request, res: Response): Promise<Response> {
    // Instanciando a API do spotify
    const spotifyApi = new SpotifyApi(req.body.token, req.body.tokenType, req.body.userId);

    const { topRatedTracks } = req.body;
    const data = {
      name: req.body.name,
      collaborative: req.body.collaborative,
      description: req.body.description,
      public: req.body.public,
    };

    // Buscando os artistas no Spotify
    let artists = req.body.bands;
    artists = artists.split(',');
    const artistsGroup = await Promise.all(Object.values(artists)
      .map(async (artistsName): Promise<AxiosResponse> => spotifyApi.getArtists(artistsName)));

    if (!Util.isValid(artistsGroup)) {
      return res.send({ message: 'Ocorreu um erro ao buscar os artistas. Por favor, tente novamente!', status: 'error' });
    }

    // Buscando a lista de musicas do artista, pode ser aleatorias por albums ou top rated
    const artistsIdGroup = this.getArtistsIds(artistsGroup);
    let tracksIdGroup: string[];

    if (topRatedTracks) {
      const topRatedTracksGroup = await Promise.all(artistsIdGroup.map(
        async (artistId): Promise<AxiosResponse> => spotifyApi.getArtistTopRatedTracks(artistId),
      ));

      if (!Util.isValid(topRatedTracksGroup)) {
        return res.send({ message: 'Ocorreu um erro ao buscar as músicas top rated dos artistas. Por favor, tente novamente!', status: 'error' });
      }

      tracksIdGroup = this.getTopRatedTracksIds(topRatedTracksGroup);
    } else {
      const albumsGroup = await Promise.all(artistsIdGroup
        .map(async (arstistId): Promise<AxiosResponse> => spotifyApi.getArtistsAlbums(arstistId)));

      if (!Util.isValid(albumsGroup)) {
        return res.send({ message: 'Ocorreu um erro ao buscar os albums dos artistas. Por favor, tente novamente!', status: 'error' });
      }

      const albumsIdGroup = this.getAlbumsIds(albumsGroup);
      const tracksGroup = await Promise.all(albumsIdGroup
        .map(async (albumId): Promise<AxiosResponse> => spotifyApi.getAlbumTracks(albumId)));

      if (!Util.isValid(tracksGroup)) {
        return res.send({ message: 'Ocorreu um erro ao buscar as músicas dos albums. Por favor, tente novamente!', status: 'error' });
      }

      tracksIdGroup = this.getTracksIds(tracksGroup);
    }

    // Criando a lista de musicas da Playlist que sera criada
    const playlistTracks = Util.buildPlaylistTracks(tracksIdGroup);

    if (playlistTracks.length < 1) {
      return res.send({ message: 'Ocorreu um erro ao gerar a lista de músicas para a playlist. Por favor, tente novamente!', status: 'error' });
    }

    // Criando a Playlist no Spotify
    const playlist = await spotifyApi.createPlaylist(data);
    if (playlist.status !== 201) {
      return res.send({ message: 'Ocorreu um erro ao criar a Playlist no Spotify. Por favor, tente novamente!', status: 'error' });
    }

    // Adicionando as Musicas na Playlist
    const tracksData = { uris: playlistTracks };
    const addPlaylist = await spotifyApi.setPlaylistTracks(playlist.data.id, tracksData);
    if (addPlaylist.status !== 201) {
      return res.send({ message: 'Ocorreu um erro ao adicionar as musicas na Playlist do Spotify. Por favor, tente novamente!', status: 'error' });
    }

    return res.send({ message: 'Playlist gerada com sucesso!', status: 'success' });
  }

  /**
   * Metodo utilizado para pegar o ID dos artistas encontrados
   * @param artistsGroup - lista contendo todos os artistas retornados
   * @author Douglas Nickson
   */
  private getArtistsIds = (artistsGroup: AxiosResponse<any>[]): string[] => {
    const listArtistsIds: string[] = [];

    artistsGroup.forEach((results): void => {
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
   * Metodo utilizado para pegar os IDS das tracks encontradas
   * @param tracksGroup
   * @author Douglas Nickson
   */
  private getTracksIds = (tracksGroup: AxiosResponse<any>[]): string[] => {
    const listTracksIds = tracksGroup.map((tracks): any[] => tracks.data.items)
      .reduce((prev, curr): any[] => [...prev, ...curr], [])
      .map((track): string => track.id);

    return listTracksIds;
  }

  /**
   * Metodo utilizado para pegar os IDS das top rated tracks encontradas
   * @param topRatedTracksGroup
   * @author Douglas Nickson
   */
  private getTopRatedTracksIds = (topRatedTracksGroup: AxiosResponse<any>[]): string[] => {
    const listTracksIds = topRatedTracksGroup.map((tracks): any[] => tracks.data.tracks)
      .reduce((prev, curr): any[] => [...prev, ...curr], [])
      .map((track): string => track.id);

    return listTracksIds;
  }
}

export default new PlaylistArtistController();
