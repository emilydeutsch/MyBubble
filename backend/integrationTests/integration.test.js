const networkManager = require('../utils/networkManager.js');
const userModel = require('../userSchema.js');
const supertest = require('supertest')
const mongoose = require('mongoose');

const app = require('../app.js').app;
const integrationHelpers = require('./integrationHelpers.js');
const { rest } = require('lodash');

const request = supertest(app);

mongoose.connect('mongodb://localhost/mybubbletest-2');



/* Integration Test User adds Friend as a firstConnection */
describe('User adds friend as first connection', () => {
  it('Friend cannot be added multiple times, you can find eachother\'s connections and healthStatuses are updated accordingly', async (done) => {

    await userModel.deleteOne({firstName: "Ruby"});
    await userModel.deleteOne({firstName: "Yang"});

    await userModel.deleteOne({firstName: "Jacob"});  
    await userModel.deleteOne({firstName: "The"});
    await userModel.deleteOne({firstName: "Builder"});

    let exampleRuby = await new userModel({firstName: "Ruby", lastName: "Rose", email: "ruby@itest.com", healthStatus: 2});
    let exampleYang = await new userModel({firstName: "Yang", lastName: "Xiao Long", email: "yang@itest.com"});

    let exampleJacob = await new userModel({firstName: "Jacob", lastName: "Two-Two", email: "jacob@itest.com"});
    let exampleTaker = await new userModel({firstName: "The", lastName: "Undertaker", email: "taker@itest.com", healthStatus: 0});
    let exampleBuilder = await new userModel({firstName: "Builder", lastName: "Bob", email: "builder@itest.com"});

    await userModel.create(exampleRuby);
    await userModel.create(exampleYang);
    await userModel.create(exampleJacob);
    await userModel.create(exampleTaker);
    await userModel.create(exampleBuilder);

    exampleRuby.firstConnections.push(exampleYang._id.toString())
    exampleYang.firstConnections.push(exampleRuby._id.toString())

    exampleRuby.firstConnections.push(exampleJacob._id.toString())
    exampleJacob.firstConnections.push(exampleRuby._id.toString())

    exampleTaker.firstConnections.push(exampleBuilder._id.toString())
    exampleBuilder.firstConnections.push(exampleTaker._id.toString())

    await exampleRuby.save();
    await exampleYang.save();
    await exampleJacob.save();
    await exampleTaker.save();
    await exampleBuilder.save();

    const res1 = await request
    .post('/user/addFirstConnection')
    .set('Content-Type', 'application/json')
    .send({
      'firstID' : exampleJacob._id.toString(),
      'secondID' : exampleTaker._id.toString()
    })

    expect(res1.statusCode).toEqual(200)
    expect(res1.body.length).toEqual(2)
    expect(res1.body[0]).toHaveProperty('_id')
    expect(res1.body[1]).toHaveProperty('_id')
    expect(res1.body[0]._id.toString()).toEqual(exampleJacob._id.toString())
    expect(res1.body[1]._id.toString()).toEqual(exampleTaker._id.toString())

    const res2 = await request
    .post('/user/addFirstConnection')
    .set('Content-Type', 'application/json')
    .send({
      'firstID' : exampleJacob._id.toString(),
      'secondID' : exampleTaker._id.toString()
    })

    expect(res2.statusCode).toEqual(412)
    expect(res2.text).toEqual('Error: Users already connected')
    
    const res3 = await request
      .get('/user/getAllConnections?_id=' + exampleTaker._id.toString())
      .send()

    expect(res3.statusCode).toEqual(200)
    expect(res3.body).toHaveProperty('firstConnections')
    expect(res3.body).toHaveProperty('secondConnections')
    expect(res3.body).toHaveProperty('thirdConnections')
    expect(res3.body.firstConnections.includes(exampleJacob._id.toString())).toEqual(true)
    expect(res3.body.secondConnections.includes(exampleRuby._id.toString())).toEqual(true)
    expect(res3.body.thirdConnections.includes(exampleYang._id.toString())).toEqual(true)
    done()
  })
})
/*
/* Integration Test Health Status */
describe('User changes their healthStatus to infected w/ Covid-19', () => {
  it('All Connections of the user will potentially have their healthStatus changed, they can find their new health by polling', async (done) => {

    await userModel.deleteMany({firstName: "Ruby"});
    await userModel.deleteOne({firstName: "Yang"});

    await userModel.deleteOne({firstName: "Jacob"});  
    await userModel.deleteOne({firstName: "The"});
    await userModel.deleteOne({firstName: "Builder"});

    let exampleRuby = await new userModel({firstName: "Ruby", lastName: "Rose", email: "ruby@itest.com"});
    let exampleYang = await new userModel({firstName: "Yang", lastName: "Xiao Long", email: "yang@itest.com"});

    let exampleJacob = await new userModel({firstName: "Jacob", lastName: "Two-Two", email: "jacob@itest.com"});
    let exampleTaker = await new userModel({firstName: "The", lastName: "Undertaker", email: "taker@itest.com"});
    let exampleBuilder = await new userModel({firstName: "Builder", lastName: "Bob", email: "builder@itest.com"});

    await userModel.create(exampleRuby);
    await userModel.create(exampleYang);
    await userModel.create(exampleJacob);
    await userModel.create(exampleTaker);
    await userModel.create(exampleBuilder);

    exampleRuby.firstConnections.push(exampleYang._id.toString())
    exampleYang.firstConnections.push(exampleRuby._id.toString())

    exampleRuby.firstConnections.push(exampleJacob._id.toString())
    exampleJacob.firstConnections.push(exampleRuby._id.toString())

    exampleTaker.firstConnections.push(exampleBuilder._id.toString())
    exampleBuilder.firstConnections.push(exampleTaker._id.toString())

    exampleTaker.firstConnections.push(exampleJacob._id.toString())
    exampleJacob.firstConnections.push(exampleTaker._id.toString())

    await exampleRuby.save();
    await exampleYang.save();
    await exampleJacob.save();
    await exampleTaker.save();
    await exampleBuilder.save();

    const res1 = await request
    .post('/healthStatus/updateHealthStatus')
    .set('Content-Type', 'application/json')
    .send({
      'id': exampleBuilder._id.toString(),
      'healthStatus' : true
    });

    expect(res1.statusCode).toEqual(200)
    expect(res1.body).toHaveProperty('healthStatus');
    expect(res1.body).toHaveProperty('_id');
    expect(res1.body._id.toString()).toEqual(exampleBuilder._id.toString())
    expect(res1.body.healthStatus).toEqual(0);

    const res2 = await request
      .get('/healthStatus/pollHealthStatus?id=' + exampleTaker._id.toString())
      .send({});
    
    expect(res2.statusCode).toEqual(200)
    expect(res2.body).toHaveProperty('changed')
    expect(res2.body).toHaveProperty('healthStatus')
    expect(res2.body.changed).toEqual(true)
    expect(res2.body.healthStatus).toEqual(1)
    

   const res3 = await request
      .get('/healthStatus/pollHealthStatus?id=' + exampleYang._id.toString())
      .send({});
    
    expect(res3.statusCode).toEqual(200)
    expect(res3.body).toHaveProperty('changed')
    expect(res3.body).toHaveProperty('healthStatus')
    expect(res3.body.changed).toEqual(false)
    expect(res3.body.healthStatus).toEqual(4)
   
    const res4 = await request
    .post('/healthStatus/updateHealthStatus')
    .set('Content-Type', 'application/json')
    .send({
      'id': exampleBuilder._id.toString(),
      'healthStatus' : false
    });

    expect(res4.statusCode).toEqual(200)
    expect(res4.body).toHaveProperty('healthStatus');
    expect(res4.body).toHaveProperty('_id');
    expect(res4.body._id.toString()).toEqual(exampleBuilder._id.toString())
    expect(res4.body.healthStatus).toEqual(2);

    const res5 = await request
    .post('/healthStatus/updateHealthStatus')
    .set('Content-Type', 'application/json')
    .send({
      'id': exampleBuilder._id.toString(),
      'healthStatus' : false
    });

    expect(res5.statusCode).toEqual(200)
    expect(res5.body).toHaveProperty('healthStatus');
    expect(res5.body).toHaveProperty('_id');
    expect(res5.body._id.toString()).toEqual(exampleBuilder._id.toString())
    expect(res5.body.healthStatus).toEqual(2);

    exampleBuilder.healthStatus = 0;
    exampleTaker.healthStatus = 0;

    await exampleBuilder.save();
    await exampleTaker.save();

    const res6 = await request
    .post('/healthStatus/updateHealthStatus')
    .set('Content-Type', 'application/json')
    .send({
      'id': exampleBuilder._id.toString(),
      'healthStatus' : false
    });

    expect(res6.statusCode).toEqual(200)
    expect(res6.body).toHaveProperty('healthStatus');
    expect(res6.body).toHaveProperty('_id');
    expect(res6.body._id.toString()).toEqual(exampleBuilder._id.toString())
    expect(res6.body.healthStatus).toEqual(1);

    await console.log(exampleBuilder)
    done()
  })
})

