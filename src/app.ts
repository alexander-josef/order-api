import * as bodyParser from 'body-parser'
import * as express from 'express'
import {APIRoute} from '../src/routes/api'
import { OrderRoute } from "../src/routes/order";
import { UserRoute } from "../src/routes/user";

class App {
  public app: express.Application
  public userRoutes:UserRoute = new UserRoute()
  public orderRoutes:OrderRoute = new OrderRoute()
  public apiRoutes:APIRoute = new APIRoute()


  constructor() {
    this.app = express() 
    this.app.use(bodyParser.json())
    this.apiRoutes.routes(this.app)
    this.userRoutes.routes(this.app)
    this.orderRoutes.routes(this.app)
  }
}

export default new App().app