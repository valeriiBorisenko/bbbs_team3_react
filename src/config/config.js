const isDevevelopment = true;
const developmentIP = 'http://178.154.192.53';
const productionIP = 'http://195.24.66.127';
export const baseURL = isDevevelopment ? developmentIP : productionIP;
export const apiUrl = '/api/v1';
export const adminUrl = isDevevelopment ? developmentIP : productionIP;
export const staticImageUrl = `${adminUrl}/media`;
