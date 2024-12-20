"use client";

import Main from '@/components/Main';
import { useSearchParams } from 'next/navigation';
import { useEffect ,useState} from 'react';

export default function Page() {
    // const searchParams = useSearchParams();
    // const userId = searchParams.get('userId');
    const [userId,setuserId]=useState(null);
    useEffect(()=>{
        setuserId(localStorage.getItem('userId'));
    })
    
    if (!userId) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-blue-700 text-xl">Loading items...</div>
            </div>
        );
    }

    return (
        <div>
            <Main userId={userId} />
        </div>
    );
}