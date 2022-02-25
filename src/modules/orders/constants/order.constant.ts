export enum OrderStatus {
  NEW = 'new',
  PROCESSING = 'processing',
  READY = 'ready for pickup',
  DONE = 'done',
  CANCELED = 'canceled',
}

export enum OrderStatusNumber {
  NEW = 1,
  PROCESSING = 2,
  READY = 3,
  CANCELED = -1,
}

export const TitleOrder = 'The Coffee App OTSV';
export const MessageNewOrder = 'Your order has been placed successfully';
export const MessageUpdateOrder = 'Your order has been change to';
export const MessageRemindPickUpOrder =
  'Drinks are ready! Hurry up, time to chill!';
