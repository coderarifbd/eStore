// Realistic initial demo data for Bangladeshi Electrical Store
export const INITIAL_CATEGORIES = [
  { id: 'cat_cables', nameBn: 'তার ও ক্যাবল (Wires & Cables)', nameEn: 'Wires & Cables', icon: 'Zap' },
  { id: 'cat_lights', nameBn: 'এলইড লাইট ও বাল্ব (LED Lights & Bulbs)', nameEn: 'LED Lights & Bulbs', icon: 'Lightbulb' },
  { id: 'cat_switches', nameBn: 'সুইচ, সকেট ও বোর্ড (Switches & Sockets)', nameEn: 'Switches & Sockets', icon: 'ToggleRight' },
  { id: 'cat_breakers', nameBn: 'সার্কিট ব্রেকার ও নিরাপত্তা (Circuit Breakers)', nameEn: 'ShieldAlert' },
  { id: 'cat_fans', nameBn: 'ফ্যান ও রেগুলেটর (Fans & Regulators)', nameEn: 'Fans & Regulators', icon: 'Fan' },
  { id: 'cat_pipes', nameBn: 'পিভিসি পাইপ ও ফিটিংস (PVC Conduit Pipes)', nameEn: 'PVC Conduit Pipes', icon: 'Box' }
];

export const INITIAL_BRANDS = [
  'BRB Cables', 'Eastern Cables', 'BBS Cables', 'Super Star', 'Click', 'Walton', 'Transtec', 'Schneider Electric', 'Havells', 'National PVC'
];

export const INITIAL_PRODUCTS = [
  {
    id: 'prod_1',
    nameBn: 'বিআরবি সিঙ্গেল কোর ক্যাবল (BYA)',
    nameEn: 'BRB Single Core Cable (BYA)',
    categoryId: 'cat_cables',
    brand: 'BRB Cables',
    unit: 'Coil',
    variants: [
      { id: 'v_1_1', spec: '1.0 rm', sku: 'BRB-BYA-1.0', purchasePrice: 1650, sellingPrice: 1950, stock: 18, reorderLevel: 5 },
      { id: 'v_1_2', spec: '1.5 rm', sku: 'BRB-BYA-1.5', purchasePrice: 2350, sellingPrice: 2750, stock: 24, reorderLevel: 5 },
      { id: 'v_1_3', spec: '2.5 rm', sku: 'BRB-BYA-2.5', purchasePrice: 3800, sellingPrice: 4400, stock: 12, reorderLevel: 4 },
      { id: 'v_1_4', spec: '4.0 rm', sku: 'BRB-BYA-4.0', purchasePrice: 5900, sellingPrice: 6800, stock: 3, reorderLevel: 5 } // Low stock!
    ]
  },
  {
    id: 'prod_2',
    nameBn: 'সুপার স্টার এলইড টি লাইট / বাল্ব',
    nameEn: 'Super Star LED Bulb',
    categoryId: 'cat_lights',
    brand: 'Super Star',
    unit: 'Pcs',
    variants: [
      { id: 'v_2_1', spec: '3 Watt (Cool Daylight)', sku: 'SS-LED-3W', purchasePrice: 110, sellingPrice: 150, stock: 45, reorderLevel: 10 },
      { id: 'v_2_2', spec: '7 Watt (Cool Daylight)', sku: 'SS-LED-7W', purchasePrice: 160, sellingPrice: 220, stock: 60, reorderLevel: 10 },
      { id: 'v_2_3', spec: '12 Watt (Cool Daylight)', sku: 'SS-LED-12W', purchasePrice: 240, sellingPrice: 320, stock: 30, reorderLevel: 10 },
      { id: 'v_2_4', spec: '18 Watt (Warm Light)', sku: 'SS-LED-18W', purchasePrice: 380, sellingPrice: 490, stock: 15, reorderLevel: 5 }
    ]
  },
  {
    id: 'prod_3',
    nameBn: 'ওয়ালটন এলইড সারফেস ডাউনলাইট',
    nameEn: 'Walton LED Surface Downlight',
    categoryId: 'cat_lights',
    brand: 'Walton',
    unit: 'Pcs',
    variants: [
      { id: 'v_3_1', spec: '6 Watt Round White', sku: 'WLT-DL-6W', purchasePrice: 210, sellingPrice: 290, stock: 25, reorderLevel: 8 },
      { id: 'v_3_2', spec: '12 Watt Round White', sku: 'WLT-DL-12W', purchasePrice: 340, sellingPrice: 450, stock: 2, reorderLevel: 5 } // Low stock
    ]
  },
  {
    id: 'prod_4',
    nameBn: 'সুপার স্টার গ্যাং সুইচ ও সকেট সিরিজ',
    nameEn: 'Super Star Gang Switch & Socket',
    categoryId: 'cat_switches',
    brand: 'Super Star',
    unit: 'Pcs',
    variants: [
      { id: 'v_4_1', spec: '1-Gang Switch', sku: 'SS-SW-1G', purchasePrice: 75, sellingPrice: 115, stock: 80, reorderLevel: 15 },
      { id: 'v_4_2', spec: '2-Gang Switch', sku: 'SS-SW-2G', purchasePrice: 115, sellingPrice: 165, stock: 65, reorderLevel: 15 },
      { id: 'v_4_3', spec: '3-Gang Switch', sku: 'SS-SW-3G', purchasePrice: 155, sellingPrice: 220, stock: 40, reorderLevel: 10 },
      { id: 'v_4_4', spec: '2-Pin Multi Socket with Switch', sku: 'SS-SOC-2P', purchasePrice: 140, sellingPrice: 195, stock: 50, reorderLevel: 10 },
      { id: 'v_4_5', spec: 'Fan Dimmer Deluxe', sku: 'SS-DIM-DLX', purchasePrice: 180, sellingPrice: 260, stock: 28, reorderLevel: 8 }
    ]
  },
  {
    id: 'prod_5',
    nameBn: 'স্নাইডিয়ার এসপি সিঙ্গেল পোল এমসিবি (MCB)',
    nameEn: 'Schneider Single Pole MCB Circuit Breaker',
    categoryId: 'cat_breakers',
    brand: 'Schneider Electric',
    unit: 'Pcs',
    variants: [
      { id: 'v_5_1', spec: '6 Ampere (SP 6A)', sku: 'SCH-MCB-6A', purchasePrice: 280, sellingPrice: 380, stock: 20, reorderLevel: 5 },
      { id: 'v_5_2', spec: '16 Ampere (SP 16A)', sku: 'SCH-MCB-16A', purchasePrice: 290, sellingPrice: 390, stock: 35, reorderLevel: 5 },
      { id: 'v_5_3', spec: '32 Ampere (SP 32A)', sku: 'SCH-MCB-32A', purchasePrice: 320, sellingPrice: 440, stock: 18, reorderLevel: 5 },
      { id: 'v_5_4', spec: 'Double Pole 63A Main Switch', sku: 'SCH-MCB-DP63', purchasePrice: 850, sellingPrice: 1150, stock: 8, reorderLevel: 3 }
    ]
  },
  {
    id: 'prod_6',
    nameBn: 'বিআরবি ৪.০ আরএম ২-কোর ফ্লেক্সিবল ক্যাবল',
    nameEn: 'BRB 2-Core Flexible Cable',
    categoryId: 'cat_cables',
    brand: 'BRB Cables',
    unit: 'Meter',
    variants: [
      { id: 'v_6_1', spec: '2x1.5 Twin Core White', sku: 'BRB-FLX-2x1.5', purchasePrice: 48, sellingPrice: 65, stock: 220, reorderLevel: 30 },
      { id: 'v_6_2', spec: '2x2.5 Twin Core White', sku: 'BRB-FLX-2x2.5', purchasePrice: 78, sellingPrice: 105, stock: 150, reorderLevel: 30 }
    ]
  }
];

