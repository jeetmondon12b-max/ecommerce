// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css';

// import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from './context/AuthContext.jsx';
// import { CartProvider } from './context/CartContext.jsx'; // ✅ CartProvider ইম্পোর্ট করুন
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// const queryClient = new QueryClient();

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter>
//       <QueryClientProvider client={queryClient}>
//         <AuthProvider>
//           {/* ✅ এখানে CartProvider যোগ করুন */}
//           <CartProvider>
//             <App />
//           </CartProvider>
//         </AuthProvider>
//       </QueryClientProvider>
//     </BrowserRouter>
//   </React.StrictMode>
// );



import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ✅ অপটিমাইজেশন: সার্ভিস ওয়ার্কার রেজিস্টার করার জন্য ফাইলটি ইম্পোর্ট করা হয়েছে
import * as serviceWorkerRegistration from './service-worker.js';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// ✅ অপটিমাইজেশন: সার্ভিস ওয়ার্কার চালু করার জন্য এই লাইনটি যোগ করা হয়েছে
serviceWorkerRegistration.register();