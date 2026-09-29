export type RouteRisk = {
  routeId: string;
  routeName: string;
  distanceKm: number;
  durationMinutes: number;
  emergencyServices: 'High' | 'Medium' | 'Low';
  publicActivity: 'High' | 'Medium' | 'Low';
  lighting: 'Good' | 'Limited' | 'Poor';
  incidentDensity: 'Low' | 'Medium' | 'High' | 'Unknown';
  dataConfidence: number;
  reasons: string[];
};

export type JourneyState =
  | 'IDLE'
  | 'JOURNEY_STARTED'
  | 'MONITORING'
  | 'ANOMALY_DETECTED'
  | 'USER_CONFIRMATION_REQUIRED'
  | 'USER_CONFIRMED_SAFE'
  | 'USER_NO_RESPONSE'
  | 'ESCALATION_LEVEL_1'
  | 'ESCALATION_LEVEL_2'
  | 'ESCALATION_LEVEL_3'
  | 'EMERGENCY_RESPONSE'
  | 'RESPONDER_ACKNOWLEDGED'
  | 'RESOLVED'
  | 'JOURNEY_COMPLETED';

export type Journey = {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  selectedRoute: string;
  state: JourneyState;
  emergencyLevel: number;
  estimatedArrivalTime: string;
  monitoringStatus: 'ACTIVE' | 'PAUSED' | 'OFF';
  consentState: 'granted' | 'pending' | 'withdrawn';
  createdAt: string;
  lastUpdatedAt: string;
};

export type SafetyNode = {
  id: string;
  name: string;
  type: 'Police Station' | 'Hospital' | 'University' | 'Transit Hub' | 'Business';
  district: string;
  nearbyMeters: number;
  verifiedSafe: boolean;
  beaconAvailable: boolean;
};
