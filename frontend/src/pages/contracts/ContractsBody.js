import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../contexts/AppContext.js';
import { usePageContext } from '../../contexts/PageContext.js';
import Title from '../../components/Title.js';
import FiltersBar from '../../components/FiltersBar.js';
import ActionsBar from '../../components/ActionsBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconContract from '../../components/icons/IconContract.js';
import IconAdd from '../../components/icons/IconAdd.js';
import ContractsBodyAction1 from './ContractsBodyAction1.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { isValid } from '../../utils/is-valid.js';
import { protect } from '../../utils/protect.js';

const ContractsBody = ReactRouterDOM.withRouter(function () {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const { refresh } = usePageContext();
  const history = ReactRouterDOM.useHistory();
  const [action, setAction] = React.useState(null);
  const bodyRefAction0 = React.useRef(null);
  const [count, setCount] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;
  const [filtersValues, setFiltersValues] = React.useState([null, null]);
  const [items, setItems] = React.useState([]);

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
    setAction({ index: 0, data: data, validated: false });
  }
  const submitAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefAction0.current)) {
      try {
        await ApiService.postContract(action.data);
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
  
  const fetchDataSourceCustomerId = async function () {
    let records = null;
    try {
      records = await ApiService.getCustomers(null);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.customerId, record.name]);
  }
  
  const loadCount = async function () {
    try {
      const args = {};
      if (filtersValues[0] !== null && filtersValues[0] !== undefined) {
        args.customerIds = filtersValues[0].join(',');
      }
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.statuss = filtersValues[1].join(',');
      }
      setCount(await ApiService.getCountContracts(args));
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
        args.customerIds = filtersValues[0].join(',');
      }
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.statuss = filtersValues[1].join(',');
      }
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      records = await ApiService.getContracts(args);
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
        protect(function ([value]) { const deadline = new Date(value); const now = new Date(); return deadline < now ? 'red' : null; }, [ record.deadline ]),
        protect(function ([value]) { const deadline = new Date(value); const now = new Date(); const timeDiff = deadline - now; const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); return daysDiff <= 0 || daysDiff < 6 ? 'bold' : ''; }, [ record.deadline ]),
        protect(function ([deadline]) { const today = new Date(); const deadlineDate = new Date(deadline); const differenceInTime = deadlineDate - today; const daysLeft = Math.floor(differenceInTime / (1000 * 3600 * 24)); return daysLeft > 0 ? `${daysLeft} day(s) left` : ''; }, [ record.deadline ]),
        record.status,
        protect(function ([value]) { return value === 'completed' ? 'green' : (value === 'inProgress' ? 'yellow' : null); }, [ record.status ]),
        protect(function ([kgDelivered, kgTarget]) { return kgDelivered / kgTarget }, [ record.kgDelivered, record.kgTarget ]),
        protect(function ([kgDelivered, kgDispatched, kgTarget]) { return (kgDispatched - kgDelivered) / kgTarget }, [ record.kgDelivered, record.kgDispatched, record.kgTarget ]),
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
  
  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconContract} label={words.contracts} />
          <FiltersBar
            filters={[
              {
                label: words.customer,
                variant: 'option',
                loader: fetchDataSourceCustomerId
              },
              {
                label: words.status,
                variant: 'option',
                dataSource: [['inProgress', words.inProgress], ['completed', words.completed]]
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
              { label: words.newContract, color: 'primary', onClick: handleAction0 },
            ]}
          />
        </div>
      </div>
      <div>
        <Grid
          contextualActions={[
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
              breakpoint: 'md',
              bindIndex: 4,
              colorBindIndex: 5,
              fontWeightBindIndex: 6,
              secondaryField: {
                type: 'string',
                bindIndex: 7,
              },
            },
            {
              label: words.status,
              type: 'string',
              translate: true,
              frame: true,
              breakpoint: 'md',
              bindIndex: 8,
              colorBindIndex: 9,
            },
            {
              label: words.progress,
              breakpoint: 'xl',
              progressBar: {
                fields: [
                  {
                    type: 'percentage',
                    bindIndex: 10,
                    color: 'green',
                  },
                  {
                    type: 'percentage',
                    bindIndex: 11,
                    color: 'yellow',
                  },
                ]
              },
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
              <ContractsBodyAction1 data={action.data} updateData={updateActionData} validated={action.validated} />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-primary" onClick={submitAction0}>
                {words.create}
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

export default ContractsBody;
