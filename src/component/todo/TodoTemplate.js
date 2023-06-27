import React, { useEffect, useState } from 'react'
import TodoHeader from './TodoHeader';
import TodoMain from './TodoMain';
import TodoInput from './TodoInput';
import { useNavigate } from 'react-router-dom';
import { Spinner } from 'reactstrap';

import './scss/TodoTemplate.scss';

import { API_BASE_URL as BASE, TODO } from '../../config/host-config';
import { getLoginUserInfo } from '../../util/login-utils';

const TodoTemplate = () => {

  //로딩 상태값 관리
  const [loading, setLoading] = useState(true);

  const redirection = useNavigate();

  // 로그인 인증 토큰 얻어오기
  const { token } = getLoginUserInfo();

  // 요청 헤더 설정
  const requestHeader = {
    'content-type' : 'application/json',
    'Authorization' : 'Bearer ' + token // 오류!! 한칸띄워야함!!!!!!!
  };

  // 서버에 할일 목록(json)을 요청(fetch)해서 받아와야 함.
  const API_BASE_URL = BASE + TODO; //'http://localhost:8181/api/todos';
  

  //todos 배열을 상태 관리
  const [todos, setTodos] = useState([]);

  // id 값 시퀀스 생성함수 
  //const makeNewId= () => {
  //  if(todos.length === 0)return 1;
  //  return todos[todos.length - 1 ].id + 1;
  //}


  // todoInput에게 todoText를 받아오는 함수
  // 자식 컴포넌트가 부모 컴포넌트에게 데이터를 전달할 때는
  // props 사용이 불가능
  // 부모 컴포넌트에서 함수를 선언(매개변수 꼭 선언!) -> props로 함수를 전달.
  // 자식 컴포넌트에서 전달받은 함수를 호출하면서 매개값으로 데이터를 전달.
  const addTodo = todoText => {
    // console.log('할 일 정보: ', todoText);

    const newTodo = {
      title: todoText
    };

    // todos.push(newTodo); (x) -> useState를 사용해서 안됨!!!

    //리액트의 상태변수는 무조건 setter를 통해서만
    //상태값을 변경해야 랜더링에 적용된다.
    //다만, 상태변수가 불변성(immutable)을 가지기 때문에
    //기존 상태에서 변경은 불가능하고,
    //새로운 상태를 만들어서 변경해야 한다.
    // const copyTodos = todos.slice();
    // copyTodos.push(newTodo);
    // setTodos(todos.concat([newTodo])); //두 배열을 합침

    fetch(API_BASE_URL, {
      method : 'POST',
      headers : requestHeader,//{'content-type' : 'application/json'},
      body : JSON.stringify(newTodo)
    })
    .then(res => res.json())
    .then(json => {
      setTodos(json.todos);

    });

  }

  // 할 일 삭제 처리 함수
  const removeTodo = id => {
    // console.log(`삭제대상 id: ${id}`);
    
    // 주어진 배열의 값들을 순회하여 조건에 맞는 요소들만 모아서
    // 새로운 배열로 리턴해 주는 함수.
    // setTodos(todos.filter(todo => todo.id !== id));
    // id= 1 , 2, 3, 4 가 있고 
    // 삭제 항목은 id=3이라 가정할때 id=1,2,4 (true) 가 새 배열로 리턴.

    fetch(`${API_BASE_URL}/${id}`, {
      method : 'DELETE',
      headers : requestHeader
    })
    .then(res => res.json())
    .then(json => {
      setTodos(json.todos);
      
    });
    
  };

  // 할 일 체크 처리 함수
  const checkTodo = (id, done) => {

    fetch(API_BASE_URL, {
      method: 'PUT',
      headers: requestHeader,//{'content-type' : 'application/json'}, //application/json 타입 지정
      body : JSON.stringify({ //바디에 json데이터 변환해서 보냄.
        'done' : !done,   // body 안의 데이터
        'id' : id
      })
    })
    .then(res => res.json())
    .then(json => setTodos(json.todos));

    // console.log(`체크한 Todo id: ${id}`);
    
    // const copyTodos = [...todos];
    // for(let cTodo of copyTodos) {
    //   if(cTodo.id === id) {
    //     cTodo.done = !cTodo.done;
    //   }
    // }
    
    // setTodos(copyTodos);

    

  }

  //체크가 안 된 할 일의 개수 카운트 하기
  const countRestTodo = () => todos.filter(todo => !todo.done).length; 
  
  // 새로운 배열을 받음 !todo.done 의미 할일 체크 x
    


  //랜더링
  useEffect(() => {
    
    //페이지가 렌더링 됨과 동시에 할 일 목록을 요청해서 뿌려 주겠습니다.
    fetch(API_BASE_URL, {
      method: 'GET',
      headers: requestHeader
    })
    .then(res => {
      if(res.status === 200) return res.json();
      else if(res.status === 403) {
        alert('로그인이 필요한 서비스 입니다.');
        redirection('/login');
        return;
      } else {
        alert('관리자에게 문의하세요!');
      }
      return;
      })
      .then(json => {
        // console.log(json.todos);

        //fetch를 통해 받아온 데이터를 상태 변수에 할당.
        if(json) setTodos(json.todos);  //json 데이터가 있으면 setTodos실행
      });
        //로딩 완료 처리
        setLoading(false);

  }, []); //[]배열에 변화가 있을 때~

    // 로딩이 끝난 후 보여줄 컴포넌트
    const loadEndedPage = (
      <div className='TodoTemplate'>
        <TodoHeader count={countRestTodo} />
          <TodoMain 
            todoList={todos} 
            remove={removeTodo} 
            check={checkTodo} 
          />
        <TodoInput addTodo={addTodo} />
      </div>
    );
  
    // 로딩 중일 때 보여줄 컴포넌트
    const loadingPage = (
      <div className='loading'>
        <Spinner color='danger'>
          loading...
        </Spinner>
      </div>
    );
  
  
    return (
        <>
          { loading ? loadingPage : loadEndedPage }
        </>
    );
  
  }
  
  export default TodoTemplate;