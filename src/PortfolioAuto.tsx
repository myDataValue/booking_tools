import React, { useState } from 'react';

// Mock data for demonstration
const mockProperties = [
  {
    id: 1,
    name: "Ocean Views, Pool & Spa, A/C, Rooftop Patio",
    description: "Coastal Retreat",
    image: "https://cf.bstatic.com/xdata/images/hotel/square600/489672118.webp?k=11ea44b91cbb73fc4d5cd9196a11c416838e0928e99278e7f2fb163226bf0fc0&o=",
    city: "San Diego",
    adr: 700,
    availableDates: 153,
    pmsMarkup: 10,
    visibilityBooster: 18, // Added visibility booster percentage
    guestAdr: 770,
    netAdr: 693,
    promotions: {
      limitedTimeDeal: "active",
      genius: "active",
      mobileRate: "inactive",
      countryRate: "inactive",
      getawayDeal: "active",
      customYearlyDeal: "active",
      basicDeal: "inactive",
      lastMinuteDeal: "active",
      earlyBookerDeal: "inactive",
      weeklyDiscount: "active",
      monthlyDiscount: "active"
    },
    cancellationPolicies: {
      flexible: "active",
      firm: "inactive",
      nonRefundable: "active"
    },
    tags: ["passive strategy", "high-yield"],
    active: true
  },
  {
    id: 2,
    name: "Downtown La Jolla, Walk to Cove, Country Club",
    description: "La Jolla Dream",
    image: "https://cf.bstatic.com/xdata/images/hotel/square600/632841881.webp?k=bea93dc1e6564e57f4f872efe6a3a26a759c72bccf7f438e017d7a48be51a9ca&o=",
    city: "La Jolla",
    adr: 311,
    availableDates: 142,
    pmsMarkup: 8,
    visibilityBooster: 15, // Added visibility booster percentage
    guestAdr: 335.88,
    netAdr: 306.12,
    promotions: {
      limitedTimeDeal: "inactive",
      genius: "active",
      mobileRate: "active",
      countryRate: "active",
      getawayDeal: "active",
      customYearlyDeal: "inactive",
      basicDeal: "active",
      lastMinuteDeal: "inactive",
      earlyBookerDeal: "active",
      weeklyDiscount: "inactive",
      monthlyDiscount: "active"
    },
    cancellationPolicies: {
      flexible: "active",
      firm: "active",
      nonRefundable: "inactive"
    },
    tags: ["normal strategy", "budget"],
    active: true
  },
  {
    id: 3,
    name: "Urban Loft with City Views",
    description: "Downtown Loft",
    image: "https://cf.bstatic.com/xdata/images/hotel/square600/436972869.webp?k=ec128ab2b8c57b1f6ea53042ef2147260dfd9ff555dc51781133472f9d4f7874&o=",
    city: "San Diego",
    adr: 245,
    availableDates: 97,
    pmsMarkup: 7,
    visibilityBooster: 25, // Added visibility booster percentage
    guestAdr: 262.15,
    netAdr: 241,
    promotions: {
      limitedTimeDeal: "na",
      genius: "inactive",
      mobileRate: "inactive",
      countryRate: "active",
      getawayDeal: "inactive",
      customYearlyDeal: "na",
      basicDeal: "inactive",
      lastMinuteDeal: "inactive",
      earlyBookerDeal: "active",
      weeklyDiscount: "inactive",
      monthlyDiscount: "inactive"
    },
    cancellationPolicies: {
      flexible: "inactive",
      firm: "inactive",
      nonRefundable: "active"
    },
    tags: ["aggressive strategy", "standard"],
    active: false
  },
  {
    id: 4,
    name: "Beachfront Condo with Private Access",
    description: "Paradise Beach",
    image: "https://cf.bstatic.com/xdata/images/hotel/square600/161111259.webp?k=671489effcd9f9423079eb033fc574dc26cc9b4d679e1830caf23114b0ec304a&o=",
    city: "Coronado",
    adr: 525,
    availableDates: 124,
    pmsMarkup: 9,
    visibilityBooster: 30, // Added visibility booster percentage
    guestAdr: 572.25,
    netAdr: 518,
    promotions: {
      limitedTimeDeal: "active",
      genius: "active",
      mobileRate: "active",
      countryRate: "inactive",
      getawayDeal: "inactive",
      customYearlyDeal: "active",
      basicDeal: "active",
      lastMinuteDeal: "inactive",
      earlyBookerDeal: "active",
      weeklyDiscount: "active",
      monthlyDiscount: "inactive"
    },
    cancellationPolicies: {
      flexible: "inactive",
      firm: "active",
      nonRefundable: "active"
    },
    tags: ["aggressive strategy", "budget", "room"],
    active: true
  },
  {
    id: 5,
    name: "Mountain View Cabin with Hot Tub",
    description: "Mountain Escape",
    image: "https://cf.bstatic.com/xdata/images/hotel/square600/560043298.webp?k=652f6d1408c5718c559b84f0302f76ed52545f55f7b034f3240a771259631c29&o=",
    city: "Julian",
    adr: 195,
    availableDates: 165,
    pmsMarkup: 6,
    visibilityBooster: 20, // Added visibility booster percentage
    guestAdr: 206.7,
    netAdr: 192,
    promotions: {
      limitedTimeDeal: "inactive",
      genius: "inactive",
      mobileRate: "active",
      countryRate: "active",
      getawayDeal: "active",
      customYearlyDeal: "inactive",
      basicDeal: "inactive",
      lastMinuteDeal: "active",
      earlyBookerDeal: "inactive",
      weeklyDiscount: "active",
      monthlyDiscount: "active"
    },
    cancellationPolicies: {
      flexible: "na",
      firm: "inactive",
      nonRefundable: "active"
    },
    tags: ["standard strategy", "low-yield"],
    active: false
  }
];

// Calculate discount percentage based on active promotions
const calculateDiscountPercentage = (property) => {
  let discountPercentage = 0;

  // Add promotion discounts
  if (property.promotions.genius === "active") discountPercentage += 10;
  if (property.promotions.limitedTimeDeal === "active") discountPercentage += 15;
  if (property.promotions.getawayDeal === "active") discountPercentage += 10;
  if (property.promotions.lastMinuteDeal === "active") discountPercentage += 12;
  if (property.promotions.earlyBookerDeal === "active") discountPercentage += 8;

  // Add LOS discounts
  if (property.promotions.weeklyDiscount === "active") discountPercentage += 15;
  if (property.promotions.monthlyDiscount === "active") discountPercentage += 25;

  // Cap the discount at a reasonable maximum (e.g., 50%)
  return Math.min(discountPercentage, 50);
};

// Calculate Guest ADR based on base ADR, PMS markup, and discounts
const calculateGuestAdr = (property) => {
  // Start with base ADR
  const basePrice = property.adr;
  
  // Apply PMS markup
  const priceWithMarkup = basePrice * (1 + property.pmsMarkup / 100);
  
  // Calculate discount percentage
  const discountPercentage = calculateDiscountPercentage(property);
  
  // Apply discounts
  const finalPrice = priceWithMarkup * (1 - discountPercentage / 100);
  
  // Return rounded to 2 decimal places
  return Math.round(finalPrice * 100) / 100;
};

