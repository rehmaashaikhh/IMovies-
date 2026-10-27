import React from 'react';
import { BiCameraMovie, BiCheckCircle, BiPrinter, BiX } from 'react-icons/bi';
import { HiTicket } from 'react-icons/hi';

const TicketModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  const seats = booking.ticketsData?.seats || [];
  const tier = booking.ticketsData?.tier || 'middle';
  const totalAmount = booking.totalAmount || booking.ticketsData?.totalAmount || 0;

  return (
    <div
      className="modal fade show d-block"
      tabIndex="-1"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', zIndex: 1100 }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-transparent border-0">
          <div className="ticket-card p-4">
            {/* Close Button */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="badge bg-success bg-opacity-25 text-success border border-success d-flex align-items-center gap-1">
                <BiCheckCircle /> Booking Confirmed
              </span>
              <button
                type="button"
                className="btn btn-sm btn-outline-light rounded-circle"
                onClick={onClose}
              >
                <BiX size={20} />
              </button>
            </div>

            {/* Ticket Header */}
            <div className="text-center mb-3">
              <h4 className="fw-bold text-light mb-1">{booking.movieName || 'Cinema Booking'}</h4>
              <p className="text-muted small mb-0">
                {booking.theatreName} &bull; {booking.showdate} at {booking.showtime}
              </p>
            </div>

            {/* Perforation Line */}
            <div className="ticket-perforation"></div>

            {/* Ticket Details */}
            <div className="row g-3 small text-muted my-2">
              <div className="col-6">
                <span className="d-block text-secondary">BOOKING ID</span>
                <strong className="text-light fs-6">{booking.bookingId}</strong>
              </div>
              <div className="col-6 text-end">
                <span className="d-block text-secondary">TIER / CLASS</span>
                <strong className="text-danger text-capitalize fs-6">{tier}</strong>
              </div>
              <div className="col-6">
                <span className="d-block text-secondary">SEATS</span>
                <div className="d-flex flex-wrap gap-1 mt-1">
                  {seats.map((seat, i) => (
                    <span key={i} className="badge bg-danger px-2 py-1">
                      {seat}
                    </span>
                  ))}
                </div>
              </div>
              <div className="col-6 text-end">
                <span className="d-block text-secondary">TOTAL AMOUNT</span>
                <strong className="text-light fs-5">₹{totalAmount}</strong>
              </div>
              <div className="col-12 mt-2 pt-2 border-top border-secondary border-opacity-25">
                <div className="d-flex justify-content-between">
                  <span>Guest: <strong className="text-light">{booking.userName || booking.userEmail}</strong></span>
                  <span className="badge bg-dark border border-secondary text-info">{booking.paymentMethod || 'Paid'}</span>
                </div>
              </div>
            </div>

            {/* Ticket Perforation */}
            <div className="ticket-perforation"></div>

            {/* Barcode & Print Action */}
            <div className="text-center">
              <div
                className="p-2 mb-3 bg-dark rounded d-inline-block border border-secondary border-opacity-50"
                style={{ letterSpacing: '4px', fontFamily: 'monospace', fontSize: '0.85rem' }}
              >
                ||| | |||| | ||| |||| | |||||| || |
              </div>
              <p className="text-muted small mb-3">Scan this digital pass at the cinema turnstile</p>

              <div className="d-flex justify-content-center gap-2">
                <button className="btn btn-cinema-red btn-sm px-4" onClick={handlePrint}>
                  <BiPrinter className="me-1" size={16} /> Print / Save Ticket
                </button>
                <button className="btn btn-cinema-outline btn-sm px-3" onClick={onClose}>
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketModal;
