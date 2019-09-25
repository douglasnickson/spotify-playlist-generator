"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var PlaylistController_1 = __importDefault(require("./controllers/PlaylistController"));
var App = /** @class */ (function () {
    function App() {
        this.express = express_1.default();
        this.middlewares();
        this.routes();
    }
    App.prototype.middlewares = function () {
        this.express.use(express_1.default.json());
    };
    App.prototype.routes = function () {
        this.express.get('/', function (req, res) {
            res.send('API Rodando...');
        });
        this.express.post('/createPlaylist', PlaylistController_1.default.init.bind(PlaylistController_1.default));
    };
    return App;
}());
exports.default = new App().express;
//# sourceMappingURL=app.js.map