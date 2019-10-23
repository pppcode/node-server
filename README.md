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

## 请求不同路径，响应不同的内容

