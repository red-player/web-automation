// tests/supplier-create.spec.ts
import { test } from '@playwright/test';
import login from '../src/service/login';
import  supplierCreateAutomation  from '../src/controllers/supplier/supplierCreate';
import { materialUser, password, posModuleName } from '../src/values/commonVariable';

test('POS Supplier Registration Automation', async () => {
 const page = await login({ userName : materialUser, password, moduleName: posModuleName,headless : true });
  await supplierCreateAutomation(page);
});
