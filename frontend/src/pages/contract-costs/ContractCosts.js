import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import ContractCostsBody from './ContractCostsBody.js';
import ApiService from '../../services/ApiService.js';

const ContractCosts = ReactRouterDOM.withRouter(function () {
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
                    <ContractCostsBody contract={contract} />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default ContractCosts;
