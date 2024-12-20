// "use client";
// import React, { useState, useMemo, useEffect } from 'react';
// import { Plus, Minus, Trash2, AlertCircle, Check } from 'lucide-react';
// import { useRouter } from 'next/navigation';
// import { toast, Toaster } from 'react-hot-toast';
// import Image from 'next/image';
// import LaundryNavbar from './Navbar';

// const Main = ({userId}) => {
//   console.log(userId);
//   const router = useRouter();
//   const [clothingItems, setClothingItems] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitted,setisSubmitted]=useState(false);
//   const [submittedOn,setsubmittedOn]=useState(false);
//   // Fetch user items on component mount
//   useEffect(() => {
//     const fetchUserItems = async () => {
//       try {
//         const response = await fetch(`/api/getuseritems?userId=${userId}`);
        
//         if (!response.ok) {
//           throw new Error('Failed to fetch user items');
//         }
        
//         const result = await response.json();
//         console.log(result.data);
//         console.log(result);
//         setClothingItems(result.data);
//         setisSubmitted(result.isSubmitted);
//         setsubmittedOn(result.submittedOn);
//         setIsLoading(false);
//       } catch (error) {
//         console.error('Error fetching user items:', error);
//         toast.error('Failed to load items. Please try again.', {
//           duration: 2000,
//           position: 'top-center',
//         });
//         setIsLoading(false);
//       }
//     };

//     if (userId) {
//       fetchUserItems();
//     }
//   }, [userId]);

//   // Calculate total quantity
//   const totalQuantity = useMemo(() => 
//     clothingItems.reduce((sum, item) => sum + item.quantity, 0),
//     [clothingItems]
//   );

//   // Maximum allowed quantity
//   const MAX_QUANTITY = 10;

//   // Function to increase quantity of an item
//   const incrementQuantity = (id) => {
//     if (totalQuantity < MAX_QUANTITY) {
//       setClothingItems(clothingItems.map(item => 
//         item.id === id ? { ...item, quantity: item.quantity + 1 } : item
//       ));
//     }
//   };

//   // Function to decrease quantity of an item
//   const decrementQuantity = (id) => {
//     setClothingItems(clothingItems.map(item => 
//       item.id === id && item.quantity > 0 
//         ? { ...item, quantity: item.quantity - 1 } 
//         : item
//     ));
//   };

//   // Function to remove an item
//   const removeItem = (id) => {
//     setClothingItems(clothingItems.filter(item => item.id !== id));
//   };

//   // Function to add a new item
//   const addNewItem = () => {
//     if (clothingItems.length < 15) {
//       const newItem = {
//         id: clothingItems.length + 1,
//         name: 'New Item',
//         quantity: 0,
//         category: 'Uncategorized'
//       };
//       setClothingItems([...clothingItems, newItem]);
//     }
//   };
  
//   // Submit handler
//   const handleSubmit = async () => {
//     const itemsToSubmit = clothingItems.filter(item => item.quantity > 0);
    
//     if (itemsToSubmit.length > 0) {
//       try {
//         const response = await fetch('/api/updateuseritems', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             userId,
//             items: clothingItems
//           }),
//         });

//         if (!response.ok) {
//           throw new Error('Failed to submit items');
//         }

//         // Show success toast
//         toast.success('Laundry items submitted successfully!', {
//           duration: 2000,
//           position: 'top-center',
//           style: {
//             background: '#4CAF50',
//             color: 'white',
//           },
//           icon: <Check size={24} />,
//         });
//         console.log(clothingItems);
//         setisSubmitted(true);
//         setsubmittedOn();
//         // Redirect after a short delay
//         setTimeout(() => {
//           router.push('/trackorder');
//         }, 2000);
        
//       } catch (error) {
//         console.error('Submit error:', error);
//         toast.error('Failed to submit items. Please try again.', {
//           duration: 2000,
//           position: 'top-center',
//         });
//       }
//     } else {
//       // Show error toast if no items are selected
//       toast.error('Please select at least one item to submit', {
//         duration: 2000,
//         position: 'top-center',
//         style: {
//           background: '#F44336',
//           color: 'white',
//         }
//       });
//     }
//   };

//   // Loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-blue-50">
//         <div className="text-blue-700 text-xl">Loading items...</div>
//       </div>
//     );
//   }

