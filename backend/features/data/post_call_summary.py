'''Goal: Return transcript of a call from Hume API + return top 5 emotions from each of the people on the call'''
import pandas as pd
import json
from collections import defaultdict
import time

# import utils
# import importlib
# importlib.reload(utils)

import os
# from dotenv import load_dotenv
# load_dotenv()
hume_api_key = os.getenv('HUME_API_KEY')

## Transcribe the call

import requests



def run(voice_url):
    # Move all functions into local script
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
    
    ################################

    # Start job for link given
    job_id_url = "https://api.hume.ai/v0/batch/jobs"
    headers={
        "X-Hume-Api-Key": hume_api_key,
        "Content-Type": "application/json"
    }
    json_headers={
        "urls": [
        voice_url
        ],
        "notify": False,
        "transcription": {
        "identify_speakers": True
        },
        "models": {
        "prosody": {
            "granularity": "sentence",
            "identify_speakers": True
        }
        }
    }
    response = post_with_retries(job_id_url, headers, data=None, json_header=json_headers)
    job_id = response['job_id']

    # Get predictions for job
    predictions_url = f"https://api.hume.ai/v0/batch/jobs/{job_id}/predictions"
    headers = {
        "X-Hume-Api-Key": hume_api_key
    }
    response = get_with_retries(predictions_url, headers)

    all_speakers_prediction_out = response[0]['results']['predictions'][0]['models']['prosody']['grouped_predictions']


    from collections import defaultdict

    # Assuming all_speakers_prediction_out is defined and contains the data

    text_time_dict = {}
    emotion_scores = defaultdict(lambda: defaultdict(list))
    speaker_sum_emot = {}

    # Create dictionary of transcript, speaker, and timestamp
    for speaker in all_speakers_prediction_out:
        current_speaker = speaker['id'].replace('spk_', 'Speaker ')

        for prediction in speaker['predictions']:
            # Get highest emotions
            segment_emotions = prediction['emotions']
            sorted_emotions = sorted(segment_emotions, key=lambda x: x['score'], reverse=True)

            # Join together the speaker, top emotion, and transcript
            text = f"{current_speaker} ({sorted_emotions[0]['name']}): {prediction['text']}"
            text_time_dict[text] = prediction['time']['begin']

            ### Summary of emotions
            for emotion in prediction['emotions']:
                emotion_scores[current_speaker][emotion['name']].append(emotion['score'])

        # Calculate average emotions for the current speaker
        average_emotion_scores = {emotion: sum(scores)/len(scores) for emotion, scores in emotion_scores[current_speaker].items()}
        sorted_emotions = sorted(average_emotion_scores.items(), key=lambda x: x[1], reverse=True)
        top_3_emotions = [emotion[0] for emotion in sorted_emotions[:3]]
        speaker_sum_emot[current_speaker] = top_3_emotions

    # Sort dictionary by time so that the transcript is in order
    sorted_speech = sorted(text_time_dict, key=text_time_dict.get, reverse=False)

    full_transcript_plus_emotions = "\n".join(sorted_speech) + "\n\n" + str(speaker_sum_emot)

    return full_transcript_plus_emotions

if __name__ == "__main__":
    test_voice_url = "https://valorant-crosshairs.s3.us-west-1.amazonaws.com/UC+Berkeley.mp3"
    run(test_voice_url)