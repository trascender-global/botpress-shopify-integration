import { LATEST_API_VERSION } from "@shopify/shopify-api";
import axios from "axios";
import { IntegrationProps } from ".botpress";

type GetSmartCollectionProducts = IntegrationProps["actions"]["getSmartCollectionProducts"];

export const getSmartCollectionProducts: GetSmartCollectionProducts = async ({
  ctx,
  input,
  logger
}) => {
  const { adminAccessToken, shopId } = ctx.configuration;
  const { id } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com/admin/api/${LATEST_API_VERSION}`;
  axios.defaults.headers['X-Shopify-Access-Token'] = adminAccessToken;

  try {
    const { data } = await axios.get(`/collections/${id}/products.json`);
    return { listSmartCollectionProducts: data.products }
  } catch (error) {
    logger.forBot().error(`'Get Smart Collection Products List' Error ${error}`);
    return { listSmartCollectionProducts: {} };
  }
}
