import { LANGUAGES } from '../utils/constants';

export default function LanguageSelector({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="bg-gray-800 text-white text-sm px-3 py-2 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
    >
      {LANGUAGES.map((lang) => (
        <option key={lang.id} value={lang.id}>
          {lang.name}
        </option>
      ))}
    </select>
  );
}
