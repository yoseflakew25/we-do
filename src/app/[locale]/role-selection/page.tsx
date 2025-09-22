import RoleSelectionForm from '@/features/role-selection/RoleSelectionForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HOOPOE - Role Selection',
};

export default function RoleSelectionPage() {
  return <RoleSelectionForm />;
}
