import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../contexts/AppContext.js';
import { usePageContext } from '../../contexts/PageContext.js';
import Title from '../../components/Title.js';
import FiltersBar from '../../components/FiltersBar.js';
import Grid from '../../components/Grid.js';
import PagingBar from '../../components/PagingBar.js';
import IconCargo from '../../components/icons/IconCargo.js';
import IconTransporter from '../../components/icons/IconTransporter.js';
import IconShipper from '../../components/icons/IconShipper.js';
import CargosBodyContextualAction1 from './CargosBodyContextualAction1.js';
import CargosBodyContextualAction2 from './CargosBodyContextualAction2.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { protect } from '../../utils/protect.js';
import { isValid } from '../../utils/is-valid.js';

const CargosBody = ReactRouterDOM.withRouter(function () {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const { refresh } = usePageContext();
  const history = ReactRouterDOM.useHistory();
  const [count, setCount] = React.useState(null);
  const [pageNumber, setPageNumber] = React.useState(1);
  const pageSize = 10;
  const [filtersValues, setFiltersValues] = React.useState([null, null, null]);
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

  const fetchDataSourceTransporterId = async function () {
    let records = null;
    try {
      records = await ApiService.getTransporters(null);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.transporterId, record.name]);
  }
  
  const fetchDataSourceBookingId = async function () {
    let records = null;
    try {
      records = await ApiService.getBookings(null);
    }
    catch (error) {
      setError(error);
      return;
    }
    return records.map((record) => [record.bookingId, record.code]);
  }
  
  const loadCount = async function () {
    try {
      const args = {};
      if (filtersValues[0] !== null && filtersValues[0] !== undefined) {
        args.transporterIds = filtersValues[0].join(',');
      }
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.bookingIds = filtersValues[1].join(',');
      }
      if (filtersValues[2] !== null && filtersValues[2] !== undefined) {
        args.statuss = filtersValues[2].join(',');
      }
      setCount(await ApiService.getCountCargos(args));
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
        args.transporterIds = filtersValues[0].join(',');
      }
      if (filtersValues[1] !== null && filtersValues[1] !== undefined) {
        args.bookingIds = filtersValues[1].join(',');
      }
      if (filtersValues[2] !== null && filtersValues[2] !== undefined) {
        args.statuss = filtersValues[2].join(',');
      }
      args.offset = (pageNumber - 1) * pageSize;
      args.limit = pageSize;
      records = await ApiService.getCargos(args);
    }
    catch (error) {
      setError(error);
      return;
    }
    setItems(records.map((record, index) => ({
      key: record.cargoId,
      data: [
        record.code,
        record.transporterName,
        record.bookingContractCustomerName,
        record.bookingContractCode,
        record.bookingCode,
        record.pallets,
        record.grossLb,
        record.grossKg,
        record.netLb,
        record.netKg,
        record.status,
        protect(function ([value]) { return value === 'inPreparation' ? 'gray' : (value === 'dispatched' ? 'yellow' : (value === 'delivered' ? 'green' : null)); }, [ record.status ]),
        record.containerCode,
        record.containerSeal,
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
    history.push('/cargo/' + item.record.cargoId);
  }
  
  const handleContextualAction0 = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    let cargo = null;
    try {
      cargo = await ApiService.getCargo(item.record.cargoId);
    }
    catch (error) {
      setError(error);
      return;
    }
    const data = {};
    data.cargoId = cargo.cargoId;
    setContextualAction({ index: 0, cargo: cargo, data: data, validated: false });
  }
  const submitContextualAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefContextualAction0.current)) {
      try {
        await ApiService.putCargoAsDispatched(contextualAction.data.cargoId, (({ cargoId, ...body }) => body)(contextualAction.data));
      }
      catch (error) {
        setError(error);
        return;
      }
      refresh();
    }
    else {
      setContextualAction(prevContextualAction => ({ ...prevContextualAction, validated: true }));
    }
  }
  const handleContextualAction1 = async function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    let cargo = null;
    try {
      cargo = await ApiService.getCargo(item.record.cargoId);
    }
    catch (error) {
      setError(error);
      return;
    }
    const data = {};
    data.cargoId = cargo.cargoId;
    setContextualAction({ index: 1, cargo: cargo, data: data, validated: false });
  }
  const submitContextualAction1 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefContextualAction1.current)) {
      try {
        await ApiService.putCargoAsDelivered(contextualAction.data.cargoId, (({ cargoId, ...body }) => body)(contextualAction.data));
      }
      catch (error) {
        setError(error);
        return;
      }
      refresh();
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
          <Title icon={IconCargo} label={words.cargos} />
          <FiltersBar
            filters={[
              {
                label: words.transporter,
                variant: 'option',
                loader: fetchDataSourceTransporterId
              },
              {
                label: words.booking,
                variant: 'option',
                loader: fetchDataSourceBookingId
              },
              {
                label: words.status,
                variant: 'option',
                dataSource: [['inPreparation', words.inPreparation], ['dispatched', words.dispatched], ['delivered', words.delivered]]
              },
            ]}
            filtersValues={filtersValues}
            setFiltersValues={setFiltersValues}
          />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
        </div>
      </div>
      <div>
        <Grid
          contextualActions={[
            { icon: IconTransporter, label: words.setAsDispatched, color: 'primary', onClick: handleContextualAction0, hidden: function (item) { return !(protect(function ([status]) { return status === 'inPreparation' }, [ item.record.status ])) } },
            { icon: IconShipper, label: words.setAsDelivered, color: 'primary', onClick: handleContextualAction1, hidden: function (item) { return !(protect(function ([status]) { return status === 'dispatched' }, [ item.record.status ])) } },
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
              label: words.customer,
              type: 'string',
              bindIndex: 2,
            },
            {
              label: words.contract,
              type: 'string',
              bindIndex: 3,
            },
            {
              label: words.booking,
              type: 'string',
              breakpoint: 'md',
              bindIndex: 4,
            },
            {
              label: words.pallets,
              type: 'integer',
              breakpoint: 'md',
              bindIndex: 5,
            },
            {
              label: words.grossLb,
              type: 'integer',
              breakpoint: 'xl',
              bindIndex: 6,
            },
            {
              label: words.grossKg,
              type: 'integer',
              breakpoint: 'xl',
              bindIndex: 7,
            },
            {
              label: words.netLb,
              type: 'integer',
              breakpoint: 'xl',
              bindIndex: 8,
            },
            {
              label: words.netKg,
              type: 'integer',
              breakpoint: 'xl',
              bindIndex: 9,
            },
            {
              label: words.status,
              type: 'string',
              translate: true,
              frame: true,
              breakpoint: 'xl',
              bindIndex: 10,
              colorBindIndex: 11,
            },
            {
              label: words.container,
              type: 'string',
              breakpoint: 'xl',
              bindIndex: 12,
              secondaryField: {
                type: 'string',
                bindIndex: 13,
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
            <Title icon={IconTransporter} color="primary" label={words.setAsDispatched} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefContextualAction0} className="popup-body">
            <div>
              <CargosBodyContextualAction1 cargo={contextualAction ? contextualAction.cargo : null} data={contextualAction.data} updateData={updateContextualActionData} validated={contextualAction.validated} />
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
            <Title icon={IconShipper} color="primary" label={words.setAsDelivered} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefContextualAction1} className="popup-body">
            <div>
              <CargosBodyContextualAction2 cargo={contextualAction ? contextualAction.cargo : null} data={contextualAction.data} updateData={updateContextualActionData} validated={contextualAction.validated} />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-primary" onClick={submitContextualAction1}>
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
    </div>
  );
})

export default CargosBody;
