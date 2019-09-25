"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var SpotifyApi_1 = __importDefault(require("../api/SpotifyApi"));
var PlaylistController = /** @class */ (function () {
    function PlaylistController() {
        var _this = this;
        /**
         * Metodo utilizado para gerar a Playlist no Spotify
         * @param trackList - Lista contendo o ID das possiveis musicas a serem geradas
         * @author Douglas Nickson
         */
        this.buildPlaylistTracks = function (trackList) {
            var randomTracks = [];
            for (var i = 0; i < 100; i += 1) {
                var track = _this.getRandomTrack(trackList);
                var trackFormatted = "spotify:track:" + track;
                randomTracks.push(trackFormatted);
            }
            return randomTracks;
        };
        /**
         * Metodo utilizado para pegar o ID dos artistas encontrados
         * @param artistsList - lista contendo todos os artistas retornados
         * @author Douglas Nickson
         */
        this.getArtistsIds = function (artistsList) {
            var listArtistsIds = [];
            artistsList.forEach(function (results) {
                var artistsId = results.data.artists.items[0].id;
                listArtistsIds.push(artistsId);
            });
            return listArtistsIds;
        };
        /**
         * Metodo utilizado para pegar os IDS dos albums encontrados
         * @param albumList
         * @author Douglas Nickson
         */
        this.getAlbumsIds = function (albumList) {
            var listAlbumsIds = albumList.map(function (albums) { return albums.data.items; })
                .reduce(function (prev, curr) { return prev.concat(curr); }, [])
                .map(function (album) { return album.id; });
            return listAlbumsIds;
        };
        /**
         * Metodo utilizado para pegar os IDS dos albums encontrados
         * @param trackList
         * @author Douglas Nickson
         */
        this.getTracksIds = function (trackList) {
            var listTracksIds = trackList.map(function (tracks) { return tracks.data.items; })
                .reduce(function (prev, curr) { return prev.concat(curr); }, [])
                .map(function (track) { return track.id; });
            return listTracksIds;
        };
        /**
         * Metodo utilizado para verificar se o retorno do Spotify e valido
         * @param values - Array contenndo os valores retornados do Spotify
         * @author Douglas Nickson
         */
        this.isValid = function (values) {
            var statusValid = true;
            values.forEach(function (result) {
                if (statusValid) {
                    if (result.status !== 200) {
                        statusValid = false;
                    }
                }
            });
            return statusValid;
        };
        /**
         * Metodo utilizado para criar uma lista de musicas aleatorias dos artistas
         * @param - Array contendo todas as musicas dos artistas
         * @author - Douglas Nickson
         */
        this.getRandomTrack = function (trackArray) {
            var randonNum = Math.floor(Math.random() * trackArray.length);
            return trackArray[randonNum];
        };
    }
    /**
     * Metodo principal utilizado para tratar a requisicao do usuario
     * @param req - Request recebida do usuario
     * @param res - Response retornada para o usuario
     * @author Douglas Nickson
    */
    PlaylistController.prototype.init = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var spotifyApi, artists, artistsList, artistsIdList, albumsList, albumsIdList, trackList, tracksIdList, playlistTracks, data, playlist, tracksData, addPlaylist;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spotifyApi = new SpotifyApi_1.default(req.body.token, req.body.tokenType, req.body.userId);
                        artists = req.body.bands;
                        artists = artists.split(',');
                        return [4 /*yield*/, Promise.all(Object.values(artists)
                                .map(function (artistsName) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, spotifyApi.getArtists(artistsName)];
                            }); }); }))];
                    case 1:
                        artistsList = _a.sent();
                        if (!this.isValid(artistsList)) {
                            return [2 /*return*/, res.send({ message: 'Ocorreu um erro ao buscar os artistas. Por favor, tente novamente!' })];
                        }
                        artistsIdList = this.getArtistsIds(artistsList);
                        return [4 /*yield*/, Promise.all(artistsIdList
                                .map(function (ids) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, spotifyApi.getArtistsAlbums(ids)];
                            }); }); }))];
                    case 2:
                        albumsList = _a.sent();
                        if (!this.isValid(albumsList)) {
                            return [2 /*return*/, res.send({ message: 'Ocorreu um erro ao buscar os albums dos artistas. Por favor, tente novamente!' })];
                        }
                        albumsIdList = this.getAlbumsIds(albumsList);
                        return [4 /*yield*/, Promise.all(albumsIdList
                                .map(function (ids) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, spotifyApi.getAlbumTracks(ids)];
                            }); }); }))];
                    case 3:
                        trackList = _a.sent();
                        if (!this.isValid(trackList)) {
                            return [2 /*return*/, res.send({ message: 'Ocorreu um erro ao buscar as músicas dos albums. Por favor, tente novamente!' })];
                        }
                        tracksIdList = this.getTracksIds(trackList);
                        playlistTracks = this.buildPlaylistTracks(tracksIdList);
                        if (playlistTracks.length < 1) {
                            return [2 /*return*/, res.send({ message: 'Ocorreu um erro ao criar a lista de músicas para a playlist. Por favor, tente novamente!' })];
                        }
                        data = {
                            name: req.body.name,
                            collaborative: req.body.collaborative,
                            description: req.body.description,
                            public: req.body.public,
                        };
                        return [4 /*yield*/, spotifyApi.createPlaylist(data)];
                    case 4:
                        playlist = _a.sent();
                        if (playlist.status !== 201) {
                            return [2 /*return*/, res.send({ message: 'Ocorreu um erro ao criar a Playlist no Spotify. Por favor, tente novamente!' })];
                        }
                        tracksData = {
                            uris: playlistTracks,
                        };
                        return [4 /*yield*/, spotifyApi.setPlaylistTracks(playlist.data.id, tracksData)];
                    case 5:
                        addPlaylist = _a.sent();
                        if (addPlaylist.status !== 201) {
                            return [2 /*return*/, res.send({ message: 'Ocorreu um erro ao adicionar as musicas na Playlist do Spotify. Por favor, tente novamente!' })];
                        }
                        return [2 /*return*/, res.send({ message: 'Playlist gerada com sucesso!' })];
                }
            });
        });
    };
    return PlaylistController;
}());
exports.default = new PlaylistController();
//# sourceMappingURL=PlaylistController.js.map