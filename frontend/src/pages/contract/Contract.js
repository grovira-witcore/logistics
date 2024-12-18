import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import ContractTop from './ContractTop.js';
import ContractLeft1 from './ContractLeft1.js';
import ContractLeft2 from './ContractLeft2.js';
import ContractRight1 from './ContractRight1.js';
import ContractRight2 from './ContractRight2.js';
import ApiService from '../../services/ApiService.js';

const Contract = ReactRouterDOM.withRouter(function () {
  const { setError } = useAppContext();
  const { contractId } = ReactRouterDOM.useParams();
  const [contract, setContract] = React.useState(null);

  React.useEffect(() => {
    fetchContract();
  }, [contractId]);

  const fetchContract = async function () {
    try {
      setContract(await ApiService.getContract(contractId));
    }
    catch (error) {
      setError(error);
      return;
    }
  }
  
  if (contract === null || contract === undefined) {
    return (
      <div />
    );
  }
  
  return (
    <div>
      <div key={'id-' + contractId} className="canvas">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
              {contract ? (
                <div className="section">
                  <div>
                    <ContractTop contract={contract} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12 col-12 p-0">
              {contract ? (
                <div className="section">
                  <div>
                    <ContractLeft1 contract={contract} />
                  </div>
                </div>
              ) : null}
              {contract ? (
                <div className="section">
                  <div>
                    <ContractLeft2 contract={contract} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-12 p-0">
              {contract ? (
                <div className="section">
                  <div>
                    <ContractRight1 contract={contract} />
                  </div>
                </div>
              ) : null}
              <div className="section">
                <div>
                  <ContractRight2 />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default Contract;
