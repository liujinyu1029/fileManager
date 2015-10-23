var fs = require('fs');
var http = require('http');
var path = require('path');
var server = http.createServer(function(req,res){
    res.writeHead(200,{"Content-type":"text/html;charset=utf-8"});//����ͷ����Ϣ
    var url = req.url;//��ȡ���ʵ�url
    console.log(url);
    var pro = process.cwd();//��ȡ��ǰ�������·��
    var msg = "";//����ַ���
    var urlParam;
    if(url == '/'){
        url = '';
    }
    urlParam = decodeURIComponent( pro + url );//ת��
    if(fs.existsSync(urlParam)){//�ж��ļ��Ƿ����
        fs.stat(urlParam,function(err,stats){//������ڣ����ж��ļ�״̬���ļ��л����ļ�
            if(stats.isFile()){//������ļ�������ļ��������
                fs.readFile(urlParam,'utf-8',function(err,data){
                    if(err){
                        res.end('��ȡ����');
                    }else{
                        res.end(data + "<br><a href='/'>���ظ�Ŀ¼</a>");
                    }
                })
            }else if(stats.isDirectory()){//������ļ��У����ȡ�ļ���Ŀ¼
                fs.readdir(urlParam,function(err,arr){
                    if(err){
                        res.end('��ȡ�ļ�����');
                    }else{
                        msg += "<ul>";
                        arr.forEach(function(a,b){
                            msg += "<li><a href=" + url + '/' + a + ">" + a + "</a></li>";
                        });
                        msg += "<li><a href='/' style='color:darkred'>���ظ�Ŀ¼</a></li>";
                        msg += "</ul>";
                    }
                    res.end(msg);
                })
            }
        });
    }else{
        msg += "����ʵ��ļ�������<br><a href='/'>���ظ�Ŀ¼</a>";
        res.end(msg);
    };
}).listen('8080','localhost');