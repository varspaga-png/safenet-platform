# SAFENET architecture notes

## Design principles

- Consent-first monitoring
- Deterministic emergency state machine independent from AI
- Privacy-preserving nearby-device awareness without exposing unrelated identities
- Simulated emergency integration in demo mode
- Authorized responder access only with RBAC and audit logging

## Core backend flow

1. User enters destination and selects a route.
2. SAFENET evaluates route factors and data confidence.
3. User explicitly grants consent before monitoring begins.
4. System starts Safe Journey monitoring and records in the journey table.
5. Guardian AI can explain the risk profile in plain language.
6. Sensor anomaly checks and business rules trigger timer-based verification.
7. Escalation occurs only when thresholds are crossed and no user confirmation is received.
8. Emergency event is sent only to the configured integration for authorized systems.

## Privacy architecture

- Encrypt data in transit and at rest
- Short retention periods via retention_policies
- Minimal data exposure to responders
- Least-privilege access model
- Immutable audit logs for user access and emergency actions
