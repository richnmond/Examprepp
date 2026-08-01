import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the exam prep landing page hero', () => {
  render(<App />);

  expect(screen.getByText(/examprep ng/i)).toBeInTheDocument();
  expect(screen.getByText(/practice with confidence/i)).toBeInTheDocument();
});
