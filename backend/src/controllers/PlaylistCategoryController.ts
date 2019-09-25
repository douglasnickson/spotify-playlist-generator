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

    this.getPlaylistTracks(playlistsList);

    return res.send({ message: 'Playlist gerada com sucesso!' });
  }

  private getPlaylistTracks = (playlistsList: AxiosResponse<any>) => {}
}

export default new PlaylistCategoryController();
