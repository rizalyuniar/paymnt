chargeMidtrans: async (req, res) => {
    try {
      const { sender_bank, sender_name, sender_email, sender_phone_number, doctor_fullname, doctor_price, transaction_id, } = req.body

      let core = new midtransClient.CoreApi({
        isProduction: false,
        serverKey: `${process.env.SERVER_KEY_MIDTRANS}:`,
        clientKey: `${process.env.CLIENT_KEY_MIDTRANS}:`
      });

      let payload = {
        "payment_type": "bank_transfer",
        "transaction_details": {
          "gross_amount": doctor_price,
          "order_id": transaction_id,
        },
        "bank_transfer": {
          "bank": sender_bank
        },
        "metadata": {
          "description": `Konsultasi dengan ${doctor_fullname}`
        },
        "customer_details": {
          "first_name": sender_name,
          "last_name": '',
          "email": sender_email,
          "phone": sender_phone_number
        },
        "echannel": {
          "bill_info1": `Konsultasi dengan ${doctor_fullname}`,
        }
      };

      core.charge(payload)
        .then((chargeResponse) => {
          const data = {
            transaction_id: chargeResponse?.order_id,
            flip_bill_id: chargeResponse?.transaction_id,
            flip_link_url: chargeResponse?.signature_key,
            flip_bill_payment: JSON.stringify(chargeResponse)
          }

          TransactionsModel.updateTransactionForPayment(data).then(result => {
            return helperResponse.response(res, chargeResponse, 201, "Payment Created");
          })
        })
        .catch((e) => {
          console.log('Error occured:', e.message);
          res.json({
            message: e.message
          })
        });
    } catch (error) {
      console.log(error);
    }
  }