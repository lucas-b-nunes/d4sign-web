export const SIGNER_CONTACT_ALL = "{=Contact:all}";

export type SignerMode = "free" | "contacts" | "field";

export type SignerRow = {
  mode: SignerMode;
  freeEmail: string;
  fieldToken: string;
};

export function parseSignerSpec(value: string): SignerRow {
  const trimmed = value.trim();
  if (/^\{=Contact:all\}$/i.test(trimmed)) {
    return { mode: "contacts", freeEmail: "", fieldToken: "" };
  }
  const docMatch = /^\{=Document:([^}]+)\}$/i.exec(trimmed);
  if (docMatch) {
    return { mode: "field", freeEmail: "", fieldToken: trimmed };
  }
  return { mode: "free", freeEmail: trimmed, fieldToken: "" };
}

export function serializeSignerSpec(row: SignerRow): string {
  if (row.mode === "contacts") return SIGNER_CONTACT_ALL;
  if (row.mode === "field") return row.fieldToken.trim();
  return row.freeEmail.trim();
}

export function initSignerRows(saved?: string[]): SignerRow[] {
  if (!saved?.length) {
    return [{ mode: "free", freeEmail: "", fieldToken: "" }];
  }
  return saved.map((s) => parseSignerSpec(s));
}
