getStatusPayment: async (req, res) => {
    try {
      const callbackFlip = JSON.parse(req.body.data);
      // cek transaction available or not
      const {
        rows: [cekTransaction],
      } = await TransactionsModel.getDetailTransactionByBill(
        callbackFlip?.bill_link_id,
      );
  
      if (callbackFlip.status === "SUCCESSFUL") {
        const data = {
          transactionId: cekTransaction.id,
          status: "1",
          payment_at: moment(Date.now()).format("DD-MM-YYYY"),
          time_payment_at: moment(Date.now()).format("HH:mm"),
        };
  
        const url = `${process.env.NODEMAILER_FRONTEND_URL}/transaction`;
        // send email
        const dokterFullname = cekTransaction.doctor_fullname;
        const doctorEmail = cekTransaction.doctor_email;
        const pattienFullname = cekTransaction.user_fullname;
        await sendEmailTransaction(
          doctorEmail,
          "Alert! New Appointment!",
          url,
          pattienFullname,
          dokterFullname,
        );
  
        return TransactionsModel.updateTransaction(data).then((result) => {
          helperResponse.response(res, result.rows, 201, "Transaction Updated");
        });
      }
  
      const data = {
        transactionId: cekTransaction.id,
        status: "3",
        payment_at: moment(Date.now()).format("DD-MM-YYYY"),
        time_payment_at: moment(Date.now()).format("HH:mm"),
      };
  
      return TransactionsModel.updateTransaction(data).then((result) => {
        helperResponse.response(res, result.rows, 201, "Transaction Updated");
      });
    } catch (error) {
      console.log(error);
    }
  };
  