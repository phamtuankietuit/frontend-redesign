import { _mock } from './_mock';

// ----------------------------------------------------------------------

export const ORDER_STATUS_OPTIONS = [
  { value: 'Pending', label: 'Chờ xác nhận' },
  { value: 'WaitForConfirmPackageBranch', label: 'Chờ chọn kho' },
  { value: 'Packaging', label: 'Đang đóng hàng' },
  { value: 'Processing', label: 'Chờ lấy hàng' },
  { value: 'Shipped', label: 'Đang giao hàng' },
  { value: 'Delivered', label: 'Đã giao' },
  { value: 'Received', label: 'Đã nhận' },
  { value: 'Cancelled', label: 'Đã hủy' },
  { value: 'Refunded', label: 'Trả hàng' },
];
const ITEMS = [...Array(3)].map((_, index) => ({
  id: _mock.id(index),
  sku: `16H9UR${index}`,
  quantity: index + 1,
  name: _mock.productName(index),
  coverUrl: _mock.image.product(index),
  price: _mock.number.price(index),
}));

export const _orders = [...Array(20)].map((_, index) => {
  const shipping = 10;

  const discount = 10;

  const taxes = 0;

  const items = (index % 2 && ITEMS.slice(0, 1)) || (index % 3 && ITEMS.slice(1, 3)) || ITEMS;

  const totalQuantity = items.reduce((accumulator, item) => accumulator + item.quantity, 0);

  const subtotal = items.reduce((accumulator, item) => accumulator + item.price * item.quantity, 0);

  const totalAmount = subtotal - shipping - discount + taxes;

  const customer = {
    id: _mock.id(index),
    name: _mock.fullName(index),
    email: _mock.email(index),
    avatarUrl: _mock.image.avatar(index),
    ipAddress: '192.158.1.38',
  };

  const delivery = { shipBy: 'DHL', speedy: 'Standard', trackingNumber: 'SPX037739199373' };

  const history = {
    orderTime: _mock.time(1),
    paymentTime: _mock.time(2),
    deliveryTime: _mock.time(3),
    completionTime: _mock.time(4),
    timeline: [
      { title: 'Giao hàng thành công', time: _mock.time(1) },
      { title: 'Đã đến kho Phú Nhuận', time: _mock.time(2) },
      { title: 'Đã tới kho Linh Trung, Thủ Đức', time: _mock.time(3) },
      { title: 'Shipper lấy hàng', time: _mock.time(4) },
      { title: 'Đã đặt hàng', time: _mock.time(5) },
    ],
  };

  return {
    id: _mock.id(index),
    orderNumber: `DH601${index}`,
    createdAt: _mock.time(index),
    taxes,
    items,
    history,
    subtotal,
    shipping,
    discount,
    customer,
    delivery,
    totalAmount,
    totalQuantity,
    shippingAddress: {
      fullAddress: '19034 Verna Unions Apt. 164 - Honolulu, RI / 87535',
      phoneNumber: '365-374-4961',
    },
    payment: { cardType: 'mastercard', cardNumber: '**** **** **** 5678' },
    status:
      (index % 2 && 'completed') ||
      (index % 3 && 'pending') ||
      (index % 4 && 'cancelled') ||
      'refunded',
  };
});
