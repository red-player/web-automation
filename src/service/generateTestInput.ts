// generateTestInput.ts

import {InputMode,CharacterSet} from "./formFillerTypes"

interface GenerateTestInputOptions {
  minLength?: number;
  maxLength?: number;
  exactLength?: number;
  allowSpaces?: boolean;
  charSet?: CharacterSet[];
  meaningfulWordsOnly?: boolean;
  mode?: InputMode;
}

const sampleWords = [
    'Ocean', 'River', 'Star', 'Sky', 'Bridge', 'Harmony', 'Future',
    'Lighthouse', 'Falcon', 'Summit', 'Nova', 'Pulse', 'Echo', 'Glide',
    'Quest', 'Vista', 'Zephyr', 'Bliss', 'Nimbus', 'Drift', 'Ray'
  ];
const sampleWordsSmallCase = [
    'ocean', 'river', 'star', 'sky', 'bridge',
    'harmony', 'future', 'lighthouse', 'falcon', 'summit',
    'forest', 'mountain', 'dream', 'vision', 'cloud',
    'path', 'sunrise', 'unity', 'energy', 'peace'
  ];
  

const sampleWords2 = ['in','com','org']

const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const getRandom = (arr: string | string[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomChar = (from: string) => from.charAt(Math.floor(Math.random() * from.length));
const stateCodes = [
    '01','02','03','04','05','06','07','08','09','10',
    '11','12','13','14','15','16','17','18','19','20',
    '21','22','23','24','25','26','27','28','29','30',
    '31','32','33','34','35','36','37','38'
  ];
const getAlpha = () => getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const getDigit = () => getRandomChar('0123456789');
const countries = ['India'];
const cities = [ 'Chennai','Coimbatore','Madurai','Tiruchirappalli','Salem','Erode','Tirunelveli','Vellore','Thoothukudi','Dindigul',];
const states = ['Tamil Nadu'];
const companyWords = ['TechNova', 'InnoSoft', 'GreenByte', 'SysCorp', 'DataEdge'];

export const generateTestInput = (options: GenerateTestInputOptions = {}): string => {
    const {
      minLength = 5,
      maxLength = 15,
      exactLength,
      allowSpaces = false,
      charSet = ['alphanumeric'],
      meaningfulWordsOnly = false,
      mode = 'default'
    } = options;

    const length = exactLength ?? Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;
  
    if (mode === 'email') {
      return `test${Math.floor(Math.random() * 10000)}@gmail.com`;
    }
  
    if (mode === 'phoneNumber') {
      return `9${Math.floor(100000000 + Math.random() * 900000000)}`;
    }
  
    if (mode === 'PAN') {
        const entityTypes = ['P', 'F', 'C', 'H', 'A', 'T']; 
        const randomLetter = () => getRandomChar('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
        const randomDigit = () => getRandomChar('0123456789');
      
        const part1 = randomLetter() + randomLetter() + randomLetter(); 
        const entityChar = getRandom(entityTypes);                     
        const part2 = randomLetter();                                  
        const part3 = Array.from({ length: 4 }, randomDigit).join(''); 
        const part4 = randomLetter();                                  
      
        return `${part1}${entityChar}${part2}${part3}${part4}`;
      }

    if(mode === "websiteWithoutHttps"){
        return `www.${getRandom(sampleWordsSmallCase)}.${getRandom(sampleWords2)}`
    }  
    if(mode === "websiteWithHttps"){
        return `https://www.${getRandom(sampleWordsSmallCase)}.${getRandom(sampleWords2)}`
    }  
    if (mode === 'GST') {
        const stateCode = getRandom(stateCodes); 
        const pan =
          getAlpha() + getAlpha() + getAlpha() + getAlpha() + getAlpha() +
          getDigit() + getDigit() + getDigit() + getDigit() + getAlpha(); 
        const entityNumber = getDigit(); 
        const defaultZ = 'Z';
        const checkDigit = getAlpha(); 
      
        return stateCode + pan + entityNumber + defaultZ + checkDigit;
      }
      
      if (mode === 'country') {
        return getRandom(countries);
      }
      
      if (mode === 'pincode') {
        return `${Math.floor(600001 + Math.random() * (643999 - 600001))}`;
      }
      
      if (mode === 'address') {
        return `${Math.floor(Math.random() * 500)} ${getRandom(sampleWords)} Street`;
      }
      
      if (mode === 'city') {
        return getRandom(cities);
      }
      
      if (mode === 'state') {
        return getRandom(states);
      }
      
      if (mode === 'companyName') {
        const word1 = getRandom(companyWords);
        const word2 = getRandom(sampleWords);
        return `${word1} ${word2}`;
      }
      
      if (mode === 'companyAddress') {
        return `Plot ${Math.floor(Math.random() * 100)}, Sector ${Math.floor(Math.random() * 10)}, ${getRandom(cities)}`;
      }
      
      if (mode === 'companyWebsite') {
        const domain = getRandom(companyWords).toLowerCase();
        return `https://www.${domain}.com`;
      }
      
      if (mode === 'companyEmail') {
        const prefix = `info${Math.floor(Math.random() * 100)}`;
        const domain = getRandom(companyWords).toLowerCase();
        return `${prefix}@${domain}.com`;
      }
      
      if (mode === 'companyPhoneNumber') {
        return `0${Math.floor(1000000000 + Math.random() * 900000000)}`; // 11-digit landline
      }
      
      
      
    if ((meaningfulWordsOnly || mode === 'name' || mode === 'sentence')) {
        let words = '';
        const wordCount = mode === 'sentence' ? Math.ceil(length / 6) : 1;
      
        let attempts = 0;
        while (words.length < length && words.split(' ').length < wordCount && attempts < 10) {
          const word = getRandom(sampleWords);
          if (words.length + word.length + 1 <= length) {
            words += words.length && allowSpaces ? ' ' + word : word;
          }
          attempts++;
        }
      
        if (!words.trim()) {
            const fallbackWord = getRandom(sampleWords);
            return fallbackWord.slice(0, length);
          }
      
        return words;
      }
      
  
    // --- Handle random character generation based on charSet
    let charset = '';
    if (charSet.includes('alpha')) charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (charSet.includes('numeric')) charset += '0123456789';
    if (charSet.includes('alphanumeric')) charset += 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    if (charSet.includes('specialChars')) charset += specialChars;
    if (allowSpaces) charset += ' ';
  
    if (!charset) charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; // fallback to alpha
  
    let result = '';
    for (let i = 0; i < length; i++) {
      result += getRandomChar(charset);
    }
  
    return result;
  };
  
