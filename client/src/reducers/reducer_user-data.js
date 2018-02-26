import { List, fromJS } from 'immutable';

import { UPDATE_COURSE, ADD_COURSE, REMOVE_COURSE, UPDATE_SECTION, ADD_SCHEDULE,
    REMOVE_SCHEDULE, UPDATE_SCHEDULE } from '../actions/index';
import { LOAD_DATA, saveData } from '../actions/api';

/**
 * Sample structure
 * [
 *      {
 *          name: "Schedule 1",
 *          courses: [
 *              {
 *                  name: "CSC 110",
 *                  sections: {
 *                      A: "A01",
 *                      B: "B06",
 *                      ...
 *                  }
 *              },
 *              ...
 *          ],
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
            newState = state.map(schedule => {
                if (schedule.get('name') === action.payload.schedule) {
                    return schedule.update('courses', courses => 
                        courses.map(course => {
                            if (course.get('name') === action.payload.oldCourse) {
                                return fromJS(action.payload.newCourse);
                            }
                            return course;
                        })
                    );
                }
                return schedule;
            })
            break;
        case ADD_COURSE: 
            newState = state.map(schedule => {
                if (schedule.get('name') === action.payload.schedule) {
                    return schedule.update('courses', courses =>
                        courses.push(fromJS(action.payload.course))
                    );
                }
                return schedule;
            })
            break;
        case REMOVE_COURSE:
            newState = state.map(schedule => {
                if (schedule.get('name') === action.payload.schedule) {
                    return schedule.update('courses', courses =>
                        courses.filter(course => 
                            course.get('name') !== action.payload.course
                        )
                    );
                }
                return schedule;
            });
            break;
        case UPDATE_SECTION:
            newState = state.map(schedule => {
                if (schedule.get('name') === action.payload.schedule) {
                    return schedule.update('courses', courses =>
                        courses.map(course => {
                            if (course.get('name') === action.payload.course) {
                                return course.setIn(['sections', action.payload.sectionType], action.payload.section);
                            }
                            return course;
                        })
                    );
                }
                return schedule;
            })
            break;
        case ADD_SCHEDULE:
            newState = state.push(fromJS({
                name: action.payload,
                courses: []
            }));
            break;
        case REMOVE_SCHEDULE:
            newState = state.filter(schedule => {
                return schedule.get('name') !== action.payload;
            });
            break;
        case UPDATE_SCHEDULE:
            newState = state.map(schedule => {
                if (schedule.get('name') === action.payload.oldSchedule) {
                    return schedule.set('name', action.payload.newSchedule);
                }
                return schedule;
            });
            break;
        default:
            return state;
    }

    saveData(newState.toJS());
    return newState;
}
