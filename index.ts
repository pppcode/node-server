import * as http from "http";

//http.Server 类的实例，具有的方法参考：http://nodejs.cn/api/http.html#http_http_createserver_options_requestlistener
const server = http.createServer();

server.on('request', (request, response) => {
    console.log('有人请求了')
    response.end('hi')
})

server.listen(8888)