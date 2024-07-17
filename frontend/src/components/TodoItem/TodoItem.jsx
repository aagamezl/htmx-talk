import { useState } from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';

import './TodoItem.css'

import TodoTextInput from '../TodoTextInput';
import dataService from '../../services/dataService';

const TodoItem = ({ todo, editTodo, deleteTodo, completeTodo }) => {
  const [editing, setEditing] = useState(false);
  const [task, setTask] = useState(todo);

  const handleDoubleClick = async () => {
    const taskToEdit = await dataService.get(todo.id)

    setTask(taskToEdit)
    setEditing(true);
  };

  const handleSave = (id, text) => {
    if (text.length === 0) {
      deleteTodo(id);
    } else {
      editTodo(id, text);
    }

    setEditing(false);
  };

  let element;
  if (editing) {
    element = (
      <TodoTextInput
        text={task.text}
        editing={editing}
        onSave={(text) => handleSave(task.id, text)}
      />
    );
  } else {
    element = (
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => completeTodo(todo.id, !todo.completed)}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.text}</label>
        <button className="destroy" onClick={() => deleteTodo(todo.id)} />
      </div>
    );
  }

  return (
    <li className={classnames({
      completed: todo.completed,
      editing: editing,
    })}>
      {element}
    </li>
  );
};

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  editTodo: PropTypes.func.isRequired,
  deleteTodo: PropTypes.func.isRequired,
  completeTodo: PropTypes.func.isRequired,
};

export default TodoItem;
