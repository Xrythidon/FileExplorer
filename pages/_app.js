import "../styles/globals.css";
import 'font-awesome/css/font-awesome.min.css';
import { QueryClient, QueryClientProvider } from "react-query";

// Create a client
const queryClient = new QueryClient();
function MyApp({ Component, pageProps }) {
  return (
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  );
}

export default MyApp;
