// 여기서는 실제로 jsonwebtoken을 가지고 와서 어떻게 사용하는지를 작성할 예정
const userDatabase = require("../database/db") //../경로에서 Database.js를 import
const jwt = require("jsonwebtoken") //우리가 npm으로 설치한 jsonwebtoken모듈을 임포트


//5개 api 함수 정의
const login = (req,res) => {  // 이함수의 작업을 미들웨어라고 보면됨.
    const {email,password} = req.body; // post 요청은 query가 아니라 body를 사용!
    // const userInfo = userDatabase.filter(item => { // filter함수는 userDatabase안에 들어있는 요소들(여기서는 4개요소가 데이터 베이스에 존재)이 item인자로 자동으로 전달됨. 
    //     return item.email === email; // 해당 객체의 emai이 요청 받은 email과 같으면 true반환.
    // })[0]; //filter() 리스트안의 조건에 해당하는 요소들을 반환한다. 하지만 여기서는 중복되는 데이터가 없으므로 하나만 반환,리스트 안의 요소만을 쓰고 싶으므로 [0]을 붙혀줌
    // if(!userInfo){ // 해당 정보가 존재하지 않으면, 에러처리
    //     res.status(403).json("해당 정보가 존재하지 않음.");
    // }
    var sql = `SELECT * FROM userdata WHERE email='${email}'`; 
    userDatabase.query(sql, (err, rows) => { //
        if (err) {
            console.error(err);
            return res.status(500).json("Database query error");
            
        }

        // 쿼리 결과가 비어 있는 경우 처리
        if (rows.length === 0) {
            return res.status(404).json("User not found");
        }
        const userInfo = rows[0]; // 쿼리 결과에서 첫 번째 행을 userInfo로 설정
        //console.log(userInfo);  // 쿼리 결과 로깅

        //console.log(userInfo);
    try{
        //access Token 발급
        const accessToken = jwt.sign({
            id : userInfo.id,
            username : userInfo.username,
            email : userInfo.email,
        },process.env.ACCESS_SECRET,{
            expiresIn : '1m',   
            issuer : 'About Tech'
        }) 
        //sign함수에는 3가지의 인자를 전달받음.
        // 1인자 -> sign함수에 어떤 유저 정보를 담을지 지정
        // 2인자 -> .env파일에서 지정해줬던 accesstoken과 refreshToken의 SECRET을 지정
        // 3인자 -> 해당 토큰이 얼마나 유효기간을 가질지, 발행자는 누구일지에 대한 정보, 위 코드에는 유효기간 1분, 발행자는 About Tech임.
        
        // refresh Token 발급
        const refreshToken = jwt.sign({
            id : userInfo.id,
            username : userInfo.username,
            email : userInfo.email,
        },process.env.REFRESH_SECRET,{
            expiresIn : '24h',   
            issuer : 'About Tech'
        }) 
        // accessToken과 refreshToken 발급완료 -> 해당 토큰을 클라이언트에게 쿠키에 담아서 보내줌.
        //token 전송
        res.cookie("accessToken",accessToken,{
            secure : false, // secure 값은 http사용하면 false ,https사용하면 ture 넣어줌.
            httpOnly : true, // 자바스크립트와 http중에 어디서 접근이 가능할지 지정하는 옵션 -> true 옵션을 주면 자바스크립트에서 쿠키에 접근 못함.
        }) // res객체의 cookie속성을 활용  
        // 첫번째 두번째 인자 -> accessToken이라는 이름에 우리가 발급한 accessToken값을 넘겨줌. 
        // 3번째 인자 -> 쿠키의 속성 값으로 https 와 http의 차이를 명시해줌.
        res.cookie("refreshToken",refreshToken,{
            secure : false, 
            httpOnly : true,
        })
        // 토큰들을 성공적으로 발행했다면 성공했다는 메시지 출력
        res.status(200).json("login success")
    }catch (error){ //error가 발생할 경우
        res.status(500).json(error); //error반환
    }
    
    });
    
    //console.log(userInfo);
    console.log('adfadfadfs');

    //next(); // 다음 코드 줄에 있는 미들웨어로 넘어감.

} 
//get access Token이라는 버튼을 클릭했을때 해당 accessToken을 가지고 사용자를 어떻게 특정할 수 있는지를 확인하는 함수
const accessToken = (req,res) => {
    try{
        console.log('ㅁㅇㅁㅇㅇㄴ');

        const token = req.cookies.accessToken; // 클라이언트가 요청보낸 쿠키안의 토큰을 꺼내서 저장
        const data = jwt.verify(token, process.env.ACCESS_SECRET); //HS256알고리즘(default)으로 accessToken을 decoding하여 데이터를 저장
    
        // const userData = userDatabase.filter(item => {
        //     return item.email === data.email;
        // })[0]; // 동기처리
    
        // 이메일을 기준으로 사용자 정보 조회
        // SELECT * FROM users는 users 테이블에서 모든 컬럼을 선택한다는 것을 의미하고, WHERE email = ?는 이메일 주소가 특정 값과 일치하는 행을 필터링하라는 조건
        //query 메서드의 두 번째 인자 [data.email]는 쿼리에 바인딩될 파라미터들의 배열입니다. 여기서 물음표 ?는 이 위치에 data.email 값이 안전하게 삽입되어 SQL 쿼리를 실행하게 됨.
        console.log('ㅁㅇㅁㅇㅇㄴ');
        var sql = `SELECT * FROM userdata WHERE email = '${data.email}'`
        userDatabase.query(sql,(err,rows)=>{
            if (err) {
                console.error(err);
                return res.status(500).json("Database query error");
            }
            // 쿼리 결과가 비어 있는 경우 처리
            if (rows.length === 0) {
                return res.status(404).json("User not found");
            }
            const userData = rows[0];
            //console.log(userData);
            const { password , ...others} = userData; // 개발자도구 network통신 내용에서 accestoken안에 password가 노출되는 것을 방지하기 위해 password를 가려주는 작업.
            res.status(200).json(others); // password만 제거된 나머지 정보만 전달.
            // res.status(200).json(userData); // 위 작업이 성공했을 경우 클라이언트에게 보내는 status코드는 200 그리고 userData를 json파일로 파싱해서 보냄.
        });
       
    } catch (error){
        res.status(500).json(error);
    }
}

