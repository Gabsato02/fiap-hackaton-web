import { importShared } from './__federation_fn_import-BmTZIpQY.js';
import { j as jsxRuntimeExports, Login } from './__federation_expose_Login-ByN_QqHc.js';
import { r as requireReactDom } from './index-Le1bxE-I.js';

var client = {};

var hasRequiredClient;

function requireClient () {
	if (hasRequiredClient) return client;
	hasRequiredClient = 1;
	var m = requireReactDom();
	{
	  client.createRoot = m.createRoot;
	  client.hydrateRoot = m.hydrateRoot;
	}
	return client;
}

var clientExports = requireClient();

const {StrictMode} = await importShared('react');
clientExports.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Login, {}) })
);
