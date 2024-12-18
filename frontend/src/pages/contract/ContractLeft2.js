import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../contexts/AppContext.js';
import { usePageContext } from '../../contexts/PageContext.js';
import Title from '../../components/Title.js';
import ActionsBar from '../../components/ActionsBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconBooking from '../../components/icons/IconBooking.js';
import IconAdd from '../../components/icons/IconAdd.js';
import ContractLeft2Action1 from './ContractLeft2Action1.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { isValid } from '../../utils/is-valid.js';
import { protect } from '../../utils/protect.js';

const ContractLeft2 = ReactRouterDOM.withRouter(function ({ contract }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const { refresh } = usePageContext();
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
  }, [contract]);

  React.useEffect(() => {
    loadRecords();
  }, [pageNumber, contract]);

  const handleAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    data.contractId = contract.contractId;
    setAction({ index: 0, data: data, validated: false });
  }
  const submitAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefAction0.current)) {
      try {
        await ApiService.postBooking(action.data);
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
      const args = {};
      if (contract.contractId !== null && contract.contractId !== undefined) {
        args.contractContractId = contract.contractId;
      }
      setCount(await ApiService.getCountBookings(args));
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
      if (contract.contractId !== null && contract.contractId !== undefined) {
        args.contractContractId = contract.contractId;
      }
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      records = await ApiService.getBookings(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.bookingId,
      data: [
        record.code,
        record.shipperName,
        record.totalCargos,
        record.departureDate,
        record.arrivalDate,
        record.status,
        protect(function ([value]) { return value === 'inProgress' ? 'yellow' : (value === 'completed' ? 'green' : null); }, [ record.status ]),
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
    history.push('/booking/' + item.record.bookingId);
  }
  
  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconBooking} label={words.bookings} />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
          <ActionsBar
            actions={[
              { label: words.addBooking, color: 'primary', onClick: handleAction0 },
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
              label: words.code,
              type: 'string',
              bindIndex: 0,
              secondaryField: {
                type: 'string',
                bindIndex: 1,
              },
            },
            {
              label: words.totalCargos,
              type: 'integer',
              bindIndex: 2,
            },
            {
              label: words.departureDate,
              type: 'date',
              bindIndex: 3,
            },
            {
              label: words.arrivalDate,
              type: 'date',
              breakpoint: 'md',
              bindIndex: 4,
            },
            {
              label: words.status,
              type: 'string',
              translate: true,
              frame: true,
              breakpoint: 'md',
              bindIndex: 5,
              colorBindIndex: 6,
            },
            {
              label: words.progress,
              breakpoint: 'xl',
              progressBar: {
                fields: [
                  {
                    type: 'percentage',
                    bindIndex: 7,
                    color: 'green',
                  },
                  {
                    type: 'percentage',
                    bindIndex: 8,
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
            <Title icon={IconAdd} color="primary" label={words.addBooking} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefAction0} className="popup-body">
            <div>
              <ContractLeft2Action1 contract={contract} data={action.data} updateData={updateActionData} validated={action.validated} />
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
    </div>
  );
})

export default ContractLeft2;
