import json
import urllib2
import pymysql

# connect
db = pymysql.connect(host="localhost", user="root", passwd="root",
                     db="europa")

cursor = db.cursor()

# execute SQL select statement
cursor.execute('''SELECT * FROM urls ORDER BY id DESC LIMIT 1''')
db.commit()
last_record = cursor.fetchone()[1]

def get_title_list(url=last_record):
    # url = "http://ec.europa.eu/research/participants/portal/data/call/rfcs/calls.json"
    data = json.load(urllib2.urlopen(url))
    data_list = data['callData']['Calls']

    title_list = []

    for title in data_list:
        title_list.append(title['Title'])
    return title_list

title_list = get_title_list()

for x in title_list:
    print(x)
