import React, { useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
  useEffect(() => {
    //index에서 받은 데이터 콘솔에 출력
    axios.get('/api/hello').then((res) => console.log(res.data));
  }, []);
  return <div>반가워요! 랜딩페이지입니다.</div>;
};

export default LandingPage;

//Cross-Origin Resource Sharing CORS 정책으로 Proxy 사용으로 해결함.
