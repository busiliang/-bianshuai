//数据库配置信息
module.exports = {
    cookieSecret:'lzy',//加密cookies使用的字符串
    db:'crud',//数据库名称
    host:'localhost',//数据库地址
    port:27017//数据库端口号
}
//我们把数据库的配置信息写在这里  是为了在连接数据库的时候
// 一旦数据库的地址或者名称发生改变的时候 我们只需要改这里就可以