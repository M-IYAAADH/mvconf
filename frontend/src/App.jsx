import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import New from './pages/New'
import PostDetail from './pages/PostDetail'
import Search from './pages/Search'
import CreatePost from './pages/CreatePost'

function App() {
    return (
        <div className="app">
            <Header />
            <main className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/new" element={<New />} />
                    <Route path="/post/:id" element={<PostDetail />} />
                    <Route path="/search" element={<Search />} />
                    <Route path="/create" element={<CreatePost />} />
                </Routes>
            </main>
        </div>
    )
}

export default App
