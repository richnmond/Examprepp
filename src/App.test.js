import fs from 'fs';
import path from 'path';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the professional exam prep landing experience', () => {
  render(<App />);

  expect(screen.getByText(/examprep ng/i)).toBeInTheDocument();
  expect(screen.getByText(/a smarter way to prepare for exams/i)).toBeInTheDocument();
  expect(screen.getByText(/get full access/i)).toBeInTheDocument();
});

test('uses the external JAMB question JSON pack', () => {
  const appSource = fs.readFileSync(path.join(__dirname, 'App.jsx'), 'utf8');

  expect(appSource).toContain("./data/jambQuestions.json");
  expect(appSource).toContain('QUESTIONS_DB');
});
