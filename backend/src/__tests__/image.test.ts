import request from 'supertest';
import express from 'express';
import path from 'path';
import fs from 'fs';
import imageRoutes from '../routes/imageRoutes';
import userRoutes from '../routes/userRoutes';
import ImageModel from '../model/Image';

const app = express();
app.use(express.json());
app.use('/user', userRoutes);
app.use('/image', imageRoutes);

describe('Image Endpoints', () => {
  let authToken: string;
  let userId: number;

  beforeEach(async () => {
    // Register and login a user to get auth token
    await request(app)
      .post('/user/register')
      .send({
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser'
      });

    const loginResponse = await request(app)
      .post('/user/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });

    authToken = loginResponse.body.token;
    // Get user from database since login doesn't return user object
    const UserModel = (await import('../model/User')).default;
    const user = await UserModel.findOne({ email: 'test@example.com' });
    userId = user!.id;

    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
  });

  afterEach(() => {
    // Clean up test uploads
    const uploadDir = path.join(process.cwd(), 'uploads');
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      files.forEach(file => {
        fs.unlinkSync(path.join(uploadDir, file));
      });
    }
  });

  describe('POST /image/create', () => {
    it('should create a new image entry successfully', async () => {
      const response = await request(app)
        .post('/image/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          title: 'My Test Image'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.content).toHaveProperty('id');

      // Verify image was created in database
      const image = await ImageModel.findOne({ id: response.body.content.id });
      expect(image).toBeTruthy();
      expect(image?.title).toBe('My Test Image');
      expect(image?.user_id).toBe(userId);
    });

    it('should auto-increment image IDs', async () => {
      const response1 = await request(app)
        .post('/image/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Image 1' });

      const response2 = await request(app)
        .post('/image/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Image 2' });

      expect(response1.body.content.id).toBe(1);
      expect(response2.body.content.id).toBe(2);
    });

    it('should fail when title is missing', async () => {
      const response = await request(app)
        .post('/image/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('required');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/image/create')
        .send({ title: 'My Image' });

      expect(response.status).toBe(401);
    });
  });

  describe('POST /image/:id/upload', () => {
    let imageId: number;
    const testImagePath = path.join(__dirname, 'test-image.png');

    beforeEach(async () => {
      // Create a test image entry
      const createResponse = await request(app)
        .post('/image/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Image' });

      imageId = createResponse.body.content.id;

      // Create a simple test image file
      const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');
      fs.writeFileSync(testImagePath, buffer);
    });

    afterEach(() => {
      // Clean up test image
      if (fs.existsSync(testImagePath)) {
        fs.unlinkSync(testImagePath);
      }
    });

    it('should upload an image file successfully', async () => {
      const response = await request(app)
        .post(`/image/${imageId}/upload`)
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testImagePath);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.content).toHaveProperty('id', imageId);
      expect(response.body.content).toHaveProperty('filename');
      expect(response.body.content).toHaveProperty('mime_type');

      // Verify file was saved
      const image = await ImageModel.findOne({ id: imageId });
      expect(image).toBeTruthy();
      const uploadedFilePath = path.join(process.cwd(), 'uploads', image!.filename);
      expect(fs.existsSync(uploadedFilePath)).toBe(true);
    });

    it('should fail when no file is uploaded', async () => {
      const response = await request(app)
        .post(`/image/${imageId}/upload`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('No file');
    });

    it('should fail when image does not exist', async () => {
      const response = await request(app)
        .post('/image/99999/upload')
        .set('Authorization', `Bearer ${authToken}`)
        .attach('file', testImagePath);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('not found');
    });

    it('should fail when user does not own the image', async () => {
      // Create another user
      await request(app)
        .post('/user/register')
        .send({
          email: 'other@example.com',
          password: 'password123',
          username: 'otheruser'
        });

      const otherLoginResponse = await request(app)
        .post('/user/login')
        .send({
          email: 'other@example.com',
          password: 'password123'
        });

      const otherToken = otherLoginResponse.body.token;

      const response = await request(app)
        .post(`/image/${imageId}/upload`)
        .set('Authorization', `Bearer ${otherToken}`)
        .attach('file', testImagePath);

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('Forbidden');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post(`/image/${imageId}/upload`)
        .attach('file', testImagePath);

      expect(response.status).toBe(401);
    });
  });

  describe('GET /image/me', () => {
    beforeEach(async () => {
      // Create some images
      await request(app)
        .post('/image/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Image 1' });

      await request(app)
        .post('/image/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Image 2' });
    });

    it('should get all images', async () => {
      const response = await request(app)
        .get('/image/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('url');
      expect(response.body[0]).toHaveProperty('title');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/image/me');

      expect(response.status).toBe(401);
    });

    it('should return empty array when no images exist', async () => {
      await ImageModel.deleteMany({});

      const response = await request(app)
        .get('/image/me')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /image/:id', () => {
    let imageId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/image/create')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ title: 'Test Image' });

      imageId = createResponse.body.content.id;
    });

    it('should get an image by id', async () => {
      const response = await request(app)
        .get(`/image/${imageId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.content).toHaveProperty('id', imageId);
      expect(response.body.content).toHaveProperty('title', 'Test Image');
      expect(response.body.content).toHaveProperty('url');
    });

    it('should return 404 for non-existent image', async () => {
      const response = await request(app)
        .get('/image/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.result).toContain('not found');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/image/${imageId}`);

      expect(response.status).toBe(401);
    });
  });
});
