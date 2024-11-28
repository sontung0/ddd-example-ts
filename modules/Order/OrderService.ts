import type { BusInterface } from "../App/contracts";
import type { OrderAggregateInterface, OrderItem, OrderProperties, OrderRepositoryInterface, OrderServiceInterface } from "./contracts";
import { OrderAggregate } from "./OrderAggregate";

export class OrderService implements OrderServiceInterface {
  constructor( 
    protected bus: BusInterface,
    protected repo: OrderRepositoryInterface
  ) {}

  create(items: OrderItem[]) {
    const cmd = OrderAggregate.create(items)
    const order = this.repo.create(cmd.set as OrderProperties)
    cmd.dispatch.payload = {...cmd.dispatch.payload, order: order.get()}
    this.bus.dispatch(cmd.dispatch)

    return order
  }

  pushItem(order: OrderAggregateInterface, item: OrderItem) {
    if (!order.canPay()) {
      throw new Error(`Not allowed to push item to order #${order.getId()}`)
    }

    const cmd = order.pushItem(item)
    this.repo.update(order, cmd)
    this.bus.dispatch(cmd.dispatch)
  }

  pay(order: OrderAggregateInterface) {
    if (!order.canPay()) {
      throw new Error(`Not allowed to pay for order #${order.getId()}`)
    }

    const cmd = order.pay()
    this.repo.update(order, cmd)
    this.bus.dispatch(cmd.dispatch)
  }
}