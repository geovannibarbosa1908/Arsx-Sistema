# Open Networking

Diretório B2B genérico freemium: qualquer empresa pode se cadastrar e ser encontrada. Modelo free/pro/business — contatos gatados por assinatura ativa.

## Stack

- **Backend:** FastAPI + SQLAlchemy 2.0 + Pydantic v2 + Alembic + PostgreSQL (Supabase)
- **Pagamentos:** Stripe (USD, assinaturas mensais)
- **Email:** Resend
- **Frontend:** React 19 + Vite + Tailwind (`/frontend`) — deploy no Render (static site)
- **Deploy:** Render — backend (Docker) + frontend (static) via `render.yaml`

## Dev local

```bash
# Backend (D:\OpenNetworking)
uvicorn app.main:app --reload --port 8000

# Frontend (D:\OpenNetworking\frontend)
npm run dev   # http://localhost:5173
```

Ou rode `dev.ps1` na raiz para abrir os dois de uma vez.

## Arquitetura Backend

`Router → Service → Repository → Model` — padrão do projeto.

```
app/
  core/          config.py, database.py, security.py, limiter.py
  models/        company.py, subscription.py, quote.py, admin_user.py, company_event.py
  schemas/       company.py, subscription.py, quote.py
  repositories/  company.py, subscription.py, quote.py
  services/      company.py, stripe_service.py, event_service.py, email_service.py
  routers/       companies.py, subscriptions.py, quotes.py, admin.py, auth.py
  main.py
```

## Arquitetura Frontend

```
frontend/src/
  lib/        api.ts  ← cliente HTTP + tipos TypeScript
              auth.ts ← getToken / setToken / removeToken (localStorage: on_token, on_company)
  contexts/   AuthContext.tsx ← isAuthenticated, company, login, logout
  components/ Header.tsx, CompanyCard.tsx, PlanCard.tsx
  pages/      HomePage.tsx, DirectoryPage.tsx, CompanyProfilePage.tsx
              RegisterPage.tsx, PlansPage.tsx, LoginPage.tsx
              ForgotPasswordPage.tsx, ResetPasswordPage.tsx
              QuotesPage.tsx, AdminPage.tsx, ProfilePage.tsx
              PaymentSuccessPage.tsx
  data/       mock.ts ← INDUSTRIES, COUNTRIES, TESTIMONIALS, PLANS (listas estáticas)
```

