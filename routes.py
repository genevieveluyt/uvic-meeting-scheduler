from . import app
from flask import render_template, jsonify, request, session

from . import db_interface

@app.route('/')
def index():
    return 'Welcome to Uvic Meeting Scheduler!'

@app.route('/clear')
def clear():
    session['data'] = []
    return 'Data cleared'

@app.route('/api/me', methods=['GET', 'POST'])
def data():
    if request.method == 'GET':
        user_data = session.get('data', [])
        data = {}
        user_courses = set()
        for schedule in user_data:
            for course in schedule.get('courses', []):
                user_courses.add(course['name'])
        for course in user_courses:
            data[course] = get_course_data(course)

        return jsonify({
            'userData': user_data,
            'data': data
        })

    session['data'] = request.get_json()
    return 'success'

@app.route('/api/courses/names')
def get_course_names():
    names = db_interface.get_course_names()
    return jsonify(names)

@app.route('/api/courses/<course>')
def get_course_sections(course):
    return jsonify(get_course_data(course))

def get_course_data(course):
    sections, name = db_interface.get_sections(course)

    # Convert datetime.time objects into hour and minute so they can be jsonified
    for section_name in sections:
        for time_block in sections[section_name]['times']:
            for t in ['start', 'end']:
                time_block[t] = {
                    'hour': time_block[t].hour,
                    'minute': time_block[t].minute
                }

    return {
        'name': name,
        'sections': sections
    }