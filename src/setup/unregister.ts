import axios from "axios";
import type * as botpress from '../../.botpress'
import { LATEST_API_VERSION } from "@shopify/shopify-api";

type IntegrationLogger = Parameters<botpress.IntegrationProps['handler']>[0]['logger']
type Implementation = ConstructorParameters<typeof botpress.Integration>[0]
type UnregisterFunction = Implementation['unregister']
type IntegrationContext = Parameters<UnregisterFunction>[0]['ctx']


export const unregister: UnregisterFunction = async ({ ctx, logger, webhookUrl }) => {
  const { adminAccessToken, shopId } = ctx.configuration;

  const axiosConfig = {
    baseURL: `https://${shopId}.myshopify.com`,
    headers: {
      'X-Shopify-Access-Token': adminAccessToken,
      'Content-Type': 'application/json',
    },
  }

  let response = await axios.get(`/admin/api/${LATEST_API_VERSION}/webhooks.json?address=${webhookUrl}`, axiosConfig);

  // Webhook exist
  if (response.data.webhooks.length > 0) {
    for (const webhook of response.data.webhooks) {
      const webhookId = webhook.id
      await deleteWebhook({ webhookId, ctx, logger })
    }
  }
}

async function deleteWebhook({
  webhookId,
  ctx,
  logger,
}: {
  webhookId: string
  ctx: IntegrationContext
  logger: IntegrationLogger
}) {
  const { adminAccessToken, shopId } = ctx.configuration;
  try {
    const axiosConfig = {
      baseURL: `https://${shopId}.myshopify.com`,
      headers: {
        'X-Shopify-Access-Token': adminAccessToken,
        'Content-Type': 'application/json',
      },
    }

    const response = await axios.delete(`/admin/api/${LATEST_API_VERSION}/webhooks/${webhookId}.json`, axiosConfig);

    logger.forBot().info(`Shopify ${webhookId} Webhook Deleted ${JSON.stringify(response.data)}`);
  } catch (e) {
    logger.forBot().error(`'Shopify ${webhookId} Webhook Deletion' exception ${JSON.stringify(e)}`);
  }
}
