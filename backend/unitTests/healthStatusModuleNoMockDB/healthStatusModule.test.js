const networkManager = require('../../utils/networkManager.js');
const userModel = require('../../userSchema.js');
const supertest = require('supertest')
const mongoose = require('mongoose');
const mockValues = require('./healthStatusModuleMockValues.js');
const app = require('../../app.js').app;
const request = supertest(app);

mongoose.connect('mongodb://localhost/mybubbletest-2');

jest.mock('./../../utils/networkManager.js');

networkManager.findAllConnections = jest.fn().mockResolvedValue(mockValues.connectionsBasic);
networkManager.updateHealthStatuses = jest.fn().mockResolvedValue(3);
networkManager.findLowestConnectedHealthStatus = jest.fn().mockResolvedValue(2);


/* findByQuery - no users */
describe('updateHealthStatus', () => {
  it('failure because of no ID', async (done) => {
    const res = await request
      .post('/healthStatus/updateHealthStatus')
      .set('Content-Type', 'application/json')
      .send({
        'healthStatus': true,
      })
    
    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Failed: Missing Fields or invalid')
    done()
  })
})

describe('updateHealthStatus', () => {
  it('failure because of no healthStatus', async (done) => {
    const res = await request
      .post('/healthStatus/updateHealthStatus')
      .set('Content-Type', 'application/json')
      .send({
        'id': 'id1',
      });
    
    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Failed: Missing Fields or invalid')
    done()
  })
})

describe('updateHealthStatus', () => {
  it('failure because of bad healthStatus type', async (done) => {
    const res = await request
      .post('/healthStatus/updateHealthStatus')
      .set('Content-Type', 'application/json')
      .send({
        'id': 'id1',
        'healthStatus' : 'invalid'
      });
    
    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Failed: Missing Fields or invalid')
    done()
  })
})

describe('updateHealthStatus', () => {
  it('No such user', async (done) => {

  await userModel.deleteOne({_id:"5f9a0e152ed12012457c43f9"})
    const res = await request
      .post('/healthStatus/updateHealthStatus')
      .set('Content-Type', 'application/json')
      .send({
        'id': "5f9a0e152ed12012457c43f9",
        'healthStatus' : true
      });
    
    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Error: User not found')
    done()
  })
})

describe('updateHealthStatus', () => {
  it('Normal update, healthy to covid', async (done) => {
    await userModel.deleteOne({firstName:"ExamplePerson"})
    let exampleUser = await new userModel({firstName: "ExamplePerson", lastName: "Example", email: "examplePerson@gmail.com"});
    await userModel.create(exampleUser); 

    const res = await request
      .post('/healthStatus/updateHealthStatus')
      .set('Content-Type', 'application/json')
      .send({
        'id': exampleUser._id.toString(),
        'healthStatus' : true
      });
    
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('healthStatus');
    expect(res.body).toHaveProperty('_id');
    expect(res.body._id.toString()).toEqual(exampleUser._id.toString())
    expect(res.body.healthStatus).toEqual(0);
    done()
  })
})

describe('updateHealthStatus', () => {
  it('update to healthy, already at risk', async (done) => {
    await userModel.deleteOne({firstName:"ExamplePerson"})
    let exampleUser = await new userModel({firstName: "ExamplePerson", lastName: "Example", email: "examplePerson@gmail.com", healthStatus: 2});
    await userModel.create(exampleUser); 

    const res = await request
      .post('/healthStatus/updateHealthStatus')
      .set('Content-Type', 'application/json')
      .send({
        'id': exampleUser._id.toString(),
        'healthStatus' : false
      });
    
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('healthStatus');
    expect(res.body).toHaveProperty('_id');
    expect(res.body._id.toString()).toEqual(exampleUser._id.toString())
    expect(res.body.healthStatus).toEqual(2);
    done()
  })
})

describe('updateHealthStatus', () => {
  it('update to healthy, from sick', async (done) => {
    await userModel.deleteOne({firstName:"ExamplePerson"})
    let exampleUser = await new userModel(
      {firstName: "ExamplePerson", 
      lastName: "Example", 
      email: "examplePerson@gmail.com", 
      healthStatus: 0});
    await userModel.create(exampleUser); 

    const res = await request
      .post('/healthStatus/updateHealthStatus')
      .set('Content-Type', 'application/json')
      .send({
        'id': exampleUser._id.toString(),
        'healthStatus' : false
      });
    
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('healthStatus');
    expect(res.body).toHaveProperty('_id');
    expect(res.body._id.toString()).toEqual(exampleUser._id.toString())
    expect(res.body.healthStatus).toEqual(3);
    done()
  })
})

describe('pollHealthStatus', () => {
  it('Missing id', async (done) => {
    
    const res = await request
      .get('/healthStatus/pollHealthStatus')
      .send({});
    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Failed: Missing Fields or invalid');
    done()
  })
})

describe('pollHealthStatus', () => {
  it('No Match for id', async (done) => {
    await userModel.deleteOne({_id: "5fb085aecec4df4f33a5d165"})
    const res = await request
      .get('/healthStatus/pollHealthStatus?id=5fb085aecec4df4f33a5d165')
      .send({});
    
    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Error: User not found');
    done()
  })
})

describe('pollHealthStatus', () => {
  it('Standard poll, no change in healthStatus', async (done) => {
    await userModel.deleteOne({firstName:"ExamplePerson"})
    let exampleUser = await new userModel(
      {firstName: "ExamplePerson", 
      lastName: "Example", 
      email: "examplePerson@gmail.com", 
    });
    await userModel.create(exampleUser); 
    const res = await request
      .get('/healthStatus/pollHealthStatus?id=' + exampleUser._id.toString())
      .send({});
    
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('changed')
    expect(res.body).toHaveProperty('healthStatus')
    expect(res.body.changed).toEqual(false)
    expect(res.body.healthStatus).toEqual(4)
    done()
  })
})

describe('pollHealthStatus', () => {
  it('Standard poll, w/ change in healthStatus', async (done) => {
    await userModel.deleteOne({firstName:"ExamplePerson"})
    let exampleUser = await new userModel(
      {firstName: "ExamplePerson", 
      lastName: "Example", 
      email: "examplePerson@gmail.com",
      healthStatus: 0 
    });
    await userModel.create(exampleUser); 
    const res = await request
      .get('/healthStatus/pollHealthStatus?id=' + exampleUser._id.toString())
      .send({});
    
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('changed')
    expect(res.body).toHaveProperty('healthStatus')
    expect(res.body.changed).toEqual(true)
    expect(res.body.healthStatus).toEqual(0)
    done()
  })
})

afterAll(() => setTimeout(() => process.exit(), 500));

