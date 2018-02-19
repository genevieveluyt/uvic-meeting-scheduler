import { getRequest } from './api';

export const UPDATE_COURSE = 'UPDATE_COURSE';
export const ADD_COURSE = 'ADD_COURSE';
export const ADD_COURSE_DATA = 'ADD_COURSE_DATA';
export const REMOVE_COURSE = 'REMOVE_COURSE';
export const REMOVE_COURSE_DATA = 'REMOVE_COURSE_DATA';
export const UPDATE_SECTION = 'UPDATE_SECTION';


/**
 * 
 * @param {string} oldCourse 
 * @param {string} newCourse 
 */
export function updateCourse(oldCourse, newCourse) {
    return (dispatch, getState) => {
        dispatch(removeCourseData(oldCourse));
        dispatch(addCourseData(newCourse));
        dispatch({
            type: UPDATE_COURSE,
            payload: {oldCourse, newCourse}
        })
    }
}

/**
 * 
 * @param {string} course 
 */
export function addCourse(course) {
    return (dispatch, getState) => {
        const { courses } = getState();
        if (!(course.name in courses.map(course => course.name))) {
            dispatch(addCourseData(course));
        }

        dispatch({
            type: ADD_COURSE,
            payload: {name: course}
        })
    }
}

export function addCourseData(course) {
    return {
        type: ADD_COURSE_DATA,
        payload: getRequest(`/api/courses/${course}`)
    }
}

/**
 * TODO: add logic to only remove course if there are no references to it by other schedules
 * @param {string} course : course name
 */
export function removeCourse(course) {
    return (dispatch, getState) => {
        dispatch(removeCourseData(course));
        dispatch({
            type: REMOVE_COURSE,
            payload: course
        });
    }
}

export function removeCourseData(course) {
    return {
        type: REMOVE_COURSE_DATA,
        payload: course
    }
}

/**
 * 
 * @param {string} course 
 * @param {string} section
 */
export function updateSection(course, section) {
    return (dispatch, getState) => {
        const { userData } = getState();
        
        let courseData = userData.find(c => c.name === course);
        courseData[section.substring(0, 1)] = section;
        dispatch({
            type: UPDATE_SECTION,
            payload: courseData
        });
    }
}