import { createElementUtils, addClassToElement, removeClassOfElement, appendElement } from "./utils.js";

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

export function readTodos(rerun) {

    const pendingTodosContainer = document.querySelector('.pending-todos-container');
    const doneTodosContainer = document.querySelector('.done-todos-container');
    
    if (rerun === 'yes') {
        while (pendingTodosContainer.firstChild) {
            pendingTodosContainer.firstChild.remove();
        }

        while (doneTodosContainer.firstChild) {
            doneTodosContainer.firstChild.remove();
        }

        rerun === 'no';
    }

    const arrayLocalStorage = Object.keys(localStorage).sort();

    arrayLocalStorage.map((key) => {

        const todoObject = JSON.parse(localStorage.getItem(key));

        const inputContainer = createElementUtils('div'); // contains input, delete button and checkbox
        addClassToElement(inputContainer, 'input-container');

        const input = createElementUtils('input'); // create input
        addClassToElement(input, 'task-input');
        input.defaultValue = todoObject.todo;
        input.id = todoObject.id;


        const checkboxContainer = createElementUtils('div');
        addClassToElement(checkboxContainer, 'checkbox-container');
        const checkbox = createElementUtils('img');
        addClassToElement(checkbox, 'checkbox');
        appendElement(checkbox, checkboxContainer);
        appendElement(checkboxContainer, inputContainer);

        if (todoObject.done === true) {
            checkbox.src = './assets/check.svg';
        }

        const deleteButtonContainer = createElementUtils('div');

        addClassToElement(deleteButtonContainer, 'delete-button-container');

        const deleteButton = createElementUtils('img');
        deleteButton.src = './assets/delete_button.svg';

        addClassToElement(deleteButton, 'delete-button');
        appendElement(deleteButton, deleteButtonContainer);

        if (todoObject.done === true) {
            appendElement(inputContainer, doneTodosContainer);
            addClassToElement(input, 'done');
            appendElement(input, inputContainer);
        } else if (todoObject.done === false) {
            appendElement(inputContainer, pendingTodosContainer);
            appendElement(input, inputContainer);
        }

        appendElement(deleteButtonContainer, inputContainer);

        const toggledItem = localStorage.getItem('toggled');

        if (toggledItem === 'true' && todoObject.done === true) {
            addClassToElement(inputContainer, 'hide');

        } else if (toggledItem === 'false' && todoObject.done === true) {
            removeClassOfElement(inputContainer, 'hide');
        }

        // add event listener 
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

        // update todo with new value
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
