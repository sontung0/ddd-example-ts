# ddd-example

![DDD diagram](ddd-diagram.png?raw=true)

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

Apis:

```bash
curl 'http://localhost:3000/order/list'

curl  -X POST \
  'http://localhost:3000/order/create' \
  --data-raw '{
  "items": [
    {
      "sku_id": "aaa",
      "price": 10,
      "quantity": 1
    }
  ]
}'

curl  -X POST \
  'http://localhost:3000/order/push-item' \
  --data-raw '{
  "order_id": 1,
  "item": {
    "sku_id": "bbb",
    "price": 20,
    "quantity": 2
  }
}'

curl  -X POST \
  'http://localhost:3000/order/pay' \
  --data-raw '{
  "order_id": 1
}'
```

This project was created using `bun init` in bun v1.1.10. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
