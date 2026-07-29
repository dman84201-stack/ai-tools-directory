import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

const clientId = process.env.PAYPAL_CLIENT_ID || "";
const clientSecret = process.env.PAYPAL_CLIENT_SECRET || "";

function client() {
  return new checkoutNodeJssdk.core.PayPalHttpClient(
    new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
  );
}

export async function createOrder(
  toolName: string,
  submitterEmail: string,
  submissionId: number,
  returnUrl: string
) {
  const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    payer: {
      email_address: submitterEmail,
    },
    purchase_units: [
      {
        reference_id: submissionId.toString(),
        description: `Featured Tool Listing: ${toolName}`,
        amount: {
          currency_code: "USD",
          value: "99.00",
          breakdown: {
            item_total: {
              currency_code: "USD",
              value: "99.00",
            },
          },
        },
        items: [
          {
            name: "Featured Tool Listing (30 days)",
            description: `Premium featured placement for: ${toolName}`,
            sku: "FEATURED_LISTING",
            unit_amount: {
              currency_code: "USD",
              value: "99.00",
            },
            quantity: "1",
            category: "DIGITAL_GOODS",
          },
        ],
      },
    ],
    application_context: {
      brand_name: "AI Tools Directory",
      locale: "en-US",
      landing_page: "BILLING",
      user_action: "PAY_NOW",
      return_url: `${returnUrl}?payment=success&order_id={ORDER_ID}`,
      cancel_url: `${returnUrl}?payment=cancelled`,
    },
  });

  try {
    const response = await client().execute(request);
    return response.result;
  } catch (error) {
    console.error("PayPal Order Creation Error:", error);
    throw error;
  }
}

export async function captureOrder(orderId: string) {
  const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const response = await client().execute(request);
    return response.result;
  } catch (error) {
    console.error("PayPal Order Capture Error:", error);
    throw error;
  }
}

export async function getOrder(orderId: string) {
  const request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderId);

  try {
    const response = await client().execute(request);
    return response.result;
  } catch (error) {
    console.error("PayPal Get Order Error:", error);
    throw error;
  }
}
