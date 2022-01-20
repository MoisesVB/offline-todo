import { createTodo, readTodos } from "./localStorageAPI.js";
import { addClassToElement, removeClassOfElement } from "./utils.js";

window.onload = readTodos('no');

const input = document.querySelector('.insert-todo-input');
const toggle = document.querySelector('.done-todos-description'); // select all div in toggle
const doneTodosContainer = document.querySelector('.done-todos-container');
const toggleButton = document.querySelector('.toggle-todos');

let inputValue = '';


input.addEventListener('input', (e) => {
    inputValue = e.target.value;
})

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && inputValue.length > 0) {
        createTodo(inputValue);
        e.target.value = '';
        inputValue = '';
    }
})

toggle.addEventListener('click', () => {
    const toggledLocalStorage = localStorage.getItem('toggled');
    let style = toggleButton.style;

    if (toggledLocalStorage === null) {
        localStorage.setItem('toggled', 'true');
        style.transform = 'rotate(180deg)';
    } else {
        if (toggledLocalStorage === 'false') {
            localStorage.setItem('toggled', 'true');
            style.transform = 'rotate(180deg)';
        } else {
            localStorage.setItem('toggled', 'false');
            style.transform = 'rotate(0deg)';
        }
    }

    for (let item of doneTodosContainer.children) {
        if (item.classList.contains('hide')) {
            removeClassOfElement(item, 'hide');
        } else {
            addClassToElement(item, 'hide');
        }
    }
})