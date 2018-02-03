import React, { Component } from 'react';
import { connect } from 'react-redux';

class Timetable extends Component {
    render() {
        return (
            <div>
                <h2>Enrolled in</h2>
                {this.props.courses.map(course => `${course.name} `)}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        courses: state.courses
    }
}

export default connect(mapStateToProps)(Timetable);