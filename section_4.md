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
