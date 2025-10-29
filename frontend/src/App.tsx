
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Cart from './pages/Cart'
import { ProductProvider } from './context/contextManager'
import Checkout from './pages/Checkout'


function App() {


  return (
    <>
      <ProductProvider>
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />

        </Routes>
      </ProductProvider>
    </>
  )
}

export default App