/* Integration Test, creating a new user */
describe('User signs up for the first time', () => {
  it('The user can sign up with their email, and can perform actions with the return information, no other users can be created with that email', async (done) => {

    await userModel.deleteOne({firstName: "Ruby"});    

    const res1 = await request
    .put('/user/newUser')
    .set('Content-Type', 'application/json')
    .send({
      'firstName': "Ruby",
      'lastName': "Rose",
      'email': "redlikeroses@gmail.com"
    });

    expect(res1.statusCode).toEqual(200)
    expect(res1.body).toHaveProperty('_id');
    expect(res1.body).toHaveProperty('firstConnections');
    expect(res1.body).toHaveProperty('healthStatus');
    expect(res1.body).toHaveProperty('firstName');
    expect(res1.body.firstName).toEqual("Ruby");
    expect(res1.body.healthStatus).toEqual(4);

    const res2 = await request
      .get('/healthStatus/pollHealthStatus?id=' + res1.body._id.toString())
      .send({});
    
    expect(res2.statusCode).toEqual(200)
    expect(res2.body).toHaveProperty('changed')
    expect(res2.body).toHaveProperty('healthStatus')
    expect(res2.body.changed).toEqual(false)
    expect(res2.body.healthStatus).toEqual(4)

    const res3 = await request
    .put('/user/newUser')
    .set('Content-Type', 'application/json')
    .send({
      'firstName': "Summer",
      'lastName': "Rose",
      'email': "redlikeroses@gmail.com"
    });

    expect(res3.statusCode).toEqual(412)
    expect(res3.text).toMatch(/MongoError: E11000 duplicate key error/)
    done()
  })
})

