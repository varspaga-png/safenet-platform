import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import {
  analyzeRoutes,
  createEmergencyEvent,
  generateGuardianReply,
  getResponderIncidents,
  getSafetyNodes,
  processJourneyEvent
} from './services/safety.js';
import type { Journey } from './types.js';

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(cors());
app.use(express.json());

const journeys = new Map<string, Journey>();
const auditLog: Array<{ type: string; timestamp: string; details: Record<string, unknown> }> = [];

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'SAFENET API' });
});

app.get('/api/safety/routes', (req, res) => {
  const origin = String(req.query.origin || 'Nehru Place');
  const destination = String(req.query.destination || 'Banjara Hills');
  res.json({ routes: analyzeRoutes(origin, destination), origin, destination });
});

app.post('/api/journeys/start', (req, res) => {
  const body = req.body as {
    userId?: string;
    origin?: string;
    destination?: string;
    selectedRoute?: string;
    consentState?: Journey['consentState'];
  };

  const journey = processJourneyEvent(
    {
      id: uuidv4(),
      userId: body.userId || 'user-demo',
      origin: body.origin || 'Nehru Place',
      destination: body.destination || 'Banjara Hills',
      selectedRoute: body.selectedRoute || 'Route A',
      monitoringStatus: 'ACTIVE',
      consentState: body.consentState || 'granted',
      createdAt: new Date().toISOString(),
      lastUpdatedAt: new Date().toISOString(),
      state: 'IDLE',
      emergencyLevel: 0,
      estimatedArrivalTime: '20:45'
    },
    'journey_started'
  );

  journeys.set(journey.id, journey);
  auditLog.push({
    type: 'journey_started',
    timestamp: new Date().toISOString(),
    details: {
      journeyId: journey.id,
      userId: journey.userId,
      destination: journey.destination,
      consentState: journey.consentState
    }
  });

  res.json({
    journey,
    message: 'SAFE JOURNEY ACTIVE. Emergency-service integration is not currently available in this area. Use 112 or trusted contacts if needed.',
    integrationStatus: 'simulated-demo'
  });
});

app.get('/api/journeys/:id', (req, res) => {
  const journey = journeys.get(req.params.id);
  if (!journey) {
    res.status(404).json({ error: 'Journey not found.' });
    return;
  }
  res.json({ journey, auditLog });
});

app.post('/api/journeys/:id/confirm', (req, res) => {
  const journey = journeys.get(req.params.id);
  if (!journey) {
    res.status(404).json({ error: 'Journey not found.' });
    return;
  }

  const updated = processJourneyEvent(journey, 'confirm_safe');
  journeys.set(journey.id, updated);
  auditLog.push({
    type: 'user_confirmed_safe',
    timestamp: new Date().toISOString(),
    details: { journeyId: journey.id }
  });

  res.json({ journey: updated, message: 'User has confirmed they are safe.' });
});

app.post('/api/journeys/:id/cancel', (req, res) => {
  const journey = journeys.get(req.params.id);
  if (!journey) {
    res.status(404).json({ error: 'Journey not found.' });
    return;
  }

  const updated = processJourneyEvent(journey, 'completed');
  journeys.set(journey.id, updated);
  auditLog.push({
    type: 'journey_cancelled',
    timestamp: new Date().toISOString(),
    details: { journeyId: journey.id }
  });

  res.json({ journey: updated, message: 'Safe Journey monitoring has been cancelled.' });
});

app.post('/api/journeys/:id/no-response', (req, res) => {
  const journey = journeys.get(req.params.id);
  if (!journey) {
    res.status(404).json({ error: 'Journey not found.' });
    return;
  }

  const updated = processJourneyEvent(journey, 'no_response');
  journeys.set(journey.id, updated);
  auditLog.push({
    type: 'no_response_escalation',
    timestamp: new Date().toISOString(),
    details: { journeyId: journey.id, level: updated.emergencyLevel }
  });

  res.json({ journey: updated, message: 'No response timeout triggered. Escalation level 3 is active.' });
});

app.post('/api/journeys/:id/emergency', (req, res) => {
  const journey = journeys.get(req.params.id);
  if (!journey) {
    res.status(404).json({ error: 'Journey not found.' });
    return;
  }

  const updated = processJourneyEvent(journey, 'emergency');
  journeys.set(journey.id, updated);
  const event = createEmergencyEvent(journey.id, String(req.body?.reason || 'possible emergency'));
  auditLog.push({
    type: 'emergency_escalated',
    timestamp: new Date().toISOString(),
    details: { journeyId: journey.id, event }
  });

  res.json({
    journey: updated,
    event,
    message: 'Emergency workflow triggered. Demo command center notified. No real police system is connected.'
  });
});

app.post('/api/guardian/chat', (req, res) => {
  const message = String(req.body?.message || '');
  const selectedRoute = String(req.body?.selectedRoute || 'Route A');
  const reply = generateGuardianReply(message, selectedRoute);
  auditLog.push({
    type: 'guardian_chat',
    timestamp: new Date().toISOString(),
    details: { message, reply }
  });
  res.json({ reply, route: selectedRoute });
});

app.get('/api/nodes', (_req, res) => {
  res.json({ nodes: getSafetyNodes() });
});

app.get('/api/responders/incidents', (_req, res) => {
  res.json({ incidents: getResponderIncidents() });
});

app.post('/api/integration/simulated', (req, res) => {
  const journeyId = String(req.body?.journeyId || 'demo-journey');
  const reason = String(req.body?.reason || 'possible emergency');
  const event = createEmergencyEvent(journeyId, reason);
  auditLog.push({
    type: 'simulated_integration_event',
    timestamp: new Date().toISOString(),
    details: { journeyId, event }
  });

  res.json({
    event,
    message: 'Emergency Response Gateway simulated alert created. Demo / Not connected to real police system.'
  });
});

app.listen(port, () => {
  console.log(`SAFENET API running on http://localhost:${port}`);
});
