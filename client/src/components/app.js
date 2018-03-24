import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Grid } from 'semantic-ui-react'

import { loadData, getCourseNames } from '../actions/api';
import { dismissError } from '../actions/index'
import ScheduleList from '../containers/schedule-list';
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

function mapStateToProps(state) {
    return { error: state.error }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({getCourseNames, loadData, dismissError}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
