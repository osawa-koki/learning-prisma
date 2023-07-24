export default async function fetcher(url: string): Promise<any> {
  return fetch(url).then(r => r.ok ? r.json() : null)
}
