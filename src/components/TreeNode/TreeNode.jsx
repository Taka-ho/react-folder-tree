import React, {
  useContext,
  useState,
  useEffect,
} from 'react';
import PropTypes from 'prop-types';
import {
  AiFillCaretRight,
  AiFillCaretDown,
  AiOutlineFolder,
  AiOutlineFolderOpen,
  AiOutlineFile,
} from 'react-icons/ai';

import ConfigContext from '../FolderTree/context';
import EditableName from '../EditableName/EditableName';
//import AddFolder from '../AddFolder/AddFolder';
import {
  iconContainerClassName,
  iconClassName,
  getDefaultIcon,
} from '../../utils/iconUtils';


const TreeNode = ({
  path,
  name,
  checked,
  isOpen,
  children,
  ...restData
}) => {
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });
  const nodeData = {
    path, name, checked, isOpen, ...restData,
  };

  const {
    handleRename,
    handleDelete,
    handleAddNode,
    handleToggleOpen,

    iconComponents,
    indentPixels,
  } = useContext(ConfigContext);

  const isFolder = !!children;

  const treeNodeStyle = {
    marginLeft: path.length * indentPixels,
  };

  const [isSelected, setIsSelected] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const {
    FileIcon = getDefaultIcon(AiOutlineFile),
    FolderIcon = getDefaultIcon(AiOutlineFolder),
    FolderOpenIcon = getDefaultIcon(AiOutlineFolderOpen),
    CaretDownIcon = getDefaultIcon(AiFillCaretDown),
    CaretRightIcon = getDefaultIcon(AiFillCaretRight),
  } = iconComponents;

  let TypeIcon = FileIcon;
  let TypeIconType = 'FileIcon';
  if (isFolder) {
    TypeIcon = isOpen
      ? FolderOpenIcon
      : FolderIcon;

    TypeIconType = isOpen
      ? 'FolderOpenIcon'
      : 'FolderIcon';
  }

    // ローカルストレージからデータを読み込む関数
    const loadFromLocalStorage = (key) => {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    };
  
    // ローカルストレージにデータを保存する関数
    const saveToLocalStorage = (key, data) => {
      localStorage.setItem(key, JSON.stringify(data));
    };
  
    // ファイルまたはフォルダの名前が変更されたときにローカルストレージを更新する関数
    const updateLocalStorage = (updatedName) => {
      const storedData = loadFromLocalStorage('treeData') || {};
      storedData[path.join('_')] = updatedName;
      saveToLocalStorage('treeData', storedData);
    };
  
    // コンポーネントがマウントされたときにローカルストレージからデータを読み込む
    useEffect(() => {
      const storedData = loadFromLocalStorage('treeData');
      if (storedData && storedData[path.join('_')]) {
        handleRename(path, storedData[path.join('_')]);
      }
    }, []);

//この2つの関数がフォルダの開閉を担っている
  const openMe = () => handleToggleOpen(path, true);
  const closeMe = () => handleToggleOpen(path, false);

  const handleContextMenu = (e) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY });

    // コンテキストメニューが表示されるときにドキュメント全体で一度だけクリックを監視
    document.addEventListener('click', handleDocumentClickOnce, { once: true });
  };

  const handleDocumentClickOnce = () => {
    // ドキュメントがクリックされたらコンテキストメニューを閉じる
    setContextMenu({ visible: false, x: 0, y: 0 });

    // ドキュメント全体でのクリック監視を解除
    document.removeEventListener('click', handleDocumentClickOnce);
  };

  const deleteMe = (path) => {
    const key = path.join('_');
    localStorage.removeItem(key);
    handleDelete(path);
  };
  

  const editMe = () => {
    setIsEditing(true);
    setIsSelected(false);
  };
  const onNameChange = (newName) => {
    handleRename(path, newName);
    setIsEditing(false);
    updateLocalStorage(newName);
  };

  const contextMenuContent = contextMenu.visible && (
    <div
      style={{
        position: 'absolute',
        top: contextMenu.y,
        left: contextMenu.x,
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        padding: '4px',
      }}
    >
      {isFolder ? (
        <div>
          <a className='contextMenu' onClick={ editMe }>名前の変更</a><br />
          <a className='contextMenu' onClick={() => deleteMe(path)}>削除する</a><br />
          <a className='contextMenu' onClick={() => handleAddNode(path, false)}>ファイルを追加する</a><br />
          <a className='contextMenu' onClick={() => handleAddNode(path, true)}>フォルダの追加</a><br />
        </div>
      ) : (
        <div>
          <a className='contextMenu' onClick={ editMe }>名前の変更</a><br />
          <a className='contextMenu' onClick={() => deleteMe(path)}>削除する</a>
        </div>
      )}
    </div>
  );

  const handleElementClick = () => {
    if (isFolder) {
      isFolder && isOpen ? closeMe() : openMe();
    }

    onNameClick && onNameClick(nodeData);
  };

  const folderCaret = (
    <span className={iconContainerClassName('caretContainer')}>
      {isOpen ? (
        <CaretDownIcon
          className={iconClassName('CaretDownIcon')}
          onClick={closeMe}
          nodeData={nodeData}
        />
      ) : (
        <CaretRightIcon
          className={iconClassName('CaretRightIcon')}
          onClick={openMe}
          nodeData={nodeData}
        />
      )}
    </span>
  );

  return (
    <>
      <div className="TreeNode" style={treeNodeStyle}>
        {isFolder && folderCaret}

        <span className={iconContainerClassName('typeIconContainer')}>
          <TypeIcon
            className={iconClassName(TypeIconType)}
            onClick={handleElementClick}
            nodeData={nodeData}
          />
        </span>

        <span
          className={iconContainerClassName('editableNameContainer')}
          onClick={handleElementClick}
          onContextMenu={handleContextMenu}
        >
          <EditableName
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            onNameChange={onNameChange}
            nodeData={nodeData}
          />
        </span>
        {isSelected && TreeNodeToolBar}
      </div>

      {contextMenuContent}

      {isFolder &&
        isOpen &&
        children.map((data, idx) => (
          <TreeNode key={data._id} path={[...path, idx]} {...data} />
        ))}
    </>
  );
};

TreeNode.propTypes = {
  path: PropTypes.array.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.number.isRequired,
  isOpen: PropTypes.bool,
  children: PropTypes.array,
};

export default TreeNode;
