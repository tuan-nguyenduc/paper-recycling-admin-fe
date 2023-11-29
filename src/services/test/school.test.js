const request = require("supertest");
describe('Get schools', () => {
    it('should get schools successfully', async () => {
        // const user = await request('http://localhost:3000/api/v1')
        //       .post('/auth/login')
        //       .send({
        //           email: "tuanadmin@gmail.com",
        //           password: "huyhuy"
        //       });
        const res = await request('http://localhost:3000/api/v1')
            .get('/schools')

        expect(res.statusCode).toEqual(401)
        //expect(res.body).toHaveProperty('data')
    })
})

describe('Get school detail', () => {
    it('should get detail successfully', async () => {
        // const user = await request('http://localhost:3000/api/v1')
        //       .post('/auth/login')
        //       .send({
        //           email: "tuanadmin@gmail.com",
        //           password: "huyhuy"
        //       });
        const res = await request('http://localhost:3000/api/v1')
            .get('/schools/1')

        expect(res.statusCode).toEqual(401)
        //expect(res.body).toHaveProperty('data')
    })
})