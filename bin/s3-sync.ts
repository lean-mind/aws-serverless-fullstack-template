import { execSync } from 'child_process'
import * as backendDeploymentInfo from '../src/frontend/src/config/backendDeploymentInfo.json'


console.info("Starting the frontend deployment...")
try {
  execSync(`aws s3 sync src/frontend/build s3://${backendDeploymentInfo.S3FrontendDeploymentBucket}`)
  console.info("Frontend Deployed Successfully...")
} catch (error) {
  console.error(error.stderr.toString())
  process.exit(1)
}
