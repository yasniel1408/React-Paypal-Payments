import React from "react";
import ReactDOM from "react-dom";
import paypal from "paypal-checkout";

const PaypalCheckoutButton = ({ order }) => {
  const paypalConf = {
    currency: "MXN", //tipo de moneda
    env: "sandbox",
    client: {
      sandbox: "<<ID SANDBOX API>>",
      production: "--", //ID de produccion
    },
    style: {
      // estilos del boton de paypal
      label: "pay",
      size: "large", // small | medium | large | responsive
      shape: "pill", // pill | rect
      color: "gold", // gold | blue | silver | black
    },
  };

  const PayPalButton = paypal.Button.driver("react", { React, ReactDOM });

  const payment = (data, actions) => {
    const payment = {
      transactions: [
        {
          amount: {
            total: order.total,
            currency: paypalConf.currency,
          },
          description: "Compra de productos.",
          custom: order.customer || "",
          item_list: {
            items: order.items,
          },
        },
      ],
      note_to_payer: "Contáctanos para cualquier aclaración sobre tu compra.",
    };

    // console.log(payment);
    return actions.payment.create({
      payment,
    });
  };

  const onAuthorize = (data, actions) => {
    return actions.payment
      .execute()
      .then((response) => {
        console.log(response);
        alert(`El Pago fue procesado correctamente, ID: ${response.id}`);
      })
      .catch((error) => {
        console.log(error);
        alert("Ocurrió un error al procesar el pago con Paypal");
      });
  };

  const onError = (error) => {
    alert("El pago con PayPal no fue realizado, vuelva a intentarlo.");
  };

  const onCancel = (data, actions) => {
    alert(
      "El pago con PayPal no fue realizado, el usuario canceló el proceso."
    );
  };

  return (
    <PayPalButton
      env={paypalConf.env}
      client={paypalConf.client}
      payment={(data, actions) => payment(data, actions)}
      onAuthorize={(data, actions) => onAuthorize(data, actions)}
      onCancel={(data, actions) => onCancel(data, actions)}
      onError={(error) => onError(error)}
      style={paypalConf.style}
      commit
      locale="es_MX"
    />
  );
};

export default PaypalCheckoutButton;
