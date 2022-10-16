# Section 8 : 선택적 추가 연습

# Exercises in this section

| Exercise                                                                                | Testing concepts                                                      |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Confirm “Loading” shows while contraction server                                        | async events, check that element disappears from DOM                  |
| Optionally show “Toppings” on summary page                                              | “happy path” test with different path, confirm element is not on page |
| Disable order button if no scoops are ordered                                           | conditions from button to be enabled                                  |
| Validate scoop count value                                                              | jest mcok function passed as prop, jest-dom toHaveClass assertion     |
| Don’t update total if scoop count is invalid, prerequisite : Validate scoop count value | minimum component to test                                             |
| show alert for error when submitting order                                              | error response from server                                            |

```tsx
//expect that loading header
const loadingText = await screen.findByRole('heading', {
  name: /loading.../i,
});
expect(loadingText).toBeInTheDocument();

// confirm order number on confirmation page
const thankYouHeader = await screen.findByRole('heading', {
  name: /thank you/i,
});
expect(thankYouHeader).toBeInTheDocument();

// expect hat loading header disappear
const notLoading = screen.queryByText(/loading.../i);
expect(notLoading).not.toBeInTheDocument();
```

# Standard Questions

| Question                     | Answer for this Exercise                                                           |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| What to render?              | happy path usually means App                                                       |
| Pass props?                  | No, App has no props                                                               |
| Wrap render?                 | No, App already wrap within component                                              |
| Which file for tests?        | orderPhase.test.jsx works; moving from one phase to another                        |
| What to test?                | Toppings header is not there, Anything else? No hard-and-fase reight answers here! |
| How to test?                 | Which query to assert somethings’s not on the page?                                |
| Do we need to async / await? | Is there anything async                                                            |

```jsx
test('disable order button if there are no scoops ordered', async () => {
  render(<OrderEntry setOrderPhase={jest.fn()} />);

  // order button should be disabled at first, event before options load
  let orderButton = screen.getByRole('button', { name: /order sundae/i });
  expect(orderButton).toBeDisabled();

  // expect button to be enabled after adding scoop
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '1');
  expect(orderButton).toBeEnabled();

  //expect button to be disabled again after removing scoops
  userEvent.clear(vanillaInput);
  userEvent.type(vanillaInput, '0');
  expect(orderButton).toBeEnabled();
});
```

# Standard Questions

| Question                     | Answer for this Exercise                               |
| ---------------------------- | ------------------------------------------------------ |
| What to render?              | ScoopOption                                            |
| Pass props?                  | setItemCoujnt needs jest mock function value jest.fn() |
| Wrap render?                 | does useOrderDetails get called in component?          |
| Which file for tests?        | ScoopOption.test.jsx (unit test for ScoopOption)       |
| What to test?                | “box turns red”(i.e is-invalid class)                  |
| How to test?                 | covered in last slide                                  |
| Do we need to async / await? | Is there anything async going on?                      |

```tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ScoopOption from '../ScoopOption';

test('indicate if scoop count is non-int or out of range', async () => {
  const user = userEvent.setup();

  render(<ScoopOption name="" imagePath="" updateItemCount={jest.fn()} />);

  // expect input to be invalid with negative number
  const vanillaInput = screen.getByRole('spinbutton');

  await user.clear(vanillaInput);
  await user.type(vanillaInput, '-1');
  expect(vanillaInput).toHaveClass('is-invalid');

  // replace with decimal input
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '2.5');
  expect(vanillaInput).toHaveClass('is-invalid');

  // replace with input that's too high
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '11');
  expect(vanillaInput).toHaveClass('is-invalid');

  // replace with valid input
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '3');
  expect(vanillaInput).not.toHaveClass('is-invalid');
});
```

# Standard Questions to Ask

- What to render?
  - waht’s the smallest component that encompasses tests?
- Do we need to apss any props?
- Do we need to wrap in say `OrderDetailsProvider`?
  - Does the provider get used? Is it already wrapped within the component?
- Where should the tests go?
  - which file? New file needed?
- What to test?
  - What’s the behavior that nedds testing?
- How to test?
  - What queries and events?
- Do we need to await?

```jsx
test("don't update totla if scoops input is invalid", async () => {
  const user = userEvent.setup();
  render(<Options optionType="scoops" />);

  // expect button to be enabled after adding scoop
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });
  await user.clear(vanillaInput);
  await user.type(vanillaInput, '-1');

  // make sure scoops subtotal hasn't updated
  const scoopsSubtotal = screen.getByText('Scoops total: $0.00');
  expect(scoopsSubtotal).toBeInTheDocument();
});
```

# Order Error Standard Questions

| Question                     | Answer for this Exercise                      |
| ---------------------------- | --------------------------------------------- |
| What to render?              | OrderConfirmation                             |
| Pass props?                  | Yes Jest mock for setOrderPhase               |
| Wrap render?                 | Yest, OrderConfirmation calls useOrderDetails |
| Which file for tests?        | New file for OrderConfirmation tests          |
| What to test?                | Alert appears on error from server            |
| How to test?                 | Override order POST handler for this test     |
| Do we need to async / await? | Yest, axios call                              |
