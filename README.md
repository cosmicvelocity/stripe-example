# Stripe 決済検証ページ

発注時にクレジットカードを保存し、後で管理者が決済を行うフローを検証します。

## フロー

1. サーバーサイド
   1. Customer を作成
   2. Setup Intent を作成
2. フロント
   1. Client Secret を使って UI を PaymentElement を表示
   2. confirmSetup を実行
3. リダイレクト
4. フロント
   1. リダイレクトパラメーターから Setup Intent を取得
   2. テスト決済を実行
5. サーバーサイド
   1. Setup Intent の Payment Method を使用して Payment Intent を登録して決済の実行 (実際は管理者が行う事を想定)

参考

- https://docs.stripe.com/payments/payment-intents
- https://docs.stripe.com/payments/setup-intents

## 現在の課題

3DS で認証が設定されている場合、決済実行時に下記のように `next_action` が `use_stripe_sdk` になってしまい、決済が確定しない。  
※事前に `confirmSetup` で認証しているため、決済時には再認証は不要となる認識でいた。

```json
{
  "id": "pi_xxxxx",
  "object": "payment_intent",
  "amount": 1000,
  "amount_capturable": 0,
  "amount_details": {
    "tip": {}
  },
  "amount_received": 0,
  "application": null,
  "application_fee_amount": null,
  "automatic_payment_methods": {
    "allow_redirects": "never",
    "enabled": true
  },
  "canceled_at": null,
  "cancellation_reason": null,
  "capture_method": "automatic_async",
  "client_secret": "pi_xxxxx",
  "confirmation_method": "automatic",
  "created": 1744685975,
  "currency": "jpy",
  "customer": "cus_xxxxx",
  "description": null,
  "last_payment_error": null,
  "latest_charge": null,
  "livemode": false,
  "metadata": {},
  "next_action": {
    "type": "use_stripe_sdk",
    "use_stripe_sdk": {
      "directory_server_encryption": {
        "algorithm": "RSA",
        "certificate": "xxxxx",
        "directory_server_id": "xxxxx",
        "root_certificate_authorities": ["xxxxx"]
      },
      "directory_server_name": "visa",
      "merchant": "acct_xxxxx",
      "one_click_authn": null,
      "server_transaction_id": "xxxxx",
      "three_d_secure_2_source": "payatt_xxxxx",
      "three_ds_method_url": "",
      "three_ds_optimizations": "kf",
      "type": "stripe_3ds2_fingerprint"
    }
  },
  "on_behalf_of": null,
  "payment_method": "pm_xxxxx",
  "payment_method_configuration_details": {
    "id": "pmc_xxxxx",
    "parent": null
  },
  "payment_method_options": {
    "card": {
      "installments": {
        "available_plans": [],
        "enabled": true,
        "plan": null
      },
      "mandate_options": null,
      "network": null,
      "request_three_d_secure": "automatic"
    },
    "link": {
      "persistent_token": null
    }
  },
  "payment_method_types": ["card", "link"],
  "processing": null,
  "receipt_email": null,
  "review": null,
  "setup_future_usage": null,
  "shipping": null,
  "source": null,
  "statement_descriptor": null,
  "statement_descriptor_suffix": null,
  "status": "requires_action",
  "transfer_data": null,
  "transfer_group": null
}
```
