# Backend Tests

This directory contains comprehensive test suites for all API endpoints.

## Test Structure

- `setup.ts` - Test environment configuration with MongoDB Memory Server
- `user.test.ts` - Tests for user authentication endpoints (register, login)
- `collection.test.ts` - Tests for collection CRUD operations
- `image.test.ts` - Tests for image creation, upload, and retrieval

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Coverage

### User Endpoints (`/user`)
- ✅ POST `/user/register` - User registration with validation
- ✅ POST `/user/login` - User authentication with token generation

### Collection Endpoints (`/collection`)
- ✅ POST `/collection` - Create new collection
- ✅ GET `/collection` - Get all collections
- ✅ GET `/collection/:id` - Get collection by ID
- ✅ PUT `/collection/:id` - Update collection
- ✅ DELETE `/collection/:id` - Delete collection

### Image Endpoints (`/image`)
- ✅ POST `/image/create` - Create image entry
- ✅ POST `/image/:id/upload` - Upload image file
- ✅ GET `/image/me` - Get user's images
- ✅ GET `/image/:id` - Get image by ID

## Test Features

- **In-Memory Database**: Uses MongoDB Memory Server for fast, isolated tests
- **Automatic Cleanup**: Database is cleared after each test
- **Authentication Testing**: Tests both authenticated and unauthenticated requests
- **Validation Testing**: Tests all input validation scenarios
- **Error Handling**: Tests error responses and edge cases
- **File Upload Testing**: Tests multipart form data for image uploads

## Total Tests: 49

All endpoints are fully tested with multiple scenarios including:
- Success cases
- Validation errors
- Authentication failures
- Not found scenarios
- Unauthorized access attempts
