# Section 4 : 온디맨드 선데이 아이스크림 : Form 복습과 팝오버

- Choose ice cream flavor and toppings and submit order
- Flavors and toppings come from server
- order is send to server

# Backdrop to Test…

- more complex user interactions
  - mulitple from entry, moving through order phases
- mouseover popup
  - test that element disappears from DOM
- simulating server response
  - mock service worker
- async app updates
  - awating DOM changes
- global state via context

# Spoiler Alert!

- We will not be testing context implementation
  - only interested in testing behavior as seen by user!
- Tests no defferent if we used Redux, Mobx, etc
- Only diffence is the test setup
- Only difference is the test setup
  - make sure component is wrapped in context
  - ensure functionality
  - avoid errors

# Server

- Download from course repo
  - [https://github.com/bonnie/udemy-TESTING-LIBRARY/tree/main/sundae-server](https://github.com/bonnie/udemy-TESTING-LIBRARY/tree/main/sundae-server)
  - Follow instructions in [README.md](http://README.md) to install
- RESTful API, runs on port 3030
- For flavors / toppings, just sends static info
  - In a real app, would come from db
- For order, simply generates random order number
- Server not needed for functional react app testing
  - use mock-service-worker to mock responses from server
  - server for spec, manual acceptance testing

### **A server for the "Sundaes on Demand" app in the Udemy course "Testing Library for React"**

## **Installing**

1. Clone or fork the course repository found at [[https://github.com/bonnie/udemy-react-testing-library-projects](https://github.com/bonnie/udemy-react-testing-library-projects)]
2. `cd` into the `sundae-server` directory (where this README is located).
3. Run `npm install`

## **Starting the server**

Run `npm start`. The server will be found at [http://localhost:3030]

## **Using the server**

Server routes:

- `GET /scoops` and `GET /toppings` return sundae options (array of objects with keys `name` and `imagePath`)
- `POST /order` returns a random order number (does not process order)
- images via static `/images` directory.

## **Testing**

To test, run `npm test`.

# Styling

- course will use react-bootstrap
  - you canc use any styling you want, or none
- yarn add react-bootstrap bootstrap

# SummaryForm

- Form review and disappearance test

# SummaryForm Component

- Test and code checkbox / button
  - Sound familiar?
  - Test and code Terms & Conditions popover
    - syntax to test that element is no longer on page
  - Later:
    - test and code summary text
    - test and code button functionality

# Code Organization

- Organize components by pages
  - test directory for each page
  - Jest will find and run any files chat end in .test.js
- src/pages/summary
  - OrderSummary.jsx
  - SummaryForm.jsx
- src/pages/summary/test
  - SummaryForm.test.jsx

# Code Quiz! Chckbox enables button

- Write tests to ensure that
  - Checkbox is unchecked by default
  - Checking checkbox enables button
  - Unchecking checkbox again disables button
  - Unchecking checkbox again disables button
- A chance to set up your won test file from scratch
  - Use tests from last section as a model
  - Render the <SummaryForm /> compoent
- Find checkbox and button useing { name } option
  - Use mockup form “name” option values
- Check that tests fial! Red part of red-green testing

```tsx
test('Initial conditions', () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });
  //find Checkbox
  expect(checkbox).not.toBeChecked();

  const confirmButton = screen.getByRole('button', { name: /confirm order/i });
  expect(confirmButton).toBeDisabled();
});

test('Checkbox disables button on first click and enables on second click', () => {
  render(<SummaryForm />);

  const checkbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });

  const confirmButton = screen.getByRole('button', { name: /confirm order/i });

  fireEvent.click(checkbox);
  expect(confirmButton).toBeEnabled();

  fireEvent.click(checkbox);
  expect(confirmButton).toBeDisabled();
});
```

# user-event

- user-event is a companion library for Testing Library that simulates user interactions by dispatching the events that would happen if the interaction took place in a browser.
- `yarn add --dev @testing-library/user-event`
- 참고로 --save-dev 부분은 복사하지 않습니다. create-react-app은 더 이상 --save-dev를 사용하지 않아요. dev 의존성과 정규 의존성을 구분해 사용하는 걸 중단했거든요. 대부분의 경우에는 상관이 없기 때문이죠. 실행과 개발이 분리되어 있는 노드 프로젝트의 경우에는 몰라도 리액트 프로젝트의 경우에는, 실행을 하고 있다면 항상 코드 자체가 아닌 빌드를 사용하기 때문에 dev 의존성인지, 정규 의존성인지 프로덕션 의존성인지의 여부는 중요하지 않게 되죠

## Writing tests with `userEvent`[](https://testing-library.com/docs/user-event/intro#writing-tests-with-userevent)

We recommend invoking `[userEvent.setup()](https://testing-library.com/docs/user-event/setup)` before the component is rendered. This can be done in the test itself, or by using a setup function. We discourage rendering or using any `userEvent` functions outside of the test itself - e.g. in a `before`/`after` hook - for reasons described in ["Avoid Nesting When You're Testing"](https://kentcdodds.com/blog/avoid-nesting-when-youre-testing).

- recture question

[https://github.com/bonnie/udemy-TESTING-LIBRARY/issues/12](https://github.com/bonnie/udemy-TESTING-LIBRARY/issues/12)

# screen Query Methods

`command[All]ByQueryType`

- command
  - get : expect element to be in DOM
  - query : expect element not to be in DOM
  - find : expect element to appear async
- [All]
  - (exclude) expect only one match
  - (include) expect more than one match
- QueryType
  - Role(most preferred)
  - AltText(images)
  - Text(display elements)
  - Form elements
    - PlaceholderText
    - LabelText
    - DisplayValue

# screen Query Reference

- [https://testing-library.com/docs/dom-testing-library/api](https://testing-library.com/docs/dom-testing-library/api-queries)-queries
- [https://testing-library.com/docs](https://testing-library.com/docs)/react-testing-library/cheatsheet
  - specific for react
- [https://testing-library.com/docs/guide-which-query](https://testing-library.com/docs/guide-which-query)

# not wrapped in act(…) warning

- React updated element after test aws finished
- Don’t want to follow the advice to wrap in act(…)
  - Testing Library already does this for us!
  - [https://testing-library.com/docs/preact-testing-library/api/#act](https://testing-library.com/docs/preact-testing-library/api/#act)

## `act`[](https://testing-library.com/docs/preact-testing-library/api/#act)

Just a convenience export that points to preact/test-utils/act. **All renders and events being fired are wrapped in `act`, so you don't really need this.** It's responsible for flushing all effects and rerenders after invoking it.

- To remedy this error:
  - Determine what changes after the test is over(async)
  - Account for the change in test by:
    - awaiting the change, and
    - asseting on it
    [https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning](https://kentcdodds.com/blog/fix-the-not-wrapped-in-act-warning) → more detail whats going on
- [https://testing-library.com/docs/guide-disappearance/](https://testing-library.com/docs/guide-disappearance/)

→ await userEvent.unhover를 사용했기 때문에 이미 해당 element가 사라졌으므로 waitForElementToBeRemoved를 사용할 필요가 없다.

```tsx
//SummaryForm.test.jsx
import { queryByText, render, screen } from '@testing-library/react';
import SummaryForm from '../SummaryForm';
import userEvent from '@testing-library/user-event';
test('Initial conditions', () => {
  render(<SummaryForm />);
  const checkbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });
  //find Checkbox
  expect(checkbox).not.toBeChecked();

  const confirmButton = screen.getByRole('button', { name: /confirm order/i });
  expect(confirmButton).toBeDisabled();
});

test('Checkbox disables button on first click and enables on second click', async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);

  const checkbox = screen.getByRole('checkbox', {
    name: /terms and conditions/i,
  });

  const confirmButton = screen.getByRole('button', { name: /confirm order/i });

  await user.click(checkbox);
  expect(confirmButton).toBeEnabled();

  await user.click(checkbox);
  expect(confirmButton).toBeDisabled();
});

test('popover responds to hover', async () => {
  const user = userEvent.setup();
  render(<SummaryForm />);

  // popover starts out hidden
  const nullPopover = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopover).not.toBeInTheDocument();

  // popover appears upon mouseover of checkbox label
  const termsAndConditions = screen.getByText(/terms and conditions/i);
  await user.hover(termsAndConditions);

  const popover = screen.getByText(/no ice cream will actually be delivered/i); // don't need matcher
  expect(popover).toBeInTheDocument(); // not work functional, make more readable test

  // popover disappears when we mouse out
  await user.unhover(termsAndConditions);
  const nullPopoverAgain = screen.queryByText(
    /no ice cream will actually be delivered/i
  );
  expect(nullPopoverAgain).not.toBeInTheDocument();
});
```

```jsx
//SummaryForm.jsx
import React, { useState } from 'react';
import { Button, Form, Popover, OverlayTrigger } from 'react-bootstrap';

const SummaryForm = () => {
  const [tcChecked, setTcChecked] = useState(false);

  const popover = (
    <Popover id="popover-basic">
      <Popover.Body>No ice cream will actually be delivered</Popover.Body>
    </Popover>
  );

  const checkboxLabel = (
    <span>
      I agree to
      <OverlayTrigger placement="right" overlay={popover}>
        <span style={{ color: 'blue' }}>Terms and Conditions</span>
      </OverlayTrigger>
    </span>
  );

  return (
    <Form>
      <Form.Group controlId="terms and conditions">
        <Form.Check
          type="checkbox"
          checked={tcChecked}
          onChange={(e) => setTcChecked(e.target.checked)}
          label={checkboxLabel}
        />
      </Form.Group>
      <Button variant="primary" type="submit" disabled={!tcChecked}>
        Confirm order
      </Button>
    </Form>
  );
};

export default SummaryForm;
```

# SummaryForm Review

- (review) testing flow where checkbox controls whether button is disabled
- mouseover for terms and conditions
  - `userEvent.hover` and `userEvent.unhover` methods
  - `queryByText` to and `expect().not.toBeInTheDocument()` for element staring out not on page
  - `async waitForElementToBeRemoved` for element that was there and then disappeared
- test not wrapped in act(…) warning
  - Determine how component is getting updated async and account for in tests
