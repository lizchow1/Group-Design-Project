#### Seed Dummy Users
1. URL: `/api/users/seed`
2. Method: `POST`
3. Request format: `null`
4. Response format
```json
{
  "message": "Dummy users seeded successfully",
  "seeded_users": [
    {
      "created_at": "2025-02-19T18:30:30.617410",
      "email": "userakvcmk@example.com",
      "firebase_uid": "dummy_akvcmk",
      "id": 5,
      "username": "userakvcmk"
    },
    {
      "created_at": "2025-02-19T18:30:30.620611",
      "email": "userovycgz@example.com",
      "firebase_uid": "dummy_ovycgz",
      "id": 6,
      "username": "userovycgz"
    }
  ]
}
```

#### User Registration
1. URL: `/api/users/register`
2. Method: `POST`
3. Request format: 
```json
{
  "firebaseToken": "sample_firebase_token_registration",
  "email": "newuser@example.com",
  "username": "newuser"
}
```

4. Response format
```json
{
  "id": 3,
  "firebase_uid": "uid_from_firebase",
  "email": "newuser@example.com",
  "username": "newuser",
  "created_at": "2023-02-10T12:34:56.789Z"
}
```

#### User Registration
1. URL: `/api/users/login`
2. Method: `POST`
3. Request format: 
```json
{
  "firebaseToken": "sample_firebase_token_registration"
}
```
4. Response format:
```json
{
  "id": 3,
  "firebase_uid": "uid_from_firebase",
  "email": "newuser@example.com",
  "username": "newuser",
  "created_at": "2023-02-10T12:34:56.789Z"
}
```

#### Get User By ID
1. URL: `/api/users/<int:user_id>`
2. Method: `GET`
3. Request format: `null`
4. Response format:
```json
{
  "created_at": "2025-02-19T18:11:11.922979",
  "email": "useroibykx@example.com",
  "firebase_uid": "dummy_oibykx",
  "id": 1,
  "username": "useroibykx"
}
```
```json
{
  "error": "User not found"
}
```


#### Get User By Username
1. URL: `/api/users/username/<string:username>`
2. Method: `GET`
3. Request format: `null`
4. Response format:
```json
{
  "created_at": "2025-02-19T18:11:11.925909",
  "email": "useryyclae@example.com",
  "firebase_uid": "dummy_yyclae",
  "id": 2,
  "username": "useryyclae"
}
```
```json
{
  "error": "User not found"
}
```
