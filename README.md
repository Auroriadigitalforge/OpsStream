<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# OpsStream AI — Stadium Crowd Load-Balancing Matrix

OpsStream AI treats physical stadium gates like network infrastructure nodes, incoming fans as data packets, and gate density as bandwidth utilization to dynamically optimize tournament operations and logistics for the **FIFA World Cup 2026**.

**Live Production Deployment:** [Launch OpsStream AI](https://opsstream-ai-521757871605.asia-southeast1.run.app/)  
**Google AI Studio Project Link:** [View App Workspace](https://ai.studio/apps/524c27b1-c2f3-482c-9c2e-1073192e866d)

---

## Challenge Specifications Documentation

### 1. Chosen Challenge Vertical & Persona
* **Target Challenge Vertical:** Navigation, Crowd Management, Multilingual Assistance, and Real-Time Operational Intelligence Support.
* **Target Operations Persona:** Stadium Venue Organizers, Safety Managers, and Security Staff Controls.

### 2. Approach and Logical Framework
Instead of analyzing crowd flows as isolated, manual human queues, this solution addresses them mathematically using networking principles. Under this framework:
* Physical stadium gates represent network hardware nodes.
* Streaming crowds are modeled as data packets traveling through the infrastructure.
* Gate throughput and line density represent active bandwidth utilization.

When a specific gate experiences an architectural traffic bottleneck, the core system calculates real-time rerouting matrixes to offload traffic onto physically adjacent, underutilized nodes before safety limits are breached.

### 3. How the Solution Works (Engineering Pipeline)
* **Asynchronous Telemetry Stream Emulation:** A high-frequency frontend loop (`setInterval`) dynamically updates live traffic metrics every 3 seconds with realistic arrival fluctuations ($\pm15$ attendees) to mock real-time WebSocket communication pipelines.
* **Compounding Bottleneck Penalty:** To simulate real-world congestion backups, if a gate’s ingestion throughput surpasses $80\%$ of its max capacity threshold, queue wait times automatically compound and spike by 30 seconds per evaluation tick.
* **Deterministic Structured Outputs:** The Node.js/Express backend integrates the Google Gen AI SDK utilizing a strict `responseSchema` validation protocol. This forces the Gemini model to return tightly typed, predictable JSON objects, eliminating runtime frontend parsing crashes.
* **Real-Time Tactical Response Generation:** Upon clicking "Analyze & Balance," the telemetry stream freezes. Gemini assesses the constraint physics of the snapshot, routes specific percentages of traffic to adjacent open zones, and generates localized public address announcements concurrently translated into English, Spanish, and French.

### 4. Architectural Assumptions Made
* **Proximity Map:** The balancing engine operates under the assumption that Gate A is structurally adjacent to Gate B, Gate B is adjacent to Gates A and C, Gate C is adjacent to Gates B and D, and Gate D is adjacent to Gate C.
* **Manual Override Capability:** The system assumes that stadium supervisors can manually tweak simulated variables in real-time to match physical visual data streams reported by volunteers on the ground.

---

## Setup and Installation

### Prerequisites
* **Node.js** (v18 or higher recommended)
* A valid **Gemini API Key** from Google AI Studio

## Validation & Testing
The repository includes a automated unit testing suite to validate telemetry thresholds and load-balancing algorithms.
* To execute the tests locally, run: `npm run test`

### Local Development Instructions
1. **Clone the repository:**
   Ensure you keep all project architecture in a single branch during initialization.
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set the GEMINI_API_KEY in .env.local to your Gemini API key**
4. **Run the app:**
    ```bash
    npm run dev
    ```
