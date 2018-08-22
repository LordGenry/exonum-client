import axios from 'axios'
import { isObject } from '../helpers'
import * as validate from '../types/validate'
import { isInstanceofOfNewMessage } from '../types/message'

const ATTEMPTS = 10
const ATTEMPT_TIMEOUT = 500

/**
 * Send transaction to the blockchain
 * @param {string} transactionEndpoint
 * @param {string} explorerBasePath
 * @param {Object} data
 * @param {string} signature
 * @param {NewMessage} type
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */
export function send (transactionEndpoint, explorerBasePath, data, signature, type, attempts, timeout) {
  if (typeof transactionEndpoint !== 'string') {
    throw new TypeError('Transaction endpoint of wrong data type is passed. String is required.')
  }
  if (typeof explorerBasePath !== 'string') {
    throw new TypeError('Explorer base path endpoint of wrong data type is passed. String is required.')
  }
  if (!isObject(data)) {
    throw new TypeError('Data of wrong data type is passed. Object is required.')
  }
  if (!validate.validateHexadecimal(signature, 64)) {
    throw new TypeError('Signature of wrong type is passed. Hexadecimal expected.')
  }
  if (!isInstanceofOfNewMessage(type)) {
    throw new TypeError('Transaction of wrong type is passed.')
  }
  if (typeof attempts !== 'undefined') {
    if (isNaN(parseInt(attempts)) || attempts < 0) {
      throw new TypeError('Attempts of wrong type is passed.')
    }
  } else {
    attempts = ATTEMPTS
  }
  if (typeof timeout !== 'undefined') {
    if (isNaN(parseInt(timeout)) || timeout <= 0) {
      throw new TypeError('Timeout of wrong type is passed.')
    }
  } else {
    timeout = ATTEMPT_TIMEOUT
  }

  type.signature = signature
  const hash = type.hash(data)

  return axios.post(transactionEndpoint, {
    protocol_version: type.protocol_version,
    service_id: type.service_id,
    message_id: type.message_id,
    body: data,
    signature: signature
  }).then(() => {
    if (attempts > 0) {
      let count = attempts
      return (function attempt () {
        if (count-- > 0) {
          return axios.get(`${explorerBasePath}${hash}`).then(response => {
            if (response.data.type === 'committed') {
              return hash
            }
            return new Promise((resolve) => {
              setTimeout(resolve, timeout)
            }).then(attempt)
          }).catch(() => {
            if (count > 0) {
              return new Promise((resolve) => {
                setTimeout(resolve, timeout)
              }).then(attempt)
            }
            throw new Error('The request failed or the blockchain did not respond.')
          })
        } else {
          throw new Error('Transaction is not accepted to the block.')
        }
      })()
    }
  })
}

/**
 * Send transaction to the blockchain
 * @param {string} transactionEndpoint
 * @param {string} explorerBasePath
 * @param {Array} transactions
 * @param {number} attempts
 * @param {number} timeout
 * @return {Promise}
 */
export function sendQueue (transactionEndpoint, explorerBasePath, transactions, attempts, timeout) {
  let index = 0
  let responses = []

  return (function shift () {
    let transaction = transactions[index++]

    return send(transactionEndpoint, explorerBasePath, transaction.data, transaction.signature, transaction.type, attempts, timeout).then(response => {
      responses.push(response)
      if (index < transactions.length) {
        return shift()
      } else {
        return responses
      }
    })
  })()
}
