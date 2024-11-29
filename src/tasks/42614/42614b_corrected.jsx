import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {  Label } from "@/components/ui/label";
import {  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const customers = [
  { id: 1, name: 'John Doe', balance: 1000 },
  { id: 2, name: 'Jane Smith', balance: 1500 },
];

const items = [
  { id: 1, name: 'Laptop', price: 1200 },
  { id: 2, name: 'Mouse', price: 20 },
  { id: 3, name: 'Keyboard', price: 50 },
];

function BillItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <span>{item.name}</span>
      <div>
        <Input 
          type="number" 
          value={item.quantity} 
          onChange={(e) => onQuantityChange(e.target.value)} 
          min="1" 
          className="w-20 mr-2"
        />
        <Button variant="destructive" onClick={onRemove}>Remove</Button>
      </div>
    </div>
  );
}

function BillingApp() {
  const [selectedCustomer, setSelectedCustomer] = useState(customers[0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [bills, setBills] = useState([]);

  const addItem = (item) => {
    if (selectedItems.length < 50) {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const updateItemQuantity = (index, quantity) => {
    const newItems = [...selectedItems];
    newItems[index].quantity = quantity;
    setSelectedItems(newItems);
  };

  const removeItem = (index) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    let total = selectedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total - discount;
  };

  const createBill = () => {
    const bill = {
      items: selectedItems,
      discount,
      total: calculateTotal(),
      customer: selectedCustomer,
    };
    setBills([...bills, bill]);
    // Update customer balance (for demo, not persisting data)
    setSelectedCustomer({ ...selectedCustomer, balance: selectedCustomer.balance + bill.total });
    setSelectedItems([]);
    setDiscount(0);
  };

  return (
    <div className="container mx-auto p-4 sm:p-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Bill</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Customer</Label>
              <Select onValueChange={(value) => setSelectedCustomer(customers.find(c => c.id === parseInt(value)))}>
                <SelectTrigger>
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
              <Label>Add Item</Label>
              <Select onValueChange={(value) => addItem(items.find(i => i.id === parseInt(value)))}>
                <SelectTrigger>
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
          </div>
          <div className="mt-4">
            {selectedItems.map((item, index) => (
              <BillItem 
                key={item.id} 
                item={item} 
                onQuantityChange={(quantity) => updateItemQuantity(index, parseInt(quantity))} 
                onRemove={() => removeItem(index)}
              />
            ))}
          </div>
          <div className="mt-4">
            <Label>Discount</Label>
            <Input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} placeholder="Enter discount" />
          </div>
          <Button className="mt-4" onClick={createBill} disabled={selectedItems.length === 0}>Create Bill</Button>
        </CardContent>
      </Card>

      <div className="mt-8">
        {bills.map((bill, idx) => (
          <Card key={idx} className="mb-4">
            <CardHeader>
              <CardTitle>Bill for {bill.customer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Items: {bill.items.length}</p>
              <p>Total Quantity: {bill.items.reduce((acc, item) => acc + item.quantity, 0)}</p>
              <p>Discount: ${bill.discount}</p>
              <p>Total: ${bill.total}</p>
              <p>Customer New Balance: ${bill.customer.balance + bill.total}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}


export default function App() {
  return <BillingApp />;
}