const refreshToken = (req,res) => {
    // accessToken을 갱신.
    try{
        const token = req.cookies.refreshToken; 
        const data = jwt.verify(token,process.env.REFRESH_SECRET) // 토큰을 디코딩 하여 payload데이터만 가져옴
        var sql = `SELECT * FROM userdata WHERE email = '${data.email}'`
        userDatabase.query(sql,(err,rows)=>{
            if (err) {
                console.error(err);
                return res.status(500).json("Database query error");
            }
            // 쿼리 결과가 비어 있는 경우 처리
            if (rows.length === 0) {
                return res.status(404).json("User not found");
            }
            const userData = rows[0];
            console.log(userData);
            const { password , ...others} = userData; // 개발자도구 network통신 내용에서 accestoken안에 password가 노출되는 것을 방지하기 위해 password를 가려주는 작업.
            //res.status(200).json(others); // password만 제거된 나머지 정보만 전달.
            // res.status(200).json(userData); // 위 작업이 성공했을 경우 클라이언트에게 보내는 status코드는 200 그리고 userData를 json파일로 파싱해서 보냄.

            //accessToken 새로 발급
            const accessToken = jwt.sign({
            id : userData.id,
            username : userData.username,
            email : userData.email,
            },process.env.ACCESS_SECRET,{
            expiresIn : '1m',   
            issuer : 'About Tech'
            });
            //token 전송
            res.cookie("accessToken",accessToken,{
                secure : false, // secure 값은 http사용하면 false ,https사용하면 ture 넣어줌.
                httpOnly : true, // 자바스크립트와 http중에 어디서 접근이 가능할지 지정하는 옵션 -> true 옵션을 주면 자바스크립트에서 쿠키에 접근 못함.
            });
            //res.status(200).json("Access Token Recreated");
            return res.status(200).json("others");
            });

    } catch (error){
        res.status(500).json(error);
    }
}
// /login/success 라우팅
const loginSuccess = (req,res) => {
    try{
        //console.log("aaaaa");
        const token = req.cookies.accessToken;
        console.log(token);
        const data = jwt.verify(token,process.env.ACCESS_SECRET); // accessToken을 복호화
        //console.log(data);
        // const userData = userDatabase.filter(item => {
        //     return item.email === data.email;
        // })[0];
        var sql = `SELECT * FROM userdata WHERE email='${data.email}'`; 
        userDatabase.query(sql, (err, rows) => { //
            if (err) {
                console.error(err);
                return res.status(500).json("Database query error");
            }
            // 쿼리 결과가 비어 있는 경우 처리
            if (rows.length === 0) {
                return res.status(404).json("User not found");
            }
            const userData = rows[0]; // 쿼리 결과에서 첫 번째 행을 userInfo로 설정
            //console.log(userInfo);  // 쿼리 결과 로깅
            console.log("lginSuccess");
            console.log(userData);
            res.status(200).json(userData);
        });

      
    }catch(error){
        res.status(500).json(error);
    }
    
}

