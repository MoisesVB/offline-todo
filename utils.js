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