import { IntegrationDefinition, z } from '@botpress/sdk'
import { integrationName } from './package.json'
import {
  getProducts,
  getCustomers,
  getCustomerOrders,
  getProductVariants
} from "./src/definitions/actions";

export default new IntegrationDefinition({
  name: integrationName,
  version: '0.0.1',
  readme: 'hub.md',
  icon: 'icon.svg',

  configuration: {
    schema: z.object({
      shopId: z.string(),
      accessToken: z.string(),
    })
  },

  actions: {
    getProducts,
    getProductVariants,
    getCustomers,
    getCustomerOrders
  },

  events: {
    customerCreated: {
      title: 'Create Customer',
      schema: z.object({
        id: z.number()
      }),
      ui: {}
    }
  }
})
