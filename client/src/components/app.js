import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid, Dimmer, Loader } from 'semantic-ui-react'

import { loadData, getCourseNames } from '../actions/api';
import { dismissError } from '../actions/index'
import ScheduleList from '../containers/schedule_list';
import Timetable from '../containers/timetable';
import Message from 'semantic-ui-react/dist/commonjs/collections/Message/Message';

class App extends Component {
    constructor(props) {
        super(props);
        props.getCourseNames();
        props.loadData();

        this.renderErrorRow = this.renderErrorRow.bind(this);
    }

    renderErrorRow() {
        if (!this.props.error) return '';

        return (
            <Grid.Row>
                <Grid.Column width={16} >
                    <Message error header='Error' content={this.props.error} 
                        onDismiss={this.props.dismissError}
                    /> 
                </ Grid.Column>
            </ Grid.Row>
        )   
    }

    render() {
        return (
            <Grid container columns={2} relaxed className="full-height">
                {this.renderErrorRow()}
                <Dimmer active={this.props.courseNames.size === 0}>
                    <Loader size='medium'>{getLoadingMessage()}</Loader>
                </Dimmer>
                <Grid.Row>
                    <Grid.Column width={10} >
                        <Timetable />
                    </ Grid.Column>
                    <Grid.Column width={6} >
                        <ScheduleList />
                    </ Grid.Column>
                </ Grid.Row>
            </ Grid>
        );
    }
}

function getLoadingMessage() {
    const messages = [
        'Searching for the answer to Life, the Universe, and Everything',
        'Hang on a sec, I know your data is here somewhere',
        'Waiting for the system admin to hit enter...',
        'Reconfiguring the office coffee machine...',
        'Re-calibrating the internet...',
        'Buying more RAM...',
        'Waking up the hamsters...',
        'Caching internet locally...',
        "I didn't lose your data, it's just very well hidden. For your security."
    ];

    return messages[Math.floor(Math.random() * messages.length)];
}

function mapStateToProps(state) {
    return {
        error: state.error,
        courseNames: state.courseNames
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getCourseNames, loadData, dismissError}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