## Endpoints

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/login` | — | Login; retorna JWT 30d + company |
| GET | `/api/auth/me` | JWT | Empresa autenticada |
| POST | `/api/auth/forgot-password` | — | Envia link de reset |
| POST | `/api/auth/reset-password` | — | Reseta senha via token |
| POST | `/api/companies` | — | Cadastrar empresa |
| GET | `/api/companies` | JWT | Buscar empresas (country, city, industry, tag) |
| GET | `/api/companies/{slug}` | JWT | Perfil público — contato gateado por subscription |
| PATCH | `/api/companies/{company_id}` | JWT (próprio) | Atualizar empresa |
| GET | `/api/subscriptions/plans` | — | Listar planos e preços |
| POST | `/api/subscriptions/checkout/{company_id}` | — | Criar sessão Stripe Checkout |
| POST | `/api/subscriptions/webhook` | Stripe sig | Webhook Stripe |
| POST | `/api/quotes/{buyer_company_id}` | JWT | Enviar mensagem/RFQ |
| GET | `/api/quotes/received/{company_id}` | JWT | Mensagens recebidas |
| GET | `/api/quotes/sent/{company_id}` | JWT | Mensagens enviadas |
| POST | `/api/admin/login` | — | Login admin; retorna JWT 8h com role |
| POST | `/api/admin/setup` | — | Cria primeiro super_admin (bloqueado se já existe) |
| GET | `/api/admin/companies` | Admin JWT | Lista todas as empresas |
| GET | `/api/admin/companies/pending` | Admin JWT | Listar pendentes |
| POST | `/api/admin/companies/{id}/approve` | Admin JWT | Aprovar empresa |
| POST | `/api/admin/companies/{id}/suspend` | Admin JWT | Suspender empresa |
| GET | `/api/admin/companies/{id}/events` | Admin JWT | Timeline de eventos |
| GET | `/api/admin/users` | Super Admin JWT | Listar admins |
| POST | `/api/admin/users` | Super Admin JWT | Criar admin |
| PATCH | `/api/admin/users/{id}` | Super Admin JWT | Ativar/desativar/editar admin |

## Planos Stripe (USD/mês)

| Plan ID | Nome | Preço | Acesso |
|---------|------|-------|--------|
| — | Free | $0 | Perfil visível, sem acesso a contatos |
| pro | Pro | $29 | Ver contatos + enviar mensagens |
| business | Business | $79 | Pro + listing em destaque + analytics |

Free não passa pelo Stripe — cadastro vai direto para login.

## Modelo de dados (diferenças do ABPL)

- `Company.industry` (String, nullable) em vez de `company_type` (Enum)
- `CompanyProfile.tags` (JSON) em vez de `specialties/transport_modes/cargo_types/trade_lanes`
- `PlanType`: `pro` | `business` (sem supplier_*/buyer_*)
- Sem CORS para Wix — apenas `FRONTEND_URL` env var

## Status da implementação

### ✅ Concluído

**Core Backend:**
- Models SQLAlchemy: Company, CompanyProfile, Subscription, Quote, AdminUser, CompanyEvent
- Schemas Pydantic v2 com SSRF prevention em todos os campos de URL
- Repositories com try/except + rollback
- CompanyService, StripeService, event_service, email_service (Resend)
- Routers: companies, subscriptions, quotes, admin, auth
- Core: config, database, JWT (company 30d + admin 8h + reset token 15min)
- Alembic: migration inicial limpa (`alembic/versions/0001_initial.py`)
- Docker + docker-compose
- Rate limiting (slowapi), security headers, gating de contato

**Auth:**
- Login/logout JWT 30 dias
- Forgot password + reset password via Resend
- `hadToken` pattern — redireciona para login só quando token é rejeitado

**Admin:**
- Login JWT 8h com `admin_role` claim
- Super Admin: gerencia outros admins
- Aprovação/suspensão de empresas + timeline de eventos

**Frontend:**
- 11 páginas: Home, Directory, CompanyProfile, Register, Plans, Login, ForgotPassword, ResetPassword, Quotes, Admin, Profile, PaymentSuccess
- Cadastro freemium: free vai para login direto, pro/business vai para Stripe
- `AuthContext` com persistência em `on_token` / `on_company`
- Filtros no diretório: country, city, industry
- Contato: bloqueado (blur overlay) para não-assinantes

**Deploy:**
- `render.yaml`: `on-api` (Docker) + `on-frontend` (static)

### ❌ Pendente — Infraestrutura (bloqueante para pagamentos)

- [ ] Criar conta/projeto no Supabase e rodar `alembic upgrade head`
- [ ] Criar produtos Pro + Business no Stripe → copiar Price IDs para `.env`
- [ ] Setar `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` no Render
- [ ] Configurar webhook Stripe → `https://on-api.onrender.com/api/subscriptions/webhook`
- [ ] Configurar Resend: `RESEND_API_KEY` + `EMAIL_FROM`

### ❌ Pendente — Backend

- [ ] Filtrar diretório só por empresas com `subscription.status == active` (hoje mostra todas active independente de plano)
- [ ] Emails de notificação: cadastro recebido, aprovação, mensagem recebida
- [ ] `PATCH /api/companies/{id}` sem validação de status da empresa (permite editar empresa suspensa)
- [ ] Mover lógica de quotes do router para `QuoteService`

### ❌ Pendente — Frontend

- [ ] Dashboard do membro: status da assinatura, link para gerenciar/cancelar no Stripe
- [ ] Vincular `/payment-success` ao plano real via Stripe session

### ❌ Pendente — Segurança (médio prazo)

- [ ] Verificação de email no cadastro
- [ ] JWT sem revogação (token 30d válido até expirar)
- [ ] Regras de complexidade de senha (hoje: mínimo 8 chars)

## Convenções

- Inglês no código, português em comentários
- `mock.ts` mantém apenas listas estáticas — nunca dados fictícios
- URL fields: sempre validar com `_validate_public_url()` antes de persistir
- Admin auth usa JWT separado — claim `admin_role`, não `role` (que é do token de company)
- localStorage: `on_token` / `on_company` / `on_admin_token` / `on_admin_name` / `on_admin_role`
