import { Router } from 'express';
import controllers from '../controllers';
// import { envUrl } from '../config';
import { workflowRoutes } from './workflowRoutes';
import { BASE_PATH } from '../config';



const routes = Router()

routes.use(BASE_PATH, workflowRoutes);

export { routes }