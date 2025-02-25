# Group-Design-Project

## Backend Statement
`Most of the back-end development work is focused on the Controller, Service, and Mapper layers, so there’s no need to modify the .py files in the main folder.`
## Project Structure Statements
1. **Controller**
Acts as the entry point for incoming requests (HTTP requests).
Handles routing and delegates business logic to the Service layer.
Returns responses back to the client in the appropriate format (JSON format).

2. **Service**
Encapsulates the core business logic of the application.
Orchestrates data flow between the Controller and the data access layer (Mapper).
Ensures the correct sequence of operations and enforces any application rules or validations.

3. **Mapper/DAO/Repository**
Responsible for direct interactions with the database (e.g., SQL queries).
Translates between in-memory objects and database records.
Provides CRUD (Create, Read, Update, Delete) operations and other data-related functions.

4. **Models**
Represent the data structures/entities used within the application. Create SQL tables.
Serve as the blueprint for how data is stored, accessed, and manipulated in the application.