const braintree = require("braintree");

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "wxq3rx2wkq25n3k7",
  publicKey: "wmnyrzbgggcnbd34",
  privateKey: "3f0451fe606550d4da82c600bb94819e",
});

exports.processPayment = (req, res) => {
  const nonceFromTheClient = req.body.paymentMethodNonce;
  const amountFromTheClient = req.body.amount;

  gateway.transaction.sale(
    {
      amount: amountFromTheClient,
      paymentMethodNonce: nonceFromTheClient,
      options: {
        submitForSettlement: true,
      },
    },
    (err, result) => {
      if (err) {
        res.status(500).json(err);
      } else {
        console.log("processing payment successful:", result);
        res.json(result);
      }
    }
  );
};

exports.getToken = (req, res) => {
  console.log("step 2: in the backend getToken fired");
  gateway.clientToken.generate({}, (err, response) => {
    if (err) {
      console.log("error generating the token in backend:", err);
      res.status(500).send(err); //try to use send and not json
    } else {
      console.log("response after token is generated:", response);
      res.send(response);
    }
  });
};
