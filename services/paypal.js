const axios = require("axios");

async function generateAccessToken() {
  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v1/oauth2/token",
    method: "post",
    data: "grant_type=client_credentials",
    auth: {
      username: process.env.PAYPAL_CLIENT_ID,
      password: process.env.PAYPAL_SECRET,
    },
  });

  return response.data.access_token;
}

exports.createOrder = async (price, desc) => {
  const accessToken = await generateAccessToken();

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + "/v2/checkout/orders",
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    data: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          items: [
            {
              name: "wanderlist booking",
              description: desc,
              quantity: 1,
              unit_amount: {
                currency_code: "USD",
                value: price,
              },
            },
          ],

          amount: {
            currency_code: "USD",
            value: price,
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: price,
              },
            },
          },
        },
      ],

      application_context: {
        return_url: "https://wanderlist-00rw.onrender.com/complete-order",
        cancel_url: "https://wanderlist-00rw.onrender.com/cancel-order",
        shipping_preference: "NO_SHIPPING",
        user_action: "PAY_NOW",
        brand_name: "WanderList",
      },
    }),
  });

  return response.data.links.find((link) => link.rel === "approve").href;
};

exports.capturePayment = async (orderId) => {
  const accessToken = await generateAccessToken();

  const response = await axios({
    url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
  });

  return response.data;
};
