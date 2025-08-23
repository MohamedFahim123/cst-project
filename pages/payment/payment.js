export async function initializePayment() {
  // Load PayPal SDK dynamically
  const paypalScript = document.createElement("script");
  paypalScript.src =
    "https://www.paypal.com/sdk/js?client-id=AWwGica7qOijXlw0dsQ_OYl-Tft5VkdJTDPPM5_cchS4tD-0Dk0Jayd0C53wHKoXHdsIbsqsOaAwzfSq&currency=USD";
  paypalScript.onload = () => {
    if (window.paypal) {
      paypal
        .Buttons({
          createOrder: function (data, actions) {
            return actions.order.create({
              purchase_units: [
                {
                  description: "Ecommerce Checkout",
                  amount: {
                    currency_code: "USD",
                    value: "15.89", // fixed test total
                  },
                },
              ],
            });
          },
          onApprove: function (data, actions) {
            return actions.order.capture().then(function (details) {
              alert("✅ Payment completed by " + details.payer.name.given_name);
            });
          },
          onError: function (err) {
            console.error("PayPal Error:", err);
            alert("❌ PayPal Checkout failed: " + err.message);
          },
        })
        .render("#paypal-button-container");
    }
  };
  document.body.appendChild(paypalScript);
}

function paypalGateway() {
  const total = 15.89;

  paypal
    .Buttons({
      createOrder: function (data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              description: "Ecommerce Checkout",
              amount: {
                currency_code: "USD", // force USD
                value: total.toFixed(2), // force 15.89
              },
            },
          ],
        });
      },
      onApprove: function (data, actions) {
        return actions.order.capture().then(function (details) {
          alert("✅ Payment completed by " + details.payer.name.given_name);
          console.log(details);
        });
      },
      onError: function (err) {
        console.error(err);
        alert("PayPal Checkout failed: " + err.message);
      },
    })
    .render("#paypal-button-container");
}
