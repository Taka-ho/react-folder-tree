import React from 'react';
import FolderTree from '../FolderTree/FolderTree';

/* eslint-disable */
const SandBox = () => {
  const treeState = {
    name: 'my-app',
    children: [],
};
const handleFileClick = (file) => {
  console.log('File Clicked:', file);
};
  return (
    <div className='demo-sandbox'>
      <FolderTree
        data={ treeState }
        onNameClick={handleFileClick}
      />
    </div>
  );
};

export default SandBox;
