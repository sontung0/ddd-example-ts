import type { OrderRepositoryInterface, OrderServiceInterface } from "../contracts"

export class OrderApiController {
  constructor(
    protected service: OrderServiceInterface,
    protected repo: OrderRepositoryInterface
  ) { }

  async list(req: Request) {
    const orders = this.repo.list()

    return Response.json({ orders })
  }

  async create(req: Request) {
    const { items } = await req.json()
    const order = this.service.create(items)

    return Response.json({ order: order.get() })
  }

  async pushItem(req: Request) {
    const { order_id, item } = await req.json()
    const order = this.findOrder(order_id)
    this.service.pushItem(order, item)

    return Response.json({ order: this.repo.find(order_id)?.get() })
  }

  async pay(req: Request) {
    const { order_id } = await req.json()
    const order = this.findOrder(order_id)
    this.service.pay(order)

    return Response.json({ order: this.repo.find(order_id)?.get() })
  }

  protected findOrder(id: number) {
    const order = this.repo.find(id)

    if (!order) {
      throw new Error(`The order #${id} not found`)
    }

    return order
  }
}