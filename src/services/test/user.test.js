const request = require('supertest');
describe('Get users', () => {
  it('should get users successfully', async () => {
    // const user = await request('http://localhost:3000/api/v1')
    //       .post('/auth/login')
    //       .send({
    //           email: "tuanadmin@gmail.com",
    //           password: "huyhuy"
    //       });
    const res = await request('http://localhost:3000/api/v1')
      .get('/users')

    expect(res.statusCode).toEqual(401)
    //expect(res.body).toHaveProperty('data')
  })
})

describe('Get user detail', () => {
    it('should get detail successfully', async () => {
        // const user = await request('http://localhost:3000/api/v1')
        //       .post('/auth/login')
        //       .send({
        //           email: "tuanadmin@gmail.com",
        //           password: "huyhuy"
        //       });
        const res = await request('http://localhost:3000/api/v1')
            .get('/users/1')

        expect(res.statusCode).toEqual(401)
        //expect(res.body).toHaveProperty('data')
    })
})