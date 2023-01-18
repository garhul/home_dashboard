import * as express from 'express';
import { join } from 'path';
import cfg from '../config';
import { DeviceController, GroupController, SensorController } from './controllers';

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

router.post('/devices', (req: express.Request, res: express.Response) => {
  return res.json(DeviceController.issueCMD(req.body.deviceIds, req.body.payload));
});

/** Group routes */
router.get('/groups', (_req: express.Request, res: express.Response) => {
  return res.json(GroupController.getAll());
});

router.post('/groups', (req: express.Request, res: express.Response) => {
  return res.json(GroupController.issueCMD(req.body.deviceId, req.body.payload));
});

/** Sensors routes */
router.get('/sensors', (_req: express.Request, res: express.Response) => {
  return res.json(SensorController.getAll());
});

// Misc
router.get('/cfg', (_req, res) => res.json(cfg));
router.get('*', notFoundHandler);

export default router;
