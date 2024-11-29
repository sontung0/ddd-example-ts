import { orderApiController } from './modules/Order';

const server = Bun.serve({
  port: 3000,
  async fetch(req) {
    const url = new URL(req.url);

    switch (url.pathname) {
      case '/order/list':
        return orderApiController.list(req)

      case '/order/create':
        return orderApiController.create(req)

      case '/order/push-item':
        return orderApiController.pushItem(req)

      case '/order/pay':
        return orderApiController.pay(req)

      default:
        return Response.json({ error: 404 }, { status: 404 })
    }
  },
  error(error) {
    console.error(error)
    return Response.json({ error: error.message }, { status: 400 })
  },
});

console.log(`Listening on localhost:${server.port}`);