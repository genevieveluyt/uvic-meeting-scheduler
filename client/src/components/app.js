import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid } from 'semantic-ui-react'

import { getCourseNames } from '../actions/index';
import CourseList from '../containers/course-list';
import Timetable from '../containers/timetable';

class App extends Component {
    constructor(props) {
        super(props);
        props.getCourseNames();
    }

    render() {
        return (
            <Grid container columns={2} divided className="full-height">
                <Grid.Row>
                    <Grid.Column width={9} >
                        <Timetable />
                    </ Grid.Column>
                    <Grid.Column width={7} >
                        <CourseList />
                    </ Grid.Column>
                </ Grid.Row>
            </ Grid>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getCourseNames: getCourseNames}, dispatch);
}

export default connect(null, mapDispatchToProps)(App);
