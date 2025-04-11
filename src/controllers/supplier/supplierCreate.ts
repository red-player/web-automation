import { Request, Response } from 'express';
import login from '../../service/login';
import { password, posModuleName, materialUser } from '../../values/commonVariable';
import { fillFormFields } from '../../service/formFiller';
import { supplierFormFields } from '../../values/supplierCreate';
import { Page } from 'playwright';
import { performActionOnElement } from '../../service/pageUtils';
import { waitForApiResponse } from '../../service/waitForResponse';
import {navigateSidebarMenu} from "../../service/screenNavigate"

export const index = async (req : Request, res : Response) =>{

   const page = await login({userName:materialUser,password:password,moduleName : posModuleName})

   await supplierCreateAutomation(page)

    res.status(200).json({
        success: true,
        message : "supplier Group Create"
    })
}


 const supplierCreateAutomation = async (page : Page)=>{
 
    await navigateSidebarMenu(page,{
        first :'Supplier Registration',
        second :'Supplier Registered List'
    })
    // await performActionOnElement(page,{action:"click", selector :`a.nav-link:has-text(" Raw Materials ")`,waitOptions:{state:'visible',timeout:2000}})
    // await performActionOnElement(page, {
    //     action: "click",
    //     selector: '//a[contains(@class, "nav-link")]//span[normalize-space(.)="Material"]/..',
    //     waitOptions: { state: 'visible', timeout: 2000 }
    //   });
    //   await navigateSidebarMenu(page,{
    //     first :'Unloading',second :'Transport'
    // })

    await performActionOnElement(page,{action:"click", selector :'Create',isXpath : false,waitOptions:{state:'visible',timeout:2000}})
 
    await fillFormFields(page,supplierFormFields)

    // await performActionOnElement(page,{action :"click",selectorWithoutXpath :'submit',waitOptions:{state: 'visible',timeout : 2000}})
    // await performActionOnElement(page,{action :"click",selector :'button:has-text("Confirm")',waitOptions:{state: 'visible',timeout : 2000}})
    // const {body} = await waitForApiResponse(page,{
    //     urlContains :'/tancem/pos/v1/suppliers',
    //     method :'POST',
    //     timeout :10000
    // })
}

export default supplierCreateAutomation