export default function Wishlist({ wishlist, loading }) {
  return (
    <div className="mt-8 mx-10">
      <h1 className="text-3xl font-bold  leading-tight text-center">
        Wishlist
      </h1>
      <div className="overflow-hidden rounded-xl bg-white shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Symbol
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                  Quantity
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Amount
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Price
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Total Value
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Gain/Loss
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {wishlist.map((data) => (
                <tr
                  key={data.symbol}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {data.symbol}
                      </span>
                      <span className="text-xs text-gray-500">
                        {data.companyName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {data.quantity}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    ${data.amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-gray-900">
                    Current Market Price
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                    ${data.quantity * data.amount}
                  </td>
                  <td className="px-6 py-4 text-right text-sm font-medium">
                    <span className="color-green">Gain</span>/
                    <span className="color-red">Loss</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        // onClick={() => onEdit(data)}
                        className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors duration-150"
                      >
                        Edit
                      </button>
                      <button
                        // onClick={() => onDelete(data)}
                        className={`px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors duration-150 ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
