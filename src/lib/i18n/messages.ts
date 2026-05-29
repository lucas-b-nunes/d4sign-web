export const messages = {
  "pt-BR": {
    appName: "D4Sign × Bitrix24",
    connected: "Conectado",
    disconnected: "Desconectado",
    save: "Salvar",
    cancel: "Cancelar",
    testConnection: "Testar conexão",
    comingSoon: "Em breve",
  },
  en: {
    appName: "D4Sign × Bitrix24",
    connected: "Connected",
    disconnected: "Disconnected",
    save: "Save",
    cancel: "Cancel",
    testConnection: "Test connection",
    comingSoon: "Coming soon",
  },
} as const;

export type Locale = keyof typeof messages;