const logout = (req,res) => {
    // 우리가 가지고 있는 쿠키 객체에 저장되어있는 토큰 값들을 삭제하고 초기화 해주어야.
    try{
        res.cookie('accessToken', ''); // cookie 객체에 들어있는 accessToken값을 빈값으로 지정
        res.status(200).json("Logout Success");
    } catch (error) {
        res.status(500).json(error);
    }
}

const signup = (req,res) => {
    try{
        const username = req.body.username;
        const email = req.body.email;
        const id = req.body.id;
        const password = req.body.password;
        console.log(username);
        var sql = `INSERT INTO userdata(name,userID,email,password,regdate) values('${username}','${id}','${email}','${password}',now())`
        userDatabase.query(sql,(err,result)=>{
        if(err) throw error;
        console.log(result);
        res.status(200).json("SignUp Success");
        //res.send("<script> alert('문의사항이 등록되었습니다.'); location.href='/'; </script>")
        //res.render('alert');
    })

    } catch(error){
        res.status(500).json(error);
    }
}


//회원가입 정보 입력
exports.insert = ( data, cb ) => {
    var sql = `INSERT INTO user VALUES ('${data.id}', '${data.name}', '${data.email}', '${data.phoneNumber}','${data.password}');`;

    cnn.query(sql, (err, rows) => {
        if ( err ) throw err;
        cb( data.id );
    });
}

//로그인 정보 읽기
exports.select = ( id, password, cb ) => {
    var sql = `SELECT * FROM user WHERE id='${id}' limit 1`;

    cnn.query(sql, (err, rows) => {
        if ( err ) throw err;
        cb( rows[0] );
    });
}

//회원 정보
exports.get_user = (id, cb) => {
    let sql = `SELECT * FROM user WHERE id='${id}' limit 1;`;
  
    cnn.query( sql, function(err, rows){
        if ( err ) throw err;
        cb(rows);
    });
}

//회원 정보 수정
exports.update = ( data,  cb ) => {
    var sql = `UPDATE user SET name='${data.name}', email='${data.email}', phoneNumber='${data.phoneNumber}', password='${data.password}' WHERE id='${data.id}';`;

    cnn.query(sql, (err, rows) => {
        if ( err ) throw err;
        cb( rows );
    });
}

//회원 탈퇴
exports.delete = ( id,  cb ) => {
    var sql = `DELETE FROM user WHERE id='${id}';`;
  
    cnn.query(sql, (err, rows) => {
        if ( err ) throw err;
        cb( rows );
    });
}

 
//위에 작성된 함수들을 잘 모듈화 해서 반환해주어야함(export해주어야함)
module.exports = {
    login,
    accessToken,
    refreshToken,
    loginSuccess,
    logout,
    signup
}