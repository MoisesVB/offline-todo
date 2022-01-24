import { pendingTodosContainer, doneTodosContainer, plusIconContainer } from "./DOMelements.js";
import { addAllEventListeners, createElementUtils, addClassToElement, appendElement, setFocusAndBlur } from "./utils.js";
import { setLocalStorageItem, removeLocalStorageItem } from "./localStorageAPI.js";

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
        setLocalStorageItem('0', JSON.stringify(todoObject));
        syncTodos('yes');
    } else {

        // check for the greater id key
        for (let i = 0; i < localStorage.length; i++) {
            if (parseInt(localStorage.key(i)) > greaterKey) {
                greaterKey = parseInt(localStorage.key(i));
            }
        }

        // set the new key to plus 1 the previous key
        todoObject.id = greaterKey + 1;
        setLocalStorageItem(`${greaterKey + 1}`, JSON.stringify(todoObject));
        syncTodos('yes');
    }
}

export function syncTodos(remove) {
    removeAllTodos(remove);
    createAllTodos();
}

export function removeAllTodos(remove) {
    if (remove === 'yes') {
        while (pendingTodosContainer.firstChild) {
            pendingTodosContainer.firstChild.remove();
        }

        while (doneTodosContainer.firstChild) {
            doneTodosContainer.firstChild.remove();
        }

        remove === 'no';
    }
}

export function createAllTodos() {
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

        setFocusAndBlur(input, plusIconContainer);

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
    
        addAllEventListeners(deleteButtonContainer, checkboxContainer, input, todoObject);
    })

    
}

export function deleteTodo(id) {
    removeLocalStorageItem(id);
    syncTodos('yes');
}

export function toggleCheckbox(id, updatedState) {
    let targetObj = JSON.parse(localStorage.getItem(id));
    targetObj.done = updatedState;
    targetObj = JSON.stringify(targetObj);
    setLocalStorageItem(id, targetObj);
    syncTodos('yes');
}

export function updateTodo(id, newValue) {
    let targetObj = JSON.parse(localStorage.getItem(id));
    targetObj.todo = newValue;
    targetObj = JSON.stringify(targetObj);
    setLocalStorageItem(id, targetObj);
    syncTodos('yes');
}