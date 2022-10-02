# Section 5 : Mock Service Worker(MSW)로 서버 응답 시뮬레이션 하기

# Order Entry

Simulating Data from Server

# Tests

- Test that option images render
- Mock Service Worker
- Mock server response for `/scoops` and `/toppings`
  - write “scoops” code together
  - “toppings” code as code quiz

# Mock Service Worker

- Purpose:
  - intercept network calls
  - return specified responses
- Prevents network calls during tests
- Set up test conditions using server response

# Mock Service Worker Setup

- yarn add msw
- Create handlers
- Create test server
- Make sure test server listens during all tests
  - reset after each test

# Mock Service Worker Handler

```tsx
rest.get('http://localhost:3030/scoops', (req, res, ctx) => {});
```

HanderType : `rest` or `graphql`

HTTP method to mock : `get, post`

Full URL to mock

Resonse resolver function

`req` : request object

`res` : function to create response

`ctx` : utility to build response

[https://mswjs.io/docs/basics/response-resolver](https://mswjs.io/docs/basics/response-resolver)

- handler.js

```jsx
import { rest } from 'msw';

export const handler = [
  rest.get('http://localhost:3030/scoops', (req, res, ctx) => {
    return res(
      ctx.json([
        { name: 'Chocolate', imagePath: '/images/chocolate.png' },
        {
          name: 'Vanilla',
          imagePath: '/images/vanilla.png',
        },
      ])
    );
  }),
];
```

# Integrate

- using Node
- [https://mswjs.io/docs/getting-started/integrate/node](https://mswjs.io/docs/getting-started/integrate/node)

```tsx
// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);
```

- Using Create React App

```tsx
// src/setupTests.js
import { server } from './mocks/server.js';
// Establish API mocking before all tests.
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests.
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished.
afterAll(() => server.close());
```

- Mock Service Worker in Tests

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/9e3f9a5a-3caa-4d74-b1fd-392a756b0e13/Untitled.png)

# await findBy

- When you are wating for something to appear asynchronously on the page, you must use `await` `findBy`

```jsx
//handers.js
import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:3030/scoops', (req, res, ctx) => {
    return res(
      ctx.json([
        { name: 'Chocolate', imagePath: '/images/chocolate.png' },
        {
          name: 'Vanilla',
          imagePath: '/images/vanilla.png',
        },
      ])
    );
  }),
];
```

```tsx
// src/mocks/server.js
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers);
```

```jsx
//Options.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ScoopOption from './ScoopOption';
import { Row } from 'react-bootstrap';

const Options = ({ optionType }) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // optionType is 'scoops' or 'toppings'
    axios
      .get(`http://localhost:3030/${optionType}`)
      .then((response) => setItems(response.data))
      .catch((error) => {
        //TODO: handle error response
      });
  }, [optionType]);

  //TODO: replace 'null' with ToppingOption when available
  const ItemComponent = optionType === 'scoops' ? ScoopOption : null;

  const optionItems = items.map((item) => (
    <ItemComponent
      key={item.name}
      name={item.name}
      imagePath={item.imagePath}
    />
  ));
  return <Row>{optionItems}</Row>;
};

export default Options;
```

```tsx
//ScoopOptions.jsx
import React from 'react';

import { Col } from 'react-bootstrap';

const ScoopOption = ({ name, imagePath }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
      <img
        style={{ width: '75%' }}
        src={`http://localhost:3030${imagePath}`}
        alt={`${name} scoop`}
      />
    </Col>
  );
};

export default ScoopOption;
```

```jsx
//Options.test.js
import { render, screen } from '@testing-library/react';

import Options from '../Options';

test('displays image for each scoop option from server', async () => {
  render(<Options optionType="scoops" />);

  // find images
  const scoopImages = await screen.findAllByRole('img', { name: /scoop$/i });
  expect(scoopImages).toHaveLength(2);

  // confirm alt text of images
  // @ts-ignore
  const altText = scoopImages.map((element) => element.alt);
  expect(altText).toEqual(['Chocolate scoop', 'Vanilla scoop']);
});
```

# Review of “scoops” Testing

- Mock Service Worker mimics response from server
  - create handler
  - create server
  - update setup Tests to listen from requests
- getAllByRole
  - search for more than one match to role
- await findAllByRole
  - for asynchronouse DOM update of elements

# Code Quiz! Toppings Images

- Use scoops as a model
  - type out rather than copy/paste for better learning
- add handler for /toppings route V
- Handler can return three toppings: V

```tsx
[
  { name: 'Cherries', imagePath: '/images/cheeries.png' },
  { name: 'M&Ms', imagePath: '/images/m-and-ms.png' },
  { name: 'Hot fudge', imagePath: '/images/hot-fudge.png' },
];
```

- Write tests in Options.test.jsx V
- name option can be /topping$ V
- Update Options.jsx and create ToppingOption.jsx V

```jsx
//ToppingOptions.jsx
import React from 'react';
import { Col } from 'react-bootstrap';

const ToppingOption = ({ name, imagePath }) => {
  return (
    <Col xs={12} sm={6} lg={3} style={{ textAlign: 'center' }}>
      <img
        style={{ width: '75%' }}
        src={`http://localhost:3030${imagePath}`}
        alt={`${name} topping`}
      />
    </Col>
  );
};

export default ToppingOption;
```

```jsx
//Options.jsx

//TODO: replace 'null' with ToppingOption when available
const ItemComponent = optionType === 'scoops' ? ScoopOption : ToppingOption;
```

```jsx
import { rest } from 'msw';

export const handlers = [
  rest.get('http://localhost:3030/scoops', (req, res, ctx) => {
    return res(
      ctx.json([
        { name: 'Chocolate', imagePath: '/images/chocolate.png' },
        {
          name: 'Vanilla',
          imagePath: '/images/vanilla.png',
        },
      ])
    );
  }),
  rest.get('http://localhost:3030/toppings', (req, res, ctx) => {
    return res(
      ctx.json([
        { name: 'Cherries', imagePath: '/images/cheeries.png' },
        { name: 'M&Ms', imagePath: '/images/m-and-ms.png' },
        { name: 'Hot fudge', imagePath: '/images/hot-fudge.png' },
      ])
    );
  }),
];
```

```jsx
test('displays image from each topping option from server', async () => {
  render(<Options optionType="toppings" />);

  //find images
  const toppingImages = await screen.findAllByRole('img', {
    name: /topping$/i,
  });
  expect(toppingImages).toHaveLength(3);

  //confirm alt text of images
  const altText = toppingImages.map((element) => element.alt);
  expect(altText).toEqual([
    'Cherries topping',
    'M&Ms topping',
    'Hot fudge topping',
  ]);
});
```
