import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import CargoTop from './CargoTop.js';
import CargoLeft1 from './CargoLeft1.js';
import CargoLeft2 from './CargoLeft2.js';
import CargoRight from './CargoRight.js';
import ApiService from '../../services/ApiService.js';

const Cargo = ReactRouterDOM.withRouter(function () {
  const { setError } = useAppContext();
  const { cargoId } = ReactRouterDOM.useParams();
  const [cargo, setCargo] = React.useState(null);

  React.useEffect(() => {
    fetchCargo();
  }, [cargoId]);

  const fetchCargo = async function () {
    try {
      setCargo(await ApiService.getCargo(cargoId));
    }
    catch (error) {
      setError(error);
      return;
    }
  }
  
  if (cargo === null || cargo === undefined) {
    return (
      <div />
    );
  }
  
  return (
    <div>
      <div key={'id-' + cargoId} className="canvas">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
              {cargo ? (
                <div className="section">
                  <div>
                    <CargoTop cargo={cargo} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12 col-12 p-0">
              {cargo ? (
                <div className="section">
                  <div>
                    <CargoLeft1 cargo={cargo} />
                  </div>
                </div>
              ) : null}
              {cargo ? (
                <div className="section">
                  <div>
                    <CargoLeft2 cargo={cargo} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-12 p-0">
              <div className="section">
                <div>
                  <CargoRight />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default Cargo;
