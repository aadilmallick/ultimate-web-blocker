import React, { useEffect } from "react";
import "./tabs.css";
import { CSSVariablesManager } from "app/utils/vanillajs-utils/domUtils";

interface ReactTab {
  tab: string;
  element: React.ReactNode;
}

interface Variables {
  "tab-color": string;
  "inactive-bg-color": string;
}

const Tabs = ({
  tabs,
  inactiveTabColor,
  tabColor,
}: {
  tabs: ReactTab[];
  tabColor?: string;
  inactiveTabColor?: string;
}) => {
  const [currentTab, setCurrentTab] = React.useState(tabs[0]);
  const tabsRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (tabsRef?.current) {
      const variablesManager = new CSSVariablesManager<Variables>(
        tabsRef.current
      );
      inactiveTabColor &&
        variablesManager.set("inactive-bg-color", inactiveTabColor);
      tabColor && variablesManager.set("tab-color", tabColor);
    }
  }, [tabColor, inactiveTabColor, tabsRef]);

  return (
    <>
      <div id="custom-tabs" ref={tabsRef}>
        {tabs.map((t) => (
          <button
            key={t.tab}
            className={`tab ${
              currentTab.tab === t.tab ? "active" : ""
            } text-base font-medium`}
            onClick={() => setCurrentTab(t)}
          >
            {t.tab}
          </button>
        ))}
      </div>
      <div className="content">{currentTab.element}</div>
    </>
  );
};

export default Tabs;
