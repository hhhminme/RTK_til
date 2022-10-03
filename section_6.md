# Section 6 : Provider에 래핑된 컴포넌트 테스트하기

# Subtotals and Totals, React Context

# Context File

- Kent C.Dodds pattern to set up context with embedded state

[https://kentcdodds.com/blog/application-state-management-with-react](https://kentcdodds.com/blog/application-state-management-with-react)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/aaf07415-1b6e-4570-8f03-a80dd7afebf2/Untitled.png)

# Custom Render

```jsx
import { render } from '@testing-library/react';
import { OrderDetailsProvider } from '../context/OrderDetail';

const renderWithContext = (ui, options) =>
  render(ui, { wrapper: OrderDetailsProvider, ...options });

// re-export everything
export * from '@testing-library/react';

//override render method
export { renderWithContext as render };
```

# Review of Tests

- `getByText` to find total
  - `exact` option set to false
- number inputs
  - `await` and `findBy` (coming from server async)
  - `spinbutton` role
  - `userEvent.clear` to clear exising text
  - `userEvent.type` to enter number
- `wrapper` option to `render` to apply context provider
- Redefine Texting Library `render` to access universlly

# Code Quiz, Toppings Subtotal

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/a180bea7-34a4-4e34-b556-4e318ec30e65/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/742ba053-69a0-4d84-8b3c-f94f4ef97e20/Untitled.png)

```jsx
// totalUpadtes.test.jsx

import { render, screen } from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options';
test('update scoop subtotal when scoops change', async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '1');
  expect(scoopsSubtotal).toHaveTextContent('2.00');

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, '2');
  expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test('update topping subtotal when topping change', async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  // make sure total start out $0.00
  const toppingSubtotal = screen.getByText('toppings total: $', {
    exact: false,
  });
  expect(toppingSubtotal).toHaveTextContent(0.0);

  // update M&Ms toppings box click and check subtotal
  const mandmBox = await screen.findByRole('checkbox', {
    name: 'M&Ms',
  });

  await user.click(mandmBox);
  expect(toppingSubtotal).toHaveTextContent('1.50');

  // update M&Ms toppings box click and check subtotal
  const cherriesBox = await screen.findByRole('checkbox', {
    name: 'Cherries',
  });

  await user.click(cherriesBox);
  expect(toppingSubtotal).toHaveTextContent('3.00');

  // update Hot fudge toppings box click and check subtotal
  const hotFudgeBox = await screen.findByRole('checkbox', {
    name: 'Hot fudge',
  });

  await user.click(hotFudgeBox);
  expect(toppingSubtotal).toHaveTextContent('4.50');
});

// { name: 'Cherries', imagePath: '/images/cheeries.png' },
// { name: 'M&Ms', imagePath: '/images/m-and-ms.png' },
// { name: 'Hot fudge'
```

# Code Quiz Grand Total

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/fb8dfaf8-7c32-442f-890f-bfe109f96df2/Untitled.png)

# How to find element