//   return (
//     <>
//     <LaundryNavbar/>
//     <div className="min-h-screen relative flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      
//       <div className="absolute inset-0 z-0">
//         <Image
//           src="/images/image.png"
//           alt="Login Background"
//           fill
//           style={{ objectFit: "cover" }}
//           quality={100}
//           className="opacity-30"
//         />
//       </div>
//       <div className="max-w-md w-full space-y-8 bg-white shadow-xl rounded-xl p-8 border border-blue-100 relative z-10">
        
//         {/* Toaster for notifications */}
//         <Toaster />

//         <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">
//           Laundry Management
//         </h1>
        
//         {/* Total Quantity Warning */}
//         {totalQuantity >= MAX_QUANTITY && (
//           <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4 flex items-center">
//             <AlertCircle className="mr-2 text-yellow-600" size={24} />
//             <span className="text-yellow-800">
//               Maximum quantity limit ({MAX_QUANTITY}) reached!
//             </span>
//           </div>
//         )}
        
//         {/* Quantity Tracker */}
//         <div className="mb-4 text-center text-blue-700">
//           Total Clothes: {totalQuantity} / {MAX_QUANTITY}
//         </div>
        
//         <div className="space-y-2">
//           {clothingItems.map((item) => (
//             <div 
//               key={item.id} 
//               className={`flex items-center justify-between p-3 rounded ${
//                 totalQuantity >= MAX_QUANTITY ? 'bg-gray-100 opacity-50' : 'bg-red-50 border-l-4 border-red-500'
//               }`}
//             >
//               <div className="flex-grow">
//                 <span className="font-semibold text-blue-800">{item.name}</span>
//                 <span className="ml-2 text-gray-600">({item.category})</span>
//               </div>
              
//               <div className="flex items-center space-x-2">
//                 <button 
//                   onClick={() => decrementQuantity(item.id)}
//                   className="text-red-500 hover:bg-red-100 p-1 rounded"
//                 >
//                   <Minus size={16} />
//                 </button>
                
//                 <span className="font-bold text-blue-700">{item.quantity}</span>
                
//                 <button 
//                   onClick={() => incrementQuantity(item.id)}
//                   className="text-blue-500 hover:bg-blue-100 p-1 rounded"
//                   disabled={totalQuantity >= MAX_QUANTITY}
//                 >
//                   <Plus size={16} />
//                 </button>
                
//                 <button 
//                   onClick={() => removeItem(item.id)}
//                   className="text-red-600 hover:bg-red-100 p-1 rounded"
//                 >
//                   <Trash2 size={16} />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
        
//         <button 
//           onClick={addNewItem}
//           className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
//           disabled={clothingItems.length >= 15}
//         >
//           Add New Item
//         </button>

//         <button 
//           onClick={handleSubmit}
//           className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
//           disabled={totalQuantity === 0}
//         >
//           Submit
//         </button>
//       </div>
//     </div>
//     </>
//   );
// };

// export default Main;



"use client";
import React, { useState, useMemo, useEffect } from 'react';
import { Plus, Minus, Trash2, AlertCircle, Check } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast, Toaster } from 'react-hot-toast';
import Image from 'next/image';
import LaundryNavbar from './Navbar';

