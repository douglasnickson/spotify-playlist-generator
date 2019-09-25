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
var axios_1 = __importDefault(require("axios"));
var API_URL = 'https://api.spotify.com/v1';
var SpotifyApi = /** @class */ (function () {
    function SpotifyApi(token, tokenType, userId) {
        var _this = this;
        this.headers = {};
        /**
         * Metodo utilizado para buscar os artistas no Spotify
         * @param artistName - Nome do artista que sera buscado
         * @author Douglas Nickson
         */
        this.getArtists = function (artistName) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(API_URL + "/search", {
                        params: {
                            q: artistName,
                            type: 'artist',
                        },
                        headers: this.headers,
                    }).then(function (response) { return response; })
                        .catch(function (error) { console.log(error.response.data); return error; })];
            });
        }); };
        /**
         * Metodo utilizado para buscar os albums dos artistas no Spotify
         * @param artistId - Id do artista que sera buscado os albums
         * @author Douglas Nickson
         */
        this.getArtistsAlbums = function (artistId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(API_URL + "/artists/" + artistId + "/albums", {
                        params: {
                            q: artistId,
                            type: 'album',
                            limit: '30',
                        },
                        headers: this.headers,
                    }).then(function (response) { return response; })
                        .catch(function (error) { console.log(error.response.data); return error; })];
            });
        }); };
        /**
         * Metodo utilizado para buscar as musicas dos albums no Spotify
         * @param albumId - Id do album que sera buscado as musicas
         * @author Douglas Nickson
         */
        this.getAlbumTracks = function (albumId) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.get(API_URL + "/albums/" + albumId + "/tracks", {
                        params: {
                            q: albumId,
                            type: 'album',
                        },
                        headers: this.headers,
                    }).then(function (response) { return response; })
                        .catch(function (error) { console.log(error.response.data); return error; })];
            });
        }); };
        /**
         * Metodo utilizado para buscar os artistas no Spotify
         * @param artistName - Nome do artista que sera buscado
         * @author Douglas Nickson
         */
        this.createPlaylist = function (data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.post(API_URL + "/users/" + this.userId + "/playlists", data, { headers: this.headers })
                        .then(function (response) { console.log(response); return response; })
                        .catch(function (error) { console.log(error.response.data); return error; })];
            });
        }); };
        /**
         * Metodo utilizado para adicionar as musicas na plaliist
         * @param artistName - Nome do artista que sera buscado
         * @author Douglas Nickson
         */
        this.setPlaylistTracks = function (playlistId, data) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, axios_1.default.post(API_URL + "/playlists/" + playlistId + "/tracks", data, { headers: this.headers })
                        .then(function (response) { console.log(response); return response; })
                        .catch(function (error) { console.log(error.response.data); return error; })];
            });
        }); };
        this.tokenType = tokenType;
        this.token = token;
        this.userId = userId;
        this.headers = {
            Authorization: this.tokenType + " " + this.token,
            ContentType: 'application/json',
        };
    }
    return SpotifyApi;
}());
exports.default = SpotifyApi;
//# sourceMappingURL=SpotifyApi.js.map