import "../styles/globals.css";
import type { AppProps } from "next/app";
import wrapper from "../redux/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

function MyApp({ Component, ...rest }: any) {
  const { store, props } = wrapper.useWrappedStore(rest);
  const { pageProps } = props;

  return (
    <Provider store={store}>
      <Navbar />
      <Toaster />
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
