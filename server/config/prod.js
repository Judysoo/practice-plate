//deploy(배포) 후...production->prod
module.exports = {
  mongoURI: process.env.MONGO_URI,
};
//heroku에 저장된 Config Vars 값이랑 같아야↑ 함
