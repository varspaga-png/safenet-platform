import { v4 as uuidv4 } from 'uuid';
import type { Journey, JourneyState, RouteRisk, SafetyNode } from '../types.js';

const routeSeed: RouteRisk[] = [
  {
    routeId: 'route-a',
    routeName: 'Route A — Main arterial corridor',
    distanceKm: 4.2,
    durationMinutes: 18,
    emergencyServices: 'High',
    publicActivity: 'Medium',
    lighting: 'Good',
    incidentDensity: 'Low',
    dataConfidence: 82,
    reasons: [
      'This route has more public activity and nearby emergency resources than alternative options.',
      'Street lighting is generally good and there are more verified safe nodes nearby.',
      'The route assessment is based on historical incident density, time-of-day patterns, and infrastructure coverage.'
    ]
  },
  {
    routeId: 'route-b',
    routeName: 'Route B — Shorter but more isolated',
    distanceKm: 3.6,
    durationMinutes: 15,
    emergencyServices: 'Low',
    publicActivity: 'Low',
    lighting: 'Limited',
    incidentDensity: 'Unknown',
    dataConfidence: 51,
    reasons: [
      'This path is shorter, but it has fewer nearby public locations and emergency resources.',
      'Lighting data is limited and the route is more isolated than Route A.',
      'The assessment is intentionally cautious because some route-risk factors are uncertain or unavailable.'
    ]
  },
  {
    routeId: 'route-c',
    routeName: 'Route C — Transit-oriented route',
    distanceKm: 5.4,
    durationMinutes: 22,
    emergencyServices: 'Medium',
    publicActivity: 'High',
    lighting: 'Good',
    incidentDensity: 'Medium',
    dataConfidence: 76,
    reasons: [
      'This route has frequent public activity, but the travel time is longer.',
      'There are more people around the route, which can help with visibility and response.',
      'This route may be preferred when travel time is less important than safety context and visibility.'
    ]
  }
];

export function analyzeRoutes(origin: string, destination: string): RouteRisk[] {
  return routeSeed.map((route, index) => ({
    ...route,
    routeId: `${route.routeId}-${index + 1}`,
    routeName: `${route.routeName} (${origin} → ${destination})`
  }));
}

export function processJourneyEvent(journey: Partial<Journey>, event: string): Journey {
  let nextState: JourneyState = journey.state ?? 'IDLE';
  let nextLevel = journey.emergencyLevel ?? 0;

  switch (event) {
    case 'journey_started':
      nextState = 'MONITORING';
      nextLevel = 1;
      break;
    case 'route_deviation':
      nextState = 'USER_CONFIRMATION_REQUIRED';
      nextLevel = 2;
      break;
    case 'confirm_safe':
      nextState = 'USER_CONFIRMED_SAFE';
      nextLevel = 1;
      break;
    case 'no_response':
      nextState = 'ESCALATION_LEVEL_3';
      nextLevel = 3;
      break;
    case 'emergency':
      nextState = 'EMERGENCY_RESPONSE';
      nextLevel = 4;
      break;
    case 'completed':
      nextState = 'JOURNEY_COMPLETED';
      nextLevel = 0;
      break;
    default:
      nextState = 'MONITORING';
  }

  return {
    id: journey.id ?? uuidv4(),
    userId: journey.userId ?? 'user-demo',
    origin: journey.origin ?? 'Nehru Place',
    destination: journey.destination ?? 'Banjara Hills',
    selectedRoute: journey.selectedRoute ?? 'Route A',
    state: nextState,
    emergencyLevel: nextLevel,
    estimatedArrivalTime: journey.estimatedArrivalTime ?? '20:45',
    monitoringStatus: journey.monitoringStatus ?? 'ACTIVE',
    consentState: journey.consentState ?? 'granted',
    createdAt: journey.createdAt ?? new Date().toISOString(),
    lastUpdatedAt: new Date().toISOString()
  };
}