export const INITIAL_SUPPLIERS = [
  { id: 'sup_1', name: 'মেসার্স বিআরবি ক্যাবলস এজেন্সি (M/S BRB Agency)', phone: '01711-000111', address: 'নবাবপুর, ঢাকা', balanceDue: 12500 },
  { id: 'sup_2', name: 'সুপার স্টার ইলেকট্রনিক্স লিমিটেড', phone: '01819-222333', address: 'স্টেডিয়াম মার্কেট, ঢাকা', balanceDue: 0 },
  { id: 'sup_3', name: 'ওয়ালটন ইলেকট্রিক্যাল ডিস্ট্রিবিউটর', phone: '01912-333444', address: 'মালিবাগ, ঢাকা', balanceDue: 4500 }
];

export const INITIAL_EMPLOYEES = [
  { id: 'emp_1', name: 'মোঃ রফিকুল ইসলাম', phone: '01712-445566', designation: 'সিনিয়র সেলস এক্সিকিউটিভ', monthlySalary: 18000, joinDate: '2025-01-10', status: 'Active' },
  { id: 'emp_2', name: 'আব্দুল করিম', phone: '01815-778899', designation: 'দোকান সহকারী ও হেলপার', monthlySalary: 11000, joinDate: '2025-03-01', status: 'Active' }
];