// Calculate Net ADR (the amount you receive after Booking.com commissions)
const calculateNetAdr = (property) => {
  // Start with Guest ADR (what the guest pays)
  const guestAdr = property.guestAdr || calculateGuestAdr(property);
  
  // Subtract the visibility booster commission
  const netAdr = guestAdr * (1 - property.visibilityBooster / 100);
  
  // Return rounded to 2 decimal places
  return Math.round(netAdr * 100) / 100;
};

// Update property prices when changing attributes
const updatePropertyPrices = (property, newPmsMarkup = null, newVisibilityBooster = null) => {
  const updatedProperty = { ...property };
  
  // Update PMS markup if provided
  if (newPmsMarkup !== null) {
    updatedProperty.pmsMarkup = newPmsMarkup;
  }
  
  // Update visibility booster if provided
  if (newVisibilityBooster !== null) {
    updatedProperty.visibilityBooster = newVisibilityBooster;
  }
  
  // Recalculate prices
  updatedProperty.guestAdr = calculateGuestAdr(updatedProperty);
  updatedProperty.netAdr = calculateNetAdr(updatedProperty);
  
  return updatedProperty;
};

// Add lastSyncDate to each property and calculate pricing
const propertiesWithSyncDate = mockProperties.map(property => {
  const propertyWithPrices = updatePropertyPrices(property);
  return {
    ...propertyWithPrices,
    lastSyncDate: new Date(2023, 6, Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0]
  };
});

