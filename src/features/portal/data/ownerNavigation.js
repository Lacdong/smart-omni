export const ownerScreens = [
  ['subscription', 'Subscription', '3.8, 3.15'], ['invoices', 'Invoices', '3.9, 3.10'], ['payments', 'Payment history', '3.12'],
  ['shops', 'Shop connections', '3.11, 3.13'], ['shop-alerts', 'Connection alerts', '3.14'],
  ['customers', 'Loyalty customers', '3.16'], ['vouchers', 'Issue vouchers', '3.17'], ['voucher-results', 'Voucher results', '3.18'],
  ['sales-events', 'Sales events', '3.19'], ['forecasts', 'Demand forecasts', '3.20'],
  ['costs', 'Business costs', '3.23'], ['profit', 'Profit', '3.24'], ['advisor', 'AI advisor', '3.25'], ['strategy', 'Strategic advice', '3.26'], ['logs', 'Activity & security', '3.27'],
]
export const ownerNavigationGroups = [
  ['subscription', 'Subscription', ['subscription', 'invoices', 'payments']], ['shops', 'Shop connections', ['shops', 'shop-alerts']],
  ['customers', 'Loyalty & vouchers', ['customers', 'vouchers', 'voucher-results']], ['sales-events', 'Sales planning', ['sales-events', 'forecasts']],
  ['costs', 'Business finance', ['costs', 'profit']], ['advisor', 'AI advisor', ['advisor', 'strategy']], ['logs', 'Activity & security', ['logs']],
]
