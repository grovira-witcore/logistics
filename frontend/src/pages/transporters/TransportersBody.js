import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../contexts/AppContext.js';
import { usePageContext } from '../../contexts/PageContext.js';
import Title from '../../components/Title.js';
import ActionsBar from '../../components/ActionsBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconTransporter from '../../components/icons/IconTransporter.js';
import IconAdd from '../../components/icons/IconAdd.js';
import IconEdit from '../../components/icons/IconEdit.js';
import IconDelete from '../../components/icons/IconDelete.js';
import TransportersBodyAction1 from './TransportersBodyAction1.js';
import TransportersBodyContextualAction1 from './TransportersBodyContextualAction1.js';
import TransportersBodyContextualAction2 from './TransportersBodyContextualAction2.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { isValid } from '../../utils/is-valid.js';

const TransportersBody = ReactRouterDOM.withRouter(function () {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const { refresh } = usePageContext();
  const [action, setAction] = React.useState(null);
  const bodyRefAction0 = React.useRef(null);
  const [count, setCount] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;
  const [items, setItems] = React.useState([]);
  const [contextualAction, setContextualAction] = React.useState(null);
  const bodyRefContextualAction0 = React.useRef(null);
  const bodyRefContextualAction1 = React.useRef(null);

  React.useEffect(() => {
    setPageNumber(1);
    loadCount();
  }, []);

  React.useEffect(() => {
    loadRecords();
  }, [pageNumber]);

  const handleAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    setAction({ index: 0, data: data, validated: false });
  }
  const submitAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefAction0.current)) {
      try {
        await ApiService.postTransporter(action.data);
      }
      catch (error) {
        setError(error);
        return;
      }
      setAction(null);
      refresh();
    }
    else {
      setAction(prevAction => ({ ...prevAction, validated: true }));
    }
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
  
  const loadCount = async function () {
    try {
      setCount(await ApiService.getCountTransporters(null));
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
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      records = await ApiService.getTransporters(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.transporterId,
      data: [
        record.name,
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
    let transporter = null;
    try {
      transporter = await ApiService.getTransporter(item.record.transporterId);
    }
    catch (error) {
      setError(error);
      return;
    }
    const data = {};
    data.name = transporter.name;
    setContextualAction({ index: 0, transporter: transporter, data: data, validated: false });
  }
  const submitContextualAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefContextualAction0.current)) {
      try {
        await ApiService.putTransporter(contextualAction.transporter.transporterId, contextualAction.data);
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
    let transporter = null;
    try {
      transporter = await ApiService.getTransporter(item.record.transporterId);
    }
    catch (error) {
      setError(error);
      return;
    }
    setContextualAction({ index: 1, transporter: transporter });
  }
  const submitContextualAction1 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefContextualAction1.current)) {
      try {
        await ApiService.deleteTransporter(contextualAction.transporter.transporterId);
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
          <Title icon={IconTransporter} label={words.transporters} />
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
              label: words.name,
              type: 'string',
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
            <Title icon={IconAdd} color="primary" label={words.addTransporter} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefAction0} className="popup-body">
            <div>
              <TransportersBodyAction1 data={action.data} updateData={updateActionData} validated={action.validated} />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-primary" onClick={submitAction0}>
                {words.save}
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
            <Title icon={IconEdit} color="primary" label={words.editTransporter} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefContextualAction0} className="popup-body">
            <div>
              <TransportersBodyContextualAction1 transporter={contextualAction ? contextualAction.transporter : null} data={contextualAction.data} updateData={updateContextualActionData} validated={contextualAction.validated} />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-primary" onClick={submitContextualAction0}>
                {words.save}
              </button>
            </div>
            <div>
              <button className="btn-outline-primary" onClick={cancelContextualAction}>
                {words.cancel}
              </button>
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
            <Title icon={IconDelete} color="red" label={words.deleteTransporter} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefContextualAction1} className="popup-body">
            <div>
              <TransportersBodyContextualAction2 transporter={contextualAction ? contextualAction.transporter : null} data={contextualAction.data} updateData={updateContextualActionData} validated={contextualAction.validated} />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-red" onClick={submitContextualAction1}>
                {words.delete}
              </button>
            </div>
            <div>
              <button className="btn-outline-primary" onClick={cancelContextualAction}>
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

export default TransportersBody;
