import { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    const saveTodos = localStorage.getItem('todos');
    return saveTodos ? JSON.parse(saveTodos) : [];
  });

  const [inputValue, setInputValue] = useState('');
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;

  const handleAddTodo = () => {
    if (inputValue.trim === '') {
      return;
    }

    const newTodo = {
      id: Date.now(),
      text: inputValue,
      completed: false,
    };

    const newTodos = [...todos, newTodo];
    setTodos(newTodos);
    saveToLocalStorage(newTodos);
    setInputValue('');
  };

  const handleToggle = (id) => {
    const updatedTodos = todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed} : todo));
    setTodos(updatedTodos);
    saveToLocalStorage(updatedTodos);
  };

  const handleDelete = (id) => {
    const filteredTodos = todos.filter(todo => todo.id !== id);     
    setTodos(filteredTodos);
    saveToLocalStorage(filteredTodos)
  };

  const saveToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  return (
    <>
      <div className="todo-container">
        {/* Поле ввода и кнопка */}
        <input
          type="text"
          placeholder="Введите задачу..."
          className="todo-input"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
        />
        <button className="todo-button" onClick={handleAddTodo}>
          Добавить
        </button>
      </div>
      {/* Список задач */}
      <ul className="todo-list">
        {todos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            <span className={todo.completed ? 'completed-text' : ''}>
              {todo.text}
            </span>
            <button
              onClick={() => handleDelete(todo.id)}
              className="delete-button"
            >
              🗑
            </button>
          </li>
        ))}
      </ul>
      {/* Счетчик */}
      <p className='counter'>
        Выполнено: {completed} из {total}
      </p>
    </>
  );
}
