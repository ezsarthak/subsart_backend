import json
from pymongo import MongoClient

def upload_json_to_mongodb(json_file_path, db_name, collection_name, mongo_uri="mongodb://localhost:27017/"):
    try:
        # Connect to MongoDB
        client = MongoClient(mongo_uri)
        db = client[db_name]
        collection = db[collection_name]
        print(f"Connected to MongoDB: {mongo_uri}")

        # Load JSON data from file
        with open(json_file_path, 'r', encoding='utf-8') as file:
            data = json.load(file)

        # Ensure data is a list of documents
        if isinstance(data, dict):
            data = [data]

        # Insert data into collection
        result = collection.insert_many(data)
        print(f"Inserted {len(result.inserted_ids)} documents into '{db_name}.{collection_name}'")

    except Exception as e:
        print(f"Error: {e}")

    finally:
        client.close()
        print("MongoDB connection closed.")


if __name__ == "__main__":
    # 📝 Example usage
    json_file_path = "C:/Users/lenovo/StudioProjects/subscart_assignment/backend/data/orders.json"  # Path to your JSON file
    db_name = "subscart"
    collection_name = "orders"
    mongo_uri = "mongodb+srv://server:Sarthak0510@users.nqq7st0.mongodb.net/"  # or your MongoDB Atlas URI

    upload_json_to_mongodb(json_file_path, db_name, collection_name, mongo_uri)
