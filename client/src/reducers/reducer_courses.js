import { ADD_COURSE_DATA, REMOVE_COURSE_DATA } from '../actions/index';

/*
 * This reducer is used as a cache.
 * 
 * If a meeting is being scheduled, participants are obviously enrolled
 * in the same class (and likely share others as well) so when a course is
 * added for a schedule, check if course data is available already, otherwise
 * pull all data for that course (sections) and only remove it if no schedules
 * reference that course.
 * 
 * Note: this logic is handled by actions
*/

export default function(state=[], action) {
    switch(action.type) {
        case ADD_COURSE_DATA: 
            return [...state, action.payload];
        case REMOVE_COURSE_DATA:
            return state.filter(course => {
                return course.name !== action.payload;
            })
        default:
            return state;
    }
}