import { IntegrationProps } from ".botpress";
import axios from "axios";
import {LATEST_API_VERSION} from "@shopify/shopify-api";

type CreateCheckout = IntegrationProps['actions']['createCheckout']

export const createCheckout: CreateCheckout = async ({ ctx, input, logger }) => {
  const { storefrontAccessToken, shopId } = ctx.configuration;
  const { products, conversationId } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com`;
  axios.defaults.headers['X-Shopify-Storefront-Access-Token'] = storefrontAccessToken;

  try {
    const query = `
      mutation { 
        cartCreate(
          input: { 
            attributes: [
              {
                key: "BpConversationId",
                value: "${conversationId}"
              }
            ],
            lines: ${products}
          }
        ) { 
          cart { 
            id 
            checkoutUrl 
          }  
          userErrors { 
            field 
            message 
          } 
        } 
      }
    `;

    const response = await axios.post(`/api/${LATEST_API_VERSION}/graphql.json`, {query});

    return { checkoutInfo: response.data.data.cartCreate.cart }
  } catch (error) {
    logger.forBot().debug(`'Create Checkout' Error ${JSON.stringify(error)}`);
    return { checkoutInfo: {} };
  }
}