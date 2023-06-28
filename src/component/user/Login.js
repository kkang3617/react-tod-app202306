import React, { useContext, useEffect, useState } from 'react'
import {Button, Container, Grid,
  TextField, Typography, Link} from "@mui/material";

import { useNavigate } from 'react-router-dom';

import { API_BASE_URL as BASE, USER } from '../../config/host-config';
import AuthContext from '../../util/AuthContext';
import CustomSnackBar from '../layout/CustomSnackBar';

const Login = () => {

  const redirection = useNavigate();

  //AuthContext에서 onLogin 함수를 가져온다.
  const {onLogin, isLoggedIn} = useContext(AuthContext);

  const [open, setOpen] = useState(false); // 초기값 false

  useEffect(() => {
    if (isLoggedIn) {
      setOpen(true);
      setTimeout(() => {
        redirection('/'); //홈화면 이동
      }, 3000);
    }
  }, [isLoggedIn, redirection]); // []안 변화가 있을 때 랜더링

  const REQUEST_URL = BASE + USER + '/signin';
  
  
  //서버에 비동기 로그인 요청
  //함수 앞에 async를 붙이면 해당 함수는 프로미스 객체를 바로 리턴한다.
  const fetchLogin = async() => {
    //사용자가 입력한 이메일, 비밀번호 입력 태그 얻어오기
    const $email = document.getElementById('email');
    const $password = document.getElementById('password');
    
    //await는 async로 선언된 함수에서만 사용이 가능하다.
    //await는 프로미스 객체가 처리될 때까지 기다린다.
    //프로미스 객체의 반환값을 바로 활용할 수 있게 도와준다.
    //then()을 활용하는 것보다 가독성이 좋고 쓰기도 쉽다.
    const res = await fetch(REQUEST_URL, {
      method: 'POST',
      headers: {'content-type' : 'application/json'},
      body: JSON.stringify({
        email: $email.value,
        password: $password.value
      })

    });

    if (res.status === 400) {
      const text = await res.text();
      alert(text);
      return;
    }
    
    const { token, userName, email, role} = await res.json();
    // console.log(json);
    
    //json에 담기 인증정보를 클라이언트에 보관
    

    //Context API를 사용하여 로그인 상태를 업데이트 한다.
    onLogin(token, userName, role);

    //홈으로 리다이렉트
    redirection('/');




  }
    // fetch(REQUEST_URL, {
    //   method: 'POST',
    //   headers: {'content-type' : 'application/json'},
    //   body: JSON.stringify({
    //     email: $email.value,
    //     password: $password.value

    //   })

    // })
    // .then(res => {
    //     if(res.status===400) {
    //       return res.text();
    //     }
    //     return res.json();
    // })
    // .then(result => {
    //   if(typeof result === 'string') {
    //     alert(result);
    //     return;
    //   }
    //   console.log(result);
    // })
  

  //로그인 요청 핸들러
  const loginHandler = e => {
    e.preventDefault();

    

    //서버에 로그인 요청 전송
    fetchLogin();

  }


  return (
    <>
      {!isLoggedIn &&  // 로그인 중이라면 뒤쪽 코드 안보임.
      <Container component="main" maxWidth="xs" style={{ margin: "200px auto" }}>
          <Grid container spacing={2}>
              <Grid item xs={12}>
                  <Typography component="h1" variant="h5">
                      로그인
                  </Typography>
              </Grid>
          </Grid>
          <form noValidate onSubmit={loginHandler}>
              <Grid container spacing={2}>
                  <Grid item xs={12}>
                      <TextField
                          variant="outlined"
                          required
                          fullWidth
                          id="email"
                          label="email address"
                          name="email"
                          autoComplete="email"
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <TextField
                          variant="outlined"
                          required
                          fullWidth
                          name="password"
                          label="on your password"
                          type="password"
                          id="password"
                          autoComplete="current-password"
                      />
                  </Grid>
                  <Grid item xs={12}>
                      <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          color="primary"
                      >
                          로그인
                      </Button>
                  </Grid>
              </Grid>
          </form>
      </Container>
      }
      <CustomSnackBar
        open={open}
      />
    </>
  );
}

export default Login