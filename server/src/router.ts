import * as express from 'express';
import { join } from 'path';
import { logger } from './services/logger/';
import cfg from '../config';
import { DeviceController, GroupController } from './controllers';

const router = express.Router();

// const exCatcher = (fn) => async (req, res, next) => {
//   try {
//     fn(req, res).catch((err) => next(err));
//   } catch (ex) {
//     console.log('y?');
//   }
// };

const notFoundHandler = (_req: express.Request, res: express.Response) => {
  res.status(404).send('Nope');
};

router.use('/assets', express.static(join(__dirname, 'assets')));

/** Device routes */
router.get('/devices', (_req: express.Request, res: express.Response) => {
  return res.json(DeviceController.getAll());
});

/** Widget routes */
// router.get('/widgets',(_req: express.Request, res: express.Response) => {
//   return res.json(WidgetController.getAll());
// });

/** Group routes */
router.get('/groups', (_req: express.Request, res: express.Response) => {
  return res.json(GroupController.getAll());
});

// router.post('/tags', exCatcher(TagsController.create));
// router.delete('/tags', exCatcher(TagsController.remove));

// Misc
router.get('/cfg', (_req, res) => res.json(cfg));
router.get('*', notFoundHandler);

export default router;
