# FTC_API="zI0hO0eZ10RrezEmHhHiPRf61zJpUCicorlr5qQ6"
import pandas as pd
import time


def check_ftc_records(phone_number):

    phone_number = int(phone_number)
    file_path = "./phone_number_counts.csv"
    combined_df = pd.read_csv(file_path)
    total_records = combined_df.shape[0]

    # Create DataFrame
    df = pd.DataFrame(combined_df)

    # Set Company_Phone_Number as index for fast lookup
    df.set_index("Company_Phone_Number", inplace=True)

    start_time = time.time()

    # Lookup by Company_Phone_Number
    if phone_number in df.index:
        count = df.loc[phone_number]
        end_time = time.time()
        # print(f"Lookup result:\n{result}")
        time_taken = end_time - start_time
        # print(f"Time taken for lookup: {time_taken:.10f} seconds")
        count = count.values[0]
        print(f"Count: {type(count)}")
        count = int(count)
        print(f"Inpdated Count: {type(count)}")
        return 1, count, time_taken, total_records
    else:
        end_time = time.time()
        # print("Result not found")
        time_taken = end_time - start_time
        # print(f"Time taken for lookup: {time_taken:.10f} seconds")
        return (
            0,
            None,
            time_taken,
            total_records,
        )  # Return 0, None, and time taken when record is not found
