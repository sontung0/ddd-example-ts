import { bus } from "../app";
import { OrderApiController } from "./presentation/order-api-controller";
import { OrderRepository } from "./infrastructure/order-repository";
import { OrderService } from "./application/order-service";

export const orderRepository = new OrderRepository()
export const orderService = new OrderService(bus, orderRepository)
export const orderApiController = new OrderApiController(orderService, orderRepository)

for (const eventName of ['Order.Placed', 'Order.ItemPushed', 'Order.Paid']) {
  bus.listen(eventName, event => console.dir(event, { depth: 10 }))
}
