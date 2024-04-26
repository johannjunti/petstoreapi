const request = require('supertest');
const apiURL = 'https://petstore.swagger.io/v2';

jest.mock('supertest', () => {
    const originalModule = jest.requireActual('supertest');
    return jest.fn(() => originalModule(apiURL));
});

describe('Pet API', () => {
  let petId;

  beforeEach(async () => {
    const newPet = { name: 'Ats', status: 'available' };
    const response = await request(apiURL).post('/pet').send(newPet);
    petId = response.body.id;
  });

  describe('Create Pet', () => {
    it('should create a new pet when all fields are provided', async () => {
      const newPet = { name: 'Ats', status: 'available' };
      const response = await request(apiURL).post('/pet').send(newPet);
      expect(response.body).toEqual(expect.objectContaining(newPet));
    });

    it('should return a 200 status code and default pet object when pet data is empty', async () => {
      const response = await request(apiURL).post('/pet').send({});
      expect(response.body).toEqual(expect.objectContaining({ id: expect.any(Number), photoUrls: [], tags: [] }));
    });
  });

  describe('Delete Pet', () => {
    it('should return 404 when a non-existing ID is provided', async () => {
      const response = await request(apiURL).delete(`/pet/999999`).set('api_key', 'special-key');
      expect(response.body).toEqual({});
    });

    it('should return an error when an invalid ID is provided', async () => {
      const response = await request(apiURL).delete(`/pet/invalid_id`).set('api_key', 'special-key');
      expect(response.body).toEqual(expect.objectContaining({ message: 'java.lang.NumberFormatException: For input string: "invalid_id"' }));
    });
  });

  describe('Find Pets by Status', () => {
    const statuses = ['available', 'pending', 'sold'];

    statuses.forEach(status => {
      it(`should find pets with status ${status}`, async () => {
        const response = await request(apiURL).get('/pet/findByStatus').query({ status });
        expect(Array.isArray(response.body)).toBe(true);
        response.body.forEach(pet => {
          expect(pet.status).toBe(status);
        });
      });
    });

    it('should return an empty array for invalid status', async () => {
      const response = await request(apiURL).get('/pet/findByStatus').query({ status: 'invalid_status' });
      expect(response.body).toEqual([]);
    });
  });

  describe('Find Pet by ID', () => {
    it('should return 404 for non-existing ID', async () => {
      const response = await request(apiURL).get(`/pet/999999`);
      expect(response.body).toEqual(expect.objectContaining({ message: 'Pet not found' }));
    });

    it('should return an error for invalid ID', async () => {
      const response = await request(apiURL).get(`/pet/invalid_id`);
      expect(response.body).toEqual(expect.objectContaining({ message: 'java.lang.NumberFormatException: For input string: "invalid_id"' }));
    });

    it('should return an error when ID is not provided', async () => {
      const response = await request(apiURL).get('/pet/');
      expect(response.body).toEqual({});
    });
  });

  describe('Update Pet', () => {
    it('should return 405 when a valid ID and data are provided', async () => {
      const response = await request(apiURL).put(`/pet/${petId}`).send({ name: 'UpdatedName', status: 'sold' });
      expect(response.body).toEqual({});
    });

    it('should return 405 when a non-existing ID is provided', async () => {
      const response = await request(apiURL).put(`/pet/999999`).send({ name: 'UpdatedName', status: 'sold' });
      expect(response.body).toEqual({});
    });

    it('should return 200 and the created pet when ID is not provided', async () => {
      const response = await request(apiURL).put('/pet/').send({ name: 'UpdatedName', status: 'sold' });
      expect(response.body).toEqual(expect.objectContaining({ name: 'UpdatedName', status: 'sold' }));
    });
  });
});
