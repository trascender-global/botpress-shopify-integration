import { IntegrationProps } from ".botpress";
import axios from "axios";
import { LATEST_API_VERSION } from "@shopify/shopify-api";

type CreateCheckout = IntegrationProps['actions']['createCheckout']

export const createCheckout: CreateCheckout = async ({ ctx, input, logger }) => {
  const { storefrontAccessToken, shopId } = ctx.configuration;
  const { products, conversationId } = input;

  axios.defaults.baseURL = `https://${shopId}.myshopify.com`;
  axios.defaults.headers['X-Shopify-Storefront-Access-Token'] = storefrontAccessToken;

  /* Products string is converted to be matching with GraphQL */
  let prodsConverted = products.replace(/"([^"]+)":/g, '$1:').replace(/:"(\d+)"/g, ':$1');

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
            lines: ${prodsConverted}
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

    const response = await axios.post(`/api/${LATEST_API_VERSION}/graphql.json`, { query });

    return { checkoutInfo: response.data.data.cartCreate.cart }
  } catch (error) {
    logger.forBot().error(`'Create Checkout' Error ${error}`);
    return { checkoutInfo: {} };
  }
}
