const mysql = require('mysql')
const moment = require('moment')

const connection = mysql.createConnection({
  host: 'localhost', // 要连接的主机名
  user: 'root', // 要连接的数据库的用户名
  password: '123456', // 数据库密码
  database: 'ithub' // 数据库
})

exports.showSignin = (req, res) => {
  res.render('signin.html')
}

exports.signin = (req, res) => {
  res.send('signin')
}

exports.showSignup = (req, res) => {
  res.render('signup.html')
}

exports.signup = (req, res) => {
  // 1. 接收获取客户端提交的表单数据
  //    配置 body-parser 插件用来解析获取表单 POST 请求体数据
  const body = req.body

  // 2. 数据验证
  //    普通数据校验，例如数据有没有，格式是否正确
  //    业务数据校验，例如校验用户名是否被占用
  //    这里校验邮箱和昵称是否被占用

  // 校验邮箱是否被占用
  connection.query(
    'SELECT * FROM `users` WHERE `email`=?', [body.email],
    (err, results) => {
      if (err) {
        return res.send({
          code: 500,
          message: err.message // 把错误对象中的错误消息发送给客户端
        })
      }
      if (results[0]) {
        return res.send({
          code: 1,
          message: '邮箱已被占用了'
        })
      }

      // 校验昵称是否存在
      connection.query(
        'SELECT * FROM `users` WHERE `nickname`=?',
        [body.nickname],
        (err, results) => {
          if (err) {
            return res.send({
              code: 500,
              message: err.message // 把错误对象中的错误消息发送给客户端
            })
          }

          if (results[0]) {
            return res.send({
              code: 2,
              message: '昵称已被占用'
            })
          }

          // 邮箱和昵称都校验没有问题了，可以注册了
          // 3. 当数据验证都通过之后，在数据库写入一条新的用户数据
          
          // 添加更新时间
          // moment 是一个专门处理时间的 JavaScript 库，这个库既可以在浏览器使用，也可以在 Node 中使用
          // JavaScript 被称之为全栈式语言
          // moment() 用来获取当前时间
          // format() 方法用来格式化输出
          body.createdAt = moment().format('YYYY-MM-DD HH:mm:ss')

          const sqlStr = 'INSERT INTO `users` SET ?'

          connection.query(sqlStr, body, (err, results) => {
            if (err) {
              // 服务器异常，通知客户端
              return res.send({
                code: 500,
                message: err.message
              })
            }


            // 注册成功，告诉客户端成功了
            res.send({
              code: 200,
              message: 'ok'
            })

            // 用户注册成功之后需要跳转到首页
            // 1. 服务端重定向（只对同步请求有效）
            // res.send('注册成功')
            // 2. 让客户端自己跳
            // res.redirect('/')
          })
        }
      )
    }
  )
}

exports.signout = (req, res) => {
  res.send('signout')
}