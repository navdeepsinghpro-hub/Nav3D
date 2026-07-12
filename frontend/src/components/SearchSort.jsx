function SearchSort({
  search,
  setSearch,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8">

      <input
        type="text"
        placeholder="🔍 Search Projects..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 bg-gray-900 border border-gray-700 rounded-xl p-3"
      />

      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="bg-gray-900 border border-gray-700 rounded-xl p-3"
      >
        <option value="asc">A → Z</option>
        <option value="desc">Z → A</option>
      </select>

    </div>
  );
}

export default SearchSort;