const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//console.log(pool);
//创建路由器对象
const r=express.Router();
//添加路由
//1.用户注册  post  /reg
r.post('/reg',(req,res)=>{
  //1.1获取post请求的数据
  let obj=req.body;
  console.log(obj);
  //1.2验证数据是否为空
  if(!obj.uname){
    res.send({code:401,msg:'uname required'});
	//阻止往后执行
	return;
  }
  if(!obj.upwd){
    res.send({code:402,msg:'upwd required'});
	return;
  }
  if(!obj.email){
    res.send({code:403,msg:'email required'});
	return;
  }
  if(!obj.phone){
    res.send({code:404,msg:'phone required'});
	return;
  }
  //1.3执行SQL命令
  pool.query('INSERT INTO xz_user SET ?',[obj],(err,result)=>{
    if(err) throw err;
	console.log(result);
	//注册成功
	res.send({code:200,msg:'reg suc'});
  });
});
//2.用户登录  post  /login
r.post('/login',(req,res)=>{
  //2.1获取post请求的数据
  let obj=req.body;
  console.log(obj);
  //2.2验证数据是否为空
  if(!obj.uname){
    res.send({code:401,msg:'uname required'});
	return;
  }
  if(!obj.upwd){
    res.send({code:402,msg:'upwd required'});
	return;
  }
  //2.3执行SQL命令
  //到数据中查询是否有用户名和密码同时匹配的数据
  pool.query('SELECT * FROM xz_user WHERE uname=? AND upwd=?',[obj.uname,obj.upwd],(err,result)=>{
    if(err) throw err;
    //返回的结果是空数组，长度为0，说明登录失败
	console.log(result);
	if(result.length===0){
	  res.send({code:301,msg:'login err'});
	}else{//查询到了匹配的用户，登录是成功
	  res.send({code:200,msg:'login suc'}); 
	}
  });
});

//3.修改用户  get  /update
r.get('/update',(req,res)=>{
  //3.1获取查询字符串传递的数据
  let obj=req.query;
  console.log(obj);
  //3.2使用for-in遍历对象，验证各项是否为空
  //声明变量用于保存状态码
  let i=400;
  for(let k in obj){
	//每循环一个属性，i加1
	i++;
	//k代表每个属性名  obj[k]代表对应的属性值
    //console.log(k,obj[k]);
    //如果属性值为空，则提示该项属性不能为空
	if(!obj[k]){
	  res.send({code:i,msg:k+' required'});
	  return;
	}
  }
  //3.3执行SQL命令
  //修改数据，将整个对象修改
  pool.query('UPDATE xz_user SET ? WHERE uid=?',[obj,obj.uid],(err,result)=>{
    if(err) throw err;
	//返回的是对象，如果对象下的affectedRows为0说明修改失败，否则修改成功
	console.log(result);
	if(result.affectedRows===0){
	  res.send({code:301,msg:'update err'});
	}else{
	  res.send({code:200,msg:'update suc'});
	}
  });
});
//4.删除用户  get  /delete
r.get('/delete',(req,res)=>{
  //4.1获取查询字符串传递的数据
  let obj=req.query;
  console.log(obj);
  //4.2验证数据是否为空
  if(!obj.uid){
    res.send({code:401,msg:'uid required'});
	return;
  }
  //4.3执行SQL命令
  pool.query('DELETE FROM xz_user WHERE uid=?',[obj.uid],(err,result)=>{
    if(err) throw err;
	//返回对象，通过affectedRows判断是否删除成功
	console.log(result);
	if(result.affectedRows===0){
	  res.send({code:301,msg:'delete err'});
	}else{
	  res.send({code:200,msg:'delete suc'});
	}
  });
});

//导出路由器
module.exports=r;