## 1.Architecture design
```mermaid
graph TD
  A["User Browser"] --> B["React Frontend Application"]
  B --> C["UI Components + Styling System"]

  subgraph "Frontend Layer"
    B
    C
  end
```

## 2.Technology Description
- Frontend: React@18 + vite + tailwindcss@3 (of CSS Modules) + TypeScript
- Backend: None (niet nodig voor styling/layout)

## 3.Route definitions
| Route | Purpose |
|-------|---------|
| / | Dashboard-layout pagina met sidebar/topbar/cards |
