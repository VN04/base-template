import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const categories = ["Clothing", "Beauty", "Footwear", "Sunglasses", "Home Accessories"];

const products = {
  Clothing: [
    { id: 1, name: "T-Shirt", price: 19.99, image: "https://via.placeholder.com/150" },
    { id: 2, name: "Jeans", price: 49.99, image: "https://via.placeholder.com/150" },
    { id: 3, name: "Dress", price: 39.99, image: "https://via.placeholder.com/150" },
    { id: 4, name: "Jacket", price: 79.99, image: "https://via.placeholder.com/150" },
    { id: 5, name: "Sweater", price: 29.99, image: "https://via.placeholder.com/150" },
  ],
  Beauty: [
    { id: 6, name: "Lipstick", price: 14.99, image: "https://via.placeholder.com/150" },
    { id: 7, name: "Foundation", price: 24.99, image: "https://via.placeholder.com/150" },
    { id: 8, name: "Mascara", price: 9.99, image: "https://via.placeholder.com/150" },
    { id: 9, name: "Eyeshadow Palette", price: 34.99, image: "https://via.placeholder.com/150" },
    { id: 10, name: "Skincare Set", price: 59.99, image: "https://via.placeholder.com/150" },
  ],
  Footwear: [
    { id: 11, name: "Sneakers", price: 69.99, image: "https://via.placeholder.com/150" },
    { id: 12, name: "Boots", price: 89.99, image: "https://via.placeholder.com/150" },
    { id: 13, name: "Sandals", price: 29.99, image: "https://via.placeholder.com/150" },
    { id: 14, name: "Heels", price: 59.99, image: "https://via.placeholder.com/150" },
    { id: 15, name: "Loafers", price: 49.99, image: "https://via.placeholder.com/150" },
  ],
  Sunglasses: [
    { id: 16, name: "Aviator", price: 129.99, image: "https://via.placeholder.com/150" },
    { id: 17, name: "Wayfarer", price: 99.99, image: "https://via.placeholder.com/150" },
    { id: 18, name: "Cat Eye", price: 79.99, image: "https://via.placeholder.com/150" },
    { id: 19, name: "Round", price: 89.99, image: "https://via.placeholder.com/150" },
    { id: 20, name: "Sport", price: 109.99, image: "https://via.placeholder.com/150" },
  ],
  "Home Accessories": [
    { id: 21, name: "Throw Pillow", price: 19.99, image: "https://via.placeholder.com/150" },
    { id: 22, name: "Vase", price: 29.99, image: "https://via.placeholder.com/150" },
    { id: 23, name: "Wall Clock", price: 39.99, image: "https://via.placeholder.com/150" },
    { id: 24, name: "Picture Frame", price: 24.99, image: "https://via.placeholder.com/150" },
    { id: 25, name: "Candle Set", price: 34.99, image: "https://via.placeholder.com/150" },
  ],
};

function ProductCard({ product, addToCart }) {
  const [size, setSize] = useState("m");

  return (
    <Card className="w-full sm:w-64 m-2">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>${product.price.toFixed(2)}</CardDescription>
      </CardHeader>
      <CardContent>
        <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-4" />
        <Select value={size} onValueChange={setSize}>
          <SelectTrigger>
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            {["s", "m", "l", "xl"].map((s) => (
              <SelectItem key={s} value={s}>
                {s.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
      <CardFooter>
        <Button onClick={() => addToCart({ ...product, size })}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

function CartItem({ item, removeFromCart }) {
  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <h3>{item.name}</h3>
        <p>Size: {item.size.toUpperCase()}</p>
        <p>${item.price.toFixed(2)}</p>
      </div>
      <Button variant="destructive" onClick={() => removeFromCart(item)}>
        Remove
      </Button>
    </div>
  );
}

function Checkout({ cart, total }) {
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order placed! Total: $${total.toFixed(2)}\nShipping to: ${address}\nPhone: ${phone}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required />
      </div>
      <div>Total: ${total.toFixed(2)}</div>
      <Button type="submit">Place Order</Button>
    </form>
  );
}

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (product) => {
    setCart(cart.filter((item) => item !== product));
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">E-Commerce App</h1>
      {!showCart && !showCheckout && (
        <>
          <div className="flex flex-wrap justify-center mb-4">
            {categories.map((category) => (
              <Button key={category} onClick={() => setSelectedCategory(category)} className="m-1">
                {category}
              </Button>
            ))}
          </div>
          {selectedCategory && (
            <div className="flex flex-wrap justify-center">
              {products[selectedCategory].map((product) => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))}
            </div>
          )}
        </>
      )}
      {showCart && !showCheckout && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {cart.map((item, index) => (
            <CartItem key={index} item={item} removeFromCart={removeFromCart} />
          ))}
          <div className="mt-4">
            <Button onClick={() => setShowCheckout(true)}>Proceed to Checkout</Button>
          </div>
        </div>
      )}
      {showCheckout && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          <Checkout cart={cart} total={total} />
        </div>
      )}
      <div className="fixed bottom-4 right-4">
        <Button onClick={() => {
          setShowCart(!showCart);
          setShowCheckout(false);
          setSelectedCategory(null);
        }}>
          {showCart ? "Continue Shopping" : `Cart (${cart.length})`}
        </Button>
      </div>
    </div>
  );
}