import { useEffect, useState } from 'react';

type RouteRisk = {
  routeId: string;
  routeName: string;
  distanceKm: number;
  durationMinutes: number;
  emergencyServices: string;
  publicActivity: string;
  lighting: string;
  incidentDensity: string;
  dataConfidence: number;
  reasons: string[];
};

type Journey = {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  selectedRoute: string;
  state: string;
  emergencyLevel: number;
  estimatedArrivalTime: string;
  monitoringStatus: string;
  consentState: string;
};

type SafetyNode = {
  id: string;
  name: string;
  type: string;
  district: string;
  nearbyMeters: number;
  verifiedSafe: boolean;
  beaconAvailable: boolean;
};

const API_URL = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  const [destination, setDestination] = useState('Banjara Hills');
  const [routes, setRoutes] = useState<RouteRisk[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteRisk | null>(null);
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [safetyNodes, setSafetyNodes] = useState<SafetyNode[]>([]);
  const [responseText, setResponseText] = useState('');
  const [guardianInput, setGuardianInput] = useState('Is this route safe?');
  const [incidentFeed, setIncidentFeed] = useState<any[]>([]);

  useEffect(() => {
    fetchRoutes();
    fetchNodes();
    fetchIncidents();

    const interval = setInterval(() => {
      fetchRoutes();
      fetchNodes();
      fetchIncidents();
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const fetchRoutes = async () => {
    const response = await fetch(`${API_URL}/safety/routes?origin=Nehru%20Place&destination=${encodeURIComponent(destination)}`);
    const data = await response.json();
    setRoutes(data.routes);
    if (!selectedRoute && data.routes.length > 0) {
      setSelectedRoute(data.routes[0]);
    }
  };

  const fetchNodes = async () => {
    const response = await fetch(`${API_URL}/nodes`);
    const data = await response.json();
    setSafetyNodes(data.nodes);
  };

  const fetchIncidents = async () => {
    const response = await fetch(`${API_URL}/responders/incidents`);
    const data = await response.json();
    setIncidentFeed(data.incidents);
  };

  const startSafeJourney = async () => {
    const response = await fetch(`${API_URL}/journeys/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-001',
        origin: 'Nehru Place',
        destination,
        selectedRoute: selectedRoute?.routeName || 'Route A'
      })
    });

    const data = await response.json();
    setActiveJourney(data.journey);
    setResponseText(data.message);
  };

  const askGuardian = async () => {
    const response = await fetch(`${API_URL}/guardian/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: guardianInput, selectedRoute: selectedRoute?.routeName || 'Route A' })
    });
    const data = await response.json();
    setResponseText(data.reply);
  };

  const triggerEmergency = async () => {
    const response = await fetch(`${API_URL}/integration/simulated`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        journeyId: activeJourney?.id || 'demo-journey',
        reason: 'possible emergency'
      })
    });
    const data = await response.json();
    setResponseText(data.message);
    fetchIncidents();
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <span className="brand-mark">SAFENET</span>
          <small>AI-powered personal safety platform</small>
        </div>
        <div className="nav-links">
          <button>Safe Journey</button>
          <button>Guardian AI</button>
          <button>Safety Map</button>
          <button>Privacy</button>
        </div>
      </header>

      <main className="layout-grid">
        <section className="panel large-panel">
          <div className="panel-header">
            <h1>SAFE JOURNEY</h1>
            <span className="badge success">Monitoring ready</span>
          </div>

          <label className="input-label">Where are you going?</label>
          <input
            value={destination}
            onChange={(event) => setDestination(event.target.value)}
            placeholder="Enter destination"
          />

          <button className="primary-btn" onClick={startSafeJourney}>START SAFE JOURNEY</button>

          <div className="route-grid">
            {routes.map((route) => (
              <button
                key={route.routeId}
                className={`route-card ${selectedRoute?.routeId === route.routeId ? 'selected' : ''}`}
                onClick={() => setSelectedRoute(route)}
              >
                <div className="route-header">
                  <strong>{route.routeName}</strong>
                  <span>{route.dataConfidence}% confidence</span>
                </div>
                <div className="route-stats">
                  <span>{route.distanceKm} km</span>
                  <span>{route.durationMinutes} min</span>
                </div>
                <ul>
                  <li>Emergency services: {route.emergencyServices}</li>
                  <li>Public activity: {route.publicActivity}</li>
                  <li>Lighting: {route.lighting}</li>
                  <li>Historic incident density: {route.incidentDensity}</li>
                </ul>
              </button>
            ))}
          </div>

          {selectedRoute && (
            <div className="explanation-box">
              <h3>Route assessment</h3>
              <p>
                <strong>{selectedRoute.routeName}</strong> has {selectedRoute.emergencyServices.toLowerCase()} emergency access,
                {selectedRoute.publicActivity.toLowerCase()} public activity, and {selectedRoute.lighting.toLowerCase()} lighting data.
                The route assessment is based on reported infrastructure conditions, geospatial risk indicators, and observed activity patterns.
              </p>
              <ul>
                {selectedRoute.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <aside className="panel side-panel">
          <div className="status-box active">
            <h3>SAFE JOURNEY ACTIVE</h3>
            <p><strong>Destination:</strong> {activeJourney?.destination || destination}</p>
            <p><strong>ETA:</strong> {activeJourney?.estimatedArrivalTime || '20:45'}</p>
            <p><strong>Monitoring:</strong> ACTIVE</p>
            <div className="action-row">
              <button className="ghost-btn">I&apos;m Safe</button>
              <button className="danger-btn" onClick={triggerEmergency}>Emergency</button>
            </div>
          </div>

          <div className="mini-card">
            <h3>Nearby Safety Nodes</h3>
            {safetyNodes.map((node) => (
              <div key={node.id} className="node-item">
                <strong>{node.name}</strong>
                <span>{node.type}</span>
                <small>{node.nearbyMeters} m away • {node.verifiedSafe ? 'Verified safe' : 'Check-in required'}</small>
              </div>
            ))}
          </div>
        </aside>

        <section className="panel">
          <div className="panel-header">
            <h2>Guardian AI</h2>
            <button className="mic-btn">🎙</button>
          </div>

          <textarea value={guardianInput} onChange={(event) => setGuardianInput(event.target.value)} />
          <button className="primary-btn" onClick={askGuardian}>Ask Guardian</button>
          <div className="response-box">
            {responseText || 'The guardian will explain route risk in plain language, separate verified information from uncertainty, and never pressure the user into a route.'}
          </div>
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Emergency Response Gateway</h2>
            <span className="badge neutral">DEMO / NOT CONNECTED TO REAL POLICE SYSTEM</span>
          </div>
          <p className="warning-text">Emergency-service integration is not currently available in this area.</p>
          <ul className="list-box">
            <li>Use emergency number 112</li>
            <li>Contact trusted contacts</li>
            <li>Nearby verified SAFENET nodes</li>
          </ul>
        </section>

        <section className="panel wide-panel">
          <div className="panel-header">
            <h2>Responder Dashboard</h2>
          </div>
          <div className="incident-list">
            {incidentFeed.map((incident) => (
              <div key={incident.id} className="incident-item">
                <div>
                  <strong>{incident.name}</strong>
                  <span>{incident.status}</span>
                </div>
                <small>{incident.location}</small>
                <small>{incident.lastUpdated}</small>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
