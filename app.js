const express = require('express');
const parse = require('parse-json');
const app = express();
const fs = require('fs');//파일/폴더 시스템. 디렉토리 생성,읽기,삭제
const spawn = require('child_process').spawn;
app.set('view engine','pug');
app.set('views','./views');
//app.use()에 '/~' 주소?요청?경로 없음=> 모든 요청에서 실행 
app.use(express.urlencoded({extended: false})); //bodyparser
app.use(express.json());//bodyparser. json형식!!으로 데이터 받음.
// req.body (POST정보를 가짐)에 추가
//#######################
/*get은 주소만 있으면 되서 다른 모듈 필요없는데
 POST는 body-parser란 모듈을 사용해서 데이터 받아와야함.
 */

app.use(express.static(__dirname + '/public'));//요청경로 '/~' 안적혀있음
//정적 파일 제공 미들웨어
//npm으로 설치할 필요 x. 이미 내장
//서버에서 a.jpg 찾음 => ./pubic폴더에서 찾음
//폴더 여러개 설정 가능. 첫번째 폴더에서 못찾>다음폴더로
//__dirname : 현재 폴더 경로. 
 
 
//req => 클라이언트의 요청에 대한 정보 담김
//res => 서버에서 클라이언트로 보낼 정보 담김
app.get('/form',function(req,res){//주소=요청경로 
    res.render("form");
    //응답. 설정된 템플릿 엔진을 사용해 views 렌더링
});
//form.pug 코드를 render 해줌, => localhost:3000/form 에서 html(pug)나옴
 
app.post('/form_receive',function(req,res) {
    //서버에서 컴파일하고
    //결과값을 다시 클라이언트(웹페이지)로
    //POST => 데이터 => req.body에 저장됨
    var code = req.body.code;
    var source = code.split(/\r\n|\r\n/).join("\n");
    var file='test.c';
    console.log(code)//다행히 코드는 잘 저장되네

    fs.writeFile(file,source,'utf8',function(error) {
        console.log('write end');
    });
    var compile = spawn('gcc',[file]);
    compile.stdout.on('data',function(data) {
        console.log('stdout: '+data);
    });
    compile.stderr.on('data',function(data){
        console.log(String(data));
    });
    compile.on('close',function(data){
        if(data ==0) {
            var run = spawn('./a.out',[]);    
            run.stdout.on('data',function(output){
                console.log('컴파일 완료');
                var responseData = {'result':'ok','output': output.toString('utf8')};
                res.json(responseData);
            });
            run.stderr.on('data', function (output) {
                console.log(String(output));
            });
            run.on('close', function (output) {
                console.log('stdout: ' + output);
            });
        }
    });
    
});
app.listen(8000,function(){  //서버 연결 

        console.log('[Listening] localhost 63000');

    });