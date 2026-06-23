import { Router } from 'express';
import { 
  runWorkflowHandler, 
  listRecipesHandler, 
  loadRecipeHandler, 
  saveRecipeHandler 
} from '../controllers/workflowController';

const routes = Router();

routes.post('/run-workflow', runWorkflowHandler);
routes.get('/recipes', listRecipesHandler);
routes.get('/recipes/:name', loadRecipeHandler);
routes.post('/recipes/:name', saveRecipeHandler);

export { routes as workflowRoutes };

