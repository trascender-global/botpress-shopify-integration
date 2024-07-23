import { LATEST_API_VERSION } from "@shopify/shopify-api";
import qs from "query-string";
import axios from "axios";
import { IntegrationProps } from ".botpress";

type GetProductVariants = IntegrationProps['actions']['getProductVariants']

export const getProductVariants: GetProductVariants = async ({ ctx, input, logger }) => {
  const { accessToken, shopId } = ctx.configuration;
  const { limit, product_id } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com`;
  axios.defaults.headers['X-Shopify-Access-Token'] = accessToken;

  const filters = qs.stringify({ limit, product_id });

  try {
    const { data } = await axios.get(`/admin/api/${LATEST_API_VERSION}/variants.json?${filters}`);
    logger.forBot().info(`'Get Product Variants List: ' ${data.variants.length} Variants found.`);

    return { listProductVariants: data.variants }
  } catch (error) {
    logger.forBot().debug(`'Get Product Variants List' Error ${JSON.stringify(error)}`);
    return { listProductVariants: {} };
  }
}