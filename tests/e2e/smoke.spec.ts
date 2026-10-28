import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Tanpa animasi: axe membaca keadaan akhir, bukan elemen yang sedang fade-in (kontras palsu).
test.use({ reducedMotion: 'reduce' });

test('halaman termuat, punya satu h1, lolos cek aksesibilitas dasar', async ({
  page,
}) => {
  const res = await page.goto('/');
  expect(res?.status()).toBe(200);
  await expect(page.locator('h1')).toHaveCount(1);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('URL yang tidak dikenal menampilkan halaman 404', async ({ page }) => {
  const res = await page.goto('/tidak-ada');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText(/not found/i);
});

test('dewasa, US: 5\'10" 160 lb = BMI 23.0 Normal', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Calculate', exact: true }).click();
  await expect(page.getByText('BMI = 23.0')).toBeVisible();
  const panel = page.locator('[aria-live]');
  await expect(panel.getByText('Normal', { exact: true })).toBeVisible();
  await expect(panel.getByText('BMI Prime')).toBeVisible();
});

test('dewasa, metric: 180 cm 65 kg = BMI 20.1 dan rentang sehat 59.9 - 81.0 kg', async ({
  page,
}) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Metric units' }).click();
  await page.getByLabel('Height (cm)').fill('180');
  await page.getByLabel('Weight (kg)').fill('65');
  await page.getByRole('button', { name: 'Calculate', exact: true }).click();
  await expect(page.getByText('BMI = 20.1')).toBeVisible();
  await expect(page.getByText('59.9 kg - 81.0 kg')).toBeVisible();
  await expect(page.getByText('11.1 kg/m³')).toBeVisible();
});

test('anak: tampil persentil CDC, bukan kategori dewasa', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Metric units' }).click();
  await page.getByLabel('Age (2 - 120)').fill('10');
  await page.getByLabel('Height (cm)').fill('140');
  await page.getByLabel('Weight (kg)').fill('35');
  await page.getByRole('button', { name: 'Calculate', exact: true }).click();
  await expect(
    page.locator('[aria-live]').getByText('BMI-for-age percentile'),
  ).toBeVisible();
  await expect(page.locator('[aria-live]').getByText('BMI Prime')).toHaveCount(
    0,
  );
});

test('input tidak valid menampilkan pesan', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Age (2 - 120)').fill('1');
  await page.getByRole('button', { name: 'Calculate', exact: true }).click();
  await expect(page.locator('p[role=alert]')).toContainText('Age must be');
});

test('konversi satuan', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Other units' }).click();
  await page.getByLabel('Pounds').fill('100');
  await expect(page.getByLabel('Kilograms')).toHaveValue('45.4');
  await page.getByLabel('Centimeters').fill('180');
  await expect(page.getByLabel('Feet')).toHaveValue('5');
  await expect(page.getByLabel('Inches')).toHaveValue('10.9');
});

test('bahasa Indonesia: /id termuat, lang id, satu h1, lolos aksesibilitas', async ({
  page,
}) => {
  const res = await page.goto('/id');
  expect(res?.status()).toBe(200);
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('h1')).toContainText(/Tubuh/i);
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  expect(results.violations).toEqual([]);
});

test('pengalih bahasa: en ke id dan kembali', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Switch to Bahasa Indonesia' }).click();
  await expect(page).toHaveURL(/\/id$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'id');
  await page.getByRole('link', { name: 'Ganti ke English' }).click();
  await expect(page).toHaveURL(/localhost:3000\/?$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('id: hitung BMI memakai koma desimal dan label Indonesia', async ({
  page,
}) => {
  await page.goto('/id');
  await page.getByRole('button', { name: 'Hitung', exact: true }).click();
  const panel = page.locator('[aria-live]');
  await expect(panel.getByText('BMI = 23,0')).toBeVisible();
  await expect(panel.getByText('Normal', { exact: true })).toBeVisible();
  await expect(panel.getByText('12,9 kg/m³')).toBeVisible();
});

test('id: anak menampilkan persentil berbahasa Indonesia', async ({ page }) => {
  await page.goto('/id');
  await page.getByRole('button', { name: 'Satuan metrik' }).click();
  await page.getByLabel('Umur (2 - 120)').fill('10');
  await page.getByLabel('Tinggi (cm)').fill('140');
  await page.getByLabel('Berat (kg)').fill('35');
  await page.getByRole('button', { name: 'Hitung', exact: true }).click();
  const panel = page.locator('[aria-live]');
  await expect(panel.getByText('Persentil BMI menurut umur')).toBeVisible();
  await expect(panel.getByText(/ke-\d+/)).toBeVisible();
});

test('id: URL tidak dikenal menampilkan 404 bahasa Indonesia', async ({
  page,
}) => {
  const res = await page.goto('/id/tidak-ada');
  expect(res?.status()).toBe(404);
  await expect(page.locator('h1')).toContainText(/tidak ditemukan/i);
});
