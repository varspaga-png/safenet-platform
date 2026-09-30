# SAFENET architecture notes

## Design principles

- Consent-first monitoring
- Transparent route risk, not hidden scoring
- Deterministic emergency escalation independent from AI alone
- Privacy-preserving nearby-location logic
- Simulated emergency integration clearly labeled as demo

## Core backend flow

1. User enters destination and selects a route.
2. SAFENET evaluates route factors and data confidence.
3. User explicitly grants consent before monitoring begins.
4. System starts a Safe Journey and records it in the journey table.
5. Guardian AI explains the route risk with plain-language reasoning.
6. Sensor anomaly checks and business rules trigger a timer-based verification.
7. Escalation occurs only when thresholds are crossed and no user confirmation is received.
8. An emergency event is sent to the configured integration only when authorized.

## Privacy and governance

- Encrypt data in transit and at rest
- Apply short retention windows for sensitive logs
- Minimize responder access to only the information necessary for action
- Keep immutable audit trails for each emergency or consent event
- Use least-privilege authorization and MFA for responder roles
