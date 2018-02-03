import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'

import { updateSection } from '../actions/index';


class SectionSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sections: 'course' in props ? getSections(props.courses, props.course) : [],
            A: "A" in props ? props.A : "", // lecture
            B: "B" in props ? props.B : "", // lab
            T: "T" in props ? props.T : ""  // tutorial
        };
        
        this.getSuggestions = this.getSuggestions.bind(this);
        this.onSectionSelected = this.onSectionSelected.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ('course' in nextProps) {
            this.setState({sections: getSections(nextProps.courses, nextProps.course)});
        }
    }

    getSuggestions(sectionType) {
        return this.state.sections
            .filter(section => section.startsWith(sectionType))
            .map(section => { return {'key': section, 'value': section, 'text': section} });
    }

    onSectionSelected(event, { value }) {
        if (this.props.course) {
            this.props.updateSection(this.props.course.name, value);
        }
    }

    renderSections() {
        if (this.state.sections.length === 0) {
            return "";
        }

        const sectionTypes = Array.from(new Set(this.state.sections.map(section => section.substring(0, 1))))
        return sectionTypes.map(sectionType => {
            return (
                <Dropdown key={sectionType} selection
                    options={this.getSuggestions(sectionType)}
                    placeholder="Choose a section"
                    onChange={this.onSectionSelected}
                    text={this.state.sectionType}
                    value={this.state.sectionType}
                />
            )
        });
    }

    render() {
        return (
            <div>
                { this.renderSections() }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        courseNames: state.courseNames,
        courses: state.courses
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({updateSection}, dispatch);
}

function getSections(courses, course) {
    let courseData = courses.find(c => course.name === c.name);
    return courseData ? Object.keys(courseData.sections) : [];
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionSelect);