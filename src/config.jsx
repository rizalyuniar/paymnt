const axios = require('axios')
const config = {
  headers: {
    "Content-Type": " application/x-www-form-urlencoded"
  },
  auth: {
    username: `${process.env.FLIP_SECRET_KEY}:`,
    password: process.env.FLIP_PASSWORD
  }
}

const createBill = async (payload) => {
  const callApi = await axios.post(`${process.env.FLIP_BASE_URL}/pwf/bill`, payload, config)
  return callApi.data
}

const getBankAccout = async () => {
  const callApi = await axios.get(`${process.env.FLIP_BASE_URL}/general/banks`, config)
  return callApi.data
}

module.exports = {
  getBankAccout,
  createBill,
}