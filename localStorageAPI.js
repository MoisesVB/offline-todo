import { createElementUtils, addClassToElement, removeClassOfElement, appendElement } from "./utils.js";

const pendingTodosContainer = document.querySelector('.pending-todos-container');
const doneTodosContainer = document.querySelector('.done-todos-container');
const addTodoInput = document.querySelector('.insert-todo-input');
const toggledItem = localStorage.getItem('toggled');
const toggleButton = document.querySelector('.toggle-todos');

export function readTodos(rerun) {
    firstRenderToggleButton();
    rerenderTodos(rerun);
    renderTodos();
}

export function createTodo(todo) {

    let greaterKey = 0;
    const todoObject = {
        id: undefined,
        todo: todo,
        done: false
    }

    // add key to value of 1 if there are not keys in local storage
    if (localStorage.length === 0) {
        todoObject.id = 0;
        localStorage.setItem('0', JSON.stringify(todoObject));
        readTodos('yes');
    } else {

        // check for the greater id key
        for (let i = 0; i < localStorage.length; i++) {
            if (parseInt(localStorage.key(i)) > greaterKey) {
                greaterKey = parseInt(localStorage.key(i));
            }
        }

        // set the new key to plus 1 the previous key
        todoObject.id = greaterKey + 1;
        localStorage.setItem(`${greaterKey + 1}`, JSON.stringify(todoObject));
        readTodos('yes');
    }
}

// move the toggle img based on status of 'toggled' on local storage (first render)
function firstRenderToggleButton() {
    if (toggledItem === 'true') {
        toggleButton.style.transform = 'rotate(180deg)';
    } else {
        toggleButton.style.transform = 'rotate(0deg)';
    }
}

// remove all todos to rerender
function rerenderTodos(rerun) {
    if (rerun === 'yes') {
        while (pendingTodosContainer.firstChild) {
            pendingTodosContainer.firstChild.remove();
        }

        while (doneTodosContainer.firstChild) {
            doneTodosContainer.firstChild.remove();
        }

        rerun === 'no';
    }
}

function setFocusParentElement(focusChildElement) {
    focusChildElement.onfocus = () => {
        focusChildElement.parentElement.style.outline = '1px solid rgba(0, 0, 0, 0.3)';
    }
}

function setBlurParentElement(blurChildElement) {
    blurChildElement.onblur = () => {
        blurChildElement.parentElement.style.outline = 'none';
    }
}

function hideOrUnhideTodo(todo, target) {
    if (toggledItem === 'true' && todo.done === true) {
        addClassToElement(target, 'hide');

    } else if (toggledItem === 'false' && todo.done === true) {
        removeClassOfElement(target, 'hide');
    }
}

function renderTodos() {
    const arrayLocalStorage = Object.keys(localStorage).sort(); // get a sorted array of local storage

    arrayLocalStorage.map((key) => {
        const todoObject = JSON.parse(localStorage.getItem(key)); // get todo in map loop

        // create input container (input, delete button and checkbox)
        const inputContainer = createElementUtils('div');
        addClassToElement(inputContainer, 'input-container');

        // create checkbox container and append
        const checkboxContainer = createElementUtils('div');
        addClassToElement(checkboxContainer, 'checkbox-container');
        appendElement(checkboxContainer, inputContainer);

        // create checkbox and append
        const checkbox = createElementUtils('img');
        addClassToElement(checkbox, 'checkbox');
        appendElement(checkbox, checkboxContainer);

        // create input  
        const input = createElementUtils('input');
        addClassToElement(input, 'task-input');
        input.autocomplete = 'off';
        input.defaultValue = todoObject.todo;
        input.id = todoObject.id;

        setFocusParentElement(input);
        setBlurParentElement(input);

        setFocusParentElement(addTodoInput);
        setBlurParentElement(addTodoInput);

        if (todoObject.done === true) {
            appendElement(inputContainer, doneTodosContainer);
            addClassToElement(input, 'done');
            checkbox.src = './assets/check.svg';
            appendElement(input, inputContainer);
        } else if (todoObject.done === false) {
            appendElement(inputContainer, pendingTodosContainer);
            appendElement(input, inputContainer);
        }

        // create delete button container and append
        const deleteButtonContainer = createElementUtils('div');
        addClassToElement(deleteButtonContainer, 'delete-button-container');
        appendElement(deleteButtonContainer, inputContainer);

        // create delete button and append
        const deleteButton = createElementUtils('img');
        addClassToElement(deleteButton, 'delete-button');
        deleteButton.src = './assets/delete_button.svg';
        appendElement(deleteButton, deleteButtonContainer);

        hideOrUnhideTodo(todoObject, inputContainer);
    
        // delete todo
        deleteButtonContainer.addEventListener('click', () => {
            const idString = '' + todoObject.id;
            deleteTodo(idString);
        })

        // toggle checkbox 
        checkboxContainer.addEventListener('click', (e) => {
            if (todoObject.done === false) {
                toggleCheckbox(todoObject.id, true);
            } else if (todoObject.done === true) {
                toggleCheckbox(todoObject.id, false);
            }
        })

        // rename todo
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                updateTodo(todoObject.id, input.value);
            }
        })
    })
}

function deleteTodo(id) {
    localStorage.removeItem(id);
    readTodos('yes');
}

function toggleCheckbox(id, updatedState) {
    let targetObj = JSON.parse(localStorage.getItem(id));
    targetObj.done = updatedState;
    targetObj = JSON.stringify(targetObj);
    localStorage.setItem(id, targetObj);
    readTodos('yes');
}

function updateTodo(id, newValue) {
    let targetObj = JSON.parse(localStorage.getItem(id));
    targetObj.todo = newValue;
    targetObj = JSON.stringify(targetObj);
    localStorage.setItem(id, targetObj);
    readTodos('yes');
}
