// Public, illustrative catalog fixtures. No marketplace authentication or private merchant data.
export const demoStore = { slug: 'everyday-studio', name: 'SmartOmni Storefront', description: 'Considered essentials for your space and your everyday.' }
export const categories = [
  { id: 'workspace', name: 'Workspace', children: [{ id: 'mice', name: 'Mice' }, { id: 'keyboards', name: 'Keyboards' }] },
  { id: 'audio', name: 'Audio', children: [{ id: 'headphones', name: 'Headphones' }] },
  { id: 'lighting', name: 'Lighting', children: [{ id: 'desk-lights', name: 'Desk lights' }] },
  { id: 'everyday', name: 'Everyday', children: [{ id: 'bags', name: 'Bags & carry' }] },
]
export const formatPrice = amount => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(amount)
const variant = (sku, colour, price, channels = ['shopee', 'tiktok'], available = true) => ({
  sku, colour, offers: channels.map((channel, index) => ({ channel, price: price + (channels.length > 1 && index === 0 ? 40000 : 0), available, listingUrl: null })),
})
export const products = [
  { id: 'wireless-mouse', name: 'Wireless Mouse', category: 'workspace', subcategory: 'mice', image: '/images/storefront/wireless-mouse.png', imageMode: 'contain', description: 'An understated addition to your everyday workspace. Choose your colour to compare available offers.', badge: 'Two colours', variants: [variant('WM-WHT', 'White', 450000), variant('WM-BLK', 'Black', 470000)] },
  { id: 'studio-headphones', name: 'Studio Headphones', category: 'audio', subcategory: 'headphones', image: '/images/product/headphone.png', description: 'A simple, considered shape for your listening space.', variants: [variant('SH-SND', 'Sand', 1290000), variant('SH-BLK', 'Black', 1350000)] },
  { id: 'desk-light', name: 'Slim Desk Light', category: 'lighting', subcategory: 'desk-lights', image: '/images/storefront/desk-lamp.jpg', description: 'A slender reading light for the quieter corners of your workspace.', variants: [variant('DL-WHT', 'White', 790000)] },
  { id: 'mechanical-keyboard', name: 'Mechanical Keyboard', category: 'workspace', subcategory: 'keyboards', image: '/images/product/keyboard.png', description: 'A compact keyboard to complete your everyday desk setup.', badge: 'One marketplace', variants: [variant('MK-CLD', 'Cloud', 890000, ['shopee'])] },
  { id: 'everyday-tote', name: 'Everyday Tote', category: 'everyday', subcategory: 'bags', image: '/images/product/tote.png', description: 'A simple carry-all for the things you take along.', variants: [variant('ET-NAT', 'Natural', 320000, ['tiktok']), variant('ET-OLV', 'Olive', 340000, ['tiktok'])] },
  { id: 'cone-desk-light', name: 'Cone Desk Light', category: 'lighting', subcategory: 'desk-lights', image: '/images/storefront/cone-lamp.jpg', description: 'A sculptural desk light with a quiet, monochrome silhouette.', variants: [variant('CDL-BLK', 'Black', 650000), variant('CDL-WHT', 'White', 650000, ['shopee'], false)] },
]
export const lowestPrice = product => {
  const prices = product.variants.flatMap(item => item.offers.filter(offer => offer.available).map(offer => offer.price))
  return prices.length ? Math.min(...prices) : null
}
export const colourOptions = [...new Set(products.flatMap(product => product.variants.map(item => item.colour)))]
