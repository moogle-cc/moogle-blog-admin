const HOST = new URL(window.location);
const DOMAIN = HOST.origin;
const POSTS_URL = `${DOMAIN}/index.json`;
const CONSTANTS_URL = `${DOMAIN}/constants.json`;
const BRAND_LOGO = `${DOMAIN}/profile.png`;
const BRAND_ICON = `${DOMAIN}/profile.png`;
const BRAND_WEBSITE = `${DOMAIN}`;
const FB_URL = /^https:\/\/www.facebook.com\/.*/i;
const TW_URL = /^https:\/\/twitter.com\/.*/i;
const INS_URL = /^https:\/\/www.instagram.com\/.*/i;
const BLOG_DETAILS_UPDATE_URL = `https://api.moogle.cc/p/tools/update-blog-config`;

const METADATA_UPDATED = "Updated successfully"
const METADATA_UPDATE_FAILED = "Update failed. Please contact sai@moogle.cc."
const FB_URL_ERROR = "Your Facebook is incorrect";
const IG_URL_ERROR = "Your Instagram is incorrect";
const TW_URL_ERROR = "Your Twitter is incorrect";
const FOOTER_LABEL = "Footer (50-250 chars)";
const PIC_LABEL = "Profile Picture (a sq. photo with you in the middle would look great!)";
const PIC_SUB_LABEL = "(use a png, jpeg/jpg, or gif)";
const SUBSCRIPTION_EMBED_LABEL = "Enter a link to OR embed code for your subscription form";
const SUBSCRIPTION_EMBED_SUBTITLE = "Get the link OR embed code from your mailing service (like Moogle, Convertkit, or Mailchimp)";
const TOAST_MISSING_FIELDS = 'Custom domain cannot be empty';

const config = {
    HOST: HOST,
    POSTS_URL: POSTS_URL,
    BRAND_LOGO: BRAND_LOGO,
    BRAND_ICON: BRAND_ICON,
    BRAND_WEBSITE: BRAND_WEBSITE,
    FB_URL,
    TW_URL,
    INS_URL,
    BLOG_DETAILS_UPDATE_URL,
    CONSTANTS_URL,
    METADATA_UPDATED,
    METADATA_UPDATE_FAILED,
    FB_URL_ERROR,
    IG_URL_ERROR,
    TW_URL_ERROR,
    FOOTER_LABEL,
    PIC_LABEL,
    PIC_SUB_LABEL,
    SUBSCRIPTION_EMBED_LABEL,
    SUBSCRIPTION_EMBED_SUBTITLE,
    TOAST_MISSING_FIELDS,
}

export default config;
