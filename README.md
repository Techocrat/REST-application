# API ROUTES


#### 1. REGISTER

```
POST http://localhost:3000/api/v1/auth/register
```

```
Content-Type: application/json

{
    "firstName": "Jashan",
    "lastName": "Puri",
    "email" : "Jashan@gmail.com",
    "password": "Jashan",
    "confirmPassword": "Jashan",
    "role": "user"
}
```

#### 2. LOGIN USER

```
POST http://localhost:3000/api/v1/auth/login
```

```
Content-Type: application/json

{
    "email" : "harini@gmail.com",
    "password": "harini"
}

```

#### 3. UPDATE USER
```
PUT http://localhost:3000/api/v1/user/update/:id
Authorization: Bearer <Token>
```
```
Content-Type: application/json

{
    "email" : "lastCheck@gmail.com",
    "department": "Computer Science",
    "middleName": "Kapoor"
}
```

#### 4. UPDATE ADMIN
```
PUT http://localhost:3000/api/v1/admin/update/:id
Authorization: Bearer <Token>

```
```
content-type: application/json

{
    "email" : "changed@gmail.com",
    "department": "IT"
}
```

#### 5. USER VIEW BY ID
```
GET http://localhost:3000/api/v1/user/:id
Authorization: Bearer <Token>
```

#### 6. ADMIN VIEW ADMIN
```
GET http://localhost:3000/api/v1/admin/:id
Authorization: Bearer <Token>
```