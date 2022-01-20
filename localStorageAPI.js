export function createTodo(todo) {

    let greaterKey = 0;
    const objTodo = {
        id: undefined,
        todo: todo,
        done: false
    }

    // add key to value of 1 if there are not keys in local storage
    if (window.localStorage.length === 0) {
        objTodo.id = 0;
        window.localStorage.setItem('0', JSON.stringify(objTodo));
        readTodos('yes');
    } else {

        // check for the greater id key
        for (let i = 0; i < window.localStorage.length; i++) {
            if (parseInt(window.localStorage.key(i)) > greaterKey) {
                greaterKey = parseInt(window.localStorage.key(i));
            }
        }

        // set the new key to plus 1 the previous key
        objTodo.id = greaterKey + 1;
        window.localStorage.setItem(`${greaterKey + 1}`, JSON.stringify(objTodo));
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

        const objTodo = JSON.parse(window.localStorage.getItem(key));

        const newContainer = document.createElement('div'); // contains input, delete button and checkbox
        newContainer.classList.add('input-container');

        const newTodo = document.createElement('input'); // create input
        newTodo.classList.add('task-input');
        newTodo.defaultValue = objTodo.todo;
        newTodo.id = objTodo.id;

        const checkboxContainer = document.createElement('div');
        checkboxContainer.classList.add('checkbox-container');
        const checkbox = document.createElement('img');
        checkbox.classList.add('checkbox');
        checkboxContainer.appendChild(checkbox);
        newContainer.appendChild(checkboxContainer);

        if (objTodo.done === true) {
            checkbox.src = './assets/check.svg';
        }

        const deleteButtonContainer = document.createElement('div');
        deleteButtonContainer.classList.add('delete-button-container');
        const deleteButton = document.createElement('img');
        deleteButton.src = './assets/delete_button.svg';
        deleteButton.classList.add('delete-button');
        deleteButtonContainer.appendChild(deleteButton);

        if (objTodo.done === true) {
            doneTodosContainer.appendChild(newContainer);
            newTodo.classList.add('done');
            newContainer.appendChild(newTodo);
        } else if (objTodo.done === false) {
            pendingTodosContainer.appendChild(newContainer);
            newContainer.appendChild(newTodo);
        }

        newContainer.appendChild(deleteButtonContainer);

        if (localStorage.getItem('toggled') === 'true' && objTodo.done === true) {
            newContainer.classList.add('hide');

        } else if (localStorage.getItem('toggled') === 'false' && objTodo.done === true) {
            newContainer.classList.remove('hide');
        }

        // add event listener 
        deleteButtonContainer.addEventListener('click', () => {
            const idString = '' + objTodo.id;
            deleteTodo(idString);
        })

        // toggle checkbox 
        checkboxContainer.addEventListener('click', (e) => {
            if (objTodo.done === false) {
                toggleCheckbox(objTodo.id, true);
            } else if (objTodo.done === true) {
                toggleCheckbox(objTodo.id, false);
            }
        })

        // update todo with new value
        newTodo.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                updateTodo(objTodo.id, newTodo.value);
            }
        })
    })
}

function deleteTodo(id) {
    window.localStorage.removeItem(id);
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