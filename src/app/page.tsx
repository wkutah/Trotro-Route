"use client"

import dynamic from 'next/dynamic';
import { Search, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { MOCK_ROUTES, RouteResult as RouteResultType } from '@/data/routes';
import { RouteGraph } from '@/lib/graph';
import RouteResult from '@/components/RouteResult';
import NavigationMode from '@/components/NavigationMode';

const MapWithNoSSR = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-2xl flex items-center justify-center text-gray-400">Loading Map...</div>
});

const ACCESS_CODE = "ACCRA2024";

export default function Home() {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [codeError, setCodeError] = useState("");

  useEffect(() => {
    // Check session storage
    const unlocked = sessionStorage.getItem("trotro_access_unlocked");
    if (unlocked === "true") {
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode === ACCESS_CODE) {
      setIsUnlocked(true);
      sessionStorage.setItem("trotro_access_unlocked", "true");
      setCodeError("");
    } else {
      setCodeError("Invalid Access Code");
    }
  };

  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [result, setResult] = useState<RouteResultType | null>(null);
  const [loading, setLoading] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  import { RouteGraph } from '@/lib/graph';

  // ... imports remain the same ...

  const handleSearch = () => {
    setLoading(true);
    setHasSearched(false);
    setResult(null);

    // Mock network delay (keeping it for UX feel)
    setTimeout(() => {
      const fromLower = from.toLowerCase().trim();
      const toLower = to.toLowerCase().trim();

      // 1. Initialize Graph (Loads Mocks automatically)
      const graph = new RouteGraph();

      // 2. Inject Approved Routes from LocalStorage
      const approvedRoutes = JSON.parse(localStorage.getItem('trotro_approved_routes') || '[]');
      graph.injectRoutes(approvedRoutes);

      // 3. Find Shortest Path
      // (Note: Graph expects IDs, but we have names. We need to find ID by Name first or use Name as ID if simple)
      // Our Graph Logic uses IDs from STATIONS. 
      // If user types "Circle", we need to map to "circle".
      // Let's do a quick fuzzy match or direct ID match.

      const findIdByName = (name: string) => {
        // 1. Try exact match on Station Names
        const { STATIONS } = require('@/data/routes'); // lazy load to avoid cycle issues if any
        const station = STATIONS.find((s: any) => s.name.toLowerCase().includes(name) || s.id === name);
        if (station) return station.id;

        // 2. If not found in Stations, maybe it's a new node from approved routes?
        // Our Graph normalized inputs to lowercase IDs.
        return name;
      };

      const startId = findIdByName(fromLower);
      const endId = findIdByName(toLower);

      console.log(`Searching path from ${startId} to ${endId}`);

      const foundPath = graph.findShortestPath(startId, endId);

      if (foundPath) {
        // Convert to RouteResultType
        const result: RouteResultType = {
          id: `trip_${Date.now()}`,
          totalFare: foundPath.totalFare,
          totalDuration: foundPath.totalDuration,
          steps: foundPath.steps
        };
        setResult(result);
      }

      // Increment Daily Searches Counter
      const currentSearches = parseInt(localStorage.getItem('trotro_daily_searches') || '1284');
      localStorage.setItem('trotro_daily_searches', (currentSearches + 1).toString());

      setHasSearched(true);
      setLoading(false);
    }, 800);
  };

  if (!isUnlocked) {
    return (
      <div className="fixed inset-0 z-[60] bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center animate-in fade-in zoom-in duration-300">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <Lock size={32} />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h1>
          <p className="text-gray-500 mb-8">Enter the Field Tester Access Code to unlock the search interface.</p>

          <form onSubmit={handleUnlock} className="space-y-4">
            {codeError && (
              <div className="text-red-500 text-sm font-medium bg-red-50 p-2 rounded-lg">
                {codeError}
              </div>
            )}
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              className="w-full text-center text-2xl font-bold tracking-widest border-2 border-gray-200 rounded-xl py-3 focus:outline-none focus:border-blue-500 uppercase transition-colors"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Unlock Interface
            </button>
          </form>
          <p className="mt-6 text-xs text-gray-400">
            Trotro Route Finder &copy; 2024
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
      {/* Sidebar / Search Area */}
      <div className="w-full lg:w-1/3 flex flex-col bg-white z-10 shadow-xl lg:shadow-none overflow-hidden h-full">
        {isNavigating && result ? (
          <NavigationMode
            route={result}
            onEndNavigation={() => setIsNavigating(false)}
          />
        ) : (
          <div className="p-6 lg:p-10 flex flex-col justify-center h-full overflow-y-auto">
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-4">
                Navigate <span className="text-blue-600">Accra</span> <br /> Like a Pro.
              </h1>
              <p className="text-lg text-gray-600">
                Find the best trotro routes, calculate fares, and discover transfer points instantly.
              </p>
            </div>

            {/* Search Input Mock */}
            {!result && !isNavigating ? (
              <div className="space-y-6">
                <div className="bg-white p-2 rounded-2xl shadow-lg border border-gray-100 relative">
                  <div className="space-y-4 p-4">
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">From</label>
                      <input
                        type="text"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        placeholder="e.g. Kwame Nkrumah Circle"
                        className="w-full text-lg font-medium text-gray-900 placeholder-gray-400 border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="relative">
                      <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">To</label>
                      <input
                        type="text"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        placeholder="e.g. Madina Station"
                        className="w-full text-lg font-medium text-gray-900 placeholder-gray-400 border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleSearch}
                    disabled={loading || !from || !to}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed">
                    {loading ? (
                      <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    ) : (
                      <>
                        <Search size={20} />
                        Find Route
                      </>
                    )}
                  </button>
                </div>

                {hasSearched && !loading && (
                  <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-2">
                    <h3 className="text-lg font-bold text-orange-800 mb-2">Route Information Not Available</h3>
                    <p className="text-orange-700 text-sm mb-4">
                      We don't have a record for a direct route from <strong>{from}</strong> to <strong>{to}</strong> yet.
                    </p>
                    <p className="text-orange-700 text-sm mb-6">
                      Would you like to contribute this route to our database?
                    </p>
                    <a
                      href={`/contribute?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`}
                      className="block w-full text-center bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
                    >
                      Yes, Contribute This Route
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <RouteResult
                route={result!}
                onClose={() => { setResult(null); setHasSearched(false); }}
                onStartNavigation={() => setIsNavigating(true)}
              />
            )}
          </div>
        )}
      </div>

      {/* Map Area */}
      <div className="w-full lg:w-2/3 relative bg-gray-100 p-4 lg:p-6">
        <MapWithNoSSR route={result} />
      </div>
    </div>
  );
}
