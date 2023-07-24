export default async function fetcher (url: string): Promise<any> {
  return await fetch(url).then(async r => r.ok ? await r.json() : null)
}
