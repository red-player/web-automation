import {FormField} from '../service/formFillerTypes'
import {angularDropDownSelector} from './commonVariable'
export const supplierFormFields: FormField[] = [
  {
    name: 'supplierName',
    type: 'input',
    valueType: 'string',
    inputOptions: {
      mode: 'name',
      charSet : ["alpha"],
      maxLength: 20,
      allowSpaces: true,
      meaningfulWordsOnly : true,
    }
  },
  {
    name :"contactPerson",
    type :"input",
    valueType :"string",
    inputOptions :{
      mode: 'name',
      charSet : ["alpha"],
      minLength: 5,
      maxLength: 20,
      allowSpaces: true,
      meaningfulWordsOnly : true,
    }
  },
  {
    name :"officePhoneNumber",
    type :"input",
    valueType :"number",
    inputOptions :{
      mode :"companyPhoneNumber",
    }
  },
  {
    name :"mobileNumber",
    type :"input",
    inputOptions :{
      mode :"phoneNumber",
    }
  },
  {
    name :"email",
    type :"input",
    valueType:"email",
    inputOptions :{
      mode :"email",
    }
  },
  {
    name :"panNumber",
    type :"input",
    valueType :"alphanumeric",
    inputOptions :{
      mode :"PAN",
    }
  },
  {
    name :"website",
    type :"input",
    valueType :"string",
    inputOptions :{
      mode :"websiteWithHttps",
    }
  },
  {
    name :"gstNumber",
    type :"input",
    valueType :"alphanumeric",
    inputOptions :{
      mode :"GST",
    }
  },
  {
    name :"country",
    type :"input",
    valueType :"string",
    inputOptions :{
      mode :"country",
    }
  },
  {
    name :"pincode",
    type :"input",
    valueType :"string",
    inputOptions :{
      mode :"pincode",
    }
  },
  {
    name :"city",
    type :"input",
    valueType :"string",
    inputOptions :{
      mode :"city",
    }
  },
  {
    name :"supplierType",
    type :"dropdown",
    selector :'p-dropdown[formcontrolname="supplierType"]',
    dropdownOptionSelector :angularDropDownSelector
  },
  {
    name :"state",
    type :"dropdown",
    selector :'p-dropdown[formcontrolname="state"]',
    dropdownOptionSelector :angularDropDownSelector
  },
  {
    name :"district",
    type :"dropdown",
    selector :'p-dropdown[formcontrolname="district"]',
    dropdownOptionSelector :angularDropDownSelector
  },
 
  {
    name :"Address Type",
    type :"radio",
    value : 'permanent',
    selector :"input[type='radio'][formcontrolname='type'][value='permanent']"
  }

  ];
  
