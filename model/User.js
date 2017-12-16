// 面对对象编程
//链接数据库实例
var mongodb = require('./db');
//创建一个构造函数 命名为user 里面的username，password email 分别存放用户名 密码和email
function formatDate(num) {
    return num < 10 ? '0'+ num : num;
}
function User(user) {
    this.username = user.username;
    this.reallyname = user.reallyname;
    this.password = user.password;
    this.phone = user.phone;
    this.email = user.email;
}
module.exports = User;
User.prototype.save = function (callback) {
    var date = new Date();
    var now =  date.getFullYear() +'-'+ formatDate(date.getMonth() + 1) +'-'+formatDate(date.getDate())+' '+
        formatDate(date.getHours())+':'+ formatDate(date.getMinutes())+':'+ formatDate(date.getSeconds());
//    收集数据
    var user = {
        username :this.username,
        reallyname :this.reallyname,
        password :this.password,
        phone:this.phone,
        email:this.email,
        time:now
    }
    mongodb.open(function (err,db) {
    //
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //将数据插入到users集合中
            collection.insert(user,{safe:true},function (err,user,users) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                //改变！！！！！！！！！！！！！！！
                callback(null,user[0]);
                console.log(user);
            })
        })
    })

}
User.get = function (username,callback) {
//    打开数据库
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            //查询出name未指定用户名的用户信息，将结果返回
            collection.findOne({username:username},function (err,user) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,user)
            })
        })
    })
}
User.getTen = function(name,page,callback){
    mongodb.open(function(err,db){
        if(err){
            return callback(err);
        }
        db.collection('users',function(err,collection){
            if(err){
                mongodb.close();
                return callback(err);
            }
            var query = {}
            if(name){
                query.name = name;
            }
            collection.count(query,function(err,total){
                if(err){
                    mongodb.close();
                    return callback(err);
                }
                collection.find(query,{
                    skip:(page - 1) * 5,
                    limit:5,
                }).sort({time:-1}).toArray(function(err,docs){
                    mongodb.close();
                    if(err){
                        return callback(err);
                    }
                    return callback(null,docs,total);
                })
            })
        })
    })
}
// 删除
User.remove = function (name,time,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.remove({
                name:name,
                time:time,
            },{
                w:1
            },function (err) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}
//修改
User.edit = function (name,time,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        //读取集合
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err)
            }
            //查询一篇文章
            collection.findOne({
                //查询条件
                name:name,
                time:time
            },function (err,doc) {
                //doc就是查询结果
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
User.update = function (username,phone,email,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            collection.update({
                username:username,

            },{
                $set:{phone:phone,email:email,username:username}
            },function (err,doc) {
                mongodb.close();
                if(err){
                    return callback(err);
                }
                return callback(null,doc);
            })
        })
    })
}
//搜索用户
User.search = function (keyword,callback) {
    mongodb.open(function (err,db) {
        if(err){
            return callback(err);
        }
        db.collection('users',function (err,collection) {
            if(err){
                mongodb.close();
                return callback(err);
            }
            var newRegex = new RegExp(keyword,"i");
            collection.find({username:newRegex},{
                username:1,
                time:1,
                reallyname:1,
                email:1,
                phone:1,
            }).sort({time:-1}).toArray(function (err,docs) {
                mongodb.close();
                if(err){return callback(err);}
                return callback(null,docs);
            })
        })
    })
}

