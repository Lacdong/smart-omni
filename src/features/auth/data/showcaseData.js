import { landingPreviewFixture } from '@/features/landing/data/previewData'

// Local marketing samples shared with the landing page, never live shop data.
export const showcaseData = {
  products: landingPreviewFixture.products.slice(0, 2),
  inventory: landingPreviewFixture.inventory[0],
  order: landingPreviewFixture.orders[0],
}
