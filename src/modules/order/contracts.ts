
export type Order = {id: number} & OrderProperties

export type OrderProperties = {
  items: OrderItem[],
  amount: number,
  status: 'Placed' | 'Paid' | 'Completed',
}

export type OrderItem = {
  sku_id: string,
  price: number,
  quantity: number,
}

export type OrderEvent = {
  name: 'Order.Placed' | 'Order.ItemPushed' | 'Order.Paid'
  payload?: Record<string, any>
}

export type OrderAggregateCommand = {
  set?: Partial<OrderProperties>,
  increment?: Pick<OrderProperties, 'amount'>,
  push?: Pick<OrderProperties, 'items'>,
  dispatch: OrderEvent,
}

export interface OrderAggregateInterface {
  getId(): number,
  get(): Order,
  pushItem(item: OrderItem): OrderAggregateCommand,
  canPay(): boolean,
  pay(): OrderAggregateCommand,
}

export interface OrderRepositoryInterface {
  list(): Order[]
  find(id: number): OrderAggregateInterface|undefined,
  create(input: OrderProperties): OrderAggregateInterface,
  update(order: OrderAggregateInterface, command: OrderAggregateCommand): void,
}

export interface OrderServiceInterface {
  create(items: OrderItem[]): OrderAggregateInterface,
  pushItem(order: OrderAggregateInterface, item: OrderItem): void,
  pay(order: OrderAggregateInterface): void,
}
