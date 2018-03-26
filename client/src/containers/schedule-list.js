import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Accordion, Icon, Button } from 'semantic-ui-react'

import Schedule from './schedule';
import EditScheduleModal from './editScheduleModal';
import { getRequest } from '../actions/api';

class ScheduleList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            term: '',
            activeIndex: 0,
            modalOpen: false
        };

        getRequest('/api/term').then(term => {
            this.setState({term: parseTerm(term)});
        })

        this.onClickSchedule = this.onClickSchedule.bind(this);
        this.renderSchedules = this.renderSchedules.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.userData.size === 1) {
            this.setState({activeIndex: 0});
        } else if (nextProps.userData.size > this.props.userData.size || this.state.activeIndex >= nextProps.userData.size) {
            // if just added a schedule, open that schedule
            // if just deleted the last schedule, open the second to last schedule (now the last schedule)
            this.setState({activeIndex: nextProps.userData.size-1});
        }
    }

    onClickSchedule(e, titleProps) {
        const { index } = titleProps;
        const newIndex = this.state.activeIndex === index ? -1 : index;

        this.setState({ activeIndex: newIndex });
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
                        <Schedule schedule={schedule} />
                    </Accordion.Content>
                </div>
            )
        })
    }

    render() {
        return (
            <div>
                <div className='schedule-list-top-bar'>
                    <h3>{this.state.term}</h3>
                    <Button icon='plus' labelPosition='left' content='Add Schedule'
                        onClick={() => {this.setState({
                            modalOpen: true })
                        }}
                    />
                </div>
                { this.props.userData.size === 0 ? '' :
                    <Accordion fluid styled style={{ marginTop: '20px' }}>
                        { this.renderSchedules() }
                    </ Accordion>
                }
                <EditScheduleModal
                    open={this.state.modalOpen}
                    onChange={({open}) => this.setState({modalOpen: open})}
                />
            </div>
        )
    }
}

function parseTerm(term) {
    term = term.toString();
    const year = term.substring(0, 4);
    const month = parseInt(term.substring(4), 10);
    let semester = '';

    if (1 <= month && month <= 4) {
        semester = "Spring";
    } else if (5 <= month && month <= 8) {
        semester = "Summer";
    } else {
        semester = "Fall";
    }

    return `${semester} ${year}`;
}

function mapStateToProps(state) {
    return {
        userData: state.userData
    }
}

export default connect(mapStateToProps)(ScheduleList);