const Main = ({userId}) => {
  console.log(userId);
  const router = useRouter();
  const [clothingItems, setClothingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedOn, setSubmittedOn] = useState(null);

  useEffect(() => {
    const fetchUserItems = async () => {
      try {
        const response = await fetch(`/api/getuseritems?userId=${userId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch user items');
        }
        
        const result = await response.json();
        console.log(result.data);
        console.log(result);
        setClothingItems(result.data);
        setIsSubmitted(result.isSubmitted);
        setSubmittedOn(result.submittedOn);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user items:', error);
        toast.error('Failed to load items. Please try again.', {
          duration: 2000,
          position: 'top-center',
        });
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchUserItems();
    }
  }, [userId]);

  useEffect(() => {
    if (isSubmitted) {
      // router.push('/trackorder');
      toast.error('You have already submitted your laundry items!', {
        duration: 2000,
        position: 'top-center',
      });
    }
  }, [isSubmitted, router]);

  const totalQuantity = useMemo(() => 
    clothingItems.reduce((sum, item) => sum + item.quantity, 0),
    [clothingItems]
  );

  const MAX_QUANTITY = 10;

  const incrementQuantity = (id) => {
    if (isSubmitted) {
      toast.error('Cannot modify items after submission', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }
    if (totalQuantity < MAX_QUANTITY) {
      setClothingItems(clothingItems.map(item => 
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    }
  };

  const decrementQuantity = (id) => {
    if (isSubmitted) {
      toast.error('Cannot modify items after submission', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }
    setClothingItems(clothingItems.map(item => 
      item.id === id && item.quantity > 0 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    ));
  };

  const removeItem = (id) => {
    if (isSubmitted) {
      toast.error('Cannot remove items after submission', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }
    setClothingItems(clothingItems.filter(item => item.id !== id));
  };

  const addNewItem = () => {
    if (isSubmitted) {
      toast.error('Cannot add new items after submission', {
        duration: 2000,
        position: 'top-center',
      });
      return;
    }
    if (clothingItems.length < 15) {
      const newItem = {
        id: clothingItems.length + 1,
        name: 'New Item',
        quantity: 0,
        category: 'Uncategorized'
      };
      setClothingItems([...clothingItems, newItem]);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitted) {
      toast.error('You have already submitted your laundry items!', {
        duration: 2000,
        position: 'top-center',
      });
      // router.push('/trackorder');
      return;
    }

    const itemsToSubmit = clothingItems.filter(item => item.quantity > 0);
    
    if (itemsToSubmit.length > 0) {
      try {
        const response = await fetch('/api/updateuseritems', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            items: clothingItems,
            isSubmitted: true,
            submittedOn: null
          }),
        });
        console.log(response);
        if (!response.ok) {
          throw new Error('Failed to submit items');
        }

        toast.success('Laundry items submitted successfully!', {
          duration: 2000,
          position: 'top-center',
          style: {
            background: '#4CAF50',
            color: 'white',
          },
          icon: <Check size={24} />,
        });
        
        setIsSubmitted(true);
        setSubmittedOn(new Date());

        // setTimeout(() => {
        //   router.push('/trackorder');
        // }, 5000);
        
      } catch (error) {
        console.error('Submit error:', error);
        toast.error('Failed to submit items. Please try again.', {
          duration: 2000,
          position: 'top-center',
        });
      }
    } else {
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-blue-700 text-xl">Loading items...</div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <>
        <LaundryNavbar/>
        <div className="min-h-screen relative flex items-center justify-center bg-blue-50 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/image.png"
              alt="Login Background"
              fill
              style={{ objectFit: "cover" }}
              quality={100}
              className="opacity-30"
            />
          </div>
          <div className="bg-white p-8 rounded-xl shadow-xl text-center z-20">
            <div className="text-green-600 mb-4">
              <Check size={48} className="mx-auto" />
            </div>
            <h2 className="text-2xl font-bold text-blue-800 mb-4">Laundry Items Submitted</h2>
            <p className="text-gray-600 mb-4">
              Your laundry was submitted on: {new Date(submittedOn).toLocaleString()}
            </p>
            <button 
              onClick={() => router.push('/trackorder')}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
            >
              Track Laundry
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <LaundryNavbar/>
      <div className="min-h-screen relative flex items-center justify-center bg-blue-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/image.png"
            alt="Login Background"
            fill
            style={{ objectFit: "cover" }}
            quality={100}
            className="opacity-30"
          />
        </div>
        
        <div className="max-w-md w-full space-y-8 bg-white shadow-xl rounded-xl p-8 border border-blue-100 relative z-10">
          <Toaster />

          <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">
            Laundry Management
          </h1>
          
          {totalQuantity >= MAX_QUANTITY && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4 flex items-center">
              <AlertCircle className="mr-2 text-yellow-600" size={24} />
              <span className="text-yellow-800">
                Maximum quantity limit ({MAX_QUANTITY}) reached!
              </span>
            </div>
          )}
          
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
                    disabled={isSubmitted}
                  >
                    <Minus size={16} />
                  </button>
                  
                  <span className="font-bold text-blue-700">{item.quantity}</span>
                  
                  <button 
                    onClick={() => incrementQuantity(item.id)}
                    className="text-blue-500 hover:bg-blue-100 p-1 rounded"
                    disabled={isSubmitted || totalQuantity >= MAX_QUANTITY}
                  >
                    <Plus size={16} />
                  </button>
                  
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:bg-red-100 p-1 rounded"
                    disabled={isSubmitted}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <button 
            onClick={addNewItem}
            className={`mt-4 w-full py-2 rounded transition ${
              isSubmitted || clothingItems.length >= 15
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            disabled={isSubmitted || clothingItems.length >= 15}
          >
            Add New Item
          </button>

          <button 
            onClick={handleSubmit}
            className={`mt-4 w-full py-2 rounded transition ${
              isSubmitted || totalQuantity === 0
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            disabled={isSubmitted || totalQuantity === 0}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};

export default Main;