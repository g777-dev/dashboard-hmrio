# Dashboard HM Rio — Campaign Manager

Dashboard de performance Meta Ads para a **HM Rio Embalagens Descartáveis**, com integração em tempo real, insights automáticos, recomendações estratégicas e assistente IA.

Desenvolvido por **G7 Soluções Digitais**.

---

## Stack

- **React 18** + **Vite 5**
- **Recharts** para visualizações
- **Vercel Serverless Functions** para o proxy IA
- **Google Gemini 1.5 Flash** (opcional, para o assistente)
- **Meta Marketing API v19.0**

---

## Como rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:5173`.

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz baseado no `.env.example`:

```env
# Meta Ads (obrigatório para ver dados)
META_ACCESS_TOKEN=
META_AD_ACCOUNT_ID=
META_APP_ID=
META_APP_SECRET=

# Gemini (opcional — para o chat IA funcionar)
GEMINI_API_KEY=
```

> **Importante:** os 4 valores do Meta podem ser inseridos diretamente pela interface (botão "Conectar"). As variáveis `.env` são úteis se você quiser servir o token a partir do servidor no futuro. Atualmente o token e o accountId ficam salvos no `localStorage` do navegador.

### Como obter o Access Token e Ad Account ID

1. Acesse o **Meta Business Manager** → Business Settings.
2. Vá em **System Users** e gere um novo token com as permissões: `ads_read`, `ads_management`, `read_insights`.
3. O **Ad Account ID** está em **Ad Accounts** no formato `act_XXXXXXXXXX`.

### Como obter a chave Gemini

Acesse `https://aistudio.google.com/apikey` e gere uma chave gratuita.

---

## Deploy na Vercel

1. **Crie um repositório no GitHub** e suba todos os arquivos da pasta.
2. **Importe o repositório na Vercel** (https://vercel.com/new).
3. Framework será detectado automaticamente como **Vite**.
4. (Opcional) Adicione a variável `GEMINI_API_KEY` em **Environment Variables** se quiser o chat IA.
5. Clique em **Deploy**.

Após o deploy, abra a URL gerada e clique em **Conectar** para inserir o token e o Ad Account ID.

---

## Funcionalidades

- **Visão Geral** — KPIs principais, performance no período, distribuição por objetivo, eficiência com benchmarks B2B, top campanhas ativas.
- **Insights automáticos** — detecta CTR baixo, CPC alto, fadiga de criativos, top performers e campanhas pausadas com potencial.
- **Recomendações estratégicas** — sugestões priorizadas de escalar, pausar, renovar criativos e diversificar objetivos.
- **Campanhas** — listagem completa com filtros por status, objetivo e busca.
- **Conjuntos** — top 10 conjuntos por investimento com CTR colorido por performance.
- **Criativos** — análise por campanha/conjunto, melhor e pior CTR em destaque.
- **WhatsApp** — aba dedicada para campanhas de mensagens com CPL específico.
- **Reconhecimento** — campanhas de awareness e engajamento com alcance, impressões, CPM e frequência.
- **Comparar** — seleção de até 4 campanhas para comparativo lado a lado em gráfico e tabela.
- **Histórico** — linha do tempo de investimento, top 7 dias, tendência 1ª vs 2ª metade.
- **Filtros de período** — Hoje, Ontem, 7d, 14d, 30d, 90d, Mês atual, Mês anterior.
- **Status real** — campanhas só aparecem como "Ativa" se tiverem investimento. Estados como "Sem investimento", "Aguardando dados", "Pausada" são distinguidos.
- **Auto-refresh** a cada 5 minutos quando a aba está aberta.

---

## Estrutura de pastas

```
hmrio/
├── api/
│   └── ai.js                    # Proxy serverless para Gemini
├── src/
│   ├── components/
│   │   ├── layout/              # Header, Tabs, Footer, ConnectionBanner
│   │   ├── ui/                  # KPICard, Modal, EmptyState, etc
│   │   ├── campaigns/           # CampaignCard
│   │   ├── charts/              # PerformanceChart, HistoryTimeline
│   │   ├── insights/            # AutoInsights, Recommendations
│   │   ├── ConnectModal.jsx
│   │   └── ShareModal.jsx
│   ├── tabs/                    # Overview, Campaigns, AdSets, etc
│   ├── services/
│   │   └── metaApi.js           # Camada Meta API
│   ├── hooks/
│   │   └── useMetaData.js       # Hook de gerenciamento
│   ├── utils/
│   │   ├── format.js            # Formatadores BR
│   │   ├── classify.js          # Status real e categoria
│   │   └── insights.js          # Motor de insights
│   ├── theme.js                 # Design tokens (verde HM Rio)
│   ├── AiChat.jsx
│   ├── Dashboard.jsx            # Orquestrador
│   └── main.jsx                 # Entry point
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
├── .env.example
└── .gitignore
```

---

## Identidade visual

- **Verde principal:** `#0F7A3E`
- **Verde escuro:** `#0A4D27`
- **Acento (laranja):** `#F59E0B`
- **Tipografia:** Bricolage Grotesque (títulos) + Inter (texto) + JetBrains Mono (números)

---

© G7 Soluções Digitais — Dashboard de performance Meta Ads para HM Rio Embalagens Descartáveis.
