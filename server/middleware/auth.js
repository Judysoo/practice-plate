const { User } = require("../models/User");

//auth 미들웨어

//Authorization 권한부여, authentication인증
//1. Client의 쿠키에 담겨져있는 토큰을 Server로 가져와서 복호화
//2. 토큰을 복호화해서 나온 UserID로 DB User Collection에서 유저 찾기
//3. Client의 토큰과 Server(DB)에 있는 토큰이 일치하는지 확인

//index.js app.get('api/users/auth', auth ...) req, res 전에 인증처리를 하는 곳
let auth = (req, res, next) => {
  //Client 쿠키에서 토큰 가져오기
  //cookieparser 사용 user.generateToken에서 쿠키를 담았던 x_auth 가져오기
  let token = req.cookies.x_auth;

  //토큰을 복호화한 후 DB에서 유저 찾기
  User.findByToken(token, (err, user) => {
    if (err) {
      throw err; //유저가 없으면 인증 X
    } else {
      if (!user) {
        return res.json({ isAuth: false, error: ture });
      } else {
        req.token = token; //토큰과 유저 정보를 request에 넣어줌으로써 호출이 쉬워짐
        req.user = user; //재사용성
        next(); //유저가 있으면 인증 O 정보 담아주고 next();
      }
    }
  });
};

module.exports = { auth };
