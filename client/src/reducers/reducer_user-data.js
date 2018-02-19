import { UPDATE_COURSE, ADD_COURSE, REMOVE_COURSE, UPDATE_SECTION } from '../actions/index';
import { LOAD_DATA, saveData } from '../actions/api';

export default function(state=[], action) {
    let newState = [];

    switch(action.type) {
        case LOAD_DATA:
            return action.payload.userData;
        case UPDATE_COURSE:
            newState = state.map(course => {
                if (course.name === action.payload.oldCourse) {
                    return {name: action.payload.newCourse};
                }
                return course;
            });
            break;
        case ADD_COURSE: 
            newState = [...state, action.payload];
            break;
        case REMOVE_COURSE:
            newState = state.filter(course => {
                return course.name !== action.payload;
            });
            break;
        case UPDATE_SECTION:
            newState = state.map(course => {
                if (course.name === action.payload.name) {
                    return action.payload;
                }
                return course;
            });
            break;
        default:
            return state;
    }

    saveData(newState);
    return newState;
}