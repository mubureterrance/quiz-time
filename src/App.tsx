import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import Layout from "./components/layout/Layout";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import { Toaster } from "react-hot-toast";

function App() {
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
