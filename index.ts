import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as fs from "fs";
import * as p from "path"
import * as url from "url";


//http.Server 类的实例，具有的方法参考：http://nodejs.cn/api/http.html#http_http_createserver_options_requestlistener
const server = http.createServer();
const publicDir = p.resolve(__dirname, 'public')

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    response.setHeader('Content-Type', 'text/html; charset=utf-8')
    const {method, url: path, headers} = request
    const {pathname, search} = url.parse(path)
    //console.log(pathname)
    let filename = pathname.substr(1)
    if (filename === '') {
        filename = 'index.html'
    }
    fs.readFile(p.resolve(publicDir, filename), (error, data) => {
        if (error) {
            //console.log(error)
            if (error.errno === -2) { //表示文件不存在
                response.statusCode = 404
                fs.readFile(p.resolve(publicDir, '404.html'), (error, data) => {
                    response.end(data)
                })
            } else if (error.errno === -21) { //表示非法操作文件夹
                response.statusCode = 403
                response.end('无权查看目录内容')
            } else {
                response.statusCode = 500
                response.end('服务器繁忙，请稍后再试')
            }
        } else {
            response.end(data)
        }
    })
})

server.listen(8888)