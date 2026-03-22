export function getAuthHeader(apiKey: string) {
  return {
    "Authorization": `Bearer ${apiKey}`,
  };
}

export function getHeader(apiKey: string) {
  return {
    ...getAuthHeader(apiKey),
    "Content-Type": "application/json",
  };
}
    
