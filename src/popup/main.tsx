import { injectRoot } from "app/utils/ReactUtils.tsx";
import App from "./App.tsx";
import { toaster } from "app/background/controllers/domController.ts";

injectRoot(<App />);
toaster.setup();
