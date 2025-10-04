# Plaxo Pay Frontend

Sistema de gerenciamento de pagamentos e assinaturas desenvolvido com Next.js 15 e TypeScript.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login seguro com JWT
- **Gerenciamento de Pagamentos**: Visualização e controle de transações
- **Assinaturas**: Controle de planos e renovações
- **Aplicações**: Gerenciamento de aplicações integradas
- **Dashboard**: Interface intuitiva para monitoramento

## 🛠️ Tecnologias

- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **Axios** - Cliente HTTP
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

## 📋 Pré-requisitos

- Node.js 18+
- npm, yarn ou pnpm

## 🔧 Instalação

1. Clone o repositório:

```bash
git clone <url-do-repositorio>
cd plaxo_pay_frontend
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. Configure as variáveis de ambiente:

```bash
# O sistema está configurado para usar http://localhost:3001 como API base
```

## 🚀 Executando o projeto

### Desenvolvimento

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

### Produção

```bash
npm run build
npm start
# ou
yarn build
yarn start
```

## 📁 Estrutura do Projeto

```
├── app/                    # App Router (Next.js 13+)
│   ├── applications/       # Página de aplicações
│   ├── payments/          # Página de pagamentos
│   ├── renewals/          # Página de renovações
│   └── subscriptions/     # Página de assinaturas
├── components/            # Componentes reutilizáveis
│   ├── ui/               # Componentes de interface
│   └── ...               # Componentes específicos
├── hooks/                # Custom hooks
├── lib/                  # Utilitários e configurações
│   ├── api-client.ts     # Cliente da API
│   ├── types.ts          # Definições de tipos
│   └── utils.ts          # Funções utilitárias
└── public/               # Arquivos estáticos
```

## 🔐 Autenticação

O sistema utiliza autenticação JWT. As credenciais padrão para desenvolvimento:

- **Usuário**: admin
- **Senha**: (configurar no backend)

## 🌐 API Integration

O frontend se conecta com a API backend através do cliente configurado em `lib/api-client.ts`.

Endpoints principais:

- `/auth/login` - Autenticação
- `/payments/*` - Gerenciamento de pagamentos
- `/subscriptions/*` - Gerenciamento de assinaturas
- `/applications/*` - Gerenciamento de aplicações

## 📱 Funcionalidades por Módulo

### Pagamentos

- Visualização de transações
- Filtros por status e aplicação
- Detalhes de pagamento
- Suporte a PIX, cartão de crédito e débito

### Assinaturas

- Controle de planos ativos
- Cancelamento e suspensão
- Renovações automáticas
- Histórico de cobrança

### Aplicações

- Cadastro de novas aplicações
- Gerenciamento de API keys
- Status de ativação

## 🎨 Interface

- Design responsivo
- Tema claro/escuro
- Componentes acessíveis (Radix UI)
- Animações suaves
