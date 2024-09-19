'use client'
import React, { useState, useEffect } from 'react';
import { db } from './firebase'; // Ensure db is initialized properly
import { collection, addDoc, onSnapshot, doc, deleteDoc } from 'firebase/firestore'; // Import Firestore methods

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-800">
      <div className="z-10 w-full max-w-md p-4 bg-slate-800 rounded-lg text-white">
        <h1 className="text-4xl p-4 text-center">Expense Tracker</h1>
        <form className="grid grid-cols-6 items-center text-white mb-4">
          <input
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            className="col-span-3 p-3 border bg-slate-700 text-white"
            type="text"
            placeholder="Enter item"
          />
          <input
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            className="col-span-2 p-3 border bg-slate-700 text-white"
            type="number"
            placeholder="Enter $"
          />
          <button
            onClick={addItem}
            className="text-white bg-slate-950 hover:bg-slate-900 p-3 text-xl"
            type="submit"
          >
            +
          </button>
        </form>
        <ul>
          {items.map((item) => (
            <li
              key={item.id}
              className="my-4 w-full flex justify-between bg-slate-950"
            >
              <div className="p-4 w-full flex justify-between">
                <span className="capitalize text-white">{item.name}</span>
                <span className="text-white">${item.price}</span>
              </div>
              <button
                onClick={() => deleteItem(item.id)}
                className="ml-8 p-4 border-1-2 border-slate-900 hover:bg-slate-900 w-16 text-white"
              >
                X
              </button>
            </li>
          ))}
        </ul>
        {items.length < 1 ? (
          ''
        ) : (
          <div className="flex justify-between p-3 text-white">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        )}
      </div>
    </div>
  );
}



