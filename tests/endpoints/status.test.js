const request = require('supertest');
const app = require('../app'); // Assuming your Express app is exported from app.js

describe('GET /status', () => {
  it('should return status 200', async () => {
    const response = await request(app).get('/status');
    expect(response.status).toBe(200);
  });

  it('should return the expected response', async () => {
    const response = await request(app).get('/status');
    expect(response.body).toEqual({ status: 'OK' });
  });

  it('returns the status of redis and mongo connection', async () => {
    const response = await request(app).get('/status').send();
    const body = JSON.parse(response.text);

    expect(body).to.eql({ redis: true, db: true });
    expect(response.statusCode).to.equal(200);
  });
});