export function evaluateSensorAnomaly(input: {
  motionScore?: number;
  acceleration?: number;
  orientationChange?: number;
  gpsConfidence?: number;
}): {
  status: 'low' | 'medium' | 'high';
  confidence: number;
  message: string;
} {
  const motion = input.motionScore ?? 0.2;
  const acceleration = input.acceleration ?? 0.1;
  const orientation = input.orientationChange ?? 0.1;
  const gps = input.gpsConfidence ?? 0.8;

  const confidence = Math.min(
    99,
    Math.max(
      0,
      (motion * 32 + acceleration * 26 + orientation * 20 + (1 - gps) * 22) * 100
    )
  );

  if (confidence < 35) {
    return {
      status: 'low',
      confidence: Number(confidence.toFixed(1)),
      message: 'Sensor activity is within the normal operating range.'
    };
  }

  if (confidence < 70) {
    return {
      status: 'medium',
      confidence: Number(confidence.toFixed(1)),
      message: 'Unusual movement detected. Are you safe?'
    };
  }

  return {
    status: 'high',
    confidence: Number(confidence.toFixed(1)),
    message: 'Possible fall or sudden disturbance detected. Safety timer is active.'
  };
}

export function buildEmergencyTimer(secondsRemaining: number) {
  return {
    countdown: Math.max(0, secondsRemaining),
    prompt: 'Are you safe?',
    actions: ['I\'m safe', 'Continue monitoring', 'Emergency']
  };
}

export function generateGuardianReply(message: string, selectedRoute?: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('safe')) {
    return `The current route assessment indicates ${selectedRoute ?? 'Route A'} has moderate public activity, reasonable lighting information, and relatively stronger emergency access than comparable alternatives. This is not a guarantee, but it is a more evidence-based option than a route with limited lighting and fewer nearby resources.`;
  }

  if (lower.includes('should i take another route') || lower.includes('another route')) {
    return 'Route A appears to have more nearby public locations and emergency resources than Route B. Route B is shorter but has lower public activity and limited lighting information, so Route A is currently the better-supported option.';
  }

  if (lower.includes('police station') || lower.includes('safe location')) {
    return 'The nearest verified safety node is a SAFENET-verified public location approximately 180 metres from your current route corridor, with emergency support and a beacon. Distance and availability can change with travel conditions.';
  }

  if (lower.includes('cancel')) {
    return 'Your journey can be safely cancelled from the active monitoring screen. If you feel unsafe, choose Emergency to trigger the escalation workflow immediately.';
  }

  if (lower.includes('emergency')) {
    return 'If you are in immediate danger, use the Emergency button now. SAFENET will move to the emergency workflow and notify the configured response plan.';
  }

  return 'I can explain route risk in plain language. I can compare the available routes, describe verified information versus uncertainty, and help you decide whether a route has enough emergency coverage and public activity for your comfort level.';
}

export function getSafetyNodes(): SafetyNode[] {
  return [
    {
      id: 'node-01',
      name: 'Nehru Place Metro Station',
      type: 'Transit Hub',
      district: 'South Delhi',
      nearbyMeters: 180,
      verifiedSafe: true,
      beaconAvailable: true
    },
    {
      id: 'node-02',
      name: 'Saket Police Station',
      type: 'Police Station',
      district: 'South Delhi',
      nearbyMeters: 420,
      verifiedSafe: true,
      beaconAvailable: false
    },
    {
      id: 'node-03',
      name: 'Milan Hospital',
      type: 'Hospital',
      district: 'South Delhi',
      nearbyMeters: 560,
      verifiedSafe: true,
      beaconAvailable: false
    }
  ];
}

export function getResponderIncidents() {
  return [
    {
      id: 'INCIDENT-SN-18472',
      name: 'LEVEL 3 — NO USER RESPONSE',
      status: 'Awaiting responder action',
      location: 'Nehru Place → Banjara Hills',
      lastUpdated: '8 seconds ago'
    },
    {
      id: 'INCIDENT-SN-19421',
      name: 'LEVEL 2 — USER CONFIRMATION REQUESTED',
      status: 'User contacted',
      location: 'MG Road → Airport Road',
      lastUpdated: '22 seconds ago'
    }
  ];
}

export function createEmergencyEvent(journeyId: string, reason: string) {
  return {
    id: uuidv4(),
    journeyId,
    level: 'LEVEL 4',
    reason,
    timestamp: new Date().toISOString(),
    mode: 'DEMO / NOT CONNECTED TO REAL POLICE SYSTEM',
    message: 'Emergency event created in the simulated command center. No real police integration is active.'
  };
}
