import { Link } from 'react-router-dom'
export function Dashboard() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-2">Drama tutor</h1>
      <p className="text-gray-500 mb-6">Component 1 Drama — Hamlet &amp; The Duchess of Malfi</p>
      <Link to="/revision"
        className="inline-block bg-[#0071E3] text-white px-5 py-2.5 rounded-xl
                   font-medium hover:bg-[#0077ED] transition-colors">
        Start revising →
      </Link>
    </div>
  )
}
