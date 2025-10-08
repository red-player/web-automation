import { Router } from 'express';
import controllers from '../controllers';
// import { envUrl } from '../config';
import { supplierRoutes } from './supplier';



const routes = Router()

const basePath = '/tancem-automation/v1'

routes.use(basePath+ '/supplier',supplierRoutes)

export { routes }