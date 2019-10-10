import { NextFunction, Request, Response } from 'express'
import * as halson from 'halson'
import { UserModel } from '../schemas/user'
import { formatOutput } from '../utility/orderApiUtility'

// not needed after DB
// let users: Array<User> = []


export let getUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username

  UserModel.findOne({username:username}, (err, user) => {
    if (!user) {
      return res.status(404).send()
    }

    user = user.toJSON()
    user._id = user._id.toString() // why?
  
  // before DB
  // let user = users.find(obj => obj.username === username)
  // const httpStatusCode = user ? 200 : 404

  // halson : create resource links automatically
    user = halson(user).addLink('self',`/users/${user._id}`) // user id from DB ?
    return formatOutput(res,user,200,'user')
  })
}




export let addUser = (req: Request, res: Response, next: NextFunction) => {
  const newUser = new UserModel(req.body)

  newUser.save((error,user) => {
    user = halson(user.toJSON().addLink('self',`/users/{user._id}`))
    return formatOutput(res,user,201,'user')
  })
}



export let updateUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username

  UserModel.findOne({username:username},(err,user) =>{
    if(!user) {
      res.status(404).send()
    }


    // todo: beautify with prettier? spaces

  user.username = req.body.username || user.username
  user.firstName = req.body.firstName || user.firstName
  user.lastName = req.body.lastName || user.lastName
  user.email = req.body.email || user.email
  user.password = req.body.password || user.password
  user.phone = req.body.phone || user.phone
  user.userStatus = req.body.userStatus || user.userStatus
  
  user.save(error => {
    res.status(204).send()
  })
  })
}

export let removeUser = (req: Request, res: Response, next: NextFunction) => {
  const username = req.params.username

  UserModel.findOne({username:username},(error,user) =>{
    if(!user){
      return res.status(404).send()
    }
    user.remove(err => {
      return res.status(204).send()
    })
  })

}
