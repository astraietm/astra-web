# ASTRA Monorepo

This project is a monorepo containing the frontend and backend applications for ASTRA.

## Structure

```
/
├── apps/
│   ├── web/  # React + Vite + Tailwind Frontend
│   └── api/  # Django REST Framework Backend
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- Python (v3.11+)

### Installation

1. Install dependencies:
   ```bash
   npm install
   cd apps/api
   pip install -r requirements.txt
   cd ../..
   ```

### Development

To run the frontend:
```bash
npm run dev:web
```

To run the backend:
```bash
npm run dev:api
```

## Deployment

- **Frontend**: Deployed on Vercel (`apps/web`)
- **Backend**: Deployed on Render (`apps/api`)
