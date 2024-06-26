import os
import openai
from openai import OpenAI

from llama_index.readers.file import UnstructuredReader
from pathlib import Path
import nest_asyncio

# initialize simple vector indices
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core import Settings

# Load indices from disk
from llama_index.core import load_index_from_storage

from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.llms.openai import OpenAI
from llama_index.core.query_engine import SubQuestionQueryEngine
from llama_index.agent.openai import OpenAIAgent

openai.api_key = os.environ["OPENAI_API_KEY"]


def check_folder_structure():
    print(
        "\n Checking folder structure for training data. \n Ensure the following structure: \n Each training folder should have data folder and the files should be inside the data folder. \n"
    )

    # update the training_folder_path where the training data is stored
    training_folder_path = "backend/features/chatbot/training_data"

    folders = os.listdir(training_folder_path)

    for folder in folders:
        print(f"\n Checking folder: {folder}")
        data_folder_path = f"{training_folder_path}/{folder}/data"
        storage_folder_path = f"{training_folder_path}/{folder}/storage"

        if os.path.isdir(data_folder_path):
            if not os.listdir(data_folder_path):
                print(f"data folder is empty for folder: {folder}")
                continue
            if not os.path.exists(storage_folder_path):
                print(f"Creating storage folder for folder: {folder}")
                os.makedirs(storage_folder_path)
        else:
            print(f"data folder not found for : {folder}")
            continue

        print("Folder is ready for training :", {folder})
        Chatbot(training_folder_path, folder)
    return folders


def Chatbot(training_folder_path, folder_name):

    print("Tranining chatbot with the folder : ", folder_name)
    nest_asyncio.apply()

    files = []
    folder_path = f"{training_folder_path}/{folder_name}"
    data_folder_path = folder_path + "/data"
    storage_folder_path = folder_path + "/storage"

    # Read all file names in the folder
    file_names = os.listdir(data_folder_path)

    # Add file names without extensions to the files list
    files.extend([os.path.splitext(file_name)[0] for file_name in file_names])

    loader = UnstructuredReader()
    doc_set = {}
    all_docs = []
    for file in files:
        file_docs = loader.load_data(
            file=Path(f"{data_folder_path}/{file}.pdf"),
            split_documents=False,
        )
        # insert year metadata into each year
        for d in file_docs:
            d.metadata = {"file": file}
        doc_set[file] = file_docs
        all_docs.extend(file_docs)

    Settings.chunk_size = 512
    index_set = {}
    for file in files:
        storage_context = StorageContext.from_defaults()
        cur_index = VectorStoreIndex.from_documents(
            doc_set[file],
            storage_context=storage_context,
        )
        index_set[file] = cur_index
        storage_context.persist(persist_dir=f"{storage_folder_path}/{file}")

    index_set = {}
    for file in files:
        storage_context = StorageContext.from_defaults(
            persist_dir=f"{storage_folder_path}/{file}"
        )
        cur_index = load_index_from_storage(
            storage_context,
        )
        index_set[file] = cur_index

    individual_query_engine_tools = [
        QueryEngineTool(
            query_engine=index_set[file].as_query_engine(),
            metadata=ToolMetadata(
                name=f"vector_index_{file}",
                description=f"Answer questions based on {file} document.",
            ),
        )
        for file in files
    ]

    query_engine = SubQuestionQueryEngine.from_defaults(
        query_engine_tools=individual_query_engine_tools,
        llm=OpenAI(model="gpt-3.5-turbo"),
    )

    query_engine_tool = QueryEngineTool(
        query_engine=query_engine,
        metadata=ToolMetadata(
            name="sub_question_query_engine",
            description=f"Answer questions based on all documents.",
        ),
    )

    tools = individual_query_engine_tools + [query_engine_tool]

    # response only
    # agent = OpenAIAgent.from_tools(tools, verbose=True)

    # for chatting
    agent = OpenAIAgent.from_tools(tools)  # verbose=False by default

    print("Finished training chatbot for :", folder_name)

    return agent


if __name__ == "__main__":

    print("\n List of all folders for training : \n", check_folder_structure())

    # print(
    #     "Ask me anything related to Business Administration majors at Kutztown University of Pennsylvania. "
    #     "For example, you can ask me about the courses offered.\n Type 'exit' to quit."
    # )
    # while True:
    #     text_input = input("User: ")
    #     if text_input.lower() == "exit":
    #         break
    #     response = agent.chat(text_input)
    #     print(f"Agent: {response} \n")
