import { useState, useEffect } from 'react';
import { FaExchangeAlt, FaBook } from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/Spinner';

const IssueBook = () => {
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedBook, setSelectedBook] = useState('');
  const [issuing, setIssuing] = useState(false);

  const [returningId, setReturningId] = useState(null);

  const fetchDropdownData = async () => {
    try {
      const [studentsRes, booksRes] = await Promise.all([
        api.get('/auth/students?limit=100'),
        api.get('/books?limit=100'),
      ]);
      setStudents(studentsRes.data.students);
      setBooks(booksRes.data.books.filter((b) => b.availableCopies > 0));
    } catch (error) {
      console.error('Failed to fetch dropdown data', error);
    }
  };

  const fetchIssuedBooks = async () => {
    try {
      const res = await api.get('/issues?status=issued&limit=100');
      setIssuedBooks(res.data.issuedBooks);
    } catch (error) {
      console.error('Failed to fetch issued books', error);
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    await Promise.all([fetchDropdownData(), fetchIssuedBooks()]);
    setLoading(false);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleIssue = async (e) => {
    e.preventDefault();
    setIssuing(true);

    try {
      await api.post('/issues', { studentId: selectedStudent, bookId: selectedBook });
      toast.success('Book issued successfully');
      setSelectedStudent('');
      setSelectedBook('');
      fetchDropdownData();
      fetchIssuedBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to issue book');
    } finally {
      setIssuing(false);
    }
  };

  const handleReturn = async (issuedBookId) => {
    setReturningId(issuedBookId);
    try {
      const res = await api.put(`/issues/${issuedBookId}/return`);
      if (res.data.fine) {
        toast.success(`Returned. Fine of ₹${res.data.fine.amount} applied for ${res.data.fine.daysLate} day(s) late.`);
      } else {
        toast.success('Book returned successfully');
      }
      fetchDropdownData();
      fetchIssuedBooks();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to return book');
    } finally {
      setReturningId(null);
    }
  };

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  if (loading) {
    return <Spinner />;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-1">Issue / Return Books</h1>
      <p className="text-slate-400 text-sm mb-6">Issue books to students and process returns</p>

      {/* Issue form */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8">
        <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
          <FaExchangeAlt size={16} className="text-indigo-400" />
          Issue a Book
        </h2>

        <form onSubmit={handleIssue} className="grid sm:grid-cols-3 gap-4">
          <select
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            required
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select student</option>
            {students.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name} ({s.studentId})
              </option>
            ))}
          </select>

          <select
            value={selectedBook}
            onChange={(e) => setSelectedBook(e.target.value)}
            required
            className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Select book</option>
            {books.map((b) => (
              <option key={b._id} value={b._id}>
                {b.title} ({b.availableCopies} available)
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={issuing}
            className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white font-medium py-2.5 rounded-lg transition-colors"
          >
            {issuing ? 'Issuing...' : 'Issue Book'}
          </button>
        </form>
      </div>

      {/* Currently issued books */}
      <h2 className="text-white font-semibold mb-4">Currently Issued Books</h2>
      {issuedBooks.length === 0 ? (
        <div className="text-center py-16 text-slate-500">
          <FaBook size={32} className="mx-auto mb-3 opacity-50" />
          No books currently issued.
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-800/50 text-slate-400 text-left">
              <tr>
                <th className="px-5 py-3 font-medium">Student</th>
                <th className="px-5 py-3 font-medium">Book</th>
                <th className="px-5 py-3 font-medium">Due Date</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {issuedBooks.map((issue) => (
                <tr key={issue._id}>
                  <td className="px-5 py-4 text-white">
                    {issue.student?.name} <span className="text-slate-500">({issue.student?.studentId})</span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">{issue.book?.title}</td>
                  <td className="px-5 py-4 text-slate-400">{formatDate(issue.dueDate)}</td>
                  <td className="px-5 py-4">
                    {isOverdue(issue.dueDate) ? (
                      <span className="text-red-400 text-xs font-medium bg-red-500/10 px-2.5 py-1 rounded-full">
                        Overdue
                      </span>
                    ) : (
                      <span className="text-green-400 text-xs font-medium bg-green-500/10 px-2.5 py-1 rounded-full">
                        On time
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => handleReturn(issue._id)}
                      disabled={returningId === issue._id}
                      className="text-sm text-indigo-400 hover:text-indigo-300 font-medium disabled:opacity-50"
                    >
                      {returningId === issue._id ? 'Processing...' : 'Mark Returned'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default IssueBook;