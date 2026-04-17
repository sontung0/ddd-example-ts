import { describe, test, expect, beforeEach, mock } from 'bun:test'
import { OrderService } from '../../../../../src/modules/order/application/order-service'
import { OrderAggregate } from '../../../../../src/modules/order/domain/order-aggregate'
import type { BusInterface } from '../../../../../src/modules/app/contracts'
import type { OrderItem, OrderRepositoryInterface } from '../../../../../src/modules/order/contracts'

const item1: OrderItem = { sku_id: 'aaa', price: 10, quantity: 2 }
const item2: OrderItem = { sku_id: 'bbb', price: 20, quantity: 1 }

const makePlacedOrder = (id = 1) =>
  new OrderAggregate(id, { items: [item1], amount: 20, status: 'Placed' })

const makePaidOrder = (id = 1) =>
  new OrderAggregate(id, { items: [item1], amount: 20, status: 'Paid' })

describe('OrderService', () => {
  let bus: BusInterface
  let repo: OrderRepositoryInterface
  let service: OrderService

  beforeEach(() => {
    bus = { dispatch: mock(() => {}), listen: mock(() => () => {}) }
    repo = {
      list: mock(() => []),
      find: mock(() => undefined),
      create: mock((props) => new OrderAggregate(1, props)),
      update: mock(() => {}),
    }
    service = new OrderService(bus, repo)
  })

  describe('create()', () => {
    test('should call repo.create() and return the new order', () => {
      const order = service.create([item1])
      expect(repo.create).toHaveBeenCalled()
      expect(order.getId()).toBe(1)
    })

    test('should dispatch Order.Placed event', () => {
      service.create([item1])
      expect(bus.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Order.Placed' })
      )
    })
  })

  describe('pushItem()', () => {
    test('should call repo.update() and dispatch Order.ItemPushed', () => {
      const order = makePlacedOrder()
      service.pushItem(order, item2)
      expect(repo.update).toHaveBeenCalled()
      expect(bus.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Order.ItemPushed' })
      )
    })

    test('should throw when order cannot be paid (already Paid)', () => {
      const order = makePaidOrder()
      expect(() => service.pushItem(order, item2)).toThrow('Not allowed to push item to order #1')
    })
  })

  describe('pay()', () => {
    test('should call repo.update() and dispatch Order.Paid', () => {
      const order = makePlacedOrder()
      service.pay(order)
      expect(repo.update).toHaveBeenCalled()
      expect(bus.dispatch).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'Order.Paid' })
      )
    })

    test('should throw when order is already Paid', () => {
      const order = makePaidOrder()
      expect(() => service.pay(order)).toThrow('Not allowed to pay for order #1')
    })
  })
})
