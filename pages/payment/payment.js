
function paypalGateway(){

    const total = 15.89;

  paypal.Buttons({
    createOrder: function (data, actions) {
      return actions.order.create({
        purchase_units: [{
          description: "Ecommerce Checkout",
          amount: {
            currency_code: "USD",   // force USD
            value: total.toFixed(2) // force 15.89
          }
        }]
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
    }
  }).render("#paypal-button-container");
}