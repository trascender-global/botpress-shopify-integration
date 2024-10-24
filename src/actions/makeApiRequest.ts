import { IntegrationProps } from ".botpress";
import { LATEST_API_VERSION } from "@shopify/shopify-api";
import axios from "axios";
// import qs from "query-string";

// [NOTE]: En este momento se está especificando por defecto la última versión de la API para la request

type MakeApiRequest = IntegrationProps['actions']['makeApiRequest'];

export const makeApiRequest: MakeApiRequest = async ({
  ctx,
  input,
  logger
}) => {
  const { adminAccessToken, shopId } = ctx.configuration;
  const { method, path, requestBody, params, headers } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com/admin/api/${LATEST_API_VERSION}`;
  axios.defaults.headers['X-Shopify-Access-Token'] = adminAccessToken;

  const parsedParams = params ? JSON.parse(params) : {};
  const parsedHeaders = headers ? JSON.parse(headers) : {};
  const parsedRequestBody = requestBody ? JSON.parse(requestBody) : undefined;

  const axiosConfig = {
    method: method.toLowerCase(),
    url: path,
    headers: parsedHeaders,
    params: parsedParams,
    data: parsedRequestBody
  }

  try {
    const { data } = await axios(axiosConfig);
    return { requestResponse: data };
  } catch (error) {
    logger.forBot().error(`'Make API Request' Error ${error}`)
    return { requestResponse: {} };
  }
}
