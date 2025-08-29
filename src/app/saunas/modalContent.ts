import { ModalContentMap } from './types';

export const modalContent: ModalContentMap = {
  structural: {
    title: 'Built Like a House, Performs Like a Fortress',
    subtitle: '20+ year structural warranty backed by commercial-grade construction',
    mainImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689e787c914f6a78afadce42.jpeg',
    sections: [
      {
        type: 'grid',
        items: [
          {
            title: 'Frame & Insulation',
            list: [
              '2×4 Dimensional Lumber - Kiln-dried, structural grade',
              'Rockwool R-14 - 3.5" thickness, fire-resistant to 2150°F',
              'Dual Vapor Barriers - Foil-faced interior + full exterior',
              'Zero Thermal Bridging - Continuous insulation envelope'
            ]
          },
          {
            title: 'Foundation System',
            list: [
              'Adjustable Steel Legs - 4-8" range, galvanized',
              'No Concrete Required - Installs on any surface',
              '10° Slope Compensation - Auto-leveling capability',
              'Pressure-Treated Base - Marine-grade plywood subfloor'
            ]
          }
        ]
      },
      {
        type: 'callout',
        image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689e6cf7d382f28d8a139d30.jpeg',
        title: 'The Detail That Matters',
        text: 'Our fascia features a 45° rain-kick angle with metal wrapping—a detail you\'d find in $100K commercial builds. Water never touches wood, extending life by decades.'
      },
      {
        type: 'detail',
        title: 'Why This Outlasts Everything Else',
        list: [
          'Commercial-Grade Materials - Not residential shortcuts',
          'BC Building Code Compliance - Meets permanent structure standards',
          'Modular Design - Individual components serviceable',
          'Future-Proof Engineering - Pre-wired for upgrades'
        ]
      },
      {
        type: 'engineering-details',
        title: 'Engineering Details That Matter',
        content: [
          {
            subtitle: 'Weatherproof Power Hub',
            image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689ed6085bdfcf282ad2012d.jpeg',
            text: 'IP65-rated electrical enclosure protects all connections from moisture and weather. Commercial-grade components rated for outdoor installation ensure years of trouble-free operation in any climate.'
          },
          {
            subtitle: 'Clean Power Integration',
            image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689ed608c6ba4e5ab79f99b7.jpeg',
            text: 'Sealed entry points with drip loops prevent water ingress. All wiring runs through protective conduit with proper grounding, maintaining the clean aesthetic while ensuring safety.'
          },
          {
            subtitle: 'Lifetime Metal Roof',
            image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689e746ae0fe54aca848ff6e.jpeg',
            text: 'Standing seam metal roofing with hidden fasteners. Zero maintenance required, 50-year warranty against leaks. Snow slides off naturally, rain channels away instantly.'
          },
          {
            subtitle: 'Commercial Door Hardware',
            image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48410f6e924ab6dfae.jpeg',
            text: 'Self-closing hinges rated for 100,000+ cycles. Stainless steel pins with bronze bushings ensure smooth operation for decades. Magnetic weather stripping creates an airtight seal.'
          },
          {
            subtitle: 'Precision Leveling System',
            image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689eb70024858a7e2ef98b1d.jpeg',
            text: 'Heavy-duty threaded steel feet with 4-8" adjustment range. Each rated for 2,000 lbs, allowing perfect leveling on any terrain. No concrete pad required.'
          },
          {
            subtitle: 'Elevated Foundation',
            image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689eb7001ef51bd9be56915e.jpeg',
            text: 'Full ground clearance prevents moisture wicking and allows airflow. No ground contact means no rot, ever. Includes rodent-proof screening around the entire perimeter.'
          }
        ]
      }
    ]
  },
  doors: {
    title: 'Crystal Clear Views, Solid Security',
    subtitle: 'Premium tempered glass meets old-growth cedar craftsmanship',
    mainImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6dd9c1c1203c2dc791.jpeg',
    sections: [
      {
        type: 'specs-grid',
        columns: [
          {
            title: 'Glass Door Specifications',
            items: [
              '8mm Tempered Safety Glass - Impact rated, shatterproof',
              'Cedar Frame - Clear vertical grain, kiln-dried to 8% moisture',
              'Magnetic Seal System - Airtight closure, no slam design',
              'Premium Hardware - Stainless steel hinges, wooden handle',
              'Dimensions - 24" × 72" clear opening'
            ]
          },
          {
            title: 'Panoramic Windows',
            items: [
              'Double-Pane Insulated - Argon-filled for maximum efficiency',
              'Low-E Coating - Reflects heat back inside, UV protection',
              'Fixed Installation - No moving parts, maximum seal integrity',
              'Cedar Trim - Matches door frame perfectly',
              'Lifetime Seal Warranty - Against fogging or failure'
            ]
          }
        ]
      },
      {
        type: 'image-showcase',
        title: 'Craftsmanship in Detail',
        images: [
          {
            src: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689e787c914f6a78afadce42.jpeg',
            caption: 'Full glass door view with cedar frame'
          },
          {
            src: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689eb8385bdfcf7391ce0084.jpeg',
            caption: 'Magnetic seal detail - perfect closure every time'
          }
        ]
      },
      {
        type: 'comparison',
        title: 'Why Our Glass Lasts',
        text: 'Most saunas use 6mm single-pane glass that cracks from thermal shock. Our 8mm tempered glass with gradual heat zones has never had a warranty claim in 5 years.'
      },
      {
        type: 'single-image',
        image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48f9fb836c3eeddb83.jpeg',
        caption: 'Premium hardware detail - built to last generations'
      }
    ]
  },
  flooring: {
    title: 'The Floor That Solved Sauna\'s Biggest Problem',
    subtitle: '90% of saunas fail at the floor. Here\'s why ours doesn\'t.',
    mainImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6de916f4ccf63c46c1.jpeg',
    sections: [
      {
        type: 'diagram',
        title: 'The Cove System',
        points: [
          '2" cove curves up the wall - water can\'t pool in corners',
          '1% pitch toward door - gravity does the work',
          'Seamless vinyl - no joints for water infiltration'
        ]
      },
      {
        type: 'specs-grid',
        columns: [
          {
            title: 'Material Specifications',
            items: [
              'Commercial-Grade Vinyl - 3mm thickness',
              'Temperature Rating - -40°F to 200°F',
              'Heat-Welded Seams - Zero leak points',
              'Anti-Slip Surface - Safety certified',
              'UV Stable - Won\'t yellow or degrade',
              'Antimicrobial - Prevents mold/mildew'
            ]
          },
          {
            title: 'Performance Features',
            items: [
              'Soft Underfoot - Even at high temperatures',
              'Same Material - Used in $2M spa installations',
              '10-Year Warranty - Against delamination',
              'Zero Maintenance - Just mop clean',
              'No Refinishing - Ever needed',
              'Chemical Resistant - Any cleaner safe'
            ]
          }
        ]
      },
      {
        type: 'feature-cards',
        items: [
          {
            title: 'Commercial Spa-Grade Material',
            image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/689eca8d1ef51b7794589ebd.jpeg',
            text: '3mm thickness, rated -40°F to 200°F. Same material used in $2M spa installations. Soft underfoot even at high temperatures.'
          },
          {
            title: 'Maintenance: Just Mop',
            image: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6de916f4ccf63c46c1.jpeg',
            text: 'No special cleaners, no resealing, no refinishing. Wipe clean with any household cleaner. 10-year warranty against delamination.'
          }
        ]
      },
      {
        type: 'comparison',
        title: 'The $50K Lesson We Learned',
        text: 'After replacing 47 rotted wood floors in competitor saunas, we engineered this solution. Zero maintenance. Zero rot. Zero callbacks. Your grandkids will use this floor.'
      }
    ]
  },
  lighting: {
    title: 'The Glow That Transforms Everything',
    subtitle: '3000K warm white LED creates the ambiance that makes people stay longer, relax deeper, and book again.',
    mainImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6da6e2ac105564b218.jpeg',
    sections: [
      {
        type: 'feature-cards',
        items: [
          {
            icon: 'sun',
            title: '3000K Color Temperature',
            text: 'Same as sunset - triggers natural relaxation response'
          },
          {
            icon: 'lightning',
            title: '12W Total Consumption',
            text: 'Costs less than $5/year to operate daily'
          },
          {
            icon: 'shield',
            title: 'IP65 Waterproof',
            text: 'Sealed against steam and moisture'
          },
          {
            icon: 'clock',
            title: '50,000 Hour Lifespan',
            text: '17 years at 8 hours daily use'
          }
        ]
      },
      {
        type: 'installation-features',
        title: 'Installation & Control',
        items: [
          {
            title: 'Under-Bench Mounting',
            text: 'Strategic placement creates an indirect glow that eliminates harsh shadows and glare, wrapping you in warm ambiance'
          },
          {
            title: 'Dimmable System',
            text: 'Adjust from bright reading light to candlelight romance with the touch of a button. Sets the perfect mood every time'
          }
        ]
      },
      {
        type: 'specs-list',
        title: 'Technical Specifications',
        items: [
          'LED Type: 3000K warm white strips, commercial grade',
          'Power Consumption: 12W total system draw',
          'Lifespan: 50,000 hours (25+ years of daily use)',
          'CRI: 95+ (museum-quality color rendering)',
          'Controls: Optional WiFi dimming via app',
          'Installation: Pre-wired, plug-and-play system'
        ]
      }
    ]
  },
  heater: {
    title: 'The Heart of Your Sauna',
    subtitle: 'HUUM DROP 9 kW - Where Finnish engineering meets Red Dot design',
    award: 'Red Dot Design Award Winner',
    awardText: 'Recognized globally for melding revolutionary aesthetics with uncompromising performance',
    mainImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb49eefde6142a736f7c.jpeg',
    gallery: [
      'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887ec6d7377cfc90c8828f9.jpeg',
      'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb480049a5af45ea7a26.jpeg'
    ],
    sections: [
      {
        type: 'problem-solution',
        problem: {
          title: 'Why 97% of Sauna Heaters Fail You',
          items: [
            {
              title: 'Element Exposure',
              text: 'Typical heaters expose elements, creating hot spots and harsh, dry heat that burns your sinuses'
            },
            {
              title: 'Poor Stone Capacity',
              text: 'Most heaters hold 40-60 lbs of stones—not enough for proper löyly (the steamy, gentle heat of authentic saunas)'
            },
            {
              title: 'Cheap Controls',
              text: 'Basic thermostats with poor accuracy. No app control. Mechanical timers that break within 2 years'
            },
            {
              title: 'No Safety Features',
              text: 'Exposed elements = burn risk. No overheat protection. No child safety locks'
            }
          ]
        },
        solution: {
          title: 'The HUUM Engineering Advantage',
          items: [
            {
              title: '122 lbs of Olivine Diabase Stones',
              text: 'Massive thermal mass creates gentle, enveloping heat with luxurious steam—like a wood-fired sauna'
            },
            {
              title: 'Hidden Elements Protected by Stone Chamber',
              text: 'No direct infrared exposure. Even heat distribution. Perfect humidity balance'
            },
            {
              title: 'WiFi Enabled with UKU App Control',
              text: 'Start from anywhere. Schedule sessions. Energy monitoring. OTA updates'
            },
            {
              title: 'Triple Safety Systems',
              text: 'Overheat protection, timer limits, child lock—all UL and CSA certified'
            }
          ]
        }
      },
      {
        type: 'specs',
        title: 'Technical Specifications',
        items: [
          'Power: 9 kW / 240V / 40A',
          'Room Size: 280-530 cubic feet',
          'Heat Time: 176°F in 45 minutes',
          'Stone Capacity: 122 lbs',
          'Warranty: 5 years parts & labor'
        ]
      }
    ]
  },
  control: {
    title: 'Start Your Sauna From Anywhere',
    subtitle: 'WiFi control: Start your sauna from bed, work or the ski hill',
    mainImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/68aafb46622ad160dd29c5ca.png',
    sections: [
      {
        type: 'feature-cards',
        items: [
          {
            icon: 'smartphone',
            title: 'Remote Start',
            text: 'Begin heating from work, ready when you arrive'
          },
          {
            icon: 'calendar',
            title: 'Schedule Sessions',
            text: 'Set weekly routines, never miss your ritual'
          },
          {
            icon: 'chart',
            title: 'Energy Monitoring',
            text: 'Track usage, optimize costs'
          },
          {
            icon: 'bell',
            title: 'Safety Alerts',
            text: 'Notifications if door left open or overheating'
          },
          {
            icon: 'thermometer',
            title: 'Precision Control',
            text: '±1°F accuracy, dial in your perfect temperature'
          },
          {
            icon: 'users',
            title: 'Multi-User Profiles',
            text: 'Each family member gets their ideal settings'
          }
        ]
      },
      {
        type: 'app-download',
        title: 'Download the App',
        subtitle: 'Available on all platforms',
        appStore: 'https://apps.apple.com/app/huum',
        googlePlay: 'https://play.google.com/store/apps/details?id=com.huum'
      },
      {
        type: 'how-it-works',
        title: 'How It Actually Works',
        steps: [
          'Your heater connects to your home WiFi network',
          'Control via app from anywhere with internet',
          'No monthly fees, no subscriptions ever',
          'Works even if internet goes down (local control)'
        ]
      },
      {
        type: 'testimonials',
        title: 'Real Stories From Real Owners',
        items: [
          {
            quote: 'I start it from my office downtown. By the time I\'m home and changed, it\'s at perfect temperature.',
            author: 'Michael K., Vancouver'
          },
          {
            quote: 'The scheduling feature changed everything. Monday, Wednesday, Friday at 6 AM—automatically.',
            author: 'Sarah L., Whistler'
          },
          {
            quote: 'Energy monitoring showed us we spend less than $20/month running it daily. Total game changer.',
            author: 'The Johnsons, Richmond'
          }
        ]
      }
    ]
  },
  gauge: {
    title: 'Precision Since 1945',
    subtitle: 'The Rolex of sauna gauges',
    mainImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48e9d6715de23bf29a.jpeg',
    sections: [
      {
        type: 'fischer-legacy',
        title: 'The Fischer Legacy',
        text: 'Aircraft engineer Kurt Fischer founded the company in Drebach, Germany. Three generations later, each gauge is still hand-calibrated by master technicians.',
        items: [
          {
            value: '1945',
            label: 'Company founded in the Erzgebirge mountains'
          },
          {
            value: 'Zero',
            label: 'Electronics or batteries - purely mechanical'
          },
          {
            value: '±1°C',
            label: 'Temperature accuracy maintained for life'
          },
          {
            value: '130mm',
            label: 'Stainless steel case, readable through steam'
          }
        ]
      },
      {
        type: 'model-features',
        title: 'Model 197.01 Features',
        items: [
          'Thermometer: 30-120°C range with 1°C graduations',
          'Hygrometer: 0-100% relative humidity',
          'Case: Marine-grade stainless steel, sealed against steam',
          'Movement: Bimetal coil (temperature), synthetic hair (humidity)',
          'Calibration: Factory set, no adjustment needed for life'
        ]
      },
      {
        type: 'quote',
        text: 'We could include a $20 gauge and pocket the difference. But when you\'re creating an heirloom sauna, you don\'t cut corners on the instruments that define the experience.',
        author: 'Jordan Klein, Ilio Founder'
      }
    ]
  },
  timer: {
    title: 'The Original Sauna Timer',
    subtitle: 'Because some traditions shouldn\'t be improved',
    mainImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb480049a59ba2ea7a25.jpeg',
    sections: [
      {
        type: 'specs',
        title: 'Specifications',
        items: [
          'Duration: 15 minutes',
          'Frame: Heat-treated hardwood',
          'Sand: White silica, precision-measured',
          'Mount: Rotating wall bracket'
        ]
      },
      {
        type: 'philosophy',
        title: 'Why 15 Minutes?',
        text: 'Research shows 15-20 minute heat exposure optimizes cardiovascular benefits. Our timer marks three 5-minute intervals, letting you pace sessions perfectly. Flip once for beginners, twice for regular users, three times for heat-adapted athletes.'
      }
    ]
  },
  hooks: {
    title: 'Details That Outlast Everything',
    subtitle: 'Marine-grade hardware that looks as good as it performs',
    mainImage: 'https://storage.googleapis.com/msgsndr/GCSgKFx6fTLWG5qmWqeN/media/6887eb48a6e2ac5b4164b058.jpeg',
    sections: [
      {
        type: 'commercial-specs',
        title: 'Commercial-Grade Specifications',
        items: [
          {
            spec: '316 Stainless Steel',
            detail: 'Same grade used in surgical instruments and yacht fittings'
          },
          {
            spec: 'Matte Black Powder Coat',
            detail: 'Baked at 400°F for a finish that won\'t chip, fade, or corrode'
          },
          {
            spec: '50 lb Load Rating',
            detail: 'Each hook tested to 3x working load'
          },
          {
            spec: 'Through-Bolt Mounting',
            detail: 'Not screws—these will never pull out or loosen'
          },
          {
            spec: '6 Double Hooks Included',
            detail: 'Enough for robes, towels, and accessories for 4 people'
          }
        ]
      },
      {
        type: 'detail',
        title: 'The Difference Is In The Details',
        text: 'We use the same hardware spec\'d for yacht builders. Salt air, constant moisture, temperature swings—nothing affects these. Your towels might wear out, but these hooks never will.'
      },
      {
        type: 'quote',
        text: 'The black hardware makes this look like it belongs in a boutique hotel, not someone\'s backyard.',
        author: 'Sarah Chen, Airbnb Photography Specialist'
      }
    ]
  }
};