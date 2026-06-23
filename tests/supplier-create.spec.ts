// tests/supplier-create.spec.ts
import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';
import login from '../src/service/login';
import { runWorkflow } from '../src/service/workflowRunner';
import { materialUser, password, posModuleName } from '../src/values/commonVariable';

test('POS Supplier Registration Automation via JSON Recipe', async ({ page }) => {
  const recipePath = path.join(__dirname, '../workflows/tancem-supplier-create.json');
  const raw = fs.readFileSync(recipePath, 'utf8');
  const recipe = JSON.parse(raw);

  // Perform login using configuration
  await login({ 
    userName: materialUser, 
    password, 
    moduleName: posModuleName, 
    page 
  });

  const variables = {
    username: materialUser,
    password,
    moduleName: posModuleName
  };

  const result = await runWorkflow(page, recipe, variables);
  
  expect(result.success).toBe(true);
});

