const networkManager = require('../../utils/networkManager.js');
const userModel = require('../../userSchema.js');
const supertest = require('supertest')
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
let mongoClient = require('mongodb').MongoClient;
const app = require('../../app.js').app;
const mockValues = require('./userModuleMockValues.js')
const request = supertest(app);

jest.mock('./../../utils/networkManager.js');
jest.mock('./../../userSchema.js');

userModel.find = jest.fn().mockResolvedValue([mockValues.userBasic]);
userModel.save = function(){return {}};
//userModel.save = jest.fn().mockResolvedValue({});

networkManager.findAllConnections = jest.fn().mockResolvedValue(mockValues.connectionsBasic);
networkManager.updateHealthStatuses = jest.fn().mockResolvedValue(3);

/* getAllConnections - Basic Test */
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
      expect(res.body.firstConnections[i] == mockValues.connectionsBasic.firstConnections[i])
    }
    for(let i = 0; i < res.body.secondConnections.length; i++){
      expect(res.body.secondConnections[i] == mockValues.connectionsBasic.secondConnections[i])
    }
    for(let i = 0; i < res.body.thirdConnections.length; i++){
      expect(res.body.thirdConnections[i] == mockValues.connectionsBasic.thirdConnections[i])
    }
    done()
  })
})

/* getAllConnections - No ID */
describe('getAllConnections', () => {
  it('Should fail due to lack of _id', async (done) => {
    const res = await request
      .get('/user/getAllConnections')
      .send()

    expect(res.statusCode).toEqual(412)
    expect(res.clientError).toEqual(true)
    expect(res.serverError).toEqual(false)
    expect(res.text).toEqual('Failed: Missing User IDs or invalid')
    done()
  })
})

/* getAllConnections - no user */
describe('getAllConnections', () => {
  it('Should find no user and return error', async (done) => {
    userModel.find = await jest.fn().mockResolvedValue({});
    const res = await request
      .get('/user/getAllConnections?_id=5f9a0e132ed12012457c43f5')
      .send()

    expect(res.statusCode).toEqual(412)
    expect(res.clientError).toEqual(true)
    expect(res.serverError).toEqual(false)
    expect(res.text).toEqual('Error: User not found')
    done()
  })
})

/* findByQuery - multiple users */
describe('findByQuery', () => {
  it('Return Multiple Users', async (done) => {
    userModel.find = await jest.fn().mockResolvedValue([mockValues.userBasic, mockValues.userSameFirstName]);
    const res = await request
      .get('/user/findByQuery?firstName=Kaguya')
      .send()
    expect(res.statusCode).toEqual(200)

    expect(res.body[0]).toHaveProperty('_id');
    expect(res.body[1]).toHaveProperty('_id');
    expect(res.body[0]._id.toString()).toEqual(mockValues.userBasic._id.toString());
    expect(res.body[1]._id.toString()).toEqual(mockValues.userSameFirstName._id.toString());
    done()
  })
})

/* findByQuery - no users */
describe('findByQuery', () => {
  it('Return no users', async (done) => {
    userModel.find = await jest.fn().mockResolvedValue([]);
    const res = await request
      .get('/user/findByQuery?firstName=Bruh')
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(0);
    done()
  })
})

/* addFirstConnection - Missing ID Field*/
describe('addFirstConnection', () => {
  it('Missing ID Field', async (done) => {
    const res = await request
      .post('/user/addFirstConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : 'placeholder',
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Failed: Missing User IDs or invalid')
    done()
  })
})

/* addFirstConnection - Missing ID Field*/
describe('addFirstConnection', () => {
  it('IDs have the same value', async (done) => {
    const res = await request
      .post('/user/addFirstConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : 'placeholder',
        'secondID' : 'placeholder'
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Failed: Missing User IDs or invalid')
    done()
  })
})

/* addFirstConnection - User Not Found */
describe('addFirstConnection', () => {
  it('User not found', async (done) => {
    userModel.find = await jest.fn().mockResolvedValue([]);
    const res = await request
      .post('/user/addFirstConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : 'id1',
        'secondID' : 'id2'
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Error: User not found')
    done()
  })
})

/* addFirstConnection - Users are already Conneted */
describe('addFirstConnection', () => {
  it('Users are already connected', async (done) => {
    userModel.find = await jest.fn()
    .mockResolvedValue([mockValues.connectedUserA])
    .mockResolvedValueOnce([mockValues.connectedUserB]);

    const res = await request
      .post('/user/addFirstConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : 'id1',
        'secondID' : 'id2'
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Error: Users already connected')
    done()
  })
})



afterAll(() => setTimeout(() => process.exit(), 500));
