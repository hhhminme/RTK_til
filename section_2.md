# General Course Plan

- Start with very simple React
  - focus on Testing Library syntax
- First app : not much of an app
  - changing button color, disabling button with checkbox
  - introduce: testing interactions that affect DOM, unit testing function
- Build up to more complex functionality and tests
- Second app : design and order an ice-cream sundae
  - testing more complex user interactions, interactions between components
  - mocking server responses with Mock Service Worker
  - testing async functionality

# A note about React Explanations

- Folks come to this course at many levels
- Optional lectures explaining React synctax and decisions
- Feel free to skip!

# Simple App

- Color Button
- change to blue 라는 text를 가진 button 이 있고 해당 button 의 backgroundcolor는 red이다.
- 해당 버튼을 누르게되면 backgorundColor 가 blue가 되고 text 는 Change to Red로 변경되는 앱이다.

## Checkbox Functionality Code Quiz Spec

Planning

- When checkbox is checked, button should be disabled
  - Checkbox controls button via boolean state:
  - state determines value of disabled property on button
- I recommend calling state disabled, defaulting to false
- onChange for checkbox
  - {(e) => setDisabled(e.target.checked)}

## Tests

- Clicking the checkbox
  - fireEvent.click
  - 2x in test: once to enable, once to disable
- Assertions to check button
  - expect(button).toBeEnabled()
  - expect(button).toBeDisabled()

# Disabled Button Gray Code Quiz Spec

Spec

- use web color "gray"
- Test flows:
  - disable button → button is gray → enable button → button is red
  - click button to change color → disable button → button is gray → enable button → button is blue

```tsx
function App() {
  const [buttonColor, setButtonColor] = useState('red');
  const [disabled, setDisabled] = useState(false);
  const newButtonColor = buttonColor === 'red' ? 'blue' : 'red';

  const onChange = (e) => {
    setDisabled(e.target.checked);
  };
  return (
    <div>
      <button
        style={{ backgroundColor: disabled ? 'gray' : buttonColor }}
        onClick={() => setButtonColor(newButtonColor)}
        disabled={disabled}
      >
        Change to {newButtonColor}
      </button>
      <br />
      <input
        onChange={onChange}
        type="checkbox"
        defaultChecked={disabled}
        id="disable-button-checkbox"
        aria-checked={disabled}
      />
      <label htmlFor="disable-button-checkbox">Disable button</label>
    </div>
  );
}

export default App;
```

```tsx
test('button has correct initial color', () => {
  render(<App />);
  //find ann element with a role of button and text of 'Change to blue'
  const colorButton = screen.getByRole('button', { name: 'Change to blue' });

  // expect the background color to be red
  expect(colorButton).toHaveStyle({ backgroundColor: 'red' });

  // click button
  fireEvent.click(colorButton);

  // expect the background color to be blue
  expect(colorButton).toHaveStyle({ backgroundColor: 'blue' });

  //expect the button text to be 'Change to red'
  expect(colorButton.textContent).toBe('Change to red');
});

test('initial conditions', () => {
  render(<App />);

  // check that the button starts out enabled
  const colorButton = screen.getByRole('button', { name: 'Change to blue' });
  expect(colorButton).toBeEnabled();

  // check that the checkbox starts out unchecked
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
});

test('Checkbox disables button on first click and enables on second click', () => {
  render(<App />);

  const colorButton = screen.getByRole('button', { name: 'Change to blue' });
  expect(colorButton).toBeEnabled();

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();
  expect(colorButton).toBeDisabled();

  fireEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
  expect(colorButton).toBeEnabled();
});

test('Disabled button has gray background and reverts to red', () => {
  render(<App />);
  const checkbox = screen.getByRole('checkbox', { name: 'Disable button' });
  const colorButton = screen.getByRole('button', { name: 'Change to blue' });

  //disable button
  fireEvent.click(checkbox);
  expect(colorButton).toHaveStyle('backgroundColor: gray');

  // re-enable button
  fireEvent.click(checkbox);
  expect(colorButton).toHaveStyle('background-color: red');
});

test('Clicked disable button has gray backgorund and reverts to blue', () => {
  render(<App />);
  const checkbox = screen.getByRole('checkbox', { name: 'Disable button' });
  const colorButton = screen.getByRole('button', { name: 'Change to blue' });

  //make blue button
  fireEvent.click(colorButton);
  expect(colorButton).toHaveStyle('background-color:blue');

  //disable button
  fireEvent.click(checkbox);
  expect(colorButton).toHaveStyle('background-color:gray');

  //re-enable button
  fireEvent.click(checkbox);
  expect(colorButton).toHaveStyle('background-color:blue');
});
```

# Unit Testing Functions

- Function separate from components
  - used by several components
  - Complex logic
- Unit test if
  - Complex logic difficult to test via fucntional tests
  - Too many edge cases

```jsx
export function replaceCamelWithSpaces(colorName) {
  return colorName.replace(/\B([A-Z])\B/g, ' $1'); //한ㄷ 단어의 내부에서 대문자를 발견할 시 그리고 다수의 대문자를 발견할 시 발견한 대문자는 빈칸으로 대체
}
```

```jsx
describe('spaces before camel-case capital letters', () => {
  test('works for no inner capital letters', () => {
    expect(replaceCamelWithSpaces('Red')).toBe('Red');
  });
  test('Works for one inner capital letter', () => {
    expect(replaceCamelWithSpaces('MidnightBlue')).toBe('Midnight Blue');
  });

  test('Works for multiple inner capital letters', () => {
    expect(replaceCamelWithSpaces('MediumVioletRed')).toBe('Medium Violet Red');
  });
});
```

