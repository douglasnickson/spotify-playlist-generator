import { AxiosResponse } from 'axios';

class Util {
  /**
   * Metodo utilizado para verificar se o retorno do Spotify e valido
   * @param values - Array contenndo os valores retornados do Spotify
   * @author Douglas Nickson
   */
  public isValid = (values: AxiosResponse<any>[]): boolean => {
    let statusValid = true;

    values.forEach((result): void => {
      if (statusValid) {
        if (result.status !== 200) { statusValid = false; }
      }
    });
    return statusValid;
  }

  /**
   * Metodo utilizado para gerar a Playlist no Spotify
   * @param trackList - Lista contendo o ID das possiveis musicas a serem geradas
   * @author Douglas Nickson
   */
  public buildPlaylistTracks = (trackList: string []): string[] => {
    const randomTracks: string[] = [];
    for (let i = 0; i < 100; i += 1) {
      const track: string = this.getRandomTrack(trackList);
      const trackFormatted = `spotify:track:${track}`;
      randomTracks.push(trackFormatted);
    }
    return randomTracks;
  }

  /**
   * Metodo utilizado para criar uma lista de musicas aleatorias dos artistas
   * @param - Array contendo todas as musicas dos artistas
   * @author - Douglas Nickson
   */
  public getRandomTrack = (trackArray: string[]): string => {
    const randonNum = Math.floor(Math.random() * trackArray.length);
    return trackArray[randonNum];
  }
}

export default new Util();
