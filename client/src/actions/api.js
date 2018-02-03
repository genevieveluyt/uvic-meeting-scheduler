export function getRequest(path) {
    return fetch(path).then(response => { return response.json() });
}