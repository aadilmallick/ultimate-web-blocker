import { Switch } from "@/components/ui/switch";
import CustomDialog from "@/custom/CustomDialog";
import { RoundedIconButton } from "@/custom/IconButton";
import { useObjectState } from "app/utils/ReactUtils";
import { LucidePlus } from "lucide-react";
import { useState } from "react";
import useBlockList from "../hooks/useBlockList";
import { toaster } from "app/background/controllers/domController";
import * as v from "valibot";

const UrlSchema = v.pipe(
  v.string(),
  v.nonEmpty("Please enter your url."),
  v.url("The url is badly formatted.")
);

const AddBlockSiteDialog = () => {
  const [url, setUrl] = useState("");
  const { state, setPartialState, getValue, setValue } = useObjectState({
    shouldSchedule: false,
    startTime: "10:00",
    endTime: "20:00",
  });
  const { addBlockSite } = useBlockList();
  return (
    <CustomDialog
      title="Add Block Site"
      description="Add a site to the block list"
      openButton={
        <button
          className="ml-1 mt-1 p-1 bg-none border-none rounded-full shadow-md transition-colors bg-green-400/50 text-green-600 hover:bg-green-400/75"
          title="Add new link to block"
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
          <div className="flex gap-x-2 items-center">
            <Switch
              checked={state.shouldSchedule}
              onCheckedChange={(checked) => setValue("shouldSchedule", checked)}
              id="shouldSchedule"
            />
            <label htmlFor="shouldSchedule" className="text-muted-foreground">
              Activate Schedule
            </label>
          </div>
          <div className="flex gap-x-2">
            {state.shouldSchedule && (
              <>
                <p>
                  This time interval will be when the website is not blocked.
                </p>
                <div className="flex gap-x-1 flex-1">
                  <label htmlFor="startTime" className="text-muted-foreground">
                    Start Time
                  </label>
                  <input
                    aria-label="Time"
                    type="time"
                    className="p-1 rounded-lg bg-slate-100 border-2 border-slate-300 w-24 disabled:bg-slate-300 transition-colors disabled:opacity-50 flex-1"
                    onChange={(e) => {
                      setValue("startTime", e.target.value);
                    }}
                    value={state.startTime}
                    id="startTime"
                  />
                </div>
                <div className="flex gap-x-1 flex-1">
                  <label htmlFor="endTime" className="text-muted-foreground">
                    End Time
                  </label>
                  <input
                    aria-label="Time"
                    type="time"
                    className="p-1 rounded-lg bg-slate-100 border-2 border-slate-300 w-24 disabled:bg-slate-300 transition-colors disabled:opacity-50 flex-1"
                    onChange={(e) => {
                      setValue("endTime", e.target.value);
                    }}
                    value={state.endTime}
                    id="endTime"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      }
      shouldShowHeader={true}
      onContinue={async () => {
        try {
          const validationResult = v.parse(UrlSchema, url);
          console.log(validationResult);
        } catch (e) {
          console.error(e);
          toaster.danger("Please enter a valid URL");
          return;
        }

        if (state.shouldSchedule) {
          if (state.startTime > state.endTime) {
            toaster.danger("Start time must be before end time");
            return;
          }
        }

        try {
          await addBlockSite(
            url,
            state.shouldSchedule
              ? {
                  endTime: state.endTime,
                  startTime: state.startTime,
                }
              : undefined
          );
        } catch (e) {
          toaster.danger("Site already blocked");
        } finally {
          setUrl("");
        }
      }}
    />
  );
};

export default AddBlockSiteDialog;
