export const addClass = (element: Element, eClass: string): void => {
    if (!element) {
        return;
    }

    if (element.classList.contains(eClass)) {
        return;
    }

    element.classList.add(eClass);
}

export const removeClass = (element: Element, eClass: string): void => {
    if (!element) {
        return;
    }

    if (!element.classList.contains(eClass)) {
        return;
    }

    element.classList.remove(eClass);
}