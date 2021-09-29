from flask import Flask, render_template, request
import json
import glob
import re

app = Flask(__name__)


file_list = []

def list_files():
   #file_list = os.listdir('../ambient')

   return glob.glob('../ambient/*.log')


def load_files(file_index_list):
   timestamps = []
   values = {}

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