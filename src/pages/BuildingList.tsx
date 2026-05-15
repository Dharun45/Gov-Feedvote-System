import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Building2, ArrowLeft, Search, Navigation, Map as MapIcon, List, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import BuildingMap from '@/components/BuildingMap';
import { calculateDistance } from '@/lib/geo';
import { apiGetBuildings } from '@/lib/api';

const typeColors: Record<string, string> = {
  Municipal: 'bg-primary/10 text-primary border-primary/20',
  Revenue: 'bg-secondary/10 text-secondary border-secondary/20',
  Infrastructure: 'bg-accent/10 text-accent border-accent/20',
  Transport: 'bg-info/10 text-info border-info/20',
  Utilities: 'bg-warning/10 text-warning border-warning/20',
  Planning: 'bg-destructive/10 text-destructive border-destructive/20',
};

const BuildingList = () => {
  const [buildings, setBuildings] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [locating, setLocating] = useState(true);
  const [fetching, setFetching] = useState(true);
  const [view, setView] = useState<'list' | 'map'>('list');
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [radius, setRadius] = useState<number>(0); 
  const [locationName, setLocationName] = useState<string>('');

  useEffect(() => {
    const initData = async () => {
      try {
        const res = await apiGetBuildings();
        let fetchedBuildings = res.data || [];

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            async (pos) => {
              const { latitude, longitude } = pos.coords;
              setUserLocation({ lat: latitude, lng: longitude });

              // Minor optional: Try to reverse geocode coordinate quickly
              try {
                const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
                if (geoRes.ok) {
                  const geoData = await geoRes.json();
                  const city = geoData.address.city || geoData.address.town || geoData.address.county || geoData.address.state || 'Local Region';
                  setLocationName(city);
                }
              } catch (e) {
                // Ignore missing city silently
              }

              fetchedBuildings = fetchedBuildings.map((b: any) => ({
                ...b,
                distance: calculateDistance(latitude, longitude, parseFloat(b.latitude), parseFloat(b.longitude))
              })).sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));

              setBuildings(fetchedBuildings);
              setLocating(false);
              setFetching(false);
            },
            (err) => {
              console.error("Geolocation error:", err);
              setBuildings(fetchedBuildings);
              setLocating(false);
              setFetching(false);
            },
            { timeout: 8000 }
          );
        } else {
          setBuildings(fetchedBuildings);
          setLocating(false);
          setFetching(false);
        }
      } catch (err) {
        console.error("Failed to load buildings:", err);
        setLocating(false);
        setFetching(false);
      }
    };

    initData();
  }, []);

  const filtered = buildings.filter(b => {
    const matchesSearch = b.name.toLowerCase().includes(search.toLowerCase()) ||
                         b.type.toLowerCase().includes(search.toLowerCase());
    const matchesRadius = radius === 0 || (b.distance !== undefined && b.distance <= radius);
    return matchesSearch && matchesRadius;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-[#0f172a] text-white sticky top-0 z-40 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 pattern-dots opacity-10" />
        <div className="absolute -bottom-24 -left-12 w-64 h-64 bg-primary/30 rounded-full blur-[80px]" />
        
        <div className="container mx-auto max-w-4xl px-4 pt-6 pb-12 relative z-10">
          <Link to="/" className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <h1 className="font-heading text-3xl md:text-4xl font-extrabold mb-3 tracking-tight">Nearby Government Offices</h1>
          <div className="flex items-center gap-2 text-primary-foreground/80 font-medium text-sm">
            {locating || fetching ? (
              <span className="flex items-center gap-2 text-slate-300 animate-pulse"><Loader2 className="w-4 h-4 animate-spin" /> Detecting your coordinates...</span>
            ) : userLocation ? (
              <span className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full border border-emerald-400/20">
                <Navigation className="w-3.5 h-3.5" /> Found near {locationName || 'your device'}
              </span>
            ) : (
              <span className="text-destructive bg-destructive/10 px-3 py-1 rounded-full border border-destructive/20 font-semibold flex items-center gap-2">
                <Navigation className="w-3.5 h-3.5" /> Manual Search Mode Active
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto max-w-4xl px-4 -mt-6 relative z-50">
        {/* Search + View Toggle */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search offices by name or type..."
              className="pl-11 h-12 bg-card shadow-lg border-border/50 rounded-xl"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex bg-card rounded-xl border border-border/50 shadow-lg p-1 shrink-0 h-12 self-baseline">
            <select 
              className="bg-transparent text-sm font-medium px-3 outline-none border-r border-border/50 mr-1"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              <option value="0">Global Range</option>
              <option value="5">Within 5km</option>
              <option value="10">Within 10km</option>
              <option value="50">Within 50km</option>
            </select>
            <Button
              variant={view === 'list' ? 'default' : 'ghost'}
              size="sm"
              className={`gap-1.5 px-4 h-full rounded-lg ${view === 'list' ? 'shadow-md' : ''}`}
              onClick={() => setView('list')}
            >
              <List className="w-4 h-4" /> List
            </Button>
            <Button
              variant={view === 'map' ? 'default' : 'ghost'}
              size="sm"
              className={`gap-1.5 px-4 h-full rounded-lg ${view === 'map' ? 'shadow-md' : ''}`}
              onClick={() => setView('map')}
            >
              <MapIcon className="w-4 h-4" /> Map
            </Button>
          </div>
        </div>

        {fetching ? (
           <div className="py-20 flex justify-center text-muted-foreground animate-pulse">
             <Building2 className="w-12 h-12 mb-3 opacity-30" />
           </div>
        ) : (
          <>
            {/* Map View */}
            {view === 'map' && (
              <div className="mb-6 rounded-3xl overflow-hidden border border-border/50 shadow-card bg-card p-1" style={{ animation: 'fade-in-up 0.4s cubic-bezier(0.16,1,0.3,1) forwards' }}>
                <BuildingMap buildings={filtered} />
              </div>
            )}

            {/* List View */}
            {view === 'list' && (
              <div className="grid gap-4">
                {filtered.map((b, i) => (
                  <Link key={b._id} to={`/buildings/employees`} state={{ buildingId: b._id }}>
                    <div
                      className="bg-card border border-border/50 rounded-3xl p-5 hover:shadow-card hover:border-primary/20 transition-all cursor-pointer group"
                      style={{ animation: `fade-in-up 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s forwards`, opacity: 0 }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-primary flex items-center justify-center shrink-0 shadow-md">
                            <Building2 className="w-7 h-7 text-white" />
                          </div>
                          <div>
                            <h3 className="font-heading font-extrabold text-lg text-foreground group-hover:text-primary transition-colors leading-tight">{b.name}</h3>
                            <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1.5 font-medium">
                              <MapPin className="w-3.5 h-3.5 text-primary/70" /> {b.address}
                            </p>
                            {b.distance !== undefined && (
                              <Badge variant="outline" className="text-[10px] font-bold text-emerald-600 border-emerald-600/30 bg-emerald-600/5 mt-2 flex items-center gap-1 w-fit">
                                <Navigation className="w-3 h-3" /> {b.distance} km away
                              </Badge>
                            )}
                          </div>
                        </div>
                        <Badge className={`shrink-0 border-0 shadow-none font-bold uppercase tracking-wide text-[10px] ${typeColors[b.type] || 'bg-slate-100 text-slate-800'}`}>
                          {b.type}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-heading font-bold text-xl text-foreground">No offices found</p>
                <p className="text-sm mt-1">Try expanding your scan radius or check manual maps.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BuildingList;
