import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'

import { addCourse, updateCourse } from '../actions/index';


class CourseSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 'course' in props ? props.course.name : "",
            suggestions: [],
            open: false
        };
        
        this.getSuggestions = this.getSuggestions.bind(this);
        this.onCourseSelected = this.onCourseSelected.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ('course' in nextProps) {
            this.setState({value: nextProps.course.name});
        }
    }

    getSuggestions(event, data) {
        const value = data.searchQuery;
        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        if (inputLength === 0) { return; }

        let coursesAlreadySelected = this.props.schedule.get('courses')
            .map(course => course.get('name'));
    
        let suggestions = this.props.courseNames.filter(course =>
            !coursesAlreadySelected.includes(course) &&
            course.toLowerCase().slice(0, inputLength) === inputValue
        ).map(course => { return {'key': course, 'value': course, 'text': course} })
        .toArray();

        this.setState({suggestions, open: true});
    }

    onCourseSelected(event, { value }) {
        if ('course' in this.props) {
            this.props.updateCourse(this.props.schedule.get('name'), this.props.course.name, value);
        } else {
            this.props.addCourse(this.props.schedule.get('name'), value);
        }
    }

    render() {
        return (
            <Dropdown placeholder='CSC 115' fluid search selection
                className={this.props.className}
                minCharacters={1}
                options={this.state.suggestions}
                onChange={this.onCourseSelected}
                onSearchChange={this.getSuggestions}
                onClick={() => {this.setState({open: false})}}
                // Manually setting the "open" prop because with minCharacters={1}
                // if the dropdown is clicked, it opens even though there are no
                // characters... This is a problem because is there too much data
                // to display without a filter, making the ui slow.
                open={this.state.open}
                text={this.state.value}
                value={this.state.value}
            />
        );
    }
}

function mapStateToProps(state) {
    return {
        courseNames: state.courseNames
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({addCourse, updateCourse}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(CourseSearch);
