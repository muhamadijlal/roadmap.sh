# numbering.guessing.game

A simple Node.js CLI number guessing game. The computer picks a random number between 1 and 100, you choose a difficulty level, and try to guess the number within a limited number of chances. After each wrong guess you get a hint (the number is greater or less than your guess). You can play multiple rounds in a row.

Project URL: https://roadmap.sh/projects/number-guessing-game

Repository: https://github.com/muhamadijlal/roadmap.sh

## Requirements

- Node.js 20 or newer

## Installation

```bash
git clone https://github.com/muhamadijlal/roadmap.sh.git
cd roadmap.sh/numbering.guessing.game
npm install
```

Optional: expose the `play-game` command globally.

```bash
npm link
```

## Usage

```bash
node main.js
# or, after `npm link`
play-game
```

### Difficulty levels

| Choice | Level | Chances |
| --- | --- | --- |
| 1 | Easy | 10 |
| 2 | Medium | 5 |
| 3 | Hard | 3 |

### Example

```text
Welcome to the Number Guessing Game!
I'm thinking of a number between 1 and 100.

Please select the difficulty level:
1. Easy (10 chances)
2. Medium (5 chances)
3. Hard (3 chances)

Enter your choice: 2

Great! You have selected the Medium difficulty level.
Let's start the game!

Enter your guess: 50
Incorrect! The number is less than 50.
You have 4 chances left.

Enter your guess: 25
Incorrect! The number is greater than 25.
You have 3 chances left.

Enter your guess: 33
Congratulations! You guessed the correct number in 3 attempts.

Do you want to play again? (y/n): n

Thanks for playing! Goodbye.
```

## Rules

- An invalid difficulty choice asks you to choose again.
- A guess that is not a whole number between 1 and 100 is rejected and does not use up a chance.
- The round ends when you guess correctly or run out of chances (the answer is then revealed).
- After each round you are asked whether to play again; answer `y` to start a new round, anything else to quit.
