import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table } from 'semantic-ui-react';

var moment = require('moment');

const DAY_MAP = {
    M: 0,
    T: 1,
    W: 2,
    R: 3,
    F: 4
}

const MIN_TIME = moment('8:30', 'HH:mm');
const MAX_TIME = moment('20:00', 'HH:mm');
const TIME_UNIT_SIZE = 10;  // minutes
const TIME_UNITS = moment.duration(MAX_TIME.diff(MIN_TIME)).asMinutes() / TIME_UNIT_SIZE;
const VISUAL_TIME_UNIT = 30;
const TIME_UNITS_PER_VISUAL_UNIT = VISUAL_TIME_UNIT / TIME_UNIT_SIZE;
const VISUAL_TIME_UNITS = TIME_UNITS / TIME_UNITS_PER_VISUAL_UNIT;
const TIME_UNIT_HEIGHT = 100 / (VISUAL_TIME_UNIT / TIME_UNIT_SIZE);   // percentage

class Timetable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            conflicts: []
        }

        this.calculateSchedule = this.calculateSchedule.bind(this);
        this.renderTableCell = this.renderTableCell.bind(this);
    }

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

        let conflicts = [];
        let startVisualUnit = null;
        let startSlot = 0;
        let conflictLength = 0;
        let numConflicts = 0;

        for (let day = 0; day < Object.keys(DAY_MAP).length; day++) {
            conflicts[day] = [];

            for (let visualTimeUnit = 0; visualTimeUnit < VISUAL_TIME_UNITS; visualTimeUnit++) {
                for (let slot = 0; slot < TIME_UNITS_PER_VISUAL_UNIT; slot++) {
                    conflictLength++;
                    let timeUnit = visualTimeUnit * TIME_UNITS_PER_VISUAL_UNIT + slot;
                    if (schedule[day][timeUnit] !== numConflicts) {
                        if (startVisualUnit !== null) {
                            conflicts[day][startVisualUnit] = {
                                slot: startSlot,
                                numConflicts,
                                units: conflictLength
                            };
                            startVisualUnit = null;
                            startSlot = 0;
                        }

                        numConflicts = schedule[day][timeUnit];
                        if (numConflicts > 0) {
                            startVisualUnit = visualTimeUnit;
                            startSlot = slot;
                        }

                        conflictLength = 0;
                    }
                }
            }
        }

        this.setState({ conflicts });
    }

    renderTableCell(day, visualTimeUnit) {
        if (this.state.conflicts.length > 0 && 
            this.state.conflicts[day].length > 0 &&
            this.state.conflicts[day][visualTimeUnit] !== undefined) {
            let conflict = this.state.conflicts[day][visualTimeUnit];
            return (
                <Table.Cell key={day} verticalAlign='top' className='conflict-cell'>
                    <div 
                        className={ `conflict-block conflict-${conflict.numConflicts > 2 ? "many" : conflict.numConflicts}` }
                        style={{
                            top: `${TIME_UNIT_HEIGHT * conflict.slot}%`,
                            height: `${TIME_UNIT_HEIGHT * conflict.units}%`
                        }}>
                        <h3>{ conflict.numConflicts }</h3>
                    </div>
                </Table.Cell>
            )
        }

        return <Table.Cell key={day}></Table.Cell>
    }

    renderTableRows() {
        let rows = [];
        let time = MIN_TIME.clone();
        for (let visualTimeUnit = 0; visualTimeUnit < VISUAL_TIME_UNITS; visualTimeUnit++) {
            let timeString = time.format('HH:mm');
            rows.push(
                <Table.Row key={ timeString }>
                    <Table.Cell>{ timeString }</Table.Cell>
                    { Object.keys(DAY_MAP).map((d, day) => this.renderTableCell(day, visualTimeUnit) ) }
                </Table.Row>
            )
            time.add(VISUAL_TIME_UNIT, 'minutes');
        }
        return rows;
    }

    render() {
        return (
            <Table definition celled fixed textAlign='center'>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell></Table.HeaderCell>
                        { 
                            Object.keys(DAY_MAP).map((day) => 
                                <Table.HeaderCell key={day}>{day}</Table.HeaderCell>
                            ) 
                        }
                    </Table.Row>
                </ Table.Header>

                <Table.Body>
                    { this.renderTableRows() }
                </Table.Body>
            </ Table>
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