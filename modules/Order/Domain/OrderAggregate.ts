import type { OrderAggregateCommand, OrderAggregateInterface, OrderItem, OrderProperties } from "../contracts";

export class OrderAggregate implements OrderAggregateInterface {
  constructor(
    readonly id: number,
    readonly properties: OrderProperties
  ) { }

  getId() {
    return this.id
  }

  get() {
    return { id: this.id, ...this.properties }
  }

  static create(items: OrderItem[]): OrderAggregateCommand {
    const order: OrderProperties = {
      items,
      amount: items.reduce((amount, item) => amount + item.price * item.quantity, 0),
      status: 'Placed',
    }

    return {
      set: order,
      dispatch: { name: 'Order.Placed', payload: { order } }
    }
  }

  pushItem(item: OrderItem): OrderAggregateCommand {
    return {
      push: { items: [item] },
      increment: { amount: item.price * item.quantity },
      dispatch: { name: 'Order.ItemPushed', payload: { id: this.id, item } }
    }
  }

  canPay(): boolean {
    return this.properties.status === 'Placed'
  }

  pay(): OrderAggregateCommand {
    return {
      set: { status: 'Paid' },
      dispatch: { name: 'Order.Paid', payload: { id: this.id } }
    }
  }
}