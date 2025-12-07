import { useState } from 'react';

export default function TodoList() {
  const [todos, setTodos] = useState(() => {
    const saveTodos = localStorage.getItem('todos');
    return saveTodos ? JSON.parse(saveTodos) : [];
  });

  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all'); //'all', 'active', 'completed'
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const total = todos.length;

  const completed = todos.filter(todo => todo.completed).length;

  const handleAddTodo = () => {
    if (inputValue.trim() === '') {
      return;
    }

    const newTodo = {
      // eslint-disable-next-line
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
    const updatedTodos = todos.map(todo => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    setTodos(updatedTodos);
    saveToLocalStorage(updatedTodos);
  };

  const handleDelete = (id) => {
    const filteredTodos = todos.filter(todo => todo.id !== id);
    setTodos(filteredTodos);
    saveToLocalStorage(filteredTodos);
  };

  const saveToLocalStorage = (todos) => {
    localStorage.setItem('todos', JSON.stringify(todos));
  };

  const handleClearCompleted = () => {
    const activeTodos = todos.filter(todo => !todo.completed);
    setTodos(activeTodos);
    saveToLocalStorage(activeTodos);
  };

  const startEditing = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  const handleSaveEdit = (id) => {
    if (editValue.trim() === '') {
      return;
    }
    const updatedTodos = todos.map(todo => (todo.id === id ? { ...todo, text: editValue } : todo));
    setTodos(updatedTodos);
    saveToLocalStorage(updatedTodos);
    setEditingId(null);
    setEditValue('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditValue('');
  };

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
          onKeyDown={e => {
            if (e.key === 'Enter') {
              handleAddTodo();
            }
          }}
        />
        <button className="todo-button" onClick={handleAddTodo}>
          Добавить
        </button>
      </div>
      {/* Список задач */}
      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className="todo-item">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => handleToggle(todo.id)}
            />
            {editingId === todo.id ? (
              <input
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEdit(todo.id);
                  } else if (e.key === 'Escape') {
                    handleCancelEdit();
                  }
                }}
                onBlur={() => handleSaveEdit(todo.id)}
                autoFocus
              />
            ) : (
              <span className={todo.completed ? 'completed-text' : ''}
                onDoubleClick={() => startEditing(todo.id, todo.text)}
              >
                {todo.text}
              </span>
            )}
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
      <div className='filters'>
        <button className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >Все</button>
        <button className={filter === 'active' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('active')}
        >Активные</button>
        <button className={filter === 'completed' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('completed')}
        >Выполненные</button>
      </div>
      <button className='clear-completed'
        onClick={handleClearCompleted}
      >Очистить завершенные</button>
    </>
  );
}
