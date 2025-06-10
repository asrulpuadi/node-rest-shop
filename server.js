const http = require('http')
const app = require('./app')

const port = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(port,() => {
    console.log(`Restful API Shop app listening on port ${port} -- ${new Date().toLocaleDateString()}`);
})
