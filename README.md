# SAFENET

SAFENET is an AI-powered personal safety and city-safety platform for India. It helps users choose safer routes, monitor Safe Journeys with consent, detect possible emergency conditions, and connect authorized responders with the minimum necessary information.

## What is included

- Mobile-first responsive web app for user safety flows
- Route-risk analysis and transparent explanations
- Guardian AI assistant for route safety questions
- Safe Journey monitoring with consent tracking and timer logic
- Sensor/anomaly framework for fall or sudden movement alerts
- Simulated emergency response dashboard for demo use
- Nearby safety nodes and privacy-preserving proximity information
- Security and privacy architecture with consent records, audit logs, and retention guidance
- Database schema for production-oriented data model

## Stack

- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express + TypeScript
- Database: PostgreSQL + PostGIS schema (seed SQL included)
- Realtime: WebSocket-ready backend services and polling-based frontend updates
- AI: Guardian assistant with deterministic safety rules plus simulated AI responses

## Local setup

1. Install dependencies:
   npm install
2. Start the API:
   npm run dev:api
3. Start the frontend:
   npm run dev:web
4. Open http://localhost:5173

## Production principles

SAFENET is designed around the principle:

PREVENT → DETECT → VERIFY → RESPOND → LEARN

It does not claim to guarantee prevention of crime. Instead, it helps users choose safer routes, monitor journeys with consent, detect possible emergencies, and connect authorized responders with timely information.

## Demo note

The emergency integration is intentionally simulated so the product can be demonstrated safely without pretending to be connected to real police infrastructure.
