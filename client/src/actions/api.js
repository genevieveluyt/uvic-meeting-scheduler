export const GET_COURSE_NAMES = 'GET_COURSE_NAMES';
export const LOAD_DATA = 'LOAD_DATA';

export function getRequest(path) {
    return fetch(path, {credentials: 'same-origin'}).then(response => response.json());
}

export function getCourseNames() {
    return {
        type: GET_COURSE_NAMES,
        payload: getRequest('/api/courses/names')
    }
}

export function saveData(data) {
    fetch('/api/me', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(data),
    })
}

export function loadData() {
    return {
        type: LOAD_DATA,
        payload: getRequest('/api/me')
    }
}
