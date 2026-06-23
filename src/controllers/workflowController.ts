import { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { runWorkflow } from '../service/workflowRunner';
import login from '../service/login';
import { Page } from 'playwright';
import { DEFAULT_USER, DEFAULT_PASSWORD } from '../config';

export const runWorkflowHandler = async (req: Request, res: Response, next: NextFunction) => {
  let page: Page | null = null;
  try {
    const { recipe, steps, variables, headless } = req.body;

    let workflowObj;

    if (recipe) {
      // Clean recipe name to prevent directory traversal
      const safeRecipeName = path.basename(recipe);
      const recipePath = path.join(process.cwd(), 'workflows', `${safeRecipeName}.json`);
      
      if (!fs.existsSync(recipePath)) {
        res.status(404).json({
          success: false,
          message: `Workflow recipe "${recipe}" not found on server.`
        });
        return;
      }
      const raw = fs.readFileSync(recipePath, 'utf8');
      workflowObj = JSON.parse(raw);
    } else if (steps && Array.isArray(steps)) {
      workflowObj = {
        name: 'Ad-hoc Client Workflow',
        description: 'Dynamically generated ad-hoc workflow',
        steps
      };
    } else {
      res.status(400).json({
        success: false,
        message: 'Request must contain either a "recipe" name or a "steps" array.'
      });
      return;
    }

    // Default connection variables
    const username = variables?.username || DEFAULT_USER;
    const password = variables?.password || DEFAULT_PASSWORD;
    const moduleName = variables?.moduleName || 'POS';

    logStart(workflowObj.name);

    // Initialize browser context and log in
    page = await login({
      userName: username,
      password: password,
      moduleName: moduleName,
      headless: headless !== undefined ? !!headless : undefined
    });

    const runtimeVariables = {
      username,
      password,
      moduleName,
      ...variables
    };

    // Run the execution engine
    const result = await runWorkflow(page, workflowObj, runtimeVariables);

    res.status(result.success ? 200 : 500).json(result);

  } catch (err: any) {
    next(err);
  } finally {
    if (page) {
      const browser = page.context().browser();
      if (browser) {
        await browser.close();
      } else {
        await page.close();
      }
    }
  }
};

const logStart = (name: string) => {
  console.log(`\n======================================================`);
  console.log(`▶️ RECEIVED HTTP API REQUEST TO RUN WORKFLOW: "${name}"`);
  console.log(`======================================================`);
};

export const listRecipesHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const dir = path.join(process.cwd(), 'workflows');
    if (!fs.existsSync(dir)) {
      res.status(200).json([]);
      return;
    }
    const files = fs.readdirSync(dir);
    const recipes = files
      .filter(f => f.endsWith('.json') && f !== 'recipe_schema.json')
      .map(f => path.basename(f, '.json'));
    res.status(200).json(recipes);
  } catch (err) {
    next(err);
  }
};

export const loadRecipeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = path.basename(req.params.name);
    const recipePath = path.join(process.cwd(), 'workflows', `${name}.json`);
    if (!fs.existsSync(recipePath)) {
      res.status(404).json({ success: false, message: `Recipe "${name}" not found.` });
      return;
    }
    const raw = fs.readFileSync(recipePath, 'utf8');
    const recipe = JSON.parse(raw);
    res.status(200).json(recipe);
  } catch (err) {
    next(err);
  }
};

export const saveRecipeHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = path.basename(req.params.name);
    const recipePath = path.join(process.cwd(), 'workflows', `${name}.json`);
    
    const dir = path.join(process.cwd(), 'workflows');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const recipeData = {
      $schema: "./recipe_schema.json",
      ...req.body
    };

    fs.writeFileSync(recipePath, JSON.stringify(recipeData, null, 2), 'utf8');
    res.status(200).json({ success: true, message: `Recipe "${name}" saved successfully.` });
  } catch (err) {
    next(err);
  }
};


