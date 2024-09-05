import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.js';
import UserBody1 from './UserBody1.js';
import UserBody2 from './UserBody2.js';
import ApiService from '../../services/ApiService.js';

const User = ReactRouterDOM.withRouter(function () {
  const { setError } = useAppContext();
  const { userId } = ReactRouterDOM.useParams();
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async function () {
    try {
      setUser(await ApiService.getUser(userId));
    }
    catch (error) {
      setError(error);
      return;
    }
  }
  
  if (user === null || user === undefined) {
    return (
      <div />
    );
  }
  
  return (
    <div>
      <div key={'id-' + userId} className="canvas">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
              {user ? (
                <div className="section">
                  <div>
                    <UserBody1 user={user} />
                  </div>
                </div>
              ) : null}
              {user ? (
                <div className="section">
                  <div>
                    <UserBody2 user={user} />
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

export default User;
