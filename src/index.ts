import {Integration, IntegrationProps} from '.botpress';
import { register } from "./setup/register";
import { unregister } from "./setup/unregister";
import { getProducts } from "./actions/getProducts";
import { getCustomers } from "./actions/getCustomers";
import { getCustomerOrders } from "./actions/getCustomerOrders";
import { getProductVariants } from "./actions/getProductVariants";

export default new Integration({
  register,
  unregister,

  actions: {
    getProducts,
    getCustomers,
    getCustomerOrders,
    getProductVariants
  },

  channels: {},

  handler: async ({req, logger, client}) => {
    if (!req.body) {
      logger.forBot().error(`REQ BODY EMPTY`);
      return;
    } else {
      logger.forBot().info(`REQ BODY: ${req.body}`);
      logger.forBot().info(`REQ HEADERS: ${JSON.stringify(req.headers)}`);
      logger.forBot().info(`REQ: ${JSON.stringify(req)}`);
    }

    const body = JSON.parse(req.body);

    if (req.headers['x-shopify-topic'] === 'customers/create') {
      await client.createEvent({
        type: 'customerCreated',
        payload: {
          id: body.id
        },
      })
    }
  },
})
