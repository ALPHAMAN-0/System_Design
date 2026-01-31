# Bloom Filter Simulator 🌸

An interactive web application to learn and visualize how **Bloom Filters** work. Perfect for understanding probabilistic data structures!

![Bloom Filter Visualization](https://via.placeholder.com/800x400?text=Bloom+Filter+Simulator)

## What is a Bloom Filter?

A **Bloom Filter** is a space-efficient probabilistic data structure used to test whether an element is a member of a set.

### Key Properties

| Property | Description |
|----------|-------------|
| ✅ **No False Negatives** | If it says "NO", the element is **definitely NOT** in the set |
| ⚠️ **Possible False Positives** | If it says "YES", the element **might** be in the set |
| 🚀 **Fast Operations** | O(k) time complexity for both insert and lookup |
| 💾 **Space Efficient** | Uses a compact bit array instead of storing actual values |

### Why False Positives Happen

1. When inserting a value, multiple hash functions set specific bits to 1
2. Different values might set overlapping bits
3. When checking a new value, all its hash positions might already be 1 (set by other values)
4. The filter incorrectly thinks the value exists

---

## Architecture

```
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   React App     │ ───▶ │   Express API   │ ───▶ │   PostgreSQL    │
│   (Port 3000)   │      │   (Port 5000)   │      │   (Port 5432)   │
└─────────────────┘      └─────────────────┘      └─────────────────┘
     Frontend               Backend                  Database
```

---

## Quick Start with Docker 🐳

**Prerequisites:** Docker and Docker Compose installed

```bash
# Clone or navigate to the project
cd "Bloom Filter"

# Start all services
docker-compose up --build

# Open in browser
open http://localhost:3000
```

### Stop the application

```bash
docker-compose down
```

---

## Run Locally (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL (or use Docker for just the database)

### Step 1: Start PostgreSQL

```bash
docker run -d \
  --name bloom-postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=bloomfilter \
  -p 5432:5432 \
  postgres:15-alpine
```

### Step 2: Start Backend

```bash
cd backend
npm install
npm run dev
```

### Step 3: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### Step 4: Open Browser

Navigate to **http://localhost:5173**

---

## API Reference

### Add a Value
```bash
POST /api/add
Content-Type: application/json

{"value": "apple"}
```

### Check a Value
```bash
POST /api/check
Content-Type: application/json

{"value": "apple"}
```

### Reset Filter
```bash
POST /api/reset
```

### Get Status
```bash
GET /api/status
```

---

## Sample Test Data

Try these values to see the Bloom Filter in action:

| Action | Values | Expected Result |
|--------|--------|-----------------|
| **Add** | apple, banana, cherry, date | Bits will be set |
| **Check** | apple | "Maybe Yes" ✓ |
| **Check** | elderberry | "Definitely No" (usually) |
| **Check** | random123 | Could be false positive if bits collide |

---

## Project Structure

```
Bloom Filter/
├── docker-compose.yml       # Docker orchestration
├── README.md                # This file
│
├── backend/
│   ├── Dockerfile           # Backend container
│   ├── package.json         # Dependencies
│   └── src/
│       ├── index.js         # Express server
│       ├── config/db.js     # Database connection
│       ├── bloomfilter/
│       │   ├── BloomFilter.js    # Core implementation
│       │   └── hashFunctions.js  # Hash algorithms
│       └── routes/api.js    # REST endpoints
│
└── frontend/
    ├── Dockerfile           # Frontend container
    ├── package.json         # Dependencies
    └── src/
        ├── App.jsx          # Main component
        ├── App.css          # Styles
        └── components/      # UI components
```

---

## Technologies Used

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, Vite |
| **Backend** | Node.js, Express |
| **Database** | PostgreSQL |
| **Containerization** | Docker, Docker Compose |
| **Styling** | CSS (Glassmorphism, Dark Mode) |

---

## How the Bloom Filter Works

### Hash Functions Used

1. **DJB2** - Created by Daniel J. Bernstein
2. **SDBM** - Used in SDBM database
3. **Lose Lose** (modified) - Simple additive hash
4. **FNV-1a** - Fowler-Noll-Vo hash

Each value is run through **4 hash functions**, generating 4 bit positions to set.

### Configuration

- **Bit Array Size:** 64 bits (configurable)
- **Hash Functions:** 4

---

## Troubleshooting

### Port already in use

```bash
# Find and kill process using port
lsof -i :3000
kill -9 <PID>
```

### Database connection failed

```bash
# Check if PostgreSQL is running
docker ps

# View logs
docker-compose logs postgres
```

### Clear all data

```bash
docker-compose down -v  # Removes volumes too
docker-compose up --build
```

---

## License

MIT License - Feel free to use for learning and teaching!

---

Made with 🌸 for learning probabilistic data structures
