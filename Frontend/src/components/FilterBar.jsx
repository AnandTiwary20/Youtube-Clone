import "../styles/FilterBar.css";

const categories = [
  "All", "Music", "Gaming", "Tech", "News", "Movies",
  "Education", "Sports", "Entertainment", "Live"
];

export default function FilterBar({ selected, setSelected }) {
  return (
    <div className="filter-bar">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => setSelected(cat)}
          className={selected === cat ? "active" : ""}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
