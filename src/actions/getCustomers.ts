import { LATEST_API_VERSION } from "@shopify/shopify-api";
import qs from "query-string";
import axios from "axios";
import { IntegrationProps } from ".botpress";

type GetCustomers = IntegrationProps['actions']['getCustomers']

export const getCustomers: GetCustomers = async ({ ctx, input, logger }) => {
  const { adminAccessToken, shopId } = ctx.configuration;
  const { ids, limit } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com`;
  axios.defaults.headers['X-Shopify-Access-Token'] = adminAccessToken;

  const filters = qs.stringify({ ids, limit })

  try {
    const { data } = await axios.get(`/admin/api/${LATEST_API_VERSION}/customers.json?${filters}`);
    return { listCustomers: data.customers }
  } catch (error) {
    logger.forBot().error(`'Get Customers List' Error ${error}`);
    return { listCustomers: {} };
  }
}
