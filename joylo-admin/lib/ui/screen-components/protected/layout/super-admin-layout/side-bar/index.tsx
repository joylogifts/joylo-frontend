'use client';

// Core
import { useContext } from 'react';

// Context
import { LayoutContext } from '@/lib/context/global/layout.context';

// Interface & Types
import {
  IGlobalComponentProps,
  ISidebarMenuItem,
  LayoutContextProps,
} from '@/lib/utils/interfaces';

// Icons
import {
  faCog,
  faGlobe,
  faHome,
  faSliders,
  faUpRightFromSquare,
  faWallet,
} from '@fortawesome/free-solid-svg-icons';

// Constants and Utiils
import useCheckAllowedRoutes from '@/lib/hooks/useCheckAllowedRoutes';

// Components
import SidebarItem from './side-bar-item';
import { } from 'next-intl';
import { faHeadset } from '@fortawesome/free-solid-svg-icons/faHeadset';
import { useLangTranslation } from '@/lib/context/global/language.context';

function SuperAdminSidebar({ children }: IGlobalComponentProps) {
  // Contexts
  const { isSuperAdminSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  return (
    <div className="relative">
      <aside
        id="app-sidebar"
        className={`box-border transform overflow-hidden transition-all duration-300 ease-in-out ${isSuperAdminSidebarVisible ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}`}
      >
        <nav
          className={`flex h-full flex-col border-r bg-white shadow-sm transition-opacity duration-300 ${isSuperAdminSidebarVisible ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        >
          <ul className="flex-1 pl-2">{children}</ul>
        </nav>
      </aside>
    </div>
  );
}

export default function MakeSidebar() {
  // Hooks

  const { getTranslation } = useLangTranslation();

  // Contexts
  const { isSuperAdminSidebarVisible } =
    useContext<LayoutContextProps>(LayoutContext);

  const navBarItems: ISidebarMenuItem[] = [
    {
      text: getTranslation('my_website'),
      label: getTranslation('my_website'),
      route: 'https://joylo.app/',
      isParent: true,
      icon: faUpRightFromSquare,
      isClickable: true,
      shouldOpenInNewTab: true,
    },
    {
      text: getTranslation('home'),
      label: getTranslation('home'),
      route: '/home',
      isParent: true,
      icon: faHome,
      isClickable: true,
    },
    {
      text: getTranslation('general'),
      label: getTranslation('general'),
      route: '/general',
      isParent: true,
      icon: faCog,
      subMenu: useCheckAllowedRoutes([
        {
          text: getTranslation('vendors'),
          label: getTranslation('vendors'),
          route: '/general/vendors',
          isParent: false,
        },
        {
          text: getTranslation('stores'),
          label: getTranslation('stores'),
          route: '/general/stores',
          isParent: false,
        },
        {
          text: getTranslation('riders'),
          label: getTranslation('riders'),
          route: '/general/riders',
          isParent: false,
        },
        {
          text: getTranslation('users'),
          label: getTranslation('users'),
          route: '/general/users',
          isParent: false,
        },
        {
          text: getTranslation('staff'),
          label: getTranslation('staff'),
          route: '/general/staff',
          isParent: false,
        },
      ]),
      shouldShow: function () {
        return this.subMenu ? this.subMenu.length > 0 : false;
      },
    },
    {
      text: getTranslation('management'),
      label: getTranslation('management'),
      route: '/management',
      isParent: true,
      icon: faSliders,
      subMenu: useCheckAllowedRoutes([
        {
          text: getTranslation('configuration'),
          label: getTranslation('configuration'),
          route: '/management/configurations',
          isParent: false,
        },
        {
          text: getTranslation('orders'),
          label: getTranslation('orders'),
          route: '/management/orders',
          isParent: false,
        },
        {
          text: getTranslation('coupons'),
          label: getTranslation('coupons'),
          route: '/management/coupons',
          isParent: false,
        },
        {
          text: getTranslation('cuisine'),
          label: getTranslation('cuisine'),
          route: '/management/cuisines',
          isParent: false,
        },
        {
          text: getTranslation('shop_type'),
          label: getTranslation('shop_type'),
          route: '/management/shop-types',
          isParent: false,
        },
        {
          text: getTranslation('banners'),
          label: getTranslation('banners'),
          route: '/management/banners',
          isParent: false,
        },
        {
          text: getTranslation('tipping'),
          label: getTranslation('tipping'),
          route: '/management/tippings',
          isParent: false,
        },
        {
          text: getTranslation('commission_rate'),
          label: getTranslation('commission_rate'),
          route: '/management/commission-rates',
          isParent: false,
        },
        {
          text: getTranslation('notification'),
          label: getTranslation('notification'),
          route: '/management/notifications',
          isParent: false,
        },
      ]),
      shouldShow: function () {
        return this.subMenu ? this.subMenu.length > 0 : false;
      },
    },
    {
      text: getTranslation('wallet'),
      label: getTranslation('wallet'),
      route: '/wallet',
      isParent: true,
      icon: faWallet,
      subMenu: useCheckAllowedRoutes([
        {
          text: getTranslation('transaction_history'),
          label: getTranslation('transaction_history'),
          route: '/wallet/transaction-history',
          isParent: false,
        },
        {
          text: getTranslation('withdrawal_request'),
          label: getTranslation('withdrawal_request'),
          route: '/wallet/withdraw-requests',
          isParent: false,
        },
        {
          text: getTranslation('earnings'),
          label: getTranslation('earnings'),
          route: '/wallet/earnings',
          isParent: false,
        },
      ]),
      shouldShow: function () {
        return this.subMenu ? this.subMenu.length > 0 : false;
      },
    },
    {
      text: getTranslation('Store Settings'),
      route: '/store-settings',
      isParent: true,
      icon: faCog,
      subMenu: [
        {
          text: getTranslation('Categories'),
          route: '/store-settings/category',
          isParent: false,
        },
        {
          text: getTranslation('Options'),
          route: '/store-settings/options',
          isParent: false,
        },
        {
          text:getTranslation('Addons'),
          route: '/store-settings/add-ons',
          isParent: false,
        },
      ],
    },
    {
      label: getTranslation('language_managment'),
      text: getTranslation('language_managment'),
      route: '/language-management',
      isParent: true,
      icon: faGlobe,
      isClickable: true,
    },
    {
      text: getTranslation('customer_support'),
      label: getTranslation('customer_support'),
      route: '/customerSupport',
      icon: faHeadset,
      isClickable: true,
      isParent: true,
    },
  ];

  return (
    <>
      <SuperAdminSidebar>
        <div className="h-[90vh] pb-4 overflow-y-auto overflow-x-hidden pr-2">
          {navBarItems.map((item, index) =>
            item.shouldShow && !item.shouldShow() ? null : (
              <SidebarItem
                key={index}
                expanded={isSuperAdminSidebarVisible}
                {...item}
              />
            )
          )}
        </div>
      </SuperAdminSidebar>
    </>
  );
}
