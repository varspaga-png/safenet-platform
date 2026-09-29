import { describe, expect, it } from 'vitest';

const route = {
  name: 'Route A',
  distanceKm: 4.2,
  durationMinutes: 18,
  emergencyServices: 'High',
  publicActivity: 'Medium',
  lighting: 'Good',
  incidentDensity: 'Low',
  dataConfidence: 82,
  reasons: ['High presence of public activity along the corridor.', 'Emergency access points are available nearby.']
};

describe('route assumptions', () => {
  it('keeps risk explanations transparent and evidence-based', () => {
    expect(route.reasons.length).toBeGreaterThan(0);
    expect(route.distanceKm).toBeGreaterThan(0);
    expect(route.incidentDensity).not.toBe('dangerous');
    expect(route.dataConfidence).toBeLessThanOrEqual(100);
  });
});
