import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'

import { addCourse, updateCourse } from '../actions/index';


class CourseSearch extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value: 'course' in props ? props.course.name : '',
            text: 'course' in props ? props.course.name : '',
            searchQuery: '',
            suggestions: []
        };
        
        this.onSearchChange = this.onSearchChange.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ('course' in nextProps) {
            const value = nextProps.course.name;
            if (value.length > 0 && value !== this.state.value) {
                this.setState({ value, text: value });
            }
        }
    }

    onSearchChange(event, data) {
        const value = data.searchQuery;
        
        this.setState({searchQuery: value});

        const inputValue = value.trim().toLowerCase();
        const inputLength = inputValue.length;

        if (inputLength === 0) {
            this.setState({suggestions: []});
            return;
        }

        let coursesAlreadySelected = this.props.schedule.get('courses')
            .map(course => course.get('name'));
    
        let suggestions = this.props.courseNames.filter(course =>
            (course => course !== data.value ||
            !coursesAlreadySelected.includes(course)) &&
            course.toLowerCase().slice(0, inputLength) === inputValue
        ).map(course => { return {'key': course, 'value': course, 'text': course}})
        .toArray();

        this.setState({suggestions});
    }

    onClose(event, { value }) {
        if (value.length === 0 || ('course' in this.props && value === this.props.course.name)) {
            this.setState({text: value, searchQuery: ''});
            return;
        }

        if ('course' in this.props) {
            this.props.updateCourse(this.props.schedule.get('name'), this.props.course.name, value);
        } else {
            this.props.addCourse(this.props.schedule.get('name'), value);
        }
    }

    render() {
        return (
            <Dropdown placeholder='Search for course' icon='' fluid search selection
                className={this.props.className}
                minCharacters={1}
                options={this.state.suggestions}
                onChange={(event, { value }) => this.setState({ value })}
                onSearchChange={this.onSearchChange}
                onClose={this.onClose}
                onClick={() => this.setState({text: ''})}
                noResultsMessage={
                    this.state.searchQuery.length > 0 ? 'No results found.' : 'Too many results.'
                }
                searchQuery={this.state.searchQuery}
                value={this.state.value}
                text={this.state.text}
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
