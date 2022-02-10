export enum OrderStatus {
  new = 'new',
  processing = 'processing',
  ready = 'ready for pickup',
  pickedUp = 'picked up',
  canceled = 'canceled',
}

export enum OrderStatusNumber {
  new = 1,
  processing = 2,
  ready = 3,
  canceled = -1,
}

export const TitleOrder = 'The Coffee App OTSV';
export const MessageNewOrder = 'Your order has been placed successfully';
export const MessageUpdateOrder = 'Your order has been change to';
export const MessageRemindPickUpOrder =
  'Drinks are ready! Hurry up, time to chill!';

