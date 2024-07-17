import { useState } from 'react';
import PropTypes from 'prop-types'
import classnames from 'classnames';

const TodoTextInput = (props) => {
  const [text, setText] = useState(props.text || '');

  const handleSubmit = (e) => {
    const trimmedText = e.target.value.trim();
    if (e.which === 13) {
      props.onSave(trimmedText);
      if (props.newTodo) {
        setText('');
      }
    }
  };

  const handleChange = (e) => setText(e.target.value);

  const handleBlur = (e) => {
    if (!props.newTodo) {
      props.onSave(e.target.value);
    }
  };

  return (
    <input
      className={classnames({
        edit: props.editing,
        'new-todo': props.newTodo,
      })}
      type="text"
      placeholder={props.placeholder}
      autoFocus={true}
      value={text}
      onBlur={handleBlur}
      onChange={handleChange}
      onKeyDown={handleSubmit}
    />
  );
};

TodoTextInput.propTypes = {
  onSave: PropTypes.func.isRequired,
  text: PropTypes.string,
  placeholder: PropTypes.string,
  editing: PropTypes.bool,
  newTodo: PropTypes.bool,
};

export default TodoTextInput;
