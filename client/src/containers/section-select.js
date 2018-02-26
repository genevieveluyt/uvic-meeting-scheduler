import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'

import { updateSection } from '../actions/index';


class SectionSelect extends Component {
    constructor(props) {
        super(props);

        this.state = {
            sections: []
        }

        if ('course' in props) {
            this.state.sections = getSections(props.courses, props.course.name);
            let userSections = props.schedule.get('courses')
                .find(course => course.get('name') === props.course.name)
                .get('sections').toObject();
            Object.assign(this.state, userSections);
        }
        
        this.getSuggestions = this.getSuggestions.bind(this);
        this.onSectionSelected = this.onSectionSelected.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ('course' in nextProps) {
            let sections = getSections(nextProps.courses, nextProps.course.name);
            this.setState({sections});

            // If there is no section selected and there is only one section
            // for that section type, auto-select it
            if (sections.length > 0) {
                let sectionTypes = getSectionTypes(sections);
                let userSections = nextProps.schedule.get('courses')
                    .find(c => c.get('name') === nextProps.course.name)
                    .get('sections').toJS();
                
                for (let sectionType of sectionTypes) {
                    if (sectionType in userSections) {
                        this.setState({[sectionType]: userSections[sectionType]});
                    } else {
                        let filteredSections = getSectionsOfType(sections, sectionType);
                        if (filteredSections.length === 1) {
                            nextProps.updateSection(nextProps.schedule.get('name'), nextProps.course.name, filteredSections[0]);
                        }
                    }
                }
            }
        }
    }

    getSuggestions(sectionType) {
        return getSectionsOfType(this.state.sections, sectionType)
            .map(section => { return {'key': section, 'value': section, 'text': section} });
    }

    onSectionSelected(event, { value }) {
        if (this.props.course) {
            this.props.updateSection(this.props.schedule.get('name'), this.props.course.name, value);
        }
    }

    renderSections() {
        if (this.state.sections.length === 0) {
            return '';
        }

        return getSectionTypes(this.state.sections).map(sectionType => {
            return (
                <Dropdown key={sectionType} className='section-select' selection
                    options={this.getSuggestions(sectionType)}
                    placeholder='Section'
                    onChange={this.onSectionSelected}
                    text={this.state[sectionType]}
                    value={this.state[sectionType]}
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

/**
 * Get a list of sections for the given course
 * 
 * @param {Immutable.Map} courses - dictionary of course objects
 * @param {String} course - course name
 */
function getSections(courses, course) {
    return courses.has(course) ? courses.get(course).get('sections').keySeq().toArray() : [];
}

function getSectionsOfType(sections, sectionType) {
    return sections.filter(section => section.startsWith(sectionType)).sort();
}

function getSectionTypes(sections) {
    return Array.from(new Set(sections.map(section => section.substring(0, 1)))).sort();
}

function mapStateToProps(state) {
    return {
        courses: state.courses
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({updateSection}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(SectionSelect);
