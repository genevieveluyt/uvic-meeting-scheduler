import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Form, Divider, TextArea, Message } from 'semantic-ui-react'

import { addSectionByCRN, removeSchedule } from '../actions/index';
import CourseList from './course_list';
import EditScheduleModal from './edit_schedule_modal';


class Schedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editScheduleModalOpen: false,
            crnModalOpen: false,
            crnField: '',
            crnError: '',
            deleteModalOpen: false
        };

        this.onCRNFormSubmit = this.onCRNFormSubmit.bind(this);
    }

    onCRNFormSubmit() {
        for (let crn of this.state.crnField.trim().split(/[ ,]+/)) {
            this.props.addSectionByCRN(this.props.schedule.get('name'), crn);
        }

        this.setState({ crnModalOpen: false });
    }

    renderAddCRNModal() {
        return (
            <Modal size='tiny' open={this.state.crnModalOpen}>
                <Modal.Header>
                    Add Courses by CRN
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.onCRNFormSubmit} error={!!this.state.crnError}>
                        <p>Enter list of comma or space separated CRNs:</p>
                        <TextArea placeholder='20189, 22099, 21768' value={this.state.crnField}
                            onChange={(e, { value }) => this.setState({ crnField: value })}
                        />
                        <Message error
                            header='Parsing Error'
                            content={this.state.crnError}
                        />
                    </ Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button content='Cancel'
                        onClick={() => {this.setState({ crnModalOpen: false })}}
                    />
                    <Button positive content='Add Courses'
                        onClick={this.onCRNFormSubmit}
                    />
                </Modal.Actions>
            </Modal>
        )
    }

    renderDeleteModal() {
        return (
            <Modal size='tiny' open={this.state.deleteModalOpen}>
                <Modal.Header>
                    Delete Schedule
                </Modal.Header>
                <Modal.Content>
                    <p>Are you sure you want to delete {this.props.schedule.get('name')}?</p>
                </Modal.Content>
                <Modal.Actions>
                    <Button content='Cancel'
                        onClick={() => {this.setState({ deleteModalOpen: false })}}
                    />
                    <Button negative icon='trash' content='Delete schedule'
                        onClick={() => {
                            this.props.removeSchedule(this.props.schedule.get('name'));
                            this.setState({ deleteModalOpen: false });
                        }}
                    />
                </Modal.Actions>
            </Modal>
        )
    }

    render() {
        return (
            <div>
                <CourseList schedule={this.props.schedule} />
                <Divider horizontal>Or</Divider>
                <Button fluid content='Add Courses by CRN'
                    onClick={() => this.setState({
                        editSchedule: this.props.schedule.get('name'),
                        crnModalOpen: true,
                        crnField: '',
                        crnError: '' 
                    })}
                />
                <Divider />
                <Button basic color='blue' icon='edit' content='Edit Schedule'
                    onClick={() => this.setState({
                        editScheduleModalOpen: true
                    })}
                />
                <Button negative icon='trash'
                    onClick={() => this.setState({
                        deleteModalOpen: true
                    })}
                />
                <EditScheduleModal 
                    open={this.state.editScheduleModalOpen}
                    schedule={this.props.schedule.get('name')}
                    onChange={({open}) => this.setState({editScheduleModalOpen: open})}
                />
                { this.renderAddCRNModal() }
                { this.renderDeleteModal() }
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({addSectionByCRN, removeSchedule}, dispatch);
}

export default connect(null, mapDispatchToProps)(Schedule);
