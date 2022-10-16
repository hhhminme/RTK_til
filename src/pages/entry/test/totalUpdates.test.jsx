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
  test('grand total updates properly if scoop is added first', async () => {
    const user = userEvent.setup();
    render(<OrderEntry />);
    const grandTotalHeader = await screen.findByText('Grand total: ', {
      exact: false,
    });
    expect(grandTotalHeader).toHaveTextContent('0.00');

    const chocolateInput = await screen.findByRole('spinbutton', {
      name: /chocolate/i,
    });

    await user.clear(chocolateInput);
    await user.type(chocolateInput, '2');

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
      await user.type(input, '0');
    }

    expect(grandTotalHeader).toHaveTextContent('0.00');
  });
});
