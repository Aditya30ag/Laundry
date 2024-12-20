"use client";
import React, { useState, useEffect } from 'react';
import { ArrowUpDown, Package, PackageCheck } from 'lucide-react';
import LaundryNavbar from '@/components/Navbar';
import Image from 'next/image';

const InventoryTracker = () => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submittedOn, setsubmittedOn] = useState("");
  const userId=localStorage.getItem('userId');
  const fetchUserItems = async () => {
    try {
      const response = await fetch(`/api/getuseritems?userId=${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user items');
      }
      const result = await response.json();
      setItems(result.data);
      setsubmittedOn(result.submittedOn);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching user items:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserItems();
  }, [userId]);

  const additionalDate = 3; // Increase by 3 Date
  const returnTime = new Date(submittedOn);
  returnTime.setDate(returnTime.getDate() + additionalDate);


  return (
    <div className="relative min-h-screen bg-blue-50">
      <LaundryNavbar />
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/image.png"
          alt="Laundry Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          className="opacity-30"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-6xl mx-auto space-y-8 p-8 z-10">
        <div className='mt-20'>
        <div className="p-6 bg-white shadow-lg rounded-lg border border-red-300 z-20">
          <div className="flex items-center gap-2 mb-4">
            <Package className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold text-blue-800">Laundry Return Time</h2>
          </div>
          <p className="text-sm font-medium text-gray-700">
            {returnTime
              ? `All laundry items are scheduled to be returned on ${new Date(returnTime).toLocaleString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}.`
              : "Return time has not been scheduled yet."}
          </p>
        </div>

        {/* Laundry Items Section */}
        <div className="p-6 bg-white shadow-lg rounded-lg border border-blue-300 mt-2">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-6 w-6 text-red-600" />
            <h2 className="text-xl font-bold text-blue-800">Laundry Items</h2>
          </div>
          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-red-100">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-red-800 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-red-800 uppercase tracking-wider">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50 transition duration-200"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryTracker;
