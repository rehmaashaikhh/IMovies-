import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { BiCheckCircle, BiPrinter, BiHomeAlt } from 'react-icons/bi';
import { HiTicket } from 'react-icons/hi';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-light">No Recent Booking Found</h4>
        <Link to="/movies" className="btn btn-cinema-red btn-sm mt-3">
          Explore Movies
        </Link>
      </div>
    );
  }

  const seats = booking.ticketsData?.seats || [];
  const tier = booking.ticketsData?.tier || 'middle';
  const totalAmount = booking.totalAmount || booking.ticketsData?.totalAmount || 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          {/* Success Banner */}
          <div className="text-center mb-4">
            <div className="text-success mb-2">
              <BiCheckCircle size={64} />
            </div>
            <h2 className="fw-bold text-light">Ticket Confirmed!</h2>
            <p className="text-muted">
              Your cinema booking has been recorded. Present this pass at the hall.
            </p>
          </div>

          {/* Printable Ticket Card */}
          <div className="ticket-card p-4 mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-danger px-3 py-1">iMovies Pass</span>
              <span className="badge bg-success bg-opacity-25 text-success border border-success">
                Confirmed
              </span>
            </div>

            <div className="text-center mb-3">
              <h3 className="fw-bold text-light mb-1">{booking.movieName}</h3>
              <p className="text-muted small mb-0">
                {booking.theatreName} &bull; {booking.showdate} at {booking.showtime}
              </p>
            </div>

            <div className="ticket-perforation"></div>

            <div className="row g-3 small text-muted my-2">
              <div className="col-6">
                <span className="d-block text-secondary">BOOKING REFERENCE</span>
                <strong className="text-light fs-6">{booking.bookingId}</strong>
              </div>
              <div className="col-6 text-end">
                <span className="d-block text-secondary">CLASS TIER</span>
                <strong className="text-danger text-capitalize fs-6">{tier}</strong>
              </div>
              <div className="col-6">
                <span className="d-block text-secondary">RESERVED SEATS</span>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {seats.map((s, idx) => (
                    <span key={idx} className="badge bg-danger px-2 py-1">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-6 text-end">
                <span className="d-block text-secondary">TOTAL AMOUNT</span>
                <strong className="text-light fs-5">₹{totalAmount}</strong>
              </div>
              <div className="col-12 mt-2 pt-2 border-top border-secondary border-opacity-25">
                <div className="d-flex justify-content-between align-items-center">
                  <span>Customer: <strong className="text-light">{booking.userName || booking.userEmail}</strong></span>
                  <span className="badge bg-dark border border-secondary text-info">{booking.paymentMethod || 'Paid'}</span>
                </div>
              </div>
            </div>

            <div className="ticket-perforation"></div>

            <div className="text-center">
              <div
                className="p-2 mb-2 bg-dark rounded d-inline-block border border-secondary border-opacity-50"
                style={{ letterSpacing: '4px', fontFamily: 'monospace', fontSize: '0.85rem' }}
              >
                ||| | |||| | ||| |||| | |||||| || |
              </div>
              <p className="text-muted small mb-0" style={{ fontSize: '0.75rem' }}>
                Scan digital pass at turnstile for express entry
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-flex flex-wrap justify-content-center gap-3">
            <button className="btn btn-cinema-red px-4 d-flex align-items-center gap-2" onClick={handlePrint}>
              <BiPrinter size={18} /> Print / Save Ticket
            </button>
            <Link to="/bookings" className="btn btn-cinema-outline px-4 d-flex align-items-center gap-2">
              <HiTicket size={18} /> View Your Bookings
            </Link>
            <Link to="/movies" className="btn btn-outline-secondary text-light px-3 d-flex align-items-center gap-1">
              <BiHomeAlt size={16} /> Book More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
