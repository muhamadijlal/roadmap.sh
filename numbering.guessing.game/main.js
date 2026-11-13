#!/usr/bin/env node
import { program } from "commander";
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const MIN = 1;
const MAX = 100;

const levelStage = {
  1: { label: "Easy", chance: 10 },
  2: { label: "Medium", chance: 5 },
  3: { label: "Hard", chance: 3 },
};

// menu dibuat otomatis dari levelStage
const levelMenu = [
  "Please select the difficulty level:",
  ...Object.entries(levelStage).map(
    ([key, level]) => `${key}. ${level.label} (${level.chance} chances)`,
  ),
].join("\n");

const welcome = [
  "Welcome to the Number Guessing Game!",
  `I'm thinking of a number between ${MIN} and ${MAX}.`,
].join("\n");

function getRandomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function selectLevel(rl) {
  let selectedLevel;

  do {
    const answer = await rl.question("Enter your choice: ");
    selectedLevel = levelStage[Number(answer)];

    // cek dulu baru pakai (bug 1)
    if (!selectedLevel) {
      console.error(`\nInvalid choice.\n${levelMenu}\n`);
    }
  } while (!selectedLevel);

  return selectedLevel;
}

async function playRound(rl) {
  console.log(`\n${levelMenu}\n`);
  const level = await selectLevel(rl);

  // state di-reset setiap ronde (clue 4)
  const randomNumber = getRandomNumber(MIN, MAX); // bug 2: kirim min & max
  let attemptsLeft = level.chance;
  let attemptsUsed = 0;
  let isWin = false;

  console.log(
    `\nGreat! You have selected the ${level.label} difficulty level.\nLet's start the game!\n`,
  );

  // lanjut selama BELUM menang DAN kesempatan masih ada (bug 3)
  while (!isWin && attemptsLeft > 0) {
    const guess = Number(await rl.question("Enter your guess: ")); // bug 6

    // input tidak valid tidak mengurangi kesempatan
    if (!Number.isInteger(guess) || guess < MIN || guess > MAX) {
      console.error(`Please enter a whole number between ${MIN} and ${MAX}.`);
      continue;
    }

    attemptsUsed++;
    attemptsLeft--;

    if (guess === randomNumber) {
      isWin = true;
    } else {
      const hint = guess > randomNumber ? "less" : "greater";
      console.log(`Incorrect! The number is ${hint} than ${guess}.`);

      if (attemptsLeft > 0) {
        console.log(
          `You have ${attemptsLeft} ${attemptsLeft === 1 ? "chance" : "chances"} left.\n`,
        );
      }
    }
  }

  // bedakan menang atau kalah setelah loop selesai (bug 4 & 5)
  if (isWin) {
    console.log(
      `Congratulations! You guessed the correct number in ${attemptsUsed} ${attemptsUsed === 1 ? "attempt" : "attempts"}.`,
    );
  } else {
    console.log(`Game over! The number was ${randomNumber}.`);
  }
}

program
  .name("play-game")
  .description(`${welcome}\n\n${levelMenu}`)
  .action(async () => {
    // rl dibuat sekali saja (clue 5)
    const rl = readline.createInterface({ input, output });
    let playAgain;

    try {
      console.log(welcome);

      // loop luar untuk main lagi (clue 1)
      do {
        await playRound(rl);

        // ditanya di akhir setiap ronde (clue 2)
        const answer = await rl.question(
          "\nDo you want to play again? (y/n): ",
        );
        playAgain = answer.trim().toLowerCase() === "y";
      } while (playAgain); // clue 3

      console.log("\nThanks for playing! Goodbye.");
    } catch (e) {
      console.error(`Error: ${e.message}`);
      process.exitCode = 1;
    } finally {
      rl.close(); // clue 6: program berhenti dengan sendirinya
    }
  });

await program.parseAsync();
