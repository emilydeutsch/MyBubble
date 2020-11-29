const networkManager = require('../../utils/networkManager.js');
const userModel = require('../../userSchema.js');
const supertest = require('supertest')
const mongoose = require('mongoose');

const app = require('../../app.js').app;
const request = supertest(app);
const mockValues = require('./userModuleMockValues')
mongoose.connect('mongodb://localhost/mybubbletest-2');

jest.mock('./../../utils/networkManager.js');

networkManager.findAllConnections = jest.fn().mockResolvedValue(mockValues.connectionsBasic);
networkManager.updateHealthStatuses = jest.fn().mockResolvedValue(3);

/* getAllConnections - Basic Test */
describe('getAllConnections', () => {
  it('Should return all the connections it gets', async (done) => {

    await userModel.deleteOne({firstName: "Example"});

    let exampleUser = await new userModel({firstName: "Example", lastName: "Example", email: "example@gmail.com"});
    await userModel.create(exampleUser); 

    const res = await request
      .get('/user/getAllConnections?_id=' + exampleUser._id.toString())
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
    await userModel.deleteOne({_id: "5f9a0e132ed87012457c43f9"});
    const res = await request
      .get('/user/getAllConnections?_id=5f9a0e132ed87012457c43f9')
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

    await userModel.deleteMany({firstName: "Samename"});

    let userA = await new userModel({firstName: "Samename", lastName: "Example", email: "exampleSameA@gmail.com"});
    await userModel.create(userA); 

    let userB = await new userModel({firstName: "Samename", lastName: "Example", email: "exampleSameB@gmail.com"});
    await userModel.create(userB); 

    const res = await request
      .get('/user/findByQuery?firstName=Samename')
      .send()
    expect(res.statusCode).toEqual(200)

    expect(res.body[0]).toHaveProperty('_id');
    expect(res.body[1]).toHaveProperty('_id');
    expect(res.body[0]._id.toString()).toEqual(userA._id.toString());
    expect(res.body[1]._id.toString()).toEqual(userB._id.toString());
    done()
  })
})

