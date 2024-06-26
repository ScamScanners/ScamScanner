import pandas as pd
import json
import time
import requests
import os

# import utils
# import importlib
# importlib.reload(utils)

# import os
# from dotenv import load_dotenv
# load_dotenv()
hume_api_key = os.getenv('HUME_API_KEY')


test_voice_url = "https://valorant-crosshairs.s3.us-west-1.amazonaws.com/UC+Berkeley.mp3"

def run(voice_url):
    '''Input S3 url link to a mp3 file and return the percentage likelihood of scam in the audio file.'''
    def post_with_retries(url, headers, data=None, json_header=None, max_retries=3, retry_delay=5):
        for attempt in range(max_retries):
            response = requests.post(url, headers=headers, data=data, json=json_header,  timeout=10)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Request failed with status code {response.status_code}, retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
        print(f"Failed to get a successful response after {max_retries} attempts")

        return response
    def get_with_retries(url, headers, max_retries=3, retry_delay=5):
        for attempt in range(max_retries):
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Request failed with status code {response.status_code}, retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
        print(f"Failed to get a successful response after {max_retries} attempts")
        

    # Get list of all models
    model_get_url = "https://api.hume.ai/v0/registry/models"
    headers={
            "X-Hume-Api-Key": hume_api_key
        }
    
    response = get_with_retries(model_get_url, headers)

    models_list_df = pd.DataFrame(response['content'])
    scam_model_id = models_list_df[models_list_df['name'] == 'Scam Model']['id'].values[0]

    # Get custom model Job ID
    start_job_url = "https://api.hume.ai/v0/batch/jobs/tl/inference"
    headers = {
        "X-Hume-Api-Key": hume_api_key,
        "Content-Type": "application/json"
    }
    data = {
        "custom_model": {
            "id": scam_model_id
        },
        "urls": [voice_url]
    }
    response = post_with_retries(start_job_url, headers, data=json.dumps(data))
    print(response)
    job_id = response['job_id']

    # Get custom model job predictions 
    predictions_url = f"https://api.hume.ai/v0/batch/jobs/{job_id}/predictions"
    headers={
        "X-Hume-Api-Key": hume_api_key
    }
    response = get_with_retries(predictions_url, headers)

    custom_model = response[0]['results']['predictions'][0]['custom_models']

    first_key = next(iter(custom_model))
    true_value = custom_model[first_key]['output']['True']
    true_value = round(true_value, 4)*100

    return true_value

# run if this is the main file
if __name__ == "__main__":
    run(test_voice_url)