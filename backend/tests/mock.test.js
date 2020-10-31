const networkManager = require('./../utils/networkManager.js');
const userModel = require('./../userSchema.js');
const supertest = require('supertest')
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
let mongoClient = require('mongodb').MongoClient;
const app = require('../app.js').app;

const request = supertest(app);

jest.mock('./../utils/networkManager.js');
jest.mock('./../userSchema.js');

userModel.find = jest.fn().mockResolvedValue([{
    "firstConnections": [],
    "temporaryConnections": [],
    "healthStatus": 4,
    "healthStatusOnLastCheck": 4,
    "creationDate": "2020-10-29T00:30:18.000Z",
    "_id": "5f9a0e132ed12012457c43f5",
    "firstName": "Kaguya",
    "lastName": "Shinomiya",
    "email": "kaguyashinomiya@gmail.com",
    "__v": 0
}]);

let mockConnections = {
  firstConnections: [
      "5f9a0df42ed12012457c43f4",
      "5f9a0e5b2ed12012457c43f6",
      "5f9a0e882ed12012457c43f8",
      "5f9a0ea92ed12012457c43f9"
  ],
  secondConnections: [
      "5f9a0dd32ed12012457c43f3",
      "5f9a0e6c2ed12012457c43f7",
      "5f9a0eba2ed12012457c43fa",
      "5f9a0ed72ed12012457c43fb"
  ],
  thirdConnections: [
      "5f9a0da52ed12012457c43f1",
      "5f9a0dc22ed12012457c43f2",
      "5f9a0efd2ed12012457c43fd",
      "5f9a0ee82ed12012457c43fc"
  ]
}

networkManager.findAllConnections = jest.fn().mockResolvedValue(mockConnections);

networkManager.updateHealthStatuses = jest.fn().mockResolvedValue(3);


describe('getAllConnections', () => {
  it('Should return all the connections it gets', async (done) => {
    const res = await request
      .get('/user/getAllConnections?_id=5f9a0e132ed12012457c43f5')
      .send()

    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('firstConnections')
    expect(res.body).toHaveProperty('secondConnections')
    expect(res.body).toHaveProperty('thirdConnections')

    for(let i = 0; i < res.body.firstConnections.length; i++){
      expect(res.body.firstConnections[i] == mockConnections.firstConnections[i])
    }
    for(let i = 0; i < res.body.secondConnections.length; i++){
      expect(res.body.secondConnections[i] == mockConnections.secondConnections[i])
    }
    for(let i = 0; i < res.body.thirdConnections.length; i++){
      expect(res.body.thirdConnections[i] == mockConnections.thirdConnections[i])
    }
    done()
  })
})

afterAll(async () => {
  await mongoose.connection.close()
  console.log("done")
});