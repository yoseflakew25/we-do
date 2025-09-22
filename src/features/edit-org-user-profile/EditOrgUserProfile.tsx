// pages/profile.tsx
import {
  useEditNameForOrgUserMutation,
  useEditProfileForOrgUserMutation,
} from '@/app/api/slices/api-slice';
import HorizontalDivider from '@/components/HorizontalDivider';
import LoadingButton from '@/components/buttons/LoadingButton';
import { useAvatarImage } from '@/hook';
import { Avatar, Button, IconButton, Spinner, Tooltip } from '@material-tailwind/react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiArrowLeft, FiMail, FiUser, FiCamera } from 'react-icons/fi';
import { toast } from 'react-toastify';

const EditOrgUserProfile = () => {
  const { data: session } = useSession();
  const [image, setImage] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [username, setUsername] = useState<string>(session?.user.name || '');
  const [loading, setLoading] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const getAvatar = useAvatarImage();
  const [editProfileForOrgUser] = useEditProfileForOrgUserMutation();
  const [editNameOrgUser] = useEditNameForOrgUserMutation();
  const router = useRouter();

  const t = useTranslations('editOrgUserProfilePage');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file[0]);
      setPhoto(file[0]);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    try {
      await editProfileForOrgUser({
        photo: photo as File,
        name: username,
      }).unwrap();
      toast.success('Profile updated successfully!', {
        theme: 'light',
      });
    } catch (errorResponse: any) {
      toast.error(
        errorResponse.data.message || 'Unable to update profile image',
        {
          autoClose: false,
          theme: 'light',
        }
      );
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    toast.dismiss();

    try {
      await editNameOrgUser({
        name: username,
        photo: photo as File,
      }).unwrap();
      toast.success('User Name updated successfully!', {
        theme: 'light',
      });
      setIsEditingName(false);
    } catch (errorResponse: any) {
      toast.error(errorResponse.data.message, {
        autoClose: false,
        theme: 'light',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container flex flex-col items-center justify-center px-4 py-8 mx-auto max-w-3xl">
      {/* Header with back button */}
      <div className="w-full mb-6">
        <div className="flex items-center">
          <Tooltip content="Go back">
            <IconButton
              className="rounded-full mr-2 hover:bg-gray-100 transition-colors"
              variant="text"
              size="lg"
              onClick={() => router.back()}
            >
              <FiArrowLeft className="text-gray-700" size={20} />
            </IconButton>
          </Tooltip>
          <h1 className="text-2xl font-bold text-gray-800">{t('title')}</h1>
        </div>
      </div>

      {/* Profile card */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Profile picture section */}
        <div className="p-6">
          <div className="flex flex-col items-center">
            <label htmlFor="image" className="cursor-pointer group relative">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md">
                <Avatar
                  src={
                    image ||
                    getAvatar(
                      session?.user.name || '',
                      session?.user.profilePicUrl
                    )
                  }
                  alt="Profile picture"
                  className="w-full h-full object-cover transition-opacity group-hover:opacity-90"
                  size="xxl"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <FiCamera className="w-6 h-6 text-white" />
                  <span className="sr-only">Change profile picture</span>
                </div>
              </div>
              <input
                type="file"
                id="image"
                className="hidden"
                accept="image/*"
                onChange={handleImageChange}
              />
            </label>

            <form onSubmit={handleSaveChanges} className="mt-4 w-full max-w-xs">
              <LoadingButton
                size="md"
                className="w-full py-3 rounded-lg font-medium transition-colors"
                type="submit"
                fullWidth
                loading={loading}
                color="amber"
                disabled={!photo}
              >
                {photo ? t('saveButtonText') : 'Upload a photo to save'}
              </LoadingButton>
            </form>
          </div>
        </div>

        <HorizontalDivider />

        {/* Name section */}
        <div className="px-6">
          <form onSubmit={handleNameChange} className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="flex items-center text-sm font-medium text-gray-700 mb-1"
              >
                <FiUser className="mr-2" />
                {t('labels.name')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="username"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  value={username || session?.user.name}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsEditingName(true)}
                  onBlur={() => !loading && setIsEditingName(false)}
                />
                {isEditingName && (
                  <Button
                    type="submit"
                    size="sm"
                    className="absolute right-2 top-2 px-3 py-1 text-xs"
                    color="amber"
                    disabled={loading}
                  >
                    {loading ? <Spinner className="h-4 w-4" /> : 'Save'}
                  </Button>
                )}
              </div>
            </div>
          </form>
        </div>

        <HorizontalDivider />

        {/* Email section */}
        <div className="px-6 pb-6">
          <div className="space-y-4">
            <label
              htmlFor="email"
              className="flex items-center text-sm font-medium text-gray-700 mb-1"
            >
              <FiMail className="mr-2" />
              {t('labels.email')}
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="email"
                id="email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50"
                value={session?.user.email || ''}
                readOnly
              />
              <Link href="/organization/change-email" passHref>
                <Button
                  variant="outlined"
                  color="red"
                  size="sm"
                  className="px-4 py-3"
                >
                  Change Email
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditOrgUserProfile;