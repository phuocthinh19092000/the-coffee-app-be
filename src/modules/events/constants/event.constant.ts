import 'dotenv/config';

//TODO: Wait Final FE DEPLOY
export const REACT_END_POINT = process.env.REACT_END_POINT;

// export const REACT_END_POINT = 'https://otsv-the-coffee-app.netlify.app';
export const HANDLE_ORDER_EVENT = 'handleOrder';
export const ORDER_CANCELED = 'orderCanceled';

export const ROOM_FOR_STAFF = 'staffRoom';
export const JOIN_ROOM_STAFF = 'joinRoomStaff';
export const LEAVE_ROOM_STAFF = 'leaveRoomStaff';

export const ROOM_FOR_CUSTOMER = 'customerRoom';
export const JOIN_ROOM_CUSTOMER = 'joinRoomCustomer';
export const LEAVE_ROOM_CUSTOMER = 'leaveRoomCustomer';
