/****
 * paypal 
 * Eine eingene SDK 
 * 
 * Login bei developer.paypal.com  mit ihyildiz@icloud
 * 
 * 
 */
require('dotenv').config();

const axios = require ('axios')


/**
 * Hie erhalten wir die Access Token, dass wir für die weitere
 * Transaktionen benötigen wo eine Authentifizierung getätigt werden muss
 * 
 * @returns access_token
 */
async function generateAccessToken() {
    const response = await axios({
        url: process.env.PAYPAL_BASE_URL + '/v1/oauth2/token',
        method: 'post',
        data: 'grant_type=client_credentials',
        auth: {
            username: process.env.PAYPAL_CLIENT_ID,
            password: process.env.PAYPAL_SECRET
        }
    })
    /****************
    response.data liefert:
        {
            scope: 'https://uri.paypal.com/services/billing-agreements https://api.paypal.com/v1/payments/.* https://uri.paypal.com/services/vault/payment-tokens/read openid Braintree:Vault https://uri.paypal.com/services/subscriptions',
            access_token: 'A21AAKSK3t2rK8nV2tShKHusuwByxH63Ea6-_fUyEzV2YH5NwI67cS7hUM2m9cjTUhj4jPUbwtqiA5IcGAZjaEUaBIGXhk-Tw',
            token_type: 'Bearer',
            app_id: 'APP-80W284485P519543T',
            expires_in: 29906,
            nonce: '2025-02-28T22:16:20ZtHkG9htTG13wX50bNVn8pA5sosf7X_d6LuGnQmNW32s'
        }
    */
    return response.data.access_token
}
/*   TESTING createOrder() **
generateAccessToken(
**** ENDE TESTING ***/


/**
 * Hier der die Bestellung zusammengebaut und an die checkout order URL von Paypal
 * gesendet. Also rückgabe gibt es einige infromation zurück.
 * 
 * Im Detial https://developer.paypal.com/docs/api/orders/v2/#orders_create
 * 
 * Damit wir auf die Bestell und Zahlungsseite kommen, benötigen wir nur die "approve" URL
 * 
 * @returns approved URL zu Paypals Bezahlseite
 */

const products = require('../config/products');
const p = products.pinobeep_two_color_45v;

exports.createOrder = async  () => {
    const accessToken = await generateAccessToken()
    
    try { 
        const response = await axios ({
        url: process.env.PAYPAL_BASE_URL + '/v2/checkout/orders',
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken
        },
        data: JSON.stringify({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    items: [
                        {
                            name: p.name,
                            description: p.description,
                            quantity: 1,
                            unit_amount: {
                                currency_code: p.currency,
                                value: p.price
                            }   
                        }
                    ],

                    amount:{
                        currency_code: p.currency,
                        value: p.price,
                        breakdown: {
                            item_total: {
                                currency_code: p.currency,
                                value: p.price
                            }
                        }
                    }/*,
                    shipping: {
                        name: {
                            full_name: "Max Mustermann"
                        },
                        address: {
                            address_line_1: "Musterstraße 1",
                            address_line_2: "Etage 2, Wohnung 5", // Optional
                            admin_area_2: "Musterstadt",
                            admin_area_1: "NRW", // Bundesland (optional)
                            postal_code: "12345",
                            country_code: "DE"
                        }
                    }*/
                }
            ],

            application_context: {
                return_url: process.env.BASE_URL + '/orders/complete-order',
                cancel_url: process.env.BASE_URL + '/orders/cancel-order',
                user_action: 'PAY_NOW',
                brand_name: "pinoBeep® Shop",
            }
        })
    })
    // Liefert eingie Links zurück:
    /*
        id: '9FE266433F409280R',
        status: 'CREATED',
        links: [
            {
            href: 'https://api.sandbox.paypal.com/v2/checkout/orders/9FE266433F409280R',
            rel: 'self',
            method: 'GET'
            },
            {
            href: 'https://www.sandbox.paypal.com/checkoutnow?token=9FE266433F409280R',
            rel: 'approve',
            method: 'GET'
            },
    Und wir wolle den Link zu appoved habe
    **/
    //console.log(response.data)
    
    return response.data.links.find(link => link.rel ==='approve').href

} catch (error) {
    console.error('PAYPAL createOrder FAILED');
    console.error('Status:', error?.response?.status);
    console.error('Data:', JSON.stringify(error?.response?.data, null, 2));
    throw error; // damit /orders/pay es auch sieht
  }      
}


/*   TESTING createOrder() **

this.createOrder().then(result => console.log(result))
// Liefert die url, Beispiel:
//   https://www.sandbox.paypal.com/checkoutnow?token=5CD07069LK764230D

**** ENDE TESTING ***/


/**
 * Hier greife ich mir die Zahlung ab, um es später als erfolgreiche Zahlung
 * identifizieren zu können. Nach der Zahlung komme ich über den 
 * Return URL zurück und bekomme eine Zahlungs Token zurück. Die steht in der 
 * URL als ?-Paramter und mit dem Namen 'Token'
 * 
 * Im Detail: https://developer.paypal.com/docs/api/orders/v2/#orders_capture
 * 
 * @param {*} orderId  Token aus dem erfolgreichen Return-URL 
 * @returns 
 */

exports.capturePayment = async (orderId) => {
    const accessToken = await generateAccessToken()

    const response = await axios ({
        url: process.env.PAYPAL_BASE_URL + `/v2/checkout/orders/${orderId}/capture`,
        method: 'post',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + accessToken,
            'PayPal-Request-Id': orderId, // Verhindert doppelte Verarbeitung
        }
    })
    
   
    return response.data
}


