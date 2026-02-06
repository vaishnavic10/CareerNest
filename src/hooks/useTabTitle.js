'use client';

import { useEffect } from 'react';

function useTabTitle(pageTitle, websiteName = 'Eminent Hub') {
    useEffect(() => {
        document.title = pageTitle ? `${websiteName} - ${pageTitle}` : websiteName;
        
        // Optional: Clean up function to reset the title when the component unmounts
        // return () => {
        //   document.title = websiteName;
        // };
    }, [pageTitle, websiteName]);
}

export default useTabTitle;