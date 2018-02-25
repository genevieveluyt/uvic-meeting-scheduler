import { List, fromJS } from 'immutable';

import { UPDATE_COURSE, ADD_COURSE, REMOVE_COURSE, UPDATE_SECTION } from '../actions/index';
import { LOAD_DATA, saveData } from '../actions/api';

/**
 * Sample structure
 * [
 *      {
 *          name: "CSC 110",
 *          sections: {
 *              A: "A01",
 *              B: "B06",
 *              ...
 *          }
 *      },
 *      ...
 * ]
 */

export default function(state=List(), action) {
    let newState = List();

    switch(action.type) {
        case LOAD_DATA:
            return fromJS(action.payload.userData);
        case UPDATE_COURSE:
            newState = state.map(course => {
                if (course.get('name') === action.payload.oldCourse) {
                    return fromJS(action.payload.newCourse);
                }
                return course;
            });
            break;
        case ADD_COURSE: 
            newState = state.push(fromJS(action.payload));
            break;
        case REMOVE_COURSE:
            newState = state.filter(course => {
                return course.get('name') !== action.payload;
            });
            break;
        case UPDATE_SECTION:
            newState = state.map(course => {
                if (course.get('name') === action.payload.course) {
                    return course.setIn(['sections', action.payload.sectionType], action.payload.section);
                }
                return course;
            });
            break;
        default:
            return state;
    }

    saveData(newState.toJS());
    return newState;
}