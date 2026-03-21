# 🌊 Ocean Explorer

Application full stack de découverte des mers et océans du monde.

**Équipe** : Gaspar Le Forestier, Marwane Chafi, Stanislas Prigent  
**Cours** : Cloud Azure — ESGI

---

## Architecture

- **Front-end** : Vue.js 3 → Azure Static Web Apps
- **Back-end** : Node.js / Express → Azure App Service
- **Base de données** : Azure Cosmos DB (NoSQL)
- **Secrets** : Azure Key Vault
- **CI/CD** : GitHub Actions

## Lancer en local

```bash
# Back-end
cd backend
npm install
cp .env.example .env   # remplir les variables si besoin
npm run dev            # démarre sur http://localhost:3000

# Front-end (dans un autre terminal)
cd frontend
npm install
npm run dev            # démarre sur http://localhost:5173
```

## Routes API

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/api/health` | Santé de l'API |
| GET | `/api/oceans` | Liste tous les océans/mers |
| GET | `/api/oceans/:id` | Détail d'un océan |
| POST | `/api/oceans` | Ajouter un océan/mer |
| GET | `/api/species` | Liste toutes les espèces |
| GET | `/api/species/:id` | Détail d'une espèce |
| POST | `/api/species` | Ajouter une espèce |

## Tests

```bash
cd backend
npm test
```
