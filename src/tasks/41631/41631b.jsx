import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const restaurants = [
  { id: 1, name: 'Burger Palace', image: '🍔' },
  { id: 2, name: 'Pizza Heaven', image: '🍕' },
  { id: 3, name: 'Sushi World', image: '🍣' },
  { id: 4, name: 'Taco Town', image: '🌮' },
  { id: 5, name: 'Pasta Paradise', image: '🍝' },
  { id: 6, name: 'Salad Bar', image: '🥗' },
  { id: 7, name: 'Steak House', image: '🥩' },
  { id: 8, name: 'Seafood Shack', image: '🦞' },
  { id: 9, name: 'Vegetarian Delight', image: '🥬' },
  { id: 10, name: 'Ice Cream Dream', image: '🍦' },
];

const menuItems = {
  1: [
    { id: 1, name: 'Classic Burger', price: 10, image: '🍔' },
    { id: 2, name: 'Cheeseburger', price: 12, image: '🧀🍔' },
    { id: 3, name: 'Veggie Burger', price: 11, image: '🥬🍔' },
  ],
  2: [
    { id: 1, name: 'Margherita Pizza', price: 14, image: '🍅🧀🍕' },
    { id: 2, name: 'Pepperoni Pizza', price: 16, image: '🍕' },
    { id: 3, name: 'Vegetarian Pizza', price: 15, image: '🥬🍕' },
  ],
  // ... Add menu items for other restaurants
};

function RestaurantCard({ restaurant, onSelect }) {
  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => onSelect(restaurant)}
    >
      <CardHeader>
        <CardTitle className="text-xl flex items-center">
          <span className="text-4xl mr-2">{restaurant.image}</span>
          {restaurant.name}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

function MenuItem({ item, onAdd }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <Card className="mb-4">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <span className="text-4xl mr-4">{item.image}</span>
          <div>
            <h3 className="font-bold">{item.name}</h3>
            <p>${item.price}</p>
          </div>
        </div>
        <div className="flex items-center">
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="w-16 mr-2"
          />
          <Button onClick={() => onAdd(item, quantity)}>Add</Button>
        </div>
      </CardContent>
    </Card>
  );
}

function Cart({ items, total, onCheckout }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cart</CardTitle>
      </CardHeader>
      <CardContent>
        {items.map((item) => (
          <div key={item.id} className="flex justify-between mb-2">
            <span>
              {item.name} x{item.quantity}
            </span>
            <span>${item.price * item.quantity}</span>
          </div>
        ))}
      </CardContent>
      <CardFooter className="flex justify-between">
        <strong>Total: ${total}</strong>
        <Button onClick={onCheckout}>Checkout</Button>
      </CardFooter>
    </Card>
  );
}

function OrderStatus({ status }) {
  return (
    <Alert>
      <AlertTitle>Order Status</AlertTitle>
      <AlertDescription>{status}</AlertDescription>
    </Alert>
  );
}

export default function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [orderStatus, setOrderStatus] = useState(null);

  const handleRestaurantSelect = (restaurant) => {
    if (cart.length > 0 && cart[0].restaurantId !== restaurant.id) {
      setShowAlert(true);
    } else {
      setSelectedRestaurant(restaurant);
      setShowAlert(false);
    }
  };

  const handleAddToCart = (item, quantity) => {
    const newItem = { ...item, quantity, restaurantId: selectedRestaurant.id };
    setCart([...cart, newItem]);
  };

  const handleEmptyCart = () => {
    setCart([]);
    setShowAlert(false);
  };

  const handleCheckout = () => {
    const statuses = [
      'Cooking your meal',
      'In-transit',
      'Picked-up',
      'Delivered',
    ];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    setOrderStatus(randomStatus);
    setCart([]);
    setSelectedRestaurant(null);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Food Delivery App</h1>
      {showAlert && (
        <Alert className="mb-4">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>
            You can only order from one restaurant at a time. Do you want to
            empty your cart?
          </AlertDescription>
          <div className="mt-2">
            <Button onClick={() => setShowAlert(false)} className="mr-2">
              Back
            </Button>
            <Button onClick={handleEmptyCart}>Empty Cart</Button>
          </div>
        </Alert>
      )}
      {orderStatus && <OrderStatus status={orderStatus} />}
      {!selectedRestaurant && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {restaurants.map((restaurant) => (
            <RestaurantCard
              key={restaurant.id}
              restaurant={restaurant}
              onSelect={handleRestaurantSelect}
            />
          ))}
        </div>
      )}
      {selectedRestaurant && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {selectedRestaurant.name} Menu
            </h2>
            {menuItems[selectedRestaurant.id].map((item) => (
              <MenuItem key={item.id} item={item} onAdd={handleAddToCart} />
            ))}
            <Button
              onClick={() => setSelectedRestaurant(null)}
              className="mt-4"
            >
              Back to Restaurants
            </Button>
          </div>
          <div>
            <Cart items={cart} total={total} onCheckout={handleCheckout} />
          </div>
        </div>
      )}
    </div>
  );
}
