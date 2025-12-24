# API Testing Examples

## Using cURL

### Get All Users
curl http://localhost:3000/api/users

### Get User by ID
curl http://localhost:3000/api/users/1

### Create New User
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "age": 25
  }'

### Update User (Full)
curl -X PUT http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Name",
    "email": "updated@example.com",
    "age": 30
  }'

### Update User (Partial)
curl -X PATCH http://localhost:3000/api/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "age": 35
  }'

### Delete User
curl -X DELETE http://localhost:3000/api/users/1

## Using JavaScript (fetch)

### Get All Users
```javascript
fetch('http://localhost:3000/api/users')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Create New User
```javascript
fetch('http://localhost:3000/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    age: 27
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Update User
```javascript
fetch('http://localhost:3000/api/users/1', {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    age: 28
  })
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```

### Delete User
```javascript
fetch('http://localhost:3000/api/users/1', {
  method: 'DELETE'
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
```