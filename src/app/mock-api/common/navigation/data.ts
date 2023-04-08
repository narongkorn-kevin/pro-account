/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';
import { AuthService } from 'app/core/auth/auth.service';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        title: 'ผู้จัดการ',
        subtitle: 'เมนูการใช้งานผู้จัดการ',
        type: 'group',
        icon: 'heroicons_outline:user-group',
        hidden: function () {
            return AuthService._Manager;
        },
        children: [
            {
                id: 'g-Admin',
                title: 'จัดการระบบส่วน website',
                type: 'collapsable',
                icon: 'heroicons_outline:home',
                children: [
                    {
                        id: 'clients',
                        title: 'ผู้สนใจ',
                        type: 'basic',
                        icon: 'heroicons_outline:user',
                        link: '/clients/list',
                    },             

                    {
                        id: 'faq',
                        title: 'คำถามพบบ่อย',
                        type: 'basic',
                        icon: 'heroicons_outline:cube',
                        link: '/faq/list',
                    },
                ],


                
            },
            {
                id: 'g-Admin',
                title: 'จัดการระบบส่วนหลังบ้าน',
                type: 'collapsable',
                icon: 'heroicons_outline:home',
                children: [

                    {
                        id: 'customer',
                        title: 'ข้อมูลลูกค้า',
                        type: 'basic',
                        icon: 'mat_solid:people_outline',
                        link: '/customer/list',
                    },
                    {
                        id: 'user',
                        title: 'สมัครสมาชิก',
                        type: 'basic',
                        icon: 'heroicons_outline:user',
                        link: '/user/list',
                    },

                    {
                        id: 'delivery',
                        title: 'ช่องทางการส่งของ',
                        icon: 'feather:truck',
                        type: 'basic',
                        link: '/delivery/list',
                    },
                    
                    {
                        id: 'bank',
                        title: 'ธนาคาร',
                        icon: 'mat_outline:comment_bank',
                        type: 'basic',
                        link: '/bank/list',
                    },
                    {
                        id: 'chat',
                        title: 'กล่องข้อความ',
                        icon: 'heroicons_outline:chat',
                        type: 'basic',
                        link: '/chat/chats',
                    },

                ],


                
            },
            
            // {
            //     id: 'item-all',
            //     title: 'จัดการสินค้า',
            //     // subtitle: 'Admin',
            //     type: 'collapsable',
            //     icon: 'heroicons_outline:cube',
            //     children: [
            //         {
            //             id: 'item',
            //             title: 'สินค้า',
            //             type: 'collapsable',
            //             children: [
            //                 {
            //                     id: 'list',
            //                     title: 'รายการสินค้า',
            //                     type: 'basic',
            //                     link: '/item/list',
            //                 },
            //                 {
            //                     id: 'item-type',
            //                     title: 'หมวดหมู่สินค้า',
            //                     type: 'basic',
            //                     link: '/item-type/list',
            //                 },
            //             ]
            //         },
            //         {
            //             id: 'branch',
            //             title: 'สาขา',
            //             type: 'basic',
            //             link: '/branch/list',
            //         },

            //         {
            //             id: 'location',
            //             title: 'สถานที่',
            //             type: 'basic',
            //             link: '/location/list',
            //         },
            //         {
            //             id: 'warehouse',
            //             title: 'คลังสินค้า',
            //             type: 'basic',
            //             link: '/warehouse/list',
            //         },
            //         {
            //             id: 'vendor',
            //             title: 'ซัพพลายเออร์',
            //             type: 'basic',
            //             link: '/vendor/list',
            //         },

            //     ]
            // },

            // {
            //     id: 'stock',
            //     title: 'ส่วนงานรับ-เบิกสินค้า',
            //     type: 'collapsable',
            //     icon: 'feather:truck',
            //     children: [
            //         {
            //             id: 'deposit',
            //             title: 'รับสินค้าเข้า',
            //             type: 'basic',
            //             link: 'stock/deposit/list'

            //         },
            //         {
            //             id: 'withdraw',
            //             title: 'เบิกสินค้าออก',
            //             type: 'basic',
            //             link: 'stock/withdraw/list'

            //         },
            //     ]
            // },

            // {
            //     id: 'sale-order',
            //     title: 'คำสั่งซื้อ',
            //     type: 'basic',
            //     icon: 'heroicons_outline:shopping-cart',
            //     link: '/sale-order/list',
            // },
            // {
            //     id: 'sale-page',
            //     title: 'เซลล์เพจ',
            //     type: 'collapsable',
            //     icon: 'heroicons_outline:bookmark-alt',
            //     children: [
            //         {
            //             id: 'new-sale-page',
            //             title: 'เพิ่มเซลล์เพจ',
            //             type: 'basic',
            //             link: 'sale-page/new-sale-page'

            //         },
            //         {
            //             id: 'list',
            //             title: 'รายการเซลล์เพจ',
            //             type: 'basic',
            //             link: 'sale-page/list'
            //         },
            //     ]
            // },
        ],
    },

    // {
    //     title: 'ทีมเทเลเซล',
    //     subtitle: 'เมนูการใช้งานทีมเทเลเซล',
    //     type: 'group',
    //     icon: 'heroicons_outline:user-group',
    //     hidden: function () {
    //         return AuthService._Telesale;
    //     },
    //     children: [

    //         {
    //             id: 'worktelesale',
    //             title: 'บันทึกการทำงาน',
    //             type: 'basic',
    //             icon: 'mat_outline:contact_phone',
    //             link: '/worktelesale/list',
    //         },
    //         {
    //             id: 'sale-order',
    //             title: 'คำสั่งซื้อ',
    //             type: 'basic',
    //             icon: 'heroicons_outline:shopping-cart',
    //             link: '/sale-order/list',
    //         },
    //         {
    //             id: 'work-calendar',
    //             title: 'ตารางวันทำงาน',
    //             type: 'basic',
    //             icon: 'heroicons_outline:calendar',
    //             link: '/calendar/telesale-calendar',
    //         },
    //         // {
    //         //     id: 'work',
    //         //     title: 'รายการคำสั่งซื้อ',
    //         //     type: 'basic',
    //         //     icon: 'heroicons_outline:shopping-cart',
    //         //     link: '/user/profile-firstpage',
    //         // },
    //     ]
    // },

    // {
    //     title: 'ทีมยิงแอด',
    //     subtitle: 'เมนูการใช้งานทีมยิงแอด',
    //     type: 'group',
    //     icon: 'heroicons_outline:user-group',
    //     hidden: function () {
    //         return AuthService._Ads; // must be a boolean value
    //     },
    //     children: [
    //         {
    //             id: 'workadmin',
    //             title: 'บันทึกการทำงาน',
    //             type: 'basic',
    //             icon: 'mat_outline:save',
    //             link: '/workads/list',
    //         },
    //         {
    //             id: 'work-calendar',
    //             title: 'ตารางวันทำงาน',
    //             type: 'basic',
    //             icon: 'heroicons_outline:calendar',
    //             link: '/calendar/ads-calendar',
    //         },
    //     ]

    // },

    // {
    //     title: 'ทีมแอดมิน',
    //     subtitle: 'เมนูการใช้งานทีมแอดมิน',
    //     type: 'group',
    //     icon: 'heroicons_outline:user-group',
    //     hidden: function () {
    //         return AuthService._Admin;
    //     },
    //     children: [
    //         {
    //             id: 'workadmin',
    //             title: 'บันทึกการทำงาน',
    //             type: 'basic',
    //             icon: 'mat_outline:save',
    //             link: '/workadmin/list',
    //         },
    //         {
    //             id: 'sale-order',
    //             title: 'คำสั่งซื้อ',
    //             type: 'basic',
    //             icon: 'heroicons_outline:shopping-cart',
    //             link: '/sale-order/list',
    //         },
    //         {
    //             id: 'customer',
    //             title: 'ลูกค้า',
    //             type: 'basic',
    //             icon: 'people',
    //             link: '/customer/list',
    //         },
    //         {
    //             id: 'work-calendar',
    //             title: 'ตารางวันทำงาน',
    //             type: 'basic',
    //             icon: 'heroicons_outline:calendar',
    //             link: '/calendar/admin-calendar',
    //         },
    //     ]
    // },

    // {
    //     title: 'ทีมแพ็คสินค้า',
    //     subtitle: 'เมนูการใช้งานทีมแพ็คสินค้า',
    //     type: 'group',
    //     hidden: function () {
    //         return AuthService._Packing;
    //     },
    //     icon: 'heroicons_outline:user-group',
    //     children: [
    //         {
    //             id: 'workpacking',
    //             title: 'บันทึกการทำงาน',
    //             type: 'basic',
    //             icon: 'mat_outline:save',
    //             link: '/item-return/list',
    //         },
    //         {
    //             id: 'work-calendar',
    //             title: 'ตารางวันทำงาน',
    //             type: 'basic',
    //             icon: 'heroicons_outline:calendar',
    //             link: '/calendar/pack-calendar',
    //         },
    //     ]

    // },

    {
        title: 'ตัวแทน',
        subtitle: 'เมนูการใช้งานตัวแทน',
        type: 'group',
        icon: 'heroicons_outline:home',
        hidden: function () {
            return AuthService._Hr;
        },
        children: [
            {
                id: 'position',
                title: 'แม่ค้า',
                type: 'basic',
                icon: 'heroicons_outline:user',
                link: '/position/list',
            },
            {
                id: 'bank',
                title: 'ธนาคาร',
                icon: 'mat_outline:comment_bank',
                type: 'basic',
                link: '/bank-user/list',
            },
            // {
            //     id: 'position',
            //     title: 'เช็คยอดขาย',
            //     type: 'basic',

            //     link: '/user/profile-firstpage',
            // },
            {
                id: 'position',
                title: 'ตรวจสอบยอดตัวแทน',
                type: 'basic',
                icon: 'feather:zoom-in',
                link: '/user/profile-firstpage',
            },
            // {
            //     id: 'position',
            //     title: 'เช็คข้อมูลเจาะจงแม่ค้า',
            //     type: 'collapsable',

            //     link: '/position/list',

            //     children: [
            //                 {
            //                     id: 'workpacking',
            //                     title: 'แม่ค้า',
            //                     type: 'basic',
            //                     icon: 'mat_outline:save',
            //                     link: '/item-return/list',
            //                 },

            //             ]
            // },

            // {
            //     title: 'การทำงาน',
            //     type: 'collapsable',
            //     icon: 'heroicons_outline:currency-dollar',
            //     children: [
            //         {
            //             id: 'work-calendar',
            //             title: 'ตารางวันทำงาน',
            //             type: 'basic',
            //             icon: 'heroicons_outline:calendar',
            //             link: '/calendar/new-calendar',
            //         },

            //         {
            //             id: 'worktime',
            //             title: 'เวลาการทำงาน',
            //             type: 'basic',
            //             icon: 'mat_solid:access_time',
            //             link: '/worktime/list',
            //         },
            //     ]
            // },

            // {
            //     title: 'การลา',
            //     type: 'collapsable',
            //     icon: 'mat_solid:pregnant_woman',
            //     children: [
            //         {
            //             id: 'leavelist',
            //             title: 'รายการลา',
            //             type: 'basic',
            //             link: '/leave-list/list',
            //         },
            //         {
            //             id: 'leave',
            //             title: 'สิทธิการลา',
            //             type: 'basic',
            //             link: '/leave/list',
            //         },
            //         {
            //             id: 'leavetype',
            //             title: 'ประเภทการลา',
            //             type: 'basic',
            //             link: '/leave-type/list',
            //         },
            //     ]
            // },

            // {
            //     title: 'เงินเดือน',
            //     type: 'collapsable',
            //     icon: 'attach_money',
            //     children: [
            //         {
            //             id: 'salary',
            //             title: 'รายการ',
            //             type: 'basic',
            //             icon: 'heroicons_solid:menu',
            //             link: '/salary/list',
            //         },
            //         {
            //             title: 'เงินหัก',
            //             type: 'collapsable',
            //             icon: 'attach_money',
            //             children: [
            //                 {
            //                     id: 'deletemoney-type',
            //                     title: 'รายการเงินหัก',
            //                     type: 'basic',
            //                     link: '/deletemoney/list',
            //                 },

            //                 {
            //                     id: 'deletemoney-type',
            //                     title: 'ประเภทเงินหัก',
            //                     type: 'basic',
            //                     link: '/deletemoney-type/list',
            //                 },
            //             ]
            //         },

            //         {
            //             title: 'เงินเพิ่ม',
            //             type: 'collapsable',
            //             icon: 'heroicons_outline:currency-dollar',
            //             children: [
            //                 {
            //                     id: 'plusmoney',
            //                     title: 'รายการเงินเพิ่ม',
            //                     type: 'basic',
            //                     link: '/plusmoney/list',
            //                 },

            //                 {
            //                     id: 'plusmoney-type',
            //                     title: 'ประเภทเงินเพิ่ม',
            //                     type: 'basic',
            //                     link: '/plusmoney-type/list',
            //                 },
            //             ]
            //         },
            //         {
            //             id: 'commission',
            //             title: 'คอมมิชชั่น',
            //             type: 'basic',
            //             icon: 'feather:percent',
            //             link: '/commission/list',
            //         },

            //         {
            //             id: 'ot',
            //             title: 'โอที',
            //             type: 'basic',
            //             icon: 'access_time_filled',
            //             link: '/ot/list',
            //         },

            //     ]
            // },
        ],
    },

    {
        title: 'แม่ค้า',
        subtitle: 'เมนูการใช้งานแม่ค้า',
        type: 'group',
        icon: 'heroicons_outline:home',
        hidden: function () {
            return AuthService._Hr;
        },
        children: [
            // {
            //     id: 'position',
            //     title: 'ตั้งค่าข้อมูลส่วนตัว',
            //     type: 'basic',

            //     link: '/user/profile-firstpage',
            // },

            {
                id: 'position',
                title: 'ตั้งค่าข้อมูลสินค้า',
                type: 'collapsable',
                icon: 'heroicons_outline:cube',
                children: [
                    {
                        id: 'list',
                        title: 'รายการสินค้า',
                        type: 'basic',
                        link: '/item/list',
                    },
                    {
                        id: 'item-type',
                        title: 'หมวดหมู่สินค้า',
                        type: 'basic',
                        link: '/item-type/list',
                    },
                ],
            },
            {
                id: 'position',
                title: 'ตรวจสอบคำสั่งซื้อ',
                type: 'basic',
                icon: 'mat_outline:shopping_basket',
                link: '/sale-order/list',
            },
            {
                id: 'customer',
                title: 'ข้อมูลลูกค้า',
                type: 'basic',
                link: '/customer/list',
                icon: 'mat_solid:people_outline',
            },
            {
                id: 'position',
                title: 'ตรวจสอบสถานะ',
                type: 'basic',
                icon: 'heroicons_outline:truck',

                link: '/item-return/list',
            },
            {
                id: 'position',
                title: 'ตรวจสอบยอดขาย',
                type: 'basic',
                icon: 'mat_outline:auto_graph',
                link: '/home/list',
            },
            {
                id: 'bank',
                title: 'ธนาคาร',
                icon: 'mat_outline:comment_bank',
                type: 'basic',
                link: '/bank-user/list',
            },
            // {
            //     id: 'position',
            //     title: 'ตั้งค่า live สดสินค้า',
            //     type: 'basic',

            //     link: '/position/list',
            // },
            {
                id: 'position',
                title: 'เช็คยอดเงิน',
                type: 'collapsable',
                icon: 'mat_outline:attach_money',
                link: '/position/list',

                children: [
                    {
                        id: 'workpacking',
                        title: 'กระเป๋าเงิน',
                        type: 'basic',
                        icon: 'mat_outline:money',
                        // link: '/item-return/list',
                    },
                ],
            },
        ],
    },

    // {
    //     id: 'report',
    //     title: 'รายงาน',
    //     type: 'collapsable',
    //     icon: 'mat_solid:event_note',
    //     hidden: function () {
    //         return AuthService._Report;
    //     },
    //     children: [
    //         {
    //             title: 'สินค้า-คำสั่งซื้อ',
    //             type: 'collapsable',
    //             icon: 'notes',
    //             children: [

    //         {
    //             id: 'report-stock-item',
    //             title: 'รายงาน รับเข้า-เบิกออก',
    //             type: 'basic',
    //             link: '/report/stock-item/list',
    //         },
    //         {
    //             id: 'report-item-location',
    //             title: 'รายงานสินค้าตามสถานที่',
    //             type: 'basic',
    //             link: '/report/item-location/list',
    //         },
    //         {
    //             id: 'report-item_type',
    //             title: 'รายงานสินค้าตามประเภทสินค้า',
    //             type: 'basic',
    //             link: '/report/item-type/list'
    //         },
    //         {
    //             id: 'report-item',
    //             title: 'รายงานสินค้าทั้งหมด',
    //             type: 'basic',
    //             link: '/report/item/list'
    //         },
    //         {
    //             id: 'report-sale-order',
    //             title: 'รายงานคำสั่งซื้อ',
    //             type: 'basic',
    //             link: '/report/sale-order/list'
    //         },
    //             ]

    //         },
    //         {
    //             title: 'พนักงาน',
    //             type: 'collapsable',
    //             icon: 'notes',
    //             children: [

    //         {
    //             id: 'report-stock-item',
    //             title: 'รายงานการทำงาน',
    //             type: 'basic',
    //             // link: '/report/stock-item/list',
    //         },

    //         {
    //             id: 'report-stock-item',
    //             title: 'รายงานเงินเดือน',
    //             type: 'basic',
    //             // link: '/report/stock-item/list',
    //         },
    //             ]
    //         },

    //         {
    //             title: 'ลูกค้า',
    //             type: 'collapsable',
    //             icon: 'notes',
    //             children: [

    //         {
    //             id: 'report-stock-item',
    //             title: 'รายงานลูกค้า',
    //             type: 'basic',
    //             // link: '/report/stock-item/list',
    //         },

    //             ]
    //         },

    //     ]

    // },

    {
        id: 'account',
        title: 'บัญชีผู้ใช้',
        type: 'group',
        hidden: function () {
            return AuthService._Profile;
        },
        icon: 'heroicons_outline:home',
        children: [
            // {
            //     id: 'settings',
            //     title: 'โปรไฟล์',
            //     type: 'basic',
            //     icon: 'feather:user',
            //     link: '/user/profile',
            // },
            {
                id: 'user-signout',
                title: 'ออกจากระบบ',
                type: 'basic',
                icon: 'feather:log-out',
                link: '/sign-out',
            },
        ],
    },
];

