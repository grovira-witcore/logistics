import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext.js';
import BookingTop from './BookingTop.js';
import BookingLeft1 from './BookingLeft1.js';
import BookingLeft2 from './BookingLeft2.js';
import BookingRight1 from './BookingRight1.js';
import BookingRight2 from './BookingRight2.js';
import ApiService from '../../services/ApiService.js';

const Booking = ReactRouterDOM.withRouter(function () {
  const { setError } = useAppContext();
  const { bookingId } = ReactRouterDOM.useParams();
  const [booking, setBooking] = React.useState(null);

  React.useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async function () {
    try {
      setBooking(await ApiService.getBooking(bookingId));
    }
    catch (error) {
      setError(error);
      return;
    }
  }
  
  if (booking === null || booking === undefined) {
    return (
      <div />
    );
  }
  
  return (
    <div>
      <div key={'id-' + bookingId} className="canvas">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 col-12 p-0">
              {booking ? (
                <div className="section">
                  <div>
                    <BookingTop booking={booking} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="col-lg-8 col-md-12 col-sm-12 col-12 p-0">
              {booking ? (
                <div className="section">
                  <div>
                    <BookingLeft1 booking={booking} />
                  </div>
                </div>
              ) : null}
              {booking ? (
                <div className="section">
                  <div>
                    <BookingLeft2 booking={booking} />
                  </div>
                </div>
              ) : null}
            </div>
            <div className="col-lg-4 col-md-12 col-sm-12 col-12 p-0">
              {booking ? (
                <div className="section">
                  <div>
                    <BookingRight1 booking={booking} />
                  </div>
                </div>
              ) : null}
              <div className="section">
                <div>
                  <BookingRight2 />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
})

export default Booking;