export const INITIAL_SALARY_TRANSACTIONS = [
  { id: 'sal_101', employeeId: 'emp_1', employeeName: 'মোঃ রফিকুল ইসলাম', monthYear: '2026-06', type: 'Advance', amount: 3000, date: '2026-06-15', notes: 'ঈদের কেনাকাটার জন্য অগ্রিম' },
  { id: 'sal_102', employeeId: 'emp_1', employeeName: 'মোঃ রফিকুল ইসলাম', monthYear: '2026-06', type: 'Salary Payment', amount: 15000, date: '2026-07-01', notes: 'জুন মাসের অবশিষ্ট বেতন পরিশোধ' },
  { id: 'sal_103', employeeId: 'emp_2', employeeName: 'আব্দুল করিম', monthYear: '2026-06', type: 'Salary Payment', amount: 11000, date: '2026-07-02', notes: 'জুন মাসের পূর্ণ বেতন পরিশোধ' }
];

export const INITIAL_EXPENSES = [
  { id: 'exp_1', category: 'দোকান ভাড়া (Shop Rent)', amount: 15000, date: '2026-07-01', notes: 'জুলাই মাসের দোকান ভাড়া', paidBy: 'ক্যাশ' },
  { id: 'exp_2', category: 'বিদ্যুৎ বিল (Electricity Bill)', amount: 2850, date: '2026-07-05', notes: 'জুন মাসের ডেসকো বিদ্যুৎ বিল', paidBy: 'bKash' },
  { id: 'exp_3', category: 'চা-নাস্তা ও স্ন্যাক্স (Tea & Snacks)', amount: 450, date: '2026-07-28', notes: 'কাস্টমার ও দোকানের চা খরচ', paidBy: 'ক্যাশ' },
  { id: 'exp_4', category: 'পরিবহন খরচ (Transport)', amount: 1200, date: '2026-07-25', notes: 'নবাবপুর থেকে মালামাল আনয়ন ভাড়া', paidBy: 'ক্যাশ' }
];

export const INITIAL_SALES = [
  {
    id: 'INV-2026-001',
    date: '2026-07-28 11:30 AM',
    customerName: 'ইঞ্জিনিয়ার কামরুল হাসান',
    customerPhone: '01715-998877',
    items: [
      { productId: 'prod_1', productName: 'বিআরবি সিঙ্গেল কোর ক্যাবল (BYA)', spec: '2.5 rm', unit: 'Coil', quantity: 2, unitPrice: 4400, costPrice: 3800, totalPrice: 8800 },
      { productId: 'prod_4', productName: 'সুপার স্টার গ্যাং সুইচ ও সকেট সিরিজ', spec: '2-Gang Switch', unit: 'Pcs', quantity: 10, unitPrice: 165, costPrice: 115, totalPrice: 1650 }
    ],
    subtotal: 10450,
    discount: 250,
    grandTotal: 10200,
    paidAmount: 10200,
    dueAmount: 0,
    paymentMethod: 'Cash',
    totalCostPrice: 8750,
    profit: 1450
  },
  {
    id: 'INV-2026-002',
    date: '2026-07-29 02:15 PM',
    customerName: 'আল-আমীন ইলেকট্রিক কন্ট্রাক্টর',
    customerPhone: '01811-332211',
    items: [
      { productId: 'prod_2', productName: 'সুপার স্টার এলইড টি লাইট / বাল্ব', spec: '12 Watt (Cool Daylight)', unit: 'Pcs', quantity: 5, unitPrice: 320, costPrice: 240, totalPrice: 1600 },
      { productId: 'prod_5', productName: 'স্নাইডিয়ার এসপি সিঙ্গেল পোল এমসিবি (MCB)', spec: '16 Ampere (SP 16A)', unit: 'Pcs', quantity: 4, unitPrice: 390, costPrice: 290, totalPrice: 1560 }
    ],
    subtotal: 3160,
    discount: 60,
    grandTotal: 3100,
    paidAmount: 2000,
    dueAmount: 1100,
    paymentMethod: 'bKash + Due',
    totalCostPrice: 2360,
    profit: 740
  }
];

export const INITIAL_PURCHASE_VOUCHERS = [
  {
    id: 'VOUCH-2026-101',
    date: '2026-07-20',
    supplierId: 'sup_1',
    supplierName: 'মেসার্স বিআরবি ক্যাবলস এজেন্সি (M/S BRB Agency)',
    items: [
      { productId: 'prod_1', spec: '1.5 rm', productName: 'বিআরবি সিঙ্গেল কোর ক্যাবল (BYA)', quantity: 10, unitPrice: 2350, totalPrice: 23500 },
      { productId: 'prod_1', spec: '2.5 rm', productName: 'বিআরবি সিঙ্গেল কোর ক্যাবল (BYA)', quantity: 5, unitPrice: 3800, totalPrice: 19000 }
    ],
    grandTotal: 42500,
    paidAmount: 30000,
    dueAmount: 12500,
    notes: 'নবাবপুর মেইন শোরুম থেকে ক্যাবল স্টক ক্রয়'
  }
];
