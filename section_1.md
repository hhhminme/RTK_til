- Not Just a library, also a philosophy

  - Test your software the way users actually use it
    - not internal implementation
  - Find elements by accessbility markers, not test IDs

- RTL vs Jest
- React Testing Library
- Providers virtual DOM for tests
- Jest

  - Test runner that
  - Find tests
  - Runs tests
  - Determines whether tests pass or fial

- craete-react-app
- npm package
  - Create React application with…
    - Configuration
    - Webpack and Babel
    - Web server
    - Testing Library

## npx

- We will be using px with create-react-app
  - Downloads the latest version of create-react-app templates every time
  - Not dependent on when you last installed create-react-app
    - Never installed on your machine
  - npx comes with npm5.2+ and higher
- npm jest srat watch mode

## Breaking dow syntax

```tsx
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
```

- render
  - Create virtual DOM for argument JSX
  - Access virtual DOM via screen global
- screen.getByText()
  - Find element by display text (모든 텓스트를 기반으로 DOM에 표시된 걸 찾음)
  - 인수는 정규 표현식임
- /learn react/i
  - regular expression
  - case insensitive(i) → 대소문자 구분 x
  - could be string ‘Learn React’ → 정규표현식 사용안할려면 그냥 문자열 사용해라
- expect().toBeInTheDocument()
  - assersion, causes test to succeed or fail

# Jest와 Jest-DOM 단언(Assertion)

`expect(linkElement).toBeInTheDocument();`

단언은 테스트의 통과여부를 결정

- expect
  - Jest global, starts the assersion
- expect arguamrnt
  - subejct of the asserions
- matcher
  - type of assertion
  - this matcher come from jest-DOM
- matcher argument
  - refineds matcher

More Asserions examples

```tsx
expect(element.textContent).toBe('hello'); //텍스트 콘텐츠의 요소를 hello로 예측
expect(elementsArray).toHaveLength(7); // 배열 요소의 길이를 7로 예상
```

Jest-dom

- comes with create-react-app
- scr/setupTests.js imports it before each test, makes matchers available
- DOM-based matchers
  - examples : toBeVisible() or toBeChecked()

# Jest: Watch 모드와 테스트가 작동하는 방식

- React Testing Library helps with
  - rendering components into virtual DOM
  - searching virtula DOM
  - interraction with virtual DOM
- Needs a test runner
  - Find tests, run them, make asserions
- Jest
  - is recommended by Testing Library
  - comes with create-react-app
- npm rest runs an npm scripts that runs jest in watch mode

## Jest Watch Mode

- watch for changes in files since last commit
- Only run tests related to fhees files
- No changes? No tests.
  - type a to run all tests

## How does Jest Work?

- global test method has two arguments
  - string description
  - test function
- Test ails if error is thrown when runnging function
  - asserions thorw errors when expectations fials
- No error → tests pass
  - Empty test passes!

# TDD(Test_driven Development)

- Write tests before writing code
  - then write code according to ‘spec’ set by tests
  - ‘red-green’ testing
    - Testing fail before code is written

1. write ‘shell’ function
2. Write tests
3. tests fail → 함수가 아무것도 하지 않기 때문에 테스트 실패 (red)
4. write code → 함수 작성
5. Test pass! (green)

## why TDD?

- Makes a huge difference in how it feels to write tests
  - part of the coding process, not a ‘chore’ to do at the end → 프로젝트의 일부로 여기기 때문에 지루한 일이라고 생각하지 않는다.
  - More efficient → 더욱 효율적이다. (
    - 원하는대로 확인해보는 행위 → Manual Testing
    - Re-run tests ‘for free’ after changes → 변경 후에도 자동으로 다시 실행 그래서 모든 테스트를 작성하면 변경 사항이 생길때마다 Free Regression test 를 할 수 있다. → 변경 사항 확인을 위해 애플리케이션을 열고 수동으로 테스트할 필요가 없다.

## 철학

- What does React Testing Library Do?
  - Creates virtual DOM for testing
  - and utilities for interacting with DOM
- Alows testing without browers

## Types of Tests

- Unit tests
  - Tests one unit of code in isolation (like function)
  - 이 유닛이 다른 코드의 유닛과 상호 작용하는 것을 테스트 하지 않는다.
- Intergration Tests(통합 테스트)
  - How multiple units work together
  - 컴포넌트 간의 상호작용, 마이크로 서비스 간의 상호 작용
- Functional Tests
  - Tests a particular function of software (general behavior)
  - Enter data in form and click submit
  - not testing code, testing behavior
- Acceptance(인수) / End-to-end(E2E) Tests
  - Use actual browser and server(Cypress, Selenium)
  - Require Actual Browers, need Server, need Special tools
  - Not Support RTK

## Functional Testing vs Unit Testing

- Unit Testing

  - Isonlated : mock dependencies, test internals
  - ⭐️ Very easy to pinpoint failures
  - 👎 Further from how users interact with software
  - 👎 More likely to break with refactoring

- Functional Testing
  - Include all relvant units, test behavior
  - ⭐️ Close to how users interact with software
  - ⭐️ Robust tests
  - 👎 More difficult to debug failing tests

## TDD vs BDD

- Quick detour for BDD : Behavior-Driven Development
- Testing Libraryh encourages testing behavior over implementation
- So shouldn’t we be calling this BDD instead of TDD?
  - acutally, no.
- BDD is very explicitly defined
  - involves collaboration between lots of roles
    - developers, QA, business partners, etc
  - defines process for different groups to interact
  - In this course, only developers, so TDD!

## Accessibility and Finding Elements

- Testing Library recommends finding elements by accessibility handles
- create-react-app’s example test uses getByText
  - ok for non-interactive elements
  - better : getByRole

```tsx
test('renders learn react link', () => {
  render(<App />);
	🤔 const linkElement = screen.getByText(/learn react/i);
  👍 const linkElement = screen.getByRole('link', { name: /learn react/i });
  expect(linkElement).toBeInTheDocument();
});
```

- some elements have built-in roles : button → button, a → link
- Can’t find an element like a screen reader would?
  - Then your app isn’t friendly to screen readers
