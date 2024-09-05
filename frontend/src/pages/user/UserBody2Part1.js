import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../context/AppContext.js';
import ActionsBar from '../../components/ActionsBar.js';
import Title from '../../components/Title.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconAdd from '../../components/icons/IconAdd.js';
import IconDelete from '../../components/icons/IconDelete.js';
import UserBody2Part1Action1 from './UserBody2Part1Action1.js';
import UserBody2Part1ContextualAction1 from './UserBody2Part1ContextualAction1.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { isValid } from '../../utils/is-valid.js';

const UserBody2Part1 = ReactRouterDOM.withRouter(function ({ user }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const [action, setAction] = React.useState(null);
  const bodyRefAction0 = React.useRef(null);
  const [count, setCount] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;
  const [items, setItems] = React.useState([]);
  const [contextualAction, setContextualAction] = React.useState(null);
  const bodyRefContextualAction0 = React.useRef(null);

  React.useEffect(() => {
    setPageNumber(1);
    loadCount();
  }, [user]);

  React.useEffect(() => {
    loadRecords();
  }, [pageNumber, user]);

  const handleAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    data.userId = user.userId;
    setAction({ index: 0, data: data, validated: false });
  }
  const submitAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefAction0.current)) {
      try {
        await ApiService.postUserRole(action.data);
      }
      catch (error) {
        setError(error);
        return;
      }
      setAction(null);
      window.location.reload();
    }
    else {
      setAction(prevAction => ({ ...prevAction, validated: true }));
    }
  }
  const updateActionData = function (field, value) {
    setAction(prevAction => ({ ...prevAction, data: { ...prevAction.data, [field]: value } }));
  }
  const updateActionPath = function (field, value) {
    setAction(prevAction => ({ ...prevAction, path: { ...prevAction.path, [field]: value } }));
  }
  const updateActionBody = function (field, value) {
    setAction(prevAction => ({ ...prevAction, body: { ...prevAction.body, [field]: value } }));
  }
  const cancelAction = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setAction(null);
  }
  
  const loadCount = async function () {
    try {
      const args = {};
      if (user.userId !== null && user.userId !== undefined) {
        args.userUserId = user.userId;
      }
      setCount(await ApiService.getCountUserRoles(args));
    }
    catch (error) {
      setError(error);
      return;
    }
  }
  
  const loadRecords = async function () {
    let records = null;
    try {
      const args = {};
      if (user.userId !== null && user.userId !== undefined) {
        args.userUserId = user.userId;
      }
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      records = await ApiService.getUserRoles(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.userRoleId,
      data: [
        record.role,
      ],
      record: record
    })));
  }
  
  const refreshMe = async function () {
    await loadCount();
    await loadRecords();
  }
  
  const handleContextualAction0 = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    let userRole = null;
    try {
      userRole = await ApiService.getUserRole(item.record.userRoleId);
    }
    catch (error) {
      setError(error);
      return;
    }
    setContextualAction({ index: 0, userRole: userRole });
  }
  const submitContextualAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefContextualAction0.current)) {
      try {
        await ApiService.deleteUserRole(contextualAction.userRole.userRoleId);
      }
      catch (error) {
        setError(error);
        return;
      }
      setContextualAction(null);
      refreshMe();
    }
    else {
      setContextualAction(prevContextualAction => ({ ...prevContextualAction, validated: true }));
    }
  }
  const updateContextualActionData = function (field, value) {
    setContextualAction(prevContextualAction => ({ ...prevContextualAction, data: { ...prevContextualAction.data, [field]: value } }));
  }
  const updateContextualActionPath = function (field, value) {
    setContextualAction(prevContextualAction => ({ ...prevContextualAction, path: { ...prevContextualAction.path, [field]: value } }));
  }
  const updateContextualActionBody = function (field, value) {
    setContextualAction(prevContextualAction => ({ ...prevContextualAction, body: { ...prevContextualAction.body, [field]: value } }));
  }
  const cancelContextualAction = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setContextualAction(null);
  }
  
  return (
    <div>
      <div className="area-toolbar d-flex align-items-center">
        <div className="flex-grow-1" />
        <ActionsBar
          actions={[
            { label: words.add, color: 'primary', onClick: handleAction0 },
          ]}
        />
      </div>
      <div>
        <Grid
          contextualActions={[
            { icon: IconDelete, label: words.delete, color: 'red', onClick: handleContextualAction0 },
          ]}
          fields={[
            {
              label: words.role,
              type: 'string',
              translate: true,
              bindIndex: 0,
            },
          ]}
          items={items}
        />
        {count !== null && count !== undefined ?
          <PagingBar
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            countOfItems={count}
            countOfPages={Math.ceil(count/pageSize)}
          /> :
          null
        }
      </div>
      {action && action.index === 0 ?
        <ReactBootstrap.Modal
          contentClassName="popup"
          show={true}
          onHide={() => cancelAction({})}
          scrollable={true}
          centered={true}
          backdrop="static"
          keyboard={false}
         
        >
          <ReactBootstrap.Modal.Header className="popup-header">
            <Title icon={IconAdd} color="primary" label={words.addUserRole} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefAction0} className="popup-body">
            <div>
              {action.data && <UserBody2Part1Action1 user={user} data={action.data} updateData={updateActionData} validated={action.validated} />}
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <div className="btn-primary" onClick={submitAction0}>
                {words.ok}
              </div>
            </div>
            <div>
              <div className="btn-outline-primary" onClick={cancelAction}>
                {words.cancel}
              </div>
            </div>
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal> :
        null
      }
      {contextualAction && contextualAction.index === 0 ?
        <ReactBootstrap.Modal
          contentClassName="popup"
          show={true}
          onHide={() => cancelContextualAction({})}
          scrollable={true}
          centered={true}
          backdrop="static"
          keyboard={false}
         
        >
          <ReactBootstrap.Modal.Header className="popup-header">
            <Title icon={IconDelete} color="red" label={words.deleteUserRole} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefContextualAction0} className="popup-body">
            <div>
              <UserBody2Part1ContextualAction1 userRole={contextualAction ? contextualAction.userRole : null} />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <div className="btn-red" onClick={submitContextualAction0}>
                {words.delete}
              </div>
            </div>
            <div>
              <div className="btn-outline-primary" onClick={cancelContextualAction}>
                {words.cancel}
              </div>
            </div>
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal> :
        null
      }
    </div>
  );
})

export default UserBody2Part1;
