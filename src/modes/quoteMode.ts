/**
 * Klycky - Quote Mode
 *
 * Curated readable quotes with elegant wrapping.
 */

import { TypingSession } from '../engine/session.js';

/** Built-in quote collection */
const QUOTES: string[] = [
  "The only way to do great work is to love what you do.",
  "In the middle of difficulty lies opportunity.",
  "Simplicity is the ultimate sophistication.",
  "The best time to plant a tree was twenty years ago. The second best time is now.",
  "Code is like humor. When you have to explain it, it's bad.",
  "First, solve the problem. Then, write the code.",
  "Programs must be written for people to read, and only incidentally for machines to execute.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Talk is cheap. Show me the code.",
  "The most dangerous phrase in the language is we have always done it this way.",
  "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away.",
  "The function of good software is to make the complex appear to be simple.",
  "Make it work, make it right, make it fast.",
  "Walking on water and developing software from a specification are easy if both are frozen.",
  "The best error message is the one that never shows up.",
  "A language that does not affect the way you think about programming is not worth knowing.",
  "Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday's code.",
  "Measuring programming progress by lines of code is like measuring aircraft building progress by weight.",
  "There are only two hard things in computer science: cache invalidation and naming things.",
  "It is not enough for code to work.",
  "Experience is the name everyone gives to their mistakes.",
  "The quieter you become, the more you are able to hear.",
  "Imagination is more important than knowledge.",
  "Creativity is intelligence having fun.",
  "The best way to predict the future is to invent it.",
  "Stay hungry, stay foolish.",
  "Think different.",
  "Move fast and break things. Unless you are breaking stuff, you are not moving fast enough.",
  "We can only see a short distance ahead, but we can see plenty there that needs to be done.",
  "The computer was born to solve problems that did not exist before.",
];

/**
 * Create a new quote mode session.
 */
export function createQuoteSession(): TypingSession {
  const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
  const words = quote.split(/\s+/);
  return new TypingSession(words, 'quote', 0);
}

/**
 * Get a random quote string.
 */
export function getRandomQuote(): string {
  return QUOTES[Math.floor(Math.random() * QUOTES.length)];
}