/* findByQuery - no users */
describe('findByQuery', () => {
  it('Return no users', async (done) => {
    await userModel.deleteMany({firstName: 'Bruh'});
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
    await userModel.deleteOne({_id: "5f9a0e132ed87012457c43f9"});
    await userModel.deleteOne({_id: "5f9a0e132ed87012457c43f8"});
    const res = await request
      .post('/user/addFirstConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : '5f9a0e132ed87012457c43f9',
        'secondID' : '5f9a0e132ed87012457c43f8'
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Error: User not found')
    done()
  })
})

/* addFirstConnection - Users are already Conneted */
describe('addFirstConnection', () => {
  it('Users are already connected', async (done) => {
    await userModel.deleteOne({firstName: "Example A"});
    await userModel.deleteOne({firstName: "Example B"});

    let connectedUserA = await new userModel({firstName: "Example A", lastName: "Example", email: "exampleA@gmail.com"});
    await userModel.create(connectedUserA); 

    let connectedUserB = await new userModel({firstName: "Example B", lastName: "Example", email: "exampleB@gmail.com"});
    await userModel.create(connectedUserB); 

    connectedUserA.firstConnections.push(connectedUserB._id.toString())
    connectedUserB.firstConnections.push(connectedUserA._id.toString())

    await connectedUserA.save();
    await connectedUserB.save();

    const res = await request
      .post('/user/addFirstConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : connectedUserA._id.toString(),
        'secondID' : connectedUserB._id.toString()
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Error: Users already connected')
    done()
  })
})

/* findByQuery - Bad User Fields */
describe('newUser', () => {
  it('User missing firstName', async (done) => {
    const res = await request
      .put('/user/newUser')
      .set('Content-Type', 'application/json')
      .send({
        'lastName' : 'FakeName',
        'email' : 'faker@gamil.com'
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual("ValidationError: firstName: Path `firstName` is required.")
    done()
  })
})

/* findByQuery - Bad User Fields */
describe('newUser', () => {
  it('Creating new User successful', async (done) => {
    await userModel.deleteMany({email: 'faker@gmail.com'}); 
    const res = await request
      .put('/user/newUser')
      .set('Content-Type', 'application/json')
      .send({
        'firstName': 'FakeName',
        'lastName' : 'FakeName',
        'email' : 'faker@gmail.com'
      })
    
    expect(res.body).toHaveProperty('firstName')
    expect(res.body.firstName).toEqual('FakeName')
    done()
  })
})

/* findByQuery - Bad User Fields */
describe('newUser', () => {
  it('Email in use', async (done) => {
    await userModel.deleteMany({email: 'faker@gamil.com'});
    let existingUser = await new userModel({firstName: "Example", lastName: "Example", email: "faker@gamil.com"});
    await userModel.create(existingUser);  
    const res = await request
      .put('/user/newUser')
      .set('Content-Type', 'application/json')
      .send({
        'firstName': 'FakeName',
        'lastName' : 'FakeName',
        'email' : 'faker@gamil.com'
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toMatch(/MongoError: E11000 duplicate key error/)
    done()
  })
})

/* addFirstConnection - Basic add first connection */
describe('addFirstConnection', () => {
  it('Basic addFirstConnection', async (done) => {
    
    await userModel.deleteOne({firstName: "Example A"});
    await userModel.deleteOne({firstName: "Example B"});

    let unconnectedUserA = await new userModel({firstName: "Example A", lastName: "Example", email: "exampleA@gmail.com"});
    await userModel.create(unconnectedUserA); 

    let unconnectedUserB = await new userModel({firstName: "Example B", lastName: "Example", email: "exampleB@gmail.com"});
    await userModel.create(unconnectedUserB); 

    const res = await request
      .post('/user/addFirstConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : unconnectedUserA._id.toString(),
        'secondID' : unconnectedUserB._id.toString()
      })

    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(2)
    expect(res.body[0]).toHaveProperty('_id')
    expect(res.body[1]).toHaveProperty('_id')
    expect(res.body[0]._id.toString()).toEqual(unconnectedUserA._id.toString())
    expect(res.body[1]._id.toString()).toEqual(unconnectedUserB._id.toString())
    done()
  })
})

/* addFirstConnection - healthStatus disparity*/
describe('addFirstConnection', () => {
  it('healthStatus disparity', async (done) => {
    
    await userModel.deleteOne({firstName: "Example A"});
    await userModel.deleteOne({firstName: "Example B"});

    let connectedUserA = await new userModel({firstName: "Example A", lastName: "Example", email: "exampleA@gmail.com"});
    await userModel.create(connectedUserA); 

    let connectedUserB = await new userModel({firstName: "Example B", lastName: "Example", email: "exampleB@gmail.com", healthStatus: 0});
    await userModel.create(connectedUserB); 

    const res = await request
      .post('/user/addFirstConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : connectedUserA._id.toString(),
        'secondID' : connectedUserB._id.toString()
      })

    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(2)
    expect(res.body[0]).toHaveProperty('_id')
    expect(res.body[1]).toHaveProperty('_id')
    expect(res.body[0]._id.toString()).toEqual(connectedUserA._id.toString())
    expect(res.body[1]._id.toString()).toEqual(connectedUserB._id.toString())
    expect(res.body[0].healthStatus).toEqual(1)
    expect(res.body[0].healthStatusOnLastCheck).toEqual(1)
    expect(res.body[1].healthStatus).toEqual(0)
    done()
  })
})


describe('addTemporaryConnection', () => {
  it('missing user id', async (done) => {
   
    date = new Date();
    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : 'id1',
        'date' : date.toString()
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Failed: Missing or Invalid Fields')

    done()
  })
})

describe('addTemporaryConnection', () => {
  it('identical ids', async (done) => {
   
    date = new Date();
    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : 'id1',
        'secondID' : 'id1',
        'date' : date.toString()
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Failed: Missing or Invalid Fields')

    done()
  })
})

describe('addTemporaryConnection', () => {
  it('missing date', async (done) => {
   
    date = new Date();
    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : 'id1',
        'secondID' : 'id2',
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Failed: Missing or Invalid Fields')

    done()
  })
})

describe('addTemporaryConnection', () => {
  it('invalid date', async (done) => {
   
    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : 'id1',
        'secondID' : 'id2',
        'date' : 'bruh',
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Error: Date not valid')

    done()
  })
})

describe('addTemporaryConnection', () => {
  it('No such user', async (done) => {
   
    let date = new Date()

    await userModel.deleteOne({_id: "5f9a0e132ed87012457c43f9"});
    await userModel.deleteOne({_id: "5f9a0e132ed87012457c43f8"});
    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : '5f9a0e132ed87012457c43f9',
        'secondID' : '5f9a0e132ed87012457c43f8',
        'date' : date.toString()
      })

    expect(res.statusCode).toEqual(412)
    expect(res.text).toEqual('Error: User not found')

    done()
  })
})

describe('addTemporaryConnection', () => {
  it('already a first connection', async (done) => {
    

    let date = new Date()

    await userModel.deleteOne({firstName: "Example A"});
    await userModel.deleteOne({firstName: "Example B"});

    let connectedUserA = await new userModel({firstName: "Example A", lastName: "Example", email: "exampleA@gmail.com"});
    await userModel.create(connectedUserA); 

    let connectedUserB = await new userModel({firstName: "Example B", lastName: "Example", email: "exampleB@gmail.com"});
    await userModel.create(connectedUserB); 

    connectedUserA.firstConnections.push(connectedUserB._id.toString())
    connectedUserB.firstConnections.push(connectedUserA._id.toString())

    await connectedUserA.save();
    await connectedUserB.save();

    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : connectedUserA._id.toString(),
        'secondID' : connectedUserB._id.toString(),
        'date' : date.toString()
      })

      expect(res.statusCode).toEqual(412)
      expect(res.text).toEqual('Error: Already a first level connection')
  
      done()
  })
})

