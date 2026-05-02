import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PlayProvider } from './contexts/PlayContext'
import { Nav } from './components/Nav'
import { Dashboard } from './pages/Dashboard'
import { Revision }  from './pages/Revision'
import { Quotes }    from './pages/Quotes'
import { Themes }    from './pages/Themes'
import CriticsView   from './views/CriticsView'
import EssaysView    from './views/EssaysView'
import { Exam }      from './pages/Exam'

const qc = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <PlayProvider>
        <BrowserRouter>
          <Nav />
          <Routes>
            <Route path="/"         element={<Dashboard />} />
            <Route path="/revision" element={<Revision />} />
            <Route path="/quotes"   element={<Quotes />} />
            <Route path="/themes"   element={<Themes />} />
            <Route path="/critics"  element={<CriticsView />} />
            <Route path="/essays"   element={<EssaysView />} />
            <Route path="/exam"     element={<Exam />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PlayProvider>
    </QueryClientProvider>
  )
}
