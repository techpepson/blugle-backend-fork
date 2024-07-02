//payment code and implementation for paystack
// import https from 'https';
//creating a user in a paystack system

import axios from "axios";
import express from "express";
const app = express();

app.post("/paystack/customer", async (req, res) => {
  const data = {
    email: req.body.email,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phoneNumber: req.body.phoneNumber,
  };
  //post the details of the customer to the paystack api
  try {
    const customerResponse = await axios.post(
      "https://api.paystack.co/customer",
      data,
      {
        headers: {
          Authorization: `Bearer sk_test_d510231535ea62d7708835134b7fe472798b8314`,
          "Content-Type": "application/json",
        },
      }
    );
    if (customerResponse.status) {
      res.status(200).json({
        message: "Customer created successfully",
        data: customerResponse.data,
      });
    }
    res.json({
      message: `Customer with customer details ${customerResponse.data} was not successfully created.`,
    });
  } catch (error) {
    res.status(500).json({
      message: `ser creation failed with status code ${res.statusCode}`,
    });
  }
});

//initialize payment with paystack api

app.post("/initialize/payment", async (req, res) => {
  const data = {
    email: req.body.email,
    amount: req.body.amount,
    channels: ["mobile_money", "card", "bank"],
    currency: "GHS",
  };

  try {
    const submitUserDetails = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      data,
      {
        headers: {
          Authorization: `Bearer sk_test_d510231535ea62d7708835134b7fe472798b8314`,
          "Content-Type": "application/json",
        },
      }
    );
    if (submitUserDetails.status) {
      res.status(200).json({
        message: "Payment initialization successful.",
        data: submitUserDetails.data,
        authorizationUrl: submitUserDetails.data.authorization_url,
      });
    }
    res.json({ message: "The initialization process failed" });
  } catch (error) {
    res.status(500).json({
      message: `The initialization failed with status code ${res.statusCode}`,
    });
  }
});

//verification process for the paystack payment method

app.get("/payment/verify/:reference", async (req, res) => {
  const { reference } = req.params; // Declare and assign the 'reference' variable
  const verifyCustomer = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer sk_test_d510231535ea62d7708835134b7fe472798b8314`,
      },
    }
  );
});
