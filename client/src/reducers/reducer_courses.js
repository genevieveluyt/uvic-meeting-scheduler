import { fromJS, Map } from 'immutable';

import { ADD_COURSE_DATA, REMOVE_COURSE_DATA } from '../actions/index';
import { LOAD_DATA } from '../actions/api';

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
 * 
 * Sample structure:
 * {
 *      "CENG 421": {
 *          name: "CENG 421",
 *          sections: {
 *              A01: [
 *                  {
 *                      day: "M",
 *                      start: { hour: 13, minute: 30 },
 *                      end: { hour: 14, minute: 50 }
 *                  },
 *                  ...
 *              ],
 *              B01: ...
 *          }
 *      },
 *      ...
 * }
*/

export default function(state=Map(), action) {
    switch(action.type) {
        case LOAD_DATA:
            return fromJS(action.payload.data);
        case ADD_COURSE_DATA: 
            return state.set(action.payload.name, fromJS(action.payload));
        case REMOVE_COURSE_DATA:
            return state.delete(action.payload);
        default:
            return state;
    }
}
