// Daftar kategori dan satuan.
// `value` adalah key yang dikirim ke backend (field `from` dan `to`),
// jadi backend harus mengenali key yang sama persis.
export const CATEGORIES = [
  {
    key: "length",
    label: "Length",
    units: [
      { value: "millimeter", label: "Millimeter", symbol: "mm" },
      { value: "centimeter", label: "Centimeter", symbol: "cm" },
      { value: "meter", label: "Meter", symbol: "m" },
      { value: "kilometer", label: "Kilometer", symbol: "km" },
      { value: "inch", label: "Inch", symbol: "in" },
      { value: "foot", label: "Foot", symbol: "ft" },
      { value: "yard", label: "Yard", symbol: "yd" },
      { value: "mile", label: "Mile", symbol: "mi" },
    ],
  },
  {
    key: "weight",
    label: "Weight",
    units: [
      { value: "milligram", label: "Milligram", symbol: "mg" },
      { value: "gram", label: "Gram", symbol: "g" },
      { value: "kilogram", label: "Kilogram", symbol: "kg" },
      { value: "ounce", label: "Ounce", symbol: "oz" },
      { value: "pound", label: "Pound", symbol: "lb" },
    ],
  },
  {
    key: "temperature",
    label: "Temperature",
    units: [
      { value: "celsius", label: "Celsius", symbol: "°C" },
      { value: "fahrenheit", label: "Fahrenheit", symbol: "°F" },
      { value: "kelvin", label: "Kelvin", symbol: "K" },
    ],
  },
];

export function getUnitSymbol(categoryKey, unitValue) {
  const category = CATEGORIES.find((c) => c.key === categoryKey);
  return category?.units.find((u) => u.value === unitValue)?.symbol ?? unitValue;
}
