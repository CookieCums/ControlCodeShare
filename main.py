from flask import Flask, render_template, request, redirect, url_for
from flask_caching import Cache
from flask_compress import Compress
import requests
import json
import base64
import os

app = Flask(__name__)
cache = Cache(app, config={'CACHE_TYPE': 'simple'})
Compress(app)  

access_token = os.getenv('GITHUB_ACCESS_TOKEN')
imgbb_api_key = os.getenv('IMGBB_API_KEY')


gist_id = '1b13f11d51ab5812452e02c85b85e76b'


filename_to_retrieve = 'User_Data.json'


gist_url = f'https://api.github.com/gists/{gist_id}'


headers = {
    'Authorization': f'Bearer {access_token}',
    'Accept': 'application/vnd.github.v3+json'
}

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/match', methods=['POST'])
@cache.cached(timeout=300)  
def match():
    claw = float(request.form['claw'])
    game = request.form['game']
    device = request.form['device']
    device_size = float(request.form['device_size'])

 
    response = requests.get(gist_url, headers=headers)

    if response.status_code == 200:
        try:
            gist_data = response.json()
        except json.JSONDecodeError as e:
            return f"Failed to parse JSON response: {str(e)}"

        if isinstance(gist_data, dict) and 'files' in gist_data and filename_to_retrieve in gist_data['files']:
            raw_url = gist_data['files'][filename_to_retrieve]['raw_url']


            raw_response = requests.get(raw_url)

            if raw_response.status_code == 200:
                raw_data = raw_response.json()
                matched_profiles = []

                for profile in raw_data:
                    if (profile.get('claw') == claw and
                        profile.get('game') == game and
                        profile.get('device') == device and
                        profile.get('device_size') == device_size):
                        matched_profiles.append(profile)

                if matched_profiles:
                    return render_template('result.html', profiles=matched_profiles)
                else:
                    return "No profiles matched the criteria."

            else:
                return f"Failed to retrieve raw file. Status code: {raw_response.status_code}"

        else:
            return f"File {filename_to_retrieve} not found in the Gist."

    else:
        return f"Failed to retrieve Gist. Status code: {response.status_code}"

@app.route('/upload_settings', methods=['POST'])
def upload_settings():
    username = request.form['username']
    device_size = float(request.form['device_size'])
    device = request.form['device']
    game = request.form['game']
    sensitivity_code = request.form['sensitivity_code']
    control_code = request.form['control_code']
    controls_image = request.files['controls_image']
    claw = float(request.form['claw'])


    def encode_image(filestorage_object):
        encoded_string = base64.b64encode(filestorage_object.read())
        return encoded_string.decode('utf-8')

    encoded_image = encode_image(controls_image)

    payload = {
        "key": imgbb_api_key,
        "image": encoded_image,
        "expiration": 0,  
    }


    imgbb_response = requests.post("https://api.imgbb.com/1/upload", data=payload)

    if imgbb_response.status_code == 200:
        image_url = imgbb_response.json()["data"]["url"]


        response = requests.get(gist_url, headers=headers)

        if response.status_code == 200:
            gist_data = response.json()

            if filename_to_retrieve in gist_data['files']:
                try:
                    current_content = gist_data['files'][filename_to_retrieve]['content']
                    current_data = json.loads(current_content)
                except json.JSONDecodeError as e:
                    return f"Error decoding JSON: {e}"


                new_data = {
                    "username": username,
                    "device_size": device_size,
                    "device": device,
                    "controls_image_url": image_url,
                    "sensitivity_code": sensitivity_code,
                    "game": game,
                    "claw": claw,
                    "control_code": control_code
                }


                current_data.append(new_data)


                updated_payload = {
                    'description': gist_data['description'],
                    'files': {
                        filename_to_retrieve: {
                            'filename': filename_to_retrieve,
                            'content': json.dumps(current_data, indent=4)
                        }
                    },
                    'version': gist_data['history'][0]['version']  
                }


                update_response = requests.patch(gist_url, headers=headers, data=json.dumps(updated_payload))

                if update_response.status_code == 200:
                    return redirect(url_for('index'))
                else:
                    return f"Failed to update Gist. Status code: {update_response.status_code}"
            else:
                return f"File {filename_to_retrieve} not found in the Gist."
        else:
            return f"Failed to retrieve Gist details. Status code: {response.status_code}"
    else:
        return f"Failed to upload image. Status code: {imgbb_response.status_code}"

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=10000, debug=True, use_reloader=False)
