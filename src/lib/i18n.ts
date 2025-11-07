import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        home: "Home",
        panchayat: "Panchayat", 
        buyers: "Buyers",
        farmers: "Farmers",
        aboutUs: "About Us",
        getStarted: "Get Started"
      },
      hero: {
        title: "Stop Burning, Start",
        titleHighlight: "Earning",
        subtitle: "Connecting farmers, Panchayats, and industries in a transparent ecosystem to convert crop residue into valuable resources.",
        joinPanchayat: "Join as Panchayat",
        registerBuyer: "Register as Buyer"
      },
      stats: {
        cropResidue: "Tons of Crop Residue Annually",
        pollutionReduction: "Air Pollution Reduction Target", 
        farmerIncome: "Potential Annual Income per Farmer",
        panchayatsReady: "Panchayats Ready to Join"
      },
      problem: {
        title: "The Problem:",
        titleHighlight: "Stubble Burning Crisis",
        description: "Every harvest season, farmers burn millions of tons of crop residue due to lack of affordable machinery, storage facilities, and market linkages. This causes severe air pollution, soil degradation, and health hazards.",
        point1: "Contributes to 40% of Delhi's air pollution during winter",
        point2: "Degrades soil quality and reduces fertility",
        point3: "Wastes valuable biomass worth ₹1000+ crores annually"
      },
      solution: {
        title: "Our Solution:",
        titleHighlight: "Digital Ecosystem",
        description: "Grameen creates a Panchayat-led digital platform that transforms agricultural waste into wealth through transparent connections between farmers, Panchayats, and industries."
      },
      features: {
        panchayatGov: {
          title: "Panchayat-Led Governance",
          description: "Transparent community management with Panchayat oversight ensuring fair transactions and community benefits."
        },
        wasteManagement: {
          title: "Smart Waste Management", 
          description: "Convert agricultural waste into valuable resources instead of burning, creating new revenue streams."
        },
        marketLinkage: {
          title: "Market Linkage",
          description: "Direct connection between farmers and industries for reliable, low-cost biomass supply chains."
        },
        transactions: {
          title: "Transparent Transactions",
          description: "Digital platform ensuring fair pricing and secure payments for all stakeholders."
        },
        locationServices: {
          title: "Location-Based Services",
          description: "GPS tracking and route optimization for efficient crop residue collection and machinery booking."
        },
        environmentalImpact: {
          title: "Environmental Impact",
          description: "Track CO₂ saved, air quality improvements, and environmental benefits from reduced stubble burning."
        }
      },
      howItWorks: {
        title: "How Grameen Works",
        subtitle: "Simple, transparent process from waste to wealth",
        step1: {
          title: "Panchayat Registers",
          description: "Panchayat admins register their villages and onboard farmers into the platform"
        },
        step2: {
          title: "Farmers List Residue",
          description: "Farmers register their crop waste with quantity, type, and location details"
        },
        step3: {
          title: "Industries Buy & Process",
          description: "Industries purchase residue directly, creating sustainable supply chains"
        }
      },
      cta: {
        title: "Ready to Transform Your Community?",
        subtitle: "Join thousands of Panchayats, farmers, and industries creating a sustainable future",
        registerPanchayat: "Register Your Panchayat",
        joinIndustry: "Join as Industry Partner"
      },
      resources: {
        title: "Crop Residue Resources & Solutions",
        subtitle: "Comprehensive ecosystem connecting crop residues with industries and machinery",
        crops: "Crop Residues",
        industries: "Industries",
        machines: "Machines",
        cropData: {
          paddyStraw: {
            name: "Paddy Straw",
            description: "Leftover stems from rice cultivation."
          },
          wheatStraw: {
            name: "Wheat Straw",
            description: "Residue after wheat harvesting."
          },
          sugarcaneBagasse: {
            name: "Sugarcane Bagasse",
            description: "Fibrous residue from sugar mills."
          },
          sunflowerStalks: {
            name: "Sunflower Stalks",
            description: "Stalks left behind after seed removal."
          },
          maizeCobs: {
            name: "Maize Cobs",
            description: "Cobs remaining after corn kernels are removed."
          },
          mustardStalks: {
            name: "Mustard Stalks",
            description: "Stalks left after mustard seed harvesting."
          }
        },
        industryData: {
          bioCNG: {
            name: "Bio-CNG Plants",
            description: "Convert residues into renewable compressed natural gas."
          },
          ethanol: {
            name: "Ethanol Plants",
            description: "Residues processed into bio-ethanol for blending programs."
          },
          paper: {
            name: "Paper & Cardboard",
            description: "Straw and bagasse converted into paper products."
          },
          packaging: {
            name: "Packaging Recyclers",
            description: "Residue used in eco-friendly packaging material."
          },
          mushroom: {
            name: "Mushroom Farms",
            description: "Straw used as substrate for mushroom cultivation."
          },
          compost: {
            name: "Composters",
            description: "Residues composted into natural fertilizer."
          }
        },
        machineData: {
          happySeeder: {
            name: "Happy Seeder",
            description: "Directly drills wheat into rice stubble."
          },
          rotavator: {
            name: "Rotavator",
            description: "Incorporates crop residues back into the soil."
          },
          sms: {
            name: "Super Straw Management System (SMS)",
            description: "Spreads and manages straw uniformly."
          },
          strawBaler: {
            name: "Straw Baler",
            description: "Compresses straw into compact bales for transport."
          },
          mulcher: {
            name: "Mulcher",
            description: "Chops and spreads crop residue evenly."
          },
          zeroTillDrill: {
            name: "Zero Till Drill",
            description: "Plants seeds without removing existing residue."
          }
        }
      },
      // Common translations
      common: {
        important: "Important",
        loading: "Loading...",
        error: "Error",
        success: "Success",
        save: "Save",
        cancel: "Cancel",
        edit: "Edit",
        delete: "Delete",
        search: "Search",
        date: "Date",
        status: "Status"
      },
      // Farmer Portal Translations
      farmer: {
        dashboard: "Dashboard",
        sellResidue: "Sell Residue",
        myListings: "My Listings",
        rentMachinery: "Rent",
        analytics: "Analytics",
        profile: "Profile", 
        residueListing: "Residue Listing",
        paymentRecords: "Payment Records",
        myProfile: "My Profile",
        personalInfo: "Personal Information",
        locationPanchayat: "Location & Panchayat",
        farmingInfo: "Farming Information",
        verificationStatus: "Verification Status",
        accountVerified: "Your profile has been verified by the Panchayat office. You can now access all features.",
        accountPending: "Your profile is pending verification by the Panchayat office.",
        visitPanchayat: "Please visit your Panchayat office with your Aadhar Card to complete verification.",
        verificationRequired: "Account Verification Required",
        verificationSteps: "To complete your profile setup:",
        verificationStep1: "Carry your Aadhar Card to your local Panchayat office",
        verificationStep2: "Meet with the Panchayat Admin for identity verification", 
        verificationStep3: "Provide your farming details and land documentation",
        verificationStep4: "Wait for profile verification (usually 1-2 business days)",
        verificationImportant: "Your account is currently pending verification by your Panchayat Admin. Once verified, you'll have full access to all platform features including residue listing, marketplace access, and payment tracking.",
        farmerTotalEarnings: "Total Earnings",
        farmerThisMonth: "This Month",
        totalTransactions: "Total Transactions", 
        currentMonthEarnings: "Current month earnings",
        completedPayments: "Completed payments",
        searchPayments: "Search by crop type, payment type, or buyer...",
        noPaymentRecords: "No payment records yet",
        paymentRecordsDescription: "Payment records will appear here once you complete sales of your crop residue",
        noPaymentMatch: "No payments match your search",
        adjustSearchTerms: "Try adjusting your search terms",
        paymentHistory: "Track your earnings and payment history from crop residue sales",
        editProfile: "Edit Profile",
        saveChanges: "Save Changes",
        cancel: "Cancel",
        personalInformation: "Manage your personal information and farming details",
        fullName: "Full Name",
        phoneNumber: "Phone Number", 
        emailAddress: "Email Address",
        emailCannotChange: "Email cannot be changed here. Contact support if needed.",
        coordinates: "Coordinates",
        locationCoordinates: "Location coordinates for your farm",
        village: "Village",
        panchayat: "Panchayat",
        district: "District",
        state: "State",
        landArea: "Land Area (Acres)",
        farmLocation: "Farm Location",
        contactPanchayatLocation: "Contact your Panchayat admin to update location coordinates",
        profileStats: "Profile Statistics",
        memberSince: "Member Since",
        verification: "Verification",
        acres: "Acres",
        panchayatLink: "Panchayat Link",
        language: "Language",
        theme: "Theme",
        light: "Light",
        dark: "Dark",
        english: "English",
        hindi: "हिन्दी",
        myAccount: "My Account",
        signOut: "Sign out",
        cropResidueManagement: "Crop Residue Management",
        // Dashboard translations
        welcomeFarmer: "Welcome, Farmer!",
        profileSetupMessage: "Your farmer profile is being set up by your Panchayat Admin. Please contact them to complete your registration.",
        welcome: "Welcome",
        activeListings: "Active Listings",
        farmerMachineBookings: "Machine Bookings",
        totalEarnings: "Total Earnings",
        total: "Total",
        listings: "listings",
        pendingApproved: "Pending/Approved",
        fromResidueSales: "From residue sales",
        bookMachine: "Book Machine",
        addCropResidue: "Add Crop Residue",
        yourCropResidueListings: "Your Crop Residue Listings",
        manageCropResidueListings: "Manage your crop residue listings and track their status",
        noCropResidueListingsYet: "No crop residue listings yet. Create your first listing to start earning.",
        machineBookingsTitle: "Machine Bookings",
        recentMachineBookingRequests: "Your recent machine booking requests",
        noMachineBookingsYet: "No machine bookings yet. Book machines for efficient crop residue management.",
        bookingDate: "Booking Date",
        cost: "Cost",
        tons: "tons",
        // Residue Listing Page
        residueListings: "Residue Listings",
        addNewListing: "Add New Listing", 
        searchPlaceholder: "Search by crop type, disposal method, or status...",
        noListingsMatchSearch: "No listings match your search",
        tryAdjustingSearch: "Try adjusting your search terms",
        createFirstListing: "Create your first listing to start earning from your crop residue",
        addYourFirstListing: "Add Your First Listing",
        addedOn: "Added on",
        quantity: "Quantity",
        price: "Price",
        method: "Method",
        location: "Location",
        harvestDate: "Harvest Date",
        view: "View",
        edit: "Edit",
        areYouSureDelete: "Are you sure you want to delete this listing?",
        listingDeletedSuccess: "Listing deleted successfully",
        failedToLoadResidueListings: "Failed to load residue listings",
        failedToLoadData: "Failed to load data"
      },
      // Farmer Landing Page
      farmerLanding: {
        heroTitle: "Don't Burn,",
        heroTitleHighlight: "Earn!",
        heroSubtitle: "Transform your crop residues into income while protecting our environment. Join the sustainable farming revolution today.",
        benefitsTitle: "Why Choose Sustainable Residue Management?",
        benefitsSubtitle: "Join thousands of farmers who are earning extra income while protecting our planet",
        benefit1Title: "Earn Extra Income",
        benefit1Description: "Convert your crop residue into cash instead of burning it",
        benefit2Title: "Protect Environment",
        benefit2Description: "Reduce air pollution and help combat climate change",
        benefit3Title: "Easy Collection", 
        benefit3Description: "Book machines for efficient residue management",
        benefit4Title: "Community Support",
        benefit4Description: "Join thousands of farmers earning from residues",
        statsTitle: "Our Community Impact",
        stat1Label: "Farmers Registered",
        stat2Label: "Tons Collected", 
        stat3Label: "Income Generated",
        stat4Label: "CO₂ Saved",
        ctaTitle: "Ready to Start Earning from Your Residues?",
        ctaSubtitle: "List your crop residues today and connect with buyers in your area",
        listResidue: "List Your Residues",
        exploreMachines: "Explore Machines"
      },
      // Sell Residue Page
      sellResidue: {
        title: "Sell Your Crop Residue",
        subtitle: "Select your crop type to start listing. Get fair prices for your agricultural waste while helping the environment.",
        viewMyListings: "View My Listings",
        listFormTitle: "List Your Crop Residue",
        listFormSubtitle: "Fill out the form below to list your residue in the marketplace and get fair prices.",
        howItWorksTitle: "How It Works",
        howItWorksSubtitle: "Simple 3-step process to start earning from your crop residues",
        step1Title: "Choose Crop & Set Your Price",
        step1Description: "Select your crop type and provide quantity, pricing, and location details. Your earnings are decided upfront.",
        step2Title: "Panchayat Approval",
        step2Description: "Your listing goes to the panchayat for verification and approval",
        step3Title: "Panchayat Handles Sales",
        step3Description: "Panchayat decides what to do with the residue and handles selling to buyers. You receive your decided payment.",
        cropTypes: {
          paddy: {
            name: "Paddy/Rice",
            description: "Rice straw and husks - high demand for biomass energy"
          },
          wheat: {
            name: "Wheat", 
            description: "Wheat straw for livestock feed and paper industry"
          },
          maize: {
            name: "Maize/Corn",
            description: "Corn stalks and cobs for biofuel production"
          },
          sugarcane: {
            name: "Sugarcane",
            description: "Bagasse for paper and energy production"
          },
          cotton: {
            name: "Cotton",
            description: "Cotton stalks for biomass and composting"
          },
          sunflower: {
            name: "Sunflower",
            description: "Sunflower stalks for bioenergy and animal feed"
          }
        }
      },
      // My Listings Page
      myListings: {
        title: "My Residue Listings",
        subtitle: "Manage and track all your crop residue listings",
        backToSell: "Back to Sell",
        addNewListing: "Add New Listing",
        totalListings: "Total Listings",
        available: "Available",
        sold: "Sold", 
        totalValue: "Total Value",
        noListingsTitle: "No residue listings yet",
        noListingsDescription: "Start by adding your first crop residue listing to connect with buyers and earn extra income",
        addFirstListing: "Add Your First Listing",
        quantity: "Quantity",
        pricePerTon: "Price/ton",
        disposalMethod: "Disposal Method",
        harvestDate: "Harvest Date",
        listed: "Listed"
      },
      // Machine Booking
      machineBooking: {
        title: "Agricultural Machine Booking",
        subtitle: "Book professional farm machinery for efficient crop residue management and field operations",
        yourBookingsTitle: "Your Machine Bookings",
        yourBookingsSubtitle: "Track and manage your agricultural machinery bookings",
        totalBookings: "Total Bookings",
        pending: "Pending",
        approved: "Approved",
        completed: "Completed",
        bookingDate: "Booking Date",
        cost: "Cost",
        notes: "Notes",
        requested: "Requested",
        awaitingApproval: "Awaiting approval",
        howItWorksTitle: "How Machine Booking Works",
        howItWorksSubtitle: "Simple process to get the right machinery for your farm operations",
        selectBookTitle: "Select & Book Machine",
        selectBookDescription: "Choose the right machine for your needs and provide booking details",
        panchayatCoordTitle: "Panchayat Coordination",
        panchayatCoordDescription: "Your booking is coordinated through the panchayat for scheduling",
        servicePaymentTitle: "Service & Payment",
        servicePaymentDescription: "Machine arrives on scheduled date, work completed, payment processed",
        machineTypes: {
          combineHarvester: {
            name: "Combine Harvester",
            description: "Machine that cuts crops and separates grain from stalks",
            features: ["Cuts multiple crops", "Chops leftover stalks", "Fast grain separation"]
          },
          stubbleChopper: {
            name: "Stubble Chopper", 
            description: "Machine that cuts and chops crop leftovers into small pieces",
            features: ["Cuts stubble evenly", "Chops into small pieces", "Clears field quickly"]
          },
          rotaryMulcher: {
            name: "Rotary Mulcher",
            description: "Machine that shreds crop waste and mixes it into soil",
            features: ["Shreds crop waste", "Mixes into soil", "Adds nutrition to soil"]
          },
          cropBaler: {
            name: "Crop Baler",
            description: "Machine that collects crop waste and packs it into tight bundles", 
            features: ["Collects waste automatically", "Packs tightly", "Easy to move bundles"]
          }
        }
      },
      // Analytics
      analytics: {
        co2EmissionsSaved: "CO₂ Emissions Saved",
        fromProcessed: "From {amount} tons processed",
        totalResidueCollected: "Total Residue Collected",
        divertedFromBurning: "Diverted from burning",
        soilHealthPreserved: "Soil Health Preserved",
        enhancedSoilQuality: "Enhanced soil quality",
        incomeGenerated: "Income Generated",
        totalFarmerEarnings: "Total farmer earnings",
        panchayatAnalytics: "Panchayat-Level Analytics",
        totalPanchayats: "Total Panchayats",
        farmersParticipating: "farmers participating",
        avgIncomePerPanchayat: "Avg Income/Panchayat",
        perPanchayatEarnings: "Per panchayat earnings",
        topPerformers: "Top Performers",
        leadingPanchayatsTracked: "Leading panchayats tracked",
        topPerformingPanchayats: "Top Performing Panchayats",
        panchayatsHighestCollection: "Panchayats with highest residue collection and income generation",
        monthlyResidueCollection: "Monthly Residue Collection",
        cropTypesAndCO2Impact: "Crop Types & CO₂ Impact",
        distributionByQuantity: "Distribution by quantity with CO₂ saving factors",
        incomeVsCollectionTrends: "Income vs Collection Trends",
        cropResidueMarketplace: "Crop Residue Marketplace",
        selectCropResidues: "Select crop residues and quantities to list for sale",
        availableCropResidues: "Available Crop Residues",
        quantityAndUnit: "Quantity & Unit",
        listForSelling: "List for Selling",
        cropResidueForSale: "Crop residue for sale",
        unit: "Unit",
        kg: "Kg",
        quintals: "Quintals",
        tons: "Tons",
        // Farmer Profile English Translations
        farmerProfile: {
          raviSingh: "Ravi Singh",
          sultanpurGramPanchayat: "Sultanpur, Gram Panchayat", 
          rewariHaryana: "Rewari, Haryana"
        },
        // Crop Names Translation
        cropNames: {
          "Paddy": "Paddy",
          "Wheat": "Wheat",
          "Sugarcane": "Sugarcane",
          "Cotton": "Cotton",
          "Maize": "Maize",
          "Sunflower": "Sunflower",
          "Husk": "Husk"
        }
      },
      // Profile Page
      profilePage: {
        editProfile: "Edit Profile",
        cancel: "Cancel",
        saveChanges: "Save Changes",
        verificationStatus: "Verification Status",
        accountVerificationStatus: "Your account verification status",
        verified: "Verified",
        pending: "Pending",
        profileVerified: "Your profile has been verified by the Panchayat office. You can now access all features.",
        accountVerificationRequired: "Account Verification Required",
        profilePendingVerification: "Your profile is pending verification by the Panchayat office.",
        stepsToCompleteVerification: "Steps to complete verification:",
        visitPanchayatOffice: "Visit your Panchayat office",
        bringOriginalAadhar: "Bring your original Aadhar Card",
        meetPanchayatAdmin: "Meet with the Panchayat Admin",
        provideLandDocuments: "Provide land ownership documents if available",
        personalInformation: "Personal Information",
        fullName: "Full Name",
        fatherMotherName: "Father's/Mother's Name",
        phoneNumber: "Phone Number",
        aadharNumber: "Aadhar Number",
        forVerificationPurposes: "For verification purposes",
        emailAddress: "Email Address", 
        emailCannotChange: "Email cannot be changed here. Contact support if needed.",
        coordinates: "Coordinates",
        locationPanchayat: "Location & Panchayat",
        village: "Village",
        panchayat: "Panchayat",
        district: "District",
        state: "State",
        notAssigned: "Not assigned",
        farmingInformation: "Farming Information",
        cropsYouGrow: "Crops You Grow",
        landAreaAcres: "Land Area (Acres)",
        farmLocation: "Farm Location",
        latitude: "Latitude",
        longitude: "Longitude",
        notSet: "Not set",
        contactPanchayatLocation: "Contact your Panchayat admin to update location coordinates",
        paymentInformation: "Payment Information",
        upiId: "UPI ID",
        bankAccountNumber: "Bank Account Number",
        ifscCode: "IFSC Code",
        profileStatistics: "Profile Statistics",
        memberSince: "Member Since",
        verification: "Verification",
        landArea: "Land Area",
        acres: "Acres",
        panchayatLink: "Panchayat Link",
        crops: "Crops",
        paymentSetup: "Payment Setup",
        noPaymentMethodConfigured: "No payment method configured",
        addUpiOrBankDetails: "Add UPI ID or bank details to receive payments",
        profileUpdatedSuccessfully: "Profile updated successfully",
        failedToLoadProfileData: "Failed to load profile data",
        questionsContactSupport: "Questions? Contact your local Panchayat office or reach out to our support team."
      },
      // Panchayat Dashboard
      panchayatDashboard: {
        welcomeToDigitalPanchayat: "Welcome to Digital Panchayat",
        transformVillageAgricultural: "Transform your village's agricultural management with our comprehensive platform for crop residue and machinery management.",
        registerYourPanchayat: "Register Your Panchayat",
        comprehensiveManagementPlatform: "Comprehensive Management Platform",
        everythingYouNeed: "Everything you need to manage your village's agricultural resources",
        farmerManagement: "Farmer Management",
        registerAndManageFarmers: "Register and manage farmers in your panchayat area",
        cropResidue: "Crop Residue",
        trackAndManageCropResidue: "Track and manage crop residue disposal and sales",
        machineryBooking: "Machinery Booking",
        approveAndManageFarm: "Approve and manage farm machinery rental requests",
        panchayatDashboard: "Panchayat Dashboard",
        manageYourCommunity: "Manage your community's sustainable farming initiatives. Oversee farmers, track residue collection, and drive environmental progress.",
        panchayatManagementFeatures: "Panchayat Management Features",
        comprehensiveTools: "Comprehensive tools to manage your village's agricultural waste and support farmers",
        residueTracking: "Residue Tracking",
        monitorCropResidue: "Monitor crop residue collection and sales in your area",
        industryOrders: "Industry Orders",
        manageOrdersFromIndustries: "Manage orders from industries and coordinate supply",
        machineryLending: "Machinery Lending",
        coordinateMachineryRentals: "Coordinate machinery rentals for efficient collection",
        analytics: "Analytics",
        trackProgressAndGenerate: "Track progress and generate reports for government",
        compliance: "Compliance",
        ensureEnvironmentalCompliance: "Ensure environmental compliance and policy adherence",
        communityImpact: "Community Impact",
        registeredFarmers: "Registered Farmers",
        residueListings: "Residue Listings",
        farmerIncome: "Farmer Income",
        envBenefits: "Environmental Benefits",
        panchayatProfile: "Panchayat Profile",
        manageYourPanchayatInfo: "Manage your panchayat information and settings",
        panchayatName: "Panchayat Name",
        village: "Village",
        block: "Block",
        district: "District",
        state: "State",
        welcomeBack: "Welcome back",
        dashboard: "Dashboard",
        verification: "Verification",
        residueManagement: "Residue Management",
        machinery: "Machinery",
        profile: "Profile",
        thisSectionUnderDevelopment: "This section is under development."
      },
      // About Us Page
      aboutUs: {
        pageTitle: "About Us",
        heroSubtitle: "Turning agricultural waste into wealth, one village at a time.",
        whoWeAreTitle: "Who We Are",
        whoWeAreDescription: "Grameen is a student-led innovation built to solve one of rural India's biggest challenges – crop and other residual waste management. We believe waste is not a burden, but an opportunity for income, sustainability, and rural empowerment.",
        ourBeliefTitle: "Our Belief",
        ourBeliefDescription: "We challenge the belief that crop residue is worthless. We turn it into income, cleaner air, and sustainable growth.",
        ourVisionTitle: "Our Vision",
        ourVisionDescription: "To create a transparent, farmer-friendly platform where agricultural and village waste is turned into valuable resources, reducing burning, cutting costs, and improving livelihoods.",
        ourMissionTitle: "Our Mission",
        mission1: "Empower farmers with easy tools to register and sell their crop residue.",
        mission2: "Connect industries with villages through a simple waste marketplace.",
        mission3: "Provide affordable access to modern farming machines through Panchayat booking.",
        mission4: "Ensure transparency in earnings and waste tracking, cutting out middlemen.",
        whatWeOfferTitle: "What We Offer",
        whatWeOfferSubtitle: "Comprehensive solutions for waste management, machine access, and transparent transactions.",
        farmerDashboardTitle: "Farmer Dashboard",
        farmerDashboardDescription: "List waste, track pickups, and view payments.",
        wasteMarketplaceTitle: "Waste Marketplace",
        wasteMarketplaceDescription: "Industries buy stubble and other residues for recycling.",
        machineBookingTitle: "Machine Booking",
        machineBookingDescription: "Rent Happy Seeders, balers, and mulchers via Panchayat.",
        transparencyDashboardTitle: "Transparency Dashboard",
        transparencyDashboardDescription: "Villagers see exactly how waste is collected and how money flows.",
        whyGrameenTitle: "Why Grameen?",
        whyGrameenDescription: "Because we challenge the belief that crop residue is worthless. We turn it into income, cleaner air, and sustainable growth. Starting small, scaling big – Grameen is here to transform waste into wealth for rural India.",
        grameenTagline: "Transforming Waste into Wealth",
        footerDescription: "Turning agricultural waste into wealth. Building a sustainable future for rural India."
      }
    }
  },
  hi: {
    translation: {
      nav: {
        home: "होम",
        panchayat: "पंचायत",
        buyers: "खरीदार", 
        farmers: "किसान",
        aboutUs: "हमारे बारे में",
        getStarted: "शुरू करें"
      },
      hero: {
        title: "जलाना बंद करें,",
        titleHighlight: "कमाना शुरू करें",
        subtitle: "किसानों, पंचायतों और उद्योगों को पारदर्शी पारिस्थितिकी तंत्र में जोड़कर फसल अवशेष को मूल्यवान संसाधनों में बदलना।",
        joinPanchayat: "पंचायत से जुड़ें",
        registerBuyer: "खरीदार के रूप में पंजीकरण करें"
      },
      stats: {
        cropResidue: "टन फसल अवशेष वार्षिक",
        pollutionReduction: "वायु प्रदूषण कम करने का लक्ष्य",
        farmerIncome: "प्रति किसान संभावित वार्षिक आय", 
        panchayatsReady: "पंचायतें जुड़ने के लिए तैयार"
      },
      problem: {
        title: "समस्या:",
        titleHighlight: "पराली जलाने का संकट",
        description: "हर फसल के मौसम में, किसान किफायती मशीनरी, भंडारण सुविधाओं और बाजार संपर्क की कमी के कारण लाखों टन फसल अवशेष जलाते हैं। इससे गंभीर वायु प्रदूषण, मिट्टी की गुणवत्ता में गिरावट और स्वास्थ्य संबंधी खतरे होते हैं।",
        point1: "सर्दियों में दिल्ली के 40% वायु प्रदूषण में योगदान",
        point2: "मिट्टी की गुणवत्ता और उर्वरता में गिरावट",
        point3: "₹1000+ करोड़ मूल्य के बायोमास की बर्बादी"
      },
      solution: {
        title: "हमारा समाधान:",
        titleHighlight: "डिजिटल पारिस्थितिकी तंत्र",
        description: "ग्रामीण एक पंचायत-नेतृत्व वाला डिजिटल प्लेटफॉर्म बनाता है जो किसानों, पंचायतों और उद्योगों के बीच पारदर्शी कनेक्शन के माध्यम से कृषि अपशिष्ट को धन में बदल देता है।"
      },
      features: {
        panchayatGov: {
          title: "पंचायत-नेतृत्व शासन",
          description: "निष्पक्ष लेनदेन और सामुदायिक लाभ सुनिश्चित करने वाली पंचायत निगरानी के साथ पारदर्शी सामुदायिक प्रबंधन।"
        },
        wasteManagement: {
          title: "स्मार्ट अपशिष्ट प्रबंधन",
          description: "जलाने के बजाय कृषि अपशिष्ट को मूल्यवान संसाधनों में बदलें, नई आय धाराएं बनाएं।"
        },
        marketLinkage: {
          title: "बाजार संपर्क",
          description: "विश्वसनीय, कम लागत वाली बायोमास आपूर्ति श्रृंखलाओं के लिए किसानों और उद्योगों के बीच प्रत्यक्ष संपर्क।"
        },
        transactions: {
          title: "पारदर्शी लेनदेन",
          description: "सभी हितधारकों के लिए निष्पक्ष मूल्य निर्धारण और सुरक्षित भुगतान सुनिश्चित करने वाला डिजिटल प्लेटफॉर्म।"
        },
        locationServices: {
          title: "स्थान-आधारित सेवाएं",
          description: "कुशल फसल अवशेष संग्रह और मशीनरी बुकिंग के लिए जीपीएस ट्रैकिंग और रूट अनुकूलन।"
        },
        environmentalImpact: {
          title: "पर्यावरणीय प्रभाव",
          description: "पराली जलाने में कमी से CO₂ की बचत, वायु गुणवत्ता में सुधार और पर्यावरणीय लाभों को ट्रैक करें।"
        }
      },
      howItWorks: {
        title: "ग्रामीण कैसे काम करता है",
        subtitle: "अपशिष्ट से धन तक सरल, पारदर्शी प्रक्रिया",
        step1: {
          title: "पंचायत पंजीकरण",
          description: "पंचायत व्यवस्थापक अपने गांवों को पंजीकृत करते हैं और किसानों को प्लेटफॉर्म पर लाते हैं"
        },
        step2: {
          title: "किसान अवशेष सूचीबद्ध करते हैं",
          description: "किसान मात्रा, प्रकार और स्थान विवरण के साथ अपने फसल अपशिष्ट को पंजीकृत करते हैं"
        },
        step3: {
          title: "उद्योग खरीदते और प्रसंस्करण करते हैं",
          description: "उद्योग सीधे अवशेष खरीदते हैं, टिकाऊ आपूर्ति श्रृंखला बनाते हैं"
        }
      },
      cta: {
        title: "अपने समुदाय को बदलने के लिए तैयार हैं?",
        subtitle: "हजारों पंचायतों, किसानों और उद्योगों के साथ एक टिकाऊ भविष्य बनाने में शामिल हों",
        registerPanchayat: "अपनी पंचायत पंजीकृत करें",
        joinIndustry: "उद्योग भागीदार के रूप में जुड़ें"
      },
      resources: {
        title: "फसल अवशेष संसाधन और समाधान",
        subtitle: "फसल अवशेष को उद्योगों और मशीनरी से जोड़ने वाला व्यापक पारिस्थितिकी तंत्र",
        crops: "फसल अवशेष",
        industries: "उद्योग",
        machines: "मशीनें",
        cropData: {
          paddyStraw: {
            name: "धान का पुआल",
            description: "चावल की खेती से बचे हुए तने।"
          },
          wheatStraw: {
            name: "गेहूं का पुआल",
            description: "गेहूं की कटाई के बाद का अवशेष।"
          },
          sugarcaneBagasse: {
            name: "गन्ने की खोई",
            description: "चीनी मिलों से निकलने वाला रेशेदार अवशेष।"
          },
          sunflowerStalks: {
            name: "सूरजमुखी के डंठल",
            description: "बीज निकालने के बाद बचे हुए डंठल।"
          },
          maizeCobs: {
            name: "मक्का के भुट्टे",
            description: "मक्का के दाने निकालने के बाद बचे हुए भुट्टे।"
          },
          mustardStalks: {
            name: "सरसों के डंठल",
            description: "सरसों के बीज की कटाई के बाद बचे हुए डंठल।"
          }
        },
        industryData: {
          bioCNG: {
            name: "बायो-सीएनजी प्लांट",
            description: "अवशेषों को नवीकरणीय संपीड़ित प्राकृतिक गैस में बदलें।"
          },
          ethanol: {
            name: "इथेनॉल प्लांट",
            description: "मिश्रण कार्यक्रमों के लिए अवशेषों को बायो-इथेनॉल में प्रसंस्कृत करना।"
          },
          paper: {
            name: "कागज और गत्ता",
            description: "पुआल और खोई को कागज उत्पादों में बदला जाता है।"
          },
          packaging: {
            name: "पैकेजिंग रीसाइक्लर",
            description: "पर्यावरण-अनुकूल पैकेजिंग सामग्री में अवशेष का उपयोग।"
          },
          mushroom: {
            name: "मशरूम फार्म",
            description: "मशरूम की खेती के लिए सब्सट्रेट के रूप में पुआल का उपयोग।"
          },
          compost: {
            name: "कंपोस्ट निर्माता",
            description: "अवशेषों को प्राकृतिक उर्वरक में कंपोस्ट किया जाता है।"
          }
        },
        machineData: {
          happySeeder: {
            name: "हैप्पी सीडर",
            description: "चावल के ठूंठ में सीधे गेहूं की बुआई करता है।"
          },
          rotavator: {
            name: "रोटावेटर",
            description: "फसल अवशेषों को मिट्टी में वापस मिलाता है।"
          },
          sms: {
            name: "सुपर स्ट्रॉ मैनेजमेंट सिस्टम (एसएमएस)",
            description: "पुआल को समान रूप से फैलाता और प्रबंधित करता है।"
          },
          strawBaler: {
            name: "स्ट्रॉ बेलर",
            description: "परिवहन के लिए पुआल को कॉम्पैक्ट गांठों में संपीड़ित करता है।"
          },
          mulcher: {
            name: "मल्चर",
            description: "फसल अवशेष को काटकर समान रूप से फैलाता है।"
          },
          zeroTillDrill: {
            name: "जीरो टिल ड्रिल",
            description: "मौजूदा अवशेष को हटाए बिना बीज बोता है।"
          }
        }
      },
      // Common translations
      common: {
        important: "महत्वपूर्ण",
        loading: "लोड हो रहा है...",
        error: "त्रुटि",
        success: "सफलता",
        save: "सहेजें",
        cancel: "रद्द करें",
        edit: "संपादित करें",
        delete: "हटाएं",
        search: "खोजें",
        date: "दिनांक",
        status: "स्थिति"
      },
      // Farmer Portal Translations
      farmer: {
        dashboard: "डैशबोर्ड",
        sellResidue: "अवशेष बेचें",
        myListings: "मेरी सूचियां",
        rentMachinery: "किराया",
        analytics: "विश्लेषण",
        profile: "प्रोफाइल",
        residueListing: "अवशेष सूची",
        paymentRecords: "भुगतान रिकॉर्ड",
        myProfile: "मेरी प्रोफाइल",
        personalInfo: "व्यक्तिगत जानकारी",
        locationPanchayat: "स्थान और पंचायत",
        farmingInfo: "कृषि जानकारी",
        verificationStatus: "सत्यापन स्थिति",
        accountVerified: "आपकी प्रोफाइल पंचायत कार्यालय द्वारा सत्यापित की गई है। अब आप सभी सुविधाओं का उपयोग कर सकते हैं।",
        accountPending: "आपकी प्रोफाइल पंचायत कार्यालय के सत्यापन की प्रतीक्षा में है।",
        visitPanchayat: "कृपया सत्यापन पूरा करने के लिए अपना आधार कार्ड लेकर अपने पंचायत कार्यालय जाएं।",
        verificationRequired: "खाता सत्यापन आवश्यक",
        verificationSteps: "अपनी प्रोफाइल सेटअप पूरा करने के लिए:",
        verificationStep1: "अपना आधार कार्ड लेकर अपने स्थानीय पंचायत कार्यालय जाएं",
        verificationStep2: "पहचान सत्यापन के लिए पंचायत व्यवस्थापक से मिलें",
        verificationStep3: "अपनी कृषि विवरण और भूमि दस्तावेज प्रदान करें",
        verificationStep4: "प्रोफाइल सत्यापन की प्रतीक्षा करें (आमतौर पर 1-2 कार्य दिवस)",
        verificationImportant: "आपका खाता वर्तमान में आपके पंचायत व्यवस्थापक के सत्यापन की प्रतीक्षा में है। सत्यापित होने के बाद, आपको अवशेष सूची, बाजार पहुंच और भुगतान ट्रैकिंग सहित सभी प्लेटफॉर्म सुविधाओं तक पूर्ण पहुंच होगी।",
        farmerTotalEarnings: "कुल कमाई",
        farmerThisMonth: "इस महीने",
        totalTransactions: "कुल लेनदेन",
        currentMonthEarnings: "वर्तमान महीने की कमाई",
        completedPayments: "पूर्ण भुगतान",
        searchPayments: "फसल प्रकार, भुगतान प्रकार या खरीदार द्वारा खोजें...",
        noPaymentRecords: "अभी तक कोई भुगतान रिकॉर्ड नहीं",
        paymentRecordsDescription: "आपके फसल अवशेष की बिक्री पूरी होने पर भुगतान रिकॉर्ड यहां दिखाई देंगे",
        noPaymentMatch: "आपकी खोज से कोई भुगतान मेल नहीं खाता",
        adjustSearchTerms: "अपने खोज शब्दों को समायोजित करने का प्रयास करें",
        paymentHistory: "फसल अवशेष बिक्री से अपनी कमाई और भुगतान इतिहास को ट्रैक करें",
        editProfile: "प्रोफाइल संपादित करें",
        saveChanges: "परिवर्तन सहेजें",
        cancel: "रद्द करें",
        personalInformation: "अपनी व्यक्तिगत जानकारी और कृषि विवरण प्रबंधित करें",
        fullName: "पूरा नाम",
        phoneNumber: "फोन नंबर",
        emailAddress: "ईमेल पता",
        emailCannotChange: "ईमेल यहां नहीं बदला जा सकता। यदि आवश्यक हो तो सहायता से संपर्क करें।",
        coordinates: "निर्देशांक",
        locationCoordinates: "आपके खेत के लिए स्थान निर्देशांक",
        village: "गांव",
        panchayat: "पंचायत",
        district: "जिला",
        state: "राज्य",
        landArea: "भूमि क्षेत्र (एकड़)",
        farmLocation: "खेत का स्थान",
        contactPanchayatLocation: "स्थान निर्देशांक अपडेट करने के लिए अपने पंचायत व्यवस्थापक से संपर्क करें",
        profileStats: "प्रोफाइल आंकड़े",
        memberSince: "सदस्य बने",
        verification: "सत्यापन",
        acres: "एकड़",
        panchayatLink: "पंचायत लिंक",
        language: "भाषा",
        theme: "थीम",
        light: "हल्का",
        dark: "गहरा",
        english: "English",
        hindi: "हिन्दी",
        myAccount: "मेरा खाता",
        signOut: "साइन आउट",
        cropResidueManagement: "फसल अवशेष प्रबंधन",
        // Dashboard translations
        welcomeFarmer: "स्वागत है, किसान!",
        profileSetupMessage: "आपकी किसान प्रोफाइल आपके पंचायत व्यवस्थापक द्वारा सेट की जा रही है। कृपया अपना पंजीकरण पूरा करने के लिए उनसे संपर्क करें।",
        welcome: "स्वागत",
        activeListings: "सक्रिय सूचियां",
        farmerMachineBookings: "मशीन बुकिंग",
        totalEarnings: "कुल कमाई",
        total: "कुल",
        listings: "सूचियां",
        pendingApproved: "लंबित/अनुमोदित",
        fromResidueSales: "अवशेष बिक्री से",
        bookMachine: "मशीन बुक करें",
        addCropResidue: "फसल अवशेष जोड़ें",
        yourCropResidueListings: "आपकी फसल अवशेष सूचियां",
        manageCropResidueListings: "अपनी फसल अवशेष सूचियों को प्रबंधित करें और उनकी स्थिति को ट्रैक करें",
        noCropResidueListingsYet: "अभी तक कोई फसल अवशेष सूची नहीं। कमाई शुरू करने के लिए अपनी पहली सूची बनाएं।",
        machineBookingsTitle: "मशीन बुकिंग",
        recentMachineBookingRequests: "आपके हाल की मशीन बुकिंग अनुरोध",
        noMachineBookingsYet: "अभी तक कोई मशीन बुकिंग नहीं। कुशल फसल अवशेष प्रबंधन के लिए मशीनें बुक करें।",
        bookingDate: "बुकिंग दिनांक",
        cost: "लागत",
        tons: "टन",
        // Residue Listing Page
        residueListings: "अवशेष सूचियां",
        addNewListing: "नई सूची जोड़ें",
        searchPlaceholder: "फसल प्रकार, निपटान विधि या स्थिति द्वारा खोजें...",
        noListingsMatchSearch: "आपकी खोज से कोई सूची मेल नहीं खाती",
        tryAdjustingSearch: "अपने खोज शब्दों को समायोजित करने का प्रयास करें",
        createFirstListing: "अपने फसल अवशेष से कमाई शुरू करने के लिए अपनी पहली सूची बनाएं",
        addYourFirstListing: "अपनी पहली सूची जोड़ें",
        addedOn: "जोड़ा गया",
        quantity: "मात्रा",
        price: "मूल्य",
        method: "विधि",
        location: "स्थान",
        harvestDate: "फसल काटने की तारीख",
        view: "देखें",
        edit: "संपादित करें",
        areYouSureDelete: "क्या आप वाकई इस सूची को हटाना चाहते हैं?",
        listingDeletedSuccess: "सूची सफलतापूर्वक हटा दी गई",
        failedToLoadResidueListings: "अवशेष सूचियां लोड करने में विफल",
        failedToLoadData: "डेटा लोड करने में विफल"
      },
      // Farmer Landing Page Hindi
      farmerLanding: {
        heroTitle: "जलाना बंद करें,",
        heroTitleHighlight: "कमाना शुरू करें!",
        heroSubtitle: "अपने फसल अवशेषों को आय में बदलते हुए हमारे पर्यावरण की सुरक्षा करें। आज ही टिकाऊ कृषि क्रांति में शामिल हों।",
        benefitsTitle: "टिकाऊ अवशेष प्रबंधन क्यों चुनें?",
        benefitsSubtitle: "हजारों किसानों के साथ जुड़ें जो हमारे ग्रह की सुरक्षा करते हुए अतिरिक्त आय कमा रहे हैं",
        benefit1Title: "अतिरिक्त आय कमाएं",
        benefit1Description: "अपने फसल अवशेष को जलाने के बजाय नकदी में बदलें",
        benefit2Title: "पर्यावरण की सुरक्षा करें",
        benefit2Description: "वायु प्रदूषण कम करें और जलवायु परिवर्तन से निपटने में मदद करें",
        benefit3Title: "आसान संग्रह",
        benefit3Description: "कुशल अवशेष प्रबंधन के लिए मशीनें बुक करें",
        benefit4Title: "सामुदायिक सहयोग",
        benefit4Description: "अवशेषों से कमाई करने वाले हजारों किसानों में शामिल हों",
        statsTitle: "हमारा सामुदायिक प्रभाव",
        stat1Label: "पंजीकृत किसान",
        stat2Label: "टन एकत्रित",
        stat3Label: "आय उत्पन्न",
        stat4Label: "CO₂ बचाया गया",
        ctaTitle: "अपने अवशेषों से कमाई शुरू करने के लिए तैयार हैं?",
        ctaSubtitle: "आज ही अपने फसल अवशेषों को सूचीबद्ध करें और अपने क्षेत्र के खरीदारों से जुड़ें",
        listResidue: "अपने अवशेष सूचीबद्ध करें",
        exploreMachines: "मशीनों का अन्वेषण करें"
      },
      // Sell Residue Page Hindi
      sellResidue: {
        title: "अपने फसल अवशेष बेचें",
        subtitle: "सूची बनाना शुरू करने के लिए अपना फसल प्रकार चुनें। अपने कृषि अपशिष्ट के लिए उचित मूल्य प्राप्त करें और पर्यावरण की मदद करें।",
        viewMyListings: "मेरी सूचियां देखें",
        listFormTitle: "अपने फसल अवशेष सूचीबद्ध करें",
        listFormSubtitle: "अपने अवशेष को बाज़ार में सूचीबद्ध करने और उचित मूल्य प्राप्त करने के लिए नीचे दिया गया फॉर्म भरें।",
        howItWorksTitle: "यह कैसे काम करता है",
        howItWorksSubtitle: "अपने फसल अवशेषों से कमाई शुरू करने की सरल 3-चरणीय प्रक्रिया",
        step1Title: "फसल चुनें और अपना मूल्य तय करें",
        step1Description: "अपना फसल प्रकार चुनें और मात्रा, मूल्य निर्धारण और स्थान विवरण प्रदान करें। आपकी कमाई पहले से तय हो जाती है।",
        step2Title: "पंचायत अनुमोदन",
        step2Description: "आपकी सूची सत्यापन और अनुमोदन के लिए पंचायत के पास जाती है",
        step3Title: "पंचायत बिक्री संभालती है",
        step3Description: "पंचायत तय करती है कि अवशेष का क्या करना है और खरीदारों को बेचने का काम संभालती है। आपको आपका तय किया गया भुगतान मिलता है।",
        cropTypes: {
          paddy: {
            name: "धान/चावल",
            description: "चावल का भूसा और छिलके - बायोमास ऊर्जा की उच्च मांग"
          },
          wheat: {
            name: "गेहूं",
            description: "पशुओं के चारे और कागज उद्योग के लिए गेहूं का भूसा"
          },
          maize: {
            name: "मक्का/मकई",
            description: "जैव ईंधन उत्पादन के लिए मक्के के डंठल और भुट्टे"
          },
          sugarcane: {
            name: "गन्ना",
            description: "कागज और ऊर्जा उत्पादन के लिए गन्ने की खोई"
          },
          cotton: {
            name: "कपास",
            description: "बायोमास और खाद बनाने के लिए कपास के डंठल"
          },
          sunflower: {
            name: "सूरजमुखी",
            description: "जैव ऊर्जा और पशु आहार के लिए सूरजमुखी के डंठल"
          }
        }
      },
      // My Listings Page Hindi
      myListings: {
        title: "मेरी अवशेष सूचियां",
        subtitle: "अपनी सभी फसल अवशेष सूचियों का प्रबंधन और ट्रैकिंग करें",
        backToSell: "बेचने पर वापस जाएं",
        addNewListing: "नई सूची जोड़ें",
        totalListings: "कुल सूचियां",
        available: "उपलब्ध",
        sold: "बेची गई",
        totalValue: "कुल मूल्य",
        noListingsTitle: "अभी तक कोई अवशेष सूची नहीं है",
        noListingsDescription: "खरीदारों से जुड़ने और अतिरिक्त आय अर्जित करने के लिए अपनी पहली फसल अवशेष सूची जोड़कर शुरुआत करें",
        addFirstListing: "अपनी पहली सूची जोड़ें",
        quantity: "मात्रा",
        pricePerTon: "मूल्य/टन",
        disposalMethod: "निपटान विधि",
        harvestDate: "फसल काटने की तारीख",
        listed: "सूचीबद्ध"
      },
      // Machine Booking Hindi
      machineBooking: {
        title: "कृषि मशीन बुकिंग",
        subtitle: "कुशल फसल अवशेष प्रबंधन और खेत के कार्यों के लिए पेशेवर कृषि मशीनरी बुक करें",
        yourBookingsTitle: "आपकी मशीन बुकिंग",
        yourBookingsSubtitle: "अपनी कृषि मशीनरी बुकिंग को ट्रैक और प्रबंधित करें",
        totalBookings: "कुल बुकिंग",
        pending: "लंबित",
        approved: "अनुमोदित",
        completed: "पूर्ण",
        bookingDate: "बुकिंग तारीख",
        cost: "लागत",
        notes: "नोट्स",
        requested: "अनुरोधित",
        awaitingApproval: "अनुमोदन की प्रतीक्षा में",
        howItWorksTitle: "मशीन बुकिंग कैसे काम करती है",
        howItWorksSubtitle: "अपने खेत के कार्यों के लिए सही मशीनरी प्राप्त करने की सरल प्रक्रिया",
        selectBookTitle: "मशीन चुनें और बुक करें",
        selectBookDescription: "अपनी आवश्यकताओं के लिए सही मशीन चुनें और बुकिंग विवरण प्रदान करें",
        panchayatCoordTitle: "पंचायत समन्वय",
        panchayatCoordDescription: "आपकी बुकिंग को शेड्यूलिंग के लिए पंचायत के माध्यम से समन्वित किया जाता है",
        servicePaymentTitle: "सेवा और भुगतान",
        servicePaymentDescription: "मशीन निर्धारित तारीख पर आती है, काम पूरा होता है, भुगतान प्रक्रिया होती है",
        machineTypes: {
          combineHarvester: {
            name: "कंबाइन हार्वेस्टर",
            description: "मशीन जो फसलों को काटती है और अनाज को डंठलों से अलग करती है",
            features: ["कई फसलों को काटती है", "बचे हुए डंठलों को काटती है", "तेज़ अनाज अलगाव"]
          },
          stubbleChopper: {
            name: "पराली काटने की मशीन",
            description: "मशीन जो फसल के अवशेषों को काटती है और छोटे टुकड़ों में काटती है",
            features: ["पराली को समान रूप से काटती है", "छोटे टुकड़ों में काटती है", "खेत को जल्दी साफ करती है"]
          },
          rotaryMulcher: {
            name: "रोटरी मल्चर",
            description: "मशीन जो फसल अपशिष्ट को काटती है और मिट्टी में मिलाती है",
            features: ["फसल अपशिष्ट को काटती है", "मिट्टी में मिलाती है", "मिट्टी में पोषण जोड़ती है"]
          },
          cropBaler: {
            name: "फसल बेलर",
            description: "मशीन जो फसल अपशिष्ट एकत्रित करती है और तंग बंडलों में पैक करती है",
            features: ["अपशिष्ट को स्वचालित रूप से एकत्रित करती है", "कसकर पैक करती है", "बंडलों को आसानी से हिलाना"]
          }
        }
      },
      // Analytics Hindi
      analytics: {
        co2EmissionsSaved: "CO₂ उत्सर्जन बचाया गया",
        fromProcessed: "{amount} टन प्रसंस्कृत से",
        totalResidueCollected: "कुल अवशेष एकत्रित",
        divertedFromBurning: "जलने से विचलित",
        soilHealthPreserved: "मिट्टी स्वास्थ्य संरक्षित",
        enhancedSoilQuality: "बेहतर मिट्टी गुणवत्ता",
        incomeGenerated: "आय उत्पन्न",
        totalFarmerEarnings: "कुल किसान आय",
        panchayatAnalytics: "पंचायत-स्तरीय विश्लेषण",
        totalPanchayats: "कुल पंचायतें",
        farmersParticipating: "किसान भाग ले रहे हैं",
        avgIncomePerPanchayat: "औसत आय/पंचायत",
        perPanchayatEarnings: "प्रति पंचायत आय",
        topPerformers: "शीर्ष प्रदर्शनकर्ता",
        leadingPanchayatsTracked: "अग्रणी पंचायतों को ट्रैक किया गया",
        topPerformingPanchayats: "शीर्ष प्रदर्शनकारी पंचायतें",
        panchayatsHighestCollection: "सबसे अधिक अवशेष संग्रह और आय उत्पादन वाली पंचायतें",
        monthlyResidueCollection: "मासिक अवशेष संग्रह",
        cropTypesAndCO2Impact: "फसल प्रकार और CO₂ प्रभाव",
        distributionByQuantity: "CO₂ बचत कारकों के साथ मात्रा के अनुसार वितरण",
        incomeVsCollectionTrends: "आय बनाम संग्रह रुझान",
        cropResidueMarketplace: "फसल अवशेष बाजार",
        selectCropResidues: "बिक्री के लिए सूचीबद्ध करने के लिए फसल अवशेष और मात्रा का चयन करें",
        availableCropResidues: "उपलब्ध फसल अवशेष",
        quantityAndUnit: "मात्रा और इकाई",
        listForSelling: "बिक्री के लिए सूचीबद्ध करें",
        cropResidueForSale: "बिक्री के लिए फसल अवशेष",
        unit: "इकाई",
        kg: "किलो",
        quintals: "क्विंटल",
        tons: "टन",
        // Farmer Profile Hindi Translations
        farmerProfile: {
          raviSingh: "रवि सिंह",
          sultanpurGramPanchayat: "सुल्तानपुर, ग्राम पंचायत",
          rewariHaryana: "रेवाड़ी, हरियाणा"
        },
        // Common Indian Names Translation
        commonNames: {
          "Ravi Singh": "रवि सिंह",
          "Amit Kumar": "अमित कुमार",
          "Suresh Patel": "सुरेश पटेल",
          "Ramesh Sharma": "रमेश शर्मा",
          "Vijay Singh": "विजय सिंह",
          "Rajesh Kumar": "राजेश कुमार",
          "Manoj Gupta": "मनोज गुप्ता",
          "Sanjay Yadav": "संजय यादव"
        },
        // Common Places Translation
        commonPlaces: {
          "Sultanpur": "सुल्तानपुर",
          "Rewari": "रेवाड़ी",
          "Haryana": "हरियाणा",
          "Uttar Pradesh": "उत्तर प्रदेश",
          "Punjab": "पंजाब",
          "Rajasthan": "राजस्थान",
          "Gram Panchayat": "ग्राम पंचायत",
          "Village": "गांव",
          "District": "जिला",
          "State": "राज्य"
        },
        // Crop Names Translation
        cropNames: {
          "Paddy": "धान",
          "Wheat": "गेहूं",
          "Sugarcane": "गन्ना",
          "Cotton": "कपास",
          "Maize": "मक्का",
          "Sunflower": "सूरजमुखी",
          "Husk": "भूसा"
        }
      },
      // Profile Page Hindi
      profilePage: {
        editProfile: "प्रोफ़ाइल संपादित करें",
        cancel: "रद्द करें",
        saveChanges: "परिवर्तन सहेजें",
        verificationStatus: "सत्यापन स्थिति",
        accountVerificationStatus: "आपके खाते की सत्यापन स्थिति",
        verified: "सत्यापित",
        pending: "लंबित",
        profileVerified: "आपकी प्रोफ़ाइल पंचायत कार्यालय द्वारा सत्यापित की गई है। अब आप सभी सुविधाओं का उपयोग कर सकते हैं।",
        accountVerificationRequired: "खाता सत्यापन आवश्यक",
        profilePendingVerification: "आपकी प्रोफ़ाइल पंचायत कार्यालय द्वारा सत्यापन के लिए लंबित है।",
        stepsToCompleteVerification: "सत्यापन पूरा करने के चरण:",
        visitPanchayatOffice: "अपने पंचायत कार्यालय जाएं",
        bringOriginalAadhar: "अपना मूल आधार कार्ड लाएं",
        meetPanchayatAdmin: "पंचायत व्यवस्थापक से मिलें",
        provideLandDocuments: "यदि उपलब्ध हो तो भूमि स्वामित्व दस्तावेज़ प्रदान करें",
        personalInformation: "व्यक्तिगत जानकारी",
        fullName: "पूरा नाम",
        fatherMotherName: "पिता/माता का नाम",
        phoneNumber: "फ़ोन नंबर",
        aadharNumber: "आधार नंबर",
        forVerificationPurposes: "सत्यापन उद्देश्यों के लिए",
        emailAddress: "ईमेल पता",
        emailCannotChange: "ईमेल यहां बदला नहीं जा सकता। यदि आवश्यक हो तो सहायता से संपर्क करें।",
        coordinates: "निर्देशांक",
        locationPanchayat: "स्थान और पंचायत",
        village: "गांव",
        panchayat: "पंचायत",
        district: "जिला",
        state: "राज्य",
        notAssigned: "असाइन नहीं किया गया",
        farmingInformation: "कृषि जानकारी",
        cropsYouGrow: "आप जो फसलें उगाते हैं",
        landAreaAcres: "भूमि क्षेत्र (एकड़)",
        farmLocation: "खेत का स्थान",
        latitude: "अक्षांश",
        longitude: "देशांतर",
        notSet: "सेट नहीं किया गया",
        contactPanchayatLocation: "स्थान निर्देशांक अपडेट करने के लिए अपने पंचायत व्यवस्थापक से संपर्क करें",
        paymentInformation: "भुगतान जानकारी",
        upiId: "UPI ID",
        bankAccountNumber: "बैंक खाता संख्या",
        ifscCode: "IFSC कोड",
        profileStatistics: "प्रोफ़ाइल आंकड़े",
        memberSince: "सदस्य बने",
        verification: "सत्यापन",
        landArea: "भूमि क्षेत्र",
        acres: "एकड़",
        panchayatLink: "पंचायत लिंक",
        crops: "फसलें",
        paymentSetup: "भुगतान सेटअप",
        noPaymentMethodConfigured: "कोई भुगतान विधि कॉन्फ़िगर नहीं की गई",
        addUpiOrBankDetails: "भुगतान प्राप्त करने के लिए UPI ID या बैंक विवरण जोड़ें",
        profileUpdatedSuccessfully: "प्रोफ़ाइल सफलतापूर्वक अपडेट किया गया",
        failedToLoadProfileData: "प्रोफ़ाइल डेटा लोड करने में विफल",
        questionsContactSupport: "प्रश्न? अपने स्थानीय पंचायत कार्यालय से संपर्क करें या हमारी सहायता टीम से संपर्क करें।"
      },
      // Panchayat Dashboard Hindi
      panchayatDashboard: {
        welcomeToDigitalPanchayat: "डिजिटल पंचायत में आपका स्वागत है",
        transformVillageAgricultural: "फसल अवशेष और मशीनरी प्रबंधन के लिए हमारे व्यापक प्लेटफॉर्म के साथ अपने गांव के कृषि प्रबंधन को रूपांतरित करें।",
        registerYourPanchayat: "अपनी पंचायत पंजीकृत करें",
        comprehensiveManagementPlatform: "व्यापक प्रबंधन प्लेटफॉर्म",
        everythingYouNeed: "आपके गांव के कृषि संसाधनों के प्रबंधन के लिए आवश्यक सब कुछ",
        farmerManagement: "किसान प्रबंधन",
        registerAndManageFarmers: "अपने पंचायत क्षेत्र में किसानों को पंजीकृत और प्रबंधित करें",
        cropResidue: "फसल अवशेष",
        trackAndManageCropResidue: "फसल अवशेष निपटान और बिक्री को ट्रैक और प्रबंधित करें",
        machineryBooking: "मशीनरी बुकिंग",
        approveAndManageFarm: "कृषि मशीनरी किराया अनुरोधों को अनुमोदित और प्रबंधित करें",
        panchayatDashboard: "पंचायत डैशबोर्ड",
        manageYourCommunity: "अपने समुदाय की टिकाऊ कृषि पहलों का प्रबंधन करें। किसानों की देखरेख करें, अवशेष संग्रह को ट्रैक करें, और पर्यावरणीय प्रगति को आगे बढ़ाएं।",
        panchayatManagementFeatures: "पंचायत प्रबंधन सुविधाएं",
        comprehensiveTools: "आपके गांव के कृषि अपशिष्ट का प्रबंधन करने और किसानों का समर्थन करने के लिए व्यापक उपकरण",
        residueTracking: "अवशेष ट्रैकिंग",
        monitorCropResidue: "अपने क्षेत्र में फसल अवशेष संग्रह और बिक्री की निगरानी करें",
        industryOrders: "उद्योग ऑर्डर",
        manageOrdersFromIndustries: "उद्योगों से ऑर्डर का प्रबंधन करें और आपूर्ति का समन्वय करें",
        machineryLending: "मशीनरी उधार",
        coordinateMachineryRentals: "कुशल संग्रह के लिए मशीनरी किराए का समन्वय करें",
        analytics: "विश्लेषण",
        trackProgressAndGenerate: "प्रगति को ट्रैक करें और सरकार के लिए रिपोर्ट तैयार करें",
        compliance: "अनुपालन",
        ensureEnvironmentalCompliance: "पर्यावरणीय अनुपालन और नीति पालन सुनिश्चित करें",
        communityImpact: "सामुदायिक प्रभाव",
        registeredFarmers: "पंजीकृत किसान",
        residueListings: "अवशेष सूचियां",
        farmerIncome: "किसान आय",
        envBenefits: "पर्यावरणीय लाभ",
        panchayatProfile: "पंचायत प्रोफ़ाइल",
        manageYourPanchayatInfo: "अपनी पंचायत जानकारी और सेटिंग्स का प्रबंधन करें",
        panchayatName: "पंचायत नाम",
        village: "गांव",
        block: "ब्लॉक",
        district: "जिला",
        state: "राज्य",
        welcomeBack: "वापसी पर स्वागत",
        dashboard: "डैशबोर्ड",
        verification: "सत्यापन",
        residueManagement: "अवशेष प्रबंधन",
        machinery: "मशीनरी",
        profile: "प्रोफ़ाइल",
        thisSectionUnderDevelopment: "यह अनुभाग विकसित हो रहा है।"
      },
      // About Us Page Hindi
      aboutUs: {
        pageTitle: "हमारे बारे में",
        heroSubtitle: "कृषि अपशिष्ट को धन में बदलना, एक गांव में एक समय।",
        whoWeAreTitle: "हम कौन हैं",
        whoWeAreDescription: "ग्रामीण एक छात्र-नेतृत्व वाली नवाचार है जो ग्रामीण भारत की सबसे बड़ी चुनौतियों में से एक - फसल और अन्य अवशिष्ट अपशिष्ट प्रबंधन को हल करने के लिए बनाई गई है। हमारा मानना है कि अपशिष्ट एक बोझ नहीं है, बल्कि आय, स्थिरता और ग्रामीण सशक्तिकरण का अवसर है।",
        ourBeliefTitle: "हमारा विश्वास",
        ourBeliefDescription: "हम इस विश्वास को चुनौती देते हैं कि फसल अवशेष बेकार है। हम इसे आय, स्वच्छ हवा और टिकाऊ विकास में बदल देते हैं।",
        ourVisionTitle: "हमारा दृष्टिकोण",
        ourVisionDescription: "एक पारदर्शी, किसान-अनुकूल प्लेटफॉर्म बनाना जहां कृषि और गांव का अपशिष्ट मूल्यवान संसाधनों में बदल जाता है, जलने को कम करता है, लागत कम करता है, और आजीविका में सुधार करता है।",
        ourMissionTitle: "हमारा मिशन",
        mission1: "किसानों को अपने फसल अवशेष को पंजीकृत करने और बेचने के लिए आसान उपकरण प्रदान करना।",
        mission2: "एक सरल अपशिष्ट बाजार के माध्यम से उद्योगों को गांवों से जोड़ना।",
        mission3: "पंचायत बुकिंग के माध्यम से आधुनिक कृषि मशीनों तक किफायती पहुंच प्रदान करना।",
        mission4: "आय और अपशिष्ट ट्रैकिंग में पारदर्शिता सुनिश्चित करना, बिचौलियों को काटना।",
        whatWeOfferTitle: "हम क्या प्रदान करते हैं",
        whatWeOfferSubtitle: "अपशिष्ट प्रबंधन, मशीन पहुंच और पारदर्शी लेनदेन के लिए व्यापक समाधान।",
        farmerDashboardTitle: "किसान डैशबोर्ड",
        farmerDashboardDescription: "अपशिष्ट सूचीबद्ध करें, पिकअप ट्रैक करें, और भुगतान देखें।",
        wasteMarketplaceTitle: "अपशिष्ट बाजार",
        wasteMarketplaceDescription: "उद्योग रीसाइक्लिंग के लिए पराली और अन्य अवशेष खरीदते हैं।",
        machineBookingTitle: "मशीन बुकिंग",
        machineBookingDescription: "पंचायत के माध्यम से हैप्पी सीडर, बेलर और मल्चर किराए पर लें।",
        transparencyDashboardTitle: "पारदर्शिता डैशबोर्ड",
        transparencyDashboardDescription: "ग्रामीण देखते हैं कि अपशिष्ट कैसे एकत्रित किया जाता है और पैसा कैसे बहता है।",
        whyGrameenTitle: "ग्रामीण क्यों?",
        whyGrameenDescription: "क्योंकि हम इस विश्वास को चुनौती देते हैं कि फसल अवशेष बेकार है। हम इसे आय, स्वच्छ हवा और टिकाऊ विकास में बदल देते हैं। छोटे से शुरू करके, बड़े पैमाने पर विस्तार - ग्रामीण भारत के लिए अपशिष्ट को धन में बदलने के लिए यहां है।",
        grameenTagline: "अपशिष्ट को धन में रूपांतरित करना",
        footerDescription: "कृषि अपशिष्ट को धन में बदलना। ग्रामीण भारत के लिए एक टिकाऊ भविष्य का निर्माण।"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;