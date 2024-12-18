import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from '../../contexts/AppContext.js';
import { usePageContext } from '../../contexts/PageContext.js';
import Title from '../../components/Title.js';
import Paragraph from '../../components/Paragraph.js';
import ActionsBar from '../../components/ActionsBar.js';
import Brief from '../../components/Brief.js';
import IconCargo from '../../components/icons/IconCargo.js';
import IconTransporter from '../../components/icons/IconTransporter.js';
import IconShipper from '../../components/icons/IconShipper.js';
import IconCost from '../../components/icons/IconCost.js';
import CargoTopAction1 from './CargoTopAction1.js';
import CargoTopAction2 from './CargoTopAction2.js';
import CargoTopAction3 from './CargoTopAction3.js';
import ApiService from '../../services/ApiService.js';
import { getWords } from '../../utils/get-words.js';
import { isValid } from '../../utils/is-valid.js';
import { protect } from '../../utils/protect.js';

const CargoTop = ReactRouterDOM.withRouter(function ({ cargo }) {
  const { i18n, setError } = useAppContext();
  const words = getWords(i18n.code);
  const { refresh } = usePageContext();
  const history = ReactRouterDOM.useHistory();
  const [action, setAction] = React.useState(null);
  const bodyRefAction0 = React.useRef(null);
  const bodyRefAction1 = React.useRef(null);
  const bodyRefAction2 = React.useRef(null);

  const handleAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    data.cargoId = cargo.cargoId;
    setAction({ index: 0, data: data, validated: false });
  }
  const submitAction0 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefAction0.current)) {
      try {
        await ApiService.putCargoAsDispatched(action.data.cargoId, (({ cargoId, ...body }) => body)(action.data));
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
  const handleAction1 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    data.cargoId = cargo.cargoId;
    setAction({ index: 1, data: data, validated: false });
  }
  const submitAction1 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefAction1.current)) {
      try {
        await ApiService.putCargoAsDelivered(action.data.cargoId, (({ cargoId, ...body }) => body)(action.data));
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
  const handleAction2 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    const data = {};
    data.cargoId = cargo.cargoId;
    data.additionalCost = cargo.additionalCost;
    setAction({ index: 2, data: data, validated: false });
  }
  const submitAction2 = async function (e) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    if (isValid(bodyRefAction2.current)) {
      try {
        await ApiService.putCargoAdditionalCost(action.data.cargoId, (({ cargoId, ...body }) => body)(action.data));
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
  
  const handleClickField1 = function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    history.push('/contract/' + cargo.bookingContractId);
  }
  
  const handleClickField2 = function (e, item) {
    if (e.ctrlKey || e.altKey) {
      return;
    }
    history.push('/booking/' + cargo.bookingId);
  }
  
  return (
    <div>
      <div className="section-header d-flex align-items-center">
        <div className="d-flex align-items-center">
          <Title icon={IconCargo} label={cargo.code} secondaryLabel={<Paragraph template={words.cargoManagement} fields={[]} />} />
        </div>
        <div className="flex-grow-1" />
        <div className="d-flex align-items-center">
          <ActionsBar
            actions={[
              { label: words.setAsDispatched, color: 'primary', onClick: handleAction0, hidden: !(protect(function ([status]) { return status === 'inPreparation' }, [ cargo.status ])) },
              { label: words.setAsDelivered, color: 'primary', onClick: handleAction1, hidden: !(protect(function ([status]) { return status === 'dispatched' }, [ cargo.status ])) },
              { label: words.setAdditionalCost, color: 'primary', onClick: handleAction2 },
            ]}
          />
        </div>
      </div>
      <Brief
        fieldsDisposition="spaces-between"
        fields={[
          {
            label: words.customer,
            type: 'string',
            value: cargo.bookingContractCustomerName,
          },
          {
            label: words.contract,
            type: 'string',
            value: cargo.bookingContractCode,
            onClick: handleClickField1,
          },
          {
            label: words.booking,
            type: 'string',
            value: cargo.bookingCode,
            onClick: handleClickField2,
          },
          {
            label: words.transporter,
            type: 'string',
            value: cargo.transporterName,
          },
          {
            label: words.pallets,
            type: 'integer',
            value: cargo.pallets,
          },
        ]}
      />
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
            <Title icon={IconTransporter} color="primary" label={words.setAsDispatched} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefAction0} className="popup-body">
            <div>
              <CargoTopAction1 cargo={cargo} data={action.data} updateData={updateActionData} validated={action.validated} />
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
      {action && action.index === 1 ?
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
            <Title icon={IconShipper} color="primary" label={words.setAsDelivered} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefAction1} className="popup-body">
            <div>
              <CargoTopAction2 cargo={cargo} data={action.data} updateData={updateActionData} validated={action.validated} />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-primary" onClick={submitAction1}>
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
      {action && action.index === 2 ?
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
            <Title icon={IconCost} color="primary" label={words.setAdditionalCost} />
          </ReactBootstrap.Modal.Header>
          <ReactBootstrap.Modal.Body ref={bodyRefAction2} className="popup-body">
            <div>
              <CargoTopAction3 cargo={cargo} data={action.data} updateData={updateActionData} validated={action.validated} />
            </div>
          </ReactBootstrap.Modal.Body>
          <ReactBootstrap.Modal.Footer className="popup-footer">
            <div>
              <button className="btn-primary" onClick={submitAction2}>
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

export default CargoTop;
