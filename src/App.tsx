import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import CategoryPage from './pages/CategoryPage'
import ArticleDetail from './pages/ArticleDetail'
import SearchPage from './pages/SearchPage'
import AdminPage from './pages/AdminPage'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/article/:id" element={<ArticleDetail />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
