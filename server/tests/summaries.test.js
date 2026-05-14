// @ts-nocheck
const request = require('supertest');
const app = require('../app');
const db = require('../dist/models');

const testEmail = `teste${Date.now()}@example.com`;
const testPassword = 'senha123';

describe('Summary routes', () => {
  let token;

  beforeAll(async () => {
    if (db?.ready) {
      await db.ready;
    }

    await request(app).post('/api/auth/register').send({
      name: 'usuarioResumo',
      email: testEmail,
      password: testPassword,
    });

    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });
    token = res.body.token;
  });

  beforeAll(async () => {
    await request(app).post('/api/auth/register').send({
      name: 'usuarioResumo',
      email: testEmail,
      password: testPassword,
    });

    const res = await request(app).post('/api/auth/login').send({
      email: testEmail,
      password: testPassword,
    });
    token = res.body.token;
  });

  afterAll(async () => {
    if (db?.sequelize?.close) {
      await db.sequelize.close();
    }
  });

  it('Deve criar um novo resumo', async () => {
    const res = await request(app)
      .post('/api/summaries')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Resumo de teste',
        author: 'Autor de Teste',
        category: 'Teste',
        content: 'Este é um resumo de teste para o livro 1',
        coverUrlMock: 'https://via.placeholder.com/150',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
