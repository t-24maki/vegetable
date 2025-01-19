import 'dotenv/config';

export default {
  expo: {
    extra: {
    cloudFrontUrl: process.env.CLOUDFRONT_URL,
    revenueCat: {
        apiKey: process.env.REVENUE_CAT_API_KEY,
        entitlementId: process.env.REVENUE_CAT_ENTITLEMENT_ID,
        monthlyPrice: process.env.REVENUE_CAT_MONTHLY_PRICE,
        },
      adUnitIds: {
        banner: {
          ios: process.env.BANNER_AD_UNIT_ID_IOS,
          android: process.env.BANNER_AD_UNIT_ID_ANDROID,
        },
        interstitial: {
          ios: process.env.INTERSTITIAL_AD_UNIT_ID_IOS,
          android: process.env.INTERSTITIAL_AD_UNIT_ID_ANDROID,
        },
        rewardedInterstitial: {
          ios: process.env.REWARDED_INTERSTITIAL_AD_UNIT_ID_IOS,
          android: process.env.REWARDED_INTERSTITIAL_AD_UNIT_ID_ANDROID,
        },
      },
    },
  },
};