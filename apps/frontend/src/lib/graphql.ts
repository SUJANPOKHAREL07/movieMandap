export async function fetchGraphQL(query: string, variables?: any) {
  const url =
    process.env.NEXT_PUBLIC_GRAPHQL_URL || 'http://localhost:8000/graphql';

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error('GraphQL errors:', json.errors);
    throw new Error(json.errors.map((e: any) => e.message).join('\n'));
  }
  return json.data;
}
