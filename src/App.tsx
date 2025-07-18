import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/layout/Layout";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { Toaster } from "react-hot-toast";
// import { uploadSeeder } from './services/uploadSeeder';
// import { useEffect } from "react";

function App() {

  // Call this once when your app starts (temporary)
/*
useEffect(() => {
  // Only run in development and only once
  if (process.env.NODE_ENV === 'development') {
    uploadSeeder();
  }
}, []);
*/

  return (
    <ErrorBoundary>
      <Toaster position="top-right" />
      <Layout>
        <AppRoutes />
      </Layout>
    </ErrorBoundary>
  );
}

export default App;
