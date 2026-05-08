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
import { Framework } from './pages/Framework'
import { ActScenePage } from './pages/ActScenePage'
import { RecallGuidePage } from './pages/RecallGuidePage'
import DramaCompass from './components/DramaCompass'
import { EssayBuilderHomePage } from './features/essayBuilder/pages/EssayBuilderHomePage'
import { PathSelectionPage } from './features/essayBuilder/pages/PathSelectionPage'
import { FeedbackPage } from './features/essayBuilder/pages/FeedbackPage'
import { SkeletonPage } from './features/essayBuilder/pages/SkeletonPage'

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
            <Route path="/acts"     element={<ActScenePage />} />
            <Route path="/guide"    element={<RecallGuidePage />} />
            <Route path="/essay-builder" element={<EssayBuilderHomePage />} />
            <Route path="/essay-builder/:attemptId" element={<PathSelectionPage />} />
            <Route path="/essay-builder/:attemptId/feedback/:choiceId" element={<FeedbackPage />} />
            <Route path="/essay-builder/:attemptId/skeleton" element={<SkeletonPage />} />
            <Route path="/framework" element={<Framework />} />
            <Route path="/compass"  element={<DramaCompass />} />
            <Route path="*"         element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </PlayProvider>
    </QueryClientProvider>
  )
}
