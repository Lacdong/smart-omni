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
// Discovery categories mirror the Shopiz reference; existing deep links remain supported.
export const discoveryCategories = [
  ['womens-fashion', 'Women’s Fashion'], ['mens-fashion', 'Men’s Fashion'], ['beauty', 'Beauty & Skincare'], ['gadgets', 'Mobile & Gadgets'], ['home', 'Home & Living'], ['electronics', 'Electronics'], ['accessories', 'Bags & Accessories'], ['shoes', 'Shoes'], ['watches', 'Watches'], ['sports', 'Sports & Outdoors'], ['health', 'Health & Wellness'], ['toys', 'Baby & Toys'], ['groceries', 'Groceries'], ['books', 'Books & Stationery'], ['pets', 'Pet Supplies'], ['automotive', 'Automotive'], ['jewelry', 'Jewelry'], ['travel', 'Travel & Luggage'], ['gaming', 'Gaming'], ['all', 'More Categories'],
].map(([id, name]) => ({ id, name }))
const discoveryGroups = { home: ['lighting'], electronics: ['audio', 'workspace'], gadgets: ['workspace'], accessories: ['everyday'], gaming: ['workspace'] }
export const matchesCategory = (product, category) => category === 'all' || product.category === category || product.subcategory === category || discoveryGroups[category]?.includes(product.category)

// Additional illustrative merchandise for the reference's seven-column discovery grid.
const additionalFinds = [
  ['canvas-backpack', 'Canvas Backpack', 'travel', 'photo-1553062407-98eeb64c6a62', 390000],
  ['classic-watch', 'Classic Analog Watch', 'watches', 'photo-1524805444758-089113d48a6d', 990000],
  ['court-sneakers', 'Classic Court Sneakers', 'shoes', 'photo-1549298916-b41d501d3772', 890000],
  ['ceramic-cup', 'Ceramic Coffee Cup', 'home', 'photo-1514228742587-6b1558fcca3d', 190000],
  ['cotton-tee', 'Everyday Cotton Tee', 'mens-fashion', 'photo-1521572163474-6864f9cf17ab', 290000],
  ['shoulder-bag', 'Leather Shoulder Bag', 'accessories', 'photo-1548036328-c9fa89d128fa', 790000],
  ['running-shoes', 'Everyday Running Shoes', 'sports', 'photo-1542291026-7eec264c27ff', 1190000],
  ['accent-chair', 'Modern Accent Chair', 'home', 'photo-1598300042247-d088f8ab3a91', 1890000],
]
products.push(...additionalFinds.map(([id, name, category, photo, price], index) => ({ id, name, category, image: `https://images.unsplash.com/${photo}?auto=format&fit=crop&w=600&q=85`, description: 'A considered find for your everyday. Sample catalog item; compare available marketplace offers.', variants: [variant(`${id.toUpperCase()}-STD`, 'Original', price)], demoDeal: index < 3 })))
export const flashDeals = [...products.slice(0, 3), ...products.filter(product => product.demoDeal)]

export const colourOptions = [...new Set(products.flatMap(product => product.variants.map(item => item.colour)))]
