import type { Locale } from "./messages";

export type DocSection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  steps?: string[];
  note?: string;
};

export type DocumentationContent = {
  subtitle: string;
  toc: string;
  externalApiNote: string;
  externalApiLink: string;
  sections: DocSection[];
};

export const documentationContent: Record<Locale, DocumentationContent> = {
  "pt-BR": {
    subtitle:
      "Guia completo da integração D4Sign × Bitrix24: configuração, automação, assinatura e retorno no CRM.",
    toc: "Neste guia",
    externalApiNote: "Referência técnica da API D4Sign (portal externo):",
    externalApiLink: "docapi.d4sign.com.br",
    sections: [
      {
        id: "overview",
        title: "O que esta aplicação faz",
        paragraphs: [
          "Este aplicativo embarcado no Bitrix24 conecta seus negócios (Deals) à plataforma D4Sign para gerar documentos a partir de templates, enviar para assinatura e devolver status e PDF assinado automaticamente no CRM.",
          "O fluxo é acionado por um robô de automação (BizProc) no Bitrix. Você configura templates, signatários e campos uma vez; depois, cada execução do robô em um negócio cria o documento com dados reais do Deal.",
        ],
        bullets: [
          "Gera documentos Word/HTML a partir de templates D4Sign",
          "Preenche variáveis do template com campos do Deal Bitrix",
          "Cadastra signatários e envia o documento para assinatura",
          "Registra webhook de retorno e atualiza o Deal (status + anexo PDF)",
          "Monitora documentos enviados pelo painel interno",
        ],
      },
      {
        id: "architecture",
        title: "Como funciona (visão geral)",
        paragraphs: [
          "A aplicação tem duas partes: o painel web (onde você configura) e a API de integração (que o Bitrix e a D4Sign chamam).",
        ],
        steps: [
          "Bitrix dispara o robô ENVIAR_DOCUMENTO_D4SIGN em um Deal",
          "A API lê o template escolhido no robô e busca o mapeamento salvo em Templates",
          "Campos do Deal são usados para preencher variáveis e nome do documento",
          "A D4Sign cria o documento, configura webhook, adiciona signatários e envia para assinar",
          "Quando o documento é assinado ou finalizado, a D4Sign chama o webhook da aplicação",
          "A API atualiza o campo de status e anexa o PDF no Deal configurado em Parâmetros Globais",
        ],
      },
      {
        id: "setup",
        title: "Configuração inicial",
        paragraphs: [
          "Siga esta ordem no menu Configurações e Operação. O Dashboard mostra o checklist de prontidão.",
        ],
        steps: [
          "Configurações → Credenciais D4Sign: informe tokenAPI e cryptKey; teste a conexão",
          "Configurações → Parâmetros globais: selecione o cofre padrão D4Sign",
          "Parâmetros globais: mapeie Status Documento D4Sign e Anexo Documento D4Sign (campos do Deal)",
          "Operação → Templates: para cada template, defina nome do documento, signatários e mapeamento de variáveis",
          "Em Templates, clique em Sincronizar robô no Bitrix para atualizar a lista de templates no BizProc",
          "No Bitrix, adicione o robô ENVIAR_DOCUMENTO_D4SIGN ao fluxo de automação do Deal",
        ],
        note: "Sem cofre padrão, signatários ou mapeamento de template, o robô retorna erro ao executar.",
      },
      {
        id: "templates",
        title: "Templates e mapeamento",
        paragraphs: [
          "Cada template D4Sign (Word ou HTML) pode ter variáveis que precisam ser preenchidas com dados do Deal.",
        ],
        bullets: [
          "Nome do documento: texto livre (com variáveis Bitrix, ex. {=Document:TITLE}) ou campo do Deal",
          "Signatários: lista de e-mails fixos — obrigatório pelo menos um por template",
          "Mapeamento de variáveis: cada variável do template → campo do Deal (ex. razao_social → COMPANY_TITLE)",
          "Após salvar, use Sincronizar robô para que o select do BizProc liste os templates mapeados",
        ],
      },
      {
        id: "robot",
        title: "Robô BizProc no Bitrix",
        paragraphs: [
          "O robô ENVIAR_DOCUMENTO_D4SIGN é registrado na instalação do app. No fluxo, o usuário só escolhe qual template enviar.",
        ],
        bullets: [
          "Entrada: template_id (select dinâmico com templates sincronizados)",
          "Contexto: documento CRM do Deal (entity + entity_id enviados pelo Bitrix)",
          "Saída: documento criado na D4Sign e workflow continua após confirmação",
        ],
        note: "Document name e signatários não vêm do robô — vêm do mapeamento salvo em Templates.",
      },
      {
        id: "globals",
        title: "Parâmetros globais (retorno no Deal)",
        paragraphs: [
          "Defina onde o resultado da assinatura será gravado no negócio Bitrix.",
        ],
        bullets: [
          "Status Documento D4Sign: campo de texto/lista onde o status será atualizado (ex. Aguardando assinatura, Finalizado, Cancelado)",
          "Anexo Documento D4Sign: campo tipo arquivo onde o PDF assinado será anexado quando o documento for finalizado (type_post = 1)",
          "Use a busca por nome ou código para encontrar campos entre muitos campos customizados do Deal",
        ],
      },
      {
        id: "webhook",
        title: "Webhook e eventos D4Sign",
        paragraphs: [
          "Ao criar cada documento, a API registra um webhook apontando para /api/webhooks/d4sign. A D4Sign envia POST em form-data quando há eventos.",
        ],
        bullets: [
          "type_post 1 — Documento finalizado → atualiza status e anexa PDF no Deal",
          "type_post 3 — Documento cancelado → atualiza status",
          "type_post 4 — Signatário assinou → atualiza status parcial",
          "type_post 2 — E-mail não entregue → atualiza status de falha",
        ],
        note: "Se hmacSecret estiver configurado nas credenciais D4Sign, o retorno ao Bitrix só ocorre com HMAC válido. Logs detalhados aparecem no terminal da API com prefixo [webhook-d4sign].",
      },
      {
        id: "monitoring",
        title: "Dashboard e monitoramento",
        paragraphs: [
          "O Dashboard resume a configuração e os últimos documentos. Monitoramento lista todos os documentos sincronizados com UUID, entidade, status e data.",
        ],
        bullets: [
          "Status exibidos são traduzidos conforme o idioma do painel",
          "Documentos ficam vinculados ao Deal (entityType + entityId) para o webhook saber onde gravar",
        ],
      },
      {
        id: "troubleshooting",
        title: "Solução de problemas",
        paragraphs: ["Problemas comuns e o que verificar:"],
        bullets: [
          "Robô retorna 401: reinstale o app  Bitrix",
          "Erro ao criar documento: confira mapeamento do template, cofre padrão e credenciais D4Sign",
          "Select do robô vazio: salve mapeamentos em Templates e clique em Sincronizar robô no Bitrix",
          "PDF não anexado: confirme campo tipo arquivo em Parâmetros Globais e documento finalizado na D4Sign",
        ],
      },
    ],
  },
  en: {
    subtitle:
      "Complete guide for the D4Sign × Bitrix24 integration: setup, automation, signing, and CRM return.",
    toc: "In this guide",
    externalApiNote: "D4Sign API technical reference (external portal):",
    externalApiLink: "docapi.d4sign.com.br",
    sections: [
      {
        id: "overview",
        title: "What this application does",
        paragraphs: [
          "This embedded Bitrix24 app connects your deals to D4Sign to generate documents from templates, send them for signature, and automatically write status and signed PDF back to the CRM.",
          "The flow is triggered by a BizProc automation robot in Bitrix. You configure templates, signers, and fields once; each robot run on a deal creates the document with real deal data.",
        ],
        bullets: [
          "Generates Word/HTML documents from D4Sign templates",
          "Fills template variables with Bitrix Deal fields",
          "Registers signers and sends the document for signature",
          "Registers return webhook and updates the Deal (status + PDF attachment)",
          "Monitors sent documents from the internal dashboard",
        ],
      },
      {
        id: "architecture",
        title: "How it works (overview)",
        paragraphs: [
          "The application has two parts: the web panel (where you configure) and the integration API (called by Bitrix and D4Sign).",
        ],
        steps: [
          "Bitrix triggers the ENVIAR_DOCUMENTO_D4SIGN robot on a Deal",
          "The API reads the template chosen in the robot and loads the mapping saved under Templates",
          "Deal fields are used to fill variables and document name",
          "D4Sign creates the document, configures webhook, adds signers, and sends for signature",
          "When the document is signed or completed, D4Sign calls the application webhook",
          "The API updates the status field and attaches the PDF on the Deal configured in Global parameters",
        ],
      },
      {
        id: "setup",
        title: "Initial setup",
        paragraphs: [
          "Follow this order in Settings and Operations. The Dashboard shows the readiness checklist.",
        ],
        steps: [
          "Settings → D4Sign credentials: enter tokenAPI and cryptKey; test the connection",
          "Settings → Global parameters: select the default D4Sign safe",
          "Global parameters: map D4Sign document status and attachment fields (Deal fields)",
          "Operations → Templates: for each template, set document name, signers, and variable mapping",
          "In Templates, click Sync robot in Bitrix to refresh the template list in BizProc",
          "In Bitrix, add the ENVIAR_DOCUMENTO_D4SIGN robot to your Deal automation workflow",
        ],
        note: "Without default safe, signers, or template mapping, the robot will fail when executed.",
      },
      {
        id: "templates",
        title: "Templates and mapping",
        paragraphs: [
          "Each D4Sign template (Word or HTML) may have variables that must be filled with Deal data.",
        ],
        bullets: [
          "Document name: free text (with Bitrix variables, e.g. {=Document:TITLE}) or a Deal field",
          "Signers: fixed email list — at least one required per template",
          "Variable mapping: each template variable → Deal field (e.g. razao_social → COMPANY_TITLE)",
          "After saving, use Sync robot so the BizProc select lists mapped templates",
        ],
      },
      {
        id: "robot",
        title: "BizProc robot in Bitrix",
        paragraphs: [
          "The ENVIAR_DOCUMENTO_D4SIGN robot is registered on app install. In the workflow, the user only picks which template to send.",
        ],
        bullets: [
          "Input: template_id (dynamic select with synced templates)",
          "Context: CRM Deal document (entity + entity_id sent by Bitrix)",
          "Output: document created in D4Sign and workflow continues after confirmation",
        ],
        note: "Document name and signers do not come from the robot — they come from the mapping saved in Templates.",
      },
      {
        id: "globals",
        title: "Global parameters (Deal return)",
        paragraphs: [
          "Define where signature results will be written on the Bitrix deal.",
        ],
        bullets: [
          "D4Sign document status: text/list field updated with status (e.g. Awaiting signature, Completed, Canceled)",
          "D4Sign document attachment: file field where signed PDF is attached when document is completed (type_post = 1)",
          "Use search by name or code to find fields among many custom Deal fields",
        ],
      },
      {
        id: "webhook",
        title: "Webhook and D4Sign events",
        paragraphs: [
          "When each document is created, the API registers a webhook pointing to /api/webhooks/d4sign. D4Sign sends form-data POST on events.",
        ],
        bullets: [
          "type_post 1 — Document completed → updates status and attaches PDF to Deal",
          "type_post 3 — Document canceled → updates status",
          "type_post 4 — Signer signed → partial status update",
          "type_post 2 — Email not delivered → failure status update",
        ],
        note: "If hmacSecret is set in D4Sign credentials, Bitrix sync only runs with valid HMAC. Detailed logs appear in the API terminal with prefix [webhook-d4sign].",
      },
      {
        id: "monitoring",
        title: "Dashboard and monitoring",
        paragraphs: [
          "The Dashboard summarizes setup and recent documents. Monitoring lists all synced documents with UUID, entity, status, and date.",
        ],
        bullets: [
          "Displayed statuses are translated according to panel language",
          "Documents are linked to the Deal (entityType + entityId) so the webhook knows where to write",
        ],
      },
      {
        id: "troubleshooting",
        title: "Troubleshooting",
        paragraphs: ["Common issues and what to check:"],
        bullets: [
          "Robot returns 401: reinstall the app or check auth.member_id in Bitrix payload",
          "Document creation error: check template mapping, default safe, and D4Sign credentials",
          "Word template ID error: API uses makedocumentbytemplateword endpoint automatically",
          "Webhook does not update Deal: check PUBLIC_APP_URL (ngrok in dev), global fields, and [webhook-d4sign] logs",
          "Empty robot select: save mappings in Templates and click Sync robot in Bitrix",
          "PDF not attached: confirm file field in Global parameters and document completed in D4Sign",
        ],
      },
    ],
  },
};
