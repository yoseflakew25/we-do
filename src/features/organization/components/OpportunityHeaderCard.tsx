import React, { ReactElement } from "react";

interface OpportunityHeaderCardProps {
  title: ReactElement; // can be <OrgTitleAndDetail title={title} /> or < PageTitle >
  hasBorder: boolean;
  details: ReactElement;

}

const OpportunityHeaderCard: React.FC<OpportunityHeaderCardProps> = ({ hasBorder, details, title}) => {
  return (
    <div className={`${hasBorder ? "rounded-2xl border-2 border-lightGrey" : "none"}  px-5 py-5 flex flex-col`}>
      {title}
      {/* short details */}
      {details}
    </div>
  );
};

export default OpportunityHeaderCard;