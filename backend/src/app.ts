import express from 'express';
import PlaylistController from './controllers/PlaylistController';

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
      res.send('API Rodando...');
    });

    this.express.post('/createPlaylist', PlaylistController.init.bind(PlaylistController));
  }
}

export default new App().express;
