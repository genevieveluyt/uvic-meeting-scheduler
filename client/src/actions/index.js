import { getRequest } from './api';

export const UPDATE_COURSE = 'UPDATE_COURSE';
export const ADD_COURSE = 'ADD_COURSE';
export const ADD_COURSE_DATA = 'ADD_COURSE_DATA';
export const REMOVE_COURSE = 'REMOVE_COURSE';
export const REMOVE_COURSE_DATA = 'REMOVE_COURSE_DATA';
export const UPDATE_SECTION = 'UPDATE_SECTION';
export const ADD_SCHEDULE = 'ADD_SCHEDULE';
export const REMOVE_SCHEDULE = 'REMOVE_SCHEDULE';
export const UPDATE_SCHEDULE = 'UPDATE_SCHEDULE'
export const ERROR = 'ERROR';


export function updateCourse(schedule, oldCourse, newCourse) {
    return (dispatch, getState) => {
        dispatch(removeCourseData(oldCourse));
        dispatch(addCourseData(newCourse));
        dispatch({
            type: UPDATE_COURSE,
            payload: {
                schedule,
                oldCourse,
                newCourse: {
                    name: newCourse,
                    sections: {}
                }
            }
        })
    }
}

/**
 * 
 * @param {string} course 
 */
export function addCourse(schedule, course) {
    return (dispatch, getState) => {
        dispatch(addCourseData(course));
        dispatch({
            type: ADD_COURSE,
            payload: {
                schedule,
                course: {
                    name: course,
                    sections: {}
                }
            }
        })
    }
}

export function addCourseData(course) {
    return (dispatch, getState) => {
        let courseData = getState().courses.find(course =>
            course.get('name') === course
        );
        if (!courseData) {
            dispatch({
                type: ADD_COURSE_DATA,
                payload: getRequest(`/api/courses/${course}`)
            })
        }
    }
}

/**
 * @param {string} schedule : schedule name
 * @param {string} course : course name
 */
export function removeCourse(schedule, course) {
    return (dispatch, getState) => {
        dispatch(removeCourseData(course));
        dispatch({
            type: REMOVE_COURSE,
            payload: {schedule, course}
        });
    }
}

export function removeCourseData(course) {
    return (dispatch, getState) => {
        const schedules = getState().userData;
        let courseCount = 0;
        for (let userSchedule of schedules) {
            if (typeof userSchedule.get('courses').find(c => c.get('name') === course) !== 'undefined') {
                courseCount++;
            }
        }

        if (courseCount < 2) {
            dispatch({
                type: REMOVE_COURSE_DATA,
                payload: course
            });
        }
    }
}

/**
 * @param {string} schedule
 * @param {string} course
 * @param {string} section
 */
export function updateSection(schedule, course, section) {
    return {
        type: UPDATE_SECTION,
        payload: {
            schedule,
            course,
            sectionType: section.substring(0, 1),
            section: section
        }
    }
}

export function addSchedule(schedule) {
    return (dispatch, getState) => {
        let scheduleData = getState().userData.find(s =>
            s.get('name') === schedule
        );
        if (scheduleData) {
            dispatch({
                type: ERROR,
                payload: `A schedule with the name ${schedule} already exists. Please choose a different name.`
            });
        } else {
            dispatch({
                type: ADD_SCHEDULE,
                payload: schedule
            });
        }
    }
}

export function removeSchedule(schedule) {
    return {
        type: REMOVE_SCHEDULE,
        payload: schedule
    }
}

export function updateSchedule(oldSchedule, newSchedule) {
    return (dispatch, getState) => {
        let scheduleData = getState().userData.find(s =>
            s.get('name') === newSchedule
        );
        if (scheduleData) {
            dispatch({
                type: ERROR,
                payload: `A schedule with the name ${newSchedule} already exists. Please choose a different name.`
            });
        } else {
            dispatch({
                type: UPDATE_SCHEDULE,
                payload: {oldSchedule, newSchedule}
            });
        }
    }
}

export function dismissError() {
    return {
        type: ERROR,
        payload: ''
    }
}
