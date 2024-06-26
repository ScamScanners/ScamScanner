import json
import pytest
from unittest.mock import patch
from flask import Flask
from applications import app  # Adjust as per your project structure


@pytest.fixture
def client():
    with app.test_client() as client:
        yield client


@patch("applications.check_ftc_records")
def test_check_phone_number_success(mock_check_ftc_records, client):
    # Mock the check_ftc_records function
    mock_check_ftc_records.return_value = (1, "Result found", 0.123456789, 1)

    # Prepare data for POST request
    data = {"phone_number": "1234567890"}
    headers = {"Content-Type": "application/json"}

    # Send POST request to the API endpoint
    response = client.post(
        "/api/check_phone_number", data=json.dumps(data), headers=headers
    )
    assert response.status_code == 200

    # Check the JSON response content
    json_data = json.loads(response.data)
    assert json_data["status"] == "success"
    assert json_data["result"] == "Result found"
    assert (
        "seconds" in json_data["time_taken"]
    )  # Check if time_taken is formatted correctly
    assert json_data["total_records"] == 1

    # Print the JSON response for visibility
    print("Success Test Result:")
    print(json_data)


@patch("applications.check_ftc_records")
def test_check_phone_number_error(mock_check_ftc_records, client):
    # Mock the check_ftc_records function
    mock_check_ftc_records.return_value = (0, None, 0.987654321, 0)

    # Prepare data for POST request
    data = {"phone_number": "5551234567"}
    headers = {"Content-Type": "application/json"}

    # Send POST request to the API endpoint
    response = client.post(
        "/api/check_phone_number", data=json.dumps(data), headers=headers
    )
    assert response.status_code == 200

    # Check the JSON response content
    json_data = json.loads(response.data)
    assert json_data["status"] == "not_found"
    assert json_data["message"] == "Record not found"
    assert (
        "seconds" in json_data["time_taken"]
    )  # Check if time_taken is formatted correctly
    assert json_data["total_records"] == 0

    # Print the JSON response for visibility
    print("Error Test Result:")
    print(json_data)


@patch('applications.summarize_call')  # Adjust this to the actual import path
def test_summarize_call_success(mock_summarize_call, client):
    # Mock the summarize_call function
    mock_summarize_call.return_value = "This is a summary."

    # Prepare data for POST request
    data = {
        "message": "This is a test message."
    }
    headers = {
        'Content-Type': 'application/json'
    }

    # Send POST request to the API endpoint
    response = client.post('/api/summarize', data=json.dumps(data), headers=headers)
    assert response.status_code == 200

    # Check the JSON response content
    json_data = json.loads(response.data)
    assert json_data['summary'] == "Summary of the call: This is a summary."

    # Print the JSON response for visibility
    print("Success Test Result:")
    print(json_data)

@patch('applications.summarize_call')  # Adjust this to the actual import path
def test_summarize_call_no_message(mock_summarize_call, client):
    # Mock the summarize_call function to return None
    mock_summarize_call.return_value = None

    # Prepare data for POST request
    data = {
        "message": ""
    }
    headers = {
        'Content-Type': 'application/json'
    }

    # Send POST request to the API endpoint
    response = client.post('/api/summarize', data=json.dumps(data), headers=headers)
    assert response.status_code == 400

    # Check the JSON response content
    json_data = json.loads(response.data)
    assert json_data['error'] == "No message provided"

    # Print the JSON response for visibility
    print("No Message Test Result:")
    print(json_data)


# Run the tests
# pytest -s test_application.py