/* Integration Test, Searching for an existing user*/
describe('Searching for an existing user', () => {
  it('After a user signs up you can search for them by email, first name, last name, id or regex matching', async (done) => {

    await userModel.deleteMany({firstName: "Ruby"});
    await userModel.deleteMany({lastName: "Rose"});
    await userModel.deleteMany({lastName: "Ruby"});

    let exampleRuby = await new userModel({firstName: "Ruby", lastName: "Rose", email: "ruby@itest.com"});
    await userModel.create(exampleRuby);

    const res = await request
      .get('/user/findByQuery?firstName=Ruby')
      .send()
    expect(res.statusCode).toEqual(200)
    expect(res.body.length).toEqual(1);
    expect(res.body[0]).toHaveProperty('_id');
    expect(res.body[0]._id.toString()).toEqual(exampleRuby._id.toString())

    const res2 = await request
      .get('/user/findByQuery?lastName=Rose')
      .send()
    expect(res2.statusCode).toEqual(200)
    expect(res2.body.length).toEqual(1);
    expect(res2.body[0]).toHaveProperty('_id');
    expect(res2.body[0]._id.toString()).toEqual(exampleRuby._id.toString())

    const res3 = await request
      .get('/user/findByQuery?email=ruby@itest.com')
      .send()
    expect(res3.statusCode).toEqual(200)
    expect(res3.body.length).toEqual(1);
    expect(res3.body[0]).toHaveProperty('_id');
    expect(res3.body[0]._id.toString()).toEqual(exampleRuby._id.toString())

    const res4 = await request
      .get('/user/findByQuery?_id=' + exampleRuby._id.toString())
      .send()
    expect(res4.statusCode).toEqual(200)
    expect(res4.body.length).toEqual(1);
    expect(res4.body[0]).toHaveProperty('_id');
    expect(res4.body[0]._id.toString()).toEqual(exampleRuby._id.toString())

    const res5 = await request
    .get('/user/findAllMatching?searchString=ru')
    .send()
    expect(res5.statusCode).toEqual(200)
    expect(res5.body.length).toEqual(1);
    expect(res5.body[0]).toHaveProperty('_id');
    expect(res5.body[0]._id.toString()).toEqual(exampleRuby._id.toString())

    const res6 = await request
    .get('/user/findAllMatching?searchString=ru Ro')
    .send()
    expect(res6.statusCode).toEqual(200)
    expect(res6.body.length).toEqual(1);
    expect(res6.body[0]).toHaveProperty('_id');
    expect(res6.body[0]._id.toString()).toEqual(exampleRuby._id.toString())

    done()
  })
})

describe('A user adds a temporary connection', () => {
  it('can add connections within isolation period, and get connections within isolation period', async (done) => {

    await userModel.deleteOne({firstName: "Ruby"});
    await userModel.deleteOne({firstName: "Yang"});

    await userModel.deleteOne({firstName: "Jacob"});  


    let exampleRuby = await new userModel({firstName: "Ruby", lastName: "Rose", email: "ruby@itest.com"});
    let exampleYang = await new userModel({firstName: "Yang", lastName: "Xiao Long", email: "yang@itest.com"});

    let exampleJacob = await new userModel({firstName: "Jacob", lastName: "Two-Two", email: "jacob@itest.com"});

    await userModel.create(exampleRuby);
    await userModel.create(exampleYang);
    await userModel.create(exampleJacob);
    

    let tempConnectionForRuby = {_id: exampleYang._id.toString(), date: '2020-11-1'}
    let tempConnectionForYang = {_id: exampleRuby._id.toString(), date: '2020-11-1'}

    exampleRuby.temporaryConnections.push(tempConnectionForRuby)
    exampleYang.temporaryConnections.push(tempConnectionForYang)

    exampleRuby.save()
    exampleYang.save();

    const res = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : exampleRuby._id.toString(),
        'secondID' : exampleYang._id.toString(),
        'date' : '2021-11-29'
      })

      expect(res.statusCode).toEqual(200)
      expect(res.body).toHaveProperty('length')
      expect(res.body.length).toEqual(2)
      expect(res.body[0]).toHaveProperty('_id')
      expect(res.body[1]).toHaveProperty('_id')
      expect(res.body[0]._id.toString()).toEqual(exampleRuby._id.toString())
      expect(res.body[1]._id.toString()).toEqual(exampleYang._id.toString())
  
      const res2 = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : exampleRuby._id.toString(),
        'secondID' : exampleYang._id.toString(),
        'date' : '2021-11-29'
      })

      expect(res2.statusCode).toEqual(412)
      expect(res2.text).toEqual('Error: Already a temporary connection on this date')
      

      const res3 = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : exampleRuby._id.toString(),
        'secondID' : exampleYang._id.toString(),
        'date' : '2021-11-30'
      })

      expect(res3.statusCode).toEqual(200)
      expect(res3.body).toHaveProperty('length')
      expect(res3.body.length).toEqual(2)
      expect(res3.body[0]).toHaveProperty('_id')
      expect(res3.body[1]).toHaveProperty('_id')
      expect(res3.body[0]._id.toString()).toEqual(exampleRuby._id.toString())
      expect(res3.body[1]._id.toString()).toEqual(exampleYang._id.toString())

      const res4 = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : exampleRuby._id.toString(),
        'secondID' : exampleJacob._id.toString(),
        'date' : '2021-11-30'
      })

      expect(res4.statusCode).toEqual(200)
      expect(res4.body).toHaveProperty('length')
      expect(res4.body.length).toEqual(2)
      expect(res4.body[0]).toHaveProperty('_id')
      expect(res4.body[1]).toHaveProperty('_id')
      expect(res4.body[0]._id.toString()).toEqual(exampleRuby._id.toString())
      expect(res4.body[1]._id.toString()).toEqual(exampleJacob._id.toString())

      const res5 = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : exampleRuby._id.toString(),
        'secondID' : exampleJacob._id.toString(),
        'date' : '2020-10-23'
      })

      expect(res5.statusCode).toEqual(412)
      expect(res5.text).toEqual('Error: Date not valid')

    const res6 = await request
      .get('/user/getTemporaryConnections?_id=' + exampleRuby._id.toString())
      .send()

    expect(res6.statusCode).toEqual(200)
    expect(res6.body.length).toEqual(3)

    for(let i = 0; i < res.body.length; i++){
      expect(res6.body[i]).toHaveProperty('_id')
      expect(res6.body[i]).toHaveProperty('date')
      expect(res6.body[i].date == '2020-11-1').toEqual(false)
    }

    exampleRuby.firstConnections.push(exampleJacob._id.toString());
    exampleJacob.firstConnections.push(exampleRuby._id.toString());

    exampleRuby.save();
    exampleJacob.save();

    const res7 = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : exampleRuby._id.toString(),
        'secondID' : exampleJacob._id.toString(),
        'date' : '2021-10-23'
      })
      expect(res7.statusCode).toEqual(412)
      expect(res7.text).toEqual('Error: Already a first level connection')

    
    done()
  })
})

/* Bad request tests */
describe('User attempts to send a bad request or refer to non-existent user', () => {
  it('Malformed or requests or requests that refer to a non-existent user should be caught and returned with an error', async (done) => {

    await userModel.deleteMany({firstName: "Ruby"});
    await userModel.deleteOne({firstName: "Jacob"});  

    let exampleRuby = await new userModel({firstName: "Ruby", lastName: "Rose", email: "ruby@itest.com"});

    let exampleJacob = await new userModel({firstName: "Jacob", lastName: "Two-Two", email: "jacob@itest.com"});

    await userModel.create(exampleRuby);

    await userModel.create(exampleJacob);


    const res1 = await request
    .post('/user/addFirstConnection')
    .set('Content-Type', 'application/json')
    .send({
      'firstID' : exampleJacob._id.toString()
    })

    expect(res1.statusCode).toEqual(412)
    expect(res1.text).toEqual('Failed: Missing User IDs or invalid')

    await userModel.deleteOne({_id: "5f9a0e132ed87012457c43f9"});
    const res2 = await request
    .post('/user/addFirstConnection')
    .set('Content-Type', 'application/json')
    .send({
      'firstID' : exampleJacob._id.toString(),
      'secondID' : "5f9a0e132ed87012457c43f9",
    })

    expect(res2.statusCode).toEqual(412)
    expect(res2.text).toEqual('Error: User not found');
    
    const res3 = await request
    .get('/user/findAllMatching')
    .send()
    expect(res3.statusCode).toEqual(412)
    expect(res3.text).toEqual('Failed: Not given a search string')

    const res4 = await request
    .get('/user/getAllConnections?_id=')
    .send()
    expect(res4.statusCode).toEqual(412)
    expect(res4.text).toEqual('Failed: Missing User IDs or invalid')
  

    const res5 = await request
    .get('/user/getAllConnections?_id=5f9a0e132ed87012457c43f9')
    expect(res5.statusCode).toEqual(412)
    expect(res5.text).toEqual('Error: User not found')

    const res6 = await request
      .post('/user/addTemporaryConnection')
      .set('Content-Type', 'application/json')
      .send({
        'firstID' : exampleRuby._id.toString(),
        'date' : '2020-11-29'
      })
      expect(res6.statusCode).toEqual(412)
      expect(res6.text).toEqual('Failed: Missing or Invalid Fields')

    const res7 = await request
    .post('/user/addTemporaryConnection')
    .set('Content-Type', 'application/json')
    .send({
      'firstID' : exampleRuby._id.toString(),
      'secondID' : '5f9a0e132ed87012457c43f9',
      'date' : '2020-11-29'
    })
    expect(res7.statusCode).toEqual(412)
    expect(res7.text).toEqual('Error: User not found')

    const res8 = await request
    .get('/user/getTemporaryConnections?_id=')
    expect(res8.statusCode).toEqual(412)
    expect(res8.text).toEqual('Failed: Missing User IDs or invalid')

    const res9 = await request
    .get('/user/getTemporaryConnections?_id=5f9a0e132ed87012457c43f9')
    expect(res9.statusCode).toEqual(412)
    expect(res9.text).toEqual('Error: User not found')

    const res10 = await request
    .post('/healthStatus/updateHealthStatus')
    .set('Content-Type', 'application/json')
    .send({})
    expect(res10.statusCode).toEqual(412)
    expect(res10.text).toEqual('Failed: Missing Fields or invalid')

    const res11 = await request
    .post('/healthStatus/updateHealthStatus')
    .set('Content-Type', 'application/json')
    .send({
      'id' : exampleRuby._id.toString(),
      'healthStatus' : 'bruh'
    })
    expect(res11.statusCode).toEqual(412)
    expect(res11.text).toEqual('Failed: Missing Fields or invalid')

    const res12 = await request
    .post('/healthStatus/updateHealthStatus')
    .set('Content-Type', 'application/json')
    .send({
      'id' : '5f9a0e132ed87012457c43f9',
      'healthStatus' : 'true'
    })
    expect(res12.statusCode).toEqual(412)
    expect(res12.text).toEqual('Error: User not found')

    const res13 = await request
    .get('/healthStatus/pollHealthStatus?id=')
    expect(res13.statusCode).toEqual(412)
    expect(res13.text).toEqual('Failed: Missing Fields or invalid')

    const res14 = await request
    .get('/healthStatus/pollHealthStatus?id=5f9a0e132ed87012457c43f9')
    expect(res14.statusCode).toEqual(412)
    expect(res14.text).toEqual('Error: User not found')

    done()
  })
})

afterAll(() => setTimeout(() => process.exit(), 500));

