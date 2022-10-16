import { server } from '../../../mocks/server';
import { rest } from 'msw';
import {
  render,
  waitFor,
  screen,
} from '../../../test-utils/testing-library-utils';
import OrderConfirmation from '../OrderConfirmation';

test('Order Confirmation server error', async () => {
  server.resetHandlers(
    rest.post('http://localhost:3030/order', (req, res, ctx) =>
      res(ctx.status(500))
    )
  );

  render(<OrderConfirmation setOrderPhase={jest.fn()} />);

  const alerts = await screen.findByRole('alert');
  expect(alerts).toHaveTextContent(
    'An unexpected error ocurred. Please try agin later.'
  );
});
