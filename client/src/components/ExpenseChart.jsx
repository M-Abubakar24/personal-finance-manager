import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

function ExpenseChart({ transactions }) {
  const expenses = transactions.filter(
    (t) => t.type === "expense"
  );

  const categoryData = {};

  expenses.forEach((t) => {
    categoryData[t.category] =
      (categoryData[t.category] || 0) +
      Number(t.amount);
  });

  const data = Object.keys(categoryData).map(
    (category) => ({
      name: category,
      value: categoryData[category],
    })
  );

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#AF19FF",
  ];

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">
        Expense Breakdown
      </h2>

      {data.length === 0 ? (
        <p>No expense data available.</p>
      ) : (
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={100}
              label
            >
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={
                    COLORS[
                      index % COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>

            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ExpenseChart;