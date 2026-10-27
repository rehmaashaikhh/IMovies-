import React from 'react';

const SeatLayout = ({
  bookedSeats = [],
  selectedSeats = [],
  onSeatToggle,
  selectedTier = 'middle',
  onTierChange,
  seatPrices = { balcony: 250, middle: 180, lower: 120 },
}) => {
  // Seat Tier Definitions
  const tiers = [
    {
      id: 'balcony',
      name: 'Balcony Section',
      price: seatPrices.balcony || 250,
      rows: ['A', 'B'],
      seatsPerRow: 10,
    },
    {
      id: 'middle',
      name: 'Middle Class',
      price: seatPrices.middle || 180,
      rows: ['C', 'D', 'E', 'F'],
      seatsPerRow: 10,
    },
    {
      id: 'lower',
      name: 'Lower Stall',
      price: seatPrices.lower || 120,
      rows: ['G', 'H'],
      seatsPerRow: 10,
    },
  ];

  const isSeatBooked = (seatId) => bookedSeats.includes(seatId);
  const isSeatSelected = (seatId) => selectedSeats.includes(seatId);

  return (
    <div className="cinema-hall-container py-3">
      {/* Curved Screen */}
      <div className="cinema-screen-container">
        <div className="cinema-screen"></div>
        <div className="cinema-screen-text">Screen This Way (Eyes Here)</div>
      </div>

      {/* Tier Selector Tabs */}
      <div className="d-flex justify-content-center gap-2 mb-4">
        {tiers.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`btn btn-sm ${
              selectedTier === t.id ? 'btn-cinema-red' : 'btn-outline-secondary text-light'
            } px-3`}
            onClick={() => onTierChange && onTierChange(t.id)}
          >
            {t.name} (₹{t.price})
          </button>
        ))}
      </div>

      {/* Seat Grids by Tier */}
      {tiers.map((tier) => (
        <div
          key={tier.id}
          className={`tier-section mb-4 p-3 rounded ${
            selectedTier === tier.id ? 'bg-dark border border-danger border-opacity-25' : 'opacity-75'
          }`}
        >
          <div className="d-flex justify-content-between align-items-center mb-2 px-2">
            <span className="text-light fw-bold small text-uppercase tracking-wider">
              {tier.name}
            </span>
            <span className="badge bg-danger bg-opacity-25 text-danger border border-danger border-opacity-50">
              ₹{tier.price} per seat
            </span>
          </div>

          {tier.rows.map((rowLetter) => (
            <div key={rowLetter} className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <span className="text-muted small fw-bold" style={{ width: '20px' }}>
                {rowLetter}
              </span>
              <div className="seat-grid">
                {Array.from({ length: tier.seatsPerRow }, (_, i) => {
                  const seatNumber = i + 1;
                  const seatId = `${rowLetter}${seatNumber}`;
                  const booked = isSeatBooked(seatId);
                  const selected = isSeatSelected(seatId);

                  return (
                    <button
                      key={seatId}
                      type="button"
                      disabled={booked}
                      className={`seat-btn ${selected ? 'selected' : ''} ${booked ? 'booked' : ''}`}
                      onClick={() => onSeatToggle(seatId, tier.id)}
                      title={
                        booked
                          ? `Seat ${seatId} is already booked`
                          : `Seat ${seatId} (₹${tier.price})`
                      }
                    >
                      {seatNumber}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ))}

      {/* Legend */}
      <div className="d-flex justify-content-center flex-wrap gap-4 pt-3 border-top border-secondary border-opacity-25">
        <div className="seat-legend-item">
          <div className="seat-legend-box" style={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.2)' }}></div>
          <span>Available</span>
        </div>
        <div className="seat-legend-item">
          <div className="seat-legend-box bg-danger"></div>
          <span>Selected</span>
        </div>
        <div className="seat-legend-item">
          <div className="seat-legend-box" style={{ backgroundColor: '#0f172a', opacity: 0.45 }}></div>
          <span>Reserved / Sold</span>
        </div>
      </div>
    </div>
  );
};

export default SeatLayout;
