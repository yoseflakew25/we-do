import React from 'react';
import type { ComponentProps } from 'react';
import { FiCopy } from 'react-icons/fi';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
} from 'react-share';
import { toast } from 'react-toastify';

interface SocialShareButtons {
  sharableUrl: string;
}

const SocialShareButtons = ({ sharableUrl }: SocialShareButtons) => {
  const socials = [
    {
      name: 'Email',
      renderButton: (props: ComponentProps<typeof EmailShareButton>) => (
        <EmailShareButton {...props} />
      ),
      renderIcon: (props: ComponentProps<typeof EmailIcon>) => (
        <EmailIcon {...props} size={33} />
      ),
    },
    {
      name: 'Facebook',
      renderButton: (props: ComponentProps<typeof FacebookShareButton>) => (
        <FacebookShareButton {...props} />
      ),
      renderIcon: (props: ComponentProps<typeof FacebookIcon>) => (
        <FacebookIcon {...props} size={33} />
      ),
    },
    {
      name: 'Twitter',
      renderButton: (props: ComponentProps<typeof TwitterShareButton>) => (
        <TwitterShareButton {...props} />
      ),
      renderIcon: (props: ComponentProps<typeof TwitterIcon>) => (
        <TwitterIcon {...props} size={33} />
      ),
    },
    {
      name: 'Telegram',
      renderButton: (props: ComponentProps<typeof TelegramShareButton>) => (
        <TelegramShareButton {...props} />
      ),
      renderIcon: (props: ComponentProps<typeof TelegramIcon>) => (
        <TelegramIcon {...props} size={33} />
      ),
    },
    {
      name: 'Whatsapp',
      renderButton: (props: ComponentProps<typeof WhatsappShareButton>) => (
        <WhatsappShareButton {...props} />
      ),
      renderIcon: (props: ComponentProps<typeof WhatsappIcon>) => (
        <WhatsappIcon {...props} size={33} />
      ),
    },
    {
      name: 'Reddit',
      renderButton: (props: ComponentProps<typeof RedditShareButton>) => (
        <RedditShareButton {...props} />
      ),
      renderIcon: (props: ComponentProps<typeof RedditIcon>) => (
        <RedditIcon {...props} size={33} />
      ),
    },
    {
      name: 'Copy Link',
      renderButton: (props: ComponentProps<'span'>) => <span {...props}></span>,
      renderIcon: (props: ComponentProps<typeof FiCopy>) => (
        <FiCopy
          {...props}
          size={18}
          onClick={() => {
            navigator.clipboard.writeText(sharableUrl);
            toast.success('Link copied to clipboard');
          }}
        />
      ),
    },
  ];

  return socials;
};

export default SocialShareButtons;
