"use client";

import { createContext, ReactNode, useEffect, useState } from "react";
import "./globals.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

export const StripeContext = createContext<{
  /**
   * Setup Intent の client_secret
   */
  clientSecret: string;

  /**
   * Setup Intent 登録時に生成した顧客の ID
   */
  customerId: string;
}>({
  clientSecret: "",
  customerId: "",
});

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY ?? "");

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [clientSecret, setClientSecret] = useState("");
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    // Setup Intent の生成
    fetch(globalThis.location.origin + "/api/setupIntent", {
      body: JSON.stringify({
        email: "example@example.com",
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);

        setClientSecret(json.data.clientSecret);
        setCustomerId(json.data.customerId);
      })
      .catch((err) => {
        console.error("Error.", err);
      });
  }, []);

  if (!clientSecret || !customerId)
    return (
      <html lang="ja">
        <body></body>
      </html>
    );

  return (
    <html lang="ja">
      <body>
        <StripeContext.Provider
          value={{
            clientSecret,
            customerId,
          }}
        >
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            {children}
          </Elements>
        </StripeContext.Provider>
      </body>
    </html>
  );
}
