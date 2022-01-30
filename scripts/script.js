import { createElementUtils, appendElement, addClassToElement, removeClassOfElement } from "./utils.js";
import { addTodoInput, pendingTodosContainer, doneTodosContainer, plusIconContainer, toggleTodosSection, toggleIcon } from "./DOMelements.js";

// load all tasks when first load the page
window.onload = firstLoad();

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

function firstLoad() {
    addAllTodosDOM();
    firstCheckToggled();
}

function firstCheckToggled() {
    const toggled = localStorage.getItem('toggled');

    // if toggled is null them make false in website first access
    if (toggled === null) {
        localStorage.setItem('toggled', 'false');

        // if toggled is true then rotate 180deg and hide all done todos
    } else if (toggled === 'true') {
        toggleIcon.style.transform = 'rotate(180deg)';

        for (let item of doneTodosContainer.children) {
            item.classList.add('hide');
        }
    }
}

function createTodo(todo) {

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
        addTodoDOM(todoObject);
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
        addTodoDOM(todoObject);
    }
}

function addTodoDOM(todoObject) {

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

    setFocusAndBlur(input, plusIconContainer, todoObject);

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
}

function addAllTodosDOM() {
    const arrayLocalStorage = Object.keys(localStorage).sort(); // get a sorted array of local storage

    arrayLocalStorage.map((key) => {
        const todoObject = JSON.parse(localStorage.getItem(key)); // get todo in map loop
        addTodoDOM(todoObject);
    })
}

// delete todo from the local storage and update the dom accordingly
function deleteTodo(id) {
    localStorage.removeItem(id);

    // loop through the inputs to check if is the same id as requested to delete
    for (let item of document.querySelectorAll('input')) {
        if (item.id === id) {
            item.parentElement.remove(); // remove the input container (parent element)
        }
    }
}

function toggleCheckbox(targetObj, updatedState) {
    targetObj.done = updatedState;
    const targetId = '' + targetObj.id; // convert to string
    targetObj = JSON.stringify(targetObj);
    localStorage.setItem(targetId, targetObj);

    targetObj = JSON.parse(targetObj);

    for (let item of document.querySelectorAll('input')) {
        if (Number(item.id) === targetObj.id) {

            const checkbox = item.parentElement.children[0].children[0];

            if (targetObj.done === true) {
                appendElement(item.parentElement, doneTodosContainer);
                addClassToElement(item, 'done');

                // when new items are added to done make sure class are right

                // if toggled is true then hide element that was checked as done
                if (localStorage.getItem('toggled') === 'true') {
                    addClassToElement(item.parentElement, 'hide');
                }

                checkbox.src = './assets/check.svg';

            } else if (targetObj.done === false) {
                appendElement(item.parentElement, pendingTodosContainer);
                removeClassOfElement(item, 'done');
                checkbox.src = '';
            }
        }
    }
}

function renameTodo(targetObj, newValue) {
    targetObj.todo = newValue;
    const todoId = '' + targetObj.id;
    targetObj = JSON.stringify(targetObj);
    localStorage.setItem(todoId, targetObj);
    // syncTodos();

    targetObj = JSON.parse(targetObj);

    for (let item of document.querySelectorAll('input')) {
        if (Number(item.id) === targetObj.id) {
            item.defaultValue = targetObj.todo;
        }
    }
}

function addAllEventListeners(deleteButtonContainer, checkboxContainer, input, todoObject) {
    addDeleteEventListener(deleteButtonContainer, todoObject);
    addToggleCheckboxEventListener(checkboxContainer, todoObject);
    addRenameEventListener(input, todoObject);
}

function addDeleteEventListener(element, todoObject) {
    element.addEventListener('click', () => {
        const idString = '' + todoObject.id;
        deleteTodo(idString);
    })
}

function addToggleCheckboxEventListener(element, todoObject) {
    element.addEventListener('click', () => {
        if (todoObject.done === false) {
            toggleCheckbox(todoObject, true);
            new Audio('effect.mp3').play();

        } else if (todoObject.done === true) {
            toggleCheckbox(todoObject, false);
        }
    })
}

function addRenameEventListener(element, todoObject) {
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.value.length > 0) {
            e.target.blur();
        }
    })
}

function setFocusAndBlur(input, plusIconContainer, todoObject) {
    input.onfocus = () => {
        input.parentElement.style.outline = '1px solid rgba(0, 0, 0, 0.3)';
    }

    input.onblur = () => {
        input.parentElement.style.outline = 'none';

        // rename todo if it's on blur, has value in input and value is different from previous value
        // (both keyboard enter event and when input is not focused after click)
        if (input.value.length > 0 && input.value !== todoObject.todo) {
            renameTodo(todoObject, input.value);
        }
    }

    addTodoInput.onfocus = () => {
        addTodoInput.parentElement.style.outline = '1px solid rgba(0, 0, 0, 0.3)';
        plusIconContainer.classList.add('hide');
    }

    addTodoInput.onblur = () => {
        addTodoInput.parentElement.style.outline = 'none';
        plusIconContainer.classList.remove('hide');
    }
}

// toggle event listener
toggleTodosSection.addEventListener('click', () => {
    const toggled = localStorage.getItem('toggled');
    const styleToggleIcon = toggleIcon.style;

    // if toggle is true then make false after click and unhide done todos
    if (toggled === 'true') {
        localStorage.setItem('toggled', 'false');

        for (let item of doneTodosContainer.children) {
            removeClassOfElement(item, 'hide');
        }

        styleToggleIcon.transform = 'rotate(0deg)';

        // if toggle is false then make true after click and hide done todos
    } else if (toggled === 'false') {
        localStorage.setItem('toggled', 'true');

        for (let item of doneTodosContainer.children) {
            addClassToElement(item, 'hide');
        }

        styleToggleIcon.transform = 'rotate(180deg)';
    }
})