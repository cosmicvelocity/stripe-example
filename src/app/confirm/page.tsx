"use client";

import { useEffect, useState } from "react";
import { loadStripe, SetupIntent } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_API_KEY ?? "");

/**
 * テスト決済ページ
 */
export default function Page() {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [setupIntent, setSetupIntent] = useState<SetupIntent | null>(null);

  useEffect(() => {
    // パラメーターで返ってきた値を取得
    const params = new globalThis.URLSearchParams(globalThis.location.search);
    const setupIntent = params.get("setup_intent");
    const setupIntentClientSecret = params.get("setup_intent_client_secret");
    const redirectStatus = params.get("redirect_status");
    const customerId = params.get("customerId");

    console.log("setupIntent", setupIntent);
    console.log("setupIntentClientSecret", setupIntentClientSecret);
    console.log("redirectStatus", redirectStatus);
    console.log("customerId", customerId);

    if (redirectStatus !== "succeeded") {
      globalThis.alert("認証に失敗しました。");

      return;
    }

    stripePromise
      .then((stripe) => {
        // Setup Intent を取得
        return stripe
          .retrieveSetupIntent(setupIntentClientSecret)
          .then(({ setupIntent }) => {
            console.log("setupIntent", setupIntent);

            setSetupIntent(setupIntent);
            setCustomerId(customerId);
          });
      })
      .catch((err) => {
        conosle.error("Error.", err);
      });
  }, []);

  const handleClick = () => {
    if (!customerId || !setupIntent) return;

    // サーバーサイドの決済確定処理を呼び出し
    fetch(globalThis.location.origin + "/api/paymentIntent", {
      body: JSON.stringify({
        customer: customerId,
        paymentMethod: setupIntent.payment_method ?? "",
      }),
      method: "POST",
    })
      .then((response) => response.json())
      .then((json) => {
        console.log("json", json);
      });
  };

  return (
    <div>
      <h1>認証完了ページ</h1>
      <main>
        {customerId && setupIntent && (
          <div style={{ padding: "1rem" }}>
            <button onClick={handleClick}>決済のテスト</button>
          </div>
        )}
      </main>
    </div>
  );
}
