import {expect, Page, test} from '@playwright/test';

const BASE_URL = 'https://alexandrshiriaev.github.io/progress-circle/';

test.beforeEach(async ({page}) => {
    await page.goto(BASE_URL);
});

test.describe('progress circle and control inputs are visible', () => {
    test('progress circle is visible', async ({page}) => {
        const progressCircle = getProgressCircle(page);

        await expect(progressCircle).toBeVisible();
    });

    test('value input is visible', async ({page}) => {
        const valueInput = getProgressValueInput(page);

        await expect(valueInput).toBeVisible();
    });

    test('animate toggle button is visible', async ({page}) => {
        const {toggleLabel} = getToggleButtonByLabel(page, 'Animate');

        await expect(toggleLabel).toBeVisible();
    });

    test('hide toggle button is visible', async ({page}) => {
        const {toggleLabel} = getToggleButtonByLabel(page, 'Hide');

        await expect(toggleLabel).toBeVisible();
    });
})

test.describe('inputs are responsive', () => {
    test('value is changing on input to value input', async ({page}) => {
        const valueInput = getProgressValueInput(page);

        await valueInput.fill('50');

        await expect(valueInput).toHaveValue('50');
    })

    test('value is changing on clicking to animate toggle button', async ({page}) => {
        const {toggleLabel, toggleInput} = getToggleButtonByLabel(page, 'Animate');

        const initValue = await toggleInput.isChecked();
        await toggleLabel.click();
        const newValue = await toggleInput.isChecked();
        expect(newValue).toBe(!initValue);
    })

    test('value is changing on clicking to hide toggle button', async ({page}) => {
        const {toggleLabel, toggleInput} = getToggleButtonByLabel(page, 'Animate');

        const initValue = await toggleInput.isChecked();
        await toggleLabel.click();
        const newValue = await toggleInput.isChecked();
        expect(newValue).toBe(!initValue);
    })
})

test.describe('cannot fill input value with invalid data', () => {
    test('value is set to 0 on entering negative number', async ({page}) => {
        const valueInput = getProgressValueInput(page);

        await valueInput.fill('-100');
        await page.dispatchEvent('#progress-value', 'change');

        await expect(valueInput).toHaveValue('0');
    })

    test('value is set to 100 on entering number greater than 100', async ({page}) => {
        const valueInput = getProgressValueInput(page);

        await valueInput.fill('200');
        await page.dispatchEvent('#progress-value', 'change');

        await expect(valueInput).toHaveValue('100');
    })

    test('value is set to parsed number from input', async ({page}) => {
        const valueInput = getProgressValueInput(page);

        await valueInput.fill('023');
        await page.dispatchEvent('#progress-value', 'change');

        await expect(valueInput).toHaveValue('23');
    })

    test('value is set to entered number on valid input', async ({page}) => {
        const valueInput = getProgressValueInput(page);

        await valueInput.fill('50');
        await page.dispatchEvent('#progress-value', 'change');

        await expect(valueInput).toHaveValue('50');
    })
})

test.describe('changing inputs changes state of progress circle', () => {
    test('value of progress circle is changed when value input is changed to valid value', async ({page}) => {
        const progressCircle = getProgressCircle(page);

        const valueInput = getProgressValueInput(page);

        await valueInput.fill('50');
        await page.dispatchEvent('#progress-value', 'change');
        await expect(progressCircle).toHaveCSS('--progress-value', '180');
    })

    test('progress circle is animated when animate toggle is checked', async ({page}) => {
        const progressCircle = getProgressCircle(page);

        const {toggleLabel, toggleInput} = getToggleButtonByLabel(page, 'Animate');

        let isAnimated = await toggleInput.isChecked();

        while (!isAnimated) {
            await toggleLabel.click();
            isAnimated = await toggleInput.isChecked();
        }

        await expect(progressCircle).toHaveClass(/animated/);
    })

    test('progress circle is hidden when hide toggle is checked', async ({page}) => {
        const progressCircle = getProgressCircle(page);

        const {toggleLabel, toggleInput} = getToggleButtonByLabel(page, 'Hide');

        let isHidden = await toggleInput.isChecked();

        while (!isHidden) {
            await toggleLabel.click();
            isHidden = await toggleInput.isChecked();
        }

        await expect(progressCircle).toHaveClass(/hidden/);
    })
})

function getProgressCircle(page: Page) {
    return page.getByRole('progressbar');
}

function getProgressValueInput(page: Page) {
    return page.locator('#progress-value');
}

function getToggleButtonByLabel(page: Page, label: string) {
    const toggleLabel = page.getByLabel(label).locator('.toggle-button__label');
    const toggleInput = page.getByLabel(label).locator('.toggle-button__input');

    return {toggleLabel, toggleInput};
}