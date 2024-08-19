import CustomAccordion from "@/custom/CustomAccordion";
import React from "react";
import useFocusMode from "../hooks/useFocusMode";
import IconButton from "@/custom/IconButton";
import { LucideExternalLink, LucideTrash } from "lucide-react";
import AddFocusModeLinkDialog from "./AddFocusModeLinkDialog";
import { Switch } from "@/components/ui/switch";

const FocusList = () => {
  return (
    <div className=" bg-white shadow-xl rounded-xl border-gray-300 border mt-4 relative">
      <AddFocusModeLinkDialog />
      <SetFocusingSwitch />
      <CustomAccordion title="Focus Links" content={<LinkList />} />
    </div>
  );
};

const SetFocusingSwitch = () => {
  const { focusGroup, loading, setFocusing } = useFocusMode();

  async function openNewWindow() {
    await chrome.windows.create({
      url: focusGroup?.links.map((link) => link.url),
    });
  }

  if (!focusGroup || loading) return null;

  return (
    <div className="absolute top-1 right-1 flex items-center gap-x-2">
      <Switch
        checked={focusGroup.isFocusing}
        onCheckedChange={(checked) => {
          setFocusing(checked);
        }}
      />
      <IconButton
        className="text-gray-400 transition-colors hover:text-gray-600"
        title="Open new window"
        onClick={openNewWindow}
      >
        <LucideExternalLink size={16} />
      </IconButton>
    </div>
  );
};

const LinkList = () => {
  const { focusGroup, loading, deleteLink } = useFocusMode();

  if (loading || focusGroup?.links.length === null) return <p>Loading...</p>;

  return (
    <ul>
      {focusGroup?.links.map((link) => (
        <li
          className="flex bg-gray-100 px-1 py-2 justify-between items-center"
          key={link.id}
        >
          <span className="inline-block max-w-[30ch] text-ellipsis">
            {new URL(link.url).hostname}
          </span>
          <IconButton
            className="text-red-400 hover:text-red-500 transition-colors"
            onClick={() => {
              deleteLink(link.id);
            }}
          >
            <LucideTrash size={16} />
          </IconButton>
        </li>
      ))}
    </ul>
  );
};

export default FocusList;
