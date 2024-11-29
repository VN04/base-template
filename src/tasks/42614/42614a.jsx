import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data
const customers = [
  { id: 1, name: "John Doe", balance: 1000 },
  { id: 2, name: "Jane Smith", balance: 1500 },
  { id: 3, name: "Bob Johnson", balance: 2000 },
];

const items = [
  { id: 1, name: "Item 1", price: 10 },
  { id: 2, name: "Item 2", price: 20 },
  { id: 3, name: "Item 3", price: 30 },
  { id: 4, name: "Item 4", price: 40 },
  { id: 5, name: "Item 5", price: 50 },
];

const BillItem = ({ item, quantity, onQuantityChange, onRemove }) => (
  <div className="flex items-center justify-between mb-2">
    <span className="flex-grow">{item.name}</span>
    <Input
      type="number"
      value={quantity}
      onChange={(e) => onQuantityChange(parseInt(e.target.value) || 0)}
      className="w-20 mr-2"
      min="1"
      max="50"
    />
    <Button variant="destructive" size="sm" onClick={onRemove}>
      Remove
    </Button>
  </div>
);

const BillSummary = ({ items, discount, total, customerBalance }) => (
  <Card className="mt-4">
    <CardHeader>
      <CardTitle>Bill Summary</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>Subtotal:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Discount:</span>
          <span>${discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>Total:</span>
          <span>${(total - discount).toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Total Quantity:</span>
          <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>New Customer Balance:</span>
          <span>${(customerBalance + total - discount).toFixed(2)}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function App() {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [discount, setDiscount] = useState(0);

  const handleAddItem = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (item && selectedItems.length < 50) {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleQuantityChange = (index, quantity) => {
    const newItems = [...selectedItems];
    newItems[index].quantity = quantity;
    setSelectedItems(newItems);
  };

  const total = selectedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCreateBill = () => {
    if (selectedCustomer && selectedItems.length > 0) {
      alert("Bill created successfully!");
      setSelectedCustomer(null);
      setSelectedItems([]);
      setDiscount(0);
    } else {
      alert("Please select a customer and add items to the bill.");
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-4">Billing Application</h1>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Create New Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer">Select Customer</Label>
              <Select onValueChange={(value) => setSelectedCustomer(customers.find((c) => c.id === parseInt(value)))}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select a customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id.toString()}>
                      {customer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="item">Add Item</Label>
              <Select onValueChange={(value) => handleAddItem(parseInt(value))}>
                <SelectTrigger id="item">
                  <SelectValue placeholder="Select an item" />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id.toString()}>
                      {item.name} - ${item.price}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="discount">Discount</Label>
              <Input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              {selectedItems.map((item, index) => (
                <BillItem
                  key={index}
                  item={item}
                  quantity={item.quantity}
                  onQuantityChange={(quantity) => handleQuantityChange(index, quantity)}
                  onRemove={() => handleRemoveItem(index)}
                />
              ))}
            </div>
            <Button onClick={handleCreateBill}>Create Bill</Button>
          </div>
        </CardContent>
      </Card>
      {selectedCustomer && (
        <BillSummary
          items={selectedItems}
          discount={discount}
          total={total}
          customerBalance={selectedCustomer.balance}
        />
      )}
    </div>
  );
}