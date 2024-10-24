# What is Shopify?

Shopify is an e-commerce platform that allows individuals and businesses to easily create and manage online stores. Shopify offers a variety of tools and services, including store design, payment processing, inventory management, and digital marketing. It is known for its ease of use, customization, and ability to scale from small businesses to large enterprises. With Shopify, users can sell physical and digital products, managing all their store operations in one place.

# Benefits of Using Shopify & Botpress

Using Shopify with Botpress offers numerous benefits for e-commerce businesses. Integrating Botpress with Shopify allows for the automation of customer service, providing instant responses to common queries and improving customer satisfaction. It also enables personalized shopping experiences through AI-driven product recommendations and tailored interactions. The combination streamlines order management, inventory tracking, and customer support by automating repetitive tasks, freeing up valuable time for business owners and staff. Additionally, the integration supports seamless omnichannel communication, allowing businesses to engage with customers across various platforms, enhancing overall operational efficiency and customer engagement.

# How to Use The Integration

## Configuration

To activate the Shopify integration in Botpress, you need the following information:

- **Shop ID**: Found in the URL when accessing your Shopify store. For example, if the URL to your store admin is `https://admin.shopify.com/store/shop_id`, then the shop id you'll enter is `'shop_id'` .
- **Admin Access Token** and **Storefront Access Token** are needed to allow communication between Botpress and your Shopify store. To get these tokens, you need to create a Shopify app. If you already have one, please skip to step 7. Otherwise, follow these steps:
    
     **Create a Shopify App**
    
    1.  Go to the 'Apps and Sales Channels' section in the dashboard.
    2. Click on 'Develop Apps'.
    3. Select 'Create an App' and give your app a name.
    4. Go to “API Credentials”, Under 'Access Tokens', choose 'Configure Admin API Scopes'.
    5. Please check the 'Read' access boxes for 'Customers', 'Orders', and 'Products'. This allows the bot to read these properties.
    6. Click 'Save' and then 'Install app' to complete the installation.
    7.  After installing, go to 'API Credentials' and copy the '**Admin Access Token**' and **Storefront Acces Token**.

### Enable the Integration

To activate the Shopify integration in Botpress:

1. Access the Botpress admin dashboard.
2. Navigate to the "Integrations" tab.
3. Find the Shopify integration and select "Enable" or "Configure."
4.  Input the required **Shop ID, Admin Access Token** and **Storefront Access Token**.
5. Make sure to save your configurations to finalize the setup.

## Usage 

### Actions

**1. Customer Actions**

  - **Get Customers**: Returns a list of customers.
    - **Input**:
      - ids (optional): Comma-separated list of customer IDs.
      - limit (optional): Limits the number of customers returned, default is 10, max is 200.
    - **Output**:
      - listCustomers: An array of customer objects.

  - **Get Customer Orders**: Retrieves a list of orders for a specific customer, filtered by order status.
    - **Input**:
      - customer_id (optional): The exact customer ID.
      - status (optional, default: "open"): The status of the order, can be "open", "closed", "cancelled", or "any".
    - **Output**:
      - listCustomerOrders: An array of customer order objects.

**2. Product Actions**

  - **Get Products**: Returns a list of products based on ID, title, or product type.
    - **Input**:
      - ids (optional): Comma-separated list of product IDs.
      - title (optional): The exact product title.
      - product_type (optional): The exact product type.
      - limit (optional): Limits the number of products returned, default is 10, max is 200.
    - **Output**:
      - listProducts: An array of product objects, including their IDs, titles, handles, product types, tags, status, creation, and publication dates, along with images.

  - **Get Product Variants**: Returns a list of product variants based on the product ID.
    - **Input**:
      - product_id (optional): The product ID to retrieve its variants.
      - limit (optional): Limits the number of product variants returned, default is 50, max is 250.
    - **Output**:
      - listProductVariants: An array of product variant objects.

  - **Get Smart Collections**: Returns a list of smart collections.
    - **Input**:
      - ids (optional): Comma-separated list of smart collection IDs.
      - title (optional): The exact smart collection title.
    - **Output**:
      - listSmartCollections: An array of smart collection objects.

  - **Get Smart Collection Products**: Returns a list of products within a smart collection.
    - **Input**:
      - id: Smart Collection ID.
    - **Output**:
      - listSmartCollectionProducts: An array of products within the smart collection.

**3. Payment Actions**

  - **Create Checkout**: Creates a shopping cart using the Shopify Storefront endpoint, which returns a "Payment Link" associated with that cart in the response.
    - **Input**:
      - products: Array of products (JSON stringified) in the format {merchandiseId: '', quantity: ''}.
      - conversationId: The conversation ID related to the checkout.
    - **Output**:
      - checkoutInfo: Object containing information about the created checkout.

**4. Custom API Actions**

  - **Make API Request**: Sends a custom API request based on specified HTTP method, endpoint, headers, query parameters, and body.
    - **Input**:
      - method: HTTP method to use (GET, POST, PUT, DELETE).
      - path: API endpoint, excluding the base URL.
      - headers (optional): Headers to include in the request (JSON stringified).
      - params (optional): Query parameters (JSON stringified).
      - requestBody (optional): Request body (JSON stringified).
    - **Output**:
      - requestResponse: The response object from the API request.

### Events

**1. Customer Events**

- **Customer Created:** This event is triggered when a new customer registers in the store.
- **Customer Updated:** This event is triggered when a customer's information is updated.

**2. Order Events**

- **Order Cancelled**: This event occurs when an order is canceled by the customer or the system.
- **Order Created**: This event is triggered when a customer places a new order.
- **Order Updated**: This event is triggered when there are changes to an existing order.
- **Order Paid**: This event is triggered when a payment is made in the store. Through logic, it evaluates whether the payment corresponds to an order placed through the bot, allowing for a satisfactory response message. This event is linked to conversation.
