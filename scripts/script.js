import { syncTodos, createTodo } from "./CRUD.js";
import { addTodoInput } from "./DOMelements.js"

// load all tasks when first load the page
window.onload = syncTodos('no');

let inputValue = '';

addTodoInput.addEventListener('input', (e) => {
    inputValue = e.target.value;
})

addTodoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && inputValue.length > 0) {
        createTodo(inputValue);
        e.target.value = '';
        inputValue = '';
    }
})