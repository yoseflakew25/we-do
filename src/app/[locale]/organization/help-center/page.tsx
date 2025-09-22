import { useTranslations } from "next-intl";
import React from "react";
const Dashboard: React.FC = () => {
  const t = useTranslations('SideBar');
  return (
    <div className="">
    {t('helpCenter')}

    </div>
  );
};

export default Dashboard;
