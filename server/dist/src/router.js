"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const path_1 = require("path");
const config_1 = __importDefault(require("../config"));
const controllers_1 = require("./controllers");
const router = express.Router();
// const exCatcher = (fn) => async (req, res, next) => {
//   try {
//     fn(req, res).catch((err) => next(err));
//   } catch (ex) {
//     console.log('y?');
//   }
// };
const notFoundHandler = (_req, res) => {
    res.status(404).send('Nope');
};
router.use('/assets', express.static((0, path_1.join)(__dirname, 'assets')));
/** Device routes */
router.get('/devices', (_req, res) => {
    return res.json(controllers_1.DeviceController.getAll());
});
/** Widget routes */
// router.get('/widgets',(_req: express.Request, res: express.Response) => {
//   return res.json(WidgetController.getAll());
// });
/** Group routes */
router.get('/groups', (_req, res) => {
    return res.json(controllers_1.GroupController.getAll());
});
// router.post('/tags', exCatcher(TagsController.create));
// router.delete('/tags', exCatcher(TagsController.remove));
// Misc
router.get('/cfg', (_req, res) => res.json(config_1.default));
router.get('*', notFoundHandler);
exports.default = router;
