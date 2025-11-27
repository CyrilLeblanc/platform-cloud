import request from 'supertest';
import express from 'express';
import collectionRoutes from '../routes/collectionRoutes';
import userRoutes from '../routes/userRoutes';
import CollectionModel from '../model/Collection';

const app = express();
app.use(express.json());
app.use('/user', userRoutes);
app.use('/collection', collectionRoutes);

describe('Collection Endpoints', () => {
  let authToken: string;

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
  });

  describe('POST /collection', () => {
    it('should create a new collection successfully', async () => {
      const response = await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'My Collection',
          description: 'Test description'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe('My Collection');
      expect(response.body.description).toBe('Test description');
    });

    it('should auto-increment collection IDs', async () => {
      const response1 = await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Collection 1'
        });

      const response2 = await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Collection 2'
        });

      expect(response1.body.id).toBe(1);
      expect(response2.body.id).toBe(2);
    });

    it('should fail when name is missing', async () => {
      const response = await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          description: 'Test description'
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('required');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/collection')
        .send({
          name: 'My Collection'
        });

      expect(response.status).toBe(401);
    });

    it('should create collection without description', async () => {
      const response = await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: 'Collection without description'
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Collection without description');
    });
  });

  describe('GET /collection', () => {
    beforeEach(async () => {
      // Create some collections
      await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Collection 1', description: 'First' });

      await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Collection 2', description: 'Second' });
    });

    it('should get all collections', async () => {
      const response = await request(app)
        .get('/collection')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('Collection 2'); // Most recent first
      expect(response.body[1].name).toBe('Collection 1');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get('/collection');

      expect(response.status).toBe(401);
    });

    it('should return empty array when no collections exist', async () => {
      // Clear all collections
      await CollectionModel.deleteMany({});

      const response = await request(app)
        .get('/collection')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(0);
    });
  });

  describe('GET /collection/:id', () => {
    let collectionId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Test Collection', description: 'Test desc' });

      collectionId = createResponse.body.id;
    });

    it('should get a collection by id', async () => {
      const response = await request(app)
        .get(`/collection/${collectionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(collectionId);
      expect(response.body.name).toBe('Test Collection');
      expect(response.body.description).toBe('Test desc');
    });

    it('should fail with invalid collection id', async () => {
      const response = await request(app)
        .get('/collection/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid');
    });

    it('should return 404 for non-existent collection', async () => {
      const response = await request(app)
        .get('/collection/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .get(`/collection/${collectionId}`);

      expect(response.status).toBe(401);
    });
  });

  describe('PUT /collection/:id', () => {
    let collectionId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Original Name', description: 'Original description' });

      collectionId = createResponse.body.id;
    });

    it('should update collection name', async () => {
      const response = await request(app)
        .put(`/collection/${collectionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated Name');
      expect(response.body.description).toBe('Original description');
    });

    it('should update collection description', async () => {
      const response = await request(app)
        .put(`/collection/${collectionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ description: 'Updated description' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Original Name');
      expect(response.body.description).toBe('Updated description');
    });

    it('should update both name and description', async () => {
      const response = await request(app)
        .put(`/collection/${collectionId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'New Name', description: 'New description' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('New Name');
      expect(response.body.description).toBe('New description');
    });

    it('should fail with invalid collection id', async () => {
      const response = await request(app)
        .put('/collection/invalid')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid');
    });

    it('should return 404 for non-existent collection', async () => {
      const response = await request(app)
        .put('/collection/99999')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put(`/collection/${collectionId}`)
        .send({ name: 'Updated Name' });

      expect(response.status).toBe(401);
    });
  });

  describe('DELETE /collection/:id', () => {
    let collectionId: number;

    beforeEach(async () => {
      const createResponse = await request(app)
        .post('/collection')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Collection to delete' });

      collectionId = createResponse.body.id;
    });

    it('should delete a collection', async () => {
      const response = await request(app)
        .delete(`/collection/${collectionId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      // Verify collection was deleted
      const collection = await CollectionModel.findOne({ id: collectionId });
      expect(collection).toBeNull();
    });

    it('should fail with invalid collection id', async () => {
      const response = await request(app)
        .delete('/collection/invalid')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(400);
      expect(response.body.message).toContain('Invalid');
    });

    it('should return 404 for non-existent collection', async () => {
      const response = await request(app)
        .delete('/collection/99999')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body.message).toContain('not found');
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .delete(`/collection/${collectionId}`);

      expect(response.status).toBe(401);
    });
  });
});
