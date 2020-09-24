const express=require('express');
//引入用户路由器
const userRouter=require('./router/user.js');
//引入body-parser中间件
const bodyParser=require('body-parser');
//console.log(userRouter);
//创建web服务器
const app=express();
//设置端口
app.listen(8080);
//托管静态资源到public目录
app.use( express.static('./public') );
//使用body-parser中间件将post请求数据解析为对象
app.use( bodyParser.urlencoded({
  extended:false
}) );
//路由器/路由在最后出现
//在web服务器挂载路由器，添加前缀/user
//路由URL访问  /user/reg 
app.use( '/user',userRouter );