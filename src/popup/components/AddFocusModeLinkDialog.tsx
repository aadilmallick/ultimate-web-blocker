import { Switch } from "@/components/ui/switch";
import CustomDialog from "@/custom/CustomDialog";
import { LucidePlus } from "lucide-react";
import { useState } from "react";
import { toaster } from "app/background/controllers/domController";
import * as v from "valibot";
import useFocusMode from "../hooks/useFocusMode";
import { withTryCatch } from "app/utils/projectUtils";

const UrlSchema = v.pipe(
  v.string(),
  v.nonEmpty("Please enter your url."),
  v.url("The url is badly formatted.")
);

const AddFocusModeLinkDialog = () => {
  const [url, setUrl] = useState("");
  const { addLink } = useFocusMode();
  return (
    <CustomDialog
      title="Add Focus Mode Link"
      description="Add a site to the focus mode group"
      openButton={
        <button
          className="ml-1 mt-1 p-1 bg-none border-none rounded-full shadow-md transition-colors bg-green-400/50 text-green-600 hover:bg-green-400/75"
          title="Add new link to focus mode"
        >
          <LucidePlus size={16} />
        </button>
      }
      content={
        <div className="space-y-2">
          <input
            type="url"
            name=""
            id=""
            className="p-2 bg-gray-50 border-gray-300 rounded-md border-2 w-full invalid:border-red-500 transition-colors"
            placeholder="https://example.com"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
      }
      shouldShowHeader={true}
      onContinue={async () => {
        const passed = withTryCatch({
          tryFn: () => {
            v.parse(UrlSchema, url);
            return true;
          },
          catchFn: (error) => {
            toaster.danger("invalid url");
          },
        });
        if (!passed) return;
        console.log("passed!");

        await addLink(url);
      }}
    />
  );
};

export default AddFocusModeLinkDialog;
