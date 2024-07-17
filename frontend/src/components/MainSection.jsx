import { useState } from 'react';
import PropTypes from 'prop-types'

import TodoItem from './TodoItem/TodoItem';
import Footer from './Footer';

const TODO_FILTERS = {
  SHOW_ALL: () => true,
  SHOW_ACTIVE: (todo) => !todo.completed,
  SHOW_COMPLETED: (todo) => todo.completed,
};

const MainSection = ({ todos, actions }) => {
  const [filter, setFilter] = useState('SHOW_ALL');

  const handleClearCompleted = () => {
    actions.clearCompleted();
  };

  const handleShow = (filter) => {
    setFilter(filter);
  };

  const renderToggleAll = (completedCount) => {
    if (todos.length > 0) {
      return (
        <>
          <input
            type="checkbox"
            id="toggle-all"
            className="toggle-all"
            value={completedCount === todos.length}
            onChange={(e) => actions.completeAll(e.target.checked)}
          />

          <label htmlFor="toggle-all" hx-post="/todos/complete-all" hx-target="#todo-list" title="Mark all as complete">Mark all as complete</label>
        </>
      );
    }
  };

  const renderFooter = (completedCount) => {
    const activeCount = todos.length - completedCount;

    if (todos.length) {
      return (
        <Footer
          completedCount={completedCount}
          activeCount={activeCount}
          filter={filter}
          onClearCompleted={handleClearCompleted}
          onShow={handleShow}
        />
      );
    }
  };

  const filteredTodos = todos.filter(TODO_FILTERS[filter]);
  const completedCount = todos.reduce((count, todo) => {
    return todo.completed ? count + 1 : count;
  }, 0);

  return (
    <section className="main">
      {renderToggleAll(completedCount)}
      <ul className="todo-list">
        {filteredTodos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} {...actions} />
        ))}
      </ul>
      {renderFooter(completedCount)}
    </section>
  );
};

MainSection.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired,
};

export default MainSection;
