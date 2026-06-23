"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_HEADLESS = exports.DEFAULT_PASSWORD = exports.DEFAULT_USER = exports.BASE_PATH = exports.BASE_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.PORT = process.env.PORT || '2000';
exports.BASE_URL = process.env.URL || 'https://vividtranstech.in/tancem/#/';
exports.BASE_PATH = process.env.envUrl || '/tancem-automation/v1';
exports.DEFAULT_USER = process.env.DEFAULT_USER || 'subramani@gmail.com';
exports.DEFAULT_PASSWORD = process.env.DEFAULT_PASSWORD || 'test@123';
exports.DEFAULT_HEADLESS = process.env.DEFAULT_HEADLESS !== 'false';
