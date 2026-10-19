import { expect, test } from '@playwright/test'

const store = '/store/everyday-studio'
const sale = `${store}/flash-sale`

test('flash sale is reachable, shows five columns and supports categories and sort', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.setViewportSize({ width: 1440, height: 1000 })
  await page.goto(store)
  await page.getByRole('region', { name: 'Flash Deals', exact: true }).getByRole('link', { name: 'See all deals' }).click()
  await expect(page).toHaveURL(sale)
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('FLASH SALE')
  const grid = page.getByRole('region', { name: 'Sale products', exact: true })
  await expect(grid.getByRole('article')).toHaveCount(14)
  expect(await grid.evaluate(element => getComputedStyle(element).gridTemplateColumns.split(' ').length)).toBe(5)
  await page.getByRole('group', { name: 'Sale categories' }).getByRole('button', { name: 'Watches', exact: true }).click()
  await expect(grid.getByRole('article')).toHaveCount(1)
  await expect(grid).toContainText('Classic Analog Watch')
  await page.reload()
  await expect(grid.getByRole('article')).toHaveCount(1)
  await page.getByRole('group', { name: 'Sale categories' }).getByRole('button', { name: 'All', exact: true }).click()
  await page.getByRole('button', { name: 'Sort deals' }).click()
  await page.getByRole('menuitem', { name: 'Price: low to high' }).click()
  await expect(grid.getByRole('article').first()).toContainText('Ceramic Coffee Cup')
  await page.getByRole('group', { name: 'Flash sale sessions' }).getByRole('button', { name: /12:00/ }).click()
  await expect(page).toHaveURL(/session=12/)
  await page.getByRole('button', { name: 'Remind me', exact: true }).first().click()
  await expect(page.getByRole('button', { name: 'Saved', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.getByRole('group', { name: 'Flash sale sessions' }).getByRole('button', { name: /Now/ }).click()
  await grid.getByRole('link', { name: /Shop now/ }).first().click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Ceramic Coffee Cup')
  expect(errors).toEqual([])
})

for (const width of [320, 375, 768, 1024, 1440]) {
  test(`sale fits and remains usable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto(sale)
    const heading = page.getByRole('heading', { level: 1 })
    await expect(heading).toHaveText('FLASH SALE')
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole('button', { name: 'Sort deals' }).click()
    await page.getByRole('menuitem', { name: 'Price: high to low' }).click()
    await expect(page.getByRole('region', { name: 'Sale products' }).getByRole('article').first()).toContainText('Modern Accent Chair')
    if (width === 1440 || width === 375) {
      await page.locator('header').first().scrollIntoViewIfNeeded()
      await page.screenshot({ path: `artifacts/flash-sale/page-${width}.png`, fullPage: true })
    }
  })
}
