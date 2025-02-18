*Express API*
# Fundoo-Notes
*Date-10-02-25 to 15-02-25* 

This project is a REST API built using Node.js and Express.js, implementing user authentication and CRUD operations for user and note management.

## Features

- User registration and authentication
- Secure password handling with JWT authentication
- CRUD operations for users and notes
- Middleware for authentication and request validation
- Modular code structure with controllers, validators, and middleware

## Installation

1. Clone the repository:

   sh
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   

2. Install dependencies:

   sh
   npm install
   

3. Set up environment variables:

   Create a .env file in the root directory and configure the required variables.

   sh
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   

4. Run the server:

   sh
   npm start
   

## API Endpoints

### User Routes

| Method | Endpoint           | Description                | Authentication |
|--------|--------------------|----------------------------|---------------|
| POST   | /register        | Register a new user        | No            |
| POST   | /login           | Authenticate a user        | No            |
| GET    | /getUsers        | Retrieve all users        | Yes           |
| POST   | /forget          | Forgot password request    | No            |
| POST   | /resetPassword   | Reset user password       | No            |

### Note Routes

| Method | Endpoint    | Description                  | Authentication |
|--------|------------|------------------------------|---------------|
| POST   | /        | Create a new note            | Yes           |
| GET    | /        | Get all notes                | Yes           |
| GET    | /:id     | Get a specific note by ID    | Yes           |
| PUT    | /:id     | Update a note by ID          | Yes           |
| DELETE | /:id     | Delete a note by ID          | Yes           |
