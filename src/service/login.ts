import { chromium,Page } from "playwright";
import { performActionOnElement } from "./pageUtils";

interface LoginParams {
    userName: string;
    password: string;
    moduleName: string;
    page?: Page;
    headless? : boolean
  }

const login =  async({ userName, password, moduleName, page,headless }: LoginParams) =>{
    if (!page) {
        const browser = await chromium.launch({ headless: headless || false });
        const context = await browser.newContext();
        page = await context.newPage();
      }

  try {
    await page.goto('https://vividtranstech.in/tancem/#/');
    await performActionOnElement(page,{action :"fill",isXpath : false,selector :'username',value :userName,valueType :"email",})
    await performActionOnElement(page,{action:"fill",isXpath : false,selector:'password',value : password,valueType:"string"})
    await performActionOnElement(page,{action:'click',isXpath : false,selector:'Log In'})
    await performActionOnElement(page,{action:'click',selector:`div.label:has-text("${moduleName}")`,waitOptions:{state:'visible',timeout:2000}})

  }
  
  catch(err){
    console.error("Error in login function: ", err);
    throw err;
  }
  finally{
    return page;
  }
}

export default login