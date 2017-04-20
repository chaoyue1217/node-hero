// 在加载模块的时候，建议 核心最新、第三方其次、自己的最后
var path = require('path')
var express = require('express')
var template = require('art-template');
var heroRouter = require('./routes/hero')
var ejs = require('ejs')
var config = require('./config')

var app = express()

// 使用 Express 内置的功能开放静态资源
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')))
app.use('/test-view/', express.static(path.join(__dirname, './test-view/')))

// 这种方式表示可以直接去请求 public 中的资源，不需要加 /public/ 请求前缀
// app.use(express.static('./public'))

// 这种方式表示必须是以 /a/ 开头的路径才会拿到 /a/ 后面的路径部分，然后去 public 中找真实的资源
// app.use('/a/', express.static('./public/'))

// 建议：最好给你的静态资源加上请求前缀
//       如果加上建议还是第二个参数目录的真实目录名称前缀
// 注意：第二个参数中指定的路径如果是相对路径也是相对于 执行 node 命令所处的目录的
//       所以建议传递第二个参数的时候，最好传递一个动态的绝对路径
app.use('/public/', express.static(path.join(__dirname, './public/')))


// 告诉 Express ，使用 ejs 作为 res.render 的模板引擎
// ejs 的模板语法是 <%  %> 的格式，类似于 art-template 的 native 语法
// views 中的模板必须是 .ejs 后缀才可以
ejs.delimiter = config.template_delimiter // 配置 ejs 模板引擎的定界符
app.engine('.html', ejs.__express) // 修改 ejs 渲染模板引擎的默认视图文件后缀名为 .html
app.set('view engine', 'html') // 这里第二个参数必须是 app.engine() 中的第一个参数去掉点儿

// app.set('view engine', 'ejs')


// 同时当你调用 res.render 的时候，第一个参数不用传递后缀名
// 而且，Express 默认去 views 目录中找你要渲染的页面
app.set('views', config.view_path)

// 加载路由容器，就拥有了路由容器中所有的路由了
app.use(heroRouter)

app.listen(3000, function () {
  console.log('running...')
})
