"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const axios_1 = __importDefault(require("axios"));
const react_1 = require("react");
//
// The validation code library is shared between backend and frontend 
// 
const validation_1 = require("validation");
//
// In a production build you'd want to plugin the location of your production REST API.
//
const BASE_URL = "http://localhost:5000";
function App() {
    const [todoList, setTodoList] = (0, react_1.useState)([]);
    const [newTodoItemText, setNewTodoItemText] = (0, react_1.useState)("");
    (0, react_1.useEffect)(() => {
        //
        // Retreive the todo list from the backend.
        //
        axios_1.default.get(`${BASE_URL}/todos`)
            .then(({ data }) => {
            setTodoList(data.todoList);
        })
            .catch(err => {
            console.error(`Failed to retrieve todo list:`);
            console.error(err);
        });
    }, []);
    //
    // Adds a new todo item.
    //
    function onAddNewTodoItem() {
        return __awaiter(this, void 0, void 0, function* () {
            const newTodoItem = { text: newTodoItemText };
            const result = (0, validation_1.validateTodo)(newTodoItem);
            if (!result.valid) {
                alert(`Validation failed: ${result.message}`);
                return;
            }
            yield axios_1.default.post(`${BASE_URL}/todo`, { todoItem: newTodoItem });
            setTodoList(todoList.concat([newTodoItem]));
            setNewTodoItemText("");
        });
    }
    if (todoList === undefined) {
        return (0, jsx_runtime_1.jsx)("div", { children: "Loading..." });
    }
    return ((0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: todoList.map((todo, index) => {
                    return ((0, jsx_runtime_1.jsx)("div", { children: todo.text }, index));
                }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { children: (0, jsx_runtime_1.jsx)("textarea", { placeholder: "Write a new todo list item here", value: newTodoItemText, onChange: evt => setNewTodoItemText(evt.currentTarget.value) }) }), (0, jsx_runtime_1.jsx)("button", Object.assign({ onClick: onAddNewTodoItem }, { children: "Add todo item" }))] })] }));
}
exports.App = App;
