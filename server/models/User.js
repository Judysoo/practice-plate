const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10; //해시를 계산하는데 필요한 시간(?) 1 높아지면 두 배가 높아진다고... 평균적으로 10을 쓰는 듯
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  //userSchema 생성
  //mongoose 라이브러리가 DB문서를 JS객체처럼 사용할 수 있게 해줌
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String, //공백 없애주는 기능
    trim: true, //중복 email 불가
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number, //Number 1은 관리자
    default: 0,
  },
  image: String,
  token: {
    type: String, //권한(토큰) 부여
  },
  tokenExp: {
    type: Number, //토큰 유효기간
  },
});
//pre: mongoose에서 가져온 Method, model에 저장하기 '전에' 뭔가(funtion)를 합니다.
//소금치기~ adding salt. salt라고 하는 무작위 문자열을 조합해서 비밀번호를 해싱함.
userSchema.pre("save", function (next) {
  const user = this; //화살표 함수는 this 바인딩 안해서 못쓰지요~
  //this == userSchema
  if (user.isModified("password")) {
    //user에서 password가 수정될 때만 이하 메소드 발동
    bcrypt.genSalt(saltRounds, function (err, salt) {
      //adding salt
      if (err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, function (err, hash) {
        //hasing
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  } else {
    //PW수정이 되지 않으면 다음으로
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 124755  암호화된PW $2b$10$6DK1OPKSHPqTb7wZbGInlupcEFrqVmioMNaugekx5hskJlfQLWjlu
  //입력받은 PW를 암호화 후 암호회된PW들 중에서 일치하는 것 찾기(복호화 불가)
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch); //에러값 null, isMatch만 전달
  });
};

userSchema.methods.generateToken = function (cb) {
  const user = this;
  // jsonwebtoken을 이용해서 token을 생성하기
  const token = jwt.sign(user._id.toHexString(), "secretToken");
  //user._id + 'somethingToken' = this.token
  //->
  //'somethingToken' -> user._id
  //토큰으로 유저를 알 수 있다.

  user.token = token;
  //user 내의 token 스키마에 const token에서 받은 토큰 넣어주기
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
    //에러값 null, user만 index.js user.generateToken으로 전달
  });
};

userSchema.statics.findByToken = function (token, cb) {
  const user = this;

  //가져온 토큰 복호화(decode)
  jwt.verify(token, "secretToken", function (err, decoded) {
    //유저 아이디를 이용해서 유저를 찾은 다음에
    //클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    //이떄 _id는 MongoDB에서 자동으로 만들어주는 Objectid

    //복호화해서 나온 ID와 token를 가지고 findOne메소드를 사용하여 DB에서 찾아봅시다
    user.findOne({ _id: decoded, token: token }, function (err, user) {
      if (err) {
        return cb(err);
      } else {
        cb(null, user);
      }
    });
  });
};

const User = mongoose.model("User", userSchema);
//userSchema를 모델로 감싸주기(모델이름,해당스키마)

module.exports = { User };
//이 모델을 다른 곳에서도 쓸 수 있도록 export함
