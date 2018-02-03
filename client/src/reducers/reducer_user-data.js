import { UPDATE_COURSE, ADD_COURSE, REMOVE_COURSE, UPDATE_SECTION } from '../actions/index';

export default function(state=[], action) {
    switch(action.type) {
        case UPDATE_COURSE:
            return state.map(course => {
                if (course.name === action.payload.oldCourse) {
                    return {name: action.payload.newCourse};
                }
                return course;
            })
        case ADD_COURSE: 
            return [...state, action.payload];
        case REMOVE_COURSE:
            return state.filter(course => {
                return course.name !== action.payload;
            })
        case UPDATE_SECTION:
            return state.map(course => {
                if (course.name === action.payload.name) {
                    return action.payload;
                }
                return course;
            })
        default:
            return state;
    }
}