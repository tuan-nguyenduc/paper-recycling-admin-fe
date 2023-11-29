const request = require("supertest");
describe('Get classes', () => {
    it('should get classes successfully', async () => {
        // const user = await request('http://localhost:3000/api/v1')
        //       .post('/auth/login')
        //       .send({
        //           email: "tuanadmin@gmail.com",
        //           password: "huyhuy"
        //       });
        const res = await request('http://localhost:3000/api/v1')
            .get('/classes')

        expect(res.statusCode).toEqual(401)
        //expect(res.body).toHaveProperty('data')
    })
})

describe('Get class detail', () => {
    it('should get class successfully', async () => {
        // const user = await request('http://localhost:3000/api/v1')
        //       .post('/auth/login')
        //       .send({
        //           email: "tuanadmin@gmail.com",
        //           password: "huyhuy"
        //       });
        const res = await request('http://localhost:3000/api/v1')
            .get('/classes/1')

        expect(res.statusCode).toEqual(401)
        //expect(res.body).toHaveProperty('data')
    })
})