import { useState } from "react";
import { CATEGORIES, getUnitSymbol } from "./units.js";
import { convertUnit } from "./api.js";

const numberFormat = new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 });

function getDefaultForm(category) {
  return {
    value: "",
    from: category.units[0].value,
    to: category.units[1].value,
  };
}

export default function App() {
  const [activeKey, setActiveKey] = useState(CATEGORIES[0].key);
  const category = CATEGORIES.find((c) => c.key === activeKey);

  const [form, setForm] = useState(() => getDefaultForm(category));
  const [result, setResult] = useState(null); // { value, from, to, result }
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function switchCategory(key) {
    if (key === activeKey) return;
    const next = CATEGORIES.find((c) => c.key === key);
    setActiveKey(key);
    setForm(getDefaultForm(next));
    setResult(null);
    setError("");
  }

  function updateField(field) {
    return (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function swapUnits() {
    setForm((prev) => ({ ...prev, from: prev.to, to: prev.from }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const value = Number(form.value);
    if (form.value.trim() === "" || Number.isNaN(value)) {
      setError("Please enter a valid number.");
      return;
    }

    setLoading(true);
    try {
      const converted = await convertUnit({
        category: activeKey,
        value,
        from: form.from,
        to: form.to,
      });
      setResult({ value, from: form.from, to: form.to, result: converted });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setForm(getDefaultForm(category));
    setResult(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-12">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h1 className="text-2xl font-semibold text-slate-900">Unit Converter</h1>
        <p className="mt-1 text-sm text-slate-500">
          Convert length, weight, and temperature.
        </p>

        {/* Tabs */}
        <nav className="mt-6 flex gap-1 rounded-lg bg-slate-100 p-1" role="tablist">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              role="tab"
              aria-selected={c.key === activeKey}
              onClick={() => switchCategory(c.key)}
              className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                c.key === activeKey
                  ? "bg-white text-slate-900 shadow-sm"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {c.label}
            </button>
          ))}
        </nav>

        {result ? (
          /* Result view */
          <section className="mt-6">
            <h2 className="text-sm font-medium text-slate-500">
              Result of your calculation
            </h2>
            <p className="mt-3 text-2xl font-semibold break-words text-slate-900">
              <span className="whitespace-nowrap">
                {numberFormat.format(result.value)} {getUnitSymbol(activeKey, result.from)}
              </span>
              <span className="mx-2 text-slate-400">=</span>
              <span className="whitespace-nowrap">
                {numberFormat.format(result.result)} {getUnitSymbol(activeKey, result.to)}
              </span>
            </p>
            <button
              type="button"
              onClick={handleReset}
              className="mt-6 w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700"
            >
              Reset
            </button>
          </section>
        ) : (
          /* Form view */
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="value" className="block text-sm font-medium text-slate-700">
                Enter the {category.label.toLowerCase()} to convert
              </label>
              <input
                id="value"
                type="number"
                step="any"
                inputMode="decimal"
                value={form.value}
                onChange={updateField("value")}
                placeholder="e.g. 10"
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
              />
            </div>

            <div className="flex items-end gap-2">
              <div className="min-w-0 flex-1">
                <label htmlFor="from" className="block text-sm font-medium text-slate-700">
                  From
                </label>
                <select
                  id="from"
                  value={form.from}
                  onChange={updateField("from")}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  {category.units.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={swapUnits}
                title="Swap units"
                aria-label="Swap units"
                className="mb-0.5 rounded-lg border border-slate-300 px-3 py-2 text-slate-600 hover:bg-slate-50"
              >
                ⇄
              </button>

              <div className="min-w-0 flex-1">
                <label htmlFor="to" className="block text-sm font-medium text-slate-700">
                  To
                </label>
                <select
                  id="to"
                  value={form.to}
                  onChange={updateField("to")}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
                >
                  {category.units.map((u) => (
                    <option key={u.value} value={u.value}>
                      {u.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Converting..." : "Convert"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
