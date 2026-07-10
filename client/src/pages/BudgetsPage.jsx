import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function BudgetsPage() {
  const token = localStorage.getItem("token");
  const [budgets, setBudgets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    category: "",
    amount: "",
  });

  const fetchBudgets = async () => {
    try {
      const res = await api.get("/budgets", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setBudgets(res.data);
    } catch (err) {
      console.log(err);
    }
  };
const fetchTransactions = async () => {
  try {
    const res = await api.get("/transactions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setTransactions(res.data);
  } catch (err) {
    console.log(err);
  }
};
 useEffect(() => {
  fetchBudgets();
  fetchTransactions();
}, []);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post(
        "/budgets",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        category: "",
        amount: "",
      });

      fetchBudgets();
    } catch (err) {
      console.log(err);
    }
  };


  const deleteBudget = async (id) => {
    try {
      await api.delete(
        `/budgets/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchBudgets();
    } catch (err) {
      console.log(err);
    }
  };
const getSpentAmount = (category) => {
  return transactions
    .filter(
      (t) =>
        t.type === "expense" &&
        t.category === category
    )
    .reduce(
      (sum, t) =>
        sum + Number(t.amount),
      0
    );
};
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
  <div className="max-w-5xl mx-auto p-8 text-black dark:text-white">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">
          Budget Management
          </h1>

      <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
            Add Budget
            </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="border p-3 rounded bg-white dark:bg-gray-700 dark:text-white"
              required
            />

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="Amount"
              className="border p-3 rounded bg-white dark:bg-gray-700 dark:text-white"
              required
            />

            <button
             className="bg-blue-600 hover:bg-blue-700 text-white rounded p-3"
            >
              Add Budget
            </button>
          </form>
        </div>

       <div className="bg-white dark:bg-gray-800 text-black dark:text-white rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">
                Budget List
              </h2>

          {budgets.length === 0 ? (
            <p>No budgets yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr  className="border-b dark:border-gray-700">
                <th className="text-left p-2">
  Category
</th>
<th className="text-left p-2">
  Budget
</th>

<th className="text-left p-2">
  Spent
</th>

<th className="text-left p-2">
  Remaining
</th>

<th className="text-left p-2">
  Progress
</th>

<th className="text-left p-2">
  Action
</th>
                </tr>
              </thead>

            <tbody>
  {budgets.map((budget) => {
    const spent = getSpentAmount(
      budget.category
    );

    const remaining =
      budget.amount - spent;

    const percentage =
      budget.amount > 0
        ? Math.min(
            (spent / budget.amount) * 100,
            100
          )
        : 0;

    return (
      <tr
        key={budget._id}
        className="border-b dark:border-gray-700"
      >
        <td className="p-2">
          {budget.category}
        </td>

        <td className="p-2">
          Rs. {budget.amount}
        </td>

        <td className="p-2">
          Rs. {spent}
        </td>

        <td className="p-2">
          Rs. {remaining}
        </td>

        <td className="p-2 w-64">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{
                width: `${percentage}%`,
              }}
            ></div>
          </div>

          <p className="text-sm mt-1">
            {percentage.toFixed(0)}%
          </p>
        </td>

        <td className="p-2">
          <button
            onClick={() =>
              deleteBudget(
                budget._id
              )
            }
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </td>
      </tr>
    );
  })}
</tbody>
            </table>
          )}
        </div>
      </div>
        </div>
    </>
  );
}

export default BudgetsPage;