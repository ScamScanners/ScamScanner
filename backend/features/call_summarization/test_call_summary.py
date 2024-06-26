from call_summary import summarize_call

if __name__ == "__main__":
    message = "Hi, I'm calling from your Bank, you will receive on OTP. We want you to give it to us so that we can prevent a transaction which is processing for $5000. If you don't you will be charged for it.\n\nYou need to immediately give it to us.  "
    print(summarize_call(message))