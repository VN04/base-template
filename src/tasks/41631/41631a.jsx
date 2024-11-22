import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const restaurants = [
  {
    id: 1,
    name: 'Burger Place',
    menu: [{ id: 101, name: 'Burger', price: 10, image: 'burger.jpg' }],
  },
  {
    id: 2,
    name: 'Pizza Hub',
    menu: [{ id: 201, name: 'Pizza', price: 15, image: 'pizza.jpg' }],
  },
  // Add more restaurants and menu items here...
];

function RestaurantCard({ restaurant, onSelect }) {
  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{restaurant.name}</CardTitle>
      </CardHeader>
      <CardFooter>
        <Button onClick={() => onSelect(restaurant)}>View Menu</Button>
      </CardFooter>
    </Card>
  );
}

function MenuItem({ item, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  return (
    <Card className="mb-4">
      <CardContent>
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-32 object-cover mb-2 cursor-pointer"
        />
        <h3>{item.name}</h3>
        <p>${item.price}</p>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
          min="1"
          className="w-16 p-1 border rounded"
        />
        <Button onClick={() => onAddToCart(item, quantity)}>Add to Cart</Button>
      </CardContent>
    </Card>
  );
}

function App() {
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [cart, setCart] = useState([]);
  const [alert, setAlert] = useState(null);

  const addToCart = (item, quantity) => {
    if (cart.length > 0 && cart[0].restaurantId !== selectedRestaurant.id) {
      setAlert({
        title: 'Different Restaurant',
        description:
          'Your cart contains items from another restaurant. Do you want to empty the cart?',
        onConfirm: () => {
          setCart([{ ...item, quantity, restaurantId: selectedRestaurant.id }]);
          setAlert(null);
        },
        onCancel: () => setAlert(null),
      });
      return;
    }
    setCart((prev) => [
      ...prev,
      { ...item, quantity, restaurantId: selectedRestaurant.id },
    ]);
  };

  const checkout = () => {
    // Simulate order status
    const statuses = ['Cooking', 'In-Transit', 'Picked-Up', 'Delivered'];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    alert(`Order Status: ${status}`);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Food Delivery</h1>
      {alert && (
        <Alert className="mb-4">
          <AlertTitle>{alert.title}</AlertTitle>
          <AlertDescription>{alert.description}</AlertDescription>
          <Button onClick={alert.onConfirm}>Empty Cart</Button>
          <Button onClick={alert.onCancel} variant="outline">
            Back
          </Button>
        </Alert>
      )}
      {!selectedRestaurant ? (
        restaurants.map((r) => (
          <RestaurantCard
            key={r.id}
            restaurant={r}
            onSelect={setSelectedRestaurant}
          />
        ))
      ) : (
        <>
          <Button onClick={() => setSelectedRestaurant(null)} className="mb-4">
            Back to Restaurants
          </Button>
          {selectedRestaurant.menu.map((item) => (
            <MenuItem key={item.id} item={item} onAddToCart={addToCart} />
          ))}
        </>
      )}
      {cart.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl mb-2">Cart</h2>
          {cart.map((item, idx) => (
            <div key={idx}>
              {item.name} x {item.quantity} - ${item.price * item.quantity}
            </div>
          ))}
          <p className="mt-2 font-bold">
            Total: $
            {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
          </p>
          <Button onClick={checkout}>Checkout</Button>
        </div>
      )}
    </div>
  );
}

export default App;
