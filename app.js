const express = require('express');
const bodyParser = require('body-parser')
const router = require('./router')
const app = express();

app.use('/public', express.static('./public/'))
app.use('/node_modules', express.static('./node_modules/'))
// 配置 body-parser 解析表单 POST 请求体
// 只有配置了该插件，就可以在请求处理函数中使用 req.body 来访问请求体数据了
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.engine('html', require('express-art-template'))
app.use(router);
app.listen(3000,() => console.log('app listening on port 3000!'))
