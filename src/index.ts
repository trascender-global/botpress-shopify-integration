import { Integration, Logger } from '.botpress';
import { register } from "./setup/register";
import { unregister } from "./setup/unregister";
import { getProducts } from "./actions/getProducts";
import { getCustomers } from "./actions/getCustomers";
import { getCustomerOrders } from "./actions/getCustomerOrders";
import { getProductVariants } from "./actions/getProductVariants";
import { createCheckout } from "./actions/createCheckout";
import { makeApiRequest } from './actions/makeApiRequest';
import { getSmartCollections } from './actions/getSmartCollections';
import { getSmartCollectionProducts } from './actions/getSmartCollectionProducts';
import { IntegrationContext } from "@botpress/sdk";


export default new Integration({
  register,
  unregister,

  actions: {
    getProducts,
    getCustomers,
    getCustomerOrders,
    getProductVariants,
    createCheckout,
    makeApiRequest,
    getSmartCollections,
    getSmartCollectionProducts
  },

  channels: {},

  handler: async ({ req, logger, client, ctx }: {
    req: any,
    logger: Logger,
    client: any,
    ctx: IntegrationContext
  }) => {
    if (!req.body) {
      logger.forBot().error(`Request body is missing. Bot: ${ctx.botId}, Integration: ${ctx.integrationId}. The incoming request did not contain a body. Request details: ${JSON.stringify(req)}`);
      return;
    }

    const body = JSON.parse(req.body);

    if (req.headers['x-shopify-topic'] === 'orders/paid') {
      const { id, cart_token, note_attributes } = body;

      /* the array 'note_attributes' returns the attributes that are sent when the Cart is created, the BpConversationId
      travels there and is retrieved in case it exists */
      const existsConversationId = note_attributes.find((val: any) => val.name === 'BpConversationId');

      if (existsConversationId) {
        await client.createEvent({
          type: 'orderPaid',
          payload: {
            conversationId: existsConversationId.value,
            idOrder: id,
            cartToken: cart_token,
          },
        })
      }
    }

    if (req.headers['x-shopify-topic'] === 'customers/create') {
      await client.createEvent({
        type: 'customerCreated',
        payload: {
          customerCreatedResponse: body
        }
      })
    }

    if (req.headers['x-shopify-topic'] === 'customers/update') {
      await client.createEvent({
        type: 'customerUpdated',
        payload: {
          customerUpdatedResponse: body
        }
      })
    }

    if (req.headers['x-shopify-topic'] === 'orders/create') {
      await client.createEvent({
        type: 'orderCreated',
        payload: {
          orderCreatedResponse: body
        }
      })
    }

    if (req.headers['x-shopify-topic'] === 'orders/updated') {
      await client.createEvent({
        type: 'orderUpdated',
        payload: {
          orderUpdatedResponse: body
        }
      })
    }

    if (req.headers['x-shopify-topic'] === 'orders/cancelled') {
      await client.createEvent({
        type: 'orderCancelled',
        payload: {
          orderCancelledResponse: body
        }
      })
    }
  },
})
