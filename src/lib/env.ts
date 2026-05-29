/** Origem local do frontend (manipulador Bitrix em 127.0.0.1). */
export function getWebOrigin(request: {
  nextUrl: { origin: string };
}): string {
  return request.nextUrl.origin;
}
