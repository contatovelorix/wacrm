# FLOW — Mapa técnico

## Arquitetura

- Monólito modular em Next.js 16, App Router, React 19 e TypeScript.
- UI com Tailwind CSS 4, shadcn/Base UI, componentes por domínio e suporte responsivo.
- Supabase para PostgreSQL, Auth, Storage, Realtime e RLS.
- Rotas de página em `src/app/`, APIs em `src/app/api/`, domínio em `src/lib/` e UI em `src/components/`.
- Banco versionado em `supabase/migrations/`, com isolamento multi-tenant por conta.
- Integração oficial com a Meta WhatsApp Cloud API.
- REST API pública em `src/app/api/v1/` e servidor MCP em `mcp-server/`.

## Mapa dos módulos existentes

| Módulo | Estado | Arquivos e pastas principais |
| --- | --- | --- |
| Autenticação e equipes | Maduro | `src/app/(auth)/`, `src/app/join/`, `src/app/api/account/`, `src/app/api/invitations/`, `src/lib/auth/`, `src/proxy.ts` |
| CRM | Maduro | `src/app/(dashboard)/contacts/`, `src/components/contacts/`, `src/lib/contacts/`, `src/app/api/v1/contacts/` |
| WhatsApp e inbox | Maduro | `src/app/(dashboard)/inbox/`, `src/components/inbox/`, `src/app/api/whatsapp/`, `src/lib/whatsapp/`, `src/lib/inbox/` |
| Pipeline | Maduro | `src/app/(dashboard)/pipelines/`, `src/components/pipelines/`, `src/components/settings/deals-settings.tsx` |
| Broadcasts | Maduro | `src/app/(dashboard)/broadcasts/`, `src/components/broadcasts/`, `src/lib/broadcast-*` |
| Automações | Implementado | `src/app/(dashboard)/automations/`, `src/app/api/automations/`, `src/components/automations/`, `src/lib/automations/` |
| Flows conversacionais | Implementado | `src/app/(dashboard)/flows/`, `src/app/api/flows/`, `src/components/flows/`, `src/lib/flows/` |
| IA | Implementado | `src/app/(dashboard)/agents/`, `src/app/api/ai/`, `src/components/agents/`, `src/components/settings/ai-*`, `src/lib/ai/` |
| Dashboard | Implementado | `src/app/(dashboard)/dashboard/`, `src/components/dashboard/`, `src/lib/dashboard/` |
| API e integrações | Implementado | `src/app/api/v1/`, `src/lib/api/v1/`, `src/lib/api-keys/`, `src/lib/webhooks/`, `docs/public-api.md` |

## Banco e Supabase

- A fonte de verdade do schema é `supabase/migrations/`; `supabase/ci/verify-schema.sql` auxilia sua verificação.
- O banco já modela contas, perfis, contatos, tags, campos personalizados, conversas, mensagens, pipelines, negócios, campanhas, automações, flows, IA, notificações, chaves de API e webhooks.
- RLS protege as entidades e o modelo atual usa `account_id` para tenancy; colunas históricas `user_id` ainda aparecem em várias estruturas.
- Storage atende avatares e mídias de chat/flows; algumas mídias precisam ser públicas para consumo pela Meta.
- Novas tabelas devem seguir o escopo por conta, RLS e migrations incrementais existentes.

## Autenticação

- Supabase Auth com login, cadastro, recuperação de senha e gestão de sessão.
- Equipes com convites e papéis `owner`, `admin`, `agent` e `viewer`.
- Proteção de páginas privadas em `src/proxy.ts` e `src/app/(dashboard)/layout.tsx`.
- Regras de capacidade centralizadas em `src/lib/auth/roles.ts`.

## WhatsApp

- Webhooks, envio, mídia, templates, broadcasts, mensagens interativas, replies, reações e status de entrega já existem.
- Pontos centrais: `src/app/api/whatsapp/`, `src/lib/whatsapp/`, `src/components/inbox/` e `src/components/settings/whatsapp-config.tsx`.
- Os novos canais públicos devem reutilizar contatos e conversas, sem duplicar a inbox.

## CRM

- Contatos, tags, campos personalizados, notas, CSV e deduplicação estão implementados.
- Novos leads originados por página pública, agenda ou mini-chat devem entrar no CRM existente, preservando identidade, origem e conta.

## Pipeline

- Pipelines, estágios, negócios, responsáveis, valores e analytics estão implementados.
- Os novos módulos devem poder criar ou relacionar oportunidades sem introduzir um segundo funil comercial.

## Automações e flows

- Automações suportam gatilhos, condições, espera e ações; flows suportam conversas ramificadas.
- Execuções atrasadas dependem dos endpoints cron e de segredo externo.
- Novos eventos — lead público, item de catálogo, agendamento e mensagem do mini-chat — devem ampliar os motores existentes em vez de criar um motor paralelo.

## IA

- Há configuração OpenAI/Anthropic, drafts, auto-reply, base de conhecimento, limites de uso e handoff humano.
- Catálogo e dados públicos poderão futuramente alimentar o contexto existente, respeitando conta, privacidade e controle humano.

## Dashboard

- Já consolida conversas, contatos, mensagens, pipeline, tempo de resposta e atividade.
- Métricas de vitrine, catálogo, agenda, chat e follow-up devem ser adicionadas à infraestrutura atual de consultas e componentes.

## Follow-up

- Existe apenas como template de automação com espera e envio posterior.
- Falta um domínio dedicado com tarefa, prazo, responsável, prioridade, status, snooze, conclusão e vínculo com contato/conversa/oportunidade.
- A evolução deve verificar ou cancelar o envio quando o cliente responder.

## Pontos de extensão para novos módulos

- **Página pública e vitrine:** novas rotas públicas por slug/domínio, separadas do dashboard autenticado.
- **Catálogo:** novas entidades por conta para produtos, serviços, categorias, preços, imagens e visibilidade.
- **Agenda:** disponibilidade, profissionais, serviços, slots, bloqueios e agendamentos, vinculados ao CRM.
- **Mini-chat:** identidade/sessão pública e criação ou reutilização de contato e conversa na inbox.
- **Links sociais:** configuração por conta reutilizável na página pública.
- **Onboarding:** fluxo guiado sobre conta, identidade visual, WhatsApp, catálogo, agenda e publicação.
- **Follow-up:** entidades e telas próprias, integradas ao CRM, pipeline, automações e dashboard.

## Riscos técnicos importantes

- Dependência da configuração correta de Supabase, migrations, Storage e credenciais Meta.
- Possível deriva entre as 42 migrations do repositório e o schema implantado.
- Complexidade da transição histórica de `user_id` para `account_id`.
- Tarefas atrasadas dependem de cron externo; o mecanismo atual de claim é best effort.
- O follow-up existente não demonstra cancelamento automático após resposta do contato.
- A CSP está em modo report-only, ainda não bloqueante.
- Mídias públicas exigem política clara de acesso e retenção.
- Não há suíte end-to-end identificada para navegador, Supabase e Meta em conjunto.
- Builders e fluxos críticos precisam de validação contínua em dispositivos móveis reais.

## Regra operacional

REGRA PARA FUTURAS TAREFAS DO CODEX:
Leia primeiro FLOW_MASTER.md e FLOW_CODEMAP.md.
Depois inspecione apenas os arquivos necessários para a tarefa atual.
Não faça nova varredura completa do repositório sem necessidade explícita.
