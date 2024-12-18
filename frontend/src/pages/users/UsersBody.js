import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../contexts/AppContext.js';
import Title from '../../components/Title.js';
import FiltersBar from '../../components/FiltersBar.js';
import ActionsBar from '../../components/ActionsBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconUser from '../../components/icons/IconUser.js';
import Paragraph from '../../components/Paragraph.js';
import IconAdd from '../../components/icons/IconAdd.js';
import IconEdit from '../../components/icons/IconEdit.js';
import IconResetPassword from '../../components/icons/IconResetPassword.js';
import IconBlock from '../../components/icons/IconBlock.js';
import IconUnblock from '../../components/icons/IconUnblock.js';
import UsersBodyActionAdd from './UsersBodyActionAdd.js';
import UsersBodyActionEdit from './UsersBodyActionEdit.js';
import UsersBodyActionResetPassword from './UsersBodyActionResetPassword.js';
import SecurityService from '../../services/SecurityService.js';
import { getWords } from '../../utils/get-words.js';
import { isValid } from '../../utils/is-valid.js';
import { protect } from '../../utils/protect.js';

const UsersBody = ReactRouterDOM.withRouter(function ({ securityOptions }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const [count, setCount] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;
  const [filtersValues, setFiltersValues] = React.useState([null]);
  const [items, setItems] = React.useState([]);
  const [action, setAction] = React.useState(null);
  const bodyRefActionAdd = React.useRef(null);
  const bodyRefActionEdit = React.useRef(null);
  const bodyRefActionResetPassword = React.useRef(null);

  React.useEffect(() => {
    setPageNumber(1);
    loadCount();
  }, [filtersValues]);

  React.useEffect(() => {
    loadRecords();
  }, [pageNumber, filtersValues]);

  const loadCount = async function () {
    try {
      try {
        const args = {};
        if (filtersValues[0] !== null && filtersValues[0] !== undefined) {
          args.username = filtersValues[0] + '%';
        }
        const queryString = new URLSearchParams(args).toString();
        const response = await httpCall('/api/auth/count-users' + (queryString ? ('?' + queryString) : ''), 'get');
        if (!response.ok) {
          const error = new Error('Error executing "countUsers"');
          try {
            error.additionalData = await response.json();
          }
          catch (err) {
          }
          throw error;
        }
        const result = await response.json();
        setCount(result.count);
      }
      catch (error) {
        setError(error);
        return;
      }
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
      if (filtersValues[0] !== null && filtersValues[0] !== undefined) {
        args.username = filtersValues[0] + '%';
      }
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      const response = await httpCall('/api/auth/users?' + new URLSearchParams(args).toString(), 'get');
      if (!response.ok) {
        const error = new Error('Error executing "getUsers"');
        try {
          error.additionalData = await response.json();
        }
        catch (err) {
        }
        throw error;
      }
      records = await response.json();
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.userId,
      data: [
        record.username,
        protect(function ([firstName, lastName]) { return `${firstName ?? ''} ${lastName ?? ''}` }, [record.firstName, record.lastName]),
        record.avatar ?? '/images/user.png',
        record.email,
        record.role,
        record.providerName,
        record.blocked
      ],
      record: record
    })));
  }

  const refreshMe = async function () {
    await loadCount();
    await loadRecords();
  }

  const handleActionAdd = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    setAction({ code: 'add', data: data, validated: false });
  }
  const submitActionAdd = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefActionAdd.current)) {
      try {
        const response = await httpCall('/api/auth/user', 'post', action.data);
        if (!response.ok) {
          const error = new Error('Error executing "postUser"');
          try {
            error.additionalData = await response.json();
          }
          catch (err) {
          }
          throw error;
        }
      }
      catch (error) {
        setError(error);
        return;
      }
      setAction(null);
      refreshMe();
    }
    else {
      setAction(prevAction => ({ ...prevAction, validated: true }));
    }
  }

  const handleActionEdit = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    data.firstName = item.record.firstName;
    data.lastName = item.record.lastName;
    data.email = item.record.email;
    data.role = item.record.role;
    setAction({ code: 'edit', userId: item.record.userId, username: item.record.username, data: data, validated: false });
  }
  const submitActionEdit = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefActionEdit.current)) {
      try {
        const response = await httpCall(`/api/auth/user/${action.userId}`, 'put', action.data);
        if (!response.ok) {
          const error = new Error('Error executing "putUser"');
          try {
            error.additionalData = await response.json();
          }
          catch (err) {
          }
          throw error;
        }
      }
      catch (error) {
        setError(error);
        return;
      }
      setAction(null);
      refreshMe();
    }
    else {
      setAction(prevAction => ({ ...prevAction, validated: true }));
    }
  }

  const handleActionResetPassword = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    setAction({ code: 'reset-password', userId: item.record.userId, username: item.record.username, data: data, validated: false });
  }
  const submitActionResetPassword = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefActionResetPassword.current)) {
      try {
        const response = await httpCall(`/api/auth/user/${action.userId}/reset-password`, 'put', action.data);
        if (!response.ok) {
          const error = new Error('Error executing "putUserResetPassword"');
          try {
            error.additionalData = await response.json();
          }
          catch (err) {
          }
          throw error;
        }
      }
      catch (error) {
        setError(error);
        return;
      }
      setAction(null);
      refreshMe();
    }
    else {
      setAction(prevAction => ({ ...prevAction, validated: true }));
    }
  }

  const handleActionBlock = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setAction({ code: 'block', userId: item.record.userId, username: item.record.username });
  }
  const submitActionBlock = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    try {
      const response = await httpCall(`/api/auth/user/${action.userId}/block`, 'put');
      if (!response.ok) {
        const error = new Error('Error executing "putUserBlock"');
        try {
          error.additionalData = await response.json();
        }
        catch (err) {
        }
        throw error;
      }
     }
    catch (error) {
      setError(error);
      return;
    }
    setAction(null);
    refreshMe();
  }

  const handleActionUnblock = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setAction({ code: 'unblock', userId: item.record.userId, username: item.record.username });
  }
  const submitActionUnblock = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    try {
      const response = await httpCall(`/api/auth/user/${action.userId}/unblock`, 'put');
      if (!response.ok) {
        const error = new Error('Error executing "putUserUnblock"');
        try {
          error.additionalData = await response.json();
        }
        catch (err) {
        }
        throw error;
      }
    }
    catch (error) {
      setError(error);
      return;
    }
    setAction(null);
    refreshMe();
  }

  const updateActionData = function (field, value) {
    setAction(prevAction => ({ ...prevAction, data: { ...prevAction.data, [field]: value } }));
  }
  const cancelAction = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    setAction(null);
  }
  const httpCall = function (url, method, data) {
    return new Promise(function (resolve) {
      SecurityService.updateToken(async function () {
        const options = {
          method: method,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${SecurityService.getToken()}`,
          }
        };
        if (data) {
          options.body = JSON.stringify(data);
        }
        resolve(await fetch(url, options));
      });
    });
  }

  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconUser} label={words.users} />
          <FiltersBar
            filters={[
              {
                label: words.username,
                variant: 'text'
              },
            ]}
            filtersValues={filtersValues}
            setFiltersValues={setFiltersValues}
          />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
          <ActionsBar
            actions={[
              { label: words.add, color: 'primary', onClick: handleActionAdd },
            ]}
          />
        </div>
      </div>
      <div>
        <Grid
          contextualActions={[
            { icon: IconEdit, label: words.edit, color: 'primary', onClick: handleActionEdit, hidden: function (item) { return item.record.userId === 1 } },
            { icon: IconResetPassword, label: words.resetPassword, color: 'primary', onClick: handleActionResetPassword, hidden: function (item) { return !securityOptions.enableByUserPassword || item.record.providerName } },
            { icon: IconBlock, label: words.block, color: 'red', onClick: handleActionBlock, hidden: function (item) { return item.record.userId === 1 || item.record.blocked } },
            { icon: IconUnblock, label: words.unblock, color: 'green', onClick: handleActionUnblock, hidden: function (item) { return !item.record.blocked } }
          ]}
          fields={[
            ...[
              {
                label: words.name,
                type: 'string',
                bindIndex: 1,
                avatarField: {
                  type: 'imageUrl',
                  bindIndex: 2,
                },
                secondaryField: {
                  type: 'string',
                  bindIndex: 0,
                }
              },
              {
                label: words.email,
                type: 'string',
                bindIndex: 3
              },
              {
                label: words.role,
                type: 'string',
                translate: true,
                bindIndex: 4
              },
            ],
            ...(
              (securityOptions.enableProvidersNames && securityOptions.enableProvidersNames.length > 0) ?
                [
                  {
                    label: words.provider,
                    type: 'string',
                    bindIndex: 5
                  }
                ] :
                []
            ),
            ...[
              {
                label: words.blocked,
                type: 'boolean',
                bindIndex: 6
              }
            ]
          ]}
          items={items}
        />
        {count !== null && count !== undefined ?
          <PagingBar
            pageNumber={pageNumber}
            setPageNumber={setPageNumber}
            countOfItems={count}
            countOfPages={Math.ceil(count / pageSize)}
          /> :
          null
        }
      </div>
      {action && action.code === 'add' ?
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
            <Title icon={IconAdd} color="primary" label={words.addUser} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefActionAdd} className="popup-body">
            <div>
              {action.data && <UsersBodyActionAdd securityOptions={securityOptions} data={action.data} updateData={updateActionData} validated={action.validated} />}
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-primary" onClick={submitActionAdd}>
                {words.ok}
              </button>
            </div>
            <div>
              <button className="btn-outline-primary" onClick={cancelAction}>
                {words.cancel}
              </button>
            </div>
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal> :
        null
      }
      {action && action.code === 'edit' ?
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
            <Title icon={IconEdit} color="primary" label={words.editUser} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefActionEdit} className="popup-body">
            <div>
              {action.data && <UsersBodyActionEdit securityOptions={securityOptions} username={action.username} data={action.data} updateData={updateActionData} validated={action.validated} />}
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-primary" onClick={submitActionEdit}>
                {words.ok}
              </button>
            </div>
            <div>
              <button className="btn-outline-primary" onClick={cancelAction}>
                {words.cancel}
              </button>
            </div>
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal> :
        null
      }
      {action && action.code === 'reset-password' ?
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
            <Title icon={IconResetPassword} color="primary" label={words.resetPassword} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefActionResetPassword} className="popup-body">
            <div>
              {action.data && <UsersBodyActionResetPassword username={action.username} data={action.data} updateData={updateActionData} validated={action.validated} />}
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-primary" onClick={submitActionResetPassword}>
                {words.reset}
              </button>
            </div>
            <div>
              <button className="btn-outline-primary" onClick={cancelAction}>
                {words.cancel}
              </button>
            </div>
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal> :
        null
      }
      {action && action.code === 'block' ?
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
            <Title icon={IconBlock} color="red" label={words.blockUser} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body className="popup-body">
            <div className="prompt d-flex justify-content-center">
              <Paragraph
                template={words.confirmBlockUser}
                fields={[
                  {
                    type: 'string',
                    style: function () { return 'fw-bold'; },
                    value: action.username
                  }
                ]}
              />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-red" onClick={submitActionBlock}>
                {words.block}
              </button>
            </div>
            <div>
              <button className="btn-outline-primary" onClick={cancelAction}>
                {words.cancel}
              </button>
            </div>
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal> :
        null
      }
      {action && action.code === 'unblock' ?
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
            <Title icon={IconUnblock} color="green" label={words.unblockUser} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body className="popup-body">
            <div className="prompt d-flex justify-content-center">
              <Paragraph
                template={words.confirmUnblockUser}
                fields={[
                  {
                    type: 'string',
                    style: function () { return 'fw-bold'; },
                    value: action.username
                  }
                ]}
              />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-green" onClick={submitActionUnblock}>
                {words.unblock}
              </button>
            </div>
            <div>
              <button className="btn-outline-primary" onClick={cancelAction}>
                {words.cancel}
              </button>
            </div>
          </ReactBootstrap.Modal.Footer>
        </ReactBootstrap.Modal> :
        null
      }
    </div>
  );
})

export default UsersBody;
