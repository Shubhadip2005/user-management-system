# User REST API

A professional REST API built with Node.js and Express for managing User entities with CRUD operations.

## Features

- ✅ Complete CRUD operations (Create, Read, Update, Delete)
- ✅ Input validation
- ✅ Email uniqueness check
- ✅ Proper error handling
- ✅ Security headers (Helmet)
- ✅ CORS enabled
- ✅ Request logging (Morgan)
- ✅ Environment variables support
- ✅ Professional folder structure
- ✅ RESTful API design

## Project Structure

```
user-rest-api/
├── controllers/
│   └── userController.js    # Request handlers
├── models/
│   └── User.js              # User model with validation
├── routes/
│   └── userRoutes.js        # API routes
├── services/
│   └── userService.js       # Business logic
├── middleware/
│   └── errorHandler.js      # Error handling middleware
├── app.js                   # Express app configuration
├── server.js                # Server entry point
├── package.json             # Dependencies
├── .env                     # Environment variables
├── .gitignore              # Git ignore file
└── README.md               # This file
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Step-by-Step Installation

1. **Navigate to the project folder:**
   ```bash
   cd user-rest-api
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - The `.env` file is already created with default values
   - You can modify the PORT if needed (default is 3000)

4. **Start the server:**

   **Development mode (with auto-reload):**
   ```bash
   npm run dev
   ```

   **Production mode:**
   ```bash
   npm start
   ```

5. **Verify the server is running:**
   - Open your browser and go to: `http://localhost:3000`
   - You should see a welcome message with API documentation

## API Endpoints

### Base URL: `http://localhost:3000/api/users`

| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| GET | `/api/users` | Get all users | - |
| GET | `/api/users/:id` | Get user by ID | - |
| POST | `/api/users` | Create new user | `{ name, email, age }` |
| PUT | `/api/users/:id` | Update user (full) | `{ name, email, age }` |
| PATCH | `/api/users/:id` | Update user (partial) | `{ name?, email?, age? }` |
| DELETE | `/api/users/:id` | Delete user | - |

### User Schema

```json
{
  "id": "number (auto-generated)",
  "name": "string (required, non-empty)",
  "email": "string (required, valid email, unique)",
  "age": "number (required, integer, 0-150)",
  "createdAt": "date (auto-generated)",
  "updatedAt": "date (auto-generated)"
}
```

## API Usage Examples

### 1. Get All Users
```bash
curl http://localhost:3000/api/users
```

**Response:**
```json
{
  "success": true,
  "count": 3,
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "age": 30,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get User by ID
```bash
curl http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 3. Create New User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Williams",
    "email": "alice@example.com",
    "age": 28
  }'
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": 4,
    "name": "Alice Williams",
    "email": "alice@example.com",
    "age": 28,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### 4. Update User (Full Update - PUT)
```bash
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Updated",
    "email": "john.updated@example.com",
    "age": 31
  }'
```

### 5. Update User (Partial Update - PATCH)
```bash
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "age": 32
  }'
```

### 6. Delete User
```bash
curl -X DELETE http://localhost:3000/api/users/1
```

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "age": 30
  }
}
```

## Testing with Postman or Thunder Client

You can also test the API using GUI tools:

1. **Postman**: Import the endpoints and test
2. **Thunder Client** (VS Code extension): Create requests
3. **Insomnia**: Another popular API testing tool

## Error Handling

The API provides clear error messages:

### Example: Invalid Email
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Email must be a valid email address"
}
```

### Example: User Not Found
```json
{
  "success": false,
  "error": "Not Found",
  "message": "User not found"
}
```

### Example: Duplicate Email
```json
{
  "success": false,
  "error": "Bad Request",
  "message": "Email already exists"
}
```

## Validation Rules

- **Name**: Required, must be a non-empty string
- **Email**: Required, must be valid email format, must be unique
- **Age**: Required, must be an integer between 0 and 150

## Health Check

Check if the server is running:
```bash
curl http://localhost:3000/health
```

## Dependencies

- **express**: Web framework
- **dotenv**: Environment variables
- **cors**: Cross-Origin Resource Sharing
- **helmet**: Security headers
- **morgan**: HTTP request logger
- **nodemon**: Auto-restart server (dev dependency)

## Development Notes

- Data is stored in-memory (resets on server restart)
- Sample data is seeded on startup
- For production, connect to a real database (MongoDB, PostgreSQL, etc.)

## Future Enhancements

- [ ] Connect to a real database
- [ ] Add authentication & authorization
- [ ] Add pagination for GET all users
- [ ] Add filtering and sorting
- [ ] Add unit tests
- [ ] Add API rate limiting
- [ ] Add API documentation (Swagger)

## License

ISC

## Author

Senior Web Developer

---

**Happy Coding! 🚀**