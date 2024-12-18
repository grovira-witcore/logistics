import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../contexts/AppContext.js';
import { usePageContext } from '../../contexts/PageContext.js';
import Title from '../../components/Title.js';
import ActionsBar from '../../components/ActionsBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconShipper from '../../components/icons/IconShipper.js';
import IconAdd from '../../components/icons/IconAdd.js';
import IconEdit from '../../components/icons/IconEdit.js';
import IconDelete from '../../components/icons/IconDelete.js';
import ShippersBodyAction1 from './ShippersBodyAction1.js';
import ShippersBodyContextualAction1 from './ShippersBodyContextualAction1.js';
import ShippersBodyContextualAction2 from './ShippersBodyContextualAction2.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { isValid } from '../../utils/is-valid.js';

const ShippersBody = ReactRouterDOM.withRouter(function () {
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
        await ApiService.postShipper(action.data);
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
      setCount(await ApiService.getCountShippers(null));
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
      records = await ApiService.getShippers(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.shipperId,
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
    let shipper = null;
    try {
      shipper = await ApiService.getShipper(item.record.shipperId);
    }
    catch (error) {
      setError(error);
      return;
    }
    const data = {};
    data.name = shipper.name;
    setContextualAction({ index: 0, shipper: shipper, data: data, validated: false });
  }
  const submitContextualAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefContextualAction0.current)) {
      try {
        await ApiService.putShipper(contextualAction.shipper.shipperId, contextualAction.data);
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
    let shipper = null;
    try {
      shipper = await ApiService.getShipper(item.record.shipperId);
    }
    catch (error) {
      setError(error);
      return;
    }
    setContextualAction({ index: 1, shipper: shipper });
  }
  const submitContextualAction1 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefContextualAction1.current)) {
      try {
        await ApiService.deleteShipper(contextualAction.shipper.shipperId);
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
          <Title icon={IconShipper} label={words.shippers} />
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
            <Title icon={IconAdd} color="primary" label={words.addShipper} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefAction0} className="popup-body">
            <div>
              <ShippersBodyAction1 data={action.data} updateData={updateActionData} validated={action.validated} />
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
            <Title icon={IconEdit} color="primary" label={words.editShipper} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefContextualAction0} className="popup-body">
            <div>
              <ShippersBodyContextualAction1 shipper={contextualAction ? contextualAction.shipper : null} data={contextualAction.data} updateData={updateContextualActionData} validated={contextualAction.validated} />
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
            <Title icon={IconDelete} color="red" label={words.deleteShipper} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefContextualAction1} className="popup-body">
            <div>
              <ShippersBodyContextualAction2 shipper={contextualAction ? contextualAction.shipper : null} data={contextualAction.data} updateData={updateContextualActionData} validated={contextualAction.validated} />
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

export default ShippersBody;
