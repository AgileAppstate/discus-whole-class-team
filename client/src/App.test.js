import { render, screen } from '@testing-library/react';
import App from './App';

test('renders discus title', () => {
  render(<App />);
  const linkElement = screen.getByText('Digital Signage Control System');
  expect(linkElement).toBeInTheDocument();
});
