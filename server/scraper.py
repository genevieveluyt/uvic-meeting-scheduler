# Huge thank you to Matthew Hoener, creator of schedulecourses.com, for help with this code

import requests
import re
import sys
import os
from datetime import datetime
import psycopg2
import click
from helpers.db_interface import UvicSchedulerDBInterface # pylint: disable=E0611


DATA_ROOT = 'data'

TERMS_URL = 'https://www.uvic.ca/BAN2P/bwckschd.p_disp_dyn_sched'
SUBJECTS_URL = 'https://www.uvic.ca/BAN1P/bwckgens.p_proc_term_date'
SECTIONS_URL = 'https://www.uvic.ca/BAN1P/bwckschd.p_get_crse_unsec'
OPTION_REGEX = re.compile('<OPTION VALUE="(..*?)">.*?</OPTION>')
SUBJECTS_REGEX = re.compile('<select name="sel_subj" .*?>(.*?)</select>', flags=re.DOTALL)
COURSE_DETAILS_REGEX = re.compile(
    'CLASS="ddtitle".*?><a .*?>(?-s:(?P<name>.*) - (?P<crn>.*?) - (?P<short_name>.*?) - ' \
    '(?P<section>.*?))</a>.*?CLASS="datadisplaytable".*?</caption>(?P<section_data>.*?)</table>',
    flags=re.DOTALL
)
COURSE_TIME_REGEX = re.compile(
    '<tr>\n<td .*?>Every Week</td>\n<td .*?>(?P<start_time>.*?) - (?P<end_time>.*?)</td>\n' \
    '<td .*?>(?P<days>.*?)</td>'
)
COURSE_TIME_FORMAT = '%I:%M %p'

db = None

@click.command()
@click.option('--user', help='User to use when connecting to the database.')
@click.option('--password', help='Password to use when connecting to the database.')
@click.option('--term', help='Term for which to scrape course data. By default uses the most recent term. Eg "201801"')
@click.option('--subject', help='Subject for which to scrape course data. By default, all subjects are scraped. Eg "CSC"')
@click.option('--course', help='Course for which to scrape data. By default, all courses are scraped. Eg "CSC 110"')
@click.option('--file_only/--db', default=False, help='By default, scraped data will be written to file and saved to the database. This setting only applies if no subject or course are specified using the --subject or --course options.')
@click.option('--update_db/--no_update', default=False, help='When subject or course are specified, by default the output will be displayed on the console and the database not updated.')
def main(user, password, term, subject, course, file_only, update_db):
    custom_scrape = subject is not None or course is not None
    write_to_db = (not custom_scrape and not file_only) or (custom_scrape and update_db)
    
    if write_to_db:
        if user is None:
            user = input("Database user: ")
        global db
        db = UvicSchedulerDBInterface(user, password)
    
    if not term:
        term = get_current_term()
        
    print('Scraping courses for', term)
    scrape_courses(term, subject, course, custom_scrape, write_to_db)

    if write_to_db:
        db.close()

def get_current_term():
    now = datetime.now()
    month = 0
    if now.month >= 9:
        month = 9
    elif now.month >= 5:
        month = 5
    else:
        month = 1

    return "%d0%d" % (now.year, month)

def get_terms():
    html = requests.post(TERMS_URL).text
    return OPTION_REGEX.findall(html)

def scrape_courses(term, subject, course, custom_scrape, write_to_db):
    if custom_scrape:
        subjects = [subject if subject is not None else course.split()[0]]
        output = sys.stdout
    else:
        term_payload = {
            'p_calling_proc': 'bwckschd.p_disp_dyn_sched',
            'p_term': term
        }

        html = requests.post(SUBJECTS_URL, params=term_payload).text
        subjects = OPTION_REGEX.findall(SUBJECTS_REGEX.search(html).group(1))

        data_file_name = '%s/%s.txt' % (DATA_ROOT, term)
        os.makedirs(os.path.dirname(data_file_name), exist_ok=True)
        output = open(data_file_name, 'w')

    subject_payload = {
        'term_in': term,
        'sel_day': 'dummy',
        'sel_schd': ['dummy', '%'],
        'sel_subj': ['dummy'],
        'sel_insm': ['dummy', '%'],
        'sel_camp': ['dummy', '%'],
        'sel_levl': ['dummy', '%'],
        'sel_sess': 'dummy',
        'sel_instr': ['dummy', '%'],
        'sel_ptrm': ['dummy', '%'],
        'sel_attr': 'dummy',
        'sel_crse': '',
        'sel_title': '',
        'sel_from_cred': '',
        'sel_to_cred': '',
        'begin_hh': '0',
        'begin_mi': '0',
        'begin_ap': 'a',
        'end_hh': '0',
        'end_mi': '0',
        'end_ap': 'a'
    }

    if not custom_scrape:
        printProgressBar(0, len(subjects), 'Progress', 'Complete')
    
    for i, subj in enumerate(subjects):
        subject_payload['sel_subj'].append(subj)
        html = requests.post(SECTIONS_URL, params=subject_payload).text

        matches = COURSE_DETAILS_REGEX.findall(html)
        prev_course = matches[0][0]

        for name, crn, short_name, section, section_data in matches:
            if course is not None and short_name != course:
                continue

            time_matches = COURSE_TIME_REGEX.findall(section_data)
            times = []
            weekly = True
            for start_time, end_time, days in time_matches:
                for day in days:
                    time = {
                        'day': day,
                        'start': datetime.strptime(start_time, COURSE_TIME_FORMAT).time(),
                        'end': datetime.strptime(end_time, COURSE_TIME_FORMAT).time()
                    }
                    if time not in times:
                        times.append(time)
                    else:
                        weekly = False

            if not times:
                continue

            if write_to_db:
                db.insert_update_section(short_name, name, crn, section, weekly, times, term)
            
            if prev_course != short_name:
                output.write('\n{}: {}\n'.format(short_name, name))

            output.write('{} - {}\t\tweekly: {}\n'.format(section, crn, weekly))

            for time in times:
                output.write('\t{}\t{} - {}\n'.format(time['day'], time['start'].isoformat(), time['end'].isoformat()))

            prev_course = short_name
            
        if not custom_scrape:
            printProgressBar(i, len(subjects)-1, 'Progress', 'Complete')

    if not custom_scrape:
        output.close()

def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█'):
    """
    Call in a loop to create terminal progress bar
    @params:
        iteration   - Required  : current iteration (Int)
        total       - Required  : total iterations (Int)
        prefix      - Optional  : prefix string (Str)
        suffix      - Optional  : suffix string (Str)
        decimals    - Optional  : positive number of decimals in percent complete (Int)
        length      - Optional  : character length of bar (Int)
        fill        - Optional  : bar fill character (Str)
    """
    # Source: https://stackoverflow.com/questions/3173320/text-progress-bar-in-the-console

    percent = ("{0:." + str(decimals) + "f}").format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print('\r%s |%s| %s%% %s' % (prefix, bar, percent, suffix), end = '\r')
    
    # Print New Line on Complete
    if iteration == total: 
        print()

if __name__ == '__main__':
    main() # pylint: disable=E1120
