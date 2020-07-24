import React, { useEffect } from 'react';
import axios from 'axios';

const LandingPage = () => {
  useEffect(() => {
    axios.get('/api/hello').then((res) => console.log(res.data));
  }, []);
  return <div>반가워요! 랜딩페이지입니다.</div>;
};

export default LandingPage;
