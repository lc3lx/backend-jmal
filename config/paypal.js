const paypal = require("@paypal/checkout-server-sdk");

function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID || "sandbox-client-id";
  let clientSecret = process.env.PAYPAL_CLIENT_SECRET || "sandbox-secret";

  if (process.env.NODE_ENV === "production") {
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
  }
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client };

