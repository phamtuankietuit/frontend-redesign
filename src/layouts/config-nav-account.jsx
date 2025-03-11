import { paths } from 'src/routes/paths';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export const _account = [
  {
    label: 'Cài đặt tài khoản',
    href: paths.account.general,
    icon: <Iconify icon="solar:settings-bold-duotone" />,
  },
  {
    label: 'Đơn hàng',
    href: paths.account.orders,
    icon: <Iconify icon="solar:box-bold-duotone" />,
  },
];