// Generate tag list and city list from properties
const getAllTags = () => {
  const tagSet = new Set<string>();
  mockProperties.forEach(property => {
    property.tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet) as string[];
};

const getAllCities = () => {
  const citySet = new Set<string>();
  mockProperties.forEach(property => {
    citySet.add(property.city);
  });
  return Array.from(citySet) as string[];
};

const PortfolioAuto = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('All');
  const [filter, setFilter] = useState('all');
  const [properties, setProperties] = useState(propertiesWithSyncDate);
  const [selectedProperties, setSelectedProperties] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showPmsMarkupModal, setShowPmsMarkupModal] = useState(false);
  const [bulkPmsMarkup, setBulkPmsMarkup] = useState('');
  const [showVisibilityBoosterModal, setShowVisibilityBoosterModal] = useState(false);
  const [bulkVisibilityBooster, setBulkVisibilityBooster] = useState('');
  const [expandedPromotions, setExpandedPromotions] = useState<Record<number, boolean>>({});
  const [expandedLosDiscounts, setExpandedLosDiscounts] = useState<Record<number, boolean>>({});
  const [expandedCancellations, setExpandedCancellations] = useState<Record<number, boolean>>({});
  const [showAllFilterTags, setShowAllFilterTags] = useState(false);
  const [showPromotionsColumns, setShowPromotionsColumns] = useState(false);
  const [showLosDiscountColumns, setShowLosDiscountColumns] = useState(false);
  const [showCancellationsColumns, setShowCancellationsColumns] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [bookingSyncModalOpen, setBookingSyncModalOpen] = useState(false);
  const [lastSyncTimestamp, setLastSyncTimestamp] = useState("2023-07-15 14:32:45");
  const [pendingChanges, setPendingChanges] = useState<Record<string, { type: string; propertyId: number; field: string; oldValue: string; newValue: string }>>({});
  const [bookingPushModalOpen, setBookingPushModalOpen] = useState(false);

  const allTags: string[] = getAllTags();
  const allCities: string[] = getAllCities() as string[];

  // Calculate number of recommendation items
  const recommendationCount = 4; // Hardcoded for now, could be calculated dynamically

  // Calculate number of properties with limited time deals
  const propertiesWithLimitedTimeDeals = properties.filter(
    property => property.promotions.limitedTimeDeal === "active"
  ).length;

  // Count total pending changes
  const totalPendingChanges = Object.keys(pendingChanges).length;

  // Toggle expanded state for promotions
  const togglePromotions = (propertyId: number) => {
    setExpandedPromotions({
      ...expandedPromotions,
      [propertyId]: !expandedPromotions[propertyId]
    });
  };

  // Toggle expanded state for LOS discounts
  const toggleLosDiscounts = (propertyId: number) => {
    setExpandedLosDiscounts({
      ...expandedLosDiscounts,
      [propertyId]: !expandedLosDiscounts[propertyId]
    });
  };

  // Toggle expanded state for cancellations
  const toggleCancellations = (propertyId: number) => {
    setExpandedCancellations({
      ...expandedCancellations,
      [propertyId]: !expandedCancellations[propertyId]
    });
  };

  // Count active promotions for a property
  const countActivePromotions = (property: { lastSyncDate?: string; id?: number; name?: string; description?: string; image?: string; city?: string; adr?: number; availableDates?: number; pmsMarkup?: number; visibilityBooster?: number; guestAdr?: number; netAdr?: number; promotions: any; cancellationPolicies?: { flexible: string; firm: string; nonRefundable: string; }; tags?: string[]; active?: boolean; }) => {
    // Exclude weekly and monthly discounts which are now in Rate LOS Discount
    const promotionKeys = Object.keys(property.promotions).filter(
      key => key !== 'weeklyDiscount' && key !== 'monthlyDiscount'
    );
    const promotions: { [key: string]: string } = {};
    promotionKeys.forEach(key => {
      promotions[key] = property.promotions[key];
    });

    const total = Object.keys(promotions).length;
    const active = Object.values(promotions).filter(status => status === "active").length;
    const na = Object.values(promotions).filter(status => status === "na").length;
    return { active, total: total - na };
  };

  // Count active LOS discounts for a property
  const countActiveLosDiscounts = (property: { lastSyncDate?: string; id?: number; name?: string; description?: string; image?: string; city?: string; adr?: number; availableDates?: number; pmsMarkup?: number; visibilityBooster?: number; guestAdr?: number; netAdr?: number; promotions: any; cancellationPolicies?: { flexible: string; firm: string; nonRefundable: string; }; tags?: string[]; active?: boolean; }) => {
    const losDiscounts = {
      weeklyDiscount: property.promotions.weeklyDiscount,
      monthlyDiscount: property.promotions.monthlyDiscount
    };

    const total = Object.keys(losDiscounts).length;
    const active = Object.values(losDiscounts).filter(status => status === "active").length;
    const na = Object.values(losDiscounts).filter(status => status === "na").length;
    return { active, total: total - na };
  };

  // Count active cancellation policies for a property
  const countActiveCancellationPolicies = (property: { lastSyncDate?: string; id?: number; name?: string; description?: string; image?: string; city?: string; adr?: number; availableDates?: number; pmsMarkup?: number; visibilityBooster?: number; guestAdr?: number; netAdr?: number; promotions?: { limitedTimeDeal: string; genius: string; mobileRate: string; countryRate: string; getawayDeal: string; customYearlyDeal: string; basicDeal: string; lastMinuteDeal: string; earlyBookerDeal: string; weeklyDiscount: string; monthlyDiscount: string; }; cancellationPolicies: any; tags?: string[]; active?: boolean; }) => {
    const policies = property.cancellationPolicies;
    const total = Object.keys(policies).length;
    const active = Object.values(policies).filter(status => status === "active").length;
    const na = Object.values(policies).filter(status => status === "na").length;
    return { active, total: total - na };
  };

  // Handle tag selection
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  // Toggle property selection
  const togglePropertySelection = (id: number) => {
    if (selectedProperties.includes(id)) {
      setSelectedProperties(selectedProperties.filter(pId => pId !== id));
    } else {
      setSelectedProperties([...selectedProperties, id]);
    }
  };

  // Handle select all
  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedProperties([]);
    } else {
      setSelectedProperties(filteredProperties.map(p => p.id));
    }
    setSelectAll(!selectAll);
  };

  // Toggle promotion status with pending changes and price updates
  const togglePromotionStatus = (propertyId: number, promotionType: string) => {
    const property = properties.find(p => p.id === propertyId);
    const newPendingChanges = { ...pendingChanges };
    
    if (!property) return;

    const pendingKey = `${propertyId}-promotion-${promotionType}`;
    const currentStatus = property.promotions[promotionType as keyof typeof property.promotions];
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    // Skip if status is not available
    if (currentStatus === "na") return;

    // If there's a pending change trying to set the same new status we're applying now,
    // revert it by removing the pending change
    if (pendingChanges[pendingKey] && pendingChanges[pendingKey].newValue === newStatus) {
      delete newPendingChanges[pendingKey];
    }
    // If no pending change, or it's going in a different direction, create/replace it
    else if (currentStatus !== newStatus) {
      newPendingChanges[pendingKey] = {
        type: 'promotion',
        propertyId,
        field: promotionType,
        oldValue: currentStatus,
        newValue: newStatus
      };
    }

    setPendingChanges(newPendingChanges);
  };

  // Apply bulk update of cancellation policies
  const applyBulkCancellationUpdate = (policyType: string, newStatus: string) => {
    // Create pending changes for all selected properties
    const newPendingChanges: Record<string, {
      type: string;
      propertyId: number;
      field: string;
      oldValue: string;
      newValue: string;
    }> = { ...pendingChanges };

    // Track if we need to apply or revert
    let anyChangesApplied = false;

    selectedProperties.forEach(propertyId => {
      const property = properties.find(p => p.id === propertyId);
      if (!property) return;

      const pendingKey = `${propertyId}-cancellation-${policyType}`;
      const currentStatus = property.cancellationPolicies[policyType as keyof typeof property.cancellationPolicies];

      // Skip if status is not available
      if (currentStatus === "na") return;

      // If there's a pending change trying to set the same new status we're applying now,
      // revert it by removing the pending change
      if (pendingChanges[pendingKey] && pendingChanges[pendingKey].newValue === newStatus) {
        delete newPendingChanges[pendingKey];
      }
      // If no pending change, or it's going in a different direction, create/replace it
      else if (currentStatus !== newStatus) {
        newPendingChanges[pendingKey] = {
          type: 'cancellation',
          propertyId,
          field: policyType,
          oldValue: currentStatus,
          newValue: newStatus
        };
        anyChangesApplied = true;
      }
    });

    setPendingChanges(newPendingChanges);
  };

  // Apply recommended changes for limited time deals
  const applyLimitedTimeDealsRecommendation = () => {
    // Find properties with active limited time deals
    const propertiesWithLimitedTimeDeals = properties.filter(
      property => property.promotions.limitedTimeDeal === "active"
    );

    // Get IDs of properties with active limited time deals
    const affectedPropertyIds = propertiesWithLimitedTimeDeals.map(p => p.id);

    // Update properties: increase PMS markup by 40% for properties with active limited time deals
    setProperties(properties.map(property => {
      if (property.promotions.limitedTimeDeal === "active") {
        const currentMarkup = property.pmsMarkup;
        const newMarkup = Math.min(Math.round(currentMarkup * 1.4 * 10) / 10, 100); // Increase by 40%, cap at 100%, round to 1 decimal
        
        // Use updatePropertyPrices to correctly calculate both Guest ADR and Net ADR
        return {
          ...property,
          pmsMarkup: newMarkup,
          ...updatePropertyPrices({...property, pmsMarkup: newMarkup})
        };
      }
      return property;
    }));

    // Select the affected properties
    setSelectedProperties(affectedPropertyIds);

    // Show confirmation message
    alert(`Applied 40% PMS markup increase to ${affectedPropertyIds.length} properties with active Limited Time Deals.`);
  };

  // Push changes to Booking.com
  const pushChangesToBooking = () => {
    // Simulate API call to push changes
    setTimeout(() => {
      // Apply all pending changes to properties
      const updatedProperties = properties.map(property => {
        const propertyChanges = Object.values(pendingChanges).filter(
          (change => (change as { propertyId: number }).propertyId === property.id)
        );

        if (propertyChanges.length === 0) return property;

        const newProperty = { ...property };

        // Apply promotion changes
        propertyChanges
          .filter((change): change is { type: string; propertyId: number; field: string; oldValue: string; newValue: string; } => (change as any).type === 'promotion')
          .forEach((change: { type: string; propertyId: number; field: string; oldValue: string; newValue: string; }) => {
            newProperty.promotions = {
              ...newProperty.promotions,
              [change.field]: change.newValue
            };
          });

        // Apply cancellation policy changes
        propertyChanges.filter((change): change is { type: string; propertyId: number; field: string; oldValue: string; newValue: string; } => (change as any).type === 'cancellation').forEach((change: { type: string; propertyId: number; field: string; oldValue: string; newValue: string; }) => {
          newProperty.cancellationPolicies = {
            ...newProperty.cancellationPolicies,
            [change.field]: change.newValue
          };
        });

        // Update last sync date
        newProperty.lastSyncDate = new Date().toISOString().split('T')[0];

        return newProperty;
      });

      setProperties(updatedProperties);
      setPendingChanges({});
      setLastSyncTimestamp(new Date().toLocaleString());
      setBookingPushModalOpen(false);
      alert("Changes successfully pushed to Booking.com!");
    }, 1500);
  };

  // Pull latest changes from Booking.com
  const pullChangesFromBooking = () => {
    // Simulate API call to fetch changes
    setTimeout(() => {
      // In a real app, you would fetch actual data here
      // For now, we'll just update the sync timestamp
      setProperties(properties.map(property => ({
        ...property,
        lastSyncDate: new Date().toISOString().split('T')[0]
      })));

      setLastSyncTimestamp(new Date().toLocaleString());
      setBookingSyncModalOpen(false);
      alert("Successfully pulled latest changes from Booking.com!");
    }, 1500);
  };

  // Reset bulk selections when filter changes
  React.useEffect(() => {
    setSelectedProperties([]);
    setSelectAll(false);
  }, [filter, selectedCity, selectedTags, searchTerm]);

  // Filter properties based on search, tags, and active status
  const filteredProperties = properties.filter(property => {
    // Search filter
    const nameMatch = property.name.toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = property.description.toLowerCase().includes(searchTerm.toLowerCase());

    // Tag filter
    const tagMatch = selectedTags.length === 0 ||
      selectedTags.some(tag => property.tags.includes(tag));

    // Status filter
    const statusMatch =
      (filter === 'all') ||
      (filter === 'active' && property.active) ||
      (filter === 'inactive' && !property.active);

    // City filter
    const cityMatch = selectedCity === 'All' || property.city === selectedCity;

    return (nameMatch || descMatch) && tagMatch && statusMatch && cityMatch;
  });

  // Update selectAll state when all filtered properties are selected
  React.useEffect(() => {
    if (filteredProperties.length > 0 &&
      filteredProperties.every(p => selectedProperties.includes(p.id))) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedProperties, filteredProperties]);

  // Check if a status has a pending change
  const getStatusWithPending = (propertyId: number, type: string, field: string | number) => {
    const pendingKey = `${propertyId}-${type}-${field}`;
    if (pendingChanges[pendingKey]) {
      return pendingChanges[pendingKey].newValue;
    }

    const property = properties.find(p => p.id === propertyId);
    if (!property) return "na";

    if (type === 'promotion' && typeof field === 'string') {
      return property.promotions[field as keyof typeof property.promotions];
    } else if (type === 'cancellation' && typeof field === 'string') {
      return property.cancellationPolicies[field as keyof typeof property.cancellationPolicies];
    }

    return "na";
  };

  // Add these functions right before the return statement in your component
  // Check if property has any active discounts
  const calculateHasActiveDiscounts = (property: { lastSyncDate?: string; id?: number; name?: string; description?: string; image?: string; city?: string; adr?: number; availableDates?: number; pmsMarkup?: number; visibilityBooster?: number; guestAdr: any; netAdr?: number; promotions: any; cancellationPolicies?: { flexible: string; firm: string; nonRefundable: string; }; tags?: string[]; active?: boolean; }) => {
    // Check if any discount promotions are active
    const hasActivePromotionDiscount =
      property.promotions.genius === "active" ||
      property.promotions.limitedTimeDeal === "active" ||
      property.promotions.getawayDeal === "active" ||
      property.promotions.lastMinuteDeal === "active" ||
      property.promotions.earlyBookerDeal === "active";

    // Check if LOS discounts are active
    const hasActiveLosDiscount =
      property.promotions.weeklyDiscount === "active" ||
      property.promotions.monthlyDiscount === "active";

    return hasActivePromotionDiscount || hasActiveLosDiscount;
  };

  // Calculate the estimated original price before discounts
  const calculateOriginalPrice = (property: { lastSyncDate?: string; id?: number; name?: string; description?: string; image?: string; city?: string; adr?: number; availableDates?: number; pmsMarkup?: number; visibilityBooster?: number; guestAdr: any; netAdr?: number; promotions: any; cancellationPolicies?: { flexible: string; firm: string; nonRefundable: string; }; tags?: string[]; active?: boolean; }) => {
    // Start with current guest ADR
    let originalPrice = property.guestAdr;

    // Estimate discount percentage based on active promotions
    let discountPercentage = 0;

    if (property.promotions.genius === "active") discountPercentage += 10;
    if (property.promotions.limitedTimeDeal === "active") discountPercentage += 15;
    if (property.promotions.getawayDeal === "active") discountPercentage += 10;
    if (property.promotions.lastMinuteDeal === "active") discountPercentage += 12;
    if (property.promotions.earlyBookerDeal === "active") discountPercentage += 8;

    // Add LOS discounts
    if (property.promotions.weeklyDiscount === "active") discountPercentage += 15;
    if (property.promotions.monthlyDiscount === "active") discountPercentage += 25;

    // Cap the discount at a reasonable maximum (e.g., 50%)
    discountPercentage = Math.min(discountPercentage, 50);

    // Calculate original price
    if (discountPercentage > 0) {
      originalPrice = originalPrice / (1 - discountPercentage / 100);
    }

    return originalPrice;
  };

  // Calculate the discount percentage
  const calculateDiscountPercentage = (property: { lastSyncDate?: string | undefined; id?: number | undefined; name?: string | undefined; description?: string | undefined; image?: string | undefined; city?: string | undefined; adr?: number | undefined; availableDates?: number | undefined; pmsMarkup?: number | undefined; visibilityBooster?: number | undefined; guestAdr: any; netAdr?: number | undefined; promotions?: any; cancellationPolicies?: { flexible: string; firm: string; nonRefundable: string; } | { flexible: string; firm: string; nonRefundable: string; } | undefined; tags?: string[] | undefined; active?: boolean | undefined; }) => {
    const originalPrice = calculateOriginalPrice({
      ...property,
      promotions: property.promotions || {}
    });
    const discountAmount = originalPrice - property.guestAdr;
    const discountPercentage = (discountAmount / originalPrice) * 100;

    return Math.round(discountPercentage);
  };

  // Check if a status has a pending change
  const isStatusPending = (propertyId: any, type: any, field: any) => {
    return !!pendingChanges[`${propertyId}-${type}-${field}` as string];
  };

  // Render status indicator based on promotion status (now with pending status)
  const renderStatus = (propertyId: number, type: string, field: string) => {
    const status = getStatusWithPending(propertyId, type, field);
    const isPending = isStatusPending(propertyId, type, field);

    const statusClasses = {
      "active": "bg-green-500",
      "inactive": "bg-gray-300",
      "na": "border border-gray-300 bg-white"
    };

    const pendingClass = isPending ? "bg-orange-400" : statusClasses[status as keyof typeof statusClasses];
    const isNotAvailable = status === "na";

    return (
      <div
        className={`w-4 h-4 rounded-full mx-auto ${pendingClass} ${isNotAvailable ? 'cursor-default' : 'cursor-pointer'}`}
        onClick={() => {
          if (isNotAvailable) return; // Don't allow clicking if status is "na"

          if (type === 'promotion') {
            togglePromotionStatus(propertyId, field);
          } else if (type === 'cancellation') {
            toggleCancellationStatus(propertyId, field as "flexible" | "firm" | "nonRefundable");
          }
        }}
      ></div>
    );
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Booking.com Portfolio Management</h1>
          <div className="flex flex-col items-center">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
              onClick={() => setBookingSyncModalOpen(true)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
              Booking Sync
            </button>
            <span className="text-xs text-gray-500 mt-1">Last: {lastSyncTimestamp}</span>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="mb-6 p-4 bg-blue-100 border border-gray-200 rounded-lg">
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() => setShowRecommendations(!showRecommendations)}
          >
            <h2 className="text-xl font-bold flex items-center">
              Recommendations
              {!showRecommendations && (
                <span className="ml-2 bg-blue-200 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                  {recommendationCount}
                </span>
              )}
            </h2>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">
                {showRecommendations ? 'Collapse' : 'Expand'}
              </span>
              <svg
                className={`w-5 h-5 text-gray-500 transform ${showRecommendations ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
          </div>

          {showRecommendations && (
            <div className="mt-4 space-y-3">
              {/* Recommendation Card 1 */}
              <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-green-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Add a 5% PMS markup to offset Booking.com commission costs</h3>
                    <p className="text-sm text-gray-600">
                      This will help protect your margins while maintaining competitive pricing
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      // Apply 5% markup to all properties
                      setProperties(properties.map(property => {
                        const newMarkup = property.pmsMarkup + 5;
                        return {
                          ...property,
                          pmsMarkup: newMarkup,
                          ...updatePropertyPrices({...property, pmsMarkup: newMarkup})
                        };
                      }));
                      alert("Applied 5% PMS markup to all properties");
                    }}
                  >
                    Apply
                  </button>
                  <button
                    className="px-2 py-1.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                    onClick={(e) => {
                      const element = e.currentTarget.closest('.p-3');
                      if (element) {
                        (element as HTMLElement).style.display = 'none';
                      }
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Recommendation Card 2 */}
              <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Your monthly stay discount (25%) is higher than competitors (20%)</h3>
                    <p className="text-sm text-gray-600">
                      Consider adjusting to 20% to improve profit margins
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      // Update all properties with active monthly discount
                      setProperties(properties.map(property =>
                        property.promotions.monthlyDiscount === "active"
                          ? {
                            ...property,
                            // Simulate lowering the monthly discount from 25% to 20%
                            guestAdr: property.guestAdr * 1.05, // Increase guest ADR by 5% to reflect lower discount
                          }
                          : property
                      ));
                      alert("Adjusted monthly stay discount to 20%");
                    }}
                  >
                    Adjust
                  </button>
                  <button
                    className="px-2 py-1.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                    onClick={(e) => {
                      const element = e.currentTarget.closest('.p-3');
                      if (element) {
                        (element as HTMLElement).style.display = 'none';
                      }
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Recommendation Card 3 */}
              <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Join the Genius program to increase visibility</h3>
                    <p className="text-sm text-gray-600">
                      Properties with Genius discounts see an average 20% increase in bookings
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => {
                      // Enable Genius for all properties
                      setProperties(properties.map(property => ({
                        ...property,
                        promotions: {
                          ...property.promotions,
                          genius: "active"
                        }
                      })));
                      alert("Enabled Genius program for all properties");
                    }}
                  >
                    Enable
                  </button>
                  <button
                    className="px-2 py-1.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                    onClick={(e) => {
                      const element = e.currentTarget.closest('.p-3');
                      if (element) {
                        (element as HTMLElement).style.display = 'none';
                      }
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Recommendation Card 4 - Limited Time Deal with PMS markup */}
              <div className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-yellow-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Optimize revenue with Limited Time Deals</h3>
                    <p className="text-sm text-gray-600">
                      Increase PMS markup by 40% for all {propertiesWithLimitedTimeDeals} properties with active Limited Time Deals
                      to optimize revenue while maintaining competitive pricing.
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    className="px-4 py-1.5 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={applyLimitedTimeDealsRecommendation}
                  >
                    Apply
                  </button>
                  <button
                    className="px-2 py-1.5 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"
                    onClick={(e) => {
                      const element = e.currentTarget.closest('.p-3');
                      if (element) {
                        (element as HTMLElement).style.display = 'none';
                      }
                    }}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons for selected properties */}
        {selectedProperties.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <span className="mr-2 font-medium">{selectedProperties.length} properties selected</span>
            </div>
            <div className="flex space-x-3">
              <div className="flex flex-col items-center">
                <button
                  className={`px-4 py-2 ${totalPendingChanges > 0 ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded flex items-center`}
                  onClick={() => setBookingPushModalOpen(true)}
                  disabled={totalPendingChanges === 0}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  Booking Changes Push {totalPendingChanges > 0 ? `(${totalPendingChanges})` : ''}
                </button>
                <span className="text-xs text-gray-500 mt-1">Last sync: {lastSyncTimestamp}</span>
              </div>
              <div className="flex flex-col items-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
                  onClick={() => setShowPmsMarkupModal(true)}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  PMS Markup Sync
                </button>
                <span className="text-xs text-gray-500 mt-1">Last sync: {lastSyncTimestamp}</span>
              </div>
              <button
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  setSelectedProperties([]);
                  setSelectAll(false);
                }}
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* PMS Markup Modal */}
        {showPmsMarkupModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-bold mb-4">Update PMS Markup</h3>
              <p className="text-sm text-gray-600 mb-4">
                This will update the PMS markup for {selectedProperties.length > 0 ? selectedProperties.length + ' selected' : 'all'} properties
                and recalculate the Guest ADR.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PMS Markup Percentage
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    className="w-full p-2 border rounded"
                    placeholder="Enter percentage"
                    value={bulkPmsMarkup}
                    onChange={(e) => setBulkPmsMarkup(e.target.value)}
                  />
                  <span className="ml-2">%</span>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => {
                    setShowPmsMarkupModal(false);
                    setBulkPmsMarkup('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    const markup = parseFloat(bulkPmsMarkup);
                    if (isNaN(markup) || markup < 0 || markup > 100) {
                      alert('Please enter a valid percentage between 0 and 100');
                      return;
                    }

                    setProperties(properties.map(property =>
                      selectedProperties.length === 0 || selectedProperties.includes(property.id)
                        ? {
                          ...property,
                          pmsMarkup: markup,
                          // Use updatePropertyPrices to correctly calculate both Guest ADR and Net ADR
                          ...updatePropertyPrices({...property, pmsMarkup: markup})
                        }
                        : property
                    ));

                    setBulkPmsMarkup('');
                    setShowPmsMarkupModal(false);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Visibility Booster Modal */}
        {showVisibilityBoosterModal && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-bold mb-4">Update Visibility Booster</h3>
              <p className="text-sm text-gray-600 mb-4">
                This will update the visibility booster percentage for {selectedProperties.length > 0 ? selectedProperties.length + ' selected' : 'all'} properties.
                Higher values increase visibility in Booking.com search results.
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Visibility Booster Percentage
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="15"
                    max="30"
                    step="1"
                    className="w-full p-2 border rounded"
                    placeholder="Enter percentage (15-30)"
                    value={bulkVisibilityBooster}
                    onChange={(e) => setBulkVisibilityBooster(e.target.value)}
                  />
                  <span className="ml-2">%</span>
                </div>
                <div className="mt-2">
                  <input
                    type="range"
                    min="15"
                    max="30"
                    step="1"
                    className="w-full"
                    value={bulkVisibilityBooster || 15}
                    onChange={(e) => setBulkVisibilityBooster(e.target.value)}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>15%</span>
                    <span>20%</span>
                    <span>25%</span>
                    <span>30%</span>
                  </div>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Recommendation: 15-20% for low season, 25-30% for peak season
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => {
                    setShowVisibilityBoosterModal(false);
                    setBulkVisibilityBooster('');
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                  onClick={() => {
                    const booster = parseInt(bulkVisibilityBooster);
                    if (isNaN(booster) || booster < 15 || booster > 30) {
                      alert('Please enter a valid percentage between 15 and 30');
                      return;
                    }

                    setProperties(properties.map(property =>
                      selectedProperties.length === 0 || selectedProperties.includes(property.id)
                        ? {
                          ...property,
                          visibilityBooster: booster,
                          // Use updatePropertyPrices to correctly calculate both Guest ADR and Net ADR
                          ...updatePropertyPrices({...property, visibilityBooster: booster})
                        }
                        : property
                    ));

                    setBulkVisibilityBooster('');
                    setShowVisibilityBoosterModal(false);
                    alert(`Visibility booster updated to ${booster}% for ${selectedProperties.length} properties.`);
                  }}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Sync Modal for pulling changes */}
        {bookingSyncModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-bold mb-4">Booking.com Sync</h3>
              <p className="text-sm text-gray-600 mb-4">
                This will pull the latest changes from Booking.com and update your properties.
                {selectedProperties.length > 0 ?
                  ` Only ${selectedProperties.length} selected properties will be synchronized.` :
                  ' All properties will be synchronized.'}
              </p>
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="sync-pricing"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="sync-pricing" className="text-sm">Sync pricing</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    id="sync-availability"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="sync-availability" className="text-sm">Sync availability</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="sync-promotions"
                    className="mr-2"
                    defaultChecked
                  />
                  <label htmlFor="sync-promotions" className="text-sm">Sync promotions</label>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => setBookingSyncModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={pullChangesFromBooking}
                >
                  Sync Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Booking Push Modal for pushing changes */}
        {bookingPushModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-96">
              <h3 className="text-lg font-bold mb-4">Push Changes to Booking.com</h3>
              <p className="text-sm text-gray-600 mb-4">
                This will push your pending changes to Booking.com.
                You currently have {totalPendingChanges} pending changes to push.
              </p>
              <div className="mb-4">
                {totalPendingChanges > 0 ? (
                  <div className="p-3 bg-orange-100 text-orange-800 rounded">
                    <ul className="list-disc list-inside">
                      {Object.values(pendingChanges).slice(0, 3).map((change, idx) => {
                        const property = properties.find(p => p.id === change.propertyId);
                        return (
                          <li key={idx} className="text-sm">
                            {property?.name.substring(0, 30)}... - {change.field}: {change.oldValue} to {change.newValue}
                          </li>
                        );
                      })}
                      {Object.values(pendingChanges).length > 3 && (
                        <li className="text-sm">
                          And {Object.values(pendingChanges).length - 3} more changes...
                        </li>
                      )}
                    </ul>
                  </div>
                ) : (
                  <div className="p-3 bg-gray-100 text-gray-800 rounded">
                    No pending changes to push.
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  onClick={() => setBookingPushModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
                  onClick={pushChangesToBooking}
                  disabled={totalPendingChanges === 0}
                >
                  Push Changes
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-4">
          <div className="w-64">
            <input
              type="text"
              placeholder="Search by name or description"
              className="w-full p-2 border rounded"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* City filter */}
          <div className="w-40">
            <select
              className="w-full p-2 border rounded"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
            >
              <option value="All">All Cities</option>
              {allCities.map((city: string) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-700">Tags:</span>
            <div className="flex flex-wrap gap-2 items-center">
              {/* Show only first 3 tags or all tags if expanded */}
              {(showAllFilterTags ? allTags : allTags.slice(0, 3)).map((tag) => (
                <button
                  key={tag}
                  className={`px-2 py-1 text-sm rounded ${selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                    }`}
                  onClick={() => toggleTag(tag)}
                >
                  {tag}
                </button>
              ))}

              {/* Show expand/collapse button if there are more than 3 tags */}
              {allTags.length > 3 && (
                <button
                  className="px-2 py-1 text-sm rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                  onClick={() => setShowAllFilterTags(!showAllFilterTags)}
                >
                  {showAllFilterTags ? 'Show less' : `+${allTags.length - 3} more`}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 ${filter === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setFilter('all')}
          >
            All listings ({properties.length})
          </button>
          <button
            className={`px-4 py-2 ${filter === 'active' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setFilter('active')}
          >
            Active ({properties.filter(p => p.active).length})
          </button>
          <button
            className={`px-4 py-2 ${filter === 'inactive' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
            onClick={() => setFilter('inactive')}
          >
            Not active ({properties.filter(p => !p.active).length})
          </button>

          <div className="ml-auto flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="toggle-promotions"
                className="mr-2"
                checked={showPromotionsColumns}
                onChange={() => setShowPromotionsColumns(!showPromotionsColumns)}
              />
              <label htmlFor="toggle-promotions" className="text-sm text-gray-700">
                Show all promotions
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="toggle-los-discounts"
                className="mr-2"
                checked={showLosDiscountColumns}
                onChange={() => setShowLosDiscountColumns(!showLosDiscountColumns)}
              />
              <label htmlFor="toggle-los-discounts" className="text-sm text-gray-700">
                Show all LOS discounts
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="toggle-cancellations"
                className="mr-2"
                checked={showCancellationsColumns}
                onChange={() => setShowCancellationsColumns(!showCancellationsColumns)}
              />
              <label htmlFor="toggle-cancellations" className="text-sm text-gray-700">
                Show all cancellation policies
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="w-10 p-3 text-left">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectAll}
                  onChange={toggleSelectAll}
                />
              </th>
              <th className="w-60 p-3 text-left">Property</th>
              <th className="p-3 text-right">ADR</th>
              <th className="p-3 text-right">Available<br />(180 days)</th>
              <th className="p-3 text-right">PMS<br />Mark-up</th>
              <th className="p-3 text-right">Visibility<br />Booster</th>
              <th className="p-3 text-right">Guest<br />ADR</th>
              <th className="p-3 text-right">Net<br />ADR</th>
              <th className="p-3 text-center border-l border-gray-200">Promotions</th>
              {showPromotionsColumns && (
                <>
                  <th className="p-3 text-center">Limited<br />Time</th>
                  <th className="p-3 text-center">Genius</th>
                  <th className="p-3 text-center">Mobile<br />Rate</th>
                  <th className="p-3 text-center">Country<br />Rate</th>
                  <th className="p-3 text-center">Getaway<br />Deal</th>
                  <th className="p-3 text-center">Yearly<br />Deal</th>
                  <th className="p-3 text-center">Basic<br />Deal</th>
                  <th className="p-3 text-center">Last<br />Minute</th>
                  <th className="p-3 text-center">Early<br />Booker</th>
                </>
              )}
              <th className="p-3 text-center border-l border-gray-200">Rate LOS<br />Discount</th>
              {showLosDiscountColumns && (
                <>
                  <th className="p-3 text-center">Weekly<br />Discount</th>
                  <th className="p-3 text-center">Monthly<br />Discount</th>
                </>
              )}
              <th className="p-3 text-center border-l border-gray-200">Rates<br />Cancellation<br />Policies</th>
              {showCancellationsColumns && (
                <>
                  <th className="p-3 text-center">Flexible</th>
                  <th className="p-3 text-center">Firm</th>
                  <th className="p-3 text-center">Non-Refundable</th>
                </>
              )}
              <th className="p-3 text-center border-l border-gray-200">Status</th>
              <th className="p-3 text-center">Last Synced</th>
            </tr>

            {/* Bulk update row - shown only when properties are selected */}
            {selectedProperties.length > 0 && (
              <tr className="bg-blue-50 text-xs">
                <td className="p-2 text-center">
                  <span className="font-semibold">Bulk</span>
                </td>
                <td className="p-2 text-center">
                  <span className="font-semibold">Update</span>
                </td>
                <td className="p-2 text-center">
                  {/* Cell for ADR - no bulk option */}
                </td>
                <td className="p-2 text-center">
                  {/* Cell for Available Days - no bulk option */}
                </td>
                <td className="p-2 text-center">
                  <button
                    className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 w-full"
                    onClick={() => setShowPmsMarkupModal(true)}
                  >
                    Update PMS Markup
                  </button>
                </td>
                <td className="p-2 text-center">
                  <button
                    className="px-2 py-1 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 w-full"
                    onClick={() => setShowVisibilityBoosterModal(true)}
                  >
                    Update Visibility
                  </button>
                </td>
                <td className="p-2 text-center">
                  {/* Guest ADR - no bulk option */}
                  <div className="text-xs text-gray-600">
                    View individual properties for discount details
                  </div>
                </td>
                <td className="p-2 text-center">
                  {/* Cell for Net ADR - no bulk option */}
                </td>
                <td className="p-2 text-center border-l border-gray-200">
                  <div className="text-xs font-medium">Set All Promotions:</div>
                  <div className="flex justify-center space-x-1 mt-1">
                    <button
                      className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      onClick={() => {
                        const promotionKeys = [
                          'limitedTimeDeal', 'genius', 'mobileRate', 'countryRate',
                          'getawayDeal', 'customYearlyDeal', 'basicDeal', 'lastMinuteDeal',
                          'earlyBookerDeal'
                        ];
                        promotionKeys.forEach(key => applyBulkUpdate(key, 'active'));
                      }}
                    >
                      Active
                    </button>
                    <button
                      className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                      onClick={() => {
                        const promotionKeys = [
                          'limitedTimeDeal', 'genius', 'mobileRate', 'countryRate',
                          'getawayDeal', 'customYearlyDeal', 'basicDeal', 'lastMinuteDeal',
                          'earlyBookerDeal'
                        ];
                        promotionKeys.forEach(key => applyBulkUpdate(key, 'inactive'));
                      }}
                    >
                      Inactive
                    </button>
                  </div>
                </td>
                {/* Individual promotion columns */}
                {showPromotionsColumns && (
                  <>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('limitedTimeDeal', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('limitedTimeDeal', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('genius', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('genius', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('mobileRate', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('mobileRate', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('countryRate', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('countryRate', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('getawayDeal', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('getawayDeal', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('customYearlyDeal', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('customYearlyDeal', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('basicDeal', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('basicDeal', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('lastMinuteDeal', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('lastMinuteDeal', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('earlyBookerDeal', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('earlyBookerDeal', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                  </>
                )}
                <td className="p-2 text-center border-l border-gray-200">
                  <div className="text-xs font-medium">Set All LOS Discounts:</div>
                  <div className="flex justify-center space-x-1 mt-1">
                    <button
                      className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      onClick={() => {
                        applyBulkUpdate('weeklyDiscount', 'active');
                        applyBulkUpdate('monthlyDiscount', 'active');
                      }}
                    >
                      Active
                    </button>
                    <button
                      className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                      onClick={() => {
                        applyBulkUpdate('weeklyDiscount', 'inactive');
                        applyBulkUpdate('monthlyDiscount', 'inactive');
                      }}
                    >
                      Inactive
                    </button>
                  </div>
                </td>
                {/* Individual LOS discount columns */}
                {showLosDiscountColumns && (
                  <>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('weeklyDiscount', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('weeklyDiscount', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkUpdate('monthlyDiscount', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkUpdate('monthlyDiscount', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                  </>
                )}
                <td className="p-2 text-center border-l border-gray-200">
                  <div className="text-xs font-medium">Set All Cancellation Policies:</div>
                  <div className="flex justify-center space-x-1 mt-1">
                    <button
                      className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                      onClick={() => {
                        applyBulkCancellationUpdate('flexible', 'active');
                        applyBulkCancellationUpdate('firm', 'active');
                        applyBulkCancellationUpdate('nonRefundable', 'active');
                      }}
                    >
                      Active
                    </button>
                    <button
                      className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                      onClick={() => {
                        applyBulkCancellationUpdate('flexible', 'inactive');
                        applyBulkCancellationUpdate('firm', 'inactive');
                        applyBulkCancellationUpdate('nonRefundable', 'inactive');
                      }}
                    >
                      Inactive
                    </button>
                  </div>
                </td>
                {/* Individual cancellation policy columns */}
                {showCancellationsColumns && (
                  <>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkCancellationUpdate('flexible', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkCancellationUpdate('flexible', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkCancellationUpdate('firm', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkCancellationUpdate('firm', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                    <td className="p-2 text-center">
                      <div className="flex flex-col space-y-1">
                        <button
                          className="px-1 py-0.5 bg-green-500 text-white rounded text-xs hover:bg-green-600"
                          onClick={() => applyBulkCancellationUpdate('nonRefundable', 'active')}
                        >
                          Active
                        </button>
                        <button
                          className="px-1 py-0.5 bg-gray-400 text-white rounded text-xs hover:bg-gray-500"
                          onClick={() => applyBulkCancellationUpdate('nonRefundable', 'inactive')}
                        >
                          Inactive
                        </button>
                      </div>
                    </td>
                  </>
                )}
                <td className="p-2 text-center border-l border-gray-200">
                  <div className="text-xs font-medium">Status is read-only</div>
                  <div className="text-xs text-gray-500 mt-1">
                    (Synced from Booking.com)
                  </div>
                </td>
                <td className="p-2 text-center">
                  {/* Last synced column - no bulk option */}
                </td>
              </tr>
            )}
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredProperties.map((property) => {
              const promotionsCount = countActivePromotions(property);
              const losDiscountCount = countActiveLosDiscounts(property);
              const cancellationCount = countActiveCancellationPolicies(property);
              const isPromotionsExpanded = expandedPromotions[property.id] || false;
              const isLosDiscountsExpanded = expandedLosDiscounts[property.id] || false;
              const isCancellationsExpanded = expandedCancellations[property.id] || false;

              return (
                <React.Fragment key={property.id}>
                  <tr
                    className={`hover:bg-gray-50 transition-colors ${selectedProperties.includes(property.id) ? 'bg-blue-50' : ''
                      }`}
                  >
                    <td className="p-3 text-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4"
                        checked={selectedProperties.includes(property.id)}
                        onChange={() => togglePropertySelection(property.id)}
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center">
                        <img
                          src={property.image}
                          alt={property.name}
                          className="w-16 h-12 object-cover rounded mr-3"
                        />
                        <div>
                          <p className="font-medium text-blue-600">{property.name}</p>
                          <p className="text-sm text-gray-500">{property.description}</p>
                          <p className="text-xs text-gray-400">{property.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-right font-medium">${property.adr}</td>
                    <td className="p-3 text-right">{property.availableDates}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">{property.pmsMarkup}%</span>
                        {selectedProperties.includes(property.id) && (
                          <button
                            className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                            onClick={() => {
                              setBulkPmsMarkup(property.pmsMarkup.toString());
                              setShowPmsMarkupModal(true);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end">
                        <span className="mr-2">{property.visibilityBooster}%</span>
                        {selectedProperties.includes(property.id) && (
                          <button
                            className="text-xs px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
                            onClick={() => {
                              setBulkVisibilityBooster(property.visibilityBooster.toString());
                              setShowVisibilityBoosterModal(true);
                            }}
                          >
                            Edit
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex flex-col items-end">
                        {calculateHasActiveDiscounts(property) && (
                          <span className="text-sm text-gray-500 line-through">
                            ${calculateOriginalPrice(property).toFixed(2)}
                          </span>
                        )}
                        <span className="font-medium">${property.guestAdr.toFixed(2)}</span>
                        {calculateHasActiveDiscounts(property) && (
                          <span className="text-xs text-green-600">
                            Save {calculateDiscountPercentage(property)}%
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right">${property.netAdr}</td>
                    <td className="p-3 text-center border-l border-gray-200">
                      <button
                        className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center w-24 mx-auto"
                        onClick={() => !showPromotionsColumns && togglePromotions(property.id)}
                      >
                        <span className="font-medium">{promotionsCount.active}/{promotionsCount.total}</span>
                        {!showPromotionsColumns && (
                          <svg className={`w-4 h-4 ml-1 transition-transform ${isPromotionsExpanded ? 'transform rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        )}
                      </button>
                    </td>
                    {showPromotionsColumns && (
                      <>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'limitedTimeDeal')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'genius')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'mobileRate')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'countryRate')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'getawayDeal')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'customYearlyDeal')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'basicDeal')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'lastMinuteDeal')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'earlyBookerDeal')}</td>
                      </>
                    )}
                    <td className="p-3 text-center border-l border-gray-200">
                      <button
                        className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center w-24 mx-auto"
                        onClick={() => !showLosDiscountColumns && toggleLosDiscounts(property.id)}
                      >
                        <span className="font-medium">{losDiscountCount.active}/{losDiscountCount.total}</span>
                        {!showLosDiscountColumns && (
                          <svg className={`w-4 h-4 ml-1 transition-transform ${isLosDiscountsExpanded ? 'transform rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        )}
                      </button>
                    </td>
                    {showLosDiscountColumns && (
                      <>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'weeklyDiscount')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'promotion', 'monthlyDiscount')}</td>
                      </>
                    )}
                    <td className="p-3 text-center border-l border-gray-200">
                      <button
                        className="px-2 py-1 text-xs rounded bg-blue-50 text-blue-700 hover:bg-blue-100 flex items-center justify-center w-24 mx-auto"
                        onClick={() => !showCancellationsColumns && toggleCancellations(property.id)}
                      >
                        <span className="font-medium">{cancellationCount.active}/{cancellationCount.total}</span>
                        {!showCancellationsColumns && (
                          <svg className={`w-4 h-4 ml-1 transition-transform ${isCancellationsExpanded ? 'transform rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        )}
                      </button>
                    </td>
                    {showCancellationsColumns && (
                      <>
                        <td className="p-3 text-center">{renderStatus(property.id, 'cancellation', 'flexible')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'cancellation', 'firm')}</td>
                        <td className="p-3 text-center">{renderStatus(property.id, 'cancellation', 'nonRefundable')}</td>
                      </>
                    )}
                    <td className="p-3 text-center border-l border-gray-200">
                      <span
                        className={`px-2 py-1 text-xs rounded inline-block ${property.active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                          }`}
                      >
                        {property.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="p-3 text-center text-xs text-gray-500">
                      {property.lastSyncDate}
                    </td>
                  </tr>

                  {/* Expanded rows for detailed views */}
                  {!showPromotionsColumns && isPromotionsExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={9}></td>
                      <td colSpan={showPromotionsColumns ? 9 : 1} className="p-4 border-b border-gray-200">
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(property.promotions)
                            .filter(([key]) => key !== 'weeklyDiscount' && key !== 'monthlyDiscount')
                            .map(([key]) => {
                              const formattedName = key
                                .replace(/([A-Z])/g, ' $1')
                                .replace(/^./, (str) => str.toUpperCase());

                              return (
                                <div key={key} className="flex items-center">
                                  {renderStatus(property.id, 'promotion', key)}
                                  <span className="ml-2 text-sm">{formattedName}</span>
                                </div>
                              );
                            })}
                        </div>
                      </td>
                      <td colSpan={showLosDiscountColumns ? 3 : 1}></td>
                      <td colSpan={showCancellationsColumns ? 4 : 1}></td>
                      <td colSpan={2}></td>
                    </tr>
                  )}

                  {/* Expanded LOS discounts row */}
                  {!showLosDiscountColumns && isLosDiscountsExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={9}></td>
                      <td colSpan={showPromotionsColumns ? 9 : 1}></td>
                      <td colSpan={showLosDiscountColumns ? 3 : 1} className="p-4 border-b border-gray-200">
                        <div className="grid grid-cols-2 gap-3">
                          {[
                            ['weeklyDiscount', 'Weekly Discount'],
                            ['monthlyDiscount', 'Monthly Discount']
                          ].map(([key, label]) => (
                            <div key={key} className="flex items-center">
                              {renderStatus(property.id, 'promotion', key)}
                              <span className="ml-2 text-sm">{label}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td colSpan={showCancellationsColumns ? 4 : 1}></td>
                      <td colSpan={2}></td>
                    </tr>
                  )}

                  {/* Expanded cancellation policies row */}
                  {!showCancellationsColumns && isCancellationsExpanded && (
                    <tr className="bg-gray-50">
                      <td colSpan={9}></td>
                      <td colSpan={showPromotionsColumns ? 9 : 1}></td>
                      <td colSpan={showLosDiscountColumns ? 3 : 1}></td>
                      <td colSpan={showCancellationsColumns ? 4 : 1} className="p-4 border-b border-gray-200">
                        <div className="grid grid-cols-3 gap-3">
                          {Object.entries(property.cancellationPolicies).map(([key]) => {
                            const formattedName = key
                              .replace(/([A-Z])/g, ' $1')
                              .replace(/^./, (str) => str.toUpperCase());

                            return (
                              <div key={key} className="flex items-center">
                                {renderStatus(property.id, 'cancellation', key)}
                                <span className="ml-2 text-sm">{formattedName}</span>
                              </div>
                            );
                          })}
                        </div>
                      </td>
                      <td colSpan={2}></td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-white rounded-lg shadow">
        <h2 className="text-lg font-bold mb-2">Legend</h2>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Active</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
            <span className="text-sm">Inactive</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-orange-400 mr-2"></div>
            <span className="text-sm">Pending Change</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full border border-gray-300 bg-white mr-2"></div>
            <span className="text-sm">Not Available</span>
          </div>
          <div className="flex items-center ml-4 border-l pl-4 border-gray-200">
            <span className="text-sm font-medium text-blue-700 mr-2">2/5</span>
            <span className="text-sm">= Active Items / Total Items</span>
          </div>
        </div>
        <p className="mt-3 text-sm text-gray-600">
          For better overview, columns are grouped into Promotions, Rate LOS Discounts, and Rates Cancellation Policies with a count of active items.
          Click on the count to expand detailed information, or use the checkboxes above to show all columns.
          Click on status indicators to toggle them - changes will appear in orange until pushed to Booking.com.
        </p>
      </div>
    </div>
  );
};

export default PortfolioAuto;