function printError(message) {
  console.error(`error: ${message}`);
  process.exitCode = 1;
}

function main() {
  const args = process.argv.slice(2);

  if (!args.length) {
    printError("please provide at least one environment variable name.");
    return;
  }

  try {
    checkingEnv(args);
  } catch (error) {
    printError(error);
    return;
  }
}

function checkingEnv(args) {
  try {
    const missing = args.filter((arg) => !process.env[arg]);

    if (missing.length) {
      printError(`missing environment variables: ${missing.join(", ")}`);
      return;
    }

    console.log(`Set: ${args.join(", ")}`);
    console.log("All required environment variables are set.");
  } catch (error) {
    printError(error);
    return;
  }
}

main();
