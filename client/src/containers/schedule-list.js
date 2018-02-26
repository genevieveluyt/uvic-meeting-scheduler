import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Accordion, Icon, Button, Modal, Form, Divider } from 'semantic-ui-react'

import { addSchedule, updateSchedule, removeSchedule } from '../actions/index';
import CourseList from './course-list';

class ScheduleList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeIndex: 0,
            modalOpen: false,
            editSchedule: '',
            scheduleField: ''
        };

        this.onClickSchedule = this.onClickSchedule.bind(this);
        this.renderSchedules = this.renderSchedules.bind(this);
        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userData.size === 1) {
            this.setState({activeIndex: 0});
        } else if (nextProps.userData.size > this.props.userData.size) {
            this.setState({activeIndex: nextProps.userData.size-1});
        }
    }

    onClickSchedule(e, titleProps) {
        const { index } = titleProps;
        const newIndex = this.state.activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
    }

    onFormSubmit() {
        if (this.state.editSchedule) {
            if (this.state.editSchedule !== this.state.scheduleField) {
                this.props.updateSchedule(this.state.editSchedule, this.state.scheduleField)
            }
        } else {
            this.props.addSchedule(this.state.scheduleField);
        }
        this.setState({ modalOpen: false });
    }

    renderEditScheduleModal() {
        return (
            <Modal size='tiny' open={this.state.modalOpen}>
                <Modal.Header>
                    Edit Schedule
                </Modal.Header>
                <Modal.Content>
                    <Form onSubmit={this.onFormSubmit}>
                        <Form.Field>
                            <label>Schedule Name</label>
                            <Form.Input placeholder='Alison' value={this.state.scheduleField}
                                onChange={(e, { value }) => this.setState({ scheduleField: value })}
                            />
                        </Form.Field>
                    </ Form>
                </Modal.Content>
                <Modal.Actions>
                    {this.state.editSchedule ?
                        <Button negative icon='trash' content='Delete schedule' floated='left'
                            onClick={() => {
                                this.props.removeSchedule(this.state.editSchedule);
                                this.setState({ modalOpen: false });
                            }}
                        /> : ''
                    }
                    <Button content='Cancel'
                        onClick={() => {this.setState({ modalOpen: false })}}
                    />
                    <Button positive icon='checkmark' labelPosition='right' content='Save'
                        onClick={this.onFormSubmit}
                    />
                </Modal.Actions>
            </Modal>
        )
    }

    renderSchedules() {
        return this.props.userData.map((schedule, i) => {
            return (
                <div key={schedule.get('name')}>
                    <Accordion.Title active={this.state.activeIndex === i} index={i} onClick={this.onClickSchedule}>
                        <Icon name='dropdown' />
                        {schedule.get('name')}
                    </Accordion.Title>
                    <Accordion.Content active={this.state.activeIndex === i}>
                        <CourseList schedule={schedule} />
                        <Divider />
                        <Button basic icon='edit' content='Edit Schedule'
                            onClick={() => this.setState({
                                editSchedule: schedule.get('name'),
                                scheduleField: schedule.get('name'),
                                modalOpen: true
                            })}
                        />
                    </Accordion.Content>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                <div style={{textAlign: 'right'}}>
                    <Button icon='plus' labelPosition='left' content='Add Schedule'
                        onClick={() => {this.setState({
                            editSchedule: '',
                            scheduleField: '',
                            modalOpen: true })
                        }}
                        style={{marginRight: 0}}
                    />
                </div>
                { this.props.userData.size === 0 ? '' :
                    <Accordion fluid styled style={{ marginTop: '20px' }}>
                        { this.renderSchedules() }
                    </ Accordion>
                }
                { this.renderEditScheduleModal() }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        userData: state.userData
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({addSchedule, updateSchedule, removeSchedule}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleList);
