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
   * @param artistsTracksGroup - Lista contendo o ID das possiveis musicas a serem geradas
   * @author Douglas Nickson
   */
  public buildPlaylistTracks = (artistsTracksGroup: string []): string[] => {
    const randomTracks: string[] = [];
    let count = 0;

    if (artistsTracksGroup.length >= 100) {
      while (count < 100) {
        const track: string = this.getRandomTrack(artistsTracksGroup);
        if (!randomTracks.includes(track)) {
          const trackFormatted = `spotify:track:${track}`;
          randomTracks.push(trackFormatted);
          count += 1;
        }
      }
      return randomTracks;
    }

    for (let i = 0; i < artistsTracksGroup.length; i += 1) {
      const trackFormatted = `spotify:track:${artistsTracksGroup[i]}`;
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
