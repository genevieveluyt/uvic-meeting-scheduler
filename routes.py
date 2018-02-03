from . import app
from flask import render_template, jsonify

from . import db_interface

@app.route('/')
def index():
    return 'Welcome to Uvic Meeting Scheduler!'

@app.route('/api/courses/names')
def get_course_names():
    names = db_interface.get_course_names()
    return jsonify(names)

@app.route('/api/courses/<course>')
def get_course_sections(course):
    sections = db_interface.get_sections(course)

    # Convert datetime.time objects into hour and minute so they can be jsonified
    for section_name in sections:
        for time_block in sections[section_name]:
            for t in ['start', 'end']:
                time_block[t] = {
                    'hour': time_block[t].hour,
                    'minute': time_block[t].minute
                }

    return jsonify({
        'name': course,
        'sections': sections
    })