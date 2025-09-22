import { GraphData, User, VolunteerProfileData } from './app/api/types';
import type { RootState, AppDispatch } from './store';
import { useSession } from 'next-auth/react';
import { useState, useEffect, useMemo } from 'react';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
type ChartData = {
  date: string;
  data: number;
};

export const useAvatarImage = () => {
  return (name: string, imgUrl?: string, background?: string) => {
    return (
      imgUrl ||
      `https://ui-avatars.com/api/?background=${
        background || 'random'
      }&name=${name}`
    );
  };
};

export const useOrgLogo = () => {
  return (logoUrl?: string) => {
    return logoUrl || '/assets/org-logo-default.png';
  };
};

export const useTransformBackendData = (backendData: GraphData | undefined) => {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    if (backendData) {
      const transformedData = backendData.labels?.map(
        (label: string, index: number) => ({
          date: label,
          data: backendData.data[index],
        })
      );
      setChartData(transformedData);
    } else {
      setChartData([]);
    }
  }, [backendData]);

  return chartData;
};

export const bytesToMB = (bytes: number, decimalPoints: number = 2): number => {
  const MB_SIZE = 1024 * 1024; // 1 MB = 1024 * 1024 bytes
  const sizeInMB = bytes / MB_SIZE;

  // Limit the decimal points
  return parseFloat(sizeInMB.toFixed(decimalPoints));
};

// Define a custom hook to transform skills array and return the entire user data
export const useFormattedUserData = (
  userProfileData: VolunteerProfileData | undefined
) => {
  // Use useMemo to memoize the transformed user data
  const formattedUserData = useMemo(() => {
    if (!userProfileData) return undefined;

    // Transform skills array into selectOption format
    const formattedSkills =
      userProfileData.skills?.map((skill) => ({
        value: skill,
        label: skill,
      })) || [];

    // Return the modified user data with formatted skills
    return {
      ...userProfileData,
      skills: formattedSkills,
    };
  }, [userProfileData]); // Dependency array to recompute if userProfileData changes

  return formattedUserData;
};

export const useUser = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<User>();

  useEffect(() => {
    if (session) {
      // User is authenticated with NextAuth
      setUser(session.user);
    } else {
      // No authenticated session, check for guest user token
      const guestUser = localStorage.getItem('guestUser');
      if (guestUser) {
        setUser(JSON.parse(guestUser));
      }
    }
  }, [session]);

  return user;
};
