import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List } from 'semantic-ui-react';

import { removeCourse } from '../actions/index';
import CourseSearch from './course-search';
import SectionSelect from './section-select';

class CourseList extends Component {
    renderList() {
        return this.props.schedule.get('courses').map(course => {
            return (
                <List.Item key={course.get('name')} className='course-list-item'>
                    <div>
                        <CourseSearch schedule={this.props.schedule}
                            course={course.toJS()} className='course-search'
                        />
                        <List.Icon
                            name='remove'
                            className='remove-icon'
                            onClick={ () => this.props.removeCourse(this.props.schedule.get('name'), course.get('name')) }
                        />
                    </div>
                    <SectionSelect schedule={this.props.schedule} course={course.toJS()} />
                </List.Item>
            )
        });
    }

    render() {
        return (
            <List className='course-list'>
                { this.renderList() }
                <List.Item
                    key={this.props.schedule.get('courses').size.toString()}
                    className='course-list-item'>
                    <p><strong>Add a Course</strong></p>
                    <CourseSearch schedule={this.props.schedule} />
                </List.Item>
            </ List>
        );
    };
}

function mapStateToProps(state) {
    return {
        userData: state.userData
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({removeCourse}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseList);
