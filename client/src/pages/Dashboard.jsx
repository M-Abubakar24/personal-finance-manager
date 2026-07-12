import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import ExpenseChart from "../components/ExpenseChart";
function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [transactions, setTransactions] = useState([]);

const [form, setForm] = useState({
  title: "",
  amount: "",
  type: "income",
  category: "",
});

const [editingId, setEditingId] = useState(null);

const handleEdit = (transaction) => {
  setEditingId(transaction._id);

  setForm({
    title: transaction.title,
    amount: transaction.amount,
    type: transaction.type,
    category: transaction.category,
  });
};

const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]: e.target.value,
  });
};

  // Fetch Transactions
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
    fetchTransactions();
  }, []);

  // Handle Form Input
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingId) {
      await api.put(
        `/transactions/${editingId}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingId(null);
    } else {
      await api.post(
        "/transactions",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    setForm({
      title: "",
      amount: "",
      type: "income",
      category: "",
    });

    fetchTransactions();
  } catch (err) {
    console.log(err);
    alert(
      err.response?.data?.message ||
        "Operation Failed"
    );
  }
};
  // Delete Transaction
 const deleteTransaction = async (id) => {
  try {
    await api.delete(`/transactions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchTransactions();
  } catch (err) {
    console.log(err);
    alert("Failed to delete transaction");
  }
};
  // Calculations
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expenses;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white max-w-6xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">
          Welcome, {user?.name} 👋
        </h1>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-green-500 text-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">
              Total Income
            </h2>
            <p className="text-3xl mt-4">
              Rs. {income}
            </p>
          </div>

          <div className="bg-red-500 text-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">
              Total Expenses
            </h2>
            <p className="text-3xl mt-4">
              Rs. {expenses}
            </p>
          </div>

          <div className="bg-blue-500 text-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-bold">
              Balance
            </h2>
            <p className="text-3xl mt-4">
              Rs. {balance}
            </p>
          </div>
        </div>

        {/* Add Transaction */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Add Transaction
          </h2>

          <form
            onSubmit={handleSubmit}
            className="grid md:grid-cols-4 gap-4"
          >
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
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

            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="border p-3 rounded bg-white dark:bg-gray-700 dark:text-white"
            >
              <option value="income">
                Income
              </option>
              <option value="expense">
                Expense
              </option>
            </select>

            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="border p-3 rounded bg-white dark:bg-gray-700 dark:text-white"
            />

          <button
  type="submit"
  className="bg-blue-600 text-white py-3 rounded md:col-span-4"
>
  {editingId
    ? "Update Transaction"
    : "Add Transaction"}
</button>
          </form>
        </div>
  {/* Transaction History */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h2 className="text-2xl font-bold mb-4">
            Transaction History
          </h2>

          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Action</th>
                </tr>
              </thead>

              <tbody>
  {transactions.map((t) => (
    <tr key={t._id} className="border-b">
      <td className="p-2">{t.title}</td>

      <td className="p-2">{t.category}</td>

      <td className="p-2 capitalize">
        {t.type}
      </td>

      <td className="p-2">
        Rs. {t.amount}
      </td>

      <td className="p-2">
        <button
          onClick={() => handleEdit(t)}
          className="bg-yellow-500 text-white px-3 py-1 rounded mr-2 hover:bg-yellow-600"
        >
          Edit
        </button>

        <button
          onClick={() => deleteTransaction(t._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  ))}
</tbody>
</table>
)}
        </div>

        {/* Expense Chart */}
        <div className="mt-8">
          <ExpenseChart
            transactions={transactions}
          />
        </div>
      </div>
      </>
  );
}

export default Dashboard;