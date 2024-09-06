import { z } from "@botpress/sdk";

export const getProducts = {
  title: 'Get Products List',
  description: 'Gets a list of all products based on the parameters',
  input: {
    schema: z.object({
      ids: z.string().optional().describe('Comma-separated list of product IDs.'),
      title: z.string().optional().describe('The exact product title.'),
      limit: z.number().min(0).max(200).default(10).optional()
        .describe('Return up to this many results per page. Default is 10, Maximum is 200'),
      product_type: z.string().optional().describe('Exact product type.'),
    }),
    ui: {
      ids: {
        title: 'Product ID(s)',
        examples: ['632910392', '632910392,632910391'],
      },
      limit: {
        title: 'Limit',
      },
      title: {
        title: 'Product Title',
      },
      product_type: {
        title: 'Product Type',
      },
    },
  },
  output: {
    schema: z.object({
      listProducts: z.array(z.object({
        id: z.bigint(),
        title: z.string(),
        handle: z.string(),
        product_type: z.string(),
        tags: z.string(),
        status: z.string(),
        created_at: z.date(),
        published_at: z.date(),
        images: z.array(z.object({}).passthrough()),
        image: z.object({}).passthrough()
      }))
    }),
  }
}


export const getCustomers = {
  title: 'Get Customers List',
  description: 'Gets a list of all customers based on the parameters',
  input: {
    schema: z.object({
      ids: z.string().optional().describe('Comma-separated list of customers IDs.'),
      limit: z
        .number()
        .min(0)
        .max(200)
        .default(10)
        .optional()
        .describe('Return up to this many results per page. Default is 10, Maximum is 200'),
    }),
    ui: {
      ids: {
        title: 'Customer ID(s)',
        examples: ['207119551', '207119551,1073339478'],
      },
      limit: {
        title: 'Limit',
      },
    },
  },
  output: {
    schema: z.object({
      listCustomers: z.array(z.object({}).passthrough()),
    }),
  },
}

export const getProductVariants = {
  title: 'Get Product Variants List',
  description: 'Gets a list of all product variants based on the parameters',
  input: {
    schema: z.object({
      product_id: z.string().optional().describe('The product ID to retrieve its variants'),
      limit: z
        .number()
        .min(0)
        .max(250)
        .default(50)
        .optional()
        .describe('Return up to this many results per page. Default is 50, Maximum is 250'),
    }),
    ui: {
      product_id: {
        title: 'Product ID(s)',
        examples: ['632910392', '632910392,632910391'],
      },
      limit: {
        title: 'Limit',
      },
    },
  },
  output: {
    schema: z.object({
      listProductVariants: z.array(z.object({}).passthrough()),
    }),
  },
}

export const getCustomerOrders = {
  title: 'Get Customer Orders List',
  description: 'Gets a list of all customer orders based on the parameters',
  input: {
    schema: z.object({
      customer_id: z.string().optional().describe('The exact customer ID.'),
      status: z
        .string()
        .optional()
        .default("open")
        .describe(
          'The status of the order. It could be any of the following variables: "open", "closed", "cancelled", "any"'
        ),
    }),
    ui: {
      customer_id: {
        title: 'Customer ID',
        examples: ['207119551'],
      },
      status: {
        title: 'Status',
        examples: ['open', 'closed', 'cancelled', 'any'],
      },
    },
  },
  output: {
    schema: z.object({
      listCustomerOrders: z.array(z.object({}).passthrough()),
    }),
  },
}
export const createCheckout = {
  title: 'Create Checkout',
  description: 'Create a checkout with items to pay',
  input: {
    schema: z.object({
      products: z.string().describe("Array of products of the form {merchandiseId: '', quantity: ''} with JSON.stringify"),
      conversationId: z.string()
    }),
    ui: {  }
  },
  output: {
    schema: z.object({
      checkoutInfo: z.object({}).passthrough()
    }),
  }
}