describe('addTemporaryConnection', () => {
  it('date is outside isolation period', async (done) => {
    
    let date = new Date('2020-10-1')

    await userModel.deleteOne({firstName: "Example A"});
    await userModel.deleteOne({firstName: "Example B"});

    let connectedUserA = await new userModel({firstName: "Example A", lastName: "Example", email: "exampleA@gmail.com"});
    await userModel.create(connectedUserA); 

    let connectedUserB = await new userModel({firstName: "Example B", lastName: "Example", email: "exampleB@gmail.com"});
    await userModel.create(connectedUserB); 

    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : connectedUserA._id.toString(),
        'secondID' : connectedUserB._id.toString(),
        'date' : date.toString()
      })

      expect(res.statusCode).toEqual(412)
      expect(res.text).toEqual('Error: Date not valid')
  
      done()
  })
})

describe('addTemporaryConnection', () => {
  it('already a temporary connection on this date', async (done) => {
    
    let date = new Date()

    await userModel.deleteOne({firstName: "Example A"});
    await userModel.deleteOne({firstName: "Example B"});

    let connectedUserA = await new userModel({firstName: "Example A", lastName: "Example", email: "exampleA@gmail.com"});
    await userModel.create(connectedUserA); 

    let connectedUserB = await new userModel({firstName: "Example B", lastName: "Example", email: "exampleB@gmail.com"});
    await userModel.create(connectedUserB); 

    let tempConnectionForA = {_id: connectedUserB._id.toString(), date: date.toString()}
    let tempConnectionForB = {_id: connectedUserA._id.toString(), date: date.toString()}

    connectedUserA.temporaryConnections.push(tempConnectionForA)
    connectedUserB.temporaryConnections.push(tempConnectionForB)

    connectedUserA.save()
    connectedUserB.save();

    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : connectedUserA._id.toString(),
        'secondID' : connectedUserB._id.toString(),
        'date' : date.toString()
      })

      expect(res.statusCode).toEqual(412)
      expect(res.text).toEqual('Error: Already a temporary connection on this date')
  
      done()
  })
})

describe('addTemporaryConnection', () => {
  it('standard successful addTemporaryConnection', async (done) => {
    
    let date = new Date()

    await userModel.deleteOne({firstName: "Example A"});
    await userModel.deleteOne({firstName: "Example B"});

    let connectedUserA = await new userModel({firstName: "Example A", lastName: "Example", email: "exampleA@gmail.com"});
    await userModel.create(connectedUserA); 

    let connectedUserB = await new userModel({firstName: "Example B", lastName: "Example", email: "exampleB@gmail.com"});
    await userModel.create(connectedUserB); 

    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : connectedUserA._id.toString(),
        'secondID' : connectedUserB._id.toString(),
        'date' : date.toString()
      })

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('length')
      expect(res.body.length).toEqual(2)
      expect(res.body[0]).toHaveProperty('_id')
      expect(res.body[1]).toHaveProperty('_id')
      expect(res.body[0]._id.toString()).toEqual(connectedUserA._id.toString())
      expect(res.body[1]._id.toString()).toEqual(connectedUserB._id.toString())
  
      done()
  })
})

