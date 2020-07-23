const express = require("express"); //express 모듈 가져오기
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const { auth } = require("./middleware/auth");
const { User } = require("./models/User");

//application/x-www-form-urlencoded  이러한 데이터를 분석해서 가져올 수 있게 함
app.use(bodyParser.urlencoded({ extended: true }));

//application/json
app.use(bodyParser.json());
//쿠키굽는모듈
app.use(cookieParser());

const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    //원래 DB주소가 있던 자리. 보안성을 위해 dev.js에 DB주소를 저장하고 그 참조주소만 갖고 왔음
    //dev.js는 .gitignore에 적어서 github에 올라가지 않도록 처리
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!~~ "));
//request, response 요청, 응답

app.get("/api/hello", (req, res) => res.send("Hello World!~~ "));

app.post("/api/users/register", (req, res) => {
  //register Router. 회원가입할 때 필요한 정보들을 client에서 가져오면 DB에 넣어준다.
  const user = new User(req.body);
  //bodyparser를 이용해 클라이언트에게 들어가는 정보 받아줌
  //User라는 모델에 정보(req.body)들을 넣어주고
  //비밀번호는 암호화한 후 DB에 save
  user.save((err, userInfo) => {
    //MongeDB 메소드
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

app.post("/api/users/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    //DB에서 해당항목 찾아주는 메소드. MongoDB제공
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "등록되지 않은 E-MAIL입니다.",
      });
    }

    //요청한 이메일이 있다면 PW가 일치하는지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다.",
        });

      //전부 확인 후 그 유저를 위한 token 생성
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        //토큰을 어디에 저장할까용... 브라우저 내의 쿠키 or LocalStorage & Session...

        //localStorage
        //장점 쓰기 쉽고 만들기 쉽다
        //단점 악성 스크립트를 심어서 토큰을 탈취하는 공격 취약 XSS

        //cookie
        //장점 httpOnly속성을 활성화하면 JS를 통해 쿠키 조회 불가, 악성 스크립트로부터 안전
        //단점 사용자 모르게 API요청을 하는 CSRF에 취약 but CSRF토큰을 쓰거나 Referer검증으로 막을 수 있음

        //그러므로 쿠키를 구워봅시다
        res
          .cookie("x_auth", user.token) //쿠키 이름, 들어가는 것(토큰)
          .status(200)
          .json({ loginSuccess: true, userId: user._id });
      });
    });
  });
});

// role 1 어드민    role 2 특정 부서 어드민
// role 0 -> 일반유저   role 0이 아니면  관리자
app.get("/api/users/auth", auth, (req, res) => {
  //여기 까지 미들웨어를 통과해 왔다는 얘기는  Authentication 이 True 라는 말.
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

app.get("/api/users/logout", auth, (req, res) => {
  // console.log('req.user', req.user)
  User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

const port = 5000;

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
