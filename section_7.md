# Section 7 : 최종 시험 : 주문 단계

[Final+Exam+Code+Quiz+Spec.pdf](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/21c07ee9-21c2-404b-8b84-8579235540c8/FinalExamCodeQuizSpec.pdf)

# New Handler

- Phost order to server

  - implementation : call POST via useEffect in OrderConfirmation
    - make up format of the data sent to server, or send no data
    - server simply generated random order number and send it back as JSON
  - mimic POST for oreder confirmation with Mock Service Worker

- Warning about useing copy/paste to create new handler
  - i do this all the time
  - If you do, be sure to change the method from get to post
  - If you neglect to do this, it’s very difficult to track down!
    - Will get error like Error : connect ECONNREFUSED 127.0.0.1

# Debugging Tips

- screen.debug()
- Does getBy\* fail when ther a sercer call or other async action?
  - need to use await findBy\*
- Read test error output carefully
  - dont’t get intimidated by huge walls of text!
  - exactly which assertion is failing?
  - copy/paste errors into web search
- Try pre-written code to see whether your tests or code are the issue
  - Clearly not a ciable option in real life, but useful tool while learning

# Rsolving Errors from Tests

| Error                                                                                                                                       | Possible Cause                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| unable to find role=”role”                                                                                                                  | Either role (for example, button) doesn’t exist, or no element with that role that also matches name option ⇒ scree.debug() |
| warning: An update to component inside a test was not wrapped in act(…)                                                                     | There was an update to the component after the test completed. Use await findBy\*                                           |
| Warning : Can’t perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application | There was an update to the component state after the test completed . Use await findBy\*                                    |
| Error: connect ECONNREFUSED 127.0.0.1                                                                                                       | There is no Mock Service Worker handler associated with this route and method                                               |

# Order Confirmation Component

- State with orderNumber, start out null
- If orderNumber is null, display “Loading”
  - test “Loading” as optional practice
- useEffect to call axios when component mounts
  - Set orderNumber to axios response
  - Leave error as “TODO” (optional extra practice)

# React Coding Hints

- Keep orderPhase in App-level state
  - pass setter to top-level page components
  - orderPhase value determines whice page component to display
  - for simplicity, wrap everything in context provider
    - even though the confirmation page doesn’t need it
  - button that update orderPhase state in pages
    - clicking button calls setter from prop
  - reset context Maps after clicking “New Order” button
    - context needs additional array item resetOrder

```jsx
//orderParse.test.js

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';

test('order phases for happy path', async () => {
  const user = userEvent.setup();
  // render app
  render(<App />);
  // add ice cream scoops and toppings
  const vanillaInput = await screen.findByRole('spinbutton', {
    name: 'Vanilla',
  });

  await user.clear(vanillaInput);
  await user.type(vanillaInput, '1');

  const chocolateInput = screen.getByRole('spinbutton', { name: 'Chocolate' });
  await user.clear(chocolateInput);
  await user.type(chocolateInput, '2');

  const cherriesCheckbox = await screen.findByRole('checkbox', {
    name: 'Cherries',
  });
  await user.click(cherriesCheckbox);

  // find and click order button
  const orderSummaryButton = screen.getByRole('button', {
    name: /order sundae/i,
  });
  await user.click(orderSummaryButton);

  // check summary information based on order
  const summaryHeading = await screen.findByRole('heading', {
    name: 'Order Summary',
  });
  expect(summaryHeading).toBeInTheDocument();

  const scoopsHeading = await screen.findByRole('heading', {
    name: 'Scoops : $6.00',
  });
  expect(scoopsHeading).toBeInTheDocument();

  const toppingsHeading = screen.getByRole('heading', {
    name: 'Toppings : $1.50',
  });
  expect(toppingsHeading).toBeInTheDocument();

  // check summary option items
  const optionItems = screen.getAllByRole('listitem');
  const optionItemsText = optionItems.map((item) => item.textContent);
  expect(optionItemsText).toEqual(['1 Vanilla', '2 Chocolate', 'Cherries']);

  // accept terms and conditions and click button to confirm order
  const tcCheckbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });
  await user.click(tcCheckbox);

  const confirmOrderButton = screen.getByRole('button', {
    name: /confirm order/i,
  });
  await user.click(confirmOrderButton);

  // confirm order number on confirmation page
  const thankYouHeader = await screen.findByRole('heading', {
    name: /thank you/i,
  });
  expect(thankYouHeader).toBeInTheDocument();

  const orderNumber = await screen.findByText(/order number/i);
  expect(orderNumber).toBeInTheDocument();

  // click 'new order' button on confirmation page
  const newOrderButton = screen.getByRole('button', { name: /new order/i });
  await user.click(newOrderButton);
  // check that scoops and toppings subtotals have been reset
  const scoopsTotal = await screen.findByText('Scoops total: $0.00');
  expect(scoopsTotal).toBeInTheDocument();
  const toppingsTotal = await screen.findByText('Toppings total: $0.00');
  expect(toppingsTotal).toBeInTheDocument();

  //happening after test is over
  await screen.findByRole('spinbutton', { name: 'Vanilla' });
  await screen.findByRole('checkbox', { name: 'Cherries' });
});
```

# Jest Mocks as Props

- Added a prop to top level page components
  - `setOrderPhase`
- Other components also have functionas as props
  - `updateItemCount` for the ScoopOption / ToppingOption components
- May need to pass as prop when rendering in tests
  - TypeScript, PropTypes or other prop validators will require
  - Or will get called in tests, but doesn’t matter for test
    - Testing that scoop count in invalid will call `updateItemCount`

# Passing a Mock as a Prop

- How to pass when rendering component in test?
- `jest.fn()`
  - jest mock functiion
  - Does not do anything
  - Merely a placeholder to avoid errors
- Example:
