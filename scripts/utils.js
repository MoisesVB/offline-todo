import { deleteTodo, toggleCheckbox, updateTodo } from "./CRUD.js";
import { addTodoInput } from "./DOMelements.js";

export function createElementUtils(elementToCreate) {
    /**
     * @param {String} elementToCreate
     */

    return document.createElement(elementToCreate);
}

export function appendElement(elementToAppend, parentElement) {
    parentElement.appendChild(elementToAppend);
}

export function addClassToElement(elementToAddClass, classToAdd) {
    /**
     * @param {Object} elementToAddClass element that needs to be added
     * @param {String} classToAdd string (class) that needs to be added
     */

    elementToAddClass.classList.add(classToAdd);
}

export function removeClassOfElement(elementToRemoveClass, classToRemove) {
    /**
     * @param {Object} elementToAddClass element to remove class
     * @param {String} classToAdd string (class) that needs to be removed
     */

    elementToRemoveClass.classList.remove(classToRemove);
}

export function setFocusParentElement(focusChildElement) {
    focusChildElement.onfocus = () => {
        focusChildElement.parentElement.style.outline = '1px solid rgba(0, 0, 0, 0.3)';
    }
}

export function setBlurParentElement(blurChildElement) {
    blurChildElement.onblur = () => {
        blurChildElement.parentElement.style.outline = 'none';
    }
}

export function addAllEventListeners(deleteButtonContainer, checkboxContainer, input, todoObject) {
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
            toggleCheckbox(todoObject.id, true);
        } else if (todoObject.done === true) {
            toggleCheckbox(todoObject.id, false);
        }
    })
}

function addRenameEventListener(element, todoObject) {
    element.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            updateTodo(todoObject.id, element.value);
        }
    })
}

export function setFocusAndBlur(input, plusIconContainer) {
    setFocusParentElement(input);
    setBlurParentElement(input);

    addTodoInput.onfocus = () => {
        addTodoInput.parentElement.style.outline = '1px solid rgba(0, 0, 0, 0.3)';
        plusIconContainer.classList.add('hide');
    }

    addTodoInput.onblur = () => {
        addTodoInput.parentElement.style.outline = 'none';
        plusIconContainer.classList.remove('hide');
    }
}