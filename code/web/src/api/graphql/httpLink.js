import { BatchHttpLink } from 'apollo-link-batch-http'
import { apiEndpointUrl } from '../../config/ApiEndpointUrl'

export const httpLink = new BatchHttpLink({
  uri: `${apiEndpointUrl}/graphql`
})