describe('addTemporaryConnection', () => {
  it('successful addTemporaryConnection, connected user, different date', async (done) => {
    
    let date = new Date()

    await userModel.deleteOne({firstName: "Example A"});
    await userModel.deleteOne({firstName: "Example B"});

    let connectedUserA = await new userModel({firstName: "Example A", lastName: "Example", email: "exampleA@gmail.com"});
    await userModel.create(connectedUserA); 

    let connectedUserB = await new userModel({firstName: "Example B", lastName: "Example", email: "exampleB@gmail.com"});
    await userModel.create(connectedUserB); 

    let tempConnectionForA = {_id: connectedUserB._id.toString(), date: '2020-11-11'}
    let tempConnectionForB = {_id: connectedUserA._id.toString(), date: '2020-11-11'}

    connectedUserA.temporaryConnections.push(tempConnectionForA)
    connectedUserB.temporaryConnections.push(tempConnectionForB)

    connectedUserA.save()
    connectedUserB.save();

    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : connectedUserA._id.toString(),
        'secondID' : connectedUserB._id.toString(),
        'date' : date.toString()
      })

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('length')
      expect(res.body.length).toEqual(2)
      expect(res.body[0]).toHaveProperty('_id')
      expect(res.body[1]).toHaveProperty('_id')
      expect(res.body[0]._id.toString()).toEqual(connectedUserA._id.toString())
      expect(res.body[1]._id.toString()).toEqual(connectedUserB._id.toString())
  
      done()
  })
})

/* getAllConnections - No ID */
describe('getTemporaryConnections', () => {
  it('Should fail due to lack of _id', async (done) => {
    const res = await request
      .get('/user/getTemporaryConnections')
      .send()

    expect(res.statusCode).toEqual(412)
    expect(res.clientError).toEqual(true)
    expect(res.serverError).toEqual(false)
    expect(res.text).toEqual('Failed: Missing User IDs or invalid')
    done()
  })
})

describe('getTemporaryConnections', () => {
  it('No such user', async (done) => {

    await userModel.deleteOne({_id: "5f9a0e132ed87012457c43f9"});

    const res = await request
      .get('/user/getTemporaryConnections?_id=5f9a0e132ed87012457c43f9')
      .send()

    expect(res.statusCode).toEqual(412)
    expect(res.clientError).toEqual(true)
    expect(res.serverError).toEqual(false)
    expect(res.text).toEqual('Error: User not found')
    done()
  })
})

describe('getTemporaryConnections', () => {
  it('successfully get temporary connections within isolation period', async (done) => {

    let date = new Date()

    await userModel.deleteOne({firstName: "Example A"});
    await userModel.deleteOne({firstName: "Example B"});

    let connectedUserA = await new userModel({firstName: "Example A", lastName: "Example", email: "exampleA@gmail.com"});
    await userModel.create(connectedUserA); 

    let connectedUserB = await new userModel({firstName: "Example B", lastName: "Example", email: "exampleB@gmail.com"});
    await userModel.create(connectedUserB); 

    let tempConnectionForA = {_id: connectedUserB._id.toString(), date: '2020-11-1'}
    let tempConnectionForB = {_id: connectedUserA._id.toString(), date: '2020-11-1'}

    connectedUserA.temporaryConnections.push(tempConnectionForA)
    connectedUserB.temporaryConnections.push(tempConnectionForB)

    let tempConnectionForA2 = {_id: connectedUserB._id.toString(), date: date.toString()}
    let tempConnectionForB2 = {_id: connectedUserA._id.toString(), date: date.toString()}

    connectedUserA.temporaryConnections.push(tempConnectionForA2)
    connectedUserB.temporaryConnections.push(tempConnectionForB2)

    connectedUserA.save()
    connectedUserB.save();

    const res = await request
      .get('/user/getTemporaryConnections?_id=' + connectedUserA._id.toString())
      .send()

    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(1)
    expect(res.body[0]).toHaveProperty('_id')
    expect(res.body[0]).toHaveProperty('date')
    expect(res.body[0]._id.toString()).toEqual(connectedUserB._id.toString())
    expect(res.body[0].date.toString()).toEqual(date.toString())
    done()
  })
})
afterAll(() => setTimeout(() => process.exit(), 500));

