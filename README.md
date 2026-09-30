# SAFENET

SAFENET is an AI-powered personal safety and city-safety platform designed for India.

The platform helps users choose safer routes, monitor journeys with informed consent, detect possible emergencies, and connect authorized responders with only the necessary data.

## Design principle

PREVENT → DETECT → VERIFY → RESPOND → LEARN

## Core product areas

- Safe Journey route comparison and travel safety assessment
- Guardian AI assistant for plain-language route safety explanations
- Simulated emergency workflow and responder dashboard
- Privacy-first consent and audit features
- Safety node and nearby-public-location intelligence
- Production-oriented database schema for an operational system

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + PostGIS
- Demo realtime: polling-based updates with future websocket-ready architecture
- AI: deterministic Guardian assistant + risk heuristics

## Local setup

1. Install dependencies: `npm install`
2. Start the backend: `npm run dev:api`
3. Start the frontend: `npm run dev:web`
4. Open the app at `http://localhost:5173`

## Demo safety note

The emergency-response integration is intentionally simulated for demonstration. It is not connected to real police infrastructure and is labeled accordingly.

## Ethics and privacy

- Explicit consent before monitoring a journey
- No guarantee of prevention or prediction accuracy
- Minimal data disclosure to responders
- Incident escalation is a human-in-the-loop workflow, not autonomous enforcement
- Audit logs and retention policies for governance
