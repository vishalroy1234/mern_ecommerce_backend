const stripe = require("stripe")(
  "sk_test_51J1YMASEpDYtfrHecn3LDmlBtNzhmJGjcCXRSHodFqxqF9PbBu5KCGafmMxjG8LqZPX2E2eUphczA66gJ9ua0IiW00hmPb6D2f"
);
const { v4: uuidv4 } = require("uuid");

const makepayment = (req, res) => {
  const { products, token } = req.body;
  console.log(
    "in backend makePayment called.Received products and token in req body"
  );
  console.log("PRODUCTS in backend", products);
  console.log("TOKEN in backend", token);

  let amount = products.reduce((accumulator, curProduct) => {
    return accumulator + curProduct.count * curProduct.price;
  }, 0);

  const idempotencyKey = uuidv4();

  return stripe.customers
    .create({
      email: token.email,
      source: token.id,
    })
    .then((customer) => {
      console.log("CUSTOMER in backend:", customer);
      stripe.charges
        .create(
          {
            amount: amount * 100,
            currency: "inr",
            customer: customer.id,
            receipt_email: token.email,
            description: "a test account",
            shipping: {
              name: token.card.name,
              address: {
                line1: token.card.address_line1,
                line2: token.card.address_line2,
                city: token.card.address_city,
                country: token.card.address_country,
              },
            },
          },
          { idempotencyKey }
        )
        .then((result) => {
          console.log("RESULT in backend:", result);
          return res.status(200).json(result);
        })
        .catch((err) => console.log(err));
    });
};

module.exports = { makepayment };
