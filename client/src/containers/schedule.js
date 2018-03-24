import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Form, Divider, TextArea, Message } from 'semantic-ui-react'

import { addSectionByCRN } from '../actions/index';
import CourseList from './course-list';
import EditScheduleModal from './editScheduleModal';

class Schedule extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editScheduleModalOpen: false,
            crnModalOpen: false,
            crnField: '',
            crnError: ''
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
                <Button basic icon='edit' content='Edit Schedule'
                    onClick={() => this.setState({
                        editScheduleModalOpen: true
                    })}
                />
                <EditScheduleModal 
                    open={this.state.editScheduleModalOpen}
                    schedule={this.props.schedule.get('name')}
                    onChange={({open}) => this.setState({editScheduleModalOpen: open})}
                />
                { this.renderAddCRNModal() }
            </div>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({addSectionByCRN}, dispatch);
}

export default connect(null, mapDispatchToProps)(Schedule);
