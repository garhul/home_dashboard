import * as express from 'express';
import { join } from 'path';
import cfg from '../config';
import { DeviceController, GroupController, SensorController, SchedulerController } from './controllers';

const router = express.Router();

// const exCatcher = (fn) => async (req, res, next) => {
//   try {
//     fn(req, res).catch((err) => next(err));
//   } catch (ex) {
//     console.log('y?');
//   }
// };

router.use(express.static(join(__dirname, '../', cfg.server.clientFolder)));

const notFoundHandler = (_req: express.Request, res: express.Response) => {
  res.status(404).send('Nope');
};

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

/** Scheduler rules routes */
router.get('/scheduler', (_req: express.Request, res: express.Response) => {
  return res.json(SchedulerController.getAll());
});

router.post('/scheduler', (req: express.Request, res: express.Response) => {
  console.log(req.body);
});

// Misc
router.get('/cfg', (_req, res) => res.json(cfg));
router.get('*', notFoundHandler);

export default router;
