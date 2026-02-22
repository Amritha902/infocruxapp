# 📊 Market Reaction Intelligence App

> A retail-focused trading intelligence companion for Indian equity markets — not a brokerage, not an advisor. A read-only statistical anomaly detection layer.

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-Proprietary-red)
![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA-blue)
![Market](https://img.shields.io/badge/market-Indian%20Equity-orange)

---

## Overview

**Market Reaction Intelligence** monitors corporate announcements, intraday market movements, abnormal return patterns, volume deviations, and entity relationships — then generates structured **Statistical Market Reaction Indicators** to help retail investors understand *how* the market is reacting.

It does **not** execute trades, provide investment advice, or make price predictions.

---

## 🎯 Core Vision

Provide retail investors with real-time context around:

- Corporate announcements
- Intraday abnormal price behavior
- Volume spikes and liquidity shifts
- Portfolio exposure to statistically unusual movements

The system focuses on **transparency and reaction analysis** — not prediction.

---

## 🧠 Key Features

### 1. Portfolio-Linked Monitoring
- Read-only broker integration
- Holdings-based continuous monitoring
- Real-time anomaly badge display
- Portfolio risk exposure summary

### 2. Continuous Intraday Monitoring
- 5-minute rolling anomaly detection
- Abnormal return computation
- Volume spike detection
- Index-adjusted deviation tracking
- Risk score generation (0–100)

### 3. Announcement Intelligence Engine
- Corporate announcement ingestion
- Named entity extraction & counterparty mapping
- Event-window modeling (−60 to +180 minutes)
- Abnormal reaction scoring

### 4. Share-to-Verify Module
- Accept shared text/news from other apps
- Extract referenced listed companies
- Cross-check against official disclosures
- Generate structured Market Reaction Analysis Summary

### 5. Intelligence Chat Interface
- Natural language queries
- Announcement lookup & intraday anomaly explanation
- Structured analytical responses
- No predictive or advisory output

### 6. Live Risk Monitor
- Real-time anomaly leaderboard
- Portfolio-only or discovery mode
- Intraday risk trend visualization

### 7. UI/UX
- Mobile-first, PWA-ready
- Light & Dark theme toggle
- Card-based fintech aesthetic
- Risk color-coding system

---

## ⚙️ Architecture

```
┌─────────────────────────────────────────┐
│              Frontend (Next.js)          │
│         React · PWA · Tailwind CSS       │
└────────────────────┬────────────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
┌───────▼────────┐      ┌─────────▼──────────┐
│   Firebase     │      │   ML Microservice   │
│  Auth · RTDB   │      │  FastAPI · Cloud Run│
│  Functions     │      │  Python · Docker    │
│  FCM · Storage │      └─────────────────────┘
└────────────────┘
```

| Layer      | Stack                                              |
|------------|----------------------------------------------------|
| Frontend   | Next.js, React, Tailwind CSS, PWA                  |
| Backend    | Firebase Auth, Firestore, Cloud Functions, FCM     |
| ML Service | Python, FastAPI, Docker, Google Cloud Run          |

---

## 🔁 Continuous Monitoring Pipeline

Runs every **5 minutes**:

```
1. Pull latest OHLCV data
2. Compute rolling baseline deviation
3. Apply statistical threshold pre-filter
4. Trigger ML inference if deviation exceeds threshold
5. Store anomaly score to Firestore
6. Update UI in real-time
7. Send push notification if risk threshold is crossed
```

> Alert fatigue is prevented via cooldown logic and adaptive threshold tuning.

---

## 📈 ML Engine

### Two Operating Modes

| Mode | Trigger |
|------|---------|
| **Event-Based** | New corporate announcement detected |
| **Intraday Monitoring** | Continuous, announcement-independent |

### Output Schema

```json
{
  "risk_score": 0,
  "confidence": 0.0,
  "abnormal_return": 0.0,
  "volume_spike_ratio": 0.0,
  "market_adjusted_return": 0.0,
  "drivers": ["explanation text"]
}
```

### Risk Levels

| Score | Level    | Color  |
|-------|----------|--------|
| 0–30  | Normal   | 🟢 Green  |
| 30–60 | Elevated | 🟡 Yellow |
| 60–80 | High     | 🟠 Orange |
| 80–100| Severe   | 🔴 Red    |

All outputs are framed as **statistical anomaly indicators** — never as buy/sell signals.

---

## 🗄️ Firestore Schema

```
├── users
├── portfolios
├── holdings
├── watchlists
├── announcements
├── entities
├── anomaly_scores
├── anomaly_history
├── shared_analysis_requests
└── chat_logs
```

---

## 🔐 Security & Compliance

- ❌ No trade execution capability
- ❌ No buy/sell recommendations
- ❌ No predictive statements
- ✅ Clear disclaimer module on all outputs
- ✅ Encrypted broker OAuth tokens
- ✅ Minimal PII storage
- ✅ Secure API communication (HTTPS + Firebase Rules)

---

## 📦 Project Structure

```
/
├── frontend/         # Next.js app (PWA)
├── backend/          # Firebase Cloud Functions
├── ml-service/       # FastAPI ML microservice
└── docs/             # Architecture & API docs
```

---

## 🚀 Deployment

### Firebase Services
- Firebase Hosting
- Firestore (database)
- Cloud Functions (backend logic)
- Cloud Messaging (push notifications)
- Authentication (OTP + Email)

### ML Service
```bash
# Build and deploy ML microservice
docker build -t market-reaction-ml ./ml-service
gcloud run deploy market-reaction-ml --image market-reaction-ml --platform managed
```

---

## 🛣️ Roadmap

### V1 — Core Intelligence
- [ ] Portfolio broker integration (read-only)
- [ ] Corporate announcement analysis
- [ ] Intraday anomaly detection
- [ ] Risk badge display

### V2 — Extended Features
- [ ] Share-to-Verify module
- [ ] Intelligence chat interface
- [ ] Live risk monitor
- [ ] Push notifications

### V3 — Scale
- [ ] Subscription model
- [ ] Institutional dashboard
- [ ] Advanced analytics
- [ ] Public API access layer

---

## ⚠️ Disclaimer

This platform provides **statistical market reaction indicators** for informational purposes only.

It does **not**:
- Provide investment advice
- Predict stock price movements
- Identify market misconduct
- Replace regulatory surveillance

Users must perform their own due diligence before making any investment decisions. This platform is not registered as an investment advisor under SEBI regulations.

---

## 📌 License

**Proprietary** — All rights reserved. Unauthorized use, reproduction, or distribution is strictly prohibited.

---

<div align="center">
  <sub>Built for the Indian retail investor. Powered by statistical intelligence, not speculation.</sub>
</div>