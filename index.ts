import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";

//http.Server 类的实例，具有的方法参考：http://nodejs.cn/api/http.html#http_http_createserver_options_requestlistener
const server = http.createServer();

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    console.log(request.method);
    console.log(request.url);
    console.log(request.headers);
    const array = []
    request.on('data', (chunk) => {
        array.push(chunk) //不可能一次性发送（中间可能会断掉），持续部分的发送数据，在 push 到数组中
    })
    request.on('end', () => {
        const body = Buffer.concat(array).toString()
        console.log('body')
        console.log(body)
        response.end('hi')
    })
})

server.listen(8888)