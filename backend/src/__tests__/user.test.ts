import request from 'supertest';
import express from 'express';
import userRoutes from '../routes/userRoutes';
import UserModel from '../model/User';

const app = express();
app.use(express.json());
app.use('/user', userRoutes);

describe('User Endpoints', () => {
  describe('POST /user/register', () => {
    it('should register a new user successfully', async () => {
      const response = await request(app)
        .post('/user/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser'
        });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        success: true,
        result: 'User registered successfully'
      });

      // Verify user was created in database
      const user = await UserModel.findOne({ email: 'test@example.com' });
      expect(user).toBeTruthy();
      expect(user?.username).toBe('testuser');
      expect(user?.isActive).toBe(true);
    });

    it('should fail when email is missing', async () => {
      const response = await request(app)
        .post('/user/register')
        .send({
          password: 'password123',
          username: 'testuser'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('required');
    });

    it('should fail when password is missing', async () => {
      const response = await request(app)
        .post('/user/register')
        .send({
          email: 'test@example.com',
          username: 'testuser'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail when username is missing', async () => {
      const response = await request(app)
        .post('/user/register')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail when user with same email already exists', async () => {
      // Create first user
      await request(app)
        .post('/user/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser1'
        });

      // Try to create second user with same email
      const response = await request(app)
        .post('/user/register')
        .send({
          email: 'test@example.com',
          password: 'password456',
          username: 'testuser2'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('already exists');
    });

    it('should auto-increment user IDs', async () => {
      await request(app)
        .post('/user/register')
        .send({
          email: 'user1@example.com',
          password: 'password123',
          username: 'user1'
        });

      await request(app)
        .post('/user/register')
        .send({
          email: 'user2@example.com',
          password: 'password123',
          username: 'user2'
        });

      const users = await UserModel.find().sort({ id: 1 });
      expect(users[0].id).toBe(1);
      expect(users[1].id).toBe(2);
    });
  });

  describe('POST /user/login', () => {
    beforeEach(async () => {
      // Create a test user before each login test
      await request(app)
        .post('/user/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          username: 'testuser'
        });
    });

    it('should login successfully with correct credentials', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body).toHaveProperty('token');
      expect(typeof response.body.token).toBe('string');
    });

    it('should fail when email is missing', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          password: 'password123'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('required');
    });

    it('should fail when password is missing', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });

    it('should fail with incorrect email', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('Invalid');
    });

    it('should fail with incorrect password', async () => {
      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('Invalid');
    });

    it('should fail when user account is inactive', async () => {
      // Deactivate the user
      await UserModel.findOneAndUpdate(
        { email: 'test@example.com' },
        { isActive: false }
      );

      const response = await request(app)
        .post('/user/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('inactive');
    });
  });
});
