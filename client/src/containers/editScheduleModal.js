import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Modal, Form } from 'semantic-ui-react'
import PropTypes from 'prop-types';

import { addSchedule, updateSchedule, removeSchedule } from '../actions/index';

class EditScheduleModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scheduleField: ''
        };

        this.onFormSubmit = this.onFormSubmit.bind(this);
    }

    componentWillReceiveProps(newProps) {
        const scheduleField = newProps.open ? newProps.schedule : '';
        this.setState({open: newProps.open, scheduleField});
    }

    onFormSubmit() {
        if (!this.props.schedule) {
            this.props.addSchedule(this.state.scheduleField);
        } else {
            if (this.props.schedule !== this.state.scheduleField) {
                this.props.updateSchedule(this.props.schedule, this.state.scheduleField)
            }
        }
        this.props.onChange({ open: false });
    }

    render() {
        return (
            <Modal size='tiny' open={this.props.open}>
                <Modal.Header>
                    {this.props.schedule ? 'Edit' : 'Add'} Schedule
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
                    {this.props.schedule ?
                        <Button negative icon='trash' content='Delete schedule' floated='left'
                            onClick={() => {
                                this.props.removeSchedule(this.props.schedule);
                                this.props.onChange({ open: false });
                            }}
                        /> : ''
                    }
                    <Button content='Cancel'
                        onClick={() => {this.props.onChange({ open: false })}}
                    />
                    <Button positive icon='checkmark' labelPosition='right' content='Save'
                        onClick={this.onFormSubmit}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({addSchedule, updateSchedule, removeSchedule}, dispatch);
}

EditScheduleModal.propTypes = {
    open: PropTypes.bool.isRequired,
    schedule: PropTypes.string,
    onChange: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(EditScheduleModal);
