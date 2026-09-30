# SAFENET

SAFENET is an AI-powered personal safety and city-safety platform designed for India.

The product is built around the principle:
PREVENT → DETECT → VERIFY → RESPOND → LEARN

The system does not claim to guarantee prevention of crime. Instead, it helps users choose safer routes, monitor Safe Journeys with consent, detect possible emergencies, and connect authorized responders with the minimum necessary information.

## Included product areas

- Mobile-first safety app for Safe Journey flows
- Guardian AI for route and safety conversation
- Transparent route risk analysis engine
- Emergency timer and escalation state machine
- Sensor anomaly detection framework
- Nearby safety node discovery
- Responder dashboard and simulated emergency integration
- Privacy, audit, consent, and retention architecture
- Production-oriented SQL schema for the data model

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + PostGIS schema included
- Realtime: websocket-ready state model with live polling demo
- AI: deterministic Guardian AI response layer plus safety heuristics

## Local run

1. Install dependencies:
   npm install
2. Start backend:
   npm run dev:api
3. Start frontend:
   npm run dev:web
4. Open http://localhost:5173

## Demo safety note

The emergency integration is simulated by design so the product can be shown safely without pretending to be connected to real police infrastructure.

## Security and ethics

- No false claim of guaranteed prevention
- No automatic criminal inference from AI alone
- Consent-based Safe Journey monitoring
- Verified safe nodes and emergency access only where authorized
- Sensitive data is minimized and auditable
