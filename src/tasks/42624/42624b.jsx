import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const categories = ['clothing', 'beauty', 'footwear', 'sunglasses', 'home accessories'];

const products = {
  clothing: [
    { id: 1, name: "Cotton T-Shirt", price: 15, sizes: ['S', 'M', 'L', 'XL'], image: "tshirt.jpg" },
    // ... more products
  ],
  // ... other categories with products
};

function ProductCard({ product, onAddToCart }) {
  const [size, setSize] = useState('M');

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      </CardHeader>
      <CardContent>
        <CardDescription>Price: ${product.price}</CardDescription>
        <div className="mt-2">
          <Label>Size</Label>
          <select value={size} onChange={(e) => setSize(e.target.value)} className="mt-1 block w-full">
            {product.sizes.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => onAddToCart(product, size)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}

function Category({ category }) {
  const [selectedCategory, setSelectedCategory] = useState(null);

  return (
    <div>
      <Button onClick={() => setSelectedCategory(category)} className="m-2">
        {category}
      </Button>
      {selectedCategory === category && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products[category].map(product => (
            <ProductCard key={product.id} product={product} onAddToCart={(prod, size) => {
              // Simplified cart logic, no local storage or external state management
              alert(`Added ${prod.name} size ${size} to cart!`);
            }} />
          ))}
        </div>
      )}
    </div>
  );
}

function Cart({ onClose }) {
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-4 rounded-lg w-full max-w-md">
        <h2 className="text-xl mb-4">Your Cart</h2>
        {/* Here you would map over cart items, for simplicity we're not managing state */}
        <div className="mb-4">
          <Label htmlFor="address">Address</Label>
          <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter Address" />
        </div>
        <div className="mb-4">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter Phone Number" />
        </div>
        <div className="flex justify-between">
          <Button onClick={onClose}>Close</Button>
          <Button onClick={() => alert('Checkout with total: $0')}>Checkout</Button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">E-Commerce App</h1>
        <Badge onClick={() => setShowCart(true)} className="cursor-pointer">Cart</Badge>
      </header>
      <div className="space-y-4">
        {categories.map(category => <Category key={category} category={category} />)}
      </div>
      {showCart && <Cart onClose={() => setShowCart(false)} />}
    </div>
  );
}