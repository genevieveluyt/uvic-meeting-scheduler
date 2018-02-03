import { combineReducers } from 'redux';

import CourseNames from './reducer_course-names';
import Courses from './reducer_courses';
import UserData from './reducer_user-data';

const rootReducer = combineReducers({
    courseNames: CourseNames,
    courses: Courses,
    userData: UserData
});

export default rootReducer;