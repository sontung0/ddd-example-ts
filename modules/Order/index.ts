import { bus } from "../App";
import { OrderController } from "./OrderController";
import { OrderRepository } from "./OrderRepository";
import { OrderService } from "./OrderService";

export const orderRepository = new OrderRepository()
export const orderService = new OrderService(bus, orderRepository)
export const orderController = new OrderController(orderService, orderRepository)

for (const eventName of ['Order.Placed', 'Order.ItemPushed', 'Order.Paid']) {
  bus.listen(eventName, event => console.dir(event, { depth: 10 }))
}
