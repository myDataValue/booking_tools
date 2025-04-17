import React, { useState } from "react";

const BookingMetricsSlider = () => {
  // ---- CORE PROPERTY METRICS ----
  const [baseAdr, setBaseAdr] = useState(100); // Base price
  const [pmsMarkup, setPmsMarkup] = useState(0); // PMS markup percentage
  const [reviewScore, setReviewScore] = useState(7.5); // Property review score (0-10)
  const [reviewCount, setReviewCount] = useState(25); // Number of reviews
  const [intrinsicQuality, setIntrinsicQuality] = useState(70); // Intrinsic property quality
  // Property type is now derived from ADR
  const [cancellationRate, setCancellationRate] = useState(0); // Cancellation percentage
  const [isPreferredPartner, setIsPreferredPartner] = useState(false); // Preferred partner status

  // ---- NEW: ADDITIONAL GUEST PRICE ----
  const [additionalGuestPrice, setAdditionalGuestPrice] = useState(0); // Additional price per extra guest
  const [averageGroupSize, setAverageGroupSize] = useState(1.5); // Average number of guests per booking

  // ---- NEW: BOOKING.COM COMMISSION & VISIBILITY BOOSTER ----
  const [visibilityBooster, setVisibilityBooster] = useState(0); // 0-15% visibility booster
  // Calculate actual commission based on visibility booster (15-30%)
  const bookingCommission = 15 + visibilityBooster;

  // ---- AVAILABILITY & RULES ----
  const [daysAvailable, setDaysAvailable] = useState(300); // Days available in next 365
  const [minStay, setMinStay] = useState(1); // Minimum length of stay
  const [bookableDaysAhead, setBookableDaysAhead] = useState(0); // Days in advance bookable (0-7)
  const [cancellationPolicy, setCancellationPolicy] = useState("flexible"); // flexible, moderate, strict

  // ---- MARKET CONDITIONS ----
  const [seasonality, setSeasonality] = useState(50); // 0-low season, 100-high season
  const [totalCompetitors, setTotalCompetitors] = useState(100); // Total nearby competitors
  const [medianCompetitorPrice, setMedianCompetitorPrice] = useState(100); // Median price of top 10 competitors
  const [medianCompetitorReview, setMedianCompetitorReview] = useState(7.5); // Median review score of top 10 competitors
  const [competitorIntrinsicQuality, setCompetitorIntrinsicQuality] =
    useState(70); // Competitor intrinsic quality

  // ---- Competitor Base Occupancy (hidden from UI but used in calculations) ----
  const competitorOccupancy = 65; // Competitor average occupancy rate - used in calculations only

  // ---- BOOKING.COM PRICING STRATEGY ----
  const [discountTypes, setDiscountTypes] = useState({
    genius: { active: false, level: 1, value: 10 }, // Genius discount (10% or 15% for level 2)
    targeted: { active: false, value: 10 }, // Targeted discounts (mobile, country)
    campaign: { active: false, value: 19 }, // Campaign deals (seasonal, yearly)
    portfolio: { active: false, value: 10 }, // Portfolio deals (last minute, early booker)
    deep: { active: false, value: 40 }, // Deep deals (limited time, highest discount)
    weekly: { active: false, value: 15 }, // 7-day stay discount
    monthly: { active: false, value: 25 }, // 30-day stay discount
  });

  // NEW: Automatically determine property type based on ADR
  const getPropertyType = () => {
    if (baseAdr < 80) return "budget";
    if (baseAdr > 120) return "premium";
    return "standard";
  };

  // Get property type based on ADR
  const propertyType = getPropertyType();

  // NEW: Get intrinsic quality explanation based on quality level
  const getQualityExplanation = () => {
    if (intrinsicQuality <= 40) {
      return "Basic property with minimal amenities. Location may be less desirable, photo quality is basic, furnishings are minimal/functional.";
    } else if (intrinsicQuality <= 60) {
      return "Average property with standard amenities. Good location, decent photos, standard furnishings and adequate description.";
    } else if (intrinsicQuality <= 80) {
      return "Above average property with good amenities. Attractive location, professional photos, good quality furnishings.";
    } else {
      return "Exceptional property with premium amenities. Prime location, professional photography, luxury furnishings, detailed descriptions.";
    }
  };

  // Calculate effective discount considering stacking rules
  const calculateEffectiveDiscount = () => {
    const { genius, targeted, campaign, portfolio, deep } = discountTypes;

    // Deep deals don't stack with anything except genius
    if (deep.active) {
      return deep.value;
    }

    let totalDiscount = 0;

    // Genius always applies if active
    if (genius.active) {
      totalDiscount += genius.level === 1 ? 10 : 15;
    }

    // Campaign deals stack with Genius but not with other deals
    if (campaign.active) {
      totalDiscount += campaign.value;
      return totalDiscount;
    }

    // Targeted rates stack with Genius and Portfolio
    if (targeted.active) {
      totalDiscount += targeted.value;
    }

    // Portfolio deals stack with Genius and Targeted
    if (portfolio.active) {
      totalDiscount += portfolio.value;
    }

    return totalDiscount;
  };

  // Determine if promotion has a badge
  const hasPromotionalBadge = () => {
    return discountTypes.campaign.active || discountTypes.deep.active ||
      discountTypes.weekly.active || discountTypes.monthly.active;
  };

  // const getPromotionalBadgeType = () => {
  //   if (discountTypes.deep.active) return "limited-time";
  //   if (discountTypes.campaign.active) return "campaign";
  //   if (discountTypes.weekly.active) return "weekly-stay";
  //   if (discountTypes.monthly.active) return "monthly-stay";
  //   return "none";
  // };

  // Total discount percentage
  const effectiveDiscountPercent = calculateEffectiveDiscount();

  // Get listing maturity level based on review count with smooth transition
  const getListingMaturity = () => {
    // Create a continuous curve instead of discrete thresholds
    let factor;
    let level;

    if (reviewCount === 0) {
      factor = 0.8;
      level = "No Reviews";
    } else if (reviewCount < 4) {
      // Linear interpolation between 0.8 and 0.95 for 0-4 reviews
      factor = 0.8 + (reviewCount / 4) * 0.15;
      level = "Very New";
    } else if (reviewCount < 10) {
      // Linear interpolation between 0.95 and 1.1 for 4-10 reviews
      factor = 0.95 + ((reviewCount - 4) / 6) * 0.15;
      level = "New";
    } else if (reviewCount < 30) {
      // Linear interpolation between 1.1 and 1.2 for 10-30 reviews
      factor = 1.1 + ((reviewCount - 10) / 20) * 0.1;
      level = "Growing";
    } else if (reviewCount < 100) {
      // Linear interpolation between 1.2 and 1.3 for 30-100 reviews
      factor = 1.2 + ((reviewCount - 30) / 70) * 0.1;
      level = "Established";
    } else {
      factor = 1.3;
      level = "Mature";
    }

    // Round factor to 2 decimal places for display
    factor = Math.round(factor * 100) / 100;

    return { level, factor };
  };

  // Calculate same-day booking impact (0 days ahead is highest impact)
  const getSameDayBookingImpact = () => {
    if (bookableDaysAhead === 0)
      return { label: "Same day bookings", factor: 1.5 };
    if (bookableDaysAhead <= 1)
      return { label: "Next day bookings", factor: 1.3 };
    if (bookableDaysAhead <= 3) return { label: "Short notice", factor: 1.1 };
    if (bookableDaysAhead <= 5) return { label: "5 days ahead", factor: 0.9 };
    return { label: "Week ahead", factor: 0.8 };
  };

  // Calculate price percentile and its impact on ranking/conversion
  const getPricePercentileImpact = () => {
    // Calculate your price percentile relative to market
    const baseRateWithMarkup = baseAdr * (1 + pmsMarkup / 100);
    const relativePriceRatio = baseRateWithMarkup / medianCompetitorPrice;

    // INCREASED IMPACT: Amplify the rank impact multiplier from 35 to 50
    const rankImpactFactor = 50 * (relativePriceRatio - 1);

    // INCREASED IMPACT: Strengthen the conversion impact
    let conversionImpactFactor;
    if (relativePriceRatio > 1) {
      // When more expensive than competitors, stronger negative impact
      conversionImpactFactor = -1.8 * Math.log10(relativePriceRatio + 0.2) * 2; // Increased from -1.2 to -1.8
    } else {
      // When less expensive, stronger positive impact but still capped
      conversionImpactFactor = -1.8 * (relativePriceRatio - 1); // Increased from -1.2 to -1.8
      conversionImpactFactor = Math.max(-1.5, conversionImpactFactor); // Increased cap from -1.0 to -1.5
    }

    // Set descriptive percentile text
    let percentileText = "";
    if (relativePriceRatio > 1.5) percentileText = "Top 10% (very expensive)";
    else if (relativePriceRatio > 1.25) percentileText = "Top 25% (expensive)";
    else if (relativePriceRatio > 1.1) percentileText = "Above average price";
    else if (relativePriceRatio >= 0.9) percentileText = "Average price range";
    else if (relativePriceRatio >= 0.75) percentileText = "Below average price";
    else if (relativePriceRatio >= 0.6)
      percentileText = "Bottom 25% (good value)";
    else percentileText = "Bottom 10% (very cheap)";

    // Constrain the impact to reasonable ranges while still allowing continuous scaling
    return {
      percentile: percentileText,
      rankImpact: Math.min(60, Math.max(-30, rankImpactFactor)), // Expanded from 40/-20 to 60/-30
      // Stronger range for conversion impact
      conversionImpact: Math.max(-2.0, Math.min(1.5, conversionImpactFactor)), // Expanded from -1.4/1.0 to -2.0/1.5
    };
  };

  // Get intrinsic quality advantage/disadvantage compared to competitors
  const getIntrinsicQualityAdvantage = () => {
    const advantage = intrinsicQuality - competitorIntrinsicQuality;

    // Sliding scale impact
    return {
      value: advantage,
      rankImpact: advantage * 0.3, // Each point of advantage gives 0.3 rank points
      conversionImpact: advantage * 0.005, // Each point of advantage gives 0.005% conversion
    };
  };

  // Calculate review score percentile and impact
  const getReviewPercentileImpact = () => {
    if (reviewCount === 0) {
      return {
        status: "No reviews",
        rankImpact: -20, // Increased from -15
        conversionImpact: -0.6, // Increased from -0.4
      };
    }

    const reviewDiff = reviewScore - medianCompetitorReview;

    // Enhanced sliding scale with larger negative impacts
    if (reviewDiff > 1.0) {
      return {
        status: "Exceptional (top 5%)",
        rankImpact: 25,
        conversionImpact: 0.8,
      };
    } else if (reviewDiff > 0.5) {
      return {
        status: "Excellent (top 15%)",
        rankImpact: 15,
        conversionImpact: 0.5,
      };
    } else if (reviewDiff > 0.2) {
      return {
        status: "Above average",
        rankImpact: 8,
        conversionImpact: 0.3,
      };
    } else if (reviewDiff >= -0.2) {
      return {
        status: "Average",
        rankImpact: 0,
        conversionImpact: 0,
      };
    } else if (reviewDiff >= -0.5) {
      return {
        status: "Below average",
        rankImpact: -12, // Increased from -8
        conversionImpact: -0.5, // Increased from -0.3
      };
    } else if (reviewDiff >= -1.0) {
      return {
        status: "Poor (bottom 15%)",
        rankImpact: -22, // Increased from -15
        conversionImpact: -0.8, // Increased from -0.5
      };
    } else {
      return {
        status: "Very poor (bottom 5%)",
        rankImpact: -35, // Increased from -25
        conversionImpact: -1.2, // Increased from -0.8
      };
    }
  };

  const listingMaturity = getListingMaturity();
  const bookingImpact = getSameDayBookingImpact();
  const priceImpact = getPricePercentileImpact();
  const qualityAdvantage = getIntrinsicQualityAdvantage();
  const reviewImpact = getReviewPercentileImpact();

  // Calculate visibility booster impact on rank
  const calculateVisibilityBoosterRankImpact = (
    boosterValue: number
  ) => {
    if (boosterValue <= 0) return 0;
    // Use a more exponential formula to increase impact as booster value increases
    return Math.round(boosterValue * 1.2 * Math.pow(1.08, boosterValue));
  };

  // NEW: Create a function to get conversion rate description based on price with more gradual steps
  const getPriceConversionDescription = () => {
    const baseRateWithMarkup = baseAdr * (1 + pmsMarkup / 100);
    const relativePriceRatio = baseRateWithMarkup / medianCompetitorPrice;

    if (relativePriceRatio > 1.5)
      return "Price significantly reduces conversion";
    if (relativePriceRatio > 1.3) return "Price notably reduces conversion";
    if (relativePriceRatio > 1.1) return "Price somewhat reduces conversion";
    if (relativePriceRatio > 0.95)
      return "Price has minimal impact on conversion";
    if (relativePriceRatio > 0.85)
      return "Price has neutral impact on conversion";
    if (relativePriceRatio > 0.75) return "Price somewhat improves conversion";
    if (relativePriceRatio > 0.65) return "Price notably improves conversion";
    return "Price significantly improves conversion";
  };

  const getReviewCountColor = (count: number) => {
    if (count === 0) return "text-red-500";
    if (count < 4) return "text-red-400";
    if (count < 10) return "text-orange-500";
    if (count < 20) return "text-yellow-500";
    if (count < 30) return "text-yellow-400";
    if (count < 50) return "text-blue-500";
    if (count < 100) return "text-blue-600";
    return "text-green-600";
  };

  // NEW: Badge impact on pricing effectiveness
  const getBadgeImpactOnPricing = () => {
    if (!hasPromotionalBadge()) return 1.0;

    // Campaign deals provide moderate price positioning advantage
    if (discountTypes.campaign.active) {
      return 1.05; // 5% price positioning advantage
    }

    // Deep deals provide stronger price positioning advantage
    if (discountTypes.deep.active) {
      return 1.08; // 8% price positioning advantage
    }

    // Weekly stay discount provides good price positioning advantage
    if (discountTypes.weekly.active) {
      return 1.01; // 6% price positioning advantage
    }

    // Monthly stay discount provides strong price positioning advantage
    if (discountTypes.monthly.active) {
      return 1.01; // 10% price positioning advantage due to securing longer occupancy
    }

    return 1.0;
  };

  // NEW: Get seasonal occupancy based on seasonality
  const getSeasonalOccupancy = () => {
    // Low season: 45-60%
    // Standard season: 60-75%
    // High season: 75-90%
    if (seasonality < 30) {
      return 45 + (seasonality / 30) * 15; // 45-60%
    } else if (seasonality > 70) {
      return 75 + ((seasonality - 70) / 30) * 15; // 75-90%
    } else {
      return 60 + ((seasonality - 30) / 40) * 15; // 60-75%
    }
  };

  // Calculate all derived metrics based on inputs
  const calculateMetrics = () => {
    // --- Price Calculations ---
    const baseRateWithMarkup = baseAdr * (1 + pmsMarkup / 100);

    // NEW: Calculate additional guest revenue
    const additionalGuestRevenue = additionalGuestPrice > 0
      ? additionalGuestPrice * Math.max(0, (averageGroupSize - 1))
      : 0;

    // NEW: Calculate effective ADR including additional guest revenue
    const effectiveBaseRateWithGuests = baseRateWithMarkup + additionalGuestRevenue;

    // --- Quality Score ---
    const baseQuality = intrinsicQuality * 0.7;
    const reviewQualityImpact =
      reviewCount > 0
        ? reviewImpact.rankImpact *
        0.3 *
        Math.min(1.0, 0.3 + Math.pow(reviewCount / 100, 0.8) * 0.7)
        : 0;
    const cancellationImpact = -Math.min(20, cancellationRate / 1.5);
    const availabilityImpact = (daysAvailable / 365) * 10;
    const qualityScore = Math.max(
      10,
      Math.min(100, baseQuality + reviewQualityImpact + cancellationImpact + availabilityImpact)
    );

    // --- Search Rank Calculation ---
    let rankAdjustments =
      -qualityAdvantage.rankImpact +
      priceImpact.rankImpact -
      reviewImpact.rankImpact -
      (listingMaturity.factor - 1) * 15 -
      (bookingImpact.factor - 1) * 15;
    if (cancellationPolicy === "flexible") rankAdjustments -= 8;
    else if (cancellationPolicy === "moderate") rankAdjustments -= 2;
    else if (cancellationPolicy === "strict") rankAdjustments += 10;
    rankAdjustments += Math.min(20, cancellationRate / 1.5);
    if (isPreferredPartner) rankAdjustments -= 5;
    if (hasPromotionalBadge() && !discountTypes.weekly.active && !discountTypes.monthly.active)
      rankAdjustments -= 15;
    // Length of stay discounts get extra ranking boosts
    if (discountTypes.weekly.active) rankAdjustments -= 1; // 7-day discount boosts visibility more
    if (discountTypes.monthly.active) rankAdjustments -= 3; // 30-day discount boosts visibility even more
    if (discountTypes.genius.active) rankAdjustments -= (discountTypes.genius.level === 1 ? 7 : 10);
    if (discountTypes.deep.active) rankAdjustments -= 10;
    else if (discountTypes.campaign.active) rankAdjustments -= 5;
    else if (discountTypes.portfolio.active) rankAdjustments -= 4;
    else if (discountTypes.targeted.active) rankAdjustments -= 2;
    if (visibilityBooster > 0) rankAdjustments -= calculateVisibilityBoosterRankImpact(visibilityBooster);
    const percentileRank = Math.max(1, Math.min(100, Math.round(50 + rankAdjustments)));
    const rankPosition = Math.max(
      1,
      Math.min(totalCompetitors, Math.round((percentileRank / 100) * totalCompetitors))
    );

    // --- Listing Views Calculation ---
    let baseViews = Math.round(350 * Math.pow(1 - rankPosition / totalCompetitors, 1.7));
    if (discountTypes.deep.active) baseViews *= 1.3;
    else if (discountTypes.campaign.active) baseViews *= 1.2;
    if (isPreferredPartner) baseViews *= 1.25;
    if (discountTypes.genius.active) baseViews *= 1.15;
    if (visibilityBooster > 0) baseViews *= 1 + visibilityBooster / 100;
    baseViews *= listingMaturity.factor;
    baseViews *= bookingImpact.factor;
    const listingViews = Math.max(
      10,
      Math.round(
        baseViews *
        (daysAvailable / 365) *
        (0.7 + (seasonality / 100) * 0.6) *
        (1 - (minStay - 1) * 0.05)
      )
    );

    // --- Conversion Rate Calculation ---
    const baseConversion = qualityScore / 100;
    const badgeConversionBoost = hasPromotionalBadge()
      ? (discountTypes.deep.active
      ? 0.5  // Deep deals have highest impact
      : discountTypes.campaign.active
        ? 0.3  // Campaign deals have medium impact
        // Combined weekly + monthly stays
        : (discountTypes.weekly.active && discountTypes.monthly.active)
        ? 0.03  // Combined effect is stronger than individual
        : discountTypes.weekly.active
          ? 0.01  // Weekly stay boost
          : discountTypes.monthly.active
          ? 0.02   // Monthly stay boost
          : 0.2)  // Other promotional badges
      : 0;
    const priceConversionEffect = priceImpact.conversionImpact;
    const reviewConversionEffect = reviewImpact.conversionImpact;
    const qualityConversionEffect = qualityAdvantage.conversionImpact;
    const reviewCountEffect =
      reviewCount > 0
      ? (Math.min(1.3, 0.8 + Math.pow(reviewCount / 100, 0.7) * 0.5) - 1) * 0.4
      : 0;
    
    // Discount effects
    let discountEffect = 0;
    if (discountTypes.deep.active) {
      discountEffect = 0.4 + (discountTypes.deep.value - 40) * 0.01;
    } else if (discountTypes.campaign.active) {
      discountEffect = 0.2 + (discountTypes.campaign.value - 10) * 0.01;
    }
    else if (discountTypes.targeted.active) {
      // Increased from 0.1 to 0.15 base effect
      discountEffect = 0.4 + (discountTypes.targeted.value - 10) * 0.01; // 0.15 base + 0.01 per 1%
    } 
    // Single discount cases
    else if (discountTypes.weekly.active) {
      const minWeeklyEffect = 0.05;
      const weeklyScalingFactor = 0.005;
      discountEffect = minWeeklyEffect + (discountTypes.weekly.value - 5) * weeklyScalingFactor;
    }
    else if (discountTypes.monthly.active) {
      const minMonthlyEffect = 0.08;
      const monthlyScalingFactor = 0.0047;
      discountEffect = minMonthlyEffect + (discountTypes.monthly.value - 10) * monthlyScalingFactor;
    } else {
      discountEffect = effectiveDiscountPercent * 0.01;
    }

    const preferredEffect = isPreferredPartner ? 0.2 : 0;
    const cancellationPolicyEffect =
      cancellationPolicy === "flexible" ? 0.2 : cancellationPolicy === "moderate" ? 0.05 : -0.2;
    const cancellationRateEffect = -Math.min(0.5, cancellationRate / 20);
    const seasonEffect = ((seasonality - 50) / 100) * 0.4;
    const rulesEffect = -((minStay - 1) * 0.1) - (bookableDaysAhead / 7) * 0.1;
    const rawConversionRate = Math.max(
      0.2,
      Math.min(
      2.0,
      baseConversion +
      badgeConversionBoost +
      priceConversionEffect +
      0.4 *
      (reviewConversionEffect +
        qualityConversionEffect +
        reviewCountEffect +
        discountEffect +
        preferredEffect +
        cancellationPolicyEffect +
        cancellationRateEffect +
        seasonEffect +
        rulesEffect)
      )
    );
    const displayConversionRate = Math.min(100, Math.round((rawConversionRate / 2.0) * 100));

    // --- Occupancy Calculation ---
    const baseOccupancyFromConversion = 40 + displayConversionRate * 0.6;
    const seasonalMultiplier = 0.7 + (seasonality / 100) * 0.6;
    let calculatedOccupancy =
      baseOccupancyFromConversion *
      seasonalMultiplier *
      (0.7 + Math.pow(daysAvailable / 365, 0.5) * 0.3) *
      (cancellationPolicy === "flexible" ? 1.15 : cancellationPolicy === "moderate" ? 1.0 : 0.85);
    let advantageMultiplier = 1.0;
    if (isPreferredPartner) advantageMultiplier += 0.01; // the conversion impact already fairly increases the occupancy
    
    // Promotional badge impacts on occupancy with more granular handling
    if (hasPromotionalBadge()) {
      if (discountTypes.deep.active) {
      advantageMultiplier += 0.2; // Highest impact for deep deals
      } else if (discountTypes.campaign.active) {
      advantageMultiplier += 0.12; // Standard impact for campaign deals
      }
    }
    
    if (discountTypes.genius.active) advantageMultiplier += 0.001;
    if (advantageMultiplier === 1.0) {
      const similarityToCompetitors =
      1 -
      ((Math.abs(intrinsicQuality - competitorIntrinsicQuality) / 100) * 0.5 +
        (Math.abs(baseAdr - medianCompetitorPrice) / medianCompetitorPrice) * 0.5);
      advantageMultiplier = 0.6 + similarityToCompetitors * 0.25;
    }
    calculatedOccupancy *= advantageMultiplier;
    const qualityCeiling = 45 + intrinsicQuality * 0.55;
    const reviewMultiplier =
      reviewCount > 0
      ? 0.7 + ((reviewScore - 7.0) / 2.0) * 0.6 * (1 + (Math.min(1.0, Math.sqrt(reviewCount / 100)) - 1))
      : 0.7;
    calculatedOccupancy *= reviewMultiplier;
    calculatedOccupancy = Math.min(calculatedOccupancy, Math.min(99, qualityCeiling * reviewMultiplier));
    calculatedOccupancy = Math.max(15, calculatedOccupancy);
    const occupancyRate = Math.round(calculatedOccupancy * 10) / 10;

    // --- Booking Efficiency ---
    const rawViewsPerBooking = Math.round(100 / rawConversionRate);
    const viewsScaleFactor = 1 + (350 - Math.min(350, listingViews)) / 350;
    let viewsPerBooking = Math.round(rawViewsPerBooking * viewsScaleFactor);
    if (viewsPerBooking > 800) {
      const overageRatio = (viewsPerBooking - 800) / 200;
      viewsPerBooking = 800 + Math.round((1000 - 800) * Math.tanh(overageRatio));
    }
    viewsPerBooking = Math.min(1000, viewsPerBooking);
    const bookingEfficiency =
      viewsPerBooking < 75
        ? "excellent"
        : viewsPerBooking < 125
          ? "good"
          : viewsPerBooking < 200
            ? "average"
            : "poor";

    // --- Effective ADR ---
    const qualityAdrFactor = 0.7 + intrinsicQuality / 250;
    const reviewAdrFactor =
      reviewCount > 0
        ? (0.9 + (reviewScore - 7.5) / 6) * (0.95 + Math.min(100, reviewCount) / 400)
        : 1.0;
    const cancellationAdrFactor = 1 - cancellationRate / 200;
    const availabilityAdrFactor = 0.95 + (daysAvailable / 365) * 0.1;
    const rulesAdrFactor = 1 - (minStay - 1) * 0.03;
    const badgeAdrFactor = getBadgeImpactOnPricing();

    // Include the additional guest revenue in the effective ADR calculation
    const effectiveAdr =
      effectiveBaseRateWithGuests *
      (1 - effectiveDiscountPercent / 100) *
      qualityAdrFactor *
      reviewAdrFactor *
      cancellationAdrFactor *
      availabilityAdrFactor *
      rulesAdrFactor *
      badgeAdrFactor;

    const netAdrAfterCommission = effectiveAdr * (1 - bookingCommission / 100);
    const pmsMargin = pmsMarkup - effectiveDiscountPercent;

    // --- RevPAR & Monthly Revenue ---
    const revPar = (netAdrAfterCommission * occupancyRate) / 100;
    const monthlyRevenue = revPar * 30;

    // --- NEW: Calculate Seasonal Target RevPAR based on seasonality ---
    // 1. Get seasonal occupancy based on seasonality
    const seasonalOccupancy = getSeasonalOccupancy();

    // 2. Apply fixed 20% discount to Base ADR (including additional guest revenue)
    const targetDiscountedAdr = effectiveBaseRateWithGuests * 0.8;

    // 3. Calculate target net ADR after commission
    const targetNetAdr = targetDiscountedAdr * (1 - bookingCommission / 100);

    // 4. Calculate seasonal target RevPAR and monthly revenue
    const seasonalTargetRevPar = (targetNetAdr * seasonalOccupancy) / 100;
    const seasonalTargetMonthlyRevenue = seasonalTargetRevPar * 30;

    // --- Optimal Pricing & Occupancy Calculation ---
    const Pmarket = medianCompetitorPrice;
    const Qdiff = (intrinsicQuality - competitorIntrinsicQuality) / 100;
    const Sf = 0.7 + (seasonality / 100) * 0.6;
    const demandPercentile = Math.min(
      100,
      Math.max(
        1,
        50 -
        qualityAdvantage.rankImpact -
        reviewImpact.rankImpact -
        (listingMaturity.factor - 1) * 15 -
        (bookingImpact.factor - 1) * 15 -
        (isPreferredPartner ? 15 : 0) -
        (hasPromotionalBadge() ? 15 : 0) +
        cancellationRate / 1.5 +
        (cancellationPolicy === "flexible" ? -8 : cancellationPolicy === "moderate" ? -2 : 10)
      )
    );
    const demandRankPosition = Math.max(
      1,
      Math.min(totalCompetitors, Math.round((demandPercentile / 100) * totalCompetitors))
    );
    const Df = 1.0 + ((totalCompetitors - demandRankPosition) / totalCompetitors) * 0.2;
    const reviewCountConversionImpact =
      reviewCount > 0
        ? (Math.min(1.3, 0.8 + Math.pow(reviewCount / 100, 0.7) * 0.5) - 1) * 0.4
        : 0;
    const baselineConversion =
      qualityScore / 100 +
      reviewImpact.conversionImpact +
      qualityAdvantage.conversionImpact +
      reviewCountConversionImpact +
      (isPreferredPartner ? 0.2 : 0) +
      (cancellationPolicy === "flexible" ? 0.2 : cancellationPolicy === "moderate" ? 0.05 : -0.2) -
      Math.min(0.5, cancellationRate / 20) +
      ((seasonality - 50) / 100) * 0.4 -
      (minStay - 1) * 0.1 -
      (bookableDaysAhead / 7) * 0.1;
    const baselineConversionValue = Math.round(Math.max(0.1, Math.min(2.0, baselineConversion)) * 10) / 10;
    const roundedBaselineValue = Math.round(baselineConversionValue * 10) / 10;
    const Ef = 0.8 + (roundedBaselineValue / 2) * 0.6;
    const SFn = reviewCount > 0 ? 0.7 + Math.min(1.3, Math.pow(reviewCount / 100, 0.7)) * 0.6 : 0.7;
    const RSn = reviewCount > 0 ? 0.6 + (reviewScore / 10) * 0.6 : 0.9;
    const RCn = reviewCount > 0 ? 0.7 + Math.min(1, Math.pow(reviewCount / 100, 0.8)) * 0.6 : 0.7;
    const AVn = 0.8 + (daysAvailable / 365) * 0.3;
    const qualityComponentOptimal = 0.4 * RSn + 0.25 * RCn + 0.2 * (1.3 * SFn) + 0.15 * AVn;
    const qualityPriceRatio = 1 + Qdiff * 0.5;
    const reviewPriceRatio = reviewCount > 0 ? 0.9 + (reviewScore / medianCompetitorReview) * 0.2 : 1.0;
    const optimalPricePosition = qualityPriceRatio * 0.6 + reviewPriceRatio * 0.4;
    const PRn = Math.min(1.3, Math.max(0.7, optimalPricePosition));
    const ARn = 0.8 + (intrinsicQuality / 100) * 0.4;
    const MPn = 0.7 + ((totalCompetitors - demandRankPosition) / totalCompetitors) * 0.6;
    const pricingComponentOptimal = 0.5 * PRn + 0.3 * ARn + 0.2 * MPn;
    // const EDF = effectiveDiscountPercent / 100;
    // const Cr = bookingCommission / 100;
    const LA = isPreferredPartner ? 1.15 : 1.0;
    const TRCR = demandRankPosition / totalCompetitors / (roundedBaselineValue / 1.5);
    const delta = 0.05;
    const minStayFactor = 1 - (minStay - 1) * 0.04;
    const sameDayBookingFactor =
      bookableDaysAhead === 0 ? 1.12 : bookableDaysAhead <= 1 ? 1.08 : bookableDaysAhead <= 3 ? 1.04 : 1.0;
    const cancellationPolicyFactor = cancellationPolicy === "flexible" ? 1.2 : cancellationPolicy === "moderate" ? 0.9 : 0.8;
    const badgePricingFactor = getBadgeImpactOnPricing();
    const matchedSettingsScore = Math.max(
      0,
      Math.min(
        1,
        (1 - Math.abs(intrinsicQuality - competitorIntrinsicQuality) / 100) * 0.3 +
        (1 - Math.abs(baseAdr - medianCompetitorPrice) / medianCompetitorPrice) * 0.3 +
        (reviewCount > 0 ? (1 - Math.abs(reviewScore - medianCompetitorReview) / 3) * 0.2 : 0) +
        (bookableDaysAhead === 0 ? 0.1 : 0) +
        (cancellationPolicy === "flexible" ? 0.1 : 0)
      )
    );
    let optimalBaseADR =
      Pmarket *
      (1 +
        (1 - matchedSettingsScore) *
        ((1 + Qdiff * 0.3) *
          Sf *
          Df *
          Ef *
          qualityComponentOptimal *
          pricingComponentOptimal *
          minStayFactor *
          sameDayBookingFactor *
          cancellationPolicyFactor *
          badgePricingFactor *
          LA *
          (1 - delta * Math.log10(Math.max(1, TRCR))) -
          1));
    const maxDeviation = 0.5;
    const minOptimalBase = Pmarket * (1 - maxDeviation);
    const maxOptimalBase = Pmarket * (1 + maxDeviation);
    optimalBaseADR = Math.max(minOptimalBase, Math.min(maxOptimalBase, optimalBaseADR));
    const standardCommission = 0.15;
    const optimalNetADR = optimalBaseADR * (1 - standardCommission);
    let optimalOccupancyFromConversion =
      40 + Math.round((baselineConversionValue / 2.0) * 100) * 0.6;
    optimalOccupancyFromConversion *= seasonalMultiplier;
    optimalOccupancyFromConversion *= 0.7 + Math.pow(daysAvailable / 365, 0.5) * 0.3;
    optimalOccupancyFromConversion *= 1.15;
    optimalOccupancyFromConversion *= 1.2;
    const optimalReviewMultiplier =
      reviewCount > 0
        ? (0.7 + ((Math.min(9.0, reviewScore + 0.3) - 7.0) / 2.0) * 0.6) *
        (1 + (Math.min(1.0, Math.sqrt(reviewCount / 100)) - 1))
        : 0.9;
    optimalOccupancyFromConversion *= optimalReviewMultiplier;
    const optimalFinalCeiling = Math.min(99, qualityCeiling * optimalReviewMultiplier);
    optimalOccupancyFromConversion = Math.min(optimalOccupancyFromConversion, optimalFinalCeiling);
    optimalOccupancyFromConversion = Math.max(20, optimalOccupancyFromConversion);
    const optimalOccupancy = Math.round(optimalOccupancyFromConversion * 10) / 10;
    const optimalRevPar = (optimalNetADR * optimalOccupancy) / 100;
    const optimalMonthlyRevenue = optimalRevPar * 30;

    // NEW: Calculate RevPAR gap based on seasonal target RevPAR
    const revParGap = Math.round(((seasonalTargetRevPar - revPar) / seasonalTargetRevPar) * 100);
    const revenueAchievement = (monthlyRevenue / seasonalTargetMonthlyRevenue) * 100;

    return {
      qualityScore: Math.round(qualityScore),
      rank: rankPosition,
      percentileRank,
      listingViews,
      conversionRate: displayConversionRate,
      rawConversionRate: Math.round(rawConversionRate * 10) / 10,
      viewsPerBooking,
      bookingEfficiency,
      effectiveAdr: Math.round(effectiveAdr),
      netAdrAfterCommission: Math.round(netAdrAfterCommission),
      optimalNetAdr: Math.round(optimalNetADR),
      pmsMargin: Math.round(pmsMargin * 10) / 10,
      baseRateWithMarkup: Math.round(baseRateWithMarkup),
      additionalGuestRevenue: Math.round(additionalGuestRevenue * 10) / 10,
      effectiveBaseRateWithGuests: Math.round(effectiveBaseRateWithGuests),
      priceImpact,
      reviewImpact,
      qualityAdvantage,
      listingMaturity,
      bookingImpact,
      visibilityBoosterImpact: calculateVisibilityBoosterRankImpact(visibilityBooster),
      priceConversionDescription: getPriceConversionDescription(),
      occupancyRate,
      seasonalOccupancy,
      optimalOccupancy,
      revPar: Math.round(revPar),
      seasonalTargetRevPar: Math.round(seasonalTargetRevPar * 10) / 10,
      optimalRevPar: Math.round(optimalRevPar),
      monthlyRevenue: Math.round(monthlyRevenue),
      seasonalTargetMonthlyRevenue: Math.round(seasonalTargetMonthlyRevenue),
      optimalMonthlyRevenue: Math.round(optimalMonthlyRevenue),
      revenueAchievement: Math.round(revenueAchievement),
      revParGap,
      badgeImpactFactor: hasPromotionalBadge()
        ? (badgeAdrFactor * 100 - 100).toFixed(0) + "%"
        : "No badge",
    };
  };

  const metrics = calculateMetrics();

  // Helper functions for styling
  const getColor = (value: number) => {
    if (value >= 80) return "text-green-600";
    if (value >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  const getRankColor = (value: number) => {
    if (value <= totalCompetitors * 0.2) return "text-green-600";
    if (value <= totalCompetitors * 0.5) return "text-yellow-500";
    return "text-red-500";
  };

  const getPercentileColor = (value: number) => {
    if (value <= 20) return "text-green-600";
    if (value <= 50) return "text-yellow-500";
    return "text-red-500";
  };

  const getEfficiencyColor = (status: string) => {
    if (status === "excellent" || status === "good") return "text-green-600";
    if (status === "average") return "text-yellow-500";
    return "text-red-500";
  };

  const getListingViewsColor = (views: number) => {
    if (views > 150) return "bg-green-500";
    if (views > 75) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getConversionRateColor = (rate: number) => {
    if (rate >= 0.8) return "text-green-600";
    if (rate >= 0.4) return "text-yellow-500";
    return "text-red-500";
  };

  const getOccupancyColor = (rate: number) => {
    if (rate >= 75) return "text-green-600";
    if (rate >= 55) return "text-yellow-500";
    return "text-red-500";
  };

  const getRevParColor = (value: number, target: number) => {
    const achievement = (value / target) * 100;
    if (achievement >= 95) return "text-green-600";
    if (achievement >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  const getSeasonalOccupancyColor = (
    rate: number,
    seasonality: number
  ) => {
    // Different thresholds based on seasonality
    if (seasonality < 30) {
      // Low season
      if (rate >= 60) return "text-green-600";
      if (rate >= 45) return "text-yellow-500";
      return "text-red-500";
    } else if (seasonality > 70) {
      // High season
      if (rate >= 75) return "text-green-600";
      if (rate >= 60) return "text-yellow-500";
      return "text-red-500";
    } else {
      // Standard season
      if (rate >= 70) return "text-green-600";
      if (rate >= 55) return "text-yellow-500";
      return "text-red-500";
    }
  };

  const getRevenueAchievementColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600";
    if (percentage >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  // Toggle discount strategies
  const toggleDiscount = (type: keyof typeof discountTypes) => {
    setDiscountTypes((prev) => {
      const newState = { ...prev };

      // Deep Deals can only be active when Genius is active
      if (type === "deep" && !prev.deep.active) {
        if (!prev.genius.active) {
          // Enable Genius if not already active
          newState.genius.active = true;
        }

        // Disable all other deals except Genius
        Object.keys(newState).forEach((key) => {
          if (key !== "deep" && key !== "genius" && 
              (key === "targeted" || key === "campaign" || key === "portfolio" || key === "weekly" || key === "monthly")) {
            newState[key as keyof typeof newState].active = false;
          }
        });
        newState.deep.active = true;
      }
      // If turning on campaign, turn off portfolio
      else if (type === "campaign" && !prev.campaign.active) {
        newState.portfolio.active = false;
        newState.campaign.active = true;
      }
      // If turning on portfolio, turn off campaign
      else if (type === "portfolio" && !prev.portfolio.active) {
        newState.campaign.active = false;
        newState.portfolio.active = true;
      }
      // If turning off Genius when Deep is active, turn off Deep too
      else if (type === "genius" && prev.genius.active && prev.deep.active) {
        newState.genius.active = false;
        newState.deep.active = false;
      }
      // Simply toggle length of stay discounts - allow both to be selected
      else if (type === "weekly" || type === "monthly") {
        // Simply toggle the active state - no restrictions
        (newState[type]).active = !(prev[type]).active;
      }
      // Simple toggle for other cases
      else {
        (newState[type]).active = !(prev[type]).active;
      }

      return newState;
    });
  };

  // Toggle Genius level
  const toggleGeniusLevel = () => {
    setDiscountTypes((prev) => ({
      ...prev,
      genius: {
        ...prev.genius,
        level: prev.genius.level === 1 ? 2 : 1,
        value: prev.genius.level === 1 ? 15 : 10,
      },
    }));
  };

  // Toggle cancellation policy
  const selectCancellationPolicy = (policy: React.SetStateAction<string>) => {
    setCancellationPolicy(policy);
  };

  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto relative">
      <div className="relative">
        <h2 className="text-2xl font-bold mb-2 text-center">
          Booking.com Performance Optimisation Simulator
          <button
            className="ml-2 inline-flex items-center justify-center w-5 h-5 text-sm font-bold text-blue-800 bg-blue-100 rounded-full hover:bg-blue-200 focus:outline-none"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            ?
          </button>
        </h2>

        {showTooltip && (
            <div className="absolute z-[100] w-96 p-4 bg-white rounded-lg shadow-lg border border-blue-100 text-sm">
            <h4 className="font-semibold text-blue-800 mb-2">Important Revenue Management Notes</h4>

            <div className="space-y-2 text-gray-600">
              <div>
              <span className="font-medium">Rate Parity & Net Revenue:</span>
              <ul className="ml-4 mt-1 list-disc text-xs">
                <li>Balance optimal net RevPAR across all distribution channels</li>
                <li>Consider device-specific pricing (mobile vs desktop)</li>
                <li>Account for varying commission structures in final pricing</li>
              </ul>
              </div>

              <div>
              <span className="font-medium">Length of Stay (LOS) Strategy:</span>
              <ul className="ml-4 mt-1 list-disc text-xs">
                <li>Higher rates for 1-4 night stays to offset operational costs</li>
                <li>Weekend premium pricing for short stays</li>
                <li>Discounted rates for extended stays (4+ nights)</li>
                <li>Strategic LOS restrictions during high demand periods</li>
              </ul>
              </div>

              <div>
              <span className="font-medium">Revenue Optimization:</span>
              <ul className="ml-4 mt-1 list-disc text-xs">
                <li>Additional guest pricing for larger properties</li>
                <li>Ancillary revenue from property add-ons (parking, late checkout)</li>
                <li>Local activity/experience booking commissions</li>
                <li>Premium amenity upsells (welcome packs, cleaning service)</li>
              </ul>
              </div>

              <p className="text-xs italic">
              Adjust base rates considering these factors to maximize total property revenue while maintaining market competitiveness.
              </p>
            </div>
            </div>
        )}
      </div>

      <p className="text-center text-sm mb-2">
        Find your optimal vacation rental rate and occupancy to maximize revenue.
      </p>
      <p className="text-center text-blue-600 text-xs mb-4">
        This is a simplified demo. For full AI-powered revenue optimization, visit <a href="https://mydatavalue.com" className="underline hover:text-blue-800">myData</a>.
      </p>

      {/* Reorganized Horizontal KPI Panel - Now with RevPAR and Occupancy */}
      <div className="sticky top-0 z-50 mb-6 p-3 bg-blue-50 rounded-lg shadow-md">
        {/* Property Type at the top - smaller size */}
        <div className="text-center mb-4">
          <span className="px-3 py-1 rounded-full border bg-gray-50 inline-block text-sm">
            <span className="font-medium">Property Type:</span>
            <span
              className={
                propertyType === "premium"
                  ? "text-green-600 font-medium ml-1"
                  : propertyType === "budget"
                    ? "text-red-500 font-medium ml-1"
                    : "text-blue-600 font-medium ml-1"
              }
            >
              {propertyType.charAt(0).toUpperCase() + propertyType.slice(1)}
              {propertyType === "premium"
                ? " (£120+)"
                : propertyType === "budget"
                  ? " (Below £80)"
                  : " (£80-120)"}
            </span>
          </span>
        </div>

        {/* Row 1: Base ADR, Occupancy, and RevPAR */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center bg-white p-2 rounded-lg shadow">
            <div className="text-sm uppercase font-semibold mb-1">Base ADR</div>
            <div className="text-2xl font-bold">
              £
              {effectiveDiscountPercent > 0
                ? Math.round(
                  metrics.effectiveBaseRateWithGuests *
                  (1 - effectiveDiscountPercent / 100)
                )
                : metrics.effectiveBaseRateWithGuests}
            </div>
            <div className="text-xs">
              {pmsMarkup > 0 && (
                <div className="ml-2">
                  <span className="text-gray-500">Base: £{baseAdr}</span>
                  <span className="ml-1 text-blue-600">(+{pmsMarkup}%)</span>
                </div>
              )}
              {additionalGuestPrice > 0 && (
                <div className="ml-2">
                  <span className="text-gray-500">Extra Guest: +£{metrics.additionalGuestRevenue}</span>
                </div>
              )}
              {effectiveDiscountPercent > 0 && (
                <div className="ml-2">
                  <span className="line-through text-gray-500">
                    £{Math.round(metrics.effectiveBaseRateWithGuests)}
                  </span>
                  <span className="ml-1 text-green-600">
                    (-{effectiveDiscountPercent}%)
                  </span>
                </div>
              )}
              {hasPromotionalBadge() && (
                <div className="text-xs text-blue-700">
                  Includes promotional badge for visibility!
                </div>
              )}
            </div>
          </div>

          <div className="text-center bg-white p-2 rounded-lg shadow">
            <div className="text-sm uppercase font-semibold mb-1">
              Occupancy
            </div>
            <div className={`text-2xl font-bold ${getSeasonalOccupancyColor(metrics.occupancyRate, seasonality)}`}>
              {metrics.occupancyRate.toFixed(1)}%
            </div>

            <div className="text-xs">
              {seasonality < 30
                ? "Low Season (45-60%)"
                : seasonality > 70
                  ? "High Season (75-90%)"
                  : "Standard Season (60-75%)"}
            </div>
            <div
              className={`text-xs ${metrics.occupancyRate >= metrics.seasonalOccupancy
                  ? "text-green-600"
                  : "text-yellow-500"
                } font-medium`}
            >
              Target: {metrics.seasonalOccupancy.toFixed(1)}%
            </div>
          </div>

          <div className="text-center bg-white p-2 rounded-lg border-2 border-blue-500 shadow">
            <div className="text-sm uppercase font-semibold mb-1 text-blue-800">
              RevPAR
            </div>
            <div className={`text-2xl font-bold ${getRevParColor(metrics.revPar, metrics.seasonalTargetRevPar)}`}>
              £{metrics.revPar}
            </div>

            {/* Monthly Target Section */}
            <div className="text-xs text-gray-700">
              <span className="font-medium">Target: £{metrics.seasonalTargetRevPar}</span>
            </div>

            {/* Progress Bar for Monthly Target */}
            <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${metrics.revenueAchievement >= 95
                  ? "bg-green-600"
                  : metrics.revenueAchievement >= 75
                    ? "bg-yellow-500"
                    : "bg-red-500"
                  }`}
                style={{ width: `${Math.min(100, metrics.revenueAchievement)}%` }}
              ></div>
            </div>

            {/* Achievement Text */}
            <div className={`text-xs mt-1 ${metrics.revenueAchievement >= 95
              ? "text-green-600"
              : metrics.revenueAchievement >= 75
                ? "text-yellow-500"
                : "text-red-600"
              } font-semibold`}>
              {Math.round(metrics.revenueAchievement)}% achieved
              <span className="font-normal text-gray-600 ml-1">
                (£{metrics.monthlyRevenue}/mo)
              </span>
            </div>
          </div>
        </div>

        {/* Row 2: Search Rank, Conversion Rate, Booking Efficiency & Daily Views */}
        <div className="grid grid-cols-3 gap-2">
          <div className="text-center">
            <div className="text-sm uppercase font-semibold mb-1">
              Search Rank
            </div>
            <div className={`text-2xl font-bold ${getRankColor(metrics.rank)}`}>
              #{metrics.rank}
            </div>
            <div
              className={`text-xs ${getPercentileColor(
              metrics.percentileRank
              )}`}
            >
              Top {Math.ceil(metrics.percentileRank / 10) * 10}% of {totalCompetitors}
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm uppercase font-semibold mb-1">
              Conversion Rate
            </div>
            <div
              className={`text-2xl font-bold ${getConversionRateColor(
                metrics.rawConversionRate
              )}`}
            >
              {metrics.rawConversionRate}%
            </div>
            <div className="text-xs">{metrics.priceConversionDescription}</div>
          </div>

          <div className="text-center">
            <div className="text-sm uppercase font-semibold mb-1">
              Booking Efficiency
            </div>
            <div
              className={`text-xl font-bold ${getEfficiencyColor(
                metrics.bookingEfficiency
              )}`}
            >
              {metrics.viewsPerBooking}
            </div>
            <div className="text-xs">Listing Views: {metrics.listingViews}/day</div>
            <div className="h-1.5 w-20 mx-auto bg-gray-200 rounded overflow-hidden mt-1">
              <div
                className={`h-full ${getListingViewsColor(
                  metrics.listingViews
                )}`}
                style={{
                  width: `${Math.min(100, metrics.listingViews / 3)}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Formula explanation at bottom of banner */}
        <div className="text-center mt-4">
            <div className="text-xs text-gray-600">
              <span className="font-bold text-blue-500">Optimal Net RevPAR</span> = (P × QF × SF × DF × EF × QSF × PPF × (1-D) × PS × (1-C) × O) / 100
              <div className="text-[11px] mt-0.5 text-gray-500">
              where P=price, QF=quality, SF=season, DF=demand, EF=efficiency, QSF=quality score, PPF=partner, D=discounts, PS=property score, C=commission, O=occupancy
              </div>
            </div>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-4"
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}
      >
        {/* COLUMN 1 - MY PROPERTY */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-2 rounded-lg text-center font-bold text-blue-800 shadow-sm">
            My Property Settings
          </div>

          {/* Property Quality */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-3">Quality to Value Metrics</h3>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Intrinsic Quality</span>
                <span
                  className={`font-bold ${intrinsicQuality >= 80
                      ? "text-green-600"
                      : intrinsicQuality >= 60
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                >
                  {intrinsicQuality}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={intrinsicQuality}
                onChange={(e) => setIntrinsicQuality(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                {getQualityExplanation()}
              </div>
              <div className="text-xs mt-1">
                <span
                  className={
                    qualityAdvantage.value >= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {qualityAdvantage.value > 0 ? "+" : ""}
                  {qualityAdvantage.value}% vs competitors difference
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Base ADR (£)</span>
                <div>
                  <span className="font-bold">{baseAdr}</span>
                  <span className="text-sm ml-2">(Default: £100)</span>
                </div>
              </div>
              <input
                type="range"
                min="25"
                max="500"
                value={baseAdr}
                onChange={(e) => setBaseAdr(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs mt-1 text-gray-600">
                Base price affected by: Quality (
                {Math.round((0.7 + intrinsicQuality / 250) * 100 - 100)}%),
                {reviewCount > 0
                  ? ` Reviews (${Math.round(
                    (0.95 + (reviewScore - 7.5) / 10) * 100 - 100
                  )}%),`
                  : ""}
                Cancellation rate (
                {Math.round((1 - cancellationRate / 200) * 100 - 100)}%)
              </div>
              <div className="text-xs mt-1">
                <span
                  className={
                    metrics.priceImpact.rankImpact <= 0
                      ? "text-green-600"
                      : "text-red-500"
                  }
                >
                  {metrics.priceImpact.percentile} • Rank impact:{" "}
                  {metrics.priceImpact.rankImpact <= 0 ? "+" : ""}
                  {(-metrics.priceImpact.rankImpact).toFixed(1)}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Review Score</span>
                <span
                  className={`font-bold ${reviewScore >= medianCompetitorReview + 0.3
                      ? "text-green-600"
                      : reviewScore < medianCompetitorReview
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                >
                  {reviewCount > 0 ? reviewScore.toFixed(1) : "No reviews"}
                </span>
              </div>
              <input
                type="range"
                min="6"
                max="10"
                step="0.1"
                value={reviewScore}
                onChange={(e) => setReviewScore(parseFloat(e.target.value))}
                className="w-full"
                disabled={reviewCount === 0}
              />
              <div className="flex justify-between mt-1 text-sm">
                <span>Poor</span>
                <span>Competitor Median: {medianCompetitorReview}</span>
                <span>Excellent</span>
              </div>
              {reviewCount > 0 && (
                <div className="text-xs mt-1">
                  <span
                    className={
                      reviewScore >= medianCompetitorReview
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {metrics.reviewImpact.status} • Rank impact:{" "}
                    {reviewImpact.rankImpact > 0 ? "+" : ""}
                    {reviewImpact.rankImpact.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Number of Reviews</span>
                <span
                  className={`font-bold ${getReviewCountColor(reviewCount)}`}
                >
                  {reviewCount > 0 ? reviewCount : "None"}
                  {reviewCount > 0 && (
                    <span className="font-normal text-xs ml-1">
                      ({metrics.listingMaturity.level})
                    </span>
                  )}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={reviewCount}
                onChange={(e) => setReviewCount(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                Listing maturity impact:{" "}
                {((metrics.listingMaturity.factor - 1) * 100).toFixed(0)}%
                visibility boost
              </div>
            </div>

            <div className="mt-4">
              <div className="flex justify-between mb-1">
                <span>Cancellation Rate (%)</span>
                <span
                  className={`font-bold ${cancellationRate <= 5
                      ? "text-green-600"
                      : cancellationRate >= 15
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                >
                  {cancellationRate}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={cancellationRate}
                onChange={(e) => setCancellationRate(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                Historical cancellation rate significantly impacts ranking
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1">Cancellation Policy</div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  className={`py-2 px-3 rounded border ${cancellationPolicy === "flexible"
                      ? "bg-blue-100 border-blue-500"
                      : ""
                    }`}
                  onClick={() => selectCancellationPolicy("flexible")}
                >
                  Flexible
                </button>
                <button
                  className={`py-2 px-3 rounded border ${cancellationPolicy === "moderate"
                      ? "bg-blue-100 border-blue-500"
                      : ""
                    }`}
                  onClick={() => selectCancellationPolicy("moderate")}
                >
                  Moderate
                </button>
                <button
                  className={`py-2 px-3 rounded border ${cancellationPolicy === "strict"
                      ? "bg-blue-100 border-blue-500"
                      : ""
                    }`}
                  onClick={() => selectCancellationPolicy("strict")}
                >
                  Strict
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                id="preferredToggle"
                checked={isPreferredPartner}
                onChange={() => setIsPreferredPartner(!isPreferredPartner)}
                className="mr-2"
              />
              <label htmlFor="preferredToggle" className="text-sm">
                Preferred Partner Status{" "}
                <span className="text-blue-600 font-medium">
                  (boosts visibility and occupancy)
                </span>
              </label>
            </div>

            <div className="mt-2 text-sm text-gray-600">
              Quality Score:{" "}
              <span className={getColor(metrics.qualityScore)}>
                {metrics.qualityScore}%
              </span>
            </div>
          </div>

          {/* Booking.com Pricing Strategy */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-3">
              Pricing and Marketing Strategy
            </h3>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>PMS Markup (%)</span>
                <span
                  className={`font-bold ${pmsMarkup - effectiveDiscountPercent < 0
                      ? "text-red-500"
                      : "text-green-600"
                    }`}
                >
                  {pmsMarkup}%{" "}
                  {pmsMarkup > 0 ? `(Net margin: ${metrics.pmsMargin}%)` : ""}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="30"
                value={pmsMarkup}
                onChange={(e) => setPmsMarkup(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                Add markup to offset discount costs while maintaining
                competitive pricing
              </div>
            </div>

            {/* NEW: Additional Guest Price */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Additional Guest Price (£)</span>
                <span className={`font-bold ${additionalGuestPrice > 0 ? "text-green-600" : ""}`}>
                  £{additionalGuestPrice} per extra guest
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={additionalGuestPrice}
                onChange={(e) => setAdditionalGuestPrice(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between mb-1 mt-2">
                <span>Average Group Size</span>
                <span className="font-bold">
                  {averageGroupSize} guests
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="4"
                step="0.1"
                value={averageGroupSize}
                onChange={(e) => setAverageGroupSize(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                {additionalGuestPrice > 0
                  ? `Average extra revenue: £${metrics.additionalGuestRevenue} per booking`
                  : "Set a price for additional guests to increase revenue"
                }
              </div>
              <div className="text-xs text-blue-600 mt-1">
                {additionalGuestPrice > 0 && averageGroupSize > 1
                  ? `Effective rate: £${baseAdr} base + £${metrics.additionalGuestRevenue} extra = £${metrics.effectiveBaseRateWithGuests}`
                  : ""
                }
              </div>
            </div>

            {/* Length of Stay Discount Options */}
            <div className="mt-4 mb-2 font-medium border-t pt-3">Booking.com Rates</div>

            <div className="flex items-center mb-2">
              <input
              type="checkbox"
              id="weeklyToggle"
              checked={discountTypes.weekly.active}
              onChange={() => toggleDiscount("weekly")}
              className="mr-2"
              />
              <label htmlFor="weeklyToggle" className="flex-grow">
              <span className={discountTypes.weekly.active ? "font-medium" : ""}>
                7-Day Stay Discount
                {discountTypes.weekly.active && (
                <span className="ml-2 text-xs bg-green-600 text-white px-1 py-0.5 rounded">
                  -{discountTypes.weekly.value}%
                </span>
                )}
              </span>
              </label>
            </div>

            <div className="flex items-center">
              <input
              type="checkbox"
              id="monthlyToggle"
              checked={discountTypes.monthly.active}
              onChange={() => toggleDiscount("monthly")}
              className="mr-2"
              />
              <label htmlFor="monthlyToggle" className="flex-grow">
              <span className={discountTypes.monthly.active ? "font-medium" : ""}>
                30-Day Stay Discount
                {discountTypes.monthly.active && (
                <span className="ml-2 text-xs bg-blue-600 text-white px-1 py-0.5 rounded">
                  -{discountTypes.monthly.value}%
                </span>
                )}
              </span>
              </label>
            </div>

            {/* Length-of-Stay Benefits Info */}
            {(discountTypes.weekly.active || discountTypes.monthly.active) && (
              <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
              {discountTypes.weekly.active && (
                <div className="mb-1">
                <span className="font-medium">Weekly Stay ({discountTypes.weekly.value}% off):</span>
                <span className="text-gray-600"> boosting occupancy and rank</span>
                </div>
              )}
              {discountTypes.monthly.active && (
                <div>
                <span className="font-medium">Monthly Stay ({discountTypes.monthly.value}% off):</span>
                    <span className="text-gray-600"> boosting occupancy and rank</span>
                </div>
              )}
              {discountTypes.monthly.active && (
                <div>
                  <span className="text-gray-600"> Offers both weekly and monthly flexibility to attract diverse booking patterns</span>
                </div>
              )}
              </div>
            )}

            {/* Visibility Booster that directly controls commission */}
            <div className="mt-4 mb-2 font-medium border-t pt-3"></div>
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Booking.com Commission + Visibility Booster</span>
                <span
                  className={`font-bold ${visibilityBooster > 0 ? "text-green-600" : ""
                    }`}
                >
                  {15 + visibilityBooster}%{" "}
                  {visibilityBooster > 0 ? "(Boosted)" : "(Standard)"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="15"
                step="3"
                value={visibilityBooster}
                onChange={(e) => setVisibilityBooster(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                {visibilityBooster > 0
                  ? `${15 + visibilityBooster
                  }% commission with visibility boost: improving rank by ~${metrics.visibilityBoosterImpact
                  } positions`
                  : "15% standard commission (no visibility boost)"}
              </div>
            </div>

            <div className="mb-2 font-medium">Discount Programs</div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="geniusToggle"
                    checked={discountTypes.genius.active}
                    onChange={() => toggleDiscount("genius")}
                    className="mr-2"
                  />
                  <label htmlFor="geniusToggle">
                    Genius Program{" "}
                    {discountTypes.genius.active
                      ? `(${discountTypes.genius.value}% off, Level ${discountTypes.genius.level})`
                      : "(inactive)"}
                  </label>
                </div>
                {discountTypes.genius.active && (
                  <button
                    onClick={toggleGeniusLevel}
                    className="text-xs bg-blue-100 px-2 py-1 rounded border border-blue-200"
                  >
                    {discountTypes.genius.level === 1 ? "Level 1" : "Level 2"}
                  </button>
                )}
              </div>

              <div className="flex items-center border-b pb-2">
                <input
                  type="checkbox"
                  id="targetedToggle"
                  checked={discountTypes.targeted.active}
                  onChange={() => toggleDiscount("targeted")}
                  className="mr-2"
                />
                <label htmlFor="targetedToggle">
                  Targeted Rates{" "}
                  {discountTypes.targeted.active
                    ? `(${discountTypes.targeted.value}% off, mobile/country)`
                    : "(inactive)"}
                </label>
              </div>

              <div className="flex items-center border-b pb-2">
                <input
                  type="checkbox"
                  id="campaignToggle"
                  checked={discountTypes.campaign.active}
                  onChange={() => toggleDiscount("campaign")}
                  className="mr-2"
                />
                <label htmlFor="campaignToggle" className="flex-grow">
                  <span
                    className={
                      discountTypes.campaign.active ? "font-medium" : ""
                    }
                  >
                    Campaign Deals{" "}
                    {discountTypes.campaign.active
                      ? `(${discountTypes.campaign.value}% off)`
                      : "(inactive)"}
                  </span>
                  {discountTypes.campaign.active && (
                    <span className="ml-2 text-xs bg-yellow-500 text-white px-1 py-0.5 rounded">
                      DEAL
                    </span>
                  )}
                </label>
              </div>

              <div className="flex items-center border-b pb-2">
                <input
                  type="checkbox"
                  id="portfolioToggle"
                  checked={discountTypes.portfolio.active}
                  onChange={() => toggleDiscount("portfolio")}
                  className="mr-2"
                />
                <label htmlFor="portfolioToggle">
                  Portfolio Deals{" "}
                  {discountTypes.portfolio.active
                    ? `(${discountTypes.portfolio.value}% off, early/late)`
                    : "(inactive)"}
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="deepToggle"
                  checked={discountTypes.deep.active}
                  onChange={() => toggleDiscount("deep")}
                  className="mr-2"
                />
                <label htmlFor="deepToggle" className="flex-grow">
                  <span
                    className={discountTypes.deep.active ? "font-medium" : ""}
                  >
                    Deep Deals{" "}
                    {discountTypes.deep.active
                      ? `(${discountTypes.deep.value}% off)`
                      : "(inactive)"}
                  </span>
                  {discountTypes.deep.active && (
                    <span className="ml-2 text-xs bg-red-500 text-white px-1 py-0.5 rounded">
                      LIMITED TIME
                    </span>
                  )}
                </label>
              </div>
              {!discountTypes.genius.active && discountTypes.deep.active && (
                <div className="text-xs text-red-500 mt-1">
                  Deep Deals require Genius to be active
                </div>
              )}
            </div>

            {/* Badge Impact Information - Updated with more realistic values */}
            {hasPromotionalBadge() && (
              <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                <p className="text-sm text-blue-800 font-medium">
                  Deal Badge Benefits:
                </p>
                <ul className="text-xs text-blue-700 mt-1 ml-4 list-disc">
                  <li>Improves search rank by 15 positions</li>
                  <li>
                    Boosts visibility by{" "}
                    {discountTypes.deep.active ? "25%" : "15%"}
                  </li>
                  <li>
                    Increases conversion by{" "}
                    {discountTypes.deep.active ? "0.5%" : "0.3%"}
                  </li>
                  <li>
                    Enhances occupancy by{" "}
                    {discountTypes.deep.active ? "8%" : "5%"}
                  </li>
                  <li>
                    Allows pricing {metrics.badgeImpactFactor} higher than
                    comparable unbadged properties
                  </li>
                </ul>
              </div>
            )}
          </div>

          {/* My Property Availability & Rules */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-bold text-lg mb-3">
              My Property Availability & Rules
            </h3>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Days Available (out of 365)</span>
                <span
                  className={`font-medium ${daysAvailable > 300
                      ? "text-green-600"
                      : daysAvailable > 200
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                >
                  {daysAvailable}
                </span>
              </div>
              <input
                type="range"
                min="30"
                max="365"
                value={daysAvailable}
                onChange={(e) => setDaysAvailable(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Minimum Stay (nights)</span>
                <span
                  className={`font-medium ${minStay > 2 ? "text-red-500" : ""}`}
                >
                  {minStay}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="7"
                value={minStay}
                onChange={(e) => setMinStay(parseInt(e.target.value))}
                className="w-full"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Bookable Days Ahead</span>
                <span
                  className={`font-medium ${bookableDaysAhead <= 1
                      ? "text-green-600"
                      : bookableDaysAhead >= 6
                        ? "text-yellow-500"
                        : ""
                    }`}
                >
                  {bookableDaysAhead === 0
                    ? "Same day"
                    : `${bookableDaysAhead} days`}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="7"
                value={bookableDaysAhead}
                onChange={(e) => setBookableDaysAhead(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                {metrics.bookingImpact.label} (
                {(metrics.bookingImpact.factor > 1 ? "+" : "") +
                  Math.round((metrics.bookingImpact.factor - 1) * 100)}
                % visibility impact)
              </div>
            </div>
          </div>

          {/* My Property Strategy Insights - Moved to Left Column */}
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50">
            <h3 className="font-bold text-lg mb-2">
              RevPAR Optimization Strategy
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                •{" "}
                {metrics.revParGap > 20 ? (
                  <span className="text-red-600">
                    Your RevPAR is significantly below seasonal target (
                    {metrics.revParGap}% gap) - consider adjusting price and
                    visibility.
                  </span>
                ) : metrics.revParGap > 0 ? (
                  <span className="text-yellow-500">
                    Your RevPAR is {metrics.revParGap}% below seasonal target - minor
                    price or visibility adjustments needed.
                  </span>
                ) : (
                  <span className="text-green-600">
                    Your RevPAR is at or above seasonal target - maintain current
                    strategy.
                  </span>
                )}
              </li>
              <li>
                •{" "}
                {metrics.occupancyRate < metrics.seasonalOccupancy - 15 ? (
                  <span className="text-red-600">
                    Occupancy ({metrics.occupancyRate}%) significantly below
                    seasonal target ({metrics.seasonalOccupancy.toFixed(1)}%) - consider
                    lowering price or increasing visibility.
                  </span>
                ) : metrics.occupancyRate < metrics.seasonalOccupancy ? (
                  <span className="text-yellow-500">
                    Occupancy slightly below seasonal target - minor adjustments could
                    help.
                  </span>
                ) : (
                  <span className="text-green-600">
                    Good occupancy rate ({metrics.occupancyRate}%) at or above
                    seasonal target.
                  </span>
                )}
              </li>
              <li>
                •{" "}
                {additionalGuestPrice === 0 && averageGroupSize > 1 ? (
                  <span className="text-yellow-500">
                    You're missing revenue potential by not charging for additional guests.
                    With average group size of {averageGroupSize}, you could increase revenue by £{Math.round(baseAdr * 0.3 * (averageGroupSize - 1))}-£{Math.round(baseAdr * 0.5 * (averageGroupSize - 1))} per booking.
                  </span>
                ) : additionalGuestPrice > 0 ? (
                  <span className="text-green-600">
                    Additional guest pricing is generating extra £{metrics.additionalGuestRevenue} per booking,
                    increasing your effective base rate by {Math.round((metrics.additionalGuestRevenue / baseAdr) * 100)}%.
                  </span>
                ) : (
                  <span className="text-gray-600">
                    With current average group size of {averageGroupSize}, additional guest pricing would have minimal impact.
                  </span>
                )}
              </li>
              <li>
                •{" "}
                {metrics.netAdrAfterCommission < metrics.seasonalTargetRevPar * 100 / metrics.seasonalOccupancy * 0.9 ? (
                  <span className="text-yellow-500">
                    Net ADR (£{metrics.netAdrAfterCommission}) below optimal for seasonal target - consider raising base price or adding charges for additional guests.
                  </span>
                ) : metrics.netAdrAfterCommission > metrics.seasonalTargetRevPar * 100 / metrics.seasonalOccupancy * 1.2 ? (
                  <span className="text-yellow-500">
                    Net ADR significantly higher than optimal for this season - may be reducing
                    occupancy and total revenue.
                  </span>
                ) : (
                  <span className="text-green-600">
                    Net ADR is well balanced for maximum RevPAR in current season.
                  </span>
                )}
              </li>
              <li>
                •{" "}
                {hasPromotionalBadge() ? (
                  <span className="text-green-600">
                    Deal badge is boosting visibility, conversion, and allows
                    for {metrics.badgeImpactFactor} price premium without
                    hurting occupancy.
                  </span>
                ) : metrics.occupancyRate < metrics.seasonalOccupancy && !hasPromotionalBadge() ? (
                  <span className="text-blue-600">
                    Adding a promotional badge could increase occupancy by 5-8%
                    while maintaining or increasing ADR.
                  </span>
                ) : (
                  <span className="text-blue-600">
                    Consider promotional badges for increased visibility and
                    conversion.
                  </span>
                )}
              </li>
              <li>
                •{" "}
                {metrics.revenueAchievement < 70 ? (
                  <span className="text-red-600">
                    Only achieving {metrics.revenueAchievement}% of seasonal target
                    revenue (£{metrics.monthlyRevenue}/£
                    {metrics.seasonalTargetMonthlyRevenue}) - significant strategy
                    changes needed.
                  </span>
                ) : metrics.revenueAchievement < 90 ? (
                  <span className="text-yellow-500">
                    Achieving {metrics.revenueAchievement}% of seasonal target revenue -
                    further optimization needed.
                  </span>
                ) : (
                  <span className="text-green-600">
                    Successfully achieving {metrics.revenueAchievement}% of
                    seasonal revenue target of £{metrics.seasonalTargetMonthlyRevenue}.
                  </span>
                )}
              </li>
              <li>
                •{" "}
                {isPreferredPartner ? (
                  <span className="text-green-600">
                    Preferred Partner status is boosting both occupancy (+10%)
                    and ADR potential.
                  </span>
                ) : (
                  <span className="text-yellow-500">
                    Preferred Partner status would increase RevPAR by improving
                    both occupancy and ADR potential.
                  </span>
                )}
              </li>
              <li>
                •{" "}
                {visibilityBooster > 0 ? (
                  <span className="text-green-600">
                    Visibility Booster ({visibilityBooster}%) is improving
                    search position and occupancy, increasing overall RevPAR
                    despite higher commission.
                  </span>
                ) : metrics.rank > totalCompetitors * 0.3 ? (
                  <span className="text-yellow-500">
                    Consider adding Visibility Booster to improve rank
                    (currently #{metrics.rank}) and increase occupancy.
                  </span>
                ) : (
                  <span className="text-blue-600">
                    Good rank position - visibility booster may not be
                    necessary.
                  </span>
                )}
              </li>
              <li>
                •{" "}
                <span className="text-blue-600">
                  Balance strategy:{" "}
                  {metrics.revPar > metrics.seasonalTargetRevPar
                    ? "Current RevPAR exceeds seasonal target - maintain current approach"
                    : "Adjust price and visibility to achieve seasonal target RevPAR of £" +
                    metrics.seasonalTargetRevPar}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* COLUMN 2 - COMPETITOR & MARKET */}
        <div className="space-y-6">
          <div className="bg-green-50 p-2 rounded-lg text-center font-bold text-green-800 shadow-sm">
            Competitor Median & Market Settings
          </div>

          {/* Competitor Median Property */}
          <div className="p-4 border border-green-200 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Quality to Value Metrics</h3>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Intrinsic Quality</span>
                <span
                  className={`font-bold ${competitorIntrinsicQuality > intrinsicQuality
                      ? "text-red-500"
                      : competitorIntrinsicQuality < intrinsicQuality
                        ? "text-green-600"
                        : "text-yellow-500"
                    }`}
                >
                  {competitorIntrinsicQuality}%
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={competitorIntrinsicQuality}
                onChange={(e) =>
                  setCompetitorIntrinsicQuality(parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                {(() => {
                  // Using same explanation function as your property
                  if (competitorIntrinsicQuality <= 40) {
                    return "Basic properties with minimal amenities. Less desirable locations, basic photos, minimal furnishings.";
                  } else if (competitorIntrinsicQuality <= 60) {
                    return "Average properties with standard amenities. Good locations, decent photos, standard furnishings.";
                  } else if (competitorIntrinsicQuality <= 80) {
                    return "Above average properties with good amenities. Attractive locations, professional photos, good furnishings.";
                  } else {
                    return "Exceptional properties with premium amenities. Prime locations, professional photography, luxury furnishings.";
                  }
                })()}
              </div>
              <div className="text-xs mt-1">
                <span
                  className={
                    intrinsicQuality > competitorIntrinsicQuality
                      ? " text-green-600"
                      : intrinsicQuality < competitorIntrinsicQuality
                        ? " text-red-500"
                        : ""
                  }
                >
                  {intrinsicQuality !== competitorIntrinsicQuality && (
                    <>
                      {""}
                      {intrinsicQuality > competitorIntrinsicQuality
                        ? `You're +${intrinsicQuality - competitorIntrinsicQuality
                        }% better`
                        : `You're ${intrinsicQuality - competitorIntrinsicQuality
                        }% behind`}
                    </>
                  )}
                </span>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Base ADR (£)</span>
                <span className="font-medium">£{medianCompetitorPrice}</span>
              </div>
              <input
                type="range"
                min="25"
                max="500"
                value={medianCompetitorPrice}
                onChange={(e) =>
                  setMedianCompetitorPrice(parseInt(e.target.value))
                }
                className="w-full"
              />
              <div className="text-sm text-gray-600 mt-1">
                Your price relative to the median competitor:{" "}
                {(pmsMarkup > 0
                  ? Math.round(baseAdr * (1 + pmsMarkup / 100))
                  : baseAdr) > medianCompetitorPrice
                  ? `+${Math.round(
                    ((pmsMarkup > 0
                      ? baseAdr * (1 + pmsMarkup / 100)
                      : baseAdr) /
                      medianCompetitorPrice -
                      1) *
                    100
                  )}%`
                  : (pmsMarkup > 0
                    ? Math.round(baseAdr * (1 + pmsMarkup / 100))
                    : baseAdr) < medianCompetitorPrice
                    ? `-${Math.round(
                      (1 -
                        (pmsMarkup > 0
                          ? baseAdr * (1 + pmsMarkup / 100)
                          : baseAdr) /
                        medianCompetitorPrice) *
                      100
                    )}%`
                    : "on par"}
              </div>
              <div className="text-xs text-blue-600 mt-1">
                When competitor prices increase, your optimal Net ADR increases
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Review Score</span>
                <span>{medianCompetitorReview.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="7.0"
                max="9.0"
                step="0.1"
                value={medianCompetitorReview}
                onChange={(e) =>
                  setMedianCompetitorReview(parseFloat(e.target.value))
                }
                className="w-full"
              />
            </div>
          </div>

          {/* Market Variables */}
          <div className="p-4 border border-green-200 rounded-lg">
            <h3 className="font-bold text-lg mb-3">Market Variables</h3>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Total Available Properties in Market</span>
                <span className="font-medium">{totalCompetitors}</span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                value={totalCompetitors}
                onChange={(e) => setTotalCompetitors(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                Total available properties in your Booking.com search area
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span>Seasonality Demand</span>
                <span className="font-medium">
                  {seasonality < 30
                    ? "Low Season"
                    : seasonality > 70
                      ? "High Season"
                      : "Standard Season"}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={seasonality}
                onChange={(e) => setSeasonality(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-xs text-gray-600 mt-1">
                <p>
                  Seasonality represents all demand fluctuations affecting your
                  market:
                </p>
                <ul className="mt-1 ml-4 list-disc">
                  <li>
                    <span className="text-red-600">Low Season (0-30%)</span>:
                    Lower demand, increased price sensitivity. Consider
                    promotional rates and relaxed policies.
                  </li>
                  <li>
                    <span className="text-yellow-600">
                      Standard Season (31-70%)
                    </span>
                    : Balanced demand. Maintain competitive pricing with
                    selective promotions.
                  </li>
                  <li>
                    <span className="text-green-600">
                      High Season (71-100%)
                    </span>
                    : Peak demand, reduced price sensitivity. Opportunity for
                    premium pricing and stricter policies.
                  </li>
                </ul>

                <p className="mt-1 font-medium">
                  Includes multiple demand factors:
                </p>
                <ul className="ml-4 list-disc">
                  <li>
                    <span className="font-medium">Annual patterns</span>:
                    Summer/winter peaks, shoulder seasons, off-peak periods
                  </li>
                  <li>
                    <span className="font-medium">Weekly patterns</span>:
                    Weekday (business) vs weekend (leisure) demand differences
                  </li>
                  <li>
                    <span className="font-medium">Event-driven demand</span>:
                    Conferences, festivals, sports events, holidays causing
                    temporary spikes
                  </li>
                </ul>

                <div className="mt-1">
                  <span className="font-medium">Performance impact:</span> views
                  (+/- {Math.round((seasonality - 50) * 1.5)} per day),
                  conversion rate (+/-{" "}
                  {(((seasonality - 50) / 100) * 0.4).toFixed(2)}%), optimal ADR
                  (factor: {(0.7 + (seasonality / 100) * 0.6).toFixed(2)}x)
                </div>

                <div className="mt-1 italic">
                  Pro tip: Adjust discounts and minimum stay requirements based
                  on seasonality type - use targeted promotions for weekdays in
                  high season and deep discounts during low season events.
                </div>
              </div>
            </div>
          </div>

          {/* Competitor Analysis Dashboard */}
          <div className="p-4 border border-green-200 rounded-lg bg-white">
            <h3 className="font-bold text-lg mb-3">
              Competitive Position Analysis
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold mb-1">Your ADR</div>
                <div className="text-xl font-bold">
                  £
                  {metrics.effectiveBaseRateWithGuests}
                </div>
                <div className="text-sm mt-1">
                  vs. Competitors: £{medianCompetitorPrice}
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {metrics.effectiveBaseRateWithGuests > medianCompetitorPrice
                    ? "Higher than market average"
                    : metrics.effectiveBaseRateWithGuests < medianCompetitorPrice
                      ? "Lower than market average"
                      : "At market average"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold mb-1">Your Quality</div>
                <div className="text-xl font-bold">{intrinsicQuality}%</div>
                <div className="text-sm mt-1">
                  vs. Competitors: {competitorIntrinsicQuality}%
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {intrinsicQuality > competitorIntrinsicQuality
                    ? "Better than competitors"
                    : intrinsicQuality < competitorIntrinsicQuality
                      ? "Needs improvement"
                      : "At market average"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold mb-1">Your Position</div>
                <div className="text-xl font-bold">#{metrics.rank}</div>
                <div className="text-sm mt-1">
                  of {totalCompetitors} properties
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {metrics.rank <= totalCompetitors * 0.25
                    ? "Top quartile"
                    : metrics.rank <= totalCompetitors * 0.5
                      ? "Second quartile"
                      : metrics.rank <= totalCompetitors * 0.75
                        ? "Third quartile"
                        : "Bottom quartile"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold mb-1">Market Demand</div>
                <div className="text-xl font-bold">
                  {seasonality < 30
                    ? "Low"
                    : seasonality > 70
                      ? "High"
                      : "Medium"}
                </div>
                <div className="text-sm mt-1">{seasonality}% peak capacity</div>
                <div className="text-xs mt-1 text-gray-600">
                  {seasonality > 70
                    ? "Premium pricing opportunity"
                    : seasonality < 30
                      ? "Consider promotional rates"
                      : "Balanced pricing recommended"}
                </div>
              </div>
            </div>
          </div>

          {/* RevPAR and Occupancy Analysis */}
          <div className="p-4 border border-green-200 rounded-lg bg-white">
            <h3 className="font-bold text-lg mb-3">
              RevPAR & Occupancy Analysis
            </h3>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold mb-1">Your RevPAR</div>
                <div
                  className={`text-xl font-bold ${getRevParColor(
                    metrics.revPar,
                    metrics.seasonalTargetRevPar
                  )}`}
                >
                  £{metrics.revPar}
                </div>
                <div className="text-sm mt-1">
                  Target: £{metrics.seasonalTargetRevPar}
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {metrics.revParGap > 0
                    ? `${metrics.revParGap}% below target`
                    : metrics.revParGap < 0
                      ? `${Math.abs(metrics.revParGap)}% above target`
                      : "At target level"}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold mb-1">Your Occupancy</div>
                <div
                  className={`text-xl font-bold ${getOccupancyColor(
                    metrics.occupancyRate
                  )}`}
                >
                  {metrics.occupancyRate}%
                </div>
                <div className="text-sm mt-1">
                  Target: {metrics.seasonalOccupancy.toFixed(1)}%
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {metrics.occupancyRate >= competitorOccupancy + 10
                    ? "Significantly outperforming market"
                    : metrics.occupancyRate >= competitorOccupancy
                      ? "Outperforming market average"
                      : metrics.occupancyRate >= competitorOccupancy - 10
                        ? "Slightly below market average"
                        : "Significantly underperforming market"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="text-sm font-semibold mb-1">
                  Revenue Achievement
                </div>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div
                      className={`h-2.5 rounded-full ${metrics.revenueAchievement >= 90
                          ? "bg-green-600"
                          : metrics.revenueAchievement >= 70
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      style={{
                        width: `${Math.min(100, metrics.revenueAchievement)}%`,
                      }}
                    ></div>
                  </div>
                  <span
                    className={`text-sm font-medium ${getRevenueAchievementColor(
                      metrics.revenueAchievement
                    )}`}
                  >
                    {metrics.revenueAchievement}%
                  </span>
                </div>
                <div className="text-sm mt-1 flex justify-between">
                  <span>Monthly Est: £{metrics.monthlyRevenue}</span>
                  <span>Target: £{metrics.seasonalTargetMonthlyRevenue}</span>
                </div>
                <div className="text-xs mt-1 text-gray-600">
                  {metrics.monthlyRevenue >= metrics.seasonalTargetMonthlyRevenue
                    ? `Exceeding target by £${Math.round(
                      metrics.monthlyRevenue -
                      metrics.seasonalTargetMonthlyRevenue
                    )}/month`
                    : `£${Math.round(
                      metrics.seasonalTargetMonthlyRevenue -
                      metrics.monthlyRevenue
                    )} below monthly potential for this season`}
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 mb-1">
                Optimal Net RevPAR Target Formula
              </h4>
              <p className="text-xs text-blue-700">
                Target RevPAR = (Base ADR + Extra Guest Revenue) × 80% × (1 - Commission%) × (Seasonal Occupancy%)
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Your seasonal occupancy target: {metrics.seasonalOccupancy.toFixed(1)}% is determined by the current seasonality level.
              </p>
              <p className="text-xs text-blue-700 mt-1">
                Additional guest pricing significantly impacts RevPAR with no effect on occupancy rates, making it a valuable revenue optimization tool.
              </p>
            </div>
          </div>

          {/* Price to Quality Analysis */}
          <div className="p-4 border border-green-200 rounded-lg bg-white">
            <h3 className="font-bold text-lg mb-3">
              Price-to-Quality Analysis
            </h3>

            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold mb-2">Price/Quality Position</div>
              <div className="relative h-32 bg-gray-100 rounded border">
                {/* Quality axis (vertical) */}
                <div className="absolute left-0 top-0 h-full border-r border-gray-300 flex flex-col justify-between p-1">
                  <span className="text-xs text-gray-600">High Quality</span>
                  <span className="text-xs text-gray-600">Low Quality</span>
                </div>

                {/* Price axis (horizontal) */}
                <div className="absolute bottom-0 left-0 w-full border-t border-gray-300 flex justify-between p-1">
                  <span className="text-xs text-gray-600">Low Price</span>
                  <span className="text-xs text-gray-600">High Price</span>
                </div>

                {/* Competitor position */}
                <div
                  className="absolute w-3 h-3 bg-gray-500 rounded-full"
                  style={{
                    bottom: `${(competitorIntrinsicQuality / 100) * 80}%`,
                    left: `${(medianCompetitorPrice / 200) * 80 + 10}%`
                  }}
                ></div>

                {/* Your position */}
                <div
                  className="absolute w-4 h-4 bg-blue-500 rounded-full"
                  style={{
                    bottom: `${(intrinsicQuality / 100) * 80}%`,
                    left: `${(baseAdr / 200) * 80 + 10}%`
                  }}
                ></div>

                {/* Position indicator */}
                <div className="absolute top-2 right-2 text-xs">
                  {intrinsicQuality > competitorIntrinsicQuality && baseAdr < medianCompetitorPrice
                    ? "High Value Position"
                    : intrinsicQuality < competitorIntrinsicQuality && baseAdr > medianCompetitorPrice
                      ? "Low Value Position"
                      : intrinsicQuality > competitorIntrinsicQuality && baseAdr > medianCompetitorPrice
                        ? "Premium Position"
                        : "Budget Position"}
                </div>
              </div>
              <div className="text-xs mt-2 text-gray-600">
                <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                Your property
                <span className="inline-block w-2 h-2 bg-gray-500 rounded-full ml-3 mr-1"></span>
                Competitor median
              </div>
            </div>

            <div className="text-sm">
              <p className="mb-2">Price-Quality Analysis:</p>
              <ul className="ml-4 list-disc text-xs space-y-1">
                <li>
                  {intrinsicQuality > competitorIntrinsicQuality &&
                    metrics.effectiveBaseRateWithGuests < medianCompetitorPrice
                    ? "Your property offers better quality at a lower price - excellent value proposition but potential for higher RevPAR with price increases"
                    : intrinsicQuality < competitorIntrinsicQuality &&
                      metrics.effectiveBaseRateWithGuests > medianCompetitorPrice
                      ? "Your property has lower quality but higher prices than competitors - likely to struggle with occupancy and conversion. Consider improving quality or lowering prices."
                      : intrinsicQuality > competitorIntrinsicQuality &&
                        metrics.effectiveBaseRateWithGuests > medianCompetitorPrice
                        ? "Your property justifies premium pricing with higher quality - focus on communicating your value proposition"
                        : "Budget positioning with lower quality and prices - focus on efficiency and volume"}
                </li>
                <li>
                  {additionalGuestPrice > 0
                    ? "Your additional guest pricing helps increase effective ADR without negatively affecting your competitive price positioning"
                    : "Adding additional guest pricing could help improve revenue while maintaining competitive base rates"}
                </li>
                <li>
                  {hasPromotionalBadge()
                    ? "Your promotional badge allows you to maintain higher pricing while still attracting bookings"
                    : "Adding a promotional badge could help improve your price-to-value perception"}
                </li>
                <li>
                  Optimal strategy:{" "}
                  {metrics.revPar < metrics.seasonalTargetRevPar
                    ? "Adjust your position closer to optimal price-quality balance to increase RevPAR"
                    : "Maintain your current price-quality balance to sustain strong RevPAR"}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingMetricsSlider;