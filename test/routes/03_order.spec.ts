'use strict'

import * as chai from 'chai'
import chaiHttp = require('chai-http')
import 'mocha'
import app from '../../src/app'
import { OrderStatus } from '../../src/models/orderStatus'
import {OrderModel} from '../../src/schemas/order'

 chai.use(chaiHttp)
 const expect = chai.expect

 describe('orderRoute', () => {
  const order = {
  // generic random value from 1 to 100 only for tests so far
  // id: 1,
  userId: 20,
  // tslint:disable-next-line: object-literal-sort-keys
  quantity: 1,
  shipDate: new Date(),
  status: OrderStatus.Placed,
  complete: false,
}

let orderIdCreated
let token

  before(async () => {
    expect(OrderModel.modelName).to.be.equal('Order')
    OrderModel.collection.drop()
  })

  it('should be able to login and get the token to be used on orders requests',async() => {
    return chai
    .request(app)
    .get(`/users/login?username=John&password=password`)
    .then(res => {
      expect(res.status).to.be.equal(200)
      token = res.body.token
    })
  })

  it('should respond with HTTP 500 status because there is no order', async () => {
    return chai
      .request(app)
      .get(`/store/orders/000`)
      .set('Authorization',`Bearer ${token}`)
      .then(res => {
        expect(res.status).to.be.equal(500) // see the thrown error - this obviously returns status 500
      })
  })

  // new with Schema / DB:
  it('should create a new user for Order tests and retrieve it back', async () => {
    const user = {
      username: 'OrderUser',
      firstName: 'Order',
      lastName: 'User',
      email: 'order@myemail.com',
      password: 'password',
      phone: '5555555',
      userStatus: 1,
    }
    return chai
      .request(app)
      .post('/users')
      .set('Authorization',`Bearer ${token}`)
      .send(user)
      .then(res => {
        expect(res.status).to.be.equal(201)
        expect(res.body.username).to.be.equal(user.username)
        order.userId = res.body._id
      })
  })

  it('should create a new order and retrieve it back', async () => {
    
    return chai
      .request(app)
      .post('/store/orders')
      .set('Authorization',`Bearer ${token}`)
      .send(order)
      .then(res => {
        expect(res.status).to.be.equal(201)
        expect(res.body.userId).to.be.equal(order.userId)
        expect(res.body.complete).to.be.equal(false)
        orderIdCreated = res.body._id // check _id from response!
      })
  })

  it('should return the order created on the step before', async () => {
    return chai
      .request(app)
      .get(`/store/orders/${orderIdCreated}`) // see _id from last response
      .set('Authorization',`Bearer ${token}`)
      .then(res => {
        expect(res.status).to.be.equal(200)
        expect(res.body._id).to.be.equal(orderIdCreated) // check if it's the same id (_id from response)
        expect(res.body.status).to.be.equal(order.status)
      })
  })

  it('should return all orders so far', async () => {
    return chai
      .request(app)
      .get(`/store/orders`)
      .set('Authorization',`Bearer ${token}`)
      .then(res => {
        expect(res.status).to.be.equal(200)
        expect(res.body.length).to.be.equal(1)
      })
  })

  it('should not return orders because offset is higher than the size of the orders array', async () => {
    return chai
      .request(app)
      .get(`/store/orders?offset=2&limit=2`)
      .set('Authorization',`Bearer ${token}`)
      .then(res => {
        expect(res.status).to.be.equal(200)
        expect(res.body.length).to.be.equal(0)
      })
  })

  it('should return the inventory for all users', async () => {
    return chai
      .request(app)
      .get(`/store/inventory?status=PLACED`)
      .set('Authorization',`Bearer ${token}`)
      .then(res => {
        expect(res.status).to.be.equal(200)
        expect(res.body[order.userId].length).to.be.equal(1)
      })
  })

  it('should remove an existing order', async () => {
    return chai
      .request(app)
      .del(`/store/orders/${orderIdCreated}`)
      .set('Authorization',`Bearer ${token}`)
      .then(res => {
        expect(res.status).to.be.equal(204)
      })
  })

  it('should return 404 when it is trying to remove an order because the order does not exist', async () => {
    return chai
      .request(app)
      .del(`/store/orders/${orderIdCreated}`)
      .set('Authorization',`Bearer ${token}`)
      .then(res => {
        expect(res.status).to.be.equal(404)
      })
  })
})