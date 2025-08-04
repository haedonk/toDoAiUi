# Backend API Requirements for Todo AI

This document outlines the API endpoints that your backend server running on `localhost:8080` needs to implement for the Todo AI frontend to work properly.

## Base URL
```
http://localhost:8080/api
```

## Authentication Endpoints

### 1. Login
- **Endpoint**: `POST /auth/login`
- **Body**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt-token-string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

### 2. Register
- **Endpoint**: `POST /auth/register`
- **Body**:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "token": "jwt-token-string",
    "user": {
      "id": "string",
      "username": "string",
      "email": "string"
    }
  }
  ```

### 3. Get Current User
- **Endpoint**: `GET /auth/me`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Response**:
  ```json
  {
    "id": "string",
    "username": "string",
    "email": "string"
  }
  ```

## Todo Endpoints

### 4. Get All Todos
- **Endpoint**: `GET /todos`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Response**:
  ```json
  [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "priority": "low" | "medium" | "high",
      "dueDate": "ISO-8601-string",
      "completed": boolean,
      "createdAt": "ISO-8601-string",
      "updatedAt": "ISO-8601-string",
      "userId": "string",
      "order": number
    }
  ]
  ```

### 5. Create Todo
- **Endpoint**: `POST /todos`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Body**:
  ```json
  {
    "title": "string",
    "description": "string",
    "priority": "low" | "medium" | "high",
    "dueDate": "ISO-8601-string"
  }
  ```
- **Response**: Same as todo object above

### 6. Update Todo
- **Endpoint**: `PUT /todos/:id`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Body**: (all fields optional)
  ```json
  {
    "title": "string",
    "description": "string",
    "priority": "low" | "medium" | "high",
    "dueDate": "ISO-8601-string",
    "completed": boolean,
    "order": number
  }
  ```
- **Response**: Updated todo object

### 7. Toggle Todo Completion
- **Endpoint**: `PATCH /todos/:id/complete`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Response**: Updated todo object with toggled `completed` status

### 8. Delete Todo
- **Endpoint**: `DELETE /todos/:id`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Response**: `204 No Content`

### 9. Reorder Todos
- **Endpoint**: `PATCH /todos/reorder`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Body**:
  ```json
  {
    "todoIds": ["id1", "id2", "id3", ...]
  }
  ```
- **Response**: Array of reordered todo objects

## AI Endpoints

### 10. Prioritize Todos
- **Endpoint**: `POST /ai/prioritize`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Body**:
  ```json
  {
    "todos": [
      // Array of todo objects
    ]
  }
  ```
- **Response**:
  ```json
  {
    "todos": [
      // Array of reordered todo objects
    ],
    "reasoning": "string explanation of the prioritization logic"
  }
  ```

### 11. Generate AI Suggestions
- **Endpoint**: `POST /ai/suggest`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Body**:
  ```json
  {
    "context": "optional string context"
  }
  ```
- **Response**:
  ```json
  {
    "suggestions": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "priority": "low" | "medium" | "high",
        "estimatedDuration": "optional string"
      }
    ],
    "context": "string explaining the suggestions"
  }
  ```

### 12. Get Cached Suggestions
- **Endpoint**: `GET /ai/suggestions`
- **Headers**: `Authorization: Bearer <jwt-token>`
- **Response**: Array of suggestion objects (same format as above)

## Health Check (Optional but Recommended)

### 13. Health Check
- **Endpoint**: `GET /health`
- **Response**:
  ```json
  {
    "status": "ok",
    "message": "Server is running",
    "timestamp": "ISO-8601-string",
    "version": "optional version string"
  }
  ```

## Error Responses

All endpoints should return appropriate HTTP status codes and error messages:

- **400 Bad Request**: Invalid request body or parameters
- **401 Unauthorized**: Missing or invalid JWT token
- **403 Forbidden**: User doesn't have permission
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists (e.g., email during registration)
- **500 Internal Server Error**: Server error

Error response format:
```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "statusCode": 400
}
```

## CORS Configuration

Make sure your backend server has CORS configured to allow requests from `http://localhost:5174` (or your frontend URL).

## JWT Token Requirements

- Tokens should be valid for a reasonable time (e.g., 24 hours)
- Include user ID in the token payload for authorization
- Frontend will send tokens in the `Authorization: Bearer <token>` header

## Database Schema Suggestions

### Users Table
- id (primary key)
- username
- email (unique)
- password (hashed)
- createdAt
- updatedAt

### Todos Table
- id (primary key)
- title
- description
- priority (enum: low, medium, high)
- dueDate
- completed (boolean)
- order (integer for sorting)
- userId (foreign key)
- createdAt
- updatedAt

This completes the API specification for your Todo AI backend!
