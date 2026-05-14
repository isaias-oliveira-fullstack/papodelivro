// @ts-nocheck
const request = require('supertest');
const app = require('../app');
const db = require('../dist/models');

const testEmail = `teste${Date.now()}@example.com`;
const testPassword = 'senha123';

describe('Auth routes', () => {
  beforeAll(async () => {
    if (db?.ready) {
      await db.ready;
    }
  });

  afterAll(async () => {
    if (db?.sequelize?.close) {
      await db.sequelize.close();
    }
  });

  it('Deve registrar um novo usuário', async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'usuarioTeste',
      email: testEmail,
      password: testPassword,
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
  });

  it('Deve realizar login com sucesso', async () => {
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body).toHaveProperty('token');
  });
});
