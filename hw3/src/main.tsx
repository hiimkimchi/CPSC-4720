import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import { Auth0Provider } from "@auth0/auth0-react";

// const domain = process.env.AUTH0_DOMAIN!;
// const clientId = process.env.AUTH0_CLIENT_ID!;
// const audience = process.env.AUTH0_AUDIENCE!;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <BrowserRouter>
    {/*I got confused and tried putting auth in the frontend*/}
    {/* <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: audience,
      }}
    > */}
      <App />
    </BrowserRouter>
    {/* </Auth0Provider> */}

  </StrictMode>
);
