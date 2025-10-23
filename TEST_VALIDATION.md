# 🧪 Testing DTO Validation

This guide shows how to test the DTO validation we just added.

## 🚀 Start the Application

```bash
npm run start:dev
```

Wait for: `✅ Database connected successfully`

---

## ✅ Valid Requests (Should Work)

### 1. Create User (Valid)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John Doe"
  }'
```

**Expected:** ✅ Success - User created

---

### 2. Create User with Profile (Valid)
```bash
curl -X POST http://localhost:3000/users/with-profile \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "name": "Jane Smith",
    "profile": {
      "bio": "Software Engineer with 10 years of experience",
      "avatar": "https://example.com/avatar.jpg",
      "website": "https://janesmith.dev"
    }
  }'
```

**Expected:** ✅ Success - User with profile created

---

## ❌ Invalid Requests (Should Fail with Validation Errors)

### 1. Invalid Email Format
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "not-an-email",
    "name": "John"
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": [
    "Please provide a valid email address"
  ],
  "error": "Bad Request"
}
```

---

### 2. Missing Required Field
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe"
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": [
    "Email is required",
    "Please provide a valid email address"
  ],
  "error": "Bad Request"
}
```

---

### 3. Name Too Short
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "J"
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": [
    "Name must be at least 2 characters long"
  ],
  "error": "Bad Request"
}
```

---

### 4. Bio Too Short (Nested Validation)
```bash
curl -X POST http://localhost:3000/users/with-profile \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "name": "Jane",
    "profile": {
      "bio": "Short"
    }
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": [
    "profile.bio must be longer than or equal to 10 characters"
  ],
  "error": "Bad Request"
}
```

---

### 5. Invalid URL
```bash
curl -X POST http://localhost:3000/users/with-profile \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "name": "Jane",
    "profile": {
      "bio": "Software Engineer with experience",
      "website": "not-a-url"
    }
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": [
    "Website must be a valid URL"
  ],
  "error": "Bad Request"
}
```

---

### 6. Extra Fields (Automatically Stripped)
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "name": "John",
    "hackerField": "malicious data",
    "isAdmin": true
  }'
```

**Expected:** ✅ Success - User created
**Note:** `hackerField` and `isAdmin` are **automatically stripped** because `whitelist: true` in ValidationPipe

---

### 7. Update with Invalid Data
```bash
# First, create a user and note the ID

# Then try to update with invalid email
curl -X PATCH http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{
    "email": "invalid-email"
  }'
```

**Expected Error:**
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email"
  ],
  "error": "Bad Request"
}
```

---

## 🎯 What's Happening?

### Before DTOs
```
Client → Controller → Database
         ❌ No validation!
         ❌ Any data can pass through
```

### After DTOs
```
Client → ValidationPipe → DTO → Controller → Database
         ✅ Validates format
         ✅ Checks required fields
         ✅ Strips extra fields
         ✅ Type-safe
```

---

## 📚 Validation Rules in Action

| Field | Rules | Example Error |
|-------|-------|---------------|
| `email` | Must be valid email format | "Please provide a valid email address" |
| `name` | Min 2 characters (optional) | "Name must be at least 2 characters long" |
| `profile.bio` | Min 10 characters (optional) | "bio must be longer than or equal to 10 characters" |
| `profile.avatar` | Valid URL (optional) | "Avatar must be a valid URL" |
| `profile.website` | Valid URL (optional) | "Website must be a valid URL" |

---

## 🔍 Where to See the DTOs

1. **DTO Definitions:**
   - `src/users/dto/create-user.dto.ts`
   - `src/users/dto/create-user-with-profile.dto.ts`
   - `src/users/dto/update-user.dto.ts`
   - `src/users/dto/update-profile.dto.ts`

2. **Controller Usage:**
   - `src/users/users.controller.ts` (see `@Body()` decorators)

3. **Validation Config:**
   - `src/main.ts` (see `app.useGlobalPipes()`)

---

## 💡 Try These Experiments

### Experiment 1: Remove a Validation Rule
1. Open `src/users/dto/create-user.dto.ts`
2. Comment out `@IsEmail()`
3. Restart the app
4. Try sending invalid email - it will now be accepted!
5. Uncomment to restore validation

### Experiment 2: Add New Validation
1. Open `src/users/dto/create-user.dto.ts`
2. Add `@MinLength(3)` to email field
3. Restart the app
4. Try `"email": "a@b.c"` - should fail!

### Experiment 3: Test Optional Fields
1. Try creating user WITHOUT name - should work
2. Try creating user with `"name": "J"` - should fail (too short)
3. Try creating user with `"name": "Jo"` - should work

---

## 🚨 Common Mistakes

### Mistake 1: Forgetting to restart after DTO changes
```bash
# DTOs are compiled, so you need to restart
# With --watch, it should auto-restart
npm run start:dev
```

### Mistake 2: Using wrong HTTP method
```bash
# ❌ Wrong
curl -X GET http://localhost:3000/users -d '{...}'

# ✅ Correct
curl -X POST http://localhost:3000/users -d '{...}'
```

### Mistake 3: Forgetting Content-Type header
```bash
# ❌ Wrong (will be interpreted as form data)
curl -X POST http://localhost:3000/users -d '{...}'

# ✅ Correct
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## ✅ Verification Checklist

- [ ] App starts without errors
- [ ] Valid request creates user successfully
- [ ] Invalid email is rejected
- [ ] Short name is rejected
- [ ] Extra fields are stripped
- [ ] Nested validation works (profile.bio)
- [ ] Invalid URLs are rejected
- [ ] Update endpoints validate correctly

---

## 🎓 Next Steps

1. **Add DTOs to Other Modules:**
   - Create DTOs for posts, categories, comments
   - Follow the same pattern as users

2. **Add More Validation:**
   - Add `@Matches()` for patterns
   - Add custom validators
   - Add conditional validation

3. **Add Swagger Documentation:**
   ```bash
   npm install @nestjs/swagger swagger-ui-express
   ```
   Then add `@ApiProperty()` to DTOs for auto-generated API docs

4. **Add Response Transformation:**
   - Use `UserResponseDto` with `ClassSerializerInterceptor`
   - Hide sensitive fields automatically

---

**Remember:** DTOs are your API's contract with the outside world. Good validation = happy developers and secure applications! 🛡️

