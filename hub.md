# Shopify Integration Setup

This guide walks you through the steps to obtain the necessary credentials for integrating with Shopify.

## Steps to Obtain Credentials

### Get your Shop ID

1. Log in to your Shopify Admin.
2. In the URL, find your store’s domain, which appears as:
    `https://admin.shopify.com/store/{shop_id}`
3. The `{shop_id}` part is your **Shop ID**.

For example, if your store URL is https://my-shop.myshopify.com/store/sh0p1d, then your **Shop ID** is `sh0p1d`.  

---

### Create Develop App

1. Navigate to **Settings** in your Shopify Admin.
2. Go to **Apps and sales channels**.
3. Click on **Develop apps**.
4. Click on **Create an app**.
5. Enter a **Name** and **App developer**.
6. Click on **Create app**.

### Configure the admin Access Token

1. In the app’s overview, under the section **Select your access scopes to get started**, click on **Configure Admin API scopes**.
2. Check the following scopes, then click **Save**: 
    - `read_publications` 
    - `read_products`
    - `read_customers` 
    - `read_orders `
    - `write_customers`
    - `write_orders`


### Configure the Storefront Access Token 

1. In the app’s overview, under the section **Select your access scopes to get started**, click on **Configure Storefront scopes**.
2. Check the following scopes, then click **Save**: 
    - `unauthenticated_read_checkouts`

### Install the App and Retrieve Access Tokens

1. At the top of the app’s page, go to **API Credentials**.
2. In the Access tokens section, click **Install app**.
3. This will generate your **Admin Access Token** and **Storefront Access Token**.
