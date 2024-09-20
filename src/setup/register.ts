import axios from "axios";
import { Integration, IntegrationProps } from '../../.botpress'
import { LATEST_API_VERSION } from "@shopify/shopify-api";

type IntegrationLogger = Parameters<IntegrationProps['handler']>[0]['logger']
type Implementation = ConstructorParameters<typeof Integration>[0]
type RegisterFunction = Implementation['register']
type IntegrationContext = Parameters<RegisterFunction>[0]['ctx']

const TOPICS: string[] = ['customers/create', 'customers/update', 'orders/create', 'orders/updated', 'orders/cancelled', 'orders/paid'];


export const register: RegisterFunction = async ({ ctx, logger, webhookUrl }) => {
  await Promise.all(
    TOPICS.map(async (topic) => {
      await createWebhook({ topic, ctx, logger, webhookUrl });
    })
  )
}

async function createWebhook({
  topic,
  ctx,
  logger,
  webhookUrl,
}: {
  topic: string
  ctx: IntegrationContext
  logger: IntegrationLogger
  webhookUrl: string
}) {
  const { adminAccessToken, shopId } = ctx.configuration;
  const topicReadable = topic.replace('/', ' ')

  const axiosConfig = {
    baseURL: `https://${shopId}.myshopify.com`,
    headers: {
      'X-Shopify-Access-Token': adminAccessToken,
      'Content-Type': 'application/json',
    },
  }

  try {
    let response = await axios.get(
      `/admin/api/${LATEST_API_VERSION}/webhooks.json?topic=${topic}&address=${webhookUrl}`,
      axiosConfig
    )

    if (response.data.webhooks.length > 0) {
      logger
        .forBot()
        .warn(
          `Shopify webhook for "${topicReadable}" already exists with ID ${response.data.webhooks[0].id.toString()} for bot ID ${ctx.botId
          }. No new webhook was created.`
        )
      return
    }

    response = await axios.post(
      `/admin/api/${LATEST_API_VERSION}/webhooks.json`,
      {
        webhook: {
          topic,
          address: webhookUrl,
          format: 'json',
        },
      },
      axiosConfig
    )

    return response.data.webhook.id.toString()
  } catch (e) {
    logger.forBot().error(`'Shopify ${topicReadable} Webhook Creation' exception ${JSON.stringify(e)}`)
    return null
  }
}
