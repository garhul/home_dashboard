import * as express from 'express';
import { join } from 'path';
import cfg from '../config';
import { DeviceController, GroupController, SensorController, SchedulerController } from './controllers';

const router = express.Router();
const apiRouter = express.Router();

const notFoundHandler = (_req: express.Request, res: express.Response) => {
  res.status(404).send('Nope');
};

/** Device routes */
apiRouter.get('/devices', (_req: express.Request, res: express.Response) => {
  return res.json(DeviceController.getAll());
});

apiRouter.post('/devices', (req: express.Request, res: express.Response) => {
  return res.json(DeviceController.issueCMD(req.body.deviceIds, req.body.payload));
});

apiRouter.put('/devices/scan', (req: express.Request, res: express.Response) => {

  return res.json(DeviceController.scan())
});

/** Group routes */
apiRouter.get('/groups', (_req: express.Request, res: express.Response) => {
  return res.json(GroupController.getAll());
});

apiRouter.post('/groups', (req: express.Request, res: express.Response) => {
  return res.json(GroupController.issueCMD(req.body.deviceId, req.body.payload));
});

/** Sensors routes */
apiRouter.get('/sensors', (_req: express.Request, res: express.Response) => {
  return res.json(SensorController.getAll());
});

/** Scheduler rules routes */
apiRouter.get('/scheduler', (_req: express.Request, res: express.Response) => {
  return res.json(SchedulerController.getAll());
});

apiRouter.post('/scheduler', (req: express.Request, res: express.Response) => {
  console.log(req.body);
});

router.use('/api', apiRouter);

//add route for exposing required config to frontend
router.get('/api/cfg', (req: express.Request, res: express.Response) => {
  res.status(200).send({
    wsPort: cfg.server.wsPort
  });
})

router.use(express.static(join(__dirname, '../', cfg.server.clientFolder)));
console.log(join(__dirname, '../', cfg.server.clientFolder));
// Misc
router.get('*', notFoundHandler);

export default router;
