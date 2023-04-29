import React, { useState, useRef } from 'react';
import { RiCloseCircleLine } from 'react-icons/ri';
import { TiEdit } from 'react-icons/ti';

function TodoForm(props) {
  const [input, setInput] = useState('');

  const inputRef = useRef(null);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    props.onSubmit({
      id: Math.floor(Math.random() * 10000),
      text: input,
    });

    setInput('');
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="What needs to be done?"
        value={input}
        name="text"
        classname="todo-input"
        onChange={handleChange}
        ref={inputRef}
      />
      <button className="todo-button">Add</button>
    </form>
  );
}

function Todo({ todos, completeTodo, removeTodo, updateTodo }) {
  return todos.map((todo, index) => (
    <div
      className={todo.isComplete ? 'todo-row complete' : 'todo-row'}
      key={index}
    >
      <div key={todo.id} onClick={() => completeTodo(todo.id)}>
        {todo.text}
      </div>
      <div className="icons">
        <RiCloseCircleLine
          onClick={() => removeTodo(todo.id)}
          className="delete-icon"
        />
      </div>
    </div>
  ));
}

function TodoList() {
  const [todos, setTodos] = useState([]);

  const addTodo = (todo) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    const newTodos = [todo, ...todos];

    setTodos(newTodos);

    fetch('https://assets.breatheco.de/apis/fake/todos/user/jpineda', {
      method: 'PUT',
      body: JSON.stringify(newTodos),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error));
  };

  const removeTodo = (id) => {
    const removeArr = [...todos].filter((todo) => todo.id !== id);

    setTodos(removeArr);

    fetch('https://assets.breatheco.de/apis/fake/todos/user/jpineda', {
      method: 'PUT',
      body: JSON.stringify(removeArr),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.log(error));
  };

  const completeTodo = (id) => {
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

const deleteAll = () => {
  setTodos([]);

  fetch('https://assets.breatheco.de/apis/fake/todos/user/jpineda', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.log(error));
};

return (
  <div>
    <h1>Todo List - </h1>
    <TodoForm onSubmit={addTodo} />
    <Todo
      todos={todos}
      completeTodo={completeTodo}
      removeTodo={removeTodo}
    />
    <button onClick={deleteAll}>Clear All</button>
  </div>
);
};
export default TodoList;
