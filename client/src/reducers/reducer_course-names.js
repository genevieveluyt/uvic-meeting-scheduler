import { GET_COURSE_NAMES } from '../actions/api';

export default function(state=[], action) {
    switch(action.type) {
        case GET_COURSE_NAMES:
            return action.payload;
        default:
            return state;
    }
}
