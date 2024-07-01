import { useState, useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "redux/store";
import { useRouter } from "next/router";
import BreadcrumbContextProvider, { useBreadcrumb } from "contexts/BreadcrumbContext";
import { checkAuthentication } from "utils";
import { useMediaQuery } from "react-responsive";
import NextNProgress from "nextjs-progressbar";
import { ToastContainer, toast } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-toastify/dist/ReactToastify.css";
import "../public/styles/main.css";

import SessionWatcher from "components/shared/SessionWatcher";
import Header from "components/shared/Header";
import Sidenav from "components/shared/Sidenav";

export default function AppWrapper(props: any) {
  return (
    <Provider store={store}>
      <BreadcrumbContextProvider>
        <PersistGate loading={null} persistor={persistor}>
          <App {...props} />
        </PersistGate>
      </BreadcrumbContextProvider>
    </Provider>
  );
}

function App(props: any) {
  const disabledMenusRoutes = ["entrar", "cadastro", "conta/curso", "conta/senha"];
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 992 });

  const [loaded, setLoaded] = useState<boolean>(false);
  useEffect(() => {
    checkAuthentication();
    setLoaded(true);
  }, []);

  const [sidenavOpen, setSidenavOpen] = useState<boolean>(true);

  return (
    <section id="app">
      <Head>
        {/* Meta */}
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <meta name="theme-color" content="#111" />

        <title>{process.env.title}</title>

        {/* Favicon */}
        <link
          rel="apple-touch-icon"
          href={`${process.env.basePath}/img/favicon.png`}
        />
        <link
          rel="icon"
          href={`${process.env.basePath}/img/favicon.png`}
        />
      </Head>

      <noscript>
        Você precisar ligar o JavaScript para visualizar esta página.
      </noscript>

      <SessionWatcher />
      <NextNProgress color={"linear-gradient(to right, var(--primary-color) 0%, #2ddabd 51%, var(--primary-color-2) 100%)"} />

      {loaded && <>
        {(!disabledMenusRoutes.includes(router.pathname.replace("/", ""))
          && !isMobile)
          && <div style={{ height: "100vh", overflow: "hidden" }}>
            <Sidenav sidenavOpen={sidenavOpen} setSidenavOpen={setSidenavOpen} />
          </div>
        }

        <main
          id={"main"}
          className={
            `${(disabledMenusRoutes.includes(router.pathname.replace("/", "")) || isMobile)
            && "no-sidenav"} ${isMobile && "mobile"} ${disabledMenusRoutes.includes(router.pathname.replace("/", ""))
            && "no-menu"} ${!sidenavOpen && "collapsed-sidenav"}`
          }>
          {!disabledMenusRoutes.includes(router.pathname.replace("/", ""))
            && <Header isMobile={isMobile} />}
          <props.Component {...props.pageProps} />
        </main>
      </>}

      <div id="modals" />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      // transition="Bounce"
      />
    </section>
  );
}