import { createTodo, readTodos } from "./localStorageAPI.js";

const input = document.querySelector('.insert-todo-input');
let inputValue = '';

const toggle = document.querySelector('.done-todos-description'); // select all div in toggle
const doneTodosContainer = document.querySelector('.done-todos-container');
const toggleButton = document.querySelector('.toggle-todos');


window.onload = readTodos('no');

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
    if (localStorage.getItem('toggled') === null) {
        localStorage.setItem('toggled', 'true');
        toggleButton.style.transform = 'rotate(180deg)';
    } else {
        if (localStorage.getItem('toggled') === 'false') {
            localStorage.setItem('toggled', 'true');
            toggleButton.style.transform = 'rotate(180deg)';
        } else {
            localStorage.setItem('toggled', 'false');
            toggleButton.style.transform = 'rotate(0deg)';
        }
    }

    for (let item of doneTodosContainer.children) {
        if (item.classList.contains('hide')) {
            item.classList.remove('hide');
        } else {
            item.classList.add('hide');
        }
    }
})