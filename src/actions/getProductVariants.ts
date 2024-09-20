import { LATEST_API_VERSION } from "@shopify/shopify-api";
import qs from "query-string";
import axios from "axios";
import { IntegrationProps } from ".botpress";

type GetProductVariants = IntegrationProps['actions']['getProductVariants']

export const getProductVariants: GetProductVariants = async ({ ctx, input, logger }) => {
  const { adminAccessToken, shopId } = ctx.configuration;
  const { limit, product_id } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com`;
  axios.defaults.headers['X-Shopify-Access-Token'] = adminAccessToken;

  const filters = qs.stringify({ limit, product_id });

  try {
    const { data } = await axios.get(`/admin/api/${LATEST_API_VERSION}/variants.json?${filters}`);
    return { listProductVariants: data.variants }
  } catch (error) {
    logger.forBot().error(`'Get Product Variants List' Error ${error}`);
    return { listProductVariants: {} };
  }
}
