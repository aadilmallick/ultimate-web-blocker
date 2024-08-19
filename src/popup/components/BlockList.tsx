import CustomAccordion from "@/custom/CustomAccordion";
import useBlockList from "../hooks/useBlockList";
import type { BlockSite } from "app/background/controllers/storageController";
import AddBlockSiteDialog from "./AddBlockSiteDialog";
import IconButton from "@/custom/IconButton";
import { useEffect, useMemo, useState } from "react";
import { LucideTrash } from "lucide-react";
import { DateModel } from "app/utils/projectUtils";

const BlockList = () => {
  return (
    <div className=" bg-white shadow-xl rounded-xl border-gray-300 border">
      <AddBlockSiteDialog />
      <CustomAccordion title="Block List" content={<LinkList />} />
    </div>
  );
};

const LinkList = () => {
  const { blocksites } = useBlockList();

  const permanentlyBlockedSites = useMemo(() => {
    return blocksites?.filter((site) => !site.schedule);
  }, [blocksites]);

  const scheduledSites = useMemo(() => {
    return blocksites?.filter((site) => site.schedule);
  }, [blocksites]);

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 pl-1">
        Permanently Blocked Sites
      </h2>
      <ul className="mt-1 mb-4">
        {permanentlyBlockedSites?.map((site) => (
          <LinkRow key={site.id} site={site} />
        ))}
      </ul>
      <h2 className="text-lg font-semibold text-gray-800 pl-1">
        Schedule Blocked Sites
      </h2>
      <ul className="mt-1">
        {scheduledSites?.map((site) => (
          <ScheduledLinkRow key={site.id} site={site} />
        ))}
      </ul>
    </div>
  );
};

const ScheduledLinkRow = ({ site }: { site: BlockSite }) => {
  const { deleteBlockSite } = useBlockList();

  function displaySchedule() {
    if (!site.schedule) return "";
    const { startTime, endTime } = site.schedule;
    // convert times to AM and PM
    const start = DateModel.militaryToStandardTime(startTime);
    const end = DateModel.militaryToStandardTime(endTime);
    return `${start} - ${end}`;
  }

  return (
    <li className="bg-gray-100 flex justify-between items-center px-1 py-2">
      <img
        className="h-6 w-6 object-cover"
        src={`https://icons.duckduckgo.com/ip2/${site.url}.ico`}
      ></img>
      <div className="flex gap-x-1 items-center">
        <span className="inline-block max-w-[25ch] text-ellipsis">
          {site.url}
        </span>
        <span className="text-muted-foreground text-xs inline-block relative mt-[2px]">
          {displaySchedule()}
        </span>
      </div>
      <IconButton
        className="text-red-400 hover:text-red-500 transition-colors"
        onClick={() => {
          deleteBlockSite(site.id);
        }}
      >
        <LucideTrash size={16} />
      </IconButton>
    </li>
  );
};

const LinkRow = ({ site }: { site: BlockSite }) => {
  const { deleteBlockSite } = useBlockList();

  return (
    <li className="bg-gray-100 flex justify-between items-center px-1 py-2">
      <img
        className="h-6 w-6 object-cover"
        src={`https://icons.duckduckgo.com/ip2/${site.url}.ico`}
      ></img>
      <span className="inline-block max-w-[25ch] text-ellipsis">
        {site.url}
      </span>
      <IconButton
        className="text-red-400 hover:text-red-500 transition-colors"
        onClick={() => {
          deleteBlockSite(site.id);
        }}
      >
        <LucideTrash size={16} />
      </IconButton>
    </li>
  );
};

export default BlockList;
