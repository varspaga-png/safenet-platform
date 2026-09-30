import { describe, expect, it } from 'vitest';
import { analyzeRoutes, processJourneyEvent } from '../services/safety';

describe('SAFENET safety engine', () => {
  it('returns route risk profiles with transparent factors', () => {
    const routes = analyzeRoutes('Nehru Place', 'Banjara Hills');

    expect(routes.length).toBeGreaterThanOrEqual(2);
    expect(routes[0].reasons.length).toBeGreaterThan(0);
    expect(routes[0].dataConfidence).toBeGreaterThan(0);
  });

  it('escalates unresolved journey states correctly', () => {
    const updated = processJourneyEvent(
      {
        id: 'journey-001',
        userId: 'user-001',
        state: 'MONITORING',
        destination: 'Banjara Hills',
        selectedRoute: 'Route A',
        emergencyLevel: 1,
        consentState: 'granted',
        estimatedArrivalTime: '20:45',
        monitoringStatus: 'ACTIVE'
      },
      'no_response'
    );

    expect(updated.state).toBe('ESCALATION_LEVEL_3');
    expect(updated.emergencyLevel).toBeGreaterThanOrEqual(3);
  });
});
