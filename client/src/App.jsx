import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { InventoryProvider } from './context/InventoryContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Users from './pages/Users';
import Reports from './pages/Reports';
import Settings from './pages/Settings';

export default function App() {
  return (
    <InventoryProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="users" element={<Users />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </InventoryProvider>
  );
}