export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        tooltip: 'Dashboards',
        type: 'aside',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        tooltip: 'Apps',
        type: 'aside',
        icon: 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        tooltip: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        tooltip: 'UI',
        type: 'aside',
        icon: 'heroicons_outline:collection',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation',
        tooltip: 'Navigation',
        type: 'aside',
        icon: 'heroicons_outline:menu',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'DASHBOARDS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'APPS',
        type: 'group',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'others',
        title: 'OTHERS',
        type: 'group',
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'aside',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'User Interface',
        type: 'aside',
        icon: 'heroicons_outline:collection',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Navigation Features',
        type: 'aside',
        icon: 'heroicons_outline:menu',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'dashboards',
        title: 'Dashboards',
        type: 'group',
        icon: 'heroicons_outline:home',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'apps',
        title: 'Apps',
        type: 'group',
        icon: 'heroicons_outline:qrcode',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'pages',
        title: 'Pages',
        type: 'group',
        icon: 'heroicons_outline:document-duplicate',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'user-interface',
        title: 'UI',
        type: 'group',
        icon: 'heroicons_outline:collection',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
    {
        id: 'navigation-features',
        title: 'Misc',
        type: 'group',
        icon: 'heroicons_outline:menu',
        children: [], // This will be filled from defaultNavigation so we don't have to manage multiple sets of the same navigation
    },
];
