import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../context/AppContext.js';
import Title from '../../components/Title.js';
import FiltersBar from '../../components/FiltersBar.js';
import ActionsBar from '../../components/ActionsBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconUser from '../../components/icons/IconUser.js';
import IconAdd from '../../components/icons/IconAdd.js';
import IconEdit from '../../components/icons/IconEdit.js';
import IconDelete from '../../components/icons/IconDelete.js';
import IconDummy from '../../components/icons/IconDummy.js';
import UsersBodyAction1 from './UsersBodyAction1.js';
import UsersBodyContextualAction1 from './UsersBodyContextualAction1.js';
import UsersBodyContextualAction2 from './UsersBodyContextualAction2.js';
import ApiService from '../../services/ApiService.js';
import SecurityService from '../../services/SecurityService.js';
import { getWords } from '../../utils/get-words.js';
import { isValid } from '../../utils/is-valid.js';
import { protect } from '../../utils/protect.js';

const UsersBody = ReactRouterDOM.withRouter(function () {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const history = ReactRouterDOM.useHistory();
  const [action, setAction] = React.useState(null);
  const bodyRefAction0 = React.useRef(null);
  const [count, setCount] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;
  const [filtersValues, setFiltersValues] = React.useState([null, null]);
  const [items, setItems] = React.useState([]);
  const [contextualAction, setContextualAction] = React.useState(null);
  const bodyRefContextualAction0 = React.useRef(null);
  const bodyRefContextualAction1 = React.useRef(null);

  React.useEffect(() => {
    setPageNumber(1);
    loadCount();
  }, [filtersValues]);

  React.useEffect(() => {
    loadRecords();
  }, [pageNumber, filtersValues]);

  const handleAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    data.enabled = false;
    setAction({ index: 0, data: data, validated: false });
  }
  const submitAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefAction0.current)) {
      try {
        await ApiService.postUser(action.data);
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
      setCount(await ApiService.getCountUsers(null));
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
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.enabled = filtersValues[1];
      }
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      records = await ApiService.getUsers(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.userId,
      data: [
        protect(function ([firstName, lastName]) { return `${firstName} ${lastName}` }, [ record.firstName, record.lastName ]),
        record.avatar,
        record.username,
        record.email,
        record.enabled,
      ],
      record: record
    })));
  }
  
  const refreshMe = async function () {
    await loadCount();
    await loadRecords();
  }
  
  const handleClickItem = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    history.push('/user/' + item.record.userId);
  }
  
  const handleContextualAction0 = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    let user = null;
    try {
      user = await ApiService.getUser(item.record.userId);
    }
    catch (error) {
      setError(error);
      return;
    }
    const data = {};
    data.username = user.username;
    data.firstName = user.firstName;
    data.lastName = user.lastName;
    data.email = user.email;
    data.enabled = user.enabled;
    setContextualAction({ index: 0, user: user, data: data, validated: false });
  }
  const submitContextualAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefContextualAction0.current)) {
      try {
        await ApiService.putUser(contextualAction.user.userId, contextualAction.data);
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
  const handleContextualAction1 = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    let user = null;
    try {
      user = await ApiService.getUser(item.record.userId);
    }
    catch (error) {
      setError(error);
      return;
    }
    setContextualAction({ index: 1, user: user });
  }
  const submitContextualAction1 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefContextualAction1.current)) {
      try {
        await ApiService.deleteUser(contextualAction.user.userId);
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
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconUser} label={words.users} />
          <FiltersBar
            filters={[
              {
                label: words.username,
                variant: 'text'
              },
              {
                label: words.enabled,
                variant: 'option',
                dataSource: [[true, words.yes], [false, words.no]],
                exclusive: true
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
              { label: words.add, color: 'primary', onClick: handleAction0 },
            ]}
          />
        </div>
      </div>
      <div>
        <Grid
          contextualActions={[
            { icon: IconEdit, label: words.edit, color: 'primary', onClick: handleContextualAction0 },
            { icon: IconDelete, label: words.delete, color: 'red', onClick: handleContextualAction1 },
          ]}
          fields={[
            {
              icon: IconDummy,
              label: words.username,
              type: 'string',
              bindIndex: 0,
              avatarField: {
                type: 'imageUrl',
                bindIndex: 1,
              },
              secondaryField: {
                type: 'string',
                bindIndex: 2,
              },
            },
            {
              label: words.email,
              type: 'string',
              bindIndex: 3,
            },
            {
              label: words.enabled,
              type: 'boolean',
              bindIndex: 4,
            },
          ]}
          onClickItem={(SecurityService.hasRole('administrator')) && (SecurityService.hasRole('administrator')) ? handleClickItem : null}
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
            <Title icon={IconAdd} color="primary" label={words.addUser} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefAction0} className="popup-body">
            <div>
              {action.data && <UsersBodyAction1 data={action.data} updateData={updateActionData} validated={action.validated} />}
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
            <Title icon={IconEdit} color="primary" label={words.editUser} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefContextualAction0} className="popup-body">
            <div>
              {contextualAction.data && <UsersBodyContextualAction1 user={contextualAction ? contextualAction.user : null} data={contextualAction.data} updateData={updateContextualActionData} validated={contextualAction.validated} />}
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <div className="btn-primary" onClick={submitContextualAction0}>
                {words.ok}
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
      {contextualAction && contextualAction.index === 1 ?
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
            <Title icon={IconDelete} color="red" label={words.deleteUser} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefContextualAction1} className="popup-body">
            <div>
              <UsersBodyContextualAction2 user={contextualAction ? contextualAction.user : null} />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <div className="btn-red" onClick={submitContextualAction1}>
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

export default UsersBody;
