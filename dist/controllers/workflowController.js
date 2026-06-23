"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveRecipeHandler = exports.loadRecipeHandler = exports.listRecipesHandler = exports.runWorkflowHandler = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const workflowRunner_1 = require("../service/workflowRunner");
const login_1 = __importDefault(require("../service/login"));
const config_1 = require("../config");
const runWorkflowHandler = async (req, res, next) => {
    let page = null;
    try {
        const { recipe, steps, variables, headless } = req.body;
        let workflowObj;
        if (recipe) {
            // Clean recipe name to prevent directory traversal
            const safeRecipeName = path_1.default.basename(recipe);
            const recipePath = path_1.default.join(process.cwd(), 'workflows', `${safeRecipeName}.json`);
            if (!fs_1.default.existsSync(recipePath)) {
                res.status(404).json({
                    success: false,
                    message: `Workflow recipe "${recipe}" not found on server.`
                });
                return;
            }
            const raw = fs_1.default.readFileSync(recipePath, 'utf8');
            workflowObj = JSON.parse(raw);
        }
        else if (steps && Array.isArray(steps)) {
            workflowObj = {
                name: 'Ad-hoc Client Workflow',
                description: 'Dynamically generated ad-hoc workflow',
                steps
            };
        }
        else {
            res.status(400).json({
                success: false,
                message: 'Request must contain either a "recipe" name or a "steps" array.'
            });
            return;
        }
        // Default connection variables
        const username = variables?.username || config_1.DEFAULT_USER;
        const password = variables?.password || config_1.DEFAULT_PASSWORD;
        const moduleName = variables?.moduleName || 'POS';
        logStart(workflowObj.name);
        // Initialize browser context and log in
        page = await (0, login_1.default)({
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
        const result = await (0, workflowRunner_1.runWorkflow)(page, workflowObj, runtimeVariables);
        res.status(result.success ? 200 : 500).json(result);
    }
    catch (err) {
        next(err);
    }
    finally {
        if (page) {
            const browser = page.context().browser();
            if (browser) {
                await browser.close();
            }
            else {
                await page.close();
            }
        }
    }
};
exports.runWorkflowHandler = runWorkflowHandler;
const logStart = (name) => {
    console.log(`\n======================================================`);
    console.log(`▶️ RECEIVED HTTP API REQUEST TO RUN WORKFLOW: "${name}"`);
    console.log(`======================================================`);
};
const listRecipesHandler = async (req, res, next) => {
    try {
        const dir = path_1.default.join(process.cwd(), 'workflows');
        if (!fs_1.default.existsSync(dir)) {
            res.status(200).json([]);
            return;
        }
        const files = fs_1.default.readdirSync(dir);
        const recipes = files
            .filter(f => f.endsWith('.json') && f !== 'recipe_schema.json')
            .map(f => path_1.default.basename(f, '.json'));
        res.status(200).json(recipes);
    }
    catch (err) {
        next(err);
    }
};
exports.listRecipesHandler = listRecipesHandler;
const loadRecipeHandler = async (req, res, next) => {
    try {
        const name = path_1.default.basename(req.params.name);
        const recipePath = path_1.default.join(process.cwd(), 'workflows', `${name}.json`);
        if (!fs_1.default.existsSync(recipePath)) {
            res.status(404).json({ success: false, message: `Recipe "${name}" not found.` });
            return;
        }
        const raw = fs_1.default.readFileSync(recipePath, 'utf8');
        const recipe = JSON.parse(raw);
        res.status(200).json(recipe);
    }
    catch (err) {
        next(err);
    }
};
exports.loadRecipeHandler = loadRecipeHandler;
const saveRecipeHandler = async (req, res, next) => {
    try {
        const name = path_1.default.basename(req.params.name);
        const recipePath = path_1.default.join(process.cwd(), 'workflows', `${name}.json`);
        const dir = path_1.default.join(process.cwd(), 'workflows');
        if (!fs_1.default.existsSync(dir)) {
            fs_1.default.mkdirSync(dir, { recursive: true });
        }
        const recipeData = {
            $schema: "./recipe_schema.json",
            ...req.body
        };
        fs_1.default.writeFileSync(recipePath, JSON.stringify(recipeData, null, 2), 'utf8');
        res.status(200).json({ success: true, message: `Recipe "${name}" saved successfully.` });
    }
    catch (err) {
        next(err);
    }
};
exports.saveRecipeHandler = saveRecipeHandler;
