from flask import Flask, render_template, request
import json
import glob
import re
import datetime
import time

app = Flask(__name__)


file_list = []

def list_files():
   #file_list = os.listdir('../ambient')

   return glob.glob('../ambient/*.log')


def parse_log_line(line):
   None
   log_re = r'time=(.+),Oxygen=(.+),Co2=(.+),Temperature=(.+),Humidity=(.+)'

   log_split = re.findall(log_re, line)
   #print(log_split)

   dt = datetime.datetime.strptime(log_split[0][0],'%Y-%m-%d %H:%M:%S.%f')

   #print(dt)

   return time.mktime(dt.timetuple()),float(log_split[0][1]),float(log_split[0][2]),float(log_split[0][3]),float(log_split[0][4])

def load_files(file_index_list):
   timestamps = []
   values = {
      'o2':[],
      'co2':[],
      'temp':[],
      'hum':[]
   }

   for file_idx in file_index_list:
      print(file_list)
      with open(file_list[file_idx]) as f:
         flogs = f.readlines()
         for l in flogs:
            ts, o2, co2, temp, hum = parse_log_line(l)
            timestamps.append(ts)
            values['o2'].append(o2)
            values['co2'].append(co2)
            values['temp'].append(temp)
            values['hum'].append(hum)



   return [timestamps, values]


@app.route('/file_select.html')
def hello_world():
   global file_list
   file_list = list_files()
   
   fl = []

   for file in file_list:
      name_ = re.findall(r'(\d+)-(\d+)-(\d+)', file)
      print(name_)
      if len(name_) > 0:
         fl.append(name_[0])

   return render_template('file_select.html', file_list = fl)

@app.route('/req_data', methods = ['POST'])
def req_data():

   days = request.values.get('selected_days', '')
   print("selected days:{}".format(days))
   
   days = json.loads(days)

   print(days)

   return json.dumps(load_files(days))





if __name__ == '__main__':
   app.run(debug=True) #host='0.0.0.0'