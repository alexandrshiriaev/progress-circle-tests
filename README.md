# e2e testing for progress-circle component

> Testing progress-circle demo with Playwright

File `main.spec.ts` describes the following scenarious for testing:

1. **The progress circle and control inputs are visible on the page:**
    * get the progress circle node on the page, expect it to be visible;
    * get the value input node on the page, expect it to be visible;
    * get the animate toggle button node on the page, expect it to be visible;
    * get the hide toggle button node on the page, expect it to be visible.
2. **All control inputs are responsive:**
    * get the value input node on the page, fill with `'50'` value, expect input's value to be `'50'`;
    * get the animate toggle button node on the page, dispatch click on it, expect input's value to be opposite to the
      initial one;
    * get the hide toggle button node on the page, dispatch click on it, expect input's value to be opposite to the
      initial one.
3. **The value input is validating:**
    * get the value input node on the page, fill with `'-100'` value, expect input's value to be `'0'`;
    * get the value input node on the page, fill with `'200'` value, expect input's value to be `'100'`;
    * get the value input node on the page, fill with `'023'` value, expect input's value to be `'23'`;
    * get the value input node on the page, fill with `'50'` value, expect input's value to be `'50'`.
4. **The state of progress circle is changing on controls input are changed:**
    * get progress circle and value input nodes on the page, fill with `'50'` value, expect progress circle node to have
      CSS property `--progress-value: 180`;
    * get progress circle and animate toggle button nodes on the page, toggle animate button to on, expect progress circle node to have
      class `animated`;
    * get progress circle and hide toggle button nodes on the page, toggle hide button to on, expect progress circle node to have
      class `hidden`.