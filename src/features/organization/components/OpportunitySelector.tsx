"use client";

import { Button } from "@/components/ui/Button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { cn } from "@/lib/utils";
import * as React from "react";
import { IoIosArrowDown } from "react-icons/io";

type OpportunitySelectorProps = React.HTMLAttributes<HTMLDivElement> & {
  opportunities: { id: string; name: string }[] | undefined;
  onOpportunityChange: (_opportunityId: string) => void;
};

export const OpportunitySelector: React.FC<OpportunitySelectorProps> = ({
  className,
  opportunities,
  onOpportunityChange,
}) => {
  const [selectedOpportunity, setSelectedOpportunity] =
    React.useState<string>("");

  const handleSelect = (id: string) => {
    setSelectedOpportunity(id);
    onOpportunityChange(id);
  };

  return (
    <div
      className={`max-w-1/2 max-h-20 overflow-hidden scroll-m-0.5  ${cn(
        "grid gap-2",
        className
      )}`}
    >
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="opportunity"
            variant={"outline"}
            className={cn(
              "w-fit justify-start text-left font-normal truncate max-w-[350px] md:max-w-[150px] lg:max-w-[200px] xl:max-w-[350px] overflow-hidden",
              !selectedOpportunity && "text-muted-foreground"
            )}
          >
            <IoIosArrowDown className="mr-2" />
            {selectedOpportunity
              ? opportunities?.find((op) => op.id === selectedOpportunity)?.name
              : "Select an opportunity"}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="custom-scroll w-fit p-0 select"
          align="start"
          side="bottom"
          style={{
            transformOrigin: "top center",
            position: "absolute",
            top: "100%",
            left: 0,
          }}
        >
          <ul className="list-none m-0 p-2 border-b border-boundery flex flex-col flex-wrap">
            {opportunities?.map((opportunity) => (
              <li
                key={opportunity.id}
                className={cn(
                  "cursor-pointer px-4 py-2 hover:bg-muted-foreground rounded",
                  selectedOpportunity === opportunity.id && "bg-accent"
                )}
                onClick={() => handleSelect(opportunity.id)}
              >
                {opportunity.name}
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};