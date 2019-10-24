# 实现一个静态服务器

## 初始化

1. yarn init -y 
2. 新建 index.ts
3. yarn global add ts-node-dev
4. yarn add --dev @types/node

index.ts
```
import * as http from "http";

//http.Server 类的实例，具有的方法参考：http://nodejs.cn/api/http.html#http_http_createserver_options_requestlistener
const server = http.createServer();

server.on('request', (request, response) => {
    console.log('有人请求了')
    response.end('hi')
})

server.listen(8888)
```
测试，运行`ts-node-dev index.ts`,请求8080端口，新开 terminal 运行`curl http://localhost:8888`,terminal1 输出 有人请求了，terminal2 输出 hi

## 基本用法

index.ts
```
server.on('request', (request:IncomingMessage, response) => {
    //console.log(request.constructor)
    console.log(request.httpVersion);
    console.log(request.url);
    response.end('hi')
})
```
输入`curl http://localhost:8888/xxxx`，可打印出`/xxxx`

通过 request.constructor 可知 request 为构造函数 IncomingMessage 的实例，通过定义 request 类型，使其通过 IDE 就能提示出所拥有的方法，例如 httpVersion,url等

同样 response 为 ServerResponse 的实例，同时类型也是 ServerResponse，IDE 可只智能提示其拥有的方法，例如 setHeader

**用 Node.js 获取请求内容**

get 请求
```
server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    //console.log(request.constructor)
    //console.log(response.constructor)
    console.log(request.method);
    console.log(request.url);
    console.log(request.headers);
    response.end('hi');
})
```
运行 `curl -v  http://localhost:8888/xxxx`，输出

请求的内容
```
> GET /xxxx HTTP/1.1
> Host: localhost:8888
> User-Agent: curl/7.43.0
> Accept: */*
```
Node.js 也获取到了这些内容
```
GET
/xxxx
{ host: 'localhost:8888',
  'user-agent': 'curl/7.43.0',
  accept: '*/*' }
```

post 请求

运行 `curl -v -d "name=zhangsan"  http://localhost:8888/xxxx` -d 表示为 post 请求

Node.js 获取的内容
```
POST
/xxxx
{ host: 'localhost:8888',
  'user-agent': 'curl/7.43.0',
  accept: '*/*',
  'content-length': '13',
  'content-type': 'application/x-www-form-urlencoded' }
```
但是拿不到请求消息体：name=zhangsan ，利用 request.on('data',()=>{}) 解决

```
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
```

输出，获得了请求的数据：name=zhangsan
```
POST
/xxxx
{ host: 'localhost:8888',
  'user-agent': 'curl/7.43.0',
  accept: '*/*',
  'content-length': '13',
  'content-type': 'application/x-www-form-urlencoded' }
body
name=zhangsan
```
Response 的用法

具有 getHeader/setHeader/end/write等方法，具有 statusCode 属性，可读可写
```
        response.statusCode = 404
        response.setHeader('zhangsan', `I'm 14 year old`)
        response.write('1\n')
        response.write('2\n')
        response.end()
```

## 根据 url 返回不同的文件

首先模拟网页内容，运行在浏览器中的
```
├── public
│   ├── index.html
│   ├── main.js
│   └── style.css
```
idnex.html
```
<!doctype html>
<html lang="zh">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>网页1</title>
</head>
<body>
  <h1>这是一个 index.html</h1>
</body>
</html>
```
style.css
```
h1 {
    color: red;
}
```
main.js
```
document.querySelector('h1').onclick = ()=> {
  alert('我是 JS')
}
```
index.ts
```
import * as fs from "fs";
import * as p from "path"

server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    const {method, url, headers} = request
    switch (url) {
        case '/index.html':
            response.setHeader('Content-Type', 'text/html; charset=utf-8')
            fs.readFile(p.resolve(publicDir, 'index.html'), (error, data) => {
                if (error) throw error
                response.end(data.toString())
            })
            break
        case '/style.css':
            response.setHeader('Content-Type', 'text/css; charset=utf-8')
            fs.readFile(p.resolve(publicDir, 'style.css'), (error, data) => {
                if (error) throw error
                response.end(data.toString())
            })
            break
        case '/main.js':
            response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
            fs.readFile(p.resolve(publicDir, 'main.js'), (error, data) => {
                if (error) throw error
                response.end(data.toString())
            })
            break
    }
})
```
测试，浏览器中输入`localhost:8888/index.html`，显示模拟的网页内容

## 处理请求参数
index.ts
```
    const {pathname, search} = url.parse(path)
    switch (pathname) {
        case '/index.html':
            response.setHeader('Content-Type', 'text/html; charset=utf-8')
            fs.readFile(p.resolve(publicDir, 'index.html'), (error, data) => {
                if (error) throw error
                response.end(data.toString())
            })
            break
```
通过 url.parse 的处理，查询参数就不会影响到 index.html 的显示（浏览器输入`http://localhost:8888/index.html?q=1`,正常显示 index.html 页面）

## 自动匹配任意文件












