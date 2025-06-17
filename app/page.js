
'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { db } from './firebase'; // Ensure db is initialized properly
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore'; // Import Firestore methods
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'; // Import Recharts components

export default function Home() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [newItem, setNewItem] = useState({ name: '', price: '' });

  // Add item to database
  const addItem = async (e) => {
    e.preventDefault();
    if (newItem.name.trim() !== '' && newItem.price !== '') {
      try {
        // Add new item to Firestore
        await addDoc(collection(db, 'items'), {
          name: newItem.name.trim(),
          price: parseFloat(newItem.price), // Convert price to number
          timestamp: new Date(), // Added a timestamp for potential future charts (e.g., time-based)
        });
        
        // Clear form fields
        setNewItem({ name: '', price: '' });
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    }
  };

  // Delete item from database
  const deleteItem = async (id) => {
    try {
      await deleteDoc(doc(db, 'items', id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  // Use onSnapshot to fetch real-time data
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'items'), (snapshot) => {
      const itemsArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(itemsArray);

      // Calculate total
      const totalPrice = itemsArray.reduce((acc, item) => acc + parseFloat(item.price || 0), 0); // Ensure price is a number
      setTotal(totalPrice);
    });

    // Cleanup listener
    return () => unsubscribe();
  }, []);

  // --- Chart Data Preparation ---
  // Prepare data for the Pie Chart by grouping items by name and summing prices
  const chartData = useMemo(() => {
    const groupedData = items.reduce((acc, item) => {
      const name = item.name.toLowerCase(); // Group case-insensitively
      if (!acc[name]) {
        acc[name] = { name: item.name, value: 0 };
      }
      acc[name].value += parseFloat(item.price || 0);
      return acc;
    }, {});
    // Sort items by value (spending) in descending order for better visualization
    return Object.values(groupedData).sort((a, b) => b.value - a.value); 
  }, [items]);

  // Define a color palette for the chart slices
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#8dd1e1', '#b5a6ed', '#e0b58e'];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800 p-4">
      <div className="z-10 w-full max-w-md p-6 bg-slate-800 rounded-lg shadow-xl text-white">
        <h1 className="text-4xl p-4 text-center mb-6 border-b border-gray-700">Expense Tracker</h1>

        {/* Input Form */}
        <form className="grid grid-cols-6 gap-2 items-center text-white mb-6">
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="col-span-3 p-3 border border-slate-700 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Enter item (e.g., Groceries)"
          />
          <input
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="col-span-2 p-3 border border-slate-700 bg-slate-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="number"
            placeholder="Amount (UGX)" 
          />
          <button
            onClick={addItem}
            className="text-white bg-blue-600 hover:bg-blue-700 p-3 text-xl rounded-md transition-colors duration-200"
            type="submit"
          >
            +
          </button>
        </form>

        {/* Expense List */}
        <div className="mb-6 max-h-60 overflow-y-auto custom-scrollbar"> {/* Added max-h and overflow for scroll */}
          <h2 className="text-2xl mb-4 border-b border-gray-700 pb-2">Recent Expenses</h2>
          <ul>
            {items.map((item) => (
              <li
                key={item.id}
                className="my-2 p-3 w-full flex justify-between items-center bg-slate-900 rounded-md shadow-sm"
              >
                <div className="w-full flex justify-between items-center">
                  <span className="capitalize text-lg">{item.name}</span>
                  <span className="text-lg font-bold">$ {item.price.toFixed(2)}</span>
                </div>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="ml-4 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors duration-200 flex items-center justify-center text-sm"
                  aria-label={`Delete ${item.name}`} // Accessibility improvement
                >
                  {/* Delete (X) Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Total Display */}
        {items.length > 0 && (
          <div className="flex justify-between p-3 border-t border-gray-700 mt-4 text-white text-xl font-semibold">
            <span>Total Spending</span>
            <span>$ {total.toFixed(2)}</span>
          </div>
        )}

        {/* --- Chart Section --- */}
        {chartData.length > 0 && (
          <div className="mt-8 text-center bg-slate-900 p-4 rounded-lg shadow-inner">
            <h2 className="text-2xl mb-4 border-b border-gray-700 pb-2">Spending Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%" // Center X position
                  cy="50%" // Center Y position
                  outerRadius={80} // Size of the pie chart
                  fill="#8884d8" // Default fill color
                  dataKey="value" // Key from your data to determine slice size
                  labelLine={false} // Hide lines connecting labels to slices
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Custom label for slices
                >
                  {/* Map over data to apply colors to slices */}
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `UGX ${value.toFixed(2)}`}/> {/* Tooltip on hover */}
                <Legend /> {/* Labels for each slice */}
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}