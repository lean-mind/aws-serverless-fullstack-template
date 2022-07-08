import * as backendDeploymentInfo from './backendDeploymentInfo.json'

const API_ENDPOINT = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3003'
  : backendDeploymentInfo.ServiceEndpoint
