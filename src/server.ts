// no HTTPS configuration when run in google cloud env
// import * as fs from 'fs'
// import * as https from 'https'
import app from './app'
const PORT = process.env.PORT || 3000 
app.listen(PORT)

/* const httpsOptions = {
    key: fs.readFileSync('./config/key.pem'),
    cert: fs.readFileSync('./config/cert.pem'),
}

https.createServer(httpsOptions,app).listen(PORT)

 */