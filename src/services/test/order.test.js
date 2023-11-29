const request = require("supertest");
describe('Get orders', () => {
    it('should get orders successfully', async () => {
        // const user = await request('http://localhost:3000/api/v1')
        //       .post('/auth/login')
        //       .send({
        //           email: "tuanadmin@gmail.com",
        //           password: "huyhuy"
        //       });
        const res = await request('http://localhost:3000/api/v1')
            .get('/orders')

        expect(res.statusCode).toEqual(401)
        //expect(res.body).toHaveProperty('data')
    })
})