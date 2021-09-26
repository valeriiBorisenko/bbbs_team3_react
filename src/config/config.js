const isDev = true;
const developmentIP = 'http://178.154.192.53';
const prodIP = 'http://195.24.66.127';
export const baseURL = isDev ? developmentIP : prodIP;
export const apiUrl = '/api/v1';
export const adminUrl = isDev ? developmentIP : prodIP;
export const staticImageUrl = `${adminUrl}/media`;
