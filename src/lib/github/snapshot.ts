// Uma falha pontual no download não apaga a capa que o snapshot anterior já tinha salvo.
export function keepCover(downloaded: string | null, previous: string | null | undefined, previousExists: boolean): string | null {
  if (downloaded) return downloaded;
  return previous && previousExists ? previous : null;
}
