import { products, lowestPrice } from './catalog'

// Illustrative sale metadata for the sample storefront, not live marketplace promotions.
export const saleProducts = products.map((product, index) => {
  const discount = [44, 50, 40, 38, 50, 40, 50, 40, 40, 50, 40, 45, 43, 33][index]
  const price = lowestPrice(product)
  return { ...product, price, discount, original: Math.round(price / (1 - discount / 100) / 1000) * 1000, sold: [1200, 856, 2300, 647, 1500, 980][index % 6], progress: [79, 62, 86, 45, 71, 56][index % 6], rating: index % 3 === 0 ? '4.9' : '4.8', location: ['Ho Chi Minh City', 'Hanoi', 'Da Nang'][index % 3] }
})
