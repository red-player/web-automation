"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
// src/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const path_1 = __importDefault(require("path"));
const config_1 = require("./config");
const routes_1 = require("./routes");
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use((0, cors_1.default)());
exports.app.use((0, body_parser_1.json)());
// Serve captured screenshots statically
exports.app.use('/screenshots', express_1.default.static(path_1.default.join(process.cwd(), 'screenshots')));
// Serve the QA Dashboard UI
exports.app.get('/dashboard', (req, res) => {
    res.sendFile(path_1.default.join(process.cwd(), 'public', 'dashboard.html'));
});
exports.app.use(routes_1.routes);
// Global Error Handler Middleware
exports.app.use((err, req, res, next) => {
    console.error('🔥 Global Server Error:', err);
    res.status(500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});
exports.app.listen(config_1.PORT, () => {
    console.log(`running at http://localhost:${config_1.PORT}`);
});
