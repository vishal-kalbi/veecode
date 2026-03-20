import { FiSearch } from 'react-icons/fi';

export default function ChallengeFilters({ filters, onChange }) {
  const handleChange = (key, value) => {
    onChange({ ...filters, [key]: value, page: 1 });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-6">
      <div className="relative flex-1">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search challenges..."
          value={filters.search || ''}
          onChange={(e) => handleChange('search', e.target.value)}
          className="w-full bg-gray-800 text-white pl-10 pr-4 py-2.5 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
        />
      </div>
      <select
        value={filters.difficulty || ''}
        onChange={(e) => handleChange('difficulty', e.target.value)}
        className="bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
      >
        <option value="">All Difficulty</option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>
      <select
        value={filters.topic || ''}
        onChange={(e) => handleChange('topic', e.target.value)}
        className="bg-gray-800 text-white px-4 py-2.5 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
      >
        <option value="">All Topics</option>
        <option value="arrays">Arrays</option>
        <option value="strings">Strings</option>
        <option value="math">Math</option>
        <option value="dp">Dynamic Programming</option>
        <option value="stacks">Stacks</option>
        <option value="graphs">Graphs</option>
        <option value="searching">Searching</option>
      </select>
    </div>
  );
}
