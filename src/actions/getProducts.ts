import { LATEST_API_VERSION } from "@shopify/shopify-api";
import qs from "query-string";
import axios from "axios";
import { IntegrationProps } from ".botpress";

type GetProducts = IntegrationProps['actions']['getProducts']

export const getProducts: GetProducts = async ({ ctx, input, logger }) => {
  const { adminAccessToken, shopId } = ctx.configuration;
  const { ids, limit, product_type, title } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com`;
  axios.defaults.headers['X-Shopify-Access-Token'] = adminAccessToken;

  const filters = qs.stringify({ ids, limit, product_type, title })

  try {
    const { data } = await axios.get(`/admin/api/${LATEST_API_VERSION}/products.json?${filters}`);
    return { listProducts: data.products }
  } catch (error) {
    logger.forBot().error(`'Get Products List' Error ${error}`);
    return { listProducts: {} };
  }
}
