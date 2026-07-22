# ABPL Member Directory

Diretório B2B para freight forwarders, prestadores de serviços e vendedores de equipamentos. Duas personas: **Supplier** (paga para ser listado) e **Buyer** (paga para buscar e contactar). Produto SaaS próprio.

## Stack

- **Backend:** FastAPI + SQLAlchemy 2.0 + Pydantic v2 + Alembic + PostgreSQL (Supabase)
- **Pagamentos:** Stripe (USD, assinaturas mensais)
- **Email:** Resend
- **Frontend produção:** React 19 + Vite + Tailwind (`/frontend`) — **conectado à API real, deploy no Render (static site)**
- **Deploy:** Render — backend (Docker) + frontend (static) via `render.yaml`

## Arquitetura Backend

`Router → Service → Repository → Model` — padrão do projeto.

```
app/
  core/      config.py, database.py, security.py, limiter.py
  models/    company.py, subscription.py, quote.py, admin_user.py, company_event.py
  schemas/   company.py, subscription.py, quote.py
  repositories/  company.py, subscription.py, quote.py
  services/  company.py, stripe_service.py, event_service.py, email_service.py
  routers/   companies.py, subscriptions.py, quotes.py, admin.py, auth.py
  main.py
```

## Arquitetura Frontend

```
frontend/
  src/
    lib/        api.ts  ← cliente HTTP + tipos TypeScript da API
                auth.ts ← getToken / setToken / removeToken
    contexts/   AuthContext.tsx ← isAuthenticated, company, login, logout
    components/ Header.tsx, CompanyCard.tsx, PlanCard.tsx
    pages/      HomePage.tsx, DirectoryPage.tsx, CompanyProfilePage.tsx
                RegisterPage.tsx, PlansPage.tsx, LoginPage.tsx
                ForgotPasswordPage.tsx, ResetPasswordPage.tsx
                QuotesPage.tsx, AdminPage.tsx, ProfilePage.tsx
                PaymentSuccessPage.tsx
    data/       mock.ts  ← apenas listas estáticas (SPECIALTIES, COUNTRIES)
  .env.example  ← VITE_API_URL=http://localhost:8000
```

## Endpoints disponíveis

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| POST | `/api/auth/login` | — | Login; retorna JWT 30d + company |
| GET | `/api/auth/me` | JWT | Empresa autenticada |
| POST | `/api/auth/forgot-password` | — | Envia link de reset |
| POST | `/api/auth/reset-password` | — | Reseta senha via token |
| POST | `/api/companies` | — | Cadastrar empresa |
| GET | `/api/companies` | JWT | Buscar empresas (country, city, specialty, type) |
| GET | `/api/companies/{slug}` | JWT | Perfil público — contato gateado por subscription |
| PATCH | `/api/companies/{company_id}` | JWT (próprio) | Atualizar empresa |
| GET | `/api/subscriptions/plans` | — | Listar planos e preços |
| POST | `/api/subscriptions/checkout/{company_id}` | — | Criar sessão Stripe Checkout |
| POST | `/api/subscriptions/webhook` | Stripe sig | Webhook Stripe |
| POST | `/api/quotes/{buyer_company_id}` | JWT | Enviar RFQ (qualquer tipo de empresa) |
| GET | `/api/quotes/received/{supplier_id}` | JWT | RFQs recebidos |
| GET | `/api/quotes/sent/{buyer_id}` | JWT | RFQs enviados |
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

| Plan ID | Nome | Preço |
|---------|------|-------|
| supplier_basic | Supplier Basic | $49 |
| supplier_premium | Supplier Premium | $99 |
| buyer_basic | Buyer Basic | $29 |
| buyer_premium | Buyer Premium | $79 |

## Status da implementação

### ✅ Concluído

