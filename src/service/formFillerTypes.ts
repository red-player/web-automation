// FormFillerTypes.ts

export type CharacterSet = 'alpha' | 'numeric' | 'alphanumeric' | 'specialChars';

export type InputMode =  'default' | 'email' | 'phoneNumber' | 'name' | 'sentence'|'PAN'|'GST'|'Aadhaar'|'websiteWithoutHttps'|'websiteWithHttps'|'country'|'pincode'|'address'|'city'|'state'|'companyName'|'companyAddress'|'companyWebsite'|'companyEmail'|'companyPhoneNumber';

export interface GenerateTestInputOptions {
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  allowSpaces?: boolean;
  charSet?: CharacterSet[];
  meaningfulWordsOnly?: boolean;
  mode?: InputMode;
}

export interface FormField {
  name: string;
  type: 'input' | 'dropdown' | 'radio' | 'date' | 'textarea';
  selector ?: string;
  value?: string | boolean;
  dropdownOptionSelector?: string;
  valueType?: 'string' | 'number' | 'alphanumeric' | 'email' | 'date';
  required?: boolean;
  exactLength?: number;
  minLength?: number;
  maxLength?: number;
  inputOptions?: GenerateTestInputOptions;
}
