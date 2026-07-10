import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

function Transactions() {
  const token = localStorage.getItem("token");
  const [transactions, setTransactions] =
  useState([]);

const [search, setSearch] =
  useState("");

const [typeFilter, setTypeFilter] =
  useState("all");

const [dateFilter, setDateFilter] =
  useState("");

const [editingId, setEditingId] =
  useState(null);

const [form, setForm] = useState({
  title: "",
  amount: "",
  type: "income",
  category: "",
});
  const fetchTransactions = async () => {
    try {
      const res = await api.get(
        "/transactions",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);
const handleChange = (e) => {
  setForm({
    ...form,
    [e.target.name]:
      e.target.value,
  });
};
const updateTransaction =
  async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/transactions/${editingId}`,
        form,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      setEditingId(null);

      setForm({
        title: "",
        amount: "",
        type: "income",
        category: "",
      });

      fetchTransactions();
    } catch (err) {
      console.log(err);
    }
  };
  const deleteTransaction = async (
    id
  ) => {
    try {
      await api.delete(
        `/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTransactions();
    } catch (err) {
      console.log(err);
    }
  };

  const filteredTransactions =
    transactions.filter((t) => {
      const matchesSearch =
        t.title
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        t.category
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const matchesType =
        typeFilter === "all"
          ? true
          : t.type === typeFilter;

      const matchesDate =
  dateFilter === ""
    ? true
    : new Date(t.createdAt)
        .toISOString()
        .split("T")[0] ===
      dateFilter;

return (
  matchesSearch &&
  matchesType &&
  matchesDate
);
    });

  return (
    <>
      <Navbar />

     <div className="max-w-6xl mx-auto p-8 min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <h1 className="text-3xl font-bold mb-6">
          Transactions
        </h1>

       <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded mb-6">
          <div className="grid md:grid-cols-3 gap-4">
  <input
    type="text"
    placeholder="Search..."
    value={search}
    onChange={(e) =>
      setSearch(e.target.value)
    }
   className="border p-3 rounded bg-white dark:bg-gray-700 dark:text-white"
  />

  <select
    value={typeFilter}
    onChange={(e) =>
      setTypeFilter(e.target.value)
    }
    className="border p-3 rounded bg-white dark:bg-gray-700 dark:text-white"
  >
    <option value="all">All</option>
    <option value="income">Income</option>
    <option value="expense">Expense</option>
  </select>

  <input
    type="date"
    value={dateFilter}
    onChange={(e) =>
      setDateFilter(e.target.value)
    }
    className="border p-3 rounded bg-white dark:bg-gray-700 dark:text-white"
  />
</div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          {editingId && (
  <div className="bg-gray-100 p-6 rounded mb-6">
    <h2 className="text-xl font-bold mb-4">
      Edit Transaction
    </h2>

    <form
      onSubmit={updateTransaction}
      className="grid md:grid-cols-4 gap-4"
    >
      <input
        type="text"
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-3 rounded bg-white dark:bg-gray-700 dark:text-white"
      />

      <input
        type="number"
        name="amount"
        value={form.amount}
        onChange={handleChange}
        placeholder="Amount"
        className="border p-3 rounded bg-white dark:bg-gray-700 dark:text-white"
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

      <button className="bg-blue-600 text-white p-3 rounded md:col-span-4">
        Update Transaction
      </button>
    </form>
  </div>
)}
          {filteredTransactions.length ===
          0 ? (
            <p>
              No transactions found.
            </p>
          ) : (
           <table className="w-full text-black dark:text-white">
              <thead>
                <tr className="border-b dark:border-gray-600">
                  <th className="text-left p-2">
                    Title
                  </th>

                  <th className="text-left p-2">
                    Category
                  </th>

                  <th className="text-left p-2">
                    Type
                  </th>

                  <th className="text-left p-2">
                    Amount
                  </th>

                  <th className="text-left p-2">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredTransactions.map(
                  (t) => (
                    <tr
                      key={t._id}
                       className="border-b dark:border-gray-600"
                    >
                      <td className="p-2">
                        {t.title}
                      </td>

                      <td className="p-2">
                        {t.category}
                      </td>

                      <td className="p-2 capitalize">
                        {t.type}
                      </td>

                      <td className="p-2">
                        Rs. {t.amount}
                      </td>

                     <td className="p-2">
  <button
    onClick={() => {
      setEditingId(t._id);

      setForm({
        title: t.title,
        amount: t.amount,
        type: t.type,
        category: t.category,
      });
    }}
    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
  >
    Edit
  </button>

  <button
    onClick={() =>
      deleteTransaction(t._id)
    }
    className="bg-red-500 text-white px-3 py-1 rounded"
  >
    Delete
  </button>
</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Transactions;