import { LATEST_API_VERSION } from "@shopify/shopify-api";
import qs from "query-string";
import axios from "axios";
import { IntegrationProps } from ".botpress";

type GetCustomerOrders = IntegrationProps['actions']['getCustomerOrders'];

export const getCustomerOrders: GetCustomerOrders = async ({ ctx, input, logger }) => {
  const { adminAccessToken, shopId } = ctx.configuration;
  const { customer_id, status } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com`;
  axios.defaults.headers['X-Shopify-Access-Token'] = adminAccessToken;

  const filters = qs.stringify({ customer_id, status });

  try {
    const { data } = await axios.get(`/admin/api/${LATEST_API_VERSION}/orders.json?${filters}`);
    logger.forBot().info(`'Get Customers Orders List: ' ${data.orders.length} Orders found.`);

    return { listCustomerOrders: data.orders }
  } catch (error) {
    logger.forBot().debug(`'Get Customers Orders List' Error ${error}`);
    return { listCustomerOrders: {} };
  }
}
