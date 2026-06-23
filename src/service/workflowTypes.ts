import { FormField } from './formFillerTypes';

export type StepType =
  | 'goto'
  | 'click'
  | 'fill'
  | 'fillForm'
  | 'selectOption'
  | 'check'
  | 'uncheck'
  | 'waitForSelector'
  | 'waitForResponse'
  | 'assertText'
  | 'screenshot'
  | 'navigateSidebar';

export interface WorkflowStep {
  type: StepType;
  
  // For 'goto'
  url?: string;
  
  // For 'click', 'fill', 'selectOption', 'check', 'uncheck', 'waitForSelector'
  selector?: string;
  isXpath?: boolean;
  
  // For element resolution
  name?: string;
  
  // For 'fill', 'selectOption'
  value?: string;
  
  // For 'fillForm'
  fields?: FormField[];
  
  // For 'navigateSidebar'
  levels?: { [key: string]: string };
  
  // For 'waitForResponse'
  urlContains?: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  statusCode?: number;
  
  // For 'assertText'
  text?: string;
  
  // For 'screenshot'
  screenshotName?: string;
  
  // General timeout options
  timeout?: number;
}

export interface Workflow {
  name: string;
  description?: string;
  steps: WorkflowStep[];
}
