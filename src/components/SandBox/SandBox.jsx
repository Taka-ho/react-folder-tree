import React from 'react';
import FolderTree, { testData } from '../FolderTree/FolderTree';

/* eslint-disable */
const SandBox = () => {
  const treeState = {
    name: 'my-app',
    children: [],
};
  return (
    <div className='demo-sandbox'>
      <FolderTree
        data={ treeState }
      />
    </div>
  );
};

export default SandBox;
