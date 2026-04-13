import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes.jsx";

const App = () => {
  return (
    <>
      <Toaster />
      <AppRoutes />
    </>
  );
};

export default App;
