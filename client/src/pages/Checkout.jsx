import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { bookingService } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import {
  BiCreditCard,
  BiQrScan,
  BiBuilding,
  BiCheckShield,
  BiCheckCircle,
  BiArrowBack,
  BiError,
} from 'react-icons/bi';

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const bookingState = location.state;

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestName, setGuestName] = useState(user?.username || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!bookingState || !bookingState.selectedSeats || bookingState.selectedSeats.length === 0) {
    return (
      <div className="container py-5 text-center">
        <h4 className="text-light mb-3">No Active Booking Session</h4>
        <p className="text-muted">Please select a movie and seats to proceed to checkout.</p>
        <Link to="/movies" className="btn btn-cinema-red btn-sm">
          Browse Movies
        </Link>
      </div>
    );
  }

  const { show, selectedSeats, selectedTier, pricePerSeat, subtotal, convenienceFee, totalAmount } =
    bookingState;

  const handleCompleteBooking = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    const emailToUse = user?.email || guestEmail.trim();
    const nameToUse = user?.username || guestName.trim() || 'Moviegoer';

    if (!emailToUse) {
      setErrorMessage('Please provide your email address to receive your tickets.');
      return;
    }

    setIsProcessing(true);

    const bookingPayload = {
      showId: show.showId || show._id,
      seats: selectedSeats,
      tier: selectedTier,
      paymentMethod:
        paymentMethod === 'upi'
          ? 'Demo UPI / QR'
          : paymentMethod === 'card'
          ? 'Demo Credit Card'
          : 'Demo NetBanking',
      userEmail: emailToUse,
      userName: nameToUse,
    };

    try {
      const response = await bookingService.createBooking(bookingPayload);
      if (response && response.success) {
        navigate('/confirmation', { state: { booking: response.data } });
        return;
      }
    } catch (err) {
      console.warn('Backend booking submission returned error:', err.message);

      // If database is offline, provide a smooth offline simulation ticket with clear notice
      if (err.message.includes('MongoDB is not connected') || err.message.includes('Cannot create booking')) {
        const simulatedBooking = {
          bookingId: 'BK-' + Math.floor(100000 + Math.random() * 900000),
          userEmail: emailToUse,
          userName: nameToUse,
          showId: show.showId || show._id,
          movieName: show.movieName,
          theatreName: show.theatreName,
          showdate: show.showdate,
          showtime: show.showtime,
          ticketsData: {
            seats: selectedSeats,
            tier: selectedTier,
            totalAmount,
            seatCount: selectedSeats.length,
            pricePerSeat,
          },
          totalAmount,
          paymentMethod: 'Demo Payment (Offline Mode)',
          paymentStatus: 'Paid (Simulated)',
          status: 'Confirmed',
          bookingDate: new Date().toISOString(),
          isSimulated: true,
        };

        // Save to local booking history so it shows up in "Your Bookings"
        const existingLocal = JSON.parse(localStorage.getItem('imovies_local_bookings') || '[]');
        localStorage.setItem('imovies_local_bookings', JSON.stringify([simulatedBooking, ...existingLocal]));

        navigate('/confirmation', { state: { booking: simulatedBooking } });
        return;
      }

      setErrorMessage(err.message || 'Booking failed. Seats may have been reserved by another user.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-4">
      <button
        onClick={() => navigate(-1)}
        className="btn btn-dark btn-sm border-secondary text-light mb-3 d-inline-flex align-items-center gap-1"
      >
        <BiArrowBack /> Change Seats
      </button>

      <div className="row g-4">
        {/* Left Column: Demo Payment Options */}
        <div className="col-lg-7">
          <div className="p-4 rounded-3 bg-dark border border-secondary border-opacity-25">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h4 className="fw-bold text-light mb-0">Select Payment Method</h4>
              <span className="badge bg-warning bg-opacity-25 text-warning border border-warning border-opacity-50">
                Demo Simulation
              </span>
            </div>

            <div className="alert alert-dark border-secondary bg-black bg-opacity-40 small mb-4">
              <BiCheckShield className="text-success me-2" size={18} />
              <strong>Sandbox Demo Mode:</strong> This checkout utilizes a safe mock payment gateway. No real credit card or bank details are ever processed or charged.
            </div>

            {/* Guest / Contact Details */}
            {!isAuthenticated && (
              <div className="mb-4 p-3 rounded bg-black bg-opacity-30 border border-secondary border-opacity-25">
                <h6 className="text-light fw-bold mb-3">Contact Information (for Ticket Delivery)</h6>
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Your Name</label>
                    <input
                      type="text"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      placeholder="e.g. John Doe"
                      value={guestName}
                      onChange={(e) => setGuestName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small text-muted">Email Address</label>
                    <input
                      type="email"
                      className="form-control form-control-sm bg-dark text-light border-secondary"
                      placeholder="e.g. user@example.com"
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Options Accordion */}
            <div className="d-flex flex-column gap-3 mb-4">
              {/* Option 1: UPI */}
              <div
                className={`p-3 rounded-3 border cursor-pointer ${
                  paymentMethod === 'upi' ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary bg-dark'
                }`}
                onClick={() => setPaymentMethod('upi')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <BiQrScan size={24} className={paymentMethod === 'upi' ? 'text-danger' : 'text-muted'} />
                    <div>
                      <strong className="text-light d-block">UPI / QR Code</strong>
                      <span className="text-muted small">Google Pay, PhonePe, Paytm, BHIM</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="form-check-input"
                  />
                </div>
              </div>

              {/* Option 2: Card */}
              <div
                className={`p-3 rounded-3 border cursor-pointer ${
                  paymentMethod === 'card' ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary bg-dark'
                }`}
                onClick={() => setPaymentMethod('card')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <BiCreditCard size={24} className={paymentMethod === 'card' ? 'text-danger' : 'text-muted'} />
                    <div>
                      <strong className="text-light d-block">Credit / Debit Card</strong>
                      <span className="text-muted small">Visa, MasterCard, RuPay</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="form-check-input"
                  />
                </div>
              </div>

              {/* Option 3: NetBanking */}
              <div
                className={`p-3 rounded-3 border cursor-pointer ${
                  paymentMethod === 'netbanking' ? 'border-danger bg-danger bg-opacity-10' : 'border-secondary bg-dark'
                }`}
                onClick={() => setPaymentMethod('netbanking')}
                style={{ cursor: 'pointer' }}
              >
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center gap-3">
                    <BiBuilding size={24} className={paymentMethod === 'netbanking' ? 'text-danger' : 'text-muted'} />
                    <div>
                      <strong className="text-light d-block">Net Banking</strong>
                      <span className="text-muted small">HDFC, ICICI, SBI, Axis, Kotak</span>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'netbanking'}
                    onChange={() => setPaymentMethod('netbanking')}
                    className="form-check-input"
                  />
                </div>
              </div>
            </div>

            {errorMessage && (
              <div className="alert alert-danger py-2 px-3 small d-flex align-items-center gap-2 mb-3">
                <BiError size={18} /> {errorMessage}
              </div>
            )}

            <button
              type="button"
              className="btn btn-cinema-red w-100 py-3 fw-bold fs-6 d-flex align-items-center justify-content-center gap-2"
              disabled={isProcessing}
              onClick={handleCompleteBooking}
            >
              {isProcessing ? (
                <>
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  Confirming Seats &amp; Processing Demo Payment...
                </>
              ) : (
                <>
                  <BiCheckCircle size={20} /> Pay ₹{totalAmount} &amp; Confirm Booking
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Order Review */}
        <div className="col-lg-5">
          <div className="p-4 rounded-3 bg-dark border border-secondary border-opacity-25 shadow-lg">
            <h5 className="fw-bold text-light mb-3">Order Details</h5>

            <div className="d-flex gap-3 mb-3">
              <div className="flex-grow-1">
                <h6 className="fw-bold text-light mb-1">{show.movieName}</h6>
                <p className="text-muted small mb-1">{show.theatreName}</p>
                <p className="text-warning small mb-0">{show.showdate} &bull; {show.showtime}</p>
              </div>
            </div>

            <hr className="border-secondary border-opacity-25" />

            <div className="mb-3 small">
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Class / Tier:</span>
                <span className="text-danger fw-bold text-capitalize">{selectedTier}</span>
              </div>
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Seats Selected:</span>
                <span className="text-light fw-bold">{selectedSeats.join(', ')}</span>
              </div>
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Ticket Count:</span>
                <span className="text-light">{selectedSeats.length} ticket(s)</span>
              </div>
            </div>

            <hr className="border-secondary border-opacity-25" />

            <div className="small mb-3">
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Subtotal ({selectedSeats.length} &times; ₹{pricePerSeat}):</span>
                <span className="text-light">₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Convenience &amp; GST:</span>
                <span className="text-light">₹{convenienceFee}</span>
              </div>
              <div className="d-flex justify-content-between text-light fw-bold fs-5 pt-2 border-top border-secondary border-opacity-50">
                <span>Total Payable:</span>
                <span className="text-danger">₹{totalAmount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
