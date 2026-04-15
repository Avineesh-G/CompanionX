import React, { useState } from 'react';
import {
  MapPin, Calendar, Users, Search,
  ShieldCheck, Star, Shield, MessageSquare, UserCheck,
  CheckCircle2, ArrowRight, Check, Zap, Bus, CreditCard, Wallet, AlertTriangle
} from 'lucide-react';

const CITIES = [
  "New Delhi",
  "Mumbai",
  "Bangalore",
  "Pune",
  "Jaipur",
  "Hyderabad",
  "Chennai",
  "Kolkata",
  "Ahmedabad",
  "Goa",
  "Chandigarh",
  "Lucknow",
  "Gurgaon",
  "Noida",
  "Indore"
];

function LocationInput({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  icon: Icon,
  iconColorClass
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
  icon: React.ElementType;
  iconColorClass: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex-1 w-full relative">
      <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
      <div className="relative">
        <Icon className={`absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 ${iconColorClass}`} />
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none transition-all font-medium"
          value={isOpen ? search : value}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => { setIsOpen(true); setSearch(value); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {isOpen && filteredCities.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-[100] max-h-60 overflow-y-auto">
            {filteredCities.map((city) => (
              <button 
                key={city}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors text-sm font-medium border-b last:border-b-0 border-gray-50"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(city);
                  setSearch(city);
                  setIsOpen(false);
                }}
              >
                <MapPin className="w-4 h-4 text-gray-400" />
                {city}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [saveMoneyMode, setSaveMoneyMode] = useState(true);
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [isSearched, setIsSearched] = useState(false);
  const [selectedBus, setSelectedBus] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [passengerCount, setPassengerCount] = useState<number>(1);

  const handleSeatSelect = (seat: string) => {
    if (selectedSeats.includes(seat)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seat));
      return;
    }
    
    if (selectedSeats.length >= passengerCount && passengerCount === 1) {
      setSelectedSeats([seat]);
      return;
    }
    
    let newSeats = [...selectedSeats, seat];
    
    // Auto-select adjacent seat if passenger count is 2 and we need another seat
    if (passengerCount === 2 && newSeats.length === 1) {
      let adjacentSeat: string | null = null;
      const row = seat.charAt(0);
      const col = seat.charAt(1);
      
      if (col === 'B') adjacentSeat = `${row}C`;
      else if (col === 'C') adjacentSeat = `${row}B`;
      else if (col === 'A') adjacentSeat = `${parseInt(row)+1}A`;
      
      const isBooked = (s: string) => ['2A','5A','1B','4B','1C','3C','6C'].includes(s) || parseInt(s.charAt(0)) > 6;
      
      if (adjacentSeat && !isBooked(adjacentSeat)) {
        newSeats.push(adjacentSeat);
      }
    } else if (newSeats.length > passengerCount) {
      newSeats = [seat];
    }
    
    setSelectedSeats(newSeats);
  };

  return (
    <div className="min-h-screen bg-soft-white font-body text-navy overflow-x-hidden pt-20">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className="bg-coral text-white p-1.5 rounded-lg shadow-sm">
              <Bus className="w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl md:text-2xl text-navy">CompanionX</span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-navy/80">
            <a href="#how-it-works" className="hover:text-coral transition-colors">How it Works</a>
            <a href="#trust" className="hover:text-coral transition-colors">Trust & Safety</a>
            <a href="#pricing" className="hover:text-coral transition-colors">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-semibold text-navy hover:text-coral transition-colors">Log In</button>
            <button className="bg-coral text-white px-5 py-2.5 rounded-full text-sm font-bold shadow-md hover:bg-orange-600 transition-all hover:shadow-lg">
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-12 pb-56 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-sm font-medium mb-6 transition-transform hover:scale-105">
                <Zap className="w-4 h-4" />
                <span>Save up to 40% on every trip</span>
              </div>
              <h1 className="font-display text-5xl md:text-6xl font-black leading-tight tracking-tight text-navy mb-6">
                Share the ride. <br />
                <span className="text-coral">Split the fare.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-xl">
                Match with verified co-travelers heading the same way, save money automatically, and enjoy a smarter way to travel by bus.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button className="bg-coral text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
                  Find My Ride
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="bg-white text-navy border-2 border-gray-200 px-8 py-4 rounded-full font-bold text-lg hover:border-navy transition-all flex items-center justify-center">
                  How it Works
                </button>
              </div>

              <div className="flex items-center gap-6 text-sm font-medium text-gray-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  100% Verified Profiles
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  4.8/5 Average Rating
                </div>
              </div>
            </div>

            {/* Hero Image / UI Preview */}
            <div className="relative z-10 hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-coral/20 to-blue-500/10 rounded-[3rem] blur-3xl" />
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80" alt="Bus travel" className="rounded-2xl object-cover h-[500px] w-full" />

                {/* Floating Savings Tag */}
                <div className="absolute bottom-12 -left-10 z-40 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 animate-bounce cursor-default" style={{ animationDuration: '3s' }}>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Wallet className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">You Saved</p>
                      <p className="text-xl font-black text-green-600">₹450 today!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Smart Search Bar */}
        <div className="absolute left-0 right-0 -bottom-28 w-full px-6 z-30">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-4 md:p-6 transition-shadow hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)]">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <LocationInput 
                label="From" 
                placeholder="Departure city" 
                value={fromCity} 
                onChange={(val) => { setFromCity(val); setIsSearched(false); }} 
                icon={MapPin} 
                iconColorClass="text-gray-400" 
              />
              <LocationInput 
                label="To" 
                placeholder="Arrival city" 
                value={toCity} 
                onChange={(val) => { setToCity(val); setIsSearched(false); }} 
                icon={MapPin} 
                iconColorClass="text-coral" 
              />
              <div className="flex-1 w-full relative">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="date" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none transition-all font-medium text-gray-500" />
                </div>
              </div>
              <div className="flex-1 w-full relative">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Seats</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-coral focus:ring-2 focus:ring-coral/20 outline-none transition-all font-medium appearance-none"
                    value={passengerCount}
                    onChange={(e) => {
                      setPassengerCount(parseInt(e.target.value));
                      setSelectedSeats([]); // reset seats on passenger change
                    }}
                  >
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                  </select>
                </div>
              </div>
              <button 
                className="w-full md:w-auto bg-coral text-white px-8 py-3 rounded-xl font-bold hover:bg-orange-600 transition-colors h-[48px] flex items-center justify-center shadow-md"
                onClick={() => {
                  if (fromCity && toCity) setIsSearched(true);
                  else alert("Please select both Departure and Arrival cities!");
                }}
              >
                Search
              </button>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center bg-green-50/50 p-3 rounded-xl border-dashed border border-green-200">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-1.5 rounded-md">
                  <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div className="text-sm font-semibold text-gray-700">
                  Find Travel Companion (Save up to 40%)
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={saveMoneyMode}
                  onChange={() => setSaveMoneyMode(!saveMoneyMode)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results Display */}
      {!isSearched ? (
        <div className="h-40 md:h-56"></div>
      ) : (
        <div className="pt-40 pb-20 px-6 bg-gray-50/50 w-full relative z-20 border-b border-gray-100">
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-black text-navy mb-1">Available Buses</h2>
                <p className="text-gray-500 font-medium">{fromCity} to {toCity} • {saveMoneyMode ? "Companion Savings Enabled" : "Standard Booking"}</p>
              </div>
              <div className="text-right">
                <span className="bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-lg text-sm border border-green-200">
                  {saveMoneyMode ? 'Saving Mode ON' : 'Prices standard'}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-6">
              {/* Bus Card 1 */}
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-shadow">
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                   <div className="w-full md:w-1/4">
                     <h3 className="font-bold text-lg text-navy leading-none mb-1.5">Zingbus Premium</h3>
                     <p className="text-sm text-gray-500 font-medium">A/C Sleeper (2+1)</p>
                     <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                       <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                       <span className="font-bold text-gray-700">4.8</span>
                       <span>(120 reviews)</span>
                     </div>
                   </div>
                   <div className="flex-1 w-full flex items-center justify-between md:justify-center gap-4 bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-100">
                     <div className="text-center w-16 shrink-0">
                       <p className="font-bold text-xl text-navy">21:00</p>
                     </div>
                     <div className="flex-1 flex flex-col items-center max-w-[150px]">
                       <p className="text-xs text-gray-400 font-bold mb-1">8h 30m</p>
                       <div className="w-full flex items-center justify-center">
                         <div className="w-full border-t border-gray-300"></div>
                         <Bus className="w-4 h-4 text-gray-400 mx-2 shrink-0" />
                         <div className="w-full border-t border-dashed border-gray-300"></div>
                       </div>
                     </div>
                     <div className="text-center w-16 shrink-0">
                       <p className="font-bold text-xl text-navy">05:30</p>
                     </div>
                   </div>
                   <div className="w-full md:w-auto text-left md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                     <div>
                       <div className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md inline-block mb-1 border border-red-100">12 Seats left</div>
                       <div className="flex items-end justify-start md:justify-end gap-2 mt-1">
                         {saveMoneyMode && <p className="text-sm text-gray-400 line-through mb-1">₹850</p>}
                         <p className="font-display font-black text-3xl text-navy">₹{saveMoneyMode ? '450' : '850'}</p>
                       </div>
                     </div>
                     <button 
                       className={`mt-1 text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-md ${selectedBus === 'zingbus' ? 'bg-gray-100 text-navy hover:bg-gray-200 shadow-none' : 'bg-navy text-white hover:bg-gray-800 shadow-navy/20'}`}
                       onClick={() => { setSelectedBus(selectedBus === 'zingbus' ? null : 'zingbus'); setSelectedSeats([]); }}
                     >
                       {selectedBus === 'zingbus' ? 'Hide Seats' : (saveMoneyMode ? 'Match & Book' : 'Book Now')}
                     </button>
                   </div>
                 </div>
                 {/* Zingbus Seat Map */}
                 {selectedBus === 'zingbus' && (
                   <div className="mt-6 pt-6 border-t border-gray-100 animate-fade-in">
                     <div className="flex flex-col md:flex-row gap-8">
                       <div className="flex-1">
                         <div className="flex justify-between items-center mb-6">
                           <h4 className="font-bold text-navy text-lg">Select your seat</h4>
                           <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-wide">
                              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-gray-200 rounded"></div> Booked</div>
                              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 border-2 border-gray-300 bg-white rounded"></div> Available</div>
                              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 bg-coral rounded shadow-sm shadow-coral/30"></div> Selected</div>
                           </div>
                         </div>
                         <div className="bg-gray-50/80 border border-gray-200 rounded-2xl p-6 md:p-8 flex justify-center">
                            <div className="w-full max-w-[200px]">
                                <div className="flex justify-end mb-8 border-b-2 border-gray-300 pb-4">
                                  {/* Steering wheel icon placeholder */}
                                  <div className="w-8 h-8 rounded-full border-4 border-gray-300 flex items-center justify-center">
                                    <div className="w-1 h-3 bg-gray-300"></div>
                                  </div>
                                </div>
                                <div className="flex gap-6 justify-between">
                                   <div className="flex flex-col gap-3">
                                     {['1A','2A','3A','4A','5A','6A'].map(seat => {
                                        const isBooked = seat === '2A' || seat === '5A';
                                        const isSelected = selectedSeats.includes(seat);
                                        return (
                                          <button 
                                            key={seat}
                                            disabled={isBooked}
                                            onClick={() => handleSeatSelect(seat)}
                                            className={`w-10 h-14 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                              isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-transparent' : 
                                              isSelected ? 'bg-coral text-white border-coral shadow-md shadow-coral/30 -translate-y-0.5' : 
                                              'bg-white text-gray-400 border-2 border-gray-300 hover:border-coral hover:text-coral'
                                            }`}
                                          >
                                            {seat}
                                          </button>
                                        )
                                     })}
                                   </div>
                                   <div className="w-4"></div>
                                   <div className="flex gap-2">
                                     <div className="flex flex-col gap-3">
                                       {['1B','2B','3B','4B','5B','6B'].map(seat => {
                                          const isBooked = seat === '1B' || seat === '4B';
                                          const isSelected = selectedSeats.includes(seat);
                                          return (
                                            <button 
                                              key={seat}
                                              disabled={isBooked}
                                              onClick={() => handleSeatSelect(seat)}
                                              className={`w-10 h-14 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                                isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-transparent' : 
                                                isSelected ? 'bg-coral text-white border-coral shadow-md shadow-coral/30 -translate-y-0.5' : 
                                                'bg-white text-gray-400 border-2 border-gray-300 hover:border-coral hover:text-coral'
                                              }`}
                                            >
                                              {seat}
                                            </button>
                                          )
                                       })}
                                     </div>
                                     <div className="flex flex-col gap-3">
                                       {['1C','2C','3C','4C','5C','6C'].map(seat => {
                                          const isBooked = seat === '1C' || seat === '3C' || seat === '6C';
                                          const isSelected = selectedSeats.includes(seat);
                                          return (
                                            <button 
                                              key={seat}
                                              disabled={isBooked}
                                              onClick={() => handleSeatSelect(seat)}
                                              className={`w-10 h-14 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                                                isBooked ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-transparent' : 
                                                isSelected ? 'bg-coral text-white border-coral shadow-md shadow-coral/30 -translate-y-0.5' : 
                                                'bg-white text-gray-400 border-2 border-gray-300 hover:border-coral hover:text-coral'
                                              }`}
                                            >
                                              {seat}
                                            </button>
                                          )
                                       })}
                                     </div>
                                   </div>
                                </div>
                            </div>
                         </div>
                       </div>
                       
                       <div className="flex-1 flex flex-col justify-end">
                         <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 h-full flex flex-col justify-center">
                           <h4 className="font-bold text-navy text-xl mb-4">Journey Summary</h4>
                           <div className="space-y-3 mb-8 flex-1">
                             <div className="flex justify-between text-sm">
                               <span className="text-gray-500 text-base">Seat No.</span>
                               <span className="font-bold text-navy text-base">{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'Not selected'}</span>
                             </div>
                             <div className="flex justify-between text-sm">
                               <span className="text-gray-500 text-base">Base Fare</span>
                               <span className="font-bold text-navy text-base">₹{850 * passengerCount}</span>
                             </div>
                             {saveMoneyMode && (
                               <div className="flex justify-between text-sm bg-green-50 p-3 -mx-3 rounded-lg">
                                 <span className="text-green-700 font-bold flex items-center gap-1.5"><Zap className="w-4 h-4"/> Companion Matching Savings</span>
                                 <span className="font-bold text-green-700 text-base">-₹{400 * passengerCount}</span>
                               </div>
                             )}
                             <div className="pt-4 mt-2 border-t border-blue-200/60 flex justify-between font-black text-2xl">
                               <span className="text-navy">Total Pay</span>
                               <span className="text-navy">₹{selectedSeats.length > 0 ? (saveMoneyMode ? 450 * passengerCount : 850 * passengerCount) : '0'}</span>
                             </div>
                           </div>
                           <button 
                             disabled={selectedSeats.length !== passengerCount}
                             className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg text-lg ${selectedSeats.length === passengerCount ? 'bg-coral text-white hover:bg-orange-600 shadow-coral/30 hover:-translate-y-0.5' : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
                             onClick={() => alert('Demo checkout starting...')}
                           >
                             {selectedSeats.length === passengerCount ? 'Confirm Booking' : `Select ${passengerCount - selectedSeats.length} more seat${passengerCount - selectedSeats.length > 1 ? 's' : ''}`}
                             {selectedSeats.length === passengerCount && <ArrowRight className="w-5 h-5" />}
                           </button>
                         </div>
                       </div>
                     </div>
                   </div>
                 )}
              </div>

              {/* Bus Card 2 */}
              <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-200 shadow-sm hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-shadow">
                 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                   <div className="w-full md:w-1/4">
                     <h3 className="font-bold text-lg text-navy leading-none mb-1.5">IntrCity SmartBus</h3>
                     <p className="text-sm text-gray-500 font-medium">A/C Seater (2+2)</p>
                     <div className="flex items-center gap-1 mt-2 text-sm text-gray-500">
                       <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                       <span className="font-bold text-gray-700">4.5</span>
                       <span>(84 reviews)</span>
                     </div>
                   </div>
                   <div className="flex-1 w-full flex items-center justify-between md:justify-center gap-4 bg-gray-50/50 px-4 py-3 rounded-xl border border-gray-100">
                     <div className="text-center w-16 shrink-0">
                       <p className="font-bold text-xl text-navy">22:30</p>
                     </div>
                     <div className="flex-1 flex flex-col items-center max-w-[150px]">
                       <p className="text-xs text-gray-400 font-bold mb-1">8h 00m</p>
                       <div className="w-full flex items-center justify-center">
                         <div className="w-full border-t border-gray-300"></div>
                         <Bus className="w-4 h-4 text-gray-400 mx-2 shrink-0" />
                         <div className="w-full border-t border-dashed border-gray-300"></div>
                       </div>
                     </div>
                     <div className="text-center w-16 shrink-0">
                       <p className="font-bold text-xl text-navy">06:30</p>
                     </div>
                   </div>
                   <div className="w-full md:w-auto text-left md:text-right flex flex-row md:flex-col justify-between items-center md:items-end">
                     <div>
                       <div className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-md inline-block mb-1 border border-green-100">24 Seats left</div>
                       <div className="flex items-end justify-start md:justify-end gap-2 mt-1">
                         {saveMoneyMode && <p className="text-sm text-gray-400 line-through mb-1">₹650</p>}
                         <p className="font-display font-black text-3xl text-navy">₹{saveMoneyMode ? '350' : '650'}</p>
                       </div>
                     </div>
                     <button 
                       className={`mt-1 text-sm font-bold py-2.5 px-6 rounded-xl transition-all shadow-md ${selectedBus === 'intrcity' ? 'bg-gray-100 text-navy hover:bg-gray-200 shadow-none' : 'bg-navy text-white hover:bg-gray-800 shadow-navy/20'}`}
                       onClick={() => { setSelectedBus(selectedBus === 'intrcity' ? null : 'intrcity'); setSelectedSeats([]); }}
                     >
                       {selectedBus === 'intrcity' ? 'Hide Seats' : (saveMoneyMode ? 'Match & Book' : 'Book Now')}
                     </button>
                   </div>
                 </div>
                 {selectedBus === 'intrcity' && (
                    <div className="mt-6 pt-6 border-t border-gray-100 text-center py-8">
                       <p className="text-gray-500 font-medium pb-4">Layout for IntrCity SmartBus is loading...</p>
                    </div>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Matching Feature UI (Wow Factor) */}
      <section className="py-20 px-6 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* UI Mockup Card */}
            <div className="relative">
              <div className="absolute inset-0 bg-coral/5 rounded-full blur-3xl transform -translate-x-1/4"></div>
              <div className="bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-100 p-6 md:p-8 max-w-md mx-auto relative z-10 transform transition-transform hover:-translate-y-2">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-bold text-lg text-navy">Your Perfect Match</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-md">98% Route Match</span>
                </div>

                {/* Route */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100">
                  <div className="flex items-center justify-between relative">
                    <div className="z-10 bg-gray-50 pr-2">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">From</p>
                      <p className="font-bold text-lg text-navy leading-none">New Delhi</p>
                      <p className="text-xs text-gray-400 mt-1 font-medium">10:00 AM</p>
                    </div>
                    <div className="absolute left-1/2 w-full -translate-x-1/2 border-t-2 border-dashed border-gray-300"></div>
                    <Bus className="w-5 h-5 text-coral absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-50 px-0.5 z-10" />
                    <div className="text-right z-10 bg-gray-50 pl-2">
                      <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">To</p>
                      <p className="font-bold text-lg text-navy leading-none">Jaipur</p>
                      <p className="text-xs text-gray-400 mt-1 font-medium">03:30 PM</p>
                    </div>
                  </div>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=faces" alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" />
                    <div className="absolute bottom-0 right-0 bg-blue-500 p-1 rounded-full border-2 border-white" title="Verified Profile">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-navy leading-tight mb-1">Priya K.</h4>
                    <div className="flex items-center gap-1.5 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-navy ml-1">4.9</span>
                      </div>
                      <span className="text-gray-300">•</span>
                      <span className="font-medium text-gray-500">42 trips</span>
                    </div>
                  </div>
                </div>

                {/* Savings section */}
                <div className="bg-green-500 text-white rounded-xl p-5 mb-6 text-center transform hover:scale-105 transition-transform shadow-lg shadow-green-500/30">
                  <p className="text-sm font-medium opacity-90 mb-1">By traveling together, you save</p>
                  <p className="text-4xl font-black">₹350</p>
                </div>

                <button className="w-full bg-navy text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition-colors shadow-lg shadow-navy/20 active:scale-[0.98]">
                  Connect & Split Fare
                </button>
              </div>
            </div>

            <div className="max-w-xl">
              <h2 className="font-display text-4xl md:text-5xl font-black text-navy mb-6 leading-tight">
                Stop paying for <br />
                <span className="text-coral">empty seats.</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Our smart matching algorithm pairs you with verified travelers heading to the exact same destination at the same time. You split the bill, and we handle the math.
              </p>

              <ul className="space-y-5">
                {[
                  "Save up to 40% on luxury bus tickets.",
                  "Automated fair splitting – no awkward money talks.",
                  "Verified profiles only for complete peace of mind.",
                  "Optional secure chat to coordinate timings."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-4">
                    <div className="bg-green-100 p-1.5 rounded-full mt-0.5 shrink-0">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700 font-medium text-lg leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-black text-navy mb-4">How it works</h2>
            <p className="text-lg text-gray-600">Three simple steps to cheaper and smarter travel.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 border shadow-sm text-blue-500 relative z-10">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-navy mb-3 relative z-10">1. Find Your Bus</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                Enter your route and date. Select from hundreds of premium and standard bus options listed.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-coral/5 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 border shadow-sm text-coral relative z-10">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-navy mb-3 relative z-10">2. Get Matched</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                Turn on "Find Companion" and we'll instantly suggest trusted travelers on the exact same route.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-50 rounded-bl-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 border shadow-sm text-green-500 relative z-10">
                <CreditCard className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-navy mb-3 relative z-10">3. Split & Travel</h3>
              <p className="text-gray-600 leading-relaxed relative z-10">
                Confirm your match, let our app securely split the bill automatically, and enjoy the ride.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section id="trust" className="py-24 px-6 bg-navy text-white relative overflow-hidden">
        {/* Background Patterns */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-500/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-coral/5 blur-[100px] rounded-full" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-sm font-medium mb-6">
                <Shield className="w-4 h-4" />
                <span>Your safety is our priority</span>
              </div>
              <h2 className="font-display text-4xl md:text-5xl font-black mb-6 leading-tight">
                Travel with total <br /> peace of mind.
              </h2>
              <p className="text-lg text-white/70 mb-10 leading-relaxed max-w-lg">
                We've built a multi-layered security system to ensure every journey is safe and comfortable. Only travel with people you can trust.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <UserCheck className="w-8 h-8 text-blue-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Verified Profiles</h4>
                  <p className="text-sm text-white/60">Phone, email, and strictly vetted Govt ID verification required for all.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <Star className="w-8 h-8 text-yellow-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">Two-way Ratings</h4>
                  <p className="text-sm text-white/60">Community feedback keeps standards high and holds users accountable.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <MessageSquare className="w-8 h-8 text-coral mb-4" />
                  <h4 className="font-bold text-lg mb-2">Secure Chat</h4>
                  <p className="text-sm text-white/60">Communicate safely in-app without ever sharing personal phone numbers.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                  <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
                  <h4 className="font-bold text-lg mb-2">24/7 Support</h4>
                  <p className="text-sm text-white/60">Zero-tolerance policy with instant report & block features available 24/7.</p>
                </div>
              </div>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent z-10 rounded-3xl" />
              <img src="/images/safe_travel_new.jpg" alt="Safe travel" className="w-full max-w-md object-cover h-[600px] border border-white/10 rounded-[3rem] shadow-2xl" />
              {/* Safety Float */}
              <div className="absolute bottom-12 -left-8 bg-white text-navy p-4 rounded-2xl shadow-2xl z-20 items-center gap-3 hidden sm:flex">
                <div className="bg-blue-100 p-2 rounded-full">
                  <ShieldCheck className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="font-bold text-sm">Govt ID Verified</p>
                  <p className="text-xs text-gray-500">Secure ecosystem</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subscription Section */}
      <section id="pricing" className="py-24 px-6 bg-white shrink-0">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-black text-navy mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600">Choose the plan that fits your travel style. Save money at every level.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-center">
            {/* Free */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="font-display text-2xl font-bold mb-2">Free</h3>
              <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">Pay as you go</p>
              <div className="font-display text-4xl font-black mb-8 text-navy">₹0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 min-h-[220px]">
                {["Standard matching", "Basic split fares", "Secure in-app chat", "Standard platform fee applicable"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-gray-100 text-navy hover:bg-gray-200 transition-colors">Current Plan</button>
            </div>

            {/* Pro */}
            <div className="bg-navy text-white p-8 rounded-3xl border border-coral shadow-[0_20px_50px_rgba(255,106,61,0.2)] relative transform md:-translate-y-4">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-coral text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md">
                Most Popular
              </div>
              <h3 className="font-display text-2xl font-bold mb-2">Pro</h3>
              <p className="text-white/70 text-sm mb-6 pb-6 border-b border-white/10">For regular travelers</p>
              <div className="font-display text-4xl font-black mb-8">₹149<span className="text-lg text-white/70 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 min-h-[220px]">
                {["10% Platform fee discount", "Priority matching alerts", "Verified 'Pro' Badge", "Zero cancellation fees", "Premium support access"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-white/90 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-coral shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-coral text-white hover:bg-orange-600 transition-colors shadow-lg shadow-coral/30">Upgrade to Pro</button>
            </div>

            {/* Elite */}
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
              <h3 className="font-display text-2xl font-bold mb-2">Elite</h3>
              <p className="text-gray-500 text-sm mb-6 pb-6 border-b border-gray-100">Ultimate flexibility</p>
              <div className="font-display text-4xl font-black mb-8 text-navy">₹399<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <ul className="space-y-4 mb-8 min-h-[220px]">
                {["Zero platform fees ever", "Advanced matching filters", "Priority vehicle seating", "Waitlist skipping power", "Dedicated account manager"].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-gray-700 font-medium">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="w-full py-4 rounded-xl font-bold bg-gray-100 text-navy hover:bg-gray-200 transition-colors">Get Elite</button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-coral py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl font-black text-white mb-6">Ready to save on your next trip?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">Join thousands of travelers who are paying less and enjoying their journeys more.</p>
          <button className="bg-white text-coral px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-colors shadow-xl hover:shadow-2xl">
            Create Free Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy border-t border-white/10 py-12 px-6 text-white pt-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 border-b border-white/10 pb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="bg-coral p-1 rounded-md">
                  <Bus className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-bold text-xl">CompanionX</span>
              </div>
              <p className="text-white/60 text-sm max-w-sm leading-relaxed">
                The smartest way to travel. Splitting fares, making connections, and saving money simultaneously while ensuring 100% verified security.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white/90">Platform</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-coral transition-colors">How it works</a></li>
                <li><a href="#" className="hover:text-coral transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-coral transition-colors">Trust & Safety</a></li>
                <li><a href="#" className="hover:text-coral transition-colors">Route Map</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-white/90">Company</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><a href="#" className="hover:text-coral transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-coral transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-coral transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-coral transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/40">
            <p>© 2026 CompanionX. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Made with ❤️ for smart travelers.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