[03+Colors+with+Spaces+Code+Quiz+Spec.pdf](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/eae8ea37-931d-4044-aa29-94fc8ad38c6d/03ColorswithSpacesCodeQuizSpec.pdf)

# Colors with Spaces Code Quiz Spec

- Color starts with MediumVioletRed and changes to MidnightBlue
- Need to update existing tests since behavior changed
- Tests for checkbox disabling should still pass

```jsx
import { useState } from 'react';
import './App.css';

export function replaceCamelWithSpaces(colorName) {
  return colorName.replace(/\B([A-Z])\B/g, ' $1'); //한ㄷ 단어의 내부에서 대문자를 발견할 시 그리고 다수의 대문자를 발견할 시 발견한 대문자는 빈칸으로 대체
}

function App() {
  const [buttonColor, setButtonColor] = useState('MediumVioletRed');
  const [disabled, setDisabled] = useState(false);
  const newButtonColor =
    buttonColor === 'MediumVioletRed' ? 'MidnightBlue' : 'MediumVioletRed';

  const onChange = (e) => {
    setDisabled(e.target.checked);
  };
  return (
    <div>
      <button
        style={{ backgroundColor: disabled ? 'gray' : buttonColor }}
        onClick={() => setButtonColor(newButtonColor)}
        disabled={disabled}
      >
        Change to {replaceCamelWithSpaces(newButtonColor)}
      </button>
      <br />
      <input
        onChange={onChange}
        type="checkbox"
        defaultChecked={disabled}
        id="disable-button-checkbox"
        aria-checked={disabled}
      />
      <label htmlFor="disable-button-checkbox">Disable button</label>
    </div>
  );
}

export default App;
```

```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { replaceCamelWithSpaces } from './App';
test('button has correct initial color', () => {
  render(<App />);
  //find ann element with a role of button and text of 'Change to blue'
  const colorButton = screen.getByRole('button', {
    name: `Change to ${replaceCamelWithSpaces('MidnightBlue')}`,
  });

  // expect the background color to be red
  expect(colorButton).toHaveStyle({ backgroundColor: 'MediumVioletRed' });

  // click button
  fireEvent.click(colorButton);

  // expect the background color to be blue
  expect(colorButton).toHaveStyle({ backgroundColor: 'MidnightBlue' });

  //expect the button text to be 'Change to red'
  expect(colorButton.textContent).toBe(
    `Change to ${replaceCamelWithSpaces('MediumVioletRed')}`
  );
});

test('initial conditions', () => {
  render(<App />);

  // check that the button starts out enabled
  const colorButton = screen.getByRole('button', {
    name: `Change to ${replaceCamelWithSpaces('MidnightBlue')}`,
  });
  expect(colorButton).toBeEnabled();

  // check that the checkbox starts out unchecked
  const checkbox = screen.getByRole('checkbox');
  expect(checkbox).not.toBeChecked();
});

test('Checkbox disables button on first click and enables on second click', () => {
  render(<App />);

  const colorButton = screen.getByRole('button', {
    name: `Change to ${replaceCamelWithSpaces('MidnightBlue')}`,
  });
  expect(colorButton).toBeEnabled();

  const checkbox = screen.getByRole('checkbox');
  fireEvent.click(checkbox);

  expect(checkbox).toBeChecked();
  expect(colorButton).toBeDisabled();

  fireEvent.click(checkbox);
  expect(checkbox).not.toBeChecked();
  expect(colorButton).toBeEnabled();
});

test('Disabled button has gray background and reverts to MediumVioletRed', () => {
  render(<App />);
  const checkbox = screen.getByRole('checkbox', { name: 'Disable button' });
  const colorButton = screen.getByRole('button', {
    name: `Change to ${replaceCamelWithSpaces('MidnightBlue')}`,
  });

  //disable button
  fireEvent.click(checkbox);
  expect(colorButton).toHaveStyle('backgroundColor: gray');

  // re-enable button
  fireEvent.click(checkbox);
  expect(colorButton).toHaveStyle('background-color: MediumVioletRed');
});

test('Clicked disable button has gray background and reverts to blue', () => {
  render(<App />);
  const checkbox = screen.getByRole('checkbox', { name: 'Disable button' });
  const colorButton = screen.getByRole('button', {
    name: `Change to ${replaceCamelWithSpaces('MidnightBlue')}`,
  });

  //make blue button
  fireEvent.click(colorButton);
  expect(colorButton).toHaveStyle('background-color:MidnightBlue');

  //disable button
  fireEvent.click(checkbox);
  expect(colorButton).toHaveStyle('background-color:gray');

  //re-enable button
  fireEvent.click(checkbox);
  expect(colorButton).toHaveStyle('background-color:MidnightBlue');
});

describe('spaces before camel-case capital letters', () => {
  test('works for no inner capital letters', () => {
    expect(replaceCamelWithSpaces('Red')).toBe('Red');
  });
  test('Works for one inner capital letter', () => {
    expect(replaceCamelWithSpaces('MidnightBlue')).toBe('Midnight Blue');
  });

  test('Works for multiple inner capital letters', () => {
    expect(replaceCamelWithSpaces('MediumVioletRed')).toBe('Medium Violet Red');
  });
});
```

# Discussion: When to Unit Test?

- When to unit test?
  - replaceCamelWithSpaces is pretty simple
  - could be covered by functional tests on button
- For more complicated functions unit tests help with:
  - covering all possible dege cases
  - determining what caused function tests to fail
- Issue with functional tests:
  - high-level makes them resistant to fefactors
  - hight-level makes them difficult to dianose

# Review : Simple App

- Tesring interactivity using fireEvent
- jest-dom asserions:
  - toBeEnabled()
  - toBeDisabled()
  - toBeChecked()
- getByRole option {name : }
- jest describe to group tests
- Unit testing fucntions
