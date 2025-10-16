# Plaxo Frontend

Frontend da aplicação Plaxo Pay construído com Preact + Vite + TypeScript.

## Tecnologias

- **Preact** - Framework React-like otimizado
- **Vite** - Build tool rápido
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Preact Router** - Roteamento client-side

## Scripts

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

## Deploy

O deploy é automatizado via GitHub Actions:
1. Push para `main` dispara o workflow
2. Build da aplicação
3. Criação da imagem Docker
4. Deploy no CapRover

## Estrutura

```
src/
├── components/     # Componentes reutilizáveis
├── pages/         # Páginas da aplicação
├── hooks/         # Custom hooks
├── services/      # Chamadas API
├── contexts/      # Context providers
├── utils/         # Utilitários
├── app.tsx        # Componente raiz
└── main.tsx       # Entry point
```