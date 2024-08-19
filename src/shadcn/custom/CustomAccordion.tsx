import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const CustomAccordion = ({
  content,
  title,
}: {
  title: string;
  content: React.ReactNode;
}) => {
  return (
    <Accordion type="single" collapsible className="w-full overflow-x-hidden">
      <AccordionItem value="item-1" className="border-none">
        <AccordionTrigger className="px-1">{title}</AccordionTrigger>
        <AccordionContent>{content}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default CustomAccordion;
