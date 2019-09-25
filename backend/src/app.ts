import express from 'express';
import PlaylistArtistController from './controllers/PlaylistArtistController';
import PlaylistCategoryController from './controllers/PlaylistCategoryController';


class App {
  public express: express.Application;

  public constructor() {
    this.express = express();
    this.middlewares();
    this.routes();
  }

  private middlewares(): void {
    this.express.use(express.json());
  }

  private routes(): void {
    this.express.get('/', (req, res): void => {
      res.send('API Spotify Playlist Generator iniciada...');
    });

    this.express.post('/createPlaylistByArtist', PlaylistArtistController.init.bind(PlaylistArtistController));
    this.express.post('/createPlaylistByCategory', PlaylistCategoryController.init.bind(PlaylistCategoryController));
  }
}

export default new App().express;
