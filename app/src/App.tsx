import React, { useState } from 'react';
import {
  MapPin, Calendar, Users,
  ShieldCheck, Star, Shield, MessageSquare, UserCheck,
  CheckCircle2, ArrowRight, Check, Zap, Bus, AlertTriangle,
  Sparkles, Award
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
      <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      <div className="relative">
        <Icon className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 ${iconColorClass}`} />
        <input 
          type="text" 
          placeholder={placeholder} 
          className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-medium text-slate-800 placeholder-slate-400"
          value={isOpen ? search : value}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => { setIsOpen(true); setSearch(value); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        />
        {isOpen && filteredCities.length > 0 && (
          <div className="absolute top-full left-0 mt-2 w-full bg-white border border-slate-100 rounded-2xl shadow-[0_15px_50px_-10px_rgba(15,23,42,0.12)] z-[100] max-h-60 overflow-y-auto divide-y divide-slate-50">
            {filteredCities.map((city) => (
              <button 
                key={city}
                className="w-full text-left px-4 py-3 hover:bg-slate-50/80 flex items-center gap-3 transition-colors text-sm font-semibold text-slate-700"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(city);
                  setSearch(city);
                  setIsOpen(false);
                }}
              >
                <MapPin className="w-4 h-4 text-slate-400" />
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

  const handleSeatSelect = (seat: string, isIntrCity = false) => {
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
      const row = seat.match(/\d+/)?.[0] || '1';
      const col = seat.replace(/\d+/, '');
      
      if (isIntrCity) {
        // IntrCity has 2+2 layout: columns A, B (left) and C, D (right)
        if (col === 'A') adjacentSeat = `${row}B`;
        else if (col === 'B') adjacentSeat = `${row}A`;
        else if (col === 'C') adjacentSeat = `${row}D`;
        else if (col === 'D') adjacentSeat = `${row}C`;
      } else {
        // Zingbus has 2+1 layout: columns A (single side) and B, C (double side)
        if (col === 'B') adjacentSeat = `${row}C`;
        else if (col === 'C') adjacentSeat = `${row}B`;
        else if (col === 'A') adjacentSeat = `${parseInt(row)+1}A`;
      }
      
      const isBooked = (s: string) => {
        if (isIntrCity) {
          return ['2A','5A','1B','4B','1C','3D','6C'].includes(s);
        }
        return ['2A','5A','1B','4B','1C','3C','6C'].includes(s);
      };
      
      if (adjacentSeat && !isBooked(adjacentSeat)) {
        newSeats.push(adjacentSeat);
      }
    } else if (newSeats.length > passengerCount) {
      newSeats = [seat];
    }
    
    setSelectedSeats(newSeats);
  };

  return (
    <div className="min-h-screen bg-soft-white font-body text-slate-900 overflow-x-hidden pt-20 relative">
      <div className="grain-overlay"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/70 backdrop-blur-xl z-50 border-b border-slate-200/50">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2.5">
            <div className="bg-gradient-to-tr from-brand-primary to-indigo-500 text-white p-2 rounded-xl shadow-md shadow-brand-primary/10">
              <Bus className="w-5.5 h-5.5" />
            </div>
            <span className="font-display font-extrabold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-slate-950 to-slate-800 bg-clip-text text-transparent">
              Companion<span className="text-brand-primary">X</span>
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-semibold text-slate-600">
            <a href="#how-it-works" className="hover:text-brand-primary transition-colors">How it Works</a>
            <a href="#trust" className="hover:text-brand-primary transition-colors">Trust & Safety</a>
            <a href="#pricing" className="hover:text-brand-primary transition-colors">Premium Plans</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-semibold text-slate-700 hover:text-brand-primary transition-colors">Log In</button>
            <button className="bg-slate-950 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-md shadow-slate-950/10 hover:bg-slate-800 transition-all hover:scale-[1.02]">
              Join CompanionX
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-48 px-6 overflow-hidden">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-1155/678 w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-brand-primary to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="max-w-2xl lg:col-span-7 z-20">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/60 text-indigo-700 text-xs font-semibold mb-6 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                <span>Smart Splitting Ecosystem</span>
              </div>
              <h1 className="font-display text-5xl md:text-[3.75rem] font-extrabold leading-[1.1] tracking-tight text-slate-950 mb-6">
                Travel Together.<br />
                <span className="bg-gradient-to-r from-brand-primary to-indigo-500 bg-clip-text text-transparent">Split Fares Automatically.</span>
              </h1>
              <p className="text-base md:text-lg text-slate-500 mb-8 leading-relaxed max-w-xl">
                The modern bus travel platform that pairs you with verified co-travelers heading the same way. Save up to 40% on luxury coaches instantly.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <a href="#search-bar" className="bg-brand-primary text-white px-8 py-4 rounded-2xl font-bold text-base hover:bg-brand-primaryHover transition-all shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2 group hover:scale-[1.02]">
                  Find Your Route
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#how-it-works" className="bg-white text-slate-700 border border-slate-200/80 px-8 py-4 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all flex items-center justify-center">
                  See How it Works
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs font-semibold text-slate-400">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-indigo-500" />
                  100% ID-Verified Community
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  4.8/5 Star Rated Coaches
                </div>
              </div>
            </div>

            {/* Right Premium Interactive Mockup */}
            <div className="relative lg:col-span-5 hidden lg:block">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand-primary/10 to-indigo-500/5 rounded-[2.5rem] blur-3xl" />
              
              {/* Outer Glass Card */}
              <div className="relative bg-white rounded-[2.5rem] shadow-card border border-slate-200/60 p-3 transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="bg-slate-50 rounded-[2rem] overflow-hidden p-6 border border-slate-100">
                  
                  {/* Top bar */}
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Live Match Monitor</span>
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping" />
                  </div>
                  
                  {/* Route indicator */}
                  <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-5">
                    <div className="flex items-center justify-between relative">
                      <div>
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">From</p>
                        <p className="font-bold text-slate-800 text-sm">New Delhi</p>
                      </div>
                      
                      <div className="flex-1 px-4 flex flex-col items-center justify-center">
                        <span className="text-[10px] font-bold text-brand-primary bg-indigo-50 px-2 py-0.5 rounded-full mb-1">98% Route Match</span>
                        <div className="w-full flex items-center relative">
                          <div className="w-full border-t border-slate-200"></div>
                          <Bus className="w-3.5 h-3.5 text-brand-primary mx-2" />
                          <div className="w-full border-t border-dashed border-slate-200"></div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[10px] font-semibold text-slate-400 uppercase">To</p>
                        <p className="font-bold text-slate-800 text-sm">Jaipur</p>
                      </div>
                    </div>
                  </div>

                  {/* Profile connection visual */}
                  <div className="flex items-center justify-between bg-white rounded-2xl p-4 border border-slate-100 shadow-sm mb-5 relative">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop" className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md" alt="Avatar" />
                        <span className="absolute bottom-0 right-0 bg-emerald-500 w-2.5 h-2.5 rounded-full border-2 border-white" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">Ananya Sharma</p>
                        <p className="text-[10px] text-slate-400">Verfied Elite Co-Traveler</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                        Saved ₹350
                      </span>
                    </div>
                  </div>

                  {/* Dashboard stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm text-center">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Standard Cost</p>
                      <p className="text-lg font-black text-slate-400 line-through">₹850</p>
                    </div>
                    <div className="bg-gradient-to-tr from-brand-primary to-indigo-600 p-4 rounded-2xl text-center text-white shadow-md shadow-brand-primary/20">
                      <p className="text-[10px] font-bold opacity-80 uppercase mb-1">Your Shared Fare</p>
                      <p className="text-xl font-black">₹450</p>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Smart Search Bar Anchor */}
        <div id="search-bar" className="absolute left-0 right-0 -bottom-24 w-full px-6 z-30">
          <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(15,23,42,0.12)] border border-slate-200/50 p-4 md:p-6 transition-shadow hover:shadow-[0_25px_70px_-10px_rgba(15,23,42,0.18)]">
            <div className="flex flex-col lg:flex-row gap-4 items-end">
              <LocationInput 
                label="From" 
                placeholder="Departure city" 
                value={fromCity} 
                onChange={(val) => { setFromCity(val); setIsSearched(false); }} 
                icon={MapPin} 
                iconColorClass="text-slate-400" 
              />
              <LocationInput 
                label="To" 
                placeholder="Arrival city" 
                value={toCity} 
                onChange={(val) => { setToCity(val); setIsSearched(false); }} 
                icon={MapPin} 
                iconColorClass="text-brand-primary" 
              />
              
              <div className="flex-1 w-full relative">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Date</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <input 
                    type="date" 
                    defaultValue="2026-05-20"
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-semibold text-slate-700" 
                  />
                </div>
              </div>

              <div className="flex-1 w-full relative">
                <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-widest mb-1.5">Passengers</label>
                <div className="relative">
                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
                  <select 
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-50/50 hover:bg-slate-50 border border-slate-200/80 rounded-2xl focus:border-brand-primary focus:bg-white focus:ring-4 focus:ring-brand-primary/5 outline-none transition-all font-semibold text-slate-700 appearance-none cursor-pointer"
                    value={passengerCount}
                    onChange={(e) => {
                      setPassengerCount(parseInt(e.target.value));
                      setSelectedSeats([]); // reset seats
                    }}
                  >
                    <option value={1}>1 Passenger</option>
                    <option value={2}>2 Passengers</option>
                  </select>
                </div>
              </div>

              <button 
                className="w-full lg:w-auto bg-slate-950 text-white px-8 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all h-[54px] flex items-center justify-center shadow-md shadow-slate-950/10 hover:scale-[1.01]"
                onClick={() => {
                  if (fromCity && toCity) {
                    setIsSearched(true);
                    setSelectedBus(null);
                    setSelectedSeats([]);
                  } else {
                    alert("Please select both Departure and Arrival cities!");
                  }
                }}
              >
                Search Buses
              </button>
            </div>

            {/* Smart mode section */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center bg-indigo-50/40 px-4 py-3.5 rounded-2xl border-dashed border border-indigo-100">
              <div className="flex items-center gap-3">
                <div className="bg-brand-primary text-white p-1.5 rounded-lg">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-700 block">Companion Split Mode Enabled</span>
                  <span className="text-[10px] font-semibold text-slate-400">Match with a co-traveler on this route to unlock splitting savings up to 40%.</span>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer ml-4 shrink-0">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={saveMoneyMode}
                  onChange={() => {
                    setSaveMoneyMode(!saveMoneyMode);
                    setSelectedSeats([]); // Reset seats to clear calculations
                  }}
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
              </label>
            </div>
          </div>
        </div>
      </section>

      {/* Bus Search Results Display */}
      {!isSearched ? (
        <div className="h-44 md:h-64"></div>
      ) : (
        <div className="pt-40 pb-24 px-6 bg-slate-50 w-full relative z-20 border-b border-slate-200/50">
          <div className="max-w-5xl mx-auto">
            
            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 mb-1.5">Select a Fleet Coach</h2>
                <p className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                  <span>{fromCity} to {toCity}</span>
                  <span>•</span>
                  <span>May 20, 2026</span>
                  <span>•</span>
                  <span className="text-brand-primary flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 fill-brand-primary" /> 
                    {saveMoneyMode ? "Companion Split Enabled" : "Standard Booking"}
                  </span>
                </p>
              </div>
              <div className="text-right">
                <span className="bg-indigo-50 border border-indigo-100 text-brand-primary font-bold px-3 py-1.5 rounded-xl text-xs flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  {saveMoneyMode ? 'Guaranteed Matching Price' : 'Standard Coach Prices'}
                </span>
              </div>
            </div>
            
            {/* Bus Cards List */}
            <div className="flex flex-col gap-6">
              
              {/* Bus Card 1 - Zingbus */}
              <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300">
                 <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                   
                   {/* Operator Identity */}
                   <div className="w-full lg:w-1/4">
                     <div className="flex items-center gap-2.5 mb-1.5">
                       <h3 className="font-display font-extrabold text-lg text-slate-900">Zingbus Premium</h3>
                       <span className="text-[10px] font-bold bg-indigo-50 text-brand-primary border border-indigo-100 px-2 py-0.5 rounded-full uppercase">Sleeper</span>
                     </div>
                     <p className="text-xs font-semibold text-slate-400">A/C Sleeper luxury coach (2+1)</p>
                     
                     <div className="flex items-center gap-1.5 mt-2.5 text-xs">
                       <div className="flex items-center text-amber-500">
                         <Star className="w-3.5 h-3.5 fill-amber-500" />
                       </div>
                       <span className="font-bold text-slate-700">4.8</span>
                       <span className="text-slate-400 font-semibold">(120 vetted reviews)</span>
                     </div>
                   </div>

                   {/* Timings and Route Map */}
                   <div className="flex-1 w-full flex items-center justify-between lg:justify-center gap-6 bg-slate-50/50 px-5 py-4 rounded-2xl border border-slate-100">
                     <div className="text-left">
                       <p className="font-extrabold text-lg text-slate-800">21:00</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{fromCity}</p>
                     </div>
                     
                     <div className="flex-1 flex flex-col items-center max-w-[160px]">
                       <p className="text-[10px] text-slate-400 font-bold mb-1.5">8h 30m route</p>
                       <div className="w-full flex items-center justify-center">
                         <span className="w-2 h-2 rounded-full bg-slate-300" />
                         <div className="w-full border-t border-slate-200"></div>
                         <Bus className="w-4 h-4 text-slate-400 mx-2 shrink-0" />
                         <div className="w-full border-t border-dashed border-slate-200"></div>
                         <span className="w-2 h-2 rounded-full bg-brand-primary" />
                       </div>
                       <p className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full mt-2">Instant Split Match</p>
                     </div>

                     <div className="text-right">
                       <p className="font-extrabold text-lg text-slate-800">05:30</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{toCity}</p>
                     </div>
                   </div>

                   {/* Pricing and Action */}
                   <div className="w-full lg:w-auto text-left lg:text-right flex flex-row lg:flex-col justify-between items-center lg:items-end">
                     <div>
                       <div className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100/60 px-2 py-1 rounded-lg inline-block mb-1">12 Seats left</div>
                       <div className="flex items-baseline justify-start lg:justify-end gap-2 mt-1">
                         {saveMoneyMode && <p className="text-sm font-semibold text-slate-400 line-through">₹850</p>}
                         <p className="font-display font-black text-3xl text-slate-900">
                           ₹{saveMoneyMode ? '450' : '850'}
                           <span className="text-xs font-semibold text-slate-400">/seat</span>
                         </p>
                       </div>
                     </div>
                     <button 
                       className={`text-sm font-bold py-3 px-6 rounded-2xl transition-all ${
                         selectedBus === 'zingbus' 
                           ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                           : 'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-md shadow-brand-primary/20 hover:scale-[1.02]'
                       }`}
                       onClick={() => { 
                         setSelectedBus(selectedBus === 'zingbus' ? null : 'zingbus'); 
                         setSelectedSeats([]); 
                       }}
                     >
                       {selectedBus === 'zingbus' ? 'Collapse Map' : (saveMoneyMode ? 'Split & Select Seats' : 'Select Seats')}
                     </button>
                   </div>
                 </div>

                 {/* Zingbus Seat Map */}
                 {selectedBus === 'zingbus' && (
                    <div className="mt-8 pt-8 border-t border-slate-100 animate-fade-in">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Interactive Coach Map */}
                        <div className="lg:col-span-7 bg-slate-50/50 rounded-3xl p-6 border border-slate-200/60">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h4 className="font-display font-extrabold text-slate-900 text-base">Luxury Sleeper Layout</h4>
                              <p className="text-[11px] font-semibold text-slate-400">Pill-shaped berths with privacy blinds</p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-200 rounded-md"></div> Booked</div>
                              <div className="flex items-center gap-1.5"><div className="w-3 h-3 border border-slate-300 bg-white rounded-md"></div> Free</div>
                              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-brand-primary rounded-md shadow-sm"></div> Picked</div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col items-center">
                            
                            {/* Dashboard/Driver section */}
                            <div className="w-full max-w-[280px] flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rear Coach Entrance</span>
                              {/* Steering wheel vector icon representation */}
                              <div className="w-7 h-7 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                <div className="w-0.5 h-2.5 bg-slate-300" />
                              </div>
                            </div>

                            {/* Sleeper berth layout */}
                            <div className="w-full max-w-[280px]">
                              <div className="flex justify-between gap-6">
                                
                                {/* Column 1 (Left Single Berths) */}
                                <div className="flex flex-col gap-3">
                                  {['1A','2A','3A','4A','5A','6A'].map(seat => {
                                    const isBooked = seat === '2A' || seat === '5A';
                                    const isSelected = selectedSeats.includes(seat);
                                    return (
                                      <button 
                                        key={seat}
                                        disabled={isBooked}
                                        onClick={() => handleSeatSelect(seat)}
                                        className={`w-14 h-9 rounded-xl flex flex-col items-center justify-center border transition-all ${
                                          isBooked 
                                            ? 'bg-slate-200/80 border-transparent text-slate-400 cursor-not-allowed' 
                                            : isSelected 
                                              ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/10 -translate-y-0.5 font-bold' 
                                              : 'bg-white text-slate-500 border-slate-200 hover:border-brand-primary hover:text-brand-primary hover:bg-slate-50/50'
                                        }`}
                                      >
                                        <span className="text-[10px] font-black">{seat}</span>
                                        <span className="text-[8px] font-semibold opacity-70 uppercase tracking-wider">Berth</span>
                                      </button>
                                    )
                                  })}
                                </div>

                                {/* Cabin Aisle */}
                                <div className="flex items-center justify-center shrink-0">
                                  <span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">Aisle Space</span>
                                </div>

                                {/* Column 2 & 3 (Right Twin Berths) */}
                                <div className="flex gap-2.5">
                                  {/* Left Twin Column */}
                                  <div className="flex flex-col gap-3">
                                    {['1B','2B','3B','4B','5B','6B'].map(seat => {
                                      const isBooked = seat === '1B' || seat === '4B';
                                      const isSelected = selectedSeats.includes(seat);
                                      return (
                                        <button 
                                          key={seat}
                                          disabled={isBooked}
                                          onClick={() => handleSeatSelect(seat)}
                                          className={`w-14 h-9 rounded-xl flex flex-col items-center justify-center border transition-all ${
                                            isBooked 
                                              ? 'bg-slate-200/80 border-transparent text-slate-400 cursor-not-allowed' 
                                              : isSelected 
                                                ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/10 -translate-y-0.5 font-bold' 
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-brand-primary hover:text-brand-primary hover:bg-slate-50/50'
                                          }`}
                                        >
                                          <span className="text-[10px] font-black">{seat}</span>
                                          <span className="text-[8px] font-semibold opacity-70 uppercase tracking-wider">Twin</span>
                                        </button>
                                      )
                                    })}
                                  </div>

                                  {/* Right Twin Column */}
                                  <div className="flex flex-col gap-3">
                                    {['1C','2C','3C','4C','5C','6C'].map(seat => {
                                      const isBooked = seat === '1C' || seat === '3C' || seat === '6C';
                                      const isSelected = selectedSeats.includes(seat);
                                      return (
                                        <button 
                                          key={seat}
                                          disabled={isBooked}
                                          onClick={() => handleSeatSelect(seat)}
                                          className={`w-14 h-9 rounded-xl flex flex-col items-center justify-center border transition-all ${
                                            isBooked 
                                              ? 'bg-slate-200/80 border-transparent text-slate-400 cursor-not-allowed' 
                                              : isSelected 
                                                ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/10 -translate-y-0.5 font-bold' 
                                                : 'bg-white text-slate-500 border-slate-200 hover:border-brand-primary hover:text-brand-primary hover:bg-slate-50/50'
                                          }`}
                                        >
                                          <span className="text-[10px] font-black">{seat}</span>
                                          <span className="text-[8px] font-semibold opacity-70 uppercase tracking-wider">Twin</span>
                                        </button>
                                      )
                                    })}
                                  </div>
                                </div>

                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Journey Summary Panel (Zingbus) */}
                        <div className="lg:col-span-5 h-full">
                          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm h-full flex flex-col justify-between">
                            <div>
                              <h4 className="font-display font-extrabold text-slate-900 text-lg mb-1">Fare Ledger</h4>
                              <p className="text-xs font-semibold text-slate-400 mb-5">Secure checkout with automated splitting split-routing</p>
                              
                              <div className="divide-y divide-slate-100 space-y-4">
                                <div className="flex justify-between text-sm pt-2">
                                  <span className="text-slate-400 font-semibold">Travelers Count</span>
                                  <span className="font-bold text-slate-800">{passengerCount} Passenger{passengerCount > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-4">
                                  <span className="text-slate-400 font-semibold">Selected Seats</span>
                                  <span className="font-bold text-slate-800 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None chosen'}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm pt-4">
                                  <span className="text-slate-400 font-semibold">Standard Fare</span>
                                  <span className="font-bold text-slate-800">₹{850 * passengerCount}</span>
                                </div>
                                
                                {saveMoneyMode && (
                                  <div className="flex justify-between text-sm pt-4 bg-emerald-50/40 p-3 rounded-2xl border border-dashed border-emerald-200">
                                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                                      <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" /> Co-Traveler Split Saving
                                    </span>
                                    <span className="font-black text-emerald-700">-₹{400 * passengerCount}</span>
                                  </div>
                                )}
                                
                                <div className="pt-5 mt-4 border-t border-slate-100 flex justify-between font-display font-black text-xl">
                                  <span className="text-slate-900">Total Charged</span>
                                  <span className="text-slate-900">
                                    ₹{selectedSeats.length > 0 ? (saveMoneyMode ? 450 * passengerCount : 850 * passengerCount) : '0'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button 
                              disabled={selectedSeats.length !== passengerCount}
                              className={`w-full py-4 mt-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-base ${
                                selectedSeats.length === passengerCount 
                                  ? 'bg-slate-950 text-white hover:bg-slate-800 shadow-slate-950/10 hover:scale-[1.01]' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                              }`}
                              onClick={() => alert(`Direct checkout triggered. Processing split payment routing for ${passengerCount} seats.`)}
                            >
                              {selectedSeats.length === passengerCount ? 'Confirm split fare booking' : `Select ${passengerCount - selectedSeats.length} more seat${passengerCount - selectedSeats.length > 1 ? 's' : ''}`}
                              {selectedSeats.length === passengerCount && <ArrowRight className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                 )}
              </div>

              {/* Bus Card 2 - IntrCity */}
              <div className="bg-white rounded-3xl p-5 md:p-6 border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all duration-300">
                 <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                   
                   {/* Operator Identity */}
                   <div className="w-full lg:w-1/4">
                     <div className="flex items-center gap-2.5 mb-1.5">
                       <h3 className="font-display font-extrabold text-lg text-slate-900">IntrCity SmartBus</h3>
                       <span className="text-[10px] font-bold bg-indigo-50 text-brand-primary border border-indigo-100 px-2 py-0.5 rounded-full uppercase">Seater</span>
                     </div>
                     <p className="text-xs font-semibold text-slate-400">A/C Seater (2+2 Layout)</p>
                     
                     <div className="flex items-center gap-1.5 mt-2.5 text-xs">
                       <div className="flex items-center text-amber-500">
                         <Star className="w-3.5 h-3.5 fill-amber-500" />
                       </div>
                       <span className="font-bold text-slate-700">4.5</span>
                       <span className="text-slate-400 font-semibold">(84 reviews)</span>
                     </div>
                   </div>

                   {/* Timings and Route Map */}
                   <div className="flex-1 w-full flex items-center justify-between lg:justify-center gap-6 bg-slate-50/50 px-5 py-4 rounded-2xl border border-slate-100">
                     <div className="text-left">
                       <p className="font-extrabold text-lg text-slate-800">22:30</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{fromCity}</p>
                     </div>
                     
                     <div className="flex-1 flex flex-col items-center max-w-[160px]">
                       <p className="text-[10px] text-slate-400 font-bold mb-1.5">8h 00m route</p>
                       <div className="w-full flex items-center justify-center">
                         <span className="w-2 h-2 rounded-full bg-slate-300" />
                         <div className="w-full border-t border-slate-200"></div>
                         <Bus className="w-4 h-4 text-slate-400 mx-2 shrink-0" />
                         <div className="w-full border-t border-dashed border-slate-200"></div>
                         <span className="w-2 h-2 rounded-full bg-brand-primary" />
                       </div>
                       <p className="text-[9px] font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full mt-2">Active Matchings Available</p>
                     </div>

                     <div className="text-right">
                       <p className="font-extrabold text-lg text-slate-800">06:30</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5">{toCity}</p>
                     </div>
                   </div>

                   {/* Pricing and Action */}
                   <div className="w-full lg:w-auto text-left lg:text-right flex flex-row lg:flex-col justify-between items-center lg:items-end">
                     <div>
                       <div className="text-[10px] font-bold text-green-700 bg-green-50 border border-green-100/60 px-2 py-1 rounded-lg inline-block mb-1">24 Seats left</div>
                       <div className="flex items-baseline justify-start lg:justify-end gap-2 mt-1">
                         {saveMoneyMode && <p className="text-sm font-semibold text-slate-400 line-through">₹650</p>}
                         <p className="font-display font-black text-3xl text-slate-900">
                           ₹{saveMoneyMode ? '350' : '650'}
                           <span className="text-xs font-semibold text-slate-400">/seat</span>
                         </p>
                       </div>
                     </div>
                     <button 
                       className={`text-sm font-bold py-3 px-6 rounded-2xl transition-all ${
                         selectedBus === 'intrcity' 
                           ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' 
                           : 'bg-brand-primary text-white hover:bg-brand-primaryHover shadow-md shadow-brand-primary/20 hover:scale-[1.02]'
                       }`}
                       onClick={() => { 
                         setSelectedBus(selectedBus === 'intrcity' ? null : 'intrcity'); 
                         setSelectedSeats([]); 
                       }}
                     >
                       {selectedBus === 'intrcity' ? 'Collapse Map' : (saveMoneyMode ? 'Split & Select Seats' : 'Select Seats')}
                     </button>
                   </div>
                 </div>

                 {/* IntrCity Seat Map - FULLY REDESIGNED & COMPLETED */}
                 {selectedBus === 'intrcity' && (
                    <div className="mt-8 pt-8 border-t border-slate-100 animate-fade-in">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                        
                        {/* Interactive Coach Map (2+2 Layout) */}
                        <div className="lg:col-span-7 bg-slate-50/50 rounded-3xl p-6 border border-slate-200/60">
                          <div className="flex justify-between items-center mb-6">
                            <div>
                              <h4 className="font-display font-extrabold text-slate-900 text-base">Smart Seater Layout</h4>
                              <p className="text-[11px] font-semibold text-slate-400">Double-column ergonomic recliners</p>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-slate-200 rounded-md"></div> Booked</div>
                              <div className="flex items-center gap-1.5"><div className="w-3 h-3 border border-slate-300 bg-white rounded-md"></div> Free</div>
                              <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-brand-primary rounded-md shadow-sm"></div> Picked</div>
                            </div>
                          </div>

                          <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col items-center">
                            
                            {/* Dashboard/Driver section */}
                            <div className="w-full max-w-[280px] flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rear Coach Entrance</span>
                              <div className="w-7 h-7 rounded-full border-2 border-slate-300 flex items-center justify-center">
                                <div className="w-0.5 h-2.5 bg-slate-300" />
                              </div>
                            </div>

                            {/* 2+2 layout */}
                            <div className="w-full max-w-[280px]">
                              <div className="flex flex-col gap-3">
                                {[1, 2, 3, 4, 5, 6].map(row => (
                                  <div key={row} className="flex justify-between items-center">
                                    
                                    {/* Left pair (Columns A & B) */}
                                    <div className="flex gap-2">
                                      {['A', 'B'].map(col => {
                                        const seat = `${row}${col}`;
                                        const isBooked = (row === 2 && col === 'A') || (row === 1 && col === 'B') || (row === 4 && col === 'B');
                                        const isSelected = selectedSeats.includes(seat);
                                        return (
                                          <button 
                                            key={seat}
                                            disabled={isBooked}
                                            onClick={() => handleSeatSelect(seat, true)}
                                            className={`w-11 h-10 rounded-xl flex flex-col items-center justify-center border transition-all ${
                                              isBooked 
                                                ? 'bg-slate-200/80 border-transparent text-slate-400 cursor-not-allowed' 
                                                : isSelected 
                                                  ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/10 -translate-y-0.5 font-bold' 
                                                  : 'bg-white text-slate-500 border-slate-200 hover:border-brand-primary hover:text-brand-primary hover:bg-slate-50/50'
                                            }`}
                                          >
                                            <span className="text-[10px] font-black">{seat}</span>
                                          </button>
                                        );
                                      })}
                                    </div>

                                    {/* Aisle space */}
                                    <div className="w-8 flex items-center justify-center">
                                      <span className="text-[8px] font-bold text-slate-200 uppercase tracking-widest">Aisle</span>
                                    </div>

                                    {/* Right pair (Columns C & D) */}
                                    <div className="flex gap-2">
                                      {['C', 'D'].map(col => {
                                        const seat = `${row}${col}`;
                                        const isBooked = (row === 1 && col === 'C') || (row === 3 && col === 'D') || (row === 6 && col === 'C');
                                        const isSelected = selectedSeats.includes(seat);
                                        return (
                                          <button 
                                            key={seat}
                                            disabled={isBooked}
                                            onClick={() => handleSeatSelect(seat, true)}
                                            className={`w-11 h-10 rounded-xl flex flex-col items-center justify-center border transition-all ${
                                              isBooked 
                                                ? 'bg-slate-200/80 border-transparent text-slate-400 cursor-not-allowed' 
                                                : isSelected 
                                                  ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/10 -translate-y-0.5 font-bold' 
                                                  : 'bg-white text-slate-500 border-slate-200 hover:border-brand-primary hover:text-brand-primary hover:bg-slate-50/50'
                                            }`}
                                          >
                                            <span className="text-[10px] font-black">{seat}</span>
                                          </button>
                                        );
                                      })}
                                    </div>

                                  </div>
                                ))}
                              </div>
                            </div>

                          </div>
                        </div>

                        {/* Journey Summary Panel (IntrCity) */}
                        <div className="lg:col-span-5 h-full">
                          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm h-full flex flex-col justify-between">
                            <div>
                              <h4 className="font-display font-extrabold text-slate-900 text-lg mb-1">Fare Ledger</h4>
                              <p className="text-xs font-semibold text-slate-400 mb-5">Secure checkout with automated splitting split-routing</p>
                              
                              <div className="divide-y divide-slate-100 space-y-4">
                                <div className="flex justify-between text-sm pt-2">
                                  <span className="text-slate-400 font-semibold">Travelers Count</span>
                                  <span className="font-bold text-slate-800">{passengerCount} Passenger{passengerCount > 1 ? 's' : ''}</span>
                                </div>
                                <div className="flex justify-between text-sm pt-4">
                                  <span className="text-slate-400 font-semibold">Selected Seats</span>
                                  <span className="font-bold text-slate-800 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-lg">
                                    {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None chosen'}
                                  </span>
                                </div>
                                <div className="flex justify-between text-sm pt-4">
                                  <span className="text-slate-400 font-semibold">Standard Fare</span>
                                  <span className="font-bold text-slate-800">₹{650 * passengerCount}</span>
                                </div>
                                
                                {saveMoneyMode && (
                                  <div className="flex justify-between text-sm pt-4 bg-emerald-50/40 p-3 rounded-2xl border border-dashed border-emerald-200">
                                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                                      <Zap className="w-4 h-4 fill-emerald-600 text-emerald-600" /> Co-Traveler Split Saving
                                    </span>
                                    <span className="font-black text-emerald-700">-₹{300 * passengerCount}</span>
                                  </div>
                                )}
                                
                                <div className="pt-5 mt-4 border-t border-slate-100 flex justify-between font-display font-black text-xl">
                                  <span className="text-slate-900">Total Charged</span>
                                  <span className="text-slate-900">
                                    ₹{selectedSeats.length > 0 ? (saveMoneyMode ? 350 * passengerCount : 650 * passengerCount) : '0'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <button 
                              disabled={selectedSeats.length !== passengerCount}
                              className={`w-full py-4 mt-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md text-base ${
                                selectedSeats.length === passengerCount 
                                  ? 'bg-slate-950 text-white hover:bg-slate-800 shadow-slate-950/10 hover:scale-[1.01]' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed shadow-none'
                              }`}
                              onClick={() => alert(`Direct checkout triggered. Processing split payment routing for ${passengerCount} seats.`)}
                            >
                              {selectedSeats.length === passengerCount ? 'Confirm split fare booking' : `Select ${passengerCount - selectedSeats.length} more seat${passengerCount - selectedSeats.length > 1 ? 's' : ''}`}
                              {selectedSeats.length === passengerCount && <ArrowRight className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                 )}
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modern High-End Match Interface Grid (Wow Factor Section) */}
      <section className="py-24 px-6 bg-white overflow-hidden border-b border-slate-150">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Visual Demo Card */}
            <div className="lg:col-span-5 relative">
              <div className="absolute inset-0 bg-brand-primary/5 rounded-full blur-[80px] transform -translate-x-1/4" />
              
              <div className="bg-white rounded-[2.25rem] shadow-card border border-slate-200/80 p-6 max-w-sm mx-auto relative z-10 hover:scale-[1.01] transition-transform">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Co-Traveler Hub</span>
                  <span className="bg-indigo-50 text-brand-primary text-[10px] font-bold px-2.5 py-1 rounded-lg border border-indigo-100">98% Route Match</span>
                </div>

                {/* Route visualization */}
                <div className="bg-slate-50/50 rounded-2xl p-4 mb-6 border border-slate-100">
                  <div className="flex items-center justify-between relative">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Origin</p>
                      <p className="font-extrabold text-sm text-slate-800 leading-none">New Delhi</p>
                      <p className="text-[10px] text-slate-400 mt-1">10:00 AM Departure</p>
                    </div>
                    
                    <div className="absolute left-1/2 w-full -translate-x-1/2 border-t border-slate-200" />
                    <Bus className="w-4 h-4 text-brand-primary absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-50 px-1 z-10" />
                    
                    <div className="text-right">
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Dest</p>
                      <p className="font-extrabold text-sm text-slate-800 leading-none">Jaipur</p>
                      <p className="text-[10px] text-slate-400 mt-1">03:30 PM Arrival</p>
                    </div>
                  </div>
                </div>

                {/* Companion Match Profiler */}
                <div className="flex items-center gap-3.5 mb-6 pb-6 border-b border-slate-100">
                  <div className="relative">
                    <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md" alt="Match Avatar" />
                    <div className="absolute -bottom-1 -right-1 bg-brand-primary p-0.5 rounded-full border-2 border-white">
                      <ShieldCheck className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-800">Priya Kothari</h4>
                    <div className="flex items-center gap-2 mt-0.5 text-xs">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3 h-3 fill-amber-500" />
                        <span className="font-bold text-slate-700 ml-1">4.9</span>
                      </div>
                      <span className="text-slate-300">•</span>
                      <span className="font-semibold text-slate-400">42 smart rides</span>
                    </div>
                  </div>
                </div>

                {/* Match Benefit Banner */}
                <div className="bg-brand-primary text-white rounded-2xl p-5 mb-5 text-center shadow-md shadow-brand-primary/10">
                  <p className="text-xs font-semibold opacity-90 mb-1">Guaranteed Automated Fare Split</p>
                  <p className="text-3xl font-black">₹350 Saved</p>
                </div>

                <button 
                  className="w-full bg-slate-950 text-white font-bold py-3.5 rounded-2xl hover:bg-slate-800 transition-all hover:scale-[1.01]"
                  onClick={() => alert("Verification matching complete. Matching initialized successfully!")}
                >
                  Authorize Split Connection
                </button>
              </div>
            </div>

            {/* Editorial Content */}
            <div className="lg:col-span-7">
              <h2 className="font-display text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
                Splitting Fares Shouldn't Be <span className="bg-gradient-to-r from-brand-primary to-indigo-500 bg-clip-text text-transparent">Awkward.</span>
              </h2>
              <p className="text-base text-slate-500 mb-8 leading-relaxed">
                CompanionX operates a proprietary splitting ledger. We securely group verified travelers on the same routes, handle all back-end routing calculations, and split payment links directly before checkout—eliminating awkward money requests entirely.
              </p>

              <ul className="space-y-4">
                {[
                  "Luxury coaches and sleeper fleets only.",
                  "Zero platform coordination fees.",
                  "Fully verified legal ID profiles.",
                  "Encrypted built-in coordinate chat features."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="bg-emerald-50 text-emerald-600 p-1 rounded-full mt-0.5">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-slate-700 font-semibold text-base leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-6 bg-slate-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Three Simple Steps</h2>
            <p className="text-slate-500 font-medium">Bespoke splitting mechanisms engineered to deliver travel convenience.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm relative group overflow-hidden">
              <div className="w-12 h-12 bg-indigo-50 text-brand-primary rounded-xl flex items-center justify-center mb-6 font-display font-extrabold text-lg">
                01
              </div>
              <h3 className="font-display font-extrabold text-lg text-slate-900 mb-2.5">Find Your Route</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Enter your departure details. Explore hundreds of vetted premium, sleeper, and coach routes live.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm relative group overflow-hidden">
              <div className="w-12 h-12 bg-indigo-50 text-brand-primary rounded-xl flex items-center justify-center mb-6 font-display font-extrabold text-lg">
                02
              </div>
              <h3 className="font-display font-extrabold text-lg text-slate-900 mb-2.5">Autosplit Match</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Toggle "Companion Mode". Our backend matching algorithm pairs you with active, verified travelers instantly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/60 shadow-sm relative group overflow-hidden">
              <div className="w-12 h-12 bg-indigo-50 text-brand-primary rounded-xl flex items-center justify-center mb-6 font-display font-extrabold text-lg">
                03
              </div>
              <h3 className="font-display font-extrabold text-lg text-slate-900 mb-2.5">Travel & Enjoy</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Securely check out with your discount applied, board your premium coach, and travel split-cost.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section id="trust" className="py-24 px-6 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(99,102,241,0.15),rgba(255,255,255,0))]" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-brand-primary text-xs font-semibold mb-6">
                <Shield className="w-4 h-4 text-brand-primary" />
                <span>Multi-Layer Verification Protocol</span>
              </div>
              
              <h2 className="font-display text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Designed for Safety.<br />Engineered for Trust.
              </h2>
              <p className="text-slate-400 text-base mb-10 leading-relaxed max-w-lg">
                CompanionX maintains a zero-tolerance policy. Profiles undergo three-step government ID cross-referencing and verification before matches can be approved.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <UserCheck className="w-8 h-8 text-indigo-400 mb-4" />
                  <h4 className="font-bold text-base mb-2">Triple-ID Verification</h4>
                  <p className="text-xs text-slate-400">Strict checking of Government IDs and biometric cross-matching.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <Star className="w-8 h-8 text-amber-400 mb-4" />
                  <h4 className="font-bold text-base mb-2">Double-ended Ratings</h4>
                  <p className="text-xs text-slate-400">Honest feedback loops filter and highlight excellent co-travelers.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <MessageSquare className="w-8 h-8 text-emerald-400 mb-4" />
                  <h4 className="font-bold text-base mb-2">In-App Secure Chat</h4>
                  <p className="text-xs text-slate-400">Secure matching coordinator chats without disclosing numbers.</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <AlertTriangle className="w-8 h-8 text-red-400 mb-4" />
                  <h4 className="font-bold text-base mb-2">24/7 Security Escalation</h4>
                  <p className="text-xs text-slate-400">On-ride monitoring and rapid distress support at any coordinate.</p>
                </div>
              </div>
            </div>

            {/* Right Graphics */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl">
                <img src="/images/safe_travel_new.jpg" className="w-full max-w-sm object-cover h-[500px] filter brightness-90 hover:brightness-100 transition-all duration-300" alt="Vetted Safety Dashboard" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Floating Safety verification tag */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center gap-3">
                  <div className="bg-brand-primary p-2 rounded-xl text-white">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-white">Govt-ID Verified Hub</p>
                    <p className="text-[10px] text-slate-300">Biometric vetted traveler network</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Subscription Pricing Grid */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">Elite Premium Plans</h2>
            <p className="text-slate-500 font-medium text-sm">Elevate your commute. Choose your ideal tier to maximize route splitting benefits.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
            
            {/* Free Tier */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-800 mb-1">Standard</h3>
                <p className="text-slate-400 text-xs mb-6 pb-6 border-b border-slate-100">Pay as you travel</p>
                <div className="font-display text-4xl font-black text-slate-900 mb-8">₹0<span className="text-sm font-semibold text-slate-400">/mo</span></div>
                
                <ul className="space-y-4 mb-8">
                  {["Standard route matching", "Standard split options", "Secure coordinate chat", "Standard processing charges"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                      <CheckCircle2 className="w-4.5 h-4.5 text-slate-300 shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full py-3.5 rounded-xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">Default Plan</button>
            </div>

            {/* Pro Tier */}
            <div className="bg-slate-950 text-white p-8 rounded-3xl border border-indigo-500 shadow-xl relative flex flex-col justify-between transform md:-translate-y-3">
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-primary text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Commuter Pick
              </span>
              <div>
                <h3 className="font-display text-xl font-bold mb-1 text-white">Smart Pro</h3>
                <p className="text-slate-400 text-xs mb-6 pb-6 border-b border-white/10">Engineered for frequent routes</p>
                <div className="font-display text-4xl font-black mb-8 text-white">₹149<span className="text-sm font-semibold text-slate-400">/mo</span></div>
                
                <ul className="space-y-4 mb-8">
                  {["10% Discount on split fee", "Priority matches in queue", "Verified 'Pro Badge'", "Zero cancellations charges", "Vetted priority support"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-200 font-semibold">
                      <CheckCircle2 className="w-4.5 h-4.5 text-brand-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full py-3.5 rounded-xl font-bold bg-brand-primary text-white hover:bg-brand-primaryHover transition-all shadow-md shadow-brand-primary/20">Upgrade to Pro</button>
            </div>

            {/* Elite Tier */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-slate-800 mb-1">Elite</h3>
                <p className="text-slate-400 text-xs mb-6 pb-6 border-b border-slate-100">Zero Splitting Limits</p>
                <div className="font-display text-4xl font-black text-slate-900 mb-8">₹399<span className="text-sm font-semibold text-slate-400">/mo</span></div>
                
                <ul className="space-y-4 mb-8">
                  {["Zero transaction fees", "Custom matching parameters", "Priority coach reservations", "Instant waitlist bypass", "Premium support access"].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs text-slate-600 font-semibold">
                      <CheckCircle2 className="w-4.5 h-4.5 text-brand-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="w-full py-3.5 rounded-xl font-bold bg-slate-50 text-slate-700 hover:bg-slate-100 transition-colors">Go Elite</button>
            </div>

          </div>
        </div>
      </section>

      {/* Modern Gradient Call to Action Section */}
      <section className="bg-gradient-to-tr from-brand-primary to-indigo-700 py-20 px-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent)]" />
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h2 className="font-display text-3xl md:text-4xl font-extrabold text-white mb-6">Redesigning Modern Commuting.</h2>
          <p className="text-indigo-100 text-base mb-8 max-w-xl mx-auto">Join a trusted biometric-vetted network of split-fare travelers today. Split expenses. Move better.</p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold text-base hover:bg-slate-50 transition-all hover:scale-[1.02] shadow-xl">
            Start Traveling Smart
          </button>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-slate-950 border-t border-white/5 py-16 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 border-b border-white/5 pb-12">
            
            <div className="md:col-span-5">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="bg-brand-primary text-white p-1.5 rounded-lg">
                  <Bus className="w-5 h-5 text-white" />
                </div>
                <span className="font-display font-extrabold text-lg">CompanionX</span>
              </div>
              <p className="text-slate-400 text-sm max-w-sm leading-relaxed">
                The smart co-travel splitting utility for luxury long-distance travel. Maximize savings, cross-check verified IDs, and split route charges effortlessly.
              </p>
            </div>

            <div className="md:col-span-3">
              <h4 className="font-bold text-sm mb-4 text-white/90">Ecosystem</h4>
              <ul className="space-y-3 text-xs text-slate-400 font-semibold">
                <li><a href="#how-it-works" className="hover:text-white transition-colors">How it works</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Elite plans</a></li>
                <li><a href="#trust" className="hover:text-white transition-colors">Trust & Safety</a></li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h4 className="font-bold text-sm mb-4 text-white/90">Platform Security</h4>
              <ul className="space-y-3 text-xs text-slate-400 font-semibold">
                <li><span className="text-brand-primary">✓ Biometric Vetted</span></li>
                <li><span className="text-brand-primary">✓ Govt ID Crosschecking</span></li>
                <li><span className="text-brand-primary">✓ Instant Distress Monitoring</span></li>
              </ul>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500 font-semibold">
            <p>© 2026 CompanionX. Vetted Smartsplit Travel. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Made with ❤️ for modern travelers.</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
