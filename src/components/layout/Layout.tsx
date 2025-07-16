import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  
  // Routes where we don't want header and footer
  const excludeHeaderFooterRoutes = [
    "/quiz/",
    "/results/"
  ];
  
  const shouldExcludeHeaderFooter = excludeHeaderFooterRoutes.some(route => 
    location.pathname.startsWith(route)
  );

  if (shouldExcludeHeaderFooter) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
} 