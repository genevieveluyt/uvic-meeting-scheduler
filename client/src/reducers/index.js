import { combineReducers } from 'redux';

import CourseNames from './reducer_course_names';
import Courses from './reducer_courses';
import UserData from './reducer_user_data';
import Error from './reducer_error';

const rootReducer = combineReducers({
    courseNames: CourseNames,
    courses: Courses,
    userData: UserData,
    error: Error
});

export default rootReducer;
