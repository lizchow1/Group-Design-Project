1. run `pip install -r requirements.txt` to install all requirements

## Project Structure Statements
1. **Controller**
Acts as the entry point for incoming requests (e.g., HTTP requests).
Handles routing and delegates business logic to the Service layer.
Returns responses back to the client in the appropriate format (e.g., JSON).

2. **Service**
Encapsulates the core business logic of the application.
Orchestrates data flow between the Controller and the data access layer (Mapper).
Ensures the correct sequence of operations and enforces any application rules or validations.
Mapper (also known as the Data Access Object, DAO, or Repository):
Responsible for direct interactions with the database (e.g., SQL queries).
Translates between in-memory objects and database records.
Provides CRUD (Create, Read, Update, Delete) operations and other data-related functions.

3. **Models**
Represent the data structures/entities used within the application (e.g., a User or Recipe model).
Typically include attributes (fields) and possibly methods related to the entity’s state or validations.
Serve as the blueprint for how data is stored, accessed, and manipulated in the application.