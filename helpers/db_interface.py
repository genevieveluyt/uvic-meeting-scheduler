import psycopg2

class UvicSchedulerDBInterface:
    DB_NAME = 'uvicscheduler'

    def __init__(self, user, password):
        self.db = psycopg2.connect('dbname={} user={} password={}'.format(self.DB_NAME, user, password))
        self.cursor = self.db.cursor()

    def close(self):
        self.cursor.close()
        self.db.close()

    def get_course_names(self, term=None):
        if term is None:
            term = self.get_latest_term()

        self.cursor.execute("""
            SELECT DISTINCT course
            FROM Sections
            WHERE term = %s
            ORDER BY course
        """, [term])

        return [result[0] for result in self.cursor.fetchall()]

    def get_sections(self, course, term=None):
        if term is None:
            term = self.get_latest_term()

        self.cursor.execute("""
            SELECT section_name, day, start_time, end_time
            FROM Sections JOIN SectionTimes USING (crn) JOIN TimeBlocks ON (TimeBlocks.id=section_time)
            WHERE course = %s and term = %s
        """, (course, term))

        sections = {}
        for section_name, day, start_time, end_time in self.cursor.fetchall():
            if not section_name in sections.keys():
                sections[section_name] = []
            
            sections[section_name].append({
                'day': day,
                'start': start_time,
                'end': end_time
            })

        return sections
    
    def get_latest_term(self):
        self.cursor.execute("""
                SELECT MAX(term)
                FROM Sections
            """)
        return self.cursor.fetchone()[0]
    
    def insert_update_section(self, short_name, name, crn, section, weekly, times, term):
        self.insert_update_course(short_name, name)

        self.cursor.execute("""
            INSERT INTO Sections VALUES (%(crn)s, %(short_name)s, %(section)s, %(weekly)s, %(term)s)
            ON CONFLICT (crn) DO UPDATE
            SET course = %(short_name)s, section_name = %(section)s, weekly = %(weekly)s, term = %(term)s
        """, {
            'crn': crn,
            'short_name': short_name,
            'section': section,
            'weekly': weekly,
            'term': term
        })

        for time in times:
            self.insert_times(time['start'], time['end'])
            self.cursor.execute("""
                SELECT id FROM TimeBlocks WHERE start_time = %(start)s AND end_time = %(end)s
            """, (time))
            section_time = self.cursor.fetchone()[0]
            self.insert_sectiontimes(crn, time['day'], section_time)

        self.db.commit()

    def delete_term_data(self, term):
        self.cursor.execute("""
            DELETE FROM SectionTimes
            WHERE term = %s
        """, [term])

        # Reset the auto-generated id counter
        self.cursor.execute("""
            SELECT setval('sectiontimes_id_seq', MAX(id)) FROM SectionTimes
        """)

    def insert_update_course(self, short_name, full_name):
        self.cursor.execute("""
            INSERT INTO Courses VALUES (%(short_name)s, %(full_name)s)
            ON CONFLICT (short_name) DO UPDATE
            SET full_name = %(full_name)s
        """, {'short_name': short_name, 'full_name': full_name})

    def insert_times(self, start_time, end_time):
        # Not using ON CONFLICT DO NOTHING because otherwise id increments even if there is a conflict
        self.cursor.execute("""
            INSERT INTO TimeBlocks (start_time, end_time)
            SELECT %(start_time)s, %(end_time)s
            WHERE NOT EXISTS (
                SELECT *
                FROM TimeBlocks
                WHERE start_time = %(start_time)s AND end_time = %(end_time)s
            )
        """, {'start_time': start_time, 'end_time': end_time})
        
    def insert_sectiontimes(self, crn, day, section_time):
        # Not using ON CONFLICT DO NOTHING because otherwise id increments even if there is a conflict
        self.cursor.execute("""
            INSERT INTO SectionTimes (crn, day, section_time)
            SELECT %(crn)s, %(day)s, %(section_time)s
            WHERE NOT EXISTS (
                SELECT *
                FROM SectionTimes
                WHERE crn = %(crn)s AND day = %(day)s AND section_time = %(section_time)s
            )
        """, {'crn': crn, 'day': day, 'section_time': section_time})
