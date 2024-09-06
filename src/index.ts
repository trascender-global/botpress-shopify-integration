import {Integration, Logger} from '.botpress';
import {register} from "./setup/register";
import {unregister} from "./setup/unregister";
import {getProducts} from "./actions/getProducts";
import {getCustomers} from "./actions/getCustomers";
import {getCustomerOrders} from "./actions/getCustomerOrders";
import {getProductVariants} from "./actions/getProductVariants";
import {createCheckout} from "./actions/createCheckout";
import {IntegrationContext} from "@botpress/sdk";


export default new Integration({
  register,
  unregister,

  actions: {
    getProducts,
    getCustomers,
    getCustomerOrders,
    getProductVariants,
    createCheckout
  },

  channels: {},

  handler: async ({req, logger, client, ctx}: {
    req: any,
    logger: Logger,
    client: any,
    ctx: IntegrationContext
  }) => {
    if (!req.body) {
      logger.forBot().error(`REQ BODY EMPTY`);
      return;
    } else {
      logger.forBot().info(`========== HANDLER ==========`);
      logger.forBot().info(`REQ BODY: ${req.body}`);
      logger.forBot().info(`REQ HEADERS: ${JSON.stringify(req.headers)}`);
      logger.forBot().info(`REQ: ${JSON.stringify(req)}`);
      logger.forBot().info(`CONTEXT: ${JSON.stringify(ctx)}`);
      logger.forBot().info(`CLIENT: ${JSON.stringify(client)}`);
    }

    const body = JSON.parse(req.body);

    if (req.headers['x-shopify-topic'] === 'orders/paid') {
      const {id, cart_token, note_attributes} = body;

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
      logger.forBot().info(`CREATE: ${JSON.stringify(body)}`);
      await client.createEvent({
        type: 'customerCreated',
        payload: {
          customerCreatedResponse: body
        }
      })
    }

    if (req.headers['x-shopify-topic'] === 'customers/update') {
      logger.forBot().info(`UPDATE: ${JSON.stringify(body)}`);
      await client.createEvent({
        type: 'customerUpdated',
        payload: {
          customerUpdatedResponse: body
        }
      })
    }

    if (req.headers['x-shopify-topic'] === 'orders/create') {
      logger.forBot().info(`ORDER CREATED: ${JSON.stringify(body)}`);
      await client.createEvent({
        type: 'orderCreated',
        payload: {
          orderCreatedResponse: body
        }
      })
    }

    if (req.headers['x-shopify-topic'] === 'orders/updated') {
      logger.forBot().info(`ORDER UPDATED: ${JSON.stringify(body)}`);
      await client.createEvent({
        type: 'orderUpdated',
        payload: {
          orderUpdatedResponse: body
        }
      })
    }

    if (req.headers['x-shopify-topic'] === 'orders/cancelled') {
      logger.forBot().info(`ORDER CANCELLED: ${JSON.stringify(body)}`);
      await client.createEvent({
        type: 'orderCancelled',
        payload: {
          orderCancelledResponse: body
        }
      })
    }
  },
})
