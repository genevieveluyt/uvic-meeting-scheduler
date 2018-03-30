import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Dropdown } from 'semantic-ui-react'

import { updateSection } from '../actions/index';


class SectionSelect extends Component {
    constructor(props) {
        super(props);

        autoPopulateSections(props);
        
        this.getSuggestions = this.getSuggestions.bind(this);
        this.onSectionSelected = this.onSectionSelected.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        autoPopulateSections(nextProps);
    }

    getUserSections() {
        const sections = getSectionsByType(this.props);
        const userSections = this.props.schedule.get('courses')
            .find(c => c.get('name') === this.props.course)
            .get('sections');
        return Object.keys(sections).map(sectionType => {
                const value = userSections.get(sectionType) || '';
                return {
                    type: sectionType,
                    name: value
                }
            });
    }

    getSuggestions(sectionType) {
        return getSectionsByType(this.props)[sectionType]
            .map(section => { return {'key': section, 'value': section, 'text': section} });
    }

    onSectionSelected(event, { value }) {
        if (this.props.course) {
            this.props.updateSection(this.props.schedule.get('name'), this.props.course, value);
        }
    }

    renderSections() {
        return this.getUserSections().map(section => {
            return (
                <Dropdown key={section.type} className='section-select' selection
                    options={this.getSuggestions(section.type)}
                    placeholder='Section'
                    onChange={this.onSectionSelected}
                    text={section.name}
                    value={section.name}
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

function autoPopulateSections(props) {
    const sections = getSectionsByType(props);
    const userSections = props.schedule.get('courses')
        .find(c => c.get('name') === props.course)
        .get('sections');
    return Object.keys(sections).map(sectionType => {
            if (!userSections.get(sectionType) && sections[sectionType].length === 1) {
                if (sections[sectionType].length === 1) {
                    props.updateSection(
                        props.schedule.get('name'),
                        props.course,
                        sections[sectionType][0]
                    );
                }
            }
        });
}

function getSectionsByType(props) {
    if (!('courses' in props)) {
        return {};
    }

    const sections = props.courses.has(props.course)
        ? props.courses.get(props.course).get('sections').keySeq().toArray()
        : [];
    const sectionTypes = Array.from(new Set(sections.map(section => section.substring(0, 1)))).sort();
    let sectionsByType = {};
    sectionTypes.forEach(sectionType => {
        sectionsByType[sectionType] = sections.filter(section => section.startsWith(sectionType)).sort();
    });
    return sectionsByType;
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
