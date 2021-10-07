import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import { Tree } from 'antd';
const treeData = [
  {
    title: 'TITLE 1',
    key: 1,
    children: [
      {
        title: 'TITLE 2',
        key: 2,
        disabled: true,
        children: [
          {
            title: 'TITLE 3',
            key: 3,
            disableCheckbox: true,
          },
          {
            title: 'TITLE 4',
            key: 4,
          },
        ],
      },
      {
        title: 'TITLE 5',
        key: 5,
        children: [
          {
            title: (
              <span
                style={{
                  color: '#1890ff',
                }}
              >
                TITTLE 6
              </span>
            ),
            key: 6,
          },
        ],
      },
    ],
  },
  {
    title: 'TITLE 9',
    key: 9,
    disableCheckbox: true,
  },
];

const Demo = () => {
  const [tree, setTree] = useState();

  useEffect(() => {
    console.log('first');
    setTree(treeData);
  }, []);

  useEffect(() => {
    console.log('useEffect 2', tree);
  }, [tree]);

  const onSelect = (selectedKeys, info) => {
    const value = prompt('Insira o novo nome');

    if (!value) return;

    handleUpdateTree(selectedKeys[0], value);
  };

  const onDragEnter = (info) => {
    console.log(info);
    // expandedKeys 需要受控时设置
    // this.setState({
    //   expandedKeys: info.expandedKeys,
    // });
  };

  const onDrop = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition =
      info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].key === key) {
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    let data = [...tree];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      arr.splice(index, 1);
      dragObj = item;
    });

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setTree(data);
  };

  const addNew = () => {
    const id = Math.floor(Math.random() * 9999) + 7;

    setTree([
      ...tree,
      {
        title: `TITLE ${id}`,
        key: id,
        children: [],
      },
    ]);
  };

  const handleUpdateTree = (id, title) => {
    let newTree = tree;

    function updateTree(newTree) {
      newTree.map((t, index) => {
        if (t.key == id) {
          t.title = `${title} ${id}`;
        } else if (t.children && t.children.length > 0) {
          updateTree(t.children);
        }
      });
    }

    updateTree(newTree);

    setTree(newTree);
  };

  return (
    <>
      <button onClick={addNew}>add</button>
      <Tree
        draggable
        defaultExpandedKeys={[1, 2, 3, 4, 5, 6]}
        onSelect={onSelect}
        treeData={tree}
        onDragEnter={onDragEnter}
        onDrop={onDrop}
      />
    </>
  );
};

ReactDOM.render(<Demo />, document.getElementById('container'));
