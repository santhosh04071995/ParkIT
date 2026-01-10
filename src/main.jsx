import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import MyStore, { persistor } from "./store/MyStore";
import AuthProvider from "./Authfolder/AuthProvider";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={MyStore}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PersistGate>
    </Provider>
  </BrowserRouter>
);









// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'
// import { BrowserRouter } from 'react-router-dom'
// import MyStore from './store/MyStore'
// import AuthProvider from './Authfolder/AuthProvider'
// import { Provider } from 'react-redux'
// createRoot(document.getElementById('root')).render(
//   <BrowserRouter>
//     <Provider store={MyStore}>
//       <AuthProvider >
//         <App />
//       </AuthProvider>
//     </Provider> 
//   </BrowserRouter>
  
// )
