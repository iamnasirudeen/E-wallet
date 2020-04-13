import axios from "axios";

/**
 * Initialize paystack transaction. create an Object with all the params below included in it.
 * @param {Number} amount (required).
 * @param {String} email Logged in user's email (required).
 * @param {String} reference A random number generated to track transactions (optional).
 * @returns {Object} this.data.authorization_url. The URL the payment will be made.
 */

exports.initializePayment = async (form) => {
  const options = {
    url: "https://api.paystack.co/transaction/initialize",
    headers: {
      authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    method: "POST",
    data: form,
  };
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.request(options);
      resolve(response.data);
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Verify all transactions before updating their status in the DB
 * @param {String} trxref The reference String to verify the transaction. It will be gotten after successfully
 * initializing a transaction.
 */

exports.verifyPayment = async (ref) => {
  const options = {
    url: "https://api.paystack.co/transaction/verify/" + encodeURIComponent(ref),
    headers: {
      authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "content-type": "application/json",
      "cache-control": "no-cache",
    },
    method: "GET",
  };
  return new Promise(async (resolve, reject) => {
    try {
      const data = await axios.request(options);
      resolve(data);
    } catch (error) {
      reject(error);
    }
  });
};
