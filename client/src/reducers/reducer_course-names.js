import { List } from 'immutable';

import { GET_COURSE_NAMES } from '../actions/api';

export default function(state=List(), action) {
    switch(action.type) {
        case GET_COURSE_NAMES:
            return List(action.payload);
        default:
            return state;
    }
}
