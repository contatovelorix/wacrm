# FLOW — Diretriz-mestra

## Missão

Transformar a operação comercial de pequenos negócios em um fluxo simples e contínuo: **captar → atender → organizar → vender → recuperar**.

O FLOW será uma **plataforma comercial modular para pequenos negócios**, reunindo presença pública, relacionamento, atendimento, vendas e recuperação de oportunidades em uma única experiência.

## Princípios do produto

- Entregar uma experiência **simples, premium, moderna, intuitiva, mobile-first e visualmente marcante**.
- Esconder do usuário a complexidade técnica e operacional.
- Priorizar soluções gratuitas e open-source quando forem adequadas ao produto.
- Evoluir a base existente sem reescrever módulos maduros.
- Integrar módulos por etapas, preservando dados, segurança e isolamento entre contas.

## Base que deve ser preservada

- CRM de contatos, tags, campos personalizados, notas, importação e deduplicação.
- Inbox compartilhada e integração oficial com o WhatsApp.
- Pipeline comercial, oportunidades e analytics.
- Broadcasts, templates e acompanhamento de entrega.
- Automações, flows conversacionais e logs de execução.
- Usuários, autenticação, equipes, convites e papéis de acesso.
- Banco Supabase, RLS, Storage e modelo multi-tenant.
- IA, base de conhecimento e handoff humano.
- Dashboard, notificações, API pública, webhooks e MCP.
- Temas, internacionalização e fundação responsiva.

## Módulos a adicionar

- Vitrine comercial.
- Catálogo de produtos e serviços.
- Agenda e agendamentos.
- Página pública por negócio.
- Mini-chat público.
- Links de WhatsApp, Instagram e outras redes sociais.
- Onboarding simples e guiado.
- Follow-up dedicado, com tarefas, prazos, responsáveis e estados.

## Roadmap atual

1. Consolidar visão, arquitetura e limites do produto.
2. Definir o modelo de negócio público e o onboarding.
3. Implementar página pública, vitrine, catálogo e links sociais.
4. Implementar agenda e agendamentos.
5. Implementar mini-chat integrado ao CRM e à inbox.
6. Evoluir o follow-up para um módulo dedicado.
7. Integrar métricas, automações e experiência mobile entre os novos módulos.
8. Validar segurança, migrações, desempenho e operação em produção.

## Etapa atual

**Mapeamento e planejamento técnico.** A base existente já foi auditada; a etapa atual é definir como os novos módulos serão integrados sem reconstruir as capacidades maduras do CRM.
