const request = require('supertest')
describe('Login', () => {
  it('should login successfully', async () => {
    const res = await request('http://localhost:3000/api/v1')
      .post('/auth/login')
      .send({
        email: "tuannd@gmail.com",
        password: "123456"
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('data')
  })
})

describe('Register', () => {
  it('should register successfully', async () => {
    const res = await request('http://localhost:3000/api/v1')
      .post('/auth/register')
      .send({
        email: "abc@gmail.com",
        password: "123456",
        studentId: "2023",
        name: "abc"
      })
    expect(res.statusCode).toEqual(201)
    expect(res.body).toHaveProperty('data')
  })
})

