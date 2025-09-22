import ReviewOppotunityInfo from './ReviewOpportunityInfo';
import ViewOnlyOppotunityInfo from './ViewOnlyOppotunityInfo';
import ViewOppotunityInfo from './ViewOpportunityInfo';
import { OpportunityDetail, OpportunityFormData } from '@/app/api/types';
import React from 'react';

// This type allows the form data to have different types when on view and when on edit
type OpportunityInfoProps =
  | {
      formData: OpportunityDetail;
      refetch: () => void;
      mode: 'view';
    }
  | {
      formData: OpportunityDetail;
      refetch: () => void;
      mode: 'view-only';
    }
  | {
      formData: OpportunityFormData;
      mode: 'review';
    };

const OpportunityInfo: React.FC<OpportunityInfoProps> = (props) => {
  const renderDetails = () => {
    switch (props.mode) {
      case 'view':
        return (
          <ViewOppotunityInfo
            formData={props.formData}
            refetch={props.refetch}
          />
        );
      case 'view-only':
        return (
          <ViewOnlyOppotunityInfo
            formData={props.formData}
            refetch={props.refetch}
          />
        );
      case 'review':
        return <ReviewOppotunityInfo formData={props.formData} />;
    }
  };
  return <section className='font-epilogue'>{renderDetails()}</section>;
};

export default OpportunityInfo;
