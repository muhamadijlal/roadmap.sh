// Patokan: meter
const LENGTH = {
  millimeter: 0.001,
  centimeter: 0.01,
  meter: 1,
  kilometer: 1000,
  inch: 0.0254,
  foot: 0.3048,
  yard: 0.9144,
  mile: 1609.344,
};

// Patokan: gram
const WEIGHT = {
  milligram: 0.001,
  gram: 1,
  kilogram: 1000,
  ounce: 28.349523125,
  pound: 453.59237,
};

// Patokan: celsius
const TO_CELSIUS = {
  celsius: (v) => v,
  fahrenheit: (v) => ((v - 32) * 5) / 9,
  kelvin: (v) => v - 273.15,
};

const FROM_CELSIUS = {
  celsius: (v) => v,
  fahrenheit: (v) => (v * 9) / 5 + 32,
  kelvin: (v) => v + 273.15,
};

function assertUnit(table, unit) {
  if (!Object.hasOwn(table, unit)) {
    throw new Error(`Invalid unit: ${unit}`);
  }
}

// Dipakai bersama oleh length dan weight
function convertByFactor(table, { value, from, to }) {
  assertUnit(table, from);
  assertUnit(table, to);
  return (value * table[from]) / table[to];
}

function length({ value, from, to }) {
  return convertByFactor(LENGTH, { value, from, to });
}

function weight({ value, from, to }) {
  return convertByFactor(WEIGHT, { value, from, to });
}

function temperature({ value, from, to }) {
  assertUnit(TO_CELSIUS, from);
  assertUnit(FROM_CELSIUS, to);
  const celsius = TO_CELSIUS[from](value);
  return FROM_CELSIUS[to](celsius);
}

const CONVERTERS = { length, weight, temperature };

export function convert({ category, value, from, to }) {
  if (!Object.hasOwn(CONVERTERS, category)) {
    throw new Error(`Invalid category: ${category}`);
  }
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error("Value must be a number");
  }

  const result = CONVERTERS[category]({ value, from, to });
  return Number(result.toFixed(6)); // buang sisa pembulatan seperti 0.30000000000000004
}
