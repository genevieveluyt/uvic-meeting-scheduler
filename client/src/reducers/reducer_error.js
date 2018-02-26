import { ERROR } from '../actions/index';

export default function(state='', action) {
    switch(action.type) {
        case ERROR:
            return action.payload;
        default:
            return '';
    }
}
