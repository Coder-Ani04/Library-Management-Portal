import { useState, useEffect } from 'react';
import { FaSearch, FaBook } from 'react-icons/fa';
import api from '../../services/api';

const SearchBooks = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        setCategories(res.data.categories);
      } catch (error) {
        console.error('Failed to fetch categories', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (categoryFilter) params.append('category', categoryFilter);
        params.append('page', page);
        params.append('limit', 9);

        const res = await api.get(`/books?${params.toString()}`);
        setBooks(res.data.books);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.error('Failed to fetch books', error);
      } finally {
        setLoading(false);
      }
    };

    // Debounce search — wait 400ms after typing stops before firing the request
    const timer = setTimeout(fetchBooks, 400);
    return () => clearTimeout(timer);
  }, [search, categoryFilter, page]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Search Books</h1>
      <p className="text-slate-400 text-sm mb-6">Browse and search the library catalog</p>

      {/* Search + filter bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by title or author..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
          className="bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Book grid */}
      {loading ? (
        <p className="text-slate-400">Loading books...</p>
      ) : books.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaBook size={32} className="mx-auto mb-3 opacity-50" />
          No books found matching your search.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <div
              key={book._id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors"
            >
              <h3 className="text-white font-semibold mb-1 line-clamp-1">{book.title}</h3>
              <p className="text-slate-400 text-sm mb-3">{book.author}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full">
                  {book.category?.name}
                </span>
                <span
                  className={book.availableCopies > 0 ? 'text-green-400' : 'text-red-400'}
                >
                  {book.availableCopies > 0
                    ? `${book.availableCopies} available`
                    : 'Not available'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-700"
          >
            Previous
          </button>
          <span className="text-slate-400 text-sm">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm bg-slate-900 border border-slate-800 rounded-lg text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:border-slate-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBooks;