from flask import Flask, jsonify, request
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/json/record_table.json', methods=['GET', 'PUT'])
def record_table():
    if request.method == 'PUT':
        data = request.get_json()
        with open('json/record_table.json', 'w', encoding='utf-8') as json_file:
            json.dump(data, json_file, ensure_ascii=False)
        return jsonify({'status': 'success'}), 200
    
    with open('json/record_table.json', 'r', encoding='utf-8') as json_file:
        data = json.load(json_file)
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
