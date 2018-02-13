import React, { Component } from 'react';
import { connect } from 'react-redux';

var moment = require('moment');

const DAY_MAP = {
    M: 0,
    T: 1,
    W: 2,
    R: 3,
    F: 4
}

const MIN_TIME = moment("8:30", "HH:mm");
const MAX_TIME = moment("20:00", "HH:mm");
const TIME_UNIT_SIZE = 10; // minutes
const TIME_UNITS = moment.duration(MAX_TIME.diff(MIN_TIME)).asMinutes() / TIME_UNIT_SIZE;

class Timetable extends Component {
    componentWillReceiveProps(newProps) {
        this.calculateSchedule(newProps);
    }

    calculateSchedule(props) {
        if (props.courses.length === 0) return;

        // Schedule data structure is an array where each index is an array representing a day
        // of the week. Each day of the week is split into 10 minute time units and a count of
        // the number of courses that occur in any given time unit is stored in the array.
        let schedule = [];
        let numDays = Object.keys(DAY_MAP).length;
        for (let i = 0; i < numDays; i++) {
            schedule[i] = []

            for (let j = 0; j < TIME_UNITS; j++) {
                schedule[i][j] = 0;
            }
        }

        // Convert array into object with course name as key
        let courseData = {};
        for (let i = 0; i < props.courses.length; i++) {
            courseData[props.courses[i].name] = props.courses[i];
        }

        // Loop through courses (eg CSC 110)
        for (let i = 0; i < props.userData.length; i++) {
            let courseKeys = Object.keys(props.userData[i]);

            // Loop through sections for the course (eg A02, B04)
            for (let j = 0; j < courseKeys.length; j++) {
                if (courseKeys[j] === 'name') {
                    continue;
                }
                
                let sectionName = props.userData[i][courseKeys[j]];
                let section = courseData[props.userData[i].name].sections[sectionName];

                // For each time block (eg. Monday, 8:30 - 9:50)
                for (let j = 0; j < section.length; j++) {
                    let lecture = section[j];
                    let start = moment(`${lecture.start.hour}-${lecture.start.minute}`, 'HH-mm');
                    let end = moment(`${lecture.end.hour}-${lecture.end.minute}`, 'HH-mm');
                    let numTimeUnits = moment.duration(end.diff(start)).asMinutes() / TIME_UNIT_SIZE;
                    let startTimeUnit = moment.duration(start.diff(MIN_TIME)).asMinutes() / TIME_UNIT_SIZE;
                    
                    // Increment the time units taken up by this time block in the schedule
                    for (let k = startTimeUnit; k < startTimeUnit + numTimeUnits; k++) {
                        schedule[DAY_MAP[lecture.day]][k]++;
                    }
                }
            }
        }
    }

    render() {
        return (
            <div>
                <h2>Enrolled in</h2>
                {this.props.userData.map(course => course.name)}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        courses: state.courses,
        userData: state.userData
    }
}

export default connect(mapStateToProps)(Timetable);