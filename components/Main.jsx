"use client";
import React, { useState, useMemo } from 'react';
import { Plus, Minus, Trash2, AlertCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';

const Main = () => {
  const router = useRouter();

  // Initial clothing and home textile items
  const [clothingItems, setClothingItems] = useState([
    { id: 1, name: 'T-Shirt', quantity: 0, category: 'Tops' },
    { id: 2, name: 'Jeans', quantity: 0, category: 'Bottoms' },
    { id: 3, name: 'Dress Shirts', quantity: 0, category: 'Tops' },
    { id: 4, name: 'Shorts', quantity: 0, category: 'Bottoms' },
    { id: 5, name: 'Socks', quantity: 0, category: 'Accessories' },
    { id: 6, name: 'Kurta', quantity: 0, category: 'Traditional Wear' },
    { id: 7, name: 'Pajama', quantity: 0, category: 'Traditional Wear' },
    { id: 8, name: 'Bedsheet', quantity: 0, category: 'Home Textiles' },
    { id: 9, name: 'Pillow Cover', quantity: 0, category: 'Home Textiles' },
    { id: 10, name: 'Towel', quantity: 0, category: 'Bathroom' },
    { id: 11, name: 'Dupatta', quantity: 0, category: 'Accessories' }
  ]);

  // Calculate total quantity
  const totalQuantity = useMemo(() => 
    clothingItems.reduce((sum, item) => sum + item.quantity, 0),
    [clothingItems]
  );

  // Maximum allowed quantity
  const MAX_QUANTITY = 10;

  // Function to increase quantity of an item
  const incrementQuantity = (id) => {
    // Only increment if total quantity hasn't reached the max
    if (totalQuantity < MAX_QUANTITY) {
      setClothingItems(clothingItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    }
  };

  // Function to decrease quantity of an item
  const decrementQuantity = (id) => {
    setClothingItems(clothingItems.map(item => 
      item.id === id && item.quantity > 0 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    ));
  };

  // Function to remove an item
  const removeItem = (id) => {
    setClothingItems(clothingItems.filter(item => item.id !== id));
  };

  // Function to add a new item
  const addNewItem = () => {
    if (clothingItems.length < 15) {  // Limit total number of items to prevent overcrowding
      const newItem = {
        id: clothingItems.length + 1,
        name: 'New Item',
        quantity: 0,
        category: 'Uncategorized'
      };
      setClothingItems([...clothingItems, newItem]);
    }
  };

  // Submit handler
  const handleSubmit = () => {
    // Check if there are any items with quantity > 0
    const itemsToSubmit = clothingItems.filter(item => item.quantity > 0);
    
    if (itemsToSubmit.length > 0) {
      // Show success toast
      toast.success('Laundry items submitted successfully!', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#4CAF50',
          color: 'white',
        },
        icon: <Check size={24} />,
      });

      // Redirect after a short delay to show the toast
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else {
      // Show error toast if no items are selected
      toast.error('Please select at least one item to submit', {
        duration: 2000,
        position: 'top-center',
        style: {
          background: '#F44336',
          color: 'white',
        }
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-lg rounded-lg">
      {/* Toaster for notifications */}
      <Toaster />

      <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">
        Laundry Management
      </h1>
      
      {/* Total Quantity Warning */}
      {totalQuantity >= MAX_QUANTITY && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4 flex items-center">
          <AlertCircle className="mr-2 text-yellow-600" size={24} />
          <span className="text-yellow-800">
            Maximum quantity limit ({MAX_QUANTITY}) reached!
          </span>
        </div>
      )}
      
      {/* Quantity Tracker */}
      <div className="mb-4 text-center text-blue-700">
        Total Clothes: {totalQuantity} / {MAX_QUANTITY}
      </div>
      
      <div className="space-y-2">
        {clothingItems.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center justify-between p-3 rounded ${
              totalQuantity >= MAX_QUANTITY ? 'bg-gray-100 opacity-50' : 'bg-red-50 border-l-4 border-red-500'
            }`}
          >
            <div className="flex-grow">
              <span className="font-semibold text-blue-800">{item.name}</span>
              <span className="ml-2 text-gray-600">({item.category})</span>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => decrementQuantity(item.id)}
                className="text-red-500 hover:bg-red-100 p-1 rounded"
              >
                <Minus size={16} />
              </button>
              
              <span className="font-bold text-blue-700">{item.quantity}</span>
              
              <button 
                onClick={() => incrementQuantity(item.id)}
                className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                disabled={totalQuantity >= MAX_QUANTITY}
              >
                <Plus size={16} />
              </button>
              
              <button 
                onClick={() => removeItem(item.id)}
                className="text-red-600 hover:bg-red-100 p-1 rounded"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <button 
        onClick={addNewItem}
        className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        disabled={clothingItems.length >= 15}
      >
        Add New Item
      </button>

      <button 
        onClick={handleSubmit}
        className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        disabled={totalQuantity === 0}
      >
        Submit
      </button>

     
    </div>
  );
};

export default Main;