- From mockups, grand total should be same size as titles H2
  - we can search using the `heading`
    - include the text in the `name` option
  - Note : `{exact : false`} is not an option for `*byRole`
  - Either use `*byRole` and regular expression for `name` option or
    - screen.getByRole(’heading’, {name : /grand total : \$/i});
  - \*byText and {exact : false}
    - screen.getByText(’grand total : $’, { exact : false}

```jsx
import {
  findAllByRole,
  findByRole,
  getByRole,
  render,
  screen,
} from '../../../test-utils/testing-library-utils';
import userEvent from '@testing-library/user-event';
import Options from '../Options';
import OrderEntry from '../OrderEntry';
test('update scoop subtotal when scoops change', async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // make sure total starts out $0.00
  const scoopsSubtotal = screen.getByText('Scoops total: $', { exact: false });
  expect(scoopsSubtotal).toHaveTextContent('0.00');

  // update vanilla scoops to 1 and check the subtotal
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '1');
  expect(scoopsSubtotal).toHaveTextContent('2.00');

  // update chocolate scoops to 2 and check subtotal
  const chocolateInput = await screen.findByRole('spinbutton', {
    name: 'Chocolate',
  });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, '2');
  expect(scoopsSubtotal).toHaveTextContent('6.00');
});

test('update topping subtotal when topping change', async () => {
  const user = userEvent.setup();
  render(<Options optionType="toppings" />);

  // make sure total start out $0.00
  const toppingSubtotal = screen.getByText('toppings total: $', {
    exact: false,
  });
  expect(toppingSubtotal).toHaveTextContent(0.0);

  // update M&Ms toppings box click and check subtotal
  const mandmBox = await screen.findByRole('checkbox', {
    name: 'M&Ms',
  });

  await user.click(mandmBox);
  expect(toppingSubtotal).toHaveTextContent('1.50');

  // update M&Ms toppings box click and check subtotal
  const cherriesBox = await screen.findByRole('checkbox', {
    name: 'Cherries',
  });

  await user.click(cherriesBox);
  expect(toppingSubtotal).toHaveTextContent('3.00');

  // update Hot fudge toppings box click and check subtotal
  const hotFudgeBox = await screen.findByRole('checkbox', {
    name: 'Hot fudge',
  });

  await user.click(hotFudgeBox);
  expect(toppingSubtotal).toHaveTextContent('4.50');
});

describe('grand total', () => {
  test('grand total start at $0.00', async () => {
    render(<OrderEntry />);

    const grandTotalHeader = screen.getByText('Grand total: $', {
      exact: false,
    });
    expect(grandTotalHeader).toHaveTextContent('0.00');
  });
  test('grand total updates properly if scoop is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const chocolateInput = await screen.findByRole('spinbutton', {
      name: /chocolate/i,
    });

    await user.clear(chocolateInput);
    await user.type(chocolateInput, '2');

    const grandTotalHeader = await screen.findByText('Grand total: ', {
      exact: false,
    });
    expect(grandTotalHeader).toHaveTextContent('4.00');
  });
  test('grand total updates properly if topping is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const hotFudgeBox = await screen.findByRole('checkbox', {
      name: 'Hot fudge',
    });
    expect(hotFudgeBox).not.toBeChecked();

    await user.click(hotFudgeBox);

    const grandTotalHeader = await screen.findByRole('heading', {
      name: /grand total: \$/i,
    });
    expect(grandTotalHeader).toHaveTextContent('1.50');
  });
  test('grand total updates properly if item is removed', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const scoopInputs = await screen.findAllByRole('spinbutton');
    expect(scoopInputs).toHaveLength(2);

    for (const input of scoopInputs) {
      await user.clear(input);
      await user.type(input, '1');
    }

    const grandTotalHeader = await screen.findByRole('heading', {
      name: /grand total: \$/i,
    });

    expect(grandTotalHeader).toHaveTextContent('4.00');

    for (const input of scoopInputs) {
      await user.clear(input);
    }

    expect(grandTotalHeader).toHaveTextContent('0.00');
  });
});
```

Warning: An update to Options inside a test was not wrapped in act(...).

```
When testing, code that causes React state updates should be wrapped into act(...):

```

# Options to remedy

- Skip auto cleanup
  - Not possible on a test-by-test basis ❌ ⇒ not recommend
- Mock useEffect to bypass server call
  - Not recommended, farher from production case path ❌
- Include in the beginning of a test that asserts on state changes
  - One that await state changes
    - happen on axios promise resolution
  - Don’t need to include in all tests b/c it only needs to be tested once

# What if there is no test?

- Add awaits to the end of the test to aviod errors
- I don’t love this

```jsx
test('grand total updates properly if topping is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const hotFudgeBox = await screen.findByRole('checkbox', {
      name: 'Hot fudge',
    });
    expect(hotFudgeBox).not.toBeChecked();

    await user.click(hotFudgeBox);

    const grandTotalHeader = await screen.findByRole('heading', {
      name: /grand total: \$/i,
    });
    expect(grandTotalHeader).toHaveTextContent('1.50');
  });
  test('grand total updates properly if item is removed', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);

    const scoopInputs = await screen.findAllByRole('spinbutton');
    expect(scoopInputs).toHaveLength(2);

    for (const input of scoopInputs) {
      await user.clear(input);
      await user.type(input, '1');
    }

    const grandTotalHeader = await screen.findByRole('heading', {
      name: /grand total: \$/i,
    });

    expect(grandTotalHeader).toHaveTextContent('4.00');

    for (const input of scoopInputs) {
      await user.clear(input);
    }

    expect(grandTotalHeader).toHaveTextContent('0.00');
  });
});
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/88790b0d-1c53-46b7-891d-7c9d43d047ed/Untitled.png)

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/53a73e68-996e-4c77-b8f4-5560fd65113f/Untitled.png)

# Should Tests Have Caught This?

- Functional tests generally…
  - test code processes, and not simply static cosmetics
  - test elements that might change with future coding
- Art, not science for waht to include in which types of testing
