import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../context/AppContext.js';
import Title from '../../components/Title.js';
import ActionsBar from '../../components/ActionsBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconContract from '../../components/icons/IconContract.js';
import IconAdd from '../../components/icons/IconAdd.js';
import IconCost from '../../components/icons/IconCost.js';
import HomeTopAction1 from './HomeTopAction1.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { isValid } from '../../utils/is-valid.js';
import { protect } from '../../utils/protect.js';

const HomeTop = ReactRouterDOM.withRouter(function () {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const history = ReactRouterDOM.useHistory();
  const [action, setAction] = React.useState(null);
  const bodyRefAction0 = React.useRef(null);
  const [count, setCount] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;
  const [items, setItems] = React.useState([]);

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
    const body = {};
    setAction({ index: 0, body: body, validated: false });
  }
  const submitAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefAction0.current)) {
      try {
        await ApiService.postContract(action.body);
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
      setCount(await ApiService.getCountContractsV2(null));
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
      records = await ApiService.getContractsV2(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.contractId,
      data: [
        record.code,
        record.date,
        record.customerName,
        record.tons,
        record.deadline,
        protect(function ([deadline]) { const today = new Date(); const deadlineDate = new Date(deadline); const differenceInTime = deadlineDate - today; const daysLeft = Math.floor(differenceInTime / (1000 * 3600 * 24));  return daysLeft > 0 ? `${daysLeft} day(s) left` : ''; }, [ record.deadline ]),
        protect(function ([kgDispatched, kgTarget]) { return kgDispatched / kgTarget }, [ record.kgDispatched, record.kgTarget ]),
        protect(function ([kgDelivered, kgTarget]) { return kgDelivered / kgTarget }, [ record.kgDelivered, record.kgTarget ]),
        record.baseCost,
        record.additionalCost,
        protect(function ([baseCost, additionalCost]) { return baseCost + additionalCost; }, [ record.baseCost, record.additionalCost ]),
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
    history.push('/contract/' + item.record.contractId);
  }
  
  const handleContextualAction0 = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    history.push('/contract-costs/' + item.record.contractId);
  }
  
  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconContract} label={words.inProgressContracts} />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
          <ActionsBar
            actions={[
              { label: words.newContract, color: 'primary', onClick: handleAction0 },
            ]}
          />
        </div>
      </div>
      <div>
        <Grid
          contextualActions={[
            { icon: IconCost, label: words.costBreakdown, color: 'primary', onClick: handleContextualAction0 },
          ]}
          fields={[
            {
              label: words.referenceNumber,
              type: 'string',
              bindIndex: 0,
              secondaryField: {
                type: 'date',
                bindIndex: 1,
              },
            },
            {
              label: words.customer,
              type: 'string',
              bindIndex: 2,
            },
            {
              label: words.quantity,
              paragraph: {
                template: words.tons,
                fields: [
                  {
                    type: 'integer',
                    bindIndex: 3,
                  },
                ]
              },
            },
            {
              label: words.deadline,
              type: 'date',
              color: function (value) { const deadline = new Date(value); const now = new Date(); return deadline < now ? 'red' : null; },
              style: function (value) { const deadline = new Date(value); const now = new Date(); const timeDiff = deadline - now; const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); return daysDiff <= 0 || daysDiff < 6 ? 'fw-bold' : ''; },
              bindIndex: 4,
              secondaryField: {
                type: 'string',
                bindIndex: 5,
              },
            },
            {
              label: words.progress,
              paragraph: {
                template: words.progressBarTemplate,
                fields: [
                  {
                    type: 'percentage',
                    bindIndex: 6,
                  },
                  {
                    type: 'percentage',
                    bindIndex: 7,
                  },
                ]
              },
            },
            {
              label: words.baseCostFull,
              type: 'money',
              alignment: 'right',
              bindIndex: 8,
            },
            {
              label: words.additionalCostFull,
              type: 'money',
              alignment: 'right',
              bindIndex: 9,
            },
            {
              label: words.totalCostFull,
              type: 'money',
              alignment: 'right',
              bindIndex: 10,
            },
          ]}
          onClickItem={handleClickItem}
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
            <Title icon={IconAdd} color="primary" label={words.newContract} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefAction0} className="popup-body">
            <div>
              {action.body && <HomeTopAction1 body={action.body} updateBody={updateActionBody} validated={action.validated} />}
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <div className="btn-primary" onClick={submitAction0}>
                {words.create}
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
    </div>
  );
})

export default HomeTop;
