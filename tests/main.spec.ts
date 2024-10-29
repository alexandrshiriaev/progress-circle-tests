import {expect, test} from '@playwright/test';

const BASE_URL = 'https://alexandrshiriaev.github.io/progress-circle/';

test.describe('progress circle and control inputs are visible', () => {
    test('progress circle is visible', async ({page}) => {
        await page.goto(BASE_URL);

        await expect(page.getByRole('progressbar')).toBeVisible();
    });

    test('value input is visible', async ({page}) => {
        await page.goto(BASE_URL);

        await expect(page.locator('#progress-value')).toBeVisible();
    });

    test('animate toggle button is visible', async ({page}) => {
        await page.goto(BASE_URL);

        await expect(page.getByLabel('Animate').locator('.toggle-button__label')).toBeVisible();
    });

    test('hide toggle button is visible', async ({page}) => {
        await page.goto(BASE_URL);

        await expect(page.getByLabel('Hide').locator('.toggle-button__label')).toBeVisible();
    });
})

test.describe('inputs are responsive', () => {
    test('value is changing on input to value input', async ({page}) => {
        await page.goto(BASE_URL);

        const valueInput = page.locator('#progress-value');

        await valueInput.fill('50');

        await expect(valueInput).toHaveValue('50');
    })

    test('value is changing on clicking to animate toggle button', async ({page}) => {
        await page.goto(BASE_URL);

        const animateToggleLabel = page.getByLabel('Animate').locator('.toggle-button__label');
        const animateToggleInput = page.getByLabel('Animate').locator('.toggle-button__input');

        const initValue = await animateToggleInput.isChecked();
        await animateToggleLabel.click();
        const newValue = await animateToggleInput.isChecked();
        expect(newValue).toBe(!initValue);
    })

    test('value is changing on clicking to hide toggle button', async ({page}) => {
        await page.goto(BASE_URL);

        const hideToggleLabel = page.getByLabel('Hide').locator('.toggle-button__label');
        const hideToggleInput = page.getByLabel('Hide').locator('.toggle-button__input');

        const initValue = await hideToggleInput.isChecked();
        await hideToggleLabel.click();
        const newValue = await hideToggleInput.isChecked();
        expect(newValue).toBe(!initValue);
    })
})

test.describe('cannot fill input value with invalid data', () => {
    test('value is set to 0 on entering negative number', async ({page}) => {
        await page.goto(BASE_URL);

        const progressValueInput = page.locator('#progress-value');

        await progressValueInput.fill('-100');
        await page.dispatchEvent('#progress-value', 'change');

        await expect(progressValueInput).toHaveValue('0');
    })

    test('value is set to 100 on entering number greater than 100', async ({page}) => {
        await page.goto(BASE_URL);

        const progressValueInput = page.locator('#progress-value');

        await progressValueInput.fill('200');
        await page.dispatchEvent('#progress-value', 'change');

        await expect(progressValueInput).toHaveValue('100');
    })

    test('value is set to parsed number from input', async ({page}) => {
        await page.goto(BASE_URL);

        const progressValueInput = page.locator('#progress-value');

        await progressValueInput.fill('023');
        await page.dispatchEvent('#progress-value', 'change');

        await expect(progressValueInput).toHaveValue('23');
    })

    test('value is set to entered number on valid input', async ({page}) => {
        await page.goto(BASE_URL);

        const progressValueInput = page.locator('#progress-value');

        await progressValueInput.fill('50');
        await page.dispatchEvent('#progress-value', 'change');

        await expect(progressValueInput).toHaveValue('50');
    })
})

test.describe('changing inputs changes state of progress circle', () => {
    test('value of progress circle is changed when value input is changed to valid value', async ({page}) => {
        await page.goto(BASE_URL);

        const progressCircle = page.locator('.progress-circle');

        const progressValueInput = page.locator('#progress-value');

        await progressValueInput.fill('50');
        await page.dispatchEvent('#progress-value', 'change');
        await expect(progressCircle).toHaveCSS('--progress-value', '180');
    })

    test('progress circle is animated when animate toggle is checked', async ({page}) => {
        await page.goto(BASE_URL);

        const progressCircle = page.locator('.progress-circle');

        const animateToggleLabel = page.getByLabel('Animate').locator('.toggle-button__label');
        const animateToggleInput = page.getByLabel('Animate').locator('.toggle-button__input');

        let isAnimated = await animateToggleInput.isChecked();

        while (!isAnimated) {
            await animateToggleLabel.click();
            isAnimated = await animateToggleInput.isChecked();
        }

        await expect(progressCircle).toHaveClass(/animated/);
    })

    test('progress circle is hidden when hide toggle is checked', async ({page}) => {
        await page.goto(BASE_URL);

        const progressCircle = page.locator('.progress-circle');

        const hideToggleLabel = page.getByLabel('Hide').locator('.toggle-button__label');
        const hideToggleInput = page.getByLabel('Hide').locator('.toggle-button__input');

        let isHidden = await hideToggleInput.isChecked();

        while (!isHidden) {
            await hideToggleLabel.click();
            isHidden = await hideToggleInput.isChecked();
        }

        await expect(progressCircle).toHaveClass(/hidden/);
    })
})