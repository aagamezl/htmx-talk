import React, { useState } from 'react';
import Header from './Header';
import MainSection from './MainSection';
import dataService from '../services/dataService';


const Todos = ({ tasks }) => {
  const [todos, setTodos] = useState(tasks);

  const addTodo = async (text) => {
    const newTodo = await dataService.create({
      text,
      completed: false
    });

    setTodos([newTodo, ...todos]);
  };

  const deleteTodo = async (id) => {
    await dataService.delete(id);

    // const updatedTodos = await dataService.getAll();
    const updatedTodos = todos.filter((todo) => todo.id !== id);

    setTodos(updatedTodos);
  };

  const editTodo = async (id, text) => {
    const editedTask = await dataService.update(id, { text })

    const updatedTodos = tasks.map((task) => {
      // if this task has the same ID as the edited task
      if (id === task.id) {
        return editedTask;
      }

      return task;
    });

    setTodos(updatedTodos);
  };

  const completeTodo = async (id, completed) => {
    const editedTodo = await dataService.update(id, { completed })

    const updatedTodos = todos.map((todo) => {
      // if this todo has the same ID as the edited task
      if (id === todo.id) {
        return editedTodo;
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  const completeAll = (completed) => {
    // const areAllMarked = todos.some((todo) => todo.completed);

    // const updatedTodos = todos.map((todo) => ({
    //   ...todo,
    //   completed: !areAllMarked,
    // }));

    const updatedTodos = todos.map((todo) => ({
      ...todo,
      completed: todo.completed !== completed ? completed : todo.completed,
    }));

    setTodos(updatedTodos);
  };

  const clearCompleted = () => {
    const updatedTodos = todos.filter((todo) => !todo.completed);
    setTodos(updatedTodos);
  };

  const actions = {
    addTodo,
    deleteTodo,
    editTodo,
    completeTodo,
    completeAll,
    clearCompleted,
  };

  return (
    <div>
      <Header addTodo={actions.addTodo} />
      <MainSection todos={todos} actions={actions} />
    </div>
  );
};

export default Todos;
