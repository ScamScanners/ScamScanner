import utils
import importlib
importlib.reload(utils)


############ Set Baselines for which emotions are expected ############

# # get job id for test folder
# test_folder = "raw_data/Test"
# test_job_ids = utils.get_job_ids(test_folder)
# test_predictions = utils.get_job_predictions(test_job_ids)
# test_emotions, test_average_sum = utils.get_top_emotions(test_predictions)
# # sorted_test_emotions = sorted(test_emotions, key=test_emotions.get, reverse=True)

# get job id for scam folder
scam_folder = "raw_data/Scam"
scam_job_ids = utils.get_job_ids(scam_folder)
scam_predictions = utils.get_job_predictions(scam_job_ids)
scam_emotions = utils.get_top_emotions(scam_predictions)
print(scam_emotions)

# get job id for non-scam folder
non_scam_folder = "raw_data/Non-Scam"
non_scam_job_ids = utils.get_job_ids(non_scam_folder)
non_scam_predictions = utils.get_job_predictions(non_scam_job_ids)
non_scam_emotions = utils.get_top_emotions(non_scam_predictions)
print(non_scam_emotions)

