import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { List } from 'semantic-ui-react';

import { removeCourse } from '../actions/index';
import CourseSearch from './course-search';
import SectionSelect from './section-select';

class CourseList extends Component {
    renderList() {
        return this.props.userData.map(course => {
            return (
                <List.Item key={course.get('name')} className='course-list-item'>
                    <div>
                        <CourseSearch course={course.toJS()} className='course-search' />
                        <List.Icon
                            name='remove'
                            className='remove-icon'
                            onClick={ () => this.props.removeCourse(course.get('name')) }
                        />
                    </div>
                    <SectionSelect course={course.toJS()} />
                </List.Item>
            )
        });
    }

    render() {
        return (
            <List className='course-list'>
                { this.renderList() }
                <List.Item
                    key={this.props.userData.size.toString()}
                    className='course-list-item'>
                    <CourseSearch className='course-search' />
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