import requests
import json
import time

import os
# from dotenv import load_dotenv
# load_dotenv()
hume_api_key = os.getenv('HUME_API_KEY')

def get_job_ids(folder, max_retries=3, retry_delay=5):
    '''Get job IDs'''
    

    job_ids = []

    url = "https://api.hume.ai/v0/batch/jobs"
    headers = {
        "X-Hume-Api-Key": hume_api_key
    }
    data={
        'json': json.dumps({
            "models": {
            "prosody": {
                "granularity": "sentence",
                "identify_speakers": True
                }
            }
        }),
    }
    # Iterate over all files in the scam folder
    for filename in os.listdir(folder):
        if filename.endswith(".mp3"):  # Check if the file is an mp3
            file_path = os.path.join(folder, filename)
            
            with open(file_path, "rb") as file:
                files = {
                    'file': (filename, file, 'audio/mpeg')
                }
                
                success = False
                for attempt in range(max_retries):
                    response = requests.post(url, headers=headers, files=files, data=data, timeout=10)
                    if response.status_code == 200:
                        job_id = response.json().get('job_id')
                        if job_id:
                            job_ids.append(job_id)
                            print(f"Job ID for {filename}: {job_id}")
                            success = True
                            break
                        else:
                            print(f"Failed to get job ID for {filename}: {response.json()}")
                            break
                    elif response.status_code == 400:
                        print(f"Request failed for {filename} with status code {response.status_code}, retrying in {retry_delay} seconds...")
                        time.sleep(retry_delay)
                    else:
                        print(f"Request failed for {filename} with status code {response.status_code}")
                        break
                
                if not success:
                    print(f"Failed to process {filename} after {max_retries} attempts")
    return job_ids

def get_job_predictions(job_ids, max_retries=3, retry_delay=5):
    '''Get job predictions'''
    job_predictions = []
    for job_id in job_ids:
        success = False
        for attempt in range(max_retries):
            response = requests.get(
                f"https://api.hume.ai/v0/batch/jobs/{job_id}/predictions", 
                headers={
                    "X-Hume-Api-Key": hume_api_key
                },
                timeout=20
            )
            if response.status_code == 200:
                job_predictions.append(response.json())
                print(f"Job predictions for {job_id}: {response.json()}")
                success = True
                break
            elif response.status_code == 400:
                print(f"Request failed for job {job_id} with status code {response.status_code}, retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print(f"Request failed for job {job_id} with status code {response.status_code}")
                break
        if not success:
            print(f"Failed to get predictions for job {job_id} after {max_retries} attempts")

    return job_predictions

def get_top_emotions(job_predictions, n_top_values=5, peak_threshold=.7):
    emotion_output = {}
    emotions_dict = {}
    peaked_emotions_w_score_time_dict = {}

    for job in job_predictions:
        for file in job:
            for prediction in file['results']['predictions']:
                for grouped_prediction in prediction['models']['prosody']['grouped_predictions']:
                    for grouped_prediction_prediction in grouped_prediction['predictions']:
                        for emotion in grouped_prediction_prediction['emotions']:
                            if emotion['name'] not in emotions_dict:
                                emotions_dict[emotion['name']] = emotion['score']
                            else:
                                emotions_dict[emotion['name']] = emotions_dict[emotion['name']] + emotion['score']
                            if emotion['score'] >= peak_threshold:
                                peaked_emotions_w_score_time_dict.update({emotion['name']: (emotion['score'], grouped_prediction_prediction['time']) })

        # Emotion Score Average
        emotions_average = {}
        emotion_dict_length = len(emotions_dict)

        for emotion, score in emotions_dict.items():
                emotions_average[emotion] = score / emotion_dict_length

        ascend_sorted_emotion_average = sorted(emotions_average, key=emotions_average.get, reverse=True)

        for i in range(n_top_values):
            emotion = ascend_sorted_emotion_average[i]
            if emotion not in emotion_output:
                emotion_output[emotion] = 0
            emotion_output[emotion] += 1 

        print(job, emotion_output)
    
    return emotion_output

def get_with_retries(url, headers, max_retries=3, retry_delay=5):
    for attempt in range(max_retries):
        response = requests.get(url, headers=headers, timeout=10)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"Request failed with status code {response.status_code}, retrying in {retry_delay} seconds...")
            time.sleep(retry_delay)
    print(f"Failed to get a successful response after {max_retries} attempts")

    return response

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