import React from 'react'
import {MdDone, MdDelete} from "react-icons/md"

import cn from 'classnames'

import './scss/TodoItem.scss'

const TodoItem = ({ item, remove }) => {

  const {id, title, done} = item;

  return (
    <li className='todo-list-item'>
        <div className={cn('check-circle', {active:done})}>
            {done && <MdDone/>} {/*done이 true일때 MdDone이 보임*/}
        </div>
        <span className={cn('text', {finish:done})}>{title}</span>
        <div className="remove" onClick={() => remove(id)}>
            <MdDelete />
        </div>
    </li>
  );
}

export default TodoItem;