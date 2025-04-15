"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useContext } from "react";
import { StripeContext } from "./layout.tsx";

export default function Home() {
  const stripe = useStripe();
  const elements = useElements();

  // Context から client_secret と顧客の ID を取得
  const { clientSecret, customerId } = useContext(StripeContext);

  const handleClick = () => {
    if (!stripe || !elements) return;

    elements.submit().then(({ error, selectedPaymentMethod }) => {
      console.log("selectedPaymentMethod", selectedPaymentMethod);
      console.log("error", error);

      if (!selectedPaymentMethod) return;

      return stripe
        .confirmSetup({
          clientSecret,
          elements,
          confirmParams: {
            return_url:
              globalThis.location.origin + "/confirm?customerId=" + customerId,
          },
          redirect: "always",
        })
        .then(({ error, setupIntent }) => {
          console.log("setupIntent", setupIntent);
          console.log("error", error);
        });
    });
  };

  return (
    <div>
      <h1>決済検証ページ</h1>
      <main>
        <div style={{ padding: "1rem" }}>
          テストカード番号: 4000002760003184
          <br />
          <br />
          <a href="https://docs.stripe.com/testing?locale=ja-JP#regulatory-cards">
            https://docs.stripe.com/testing?locale=ja-JP#regulatory-cards
          </a>
        </div>

        <div style={{ padding: "1rem" }}>
          <PaymentElement />
        </div>

        <div style={{ padding: "1rem" }}>
          <button onClick={handleClick}>カード保存</button>
        </div>
      </main>
    </div>
  );
}
