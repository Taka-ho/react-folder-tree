import React, { useState } from 'react';
import PropTypes from 'prop-types';

const EditableName = ({
  isEditing,
  setIsEditing,
  onNameChange,
  nodeData,
}) => {
  const { name } = nodeData;
  const [inputVal, setInputVal] = useState(name);
  const onInputChange = e => setInputVal(e.target.value);
  const handleNameChange = () => {
    onNameChange(inputVal);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleNameChange();
    }
  };

  const editingName = (
    <span className='editingName'>
      <input
        type="text"
        value={ inputVal }
        onChange={ onInputChange }
        onKeyDown={ handleKeyDown }
      />
    </span>
  );

  const displayName = (
    <span className='displayName'>
      { name }
    </span>
  );

  return (
    <span className='EditableName'>
      { isEditing ? editingName : displayName }
    </span>
  );
};

EditableName.propTypes = {
  isEditing: PropTypes.bool.isRequired,
  setIsEditing: PropTypes.func.isRequired,
  onNameChange: PropTypes.func.isRequired,
  nodeData: PropTypes.object.isRequired,
};

export default EditableName;
