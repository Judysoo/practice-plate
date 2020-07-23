if (process.env.NODE_ENV === "production") {
  module.exports = require("./prod");
} else {
  module.exports = require("./dev");
}

//환경변수가 production이면 prod 가져오기. 아니면(develop) dev 가져오기
//기존에 DB주소가 있던 부분을 대체함
