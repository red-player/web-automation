import { Router } from 'express';
import controllers from '../../controllers';

const routes = Router()

routes.get('/supplier-create',[],controllers.supplier.supplierCreate)



export { routes as supplierRoutes }