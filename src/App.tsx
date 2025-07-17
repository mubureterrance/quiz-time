import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/layout/Layout";
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
    <Layout>
      <AppRoutes />
    </Layout>
  );
}

export default App;
