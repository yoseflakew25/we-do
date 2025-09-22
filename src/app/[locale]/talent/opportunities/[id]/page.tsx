import ErrorPage from '@/components/ErrorPage';
import OpportunityDetails from '@/features/volunteer/opportunties/OpportunityDetails';
import { fetchOpportunityDetails } from '@/services/opportunity-service';

async function ViewOpportunityPage({ params }: { params: { id: string } }) {
  const opportunityId = params.id;
  try {
    const opportunityResponse = await fetchOpportunityDetails(opportunityId);

    if (!opportunityResponse) {
      return <ErrorPage imageName='404.svg' title='Opportunity not found' />;
    }
    return (
      <>
        <title>HOOPOE - Opportunity Detail</title>
        <OpportunityDetails formData={opportunityResponse.data} />
      </>
    );
  } catch (error) {
    console.error('Error fetching opportunity:', error);
    return <ErrorPage imageName='404.svg' title='Something went wrong' />;
  }
}

export default ViewOpportunityPage;
