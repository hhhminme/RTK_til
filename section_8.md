# Section 8 : 선택적 추가 연습

# Exercises in this section

| Exercise                                         | Testing concepts                       |
| ------------------------------------------------ | -------------------------------------- |
| Confirm “Loading” shows while contraction server | -async events                          |
| -check that element disappears from DOM          |
| Optionally show “Toppings” on summary page       | -“happy path” test with different path |
| -confirm element is not on page                  |
| Disable order button if no scoops are ordered    | conditions from button to be enabled   |
| Validate scoop count value                       | -jest mcok function passed as prop     |
| -jest-dom toHaveClass assertion                  |

| Don’t update total if scoop count is invalid
prerequisite : Validate scoop count value | minimum component to test |
| show alert for error when submitting order | error response from server |

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

| Question                                               | Answer for this Exercise                                    |
| ------------------------------------------------------ | ----------------------------------------------------------- |
| What to render?                                        | happy path usually means App                                |
| Pass props?                                            | No, App has no props                                        |
| Wrap render?                                           | No, App already wrap within component                       |
| Which file for tests?                                  | orderPhase.test.jsx works; moving from one phase to another |
| What to test?                                          | - Toppings header is not there                              |
| - Anything else? No hard-and-fase reight answers here! |
| How to test?                                           | Which query to assert somethings’s not on the page?         |
| Do we need to async / await?                           | Is there anything async                                     |

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
