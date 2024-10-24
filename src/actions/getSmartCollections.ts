import { LATEST_API_VERSION } from "@shopify/shopify-api";
import qs from "query-string";
import axios from "axios";
import { IntegrationProps } from ".botpress";

type GetSmartCollections = IntegrationProps["actions"]["getSmartCollections"]

export const getSmartCollections: GetSmartCollections = async ({
  ctx,
  input,
  logger
}) => {
  const { adminAccessToken, shopId } = ctx.configuration;
  const { ids, title } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com/admin/api/${LATEST_API_VERSION}`;
  axios.defaults.headers['X-Shopify-Access-Token'] = adminAccessToken;

  const filters = qs.stringify({ ids, title })

  try {
    const { data } = await axios.get(`/smart_collections.json?${filters}`);
    return { listSmartCollections: data.smart_collections };
  } catch (error) {
    logger.forBot().error(`'Get Smart Collections List' Error ${error}`);
    return { listSmartCollections: {} };
  }
}
