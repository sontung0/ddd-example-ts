import { bus } from "../App";
import { OrderApiController } from "./Presentation/OrderApiController";
import { OrderRepository } from "./Infrastructure/OrderRepository";
import { OrderService } from "./Application/OrderService";

export const orderRepository = new OrderRepository()
export const orderService = new OrderService(bus, orderRepository)
export const orderApiController = new OrderApiController(orderService, orderRepository)

for (const eventName of ['Order.Placed', 'Order.ItemPushed', 'Order.Paid']) {
  bus.listen(eventName, event => console.dir(event, { depth: 10 }))
}