**Core Backend:**
- Models SQLAlchemy: Company, CompanyProfile, Subscription, Quote, AdminUser, CompanyEvent
- Schemas Pydantic v2 com validação de URL (SSRF prevention) em todos os campos de URL
- Repositories com try/except + rollback
- CompanyService, StripeService, event_service, email_service (Resend)
- Routers: companies, subscriptions, quotes, admin, auth
- Core: config, database, JWT security (company 30d + admin 8h + reset token)
- Alembic configurado (env.py) + migration de `role` em admin_users
- Docker + docker-compose
- CORS para Wix (`*.wixsite.com`, `*.wix.com`) + `FRONTEND_URL` env var

**Auth:**
- Login/logout com JWT 30 dias
- Forgot password + reset password (token 1h via Resend)
- `hadToken` pattern — não redireciona para login quando não há token, só quando token é rejeitado

**Admin:**
- Login com JWT 8h contendo `admin_role`
- Super Admin: cria/edita/desativa outros admins
- Aprovação e suspensão de empresas
- Timeline de eventos por empresa

**Segurança:**
- Rate limiting (slowapi): login 5/min, forgot-password 3/min, reset 5/min, admin/login 5/min, admin/setup 3/h, POST /companies 5/h
- Gating de contato: phone/email/website/linkedin/instagram nulificados para não-assinantes; `contact_visible: bool` no response
- Validação de URL: rejeita não-HTTP e IPs privados/loopback em logo_url, banner_url, website, linkedin_url, instagram_url
- Headers HTTP: X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy; em produção: HSTS + CSP

**Frontend:**
- 10 páginas: Home, Directory, CompanyProfile, Register, Plans, Login, ForgotPassword, ResetPassword, Quotes, Admin, Profile, PaymentSuccess
- `AuthContext` com persistência em localStorage
- Seção de depoimentos na homepage
- `/payment-success` com resumo do plano e próximos passos
- Link Admin sempre visível no header (desktop + mobile)
- RFQs: qualquer tipo de empresa pode enviar (buyer e supplier)
- Contato na página de perfil: dados reais para assinantes, lock overlay para não-assinantes

**Deploy:**
- `render.yaml` com `abpl-api` (Docker) + `abpl-frontend` (static)
- CORS inclui `https://abpl.onrender.com`

### ❌ Pendente — Infraestrutura (bloqueante para pagamentos)

- [ ] Criar produtos/preços no Stripe e copiar Price IDs para env vars do Render
- [ ] Setar `STRIPE_SECRET_KEY` + `STRIPE_WEBHOOK_SECRET` no Render
- [ ] Configurar webhook Stripe no dashboard → `https://abpl-api.onrender.com/api/subscriptions/webhook`
- [ ] Configurar Resend: `RESEND_API_KEY` + `EMAIL_FROM` no Render

### ❌ Pendente — Segurança (médio prazo)

- [ ] Verificação de email no cadastro (depende do Resend)
- [ ] JWT sem revogação — sem blacklist/refresh token; token de 30d fica válido até expirar
- [ ] Complexidade de senha — só valida ≥ 8 chars, sem regras de força
- [ ] Auditoria de acesso: timeline registra ações mas não quem acessou o perfil de quem

### ❌ Pendente — Backend

- [ ] Serviço de email: notificações de cadastro, aprovação, quote recebido
- [ ] `PATCH /api/companies/{id}` sem validação de status da empresa
- [ ] `ADMIN_KEY` env var separada do `SECRET_KEY`
- [ ] Mover lógica de quotes do router para `QuoteService`
- [ ] Filtrar diretório só por empresas com `subscription.status == active`

### ❌ Pendente — Frontend

- [ ] Dashboard do membro (editar perfil, ver status da assinatura, cancelar)
- [ ] Vincular `/payment-success` ao Stripe (depende dos Price IDs configurados)

## Convenções

- Inglês no código, português em comentários
- `PATCH /companies/{id}` futuramente deve exigir JWT do próprio company owner
- Admin auth usa JWT separado — `admin_role` claim, não `role` (que é do token de company)
- `frontend/src/data/mock.ts` mantém apenas listas estáticas (SPECIALTIES, COUNTRIES) — não adicionar dados fictícios
- URL fields: sempre validar com `_validate_public_url()` antes de persistir
