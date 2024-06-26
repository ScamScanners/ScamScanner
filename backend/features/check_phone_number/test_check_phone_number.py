from checking_FTC import check_ftc_records

if __name__ == "__main__":
    # Lookup by Company_Phone_Number
    phone_number = 6789419950
    status, count, time_taken, total_records = check_ftc_records(phone_number)

    if status == 1:
        # Process the result if needed
        print(f"Lookup result: \n {count}")
        print(f"Time taken: {time_taken:.10f} seconds")
        print(f"Total records: {total_records}")
    else:
        # Handle the case when record is not found
        print("Record not found")
        print(f"Time taken: {time_taken:.10f} seconds")
        print(f"Total records: {total_records}")
