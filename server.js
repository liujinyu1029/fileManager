var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");
var mime = require('mime');   //文件的类型
var server = http.createServer(function (req, res) {
    //icon请求忽略
    if (req.url == '/favicon.ico') {
        res.end();
        return;
    }
    //获取当前文件所在的目录路径
    var filePath = __dirname;// h:\misc\fileManager
    //标准化 请求路径
    var reqPath = path.normalize(req.url); // \public\css\index.css
    //缓存请求路径用于 下边修改链接路径
    var cachePath = reqPath;
    //获取当文件的路径
    var filename = path.join(filePath, reqPath);// h:\misc\fileManager\public\css\index.css
    //判断文件是否存在
    var addStr = '';
    fs.exists(filename, function (exists) {
        //判断文件是否存在
        if (exists) {//文件存在
            //判断文件是否为目录 是目录则遍历其文件
            fs.stat(filename, function (err, stats) {
                if (!err && stats.isDirectory()) {//文件为目录
                    addStr += '<link rel="stylesheet" href="/public/css/index.css"/>';
                    addStr += '<h1>FileManager system directory</h1>';
                    addStr += '<ul>';
                    //读取文件
                    fs.readdir(filename, function (err, files) {
                        res.writeHead(200, {"Content-Type": "text/html;charset=utf-8"});
                        if (err) {
                            console.log(err);
                        } else {
                            files.forEach(function (file) {//遍历目录下所有文件
                                //if (filename != filePath) {
                                //    filename = filename.replace(filePath, "");
                                //}
                                var href  = path.join(cachePath, file).replace(/\\/g,"/");

                                if (path.extname(file)) {//有后缀 .jpg .css
                                    addStr += '<li class="gray"><a href="' + href + '" style="">' + file + ' </a></li>';
                                } else {//没有后缀 为目录
                                    addStr += '<li ><a href="' + href + '" style="">' + file + '</a></li>';
                                }
                            });
                        }
                        res.end(addStr + "</ul><p>提示：以上目录列表，蓝色是文件夹，可点击继续进入下一节。</p>");
                    });
                } else if (!err && fs.statSync(filename).isFile()) {
                    //当访问的是文件时，判断文件类型，并读文件
                    res.writeHead(200, {'Content-Type': mime.lookup(path.basename(filename)) + ';charset=utf-8'});
                    fs.readFile(filename, {flag: "r"}, function (err, data) {
                        if (err) {
                            res.end(err);
                        } else {
                            res.write(data);
                            res.end();
                        }
                    });
                }
            })
        } else {
            res.writeHead(404, {"Content-Type": "text/html"});
            res.write('<span style="color:red">"' + filename + '"</span> was not found on this server.');
            res.end();
        }
    });

});
server.listen(8080);
