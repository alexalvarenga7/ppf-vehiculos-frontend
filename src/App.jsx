import { Routes, Route } from 'react-router-dom'
import { Link } from 'react-router-dom'
import Vehiculos from './pages/Vehiculos'
import Registros from './pages/Registros'
import Historial from './pages/Historial'

function App() {
  return (
    <div>
      <nav style={{
        background: '#1e1e2e',
        padding: '1rem 2rem',
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        borderBottom: '1px solid #313244'
      }}>
        <h2 style={{ color: '#cdd6f4', margin: 0 }}>PPF Vehículos</h2>
        <Link to="/" style={{ color: '#89b4fa', textDecoration: 'none' }}>Vehículos</Link>
        <Link to="/registros" style={{ color: '#89b4fa', textDecoration: 'none' }}>Nuevo Registro</Link>
        <Link to="/historial" style={{ color: '#89b4fa', textDecoration: 'none' }}>Historial</Link>
      </nav>

      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<Vehiculos />} />
          <Route path="/registros" element={<Registros />} />
          <Route path="/historial" element={<Historial />} />
        </Routes>
      </div>
    </div>
  )
}

export default App