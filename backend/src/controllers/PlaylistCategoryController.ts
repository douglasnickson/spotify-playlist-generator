import { Request, Response } from 'express';
import { AxiosResponse } from 'axios';

import SpotifyApi from '../api/SpotifyApi';
import Util from '../util/Util';

class PlaylistCategoryController {
  /**
   * Metodo principal utilizado para tratar a requisicao do usuario
   * @param req - Request recebida do usuario
   * @param res - Response retornada para o usuario
   * @author Douglas Nickson
  */
  public async init(req: Request, res: Response): Promise<Response> {
    const spotifyApi = new SpotifyApi(req.body.token, req.body.tokenType, req.body.userId);

    // Buscando as playlists da categoria
    const categoryId = req.body.category;
    const playlistsList = await spotifyApi.getCategoryPlaylists(categoryId);

    // Recuperando os Ids das playlists recuperadas
    const playlistIds = this.getPlaylistIds(playlistsList);

    // Busca as musicas das playlist no spotify
    const playlistsTracks = await Promise.all(playlistIds
      .map(async (ids): Promise<AxiosResponse> => spotifyApi.getPlaylistTracks(ids)));

    // Recuperando os Ids das tracks
    const tracksIdList = this.getTracksIds(playlistsTracks);
    const playlistTracks = Util.buildPlaylistTracks(tracksIdList);

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
   * Metodo utilizado para pegar o ID das playlists encontradas
   * @param playlistList - lista contendo todos as playlists retornadas
   * @author Douglas Nickson
   */
  private getPlaylistIds = (playlistList: AxiosResponse<any>): string[] => {
    const listPlaylistIds: string[] = [];
    const listPlaylistObjects = playlistList.data.playlists.items;

    listPlaylistObjects.forEach((results: any): void => {
      const playlistId = results.id;
      listPlaylistIds.push(playlistId);
    });
    return listPlaylistIds;
  };

  /**
   * Metodo utilizado para pegar os IDS das tracks encontradas
   * @param trackList - Lista contendo as tracks das playlists
   * @author Douglas Nickson
   */
  private getTracksIds = (trackList: AxiosResponse<any>[]): string[] => {
    const listTracksIds: string[] = [];

    const listTracks = trackList.map((playlist): any[] => playlist.data.items)
      .reduce((prev, curr): string[] => [...prev, ...curr], [])
      .map((tracks): string => tracks.track);

    listTracks.forEach((track: any): void => {
      if (track !== null) {
        listTracksIds.push(track.id);
      }
    });

    return listTracksIds;
  }
}

export default new PlaylistCategoryController();
