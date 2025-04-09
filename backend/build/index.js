"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bodyParser = __importStar(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
//
// The validation code library is shared between backend and frontend 
// without being published to npm.
// 
const validation_1 = require("validation");
const app = (0, express_1.default)();
const port = 5000;
//
// Enables JSON in the request body.
//
app.use(bodyParser.json());
//
// Enables cross origin resource sharing so the frontend can us this REST API.
//
app.use((0, cors_1.default)());
//
// List of items in the todo list.
// Normally in a production application this might be stored in a database.
// For simplicity it is stored in memory.
//
const todoList = [
    {
        text: "Feed the cat",
    },
    {
        text: "Go to work",
    },
    {
        text: "Have a delicious ice cream",
    },
];
//
// Adds an item to the todo list.
//
app.post("/todo", (req, res) => {
    const payload = req.body;
    const todoItem = payload.todoItem;
    const result = (0, validation_1.validateTodo)(todoItem);
    if (!result.valid) {
        res.status(400).json(result);
        return;
    }
    //
    // The todo item is valid, add it to the todo list.
    //
    todoList.push(todoItem);
    res.sendStatus(200);
});
//
// Gets the todo list.
//
app.get("/todos", (req, res) => {
    const response = {
        todoList: todoList,
    };
    res.json(response);
});
app.listen(port, () => {
    console.log(`Todo list app listening on port ${port}`);
});
