const request = require("supertest");
describe('Get categories', () => {
    it('should get categories successfully', async () => {
        // const user = await request('http://localhost:3000/api/v1')
        //       .post('/auth/login')
        //       .send({
        //           email: "tuanadmin@gmail.com",
        //           password: "huyhuy"
        //       });
        const res = await request('http://localhost:3000/api/v1')
            .get('/categories')

        expect(res.statusCode).toEqual(200)
        //expect(res.body).toHaveProperty('data')
    })
})