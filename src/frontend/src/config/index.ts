import backendDeploymentInfo from './backendDeploymentInfo.json'

export const API_ENDPOINT = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3003'
  : backendDeploymentInfo.ServiceEndpoint
