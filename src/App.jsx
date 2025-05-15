import { useState, useEffect } from "react";
import { db } from "./data/db";
import Guitar from "./components/Guitar";
import Footer from "./shared/Footer";
import Header from "./shared/Header";

function App() {
  const initialCart = () => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : [];
  };

  const [data, setdata] = useState([]);
  const [cart, setCart] = useState(initialCart);

  useEffect(() => {
    setdata(db);
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      saveLocalStorage();
      return;
    }
    saveLocalStorage();
  }, [cart]);

  const addToCart = (guitar) => {
    const itemExists = cart.findIndex((item) => item.id === guitar.id);

    if (itemExists < 0) {
      guitar.quantity = 1;
      setCart([...cart, guitar]);
      return;
    }

    if (cart[itemExists].quantity >= 5) {
      return;
    }
    const updateCart = [...cart];
    updateCart[itemExists].quantity++;
    setCart(updateCart);
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id != id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const saveLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const increaseAndDecreaseQuantity = (id, type) => {
    const updateCart = cart.map((item) => {
      if (item.id == id) {
        if (!type && item.quantity > 1) {
          item.quantity--;
        }

        if (type && item.quantity < 5) {
          item.quantity++;
        }
      }
      return item;
    });
    setCart(updateCart);
  };

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        increaseAndDecreaseQuantity={increaseAndDecreaseQuantity}
        clearCart={clearCart}
      ></Header>

      <main className="container-xl mt-5">
        <h2 className="text-center">Nuestra Colección</h2>

        <div className="row mt-5">
          {data.length != 0 ? (
            data.map((item) => (
              <Guitar
                key={item.id}
                guitar={item}
                addToCart={addToCart}
              ></Guitar>
            ))
          ) : (
            <></>
          )}
        </div>
      </main>

      <Footer></Footer>
    </>
  );
}

export default App;
