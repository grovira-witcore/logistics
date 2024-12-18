import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import * as ReactBootstrap from 'react-bootstrap';
import { useAppContext } from './contexts/AppContext.js';
import { PageContextProvider } from './contexts/PageContext.js';
import Header from './components/Header.js';
import Title from './components/Title.js';
import ErrorBox from './components/ErrorBox.js';
import IconLogo from './components/icons/IconLogo.js';
import IconError from './components/icons/IconError.js';
import IconContract from './components/icons/IconContract.js';
import IconBooking from './components/icons/IconBooking.js';
import IconCargo from './components/icons/IconCargo.js';
import IconShipper from './components/icons/IconShipper.js';
import IconTransporter from './components/icons/IconTransporter.js';
import IconCustomer from './components/icons/IconCustomer.js';
import IconCost from './components/icons/IconCost.js';
import NotFound from './pages/not-found/NotFound.js';
import UnexpectedError from './pages/unexpected-error/UnexpectedError.js';
import Booking from './pages/booking/Booking.js';
import Bookings from './pages/bookings/Bookings.js';
import Cargo from './pages/cargo/Cargo.js';
import Cargos from './pages/cargos/Cargos.js';
import Contract from './pages/contract/Contract.js';
import ContractCosts from './pages/contract-costs/ContractCosts.js';
import Contracts from './pages/contracts/Contracts.js';
import CostsByShipper from './pages/costs-by-shipper/CostsByShipper.js';
import CostsByTransporter from './pages/costs-by-transporter/CostsByTransporter.js';
import Customers from './pages/customers/Customers.js';
import Home from './pages/home/Home.js';
import Shippers from './pages/shippers/Shippers.js';
import Transporters from './pages/transporters/Transporters.js';
import ApiService from './services/ApiService.js';
import SecurityService from './services/SecurityService.js';
import { getWords } from './utils/get-words.js';
import { protect } from './utils/protect.js';

const App = ReactRouterDOM.withRouter(function () {
  const { i18n, error, setError } = useAppContext();
  const words = getWords(i18n.code);

  const searcher = async function (value) {
    const lowerValue = value.toLowerCase();
    const preGroups = await ApiService.getOmniSearch(value.split(' ')[0]);
    const groups = [];
    groups.push({
      icon: IconContract,
      labelKey: 'contracts',
      items: preGroups[0]
        .map((record) => ['/contract/' + record.contractId, record.code])
        .filter((item) => (item[1] && item[1].toLowerCase().indexOf(lowerValue) !== -1))
    });
    groups.push({
      icon: IconBooking,
      labelKey: 'bookings',
      items: preGroups[1]
        .map((record) => ['/booking/' + record.bookingId, record.code])
        .filter((item) => (item[1] && item[1].toLowerCase().indexOf(lowerValue) !== -1))
    });
    groups.push({
      icon: IconCargo,
      labelKey: 'cargos',
      items: preGroups[2]
        .map((record) => ['/cargo/' + record.cargoId, record.code, record.containerCode, record.containerSeal])
        .filter((item) => (item[1] && item[1].toLowerCase().indexOf(lowerValue) !== -1) || (item[2] && item[2].toLowerCase().indexOf(lowerValue) !== -1) || (item[3] && item[3].toLowerCase().indexOf(lowerValue) !== -1))
    });
    return groups;
  }

  return (
    <div>
      <Header
        icon={IconLogo}
        label={words.ggtLogistics}
        searcher={searcher}
        languages={[
          {
            code: 'En',
            name: words.english,
            dateFormat: 'mm/dd/yyyy',
            moneySymbol: '$'
          }
        ]}
        menu={[
          {
            label: words.administration,
            options: [
              { icon: IconShipper, label: words.shippers, path: "/shippers" },
              { icon: IconTransporter, label: words.transporters, path: "/transporters" },
            ]
          },
          {
            label: words.management,
            options: [
              { icon: IconCustomer, label: words.customers, path: "/customers" },
              { icon: IconContract, label: words.contracts, path: "/contracts" },
              { icon: IconBooking, label: words.bookings, path: "/bookings" },
              { icon: IconCargo, label: words.cargos, path: "/cargos" },
            ]
          },
          {
            label: words.costs,
            options: [
              { icon: IconCost, label: words.costsByShipper, path: "/costs-by-shipper" },
              { icon: IconCost, label: words.costsByTransporter, path: "/costs-by-transporter" },
            ]
          },
          SecurityService.getAppSecurityMenuGroup(words)
        ]}
      />
      {error === null || error === undefined || (error instanceof Response && (error.status === 400 || error.status === 409)) || (!(error instanceof Response)) ?
        <div>
          <ReactRouterDOM.Switch>
            <ReactRouterDOM.Route exact path="/booking/:bookingId">
              <PageContextProvider>
                <Booking />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/bookings">
              <PageContextProvider>
                <Bookings />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/cargo/:cargoId">
              <PageContextProvider>
                <Cargo />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/cargos">
              <PageContextProvider>
                <Cargos />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/contract/:contractId">
              <PageContextProvider>
                <Contract />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/contract-costs/:contractId">
              <PageContextProvider>
                <ContractCosts />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/contracts">
              <PageContextProvider>
                <Contracts />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/costs-by-shipper">
              <PageContextProvider>
                <CostsByShipper />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/costs-by-transporter">
              <PageContextProvider>
                <CostsByTransporter />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/customers">
              <PageContextProvider>
                <Customers />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/">
              <PageContextProvider>
                <Home />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/shippers">
              <PageContextProvider>
                <Shippers />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            <ReactRouterDOM.Route exact path="/transporters">
              <PageContextProvider>
                <Transporters />
              </PageContextProvider>
            </ReactRouterDOM.Route>
            {SecurityService.getAppSecurityRoute()}
            <ReactRouterDOM.Route>
              <NotFound />
            </ReactRouterDOM.Route>
          </ReactRouterDOM.Switch>
          {error ?
            <ReactBootstrap.Modal
              contentClassName="popup"
              show={true}
              onHide={() => setError(null)}
              scrollable={true}
              centered={true}
              backdrop="static"
              keyboard={false}
            >
              <ReactBootstrap.Modal.Header className="popup-header">
                <Title icon={IconError} color="red" label={words.error} />
              </ReactBootstrap.Modal.Header>
              <ReactBootstrap.Modal.Body className="popup-body">
                <ErrorBox />
              </ReactBootstrap.Modal.Body>
              <ReactBootstrap.Modal.Footer className="popup-footer">
                <button className="btn-primary" onClick={(e) => setError(null)}>
                  {words.close}
                </button>
              </ReactBootstrap.Modal.Footer>
            </ReactBootstrap.Modal> :
            null
          }
        </div> :
        <UnexpectedError />
      }
    </div>
  );
})

export default App;
