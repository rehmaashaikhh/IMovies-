import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { showService } from '../services/showService';
import { SAMPLE_SHOWS } from '../data/sampleMovies';
import SeatLayout from '../components/SeatLayout';
import Loader from '../components/Loader';
import { BiArrowBack, BiCheckCircle } from 'react-icons/bi';
import { HiTicket } from 'react-icons/hi';

const SeatSelection = () => {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedTier, setSelectedTier] = useState('middle');
  const [errorNotice, setErrorNotice] = useState('');

  useEffect(() => {
    fetchShowDetails();
  }, [showId]);

  const fetchShowDetails = async () => {
    setLoading(true);
    let foundShow = null;

    // Try finding in sample data first
    foundShow = SAMPLE_SHOWS.find((s) => s.showId === showId || s._id === showId);

    // Try backend API
    try {
      const response = await showService.getShowById(showId);
      if (response && response.data) {
        foundShow = response.data;
      }
    } catch {
      // Backend might be offline; foundShow remains fallback
    }

    if (!foundShow) {
      foundShow = SAMPLE_SHOWS[0];
    }

    setShow(foundShow);
    setLoading(false);
  };

  const handleSeatToggle = (seatId, tierId) => {
    setErrorNotice('');
    // Switch to clicked tier if not already active
    if (tierId !== selectedTier) {
      setSelectedTier(tierId);
    }

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
    } else {
      if (selectedSeats.length >= 8) {
        setErrorNotice('You can reserve a maximum of 8 seats per booking session.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const pricePerSeat =
    show?.seatPrices?.[selectedTier] ||
    (selectedTier === 'balcony' ? 250 : selectedTier === 'lower' ? 120 : 180);

  const subtotal = selectedSeats.length * pricePerSeat;
  const convenienceFee = selectedSeats.length > 0 ? Math.round(subtotal * 0.1) : 0;
  const totalAmount = subtotal + convenienceFee;

  const handleProceedToCheckout = () => {
    if (selectedSeats.length === 0) {
      setErrorNotice('Please select at least one seat to proceed.');
      return;
    }

    navigate('/checkout', {
      state: {
        show,
        selectedSeats,
        selectedTier,
        pricePerSeat,
        subtotal,
        convenienceFee,
        totalAmount,
      },
    });
  };

  if (loading) {
    return <Loader message="Loading theatre seating layout..." />;
  }

  if (!show) {
    return (
      <div className="container py-5 text-center">
        <h4>Show information unavailable</h4>
        <Link to="/movies" className="btn btn-cinema-red btn-sm mt-3">
          Return to Movies
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Top Header */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 pb-3 border-bottom border-secondary border-opacity-25">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-dark btn-sm border-secondary text-light mb-2 d-inline-flex align-items-center gap-1"
          >
            <BiArrowBack /> Back
          </button>
          <h2 className="fw-bold text-light mb-0">{show.movieName}</h2>
          <p className="text-muted small mb-0">
            {show.theatreName} &bull; <span className="text-warning">{show.showdate} at {show.showtime}</span>
          </p>
        </div>

        <div className="text-end mt-2 mt-sm-0">
          <span className="badge bg-danger fs-6 px-3 py-2">
            Tier: {selectedTier.toUpperCase()} (₹{pricePerSeat}/seat)
          </span>
        </div>
      </div>

      {errorNotice && (
        <div className="alert alert-warning py-2 px-3 small mb-3">
          {errorNotice}
        </div>
      )}

      {/* Main Seat Layout & Order Sidebar */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="p-4 rounded-3 bg-dark border border-secondary border-opacity-25">
            <SeatLayout
              bookedSeats={show.bookedSeats || []}
              selectedSeats={selectedSeats}
              onSeatToggle={handleSeatToggle}
              selectedTier={selectedTier}
              onTierChange={setSelectedTier}
              seatPrices={show.seatPrices || { balcony: 250, middle: 180, lower: 120 }}
            />
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="col-lg-4">
          <div className="p-4 rounded-3 bg-dark border border-danger border-opacity-35 shadow-lg sticky-top" style={{ top: '90px' }}>
            <h4 className="fw-bold text-light mb-3 d-flex align-items-center gap-2">
              <HiTicket className="text-danger" size={24} /> Booking Summary
            </h4>

            <div className="mb-3 small">
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Movie</span>
                <strong className="text-light">{show.movieName}</strong>
              </div>
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Theatre</span>
                <span className="text-light">{show.theatreName}</span>
              </div>
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Date &amp; Time</span>
                <span className="text-warning">{show.showdate}, {show.showtime}</span>
              </div>
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Selected Tier</span>
                <span className="text-danger text-capitalize fw-bold">{selectedTier}</span>
              </div>
            </div>

            <hr className="border-secondary border-opacity-25" />

            <div className="mb-3">
              <span className="text-muted small d-block mb-1">Selected Seats:</span>
              {selectedSeats.length === 0 ? (
                <span className="text-secondary small fst-italic">No seats chosen yet</span>
              ) : (
                <div className="d-flex flex-wrap gap-1">
                  {selectedSeats.map((seat) => (
                    <span key={seat} className="badge bg-danger px-2 py-1">
                      {seat}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-top border-secondary border-opacity-25 pt-3 mb-4 small">
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Tickets ({selectedSeats.length} &times; ₹{pricePerSeat})</span>
                <span className="text-light">₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-muted mb-1">
                <span>Cinema Convenience Fee</span>
                <span className="text-light">₹{convenienceFee}</span>
              </div>
              <div className="d-flex justify-content-between text-light fw-bold fs-5 mt-2 pt-2 border-top border-secondary border-opacity-50">
                <span>Total Amount:</span>
                <span className="text-danger">₹{totalAmount}</span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-cinema-red w-100 py-2 fw-bold d-flex align-items-center justify-content-center gap-2"
              disabled={selectedSeats.length === 0}
              onClick={handleProceedToCheckout}
            >
              <BiCheckCircle size={18} /> Proceed to Payment
            </button>
            <p className="text-center text-muted small mt-2 mb-0" style={{ fontSize: '0.75rem' }}>
              Seats will be locked during checkout simulation
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
