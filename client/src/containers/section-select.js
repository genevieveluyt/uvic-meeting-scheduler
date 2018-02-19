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
            this.state['sections'] = getSections(props.courses, props.course);

            let userSections = props.userData.find(c => c.name === props.course.name).sections;
            for (let key in userSections) {
                this.state[key] = userSections[key];
            }
        }
        
        this.getSuggestions = this.getSuggestions.bind(this);
        this.onSectionSelected = this.onSectionSelected.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if ('course' in nextProps) {
            let sections =  getSections(nextProps.courses, nextProps.course);
            this.setState({sections});

            // If there is no section selected and there is only one section
            // for that section type, auto-select it
            if (sections.length > 0) {
                let sectionTypes = this.getSectionTypes(sections);
                let userSections = nextProps.userData
                    .find(c => c.name === nextProps.course.name).sections;
                
                for (let i = 0; i < sectionTypes.length; i++) {
                    let sectionType = sectionTypes[i];

                    if (sectionType in userSections) {
                        this.setState({[sectionType]: userSections[sectionType]});
                    } else {
                        let filteredSections = this.getSectionsOfType(sections, sectionType);
                        if (filteredSections.length === 1) {
                            nextProps.updateSection(nextProps.course.name, filteredSections[0]);
                        }
                    }
                }
            }
        }
    }

    getSectionsOfType(sections, sectionType) {
        return sections.filter(section => section.startsWith(sectionType));
    }

    getSectionTypes(sections) {
        return Array.from(new Set(sections.map(section => section.substring(0, 1))));
    }

    getSuggestions(sectionType) {
        return this.getSectionsOfType(this.state.sections, sectionType)
            .map(section => { return {'key': section, 'value': section, 'text': section} });
    }

    onSectionSelected(event, { value }) {
        if (this.props.course) {
            this.props.updateSection(this.props.course.name, value);
        }
    }

    renderSections() {
        if (this.state.sections.length === 0) {
            return '';
        }

        return this.getSectionTypes(this.state.sections).map(sectionType => {
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

function mapStateToProps(state) {
    return {
        courseNames: state.courseNames,
        courses: state.courses,
        userData: state.userData
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