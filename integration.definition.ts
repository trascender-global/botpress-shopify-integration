import { IntegrationDefinition, z } from '@botpress/sdk'
import { integrationName } from './package.json'
import {
  getProducts,
  getCustomers,
  getCustomerOrders,
  getProductVariants,
  createCheckout
} from "./src/definitions/actions";

export default new IntegrationDefinition({
  name: integrationName,
  version: '0.0.1',
  readme: 'hub.md',
  icon: 'icon.svg',

  configuration: {
    schema: z.object({
      shopId: z.string(),
      adminAccessToken: z.string(),
      storefrontAccessToken: z.string(),
    })
  },

  actions: {
    getProducts,
    getProductVariants,
    getCustomers,
    getCustomerOrders,
    createCheckout
  },

  events: {
    orderPaid: {
      title: 'Order Paid',
      schema: z.object({
        conversationId: z.string(),
        idOrder: z.number(),
        cartToken: z.string(),
      }),
      ui: {}
    }
  }
})
