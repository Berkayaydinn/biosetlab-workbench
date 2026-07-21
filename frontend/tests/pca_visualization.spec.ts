import { test, expect, type Page } from '@playwright/test';

// Testten önce tüm servislerin (frontend, backend, python) çalıştığından emin olun.
// Genellikle `docker-compose up` komutu ile tüm sistemi başlatırsınız.

test.describe('PCA ve Görselleştirme Akışı (E2E)', () => {

  // Testin zaman aşımı süresini artıralım çünkü bu işlem biraz sürebilir.
  test.setTimeout(60000); // 60 saniye

  // Testten önce her seferinde ana sayfaya git
  test.beforeEach(async ({ page }) => {
    // Projeniz lokalde 5173 portunda çalışıyorsa bu adresi kullanın.
    // Docker kullanıyorsanız, frontend'in dışarıya açıldığı portu yazın.
    await page.goto('http://localhost:5173/');

    // Not: Eğer uygulamanızda bir giriş (login) ekranı varsa,
    // burada bir "beforeEach" bloğu içinde veya yeniden kullanılabilir bir fonksiyon ile
    // giriş yapma adımlarını eklemeniz en doğrusu olur.
  });


  test('bir veri setini PCA ile indirgemeli ve saçılım grafiği ile görselleştirmeli', async ({ page }) => {
    // Başlangıçtaki örnek projeyi temizleyelim.
    // UI'da "Clear" veya "New Project" butonu olduğunu ve `data-testid` içerdiğini varsayıyoruz.
    // data-testid, testlerinizi daha sağlam hale getirir.
    const clearButton = page.getByTestId('clear-playground-button');
    if (await clearButton.isVisible()) {
      await clearButton.click();
    }
    
    // Testin daha sağlam olması için, aksiyonlar arasına kısa beklemeler veya
    // UI'ın güncellendiğini doğrulayan `expect`'ler eklenebilir.
    await expect(page.locator('.react-flow__node')).toHaveCount(0);


    // 2. Düğümleri Ekleme ve Konumlandırma
    // Bu adımlar, UI'da düğüm ekleme menüsüyle etkileşimi simüle eder.
    // Seçiciler (selectors) uygulamanızın HTML yapısına göre güncellenmelidir.
    
    // File Düğümünü Ekle
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-group-node-data').click();
    await page.getByTestId('add-node-item-node-data-file').click();

    // PCA Düğümünü Ekle
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-group-node-unsupervised').click();
    await page.getByTestId('add-node-item-node-unsupervised-pca').click();
    
    // Scatter Plot Düğümünü Ekle
    await page.getByTestId('add-node-button').click();
    await page.getByTestId('node-group-node-visualization').click();
    await page.getByTestId('add-node-item-node-visualization-scatter-plot').click();

    // Düğümlerin yüklendiğini doğrulayalım
    await expect(page.locator('.react-flow__node')).toHaveCount(3);

    // Düğümleri sürükleyerek bağlama (Playwright'in dragTo fonksiyonu ile)
    const fileNodeOutput = page.locator('[data-testid^="rf__node-file-"] [data-handlepos="right"]');
    const pcaNodeInput = page.locator('[data-testid^="rf__node-pca-"] [data-handlepos="left"]');
    await fileNodeOutput.dragTo(pcaNodeInput);

    const pcaNodeOutput = page.locator('[data-testid^="rf__node-pca-"] [data-handlepos="right"]');
    const scatterNodeInput = page.locator('[data-testid^="rf__node-scatter-plot-"] [data-handlepos="left"]');
    await pcaNodeOutput.dragTo(scatterNodeInput);
    
    // 3. Düğüm Parametrelerini Ayarlama
    // File düğümüne çift tıkla ve ayar menüsünü aç
    const fileNode = page.locator('[data-testid^="rf__node-file-"]');
    await fileNode.dblclick();
    
    // iris.csv dosyasını seç
    await page.getByTestId('file-node-select').selectOption({ label: 'iris.csv' });
    // Ayarları kaydet (varsa) veya menüyü kapat
    // Örneğin, menü dışına tıklayalım
    await page.locator('body').click({ position: { x: 5, y: 5 } });
    
    // 4. Akışı Çalıştırma
    const scatterNode = page.locator('[data-testid^="rf__node-scatter-plot-"]');
    await scatterNode.click({ button: 'right' });
    await page.getByTestId('context-menu-run-from-here').click();
    
    // 5. Sonucu Doğrulama
    // İşlemin bitmesini beklemek için bir gösterge arayalım.
    // Düğümün üzerindeki bir 'success' veya 'updated' class'ını bekleyebiliriz.
    await expect(scatterNode).toHaveClass(/updated/, { timeout: 30000 });

    // Scatter Plot düğümünün içeriğini kontrol et
    // Görselleştirme düğümünün içinde bir 'canvas' veya 'svg' elementi oluşmasını bekliyoruz.
    const plotOutput = scatterNode.locator('.node-output-content canvas, .node-output-content svg');
    await expect(plotOutput).toBeVisible();
    await expect(plotOutput).toHaveCount(1);
  });
});