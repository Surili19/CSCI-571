# Copyright 2018 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START gae_python38_app]
# [START gae_python3_app]

# from flask import Flask
from flask import Flask, jsonify, request, send_from_directory

import requests
import os
from datetime import datetime
from dateutil import relativedelta
import math


API_KEY="c82n6cqad3ia12597ss0"
# If `entrypoint` is not defined in app.yaml, App Engine will look for an app
# called `app` in `main.py`.
app = Flask(__name__, static_folder='static')


# @app.route('/attempt')
@app.route('/')
def index():
    root_dir = os.path.dirname(os.getcwd())
    print(root_dir)
    # return root_dir
    return send_from_directory("static","index.html")



@app.route('/finnAPI/Company/ticker=<string:ticker>')
def profile(ticker):

    response = requests.get('https://finnhub.io/api/v1/stock/profile2?symbol='+ticker+'&token='+API_KEY)
    print(response.json())
    return jsonify(response.json())
    
@app.route('/finnAPI/Summary/ticker=<string:ticker>')
def quote(ticker):

    response = requests.get('https://finnhub.io/api/v1/quote?symbol='+ticker+'&token='+API_KEY)
    return jsonify(response.json())
    
@app.route('/finnAPI/Recommendation/ticker=<string:ticker>')
def recommendation(ticker):
    response = requests.get("https://finnhub.io/api/v1/stock/recommendation?symbol="+ticker+"&token="+API_KEY)
    return jsonify(response.json())

@app.route('/finnAPI/News/ticker=<string:ticker>')
def news(ticker):
    Current=datetime.today()
    Before_month=Current+relativedelta.relativedelta(months=-1)
    response = requests.get("https://finnhub.io/api/v1/company-news?symbol="+ticker+"&from="+Before_month.strftime('%Y-%m-%d')+"&to="+Current.strftime('%Y-%m-%d')+"&token="+API_KEY).json()
    articles=[]

    for newsart in response:
        print(newsart)
        if newsart['image'] !="" and newsart['datetime']!="" and newsart['headline']!="" and newsart['url'] !="":
            articles.append(newsart)
            if len(articles) >=5:
                break
    return jsonify(articles)

@app.route('/finnAPI/Charts/ticker=<string:ticker>')
def chart(ticker):

    TODAY=math.floor(datetime.now().timestamp())

    before_6months=(datetime.now()+relativedelta.relativedelta(months=-6, days=-1)).strftime('%Y-%m-%d')
    BEFORE_6month_1day=math.floor((datetime.now()+relativedelta.relativedelta(months=-6, days=-1)).timestamp())

    response=requests.get("https://finnhub.io/api/v1/stock/candle?symbol={}&resolution=D&from={}&to={}&token={}".format(ticker,BEFORE_6month_1day, TODAY,API_KEY)).json()
    if response['s']=='ok':
        response_k=[i*1000 for i in response['t']]
        
        close=list(zip(response_k,response['c']))
        volume=list(zip(response_k,response['v']))
        return {'close':close, 'volume':volume, 'date':before_6months}
    return response



if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. You
    # can configure startup instructions by adding `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python3_app]
# [END gae_python38_app]
