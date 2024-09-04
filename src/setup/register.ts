import axios from "axios";
import {Integration, IntegrationProps} from '../../.botpress'
import { LATEST_API_VERSION } from "@shopify/shopify-api";

type IntegrationLogger = Parameters<IntegrationProps['handler']>[0]['logger']
type Implementation = ConstructorParameters<typeof Integration>[0]
type RegisterFunction = Implementation['register']
type IntegrationContext = Parameters<RegisterFunction>[0]['ctx']

const TOPICS: string[] = ['orders/paid'];


export const register: RegisterFunction = async ({ctx, logger, webhookUrl}) => {
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
        .info(
          `Shopify "${topicReadable}" Webhook was found with id ${response.data.webhooks[0].id.toString()} for Bot ${
            ctx.botId
          }. Webhook was not created`
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

    logger
      .forBot()
      .info(
        `Shopify ${topicReadable} Webhook Created ${response.data.webhook.id.toString()} for Bot with Id ${ctx.botId}`
      )
    return response.data.webhook.id.toString()
  } catch (e) {
    logger.forBot().error(`'Shopify ${topicReadable} Webhook Creation' exception ${JSON.stringify(e)}`)
    return null
  }
}