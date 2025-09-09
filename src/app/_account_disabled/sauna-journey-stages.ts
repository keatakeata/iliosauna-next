// LUXURY SAUNA DELIVERY JOURNEY STAGES
// Based on high-end outdoor sauna companies like Finnleo, Almost Heaven, etc.

export interface JourneyStage {
  id: string;
  name: string;
  description: string;
  duration: string;
  content: {
    title: string;
    subtitle: string;
    videoPlaceholder?: string;
    features: string[];
    nextSteps?: string[];
    estimatedDate?: string;
  };
  icon: string;
  color: string;
}

export const SAUNA_JOURNEY_STAGES: JourneyStage[] = [
  {
    id: 'order-confirmed',
    name: 'Order Confirmed',
    description: 'Your luxury sauna order has been received and confirmed',
    duration: '1-2 days',
    content: {
      title: 'Welcome to Your Sauna Journey',
      subtitle: 'Your order is confirmed and we\'re preparing to begin crafting your custom sauna',
      features: [
        'Order details reviewed and confirmed',
        'Custom specifications documented',
        'Dedicated project manager assigned',
        'Material sourcing initiated'
      ],
      nextSteps: [
        'Design team will review your specifications',
        'Material selection and quality check',
        'Production scheduling'
      ]
    },
    icon: 'CheckCircle2',
    color: '#059669'
  },
  {
    id: 'design-finalization',
    name: 'Design & Planning',
    description: 'Our craftsmen are finalizing your custom sauna design',
    duration: '3-5 days',
    content: {
      title: 'Crafting Your Perfect Design',
      subtitle: 'Our master craftsmen are creating detailed plans for your custom sauna',
      videoPlaceholder: 'design-process-video.mp4',
      features: [
        'Custom blueprints created',
        'Wood selection and grading',
        'Hardware specifications finalized',
        'Quality control checkpoints established'
      ],
      nextSteps: [
        'Final design approval',
        'Material procurement',
        'Production queue scheduling'
      ]
    },
    icon: 'Compass',
    color: '#0891b2'
  },
  {
    id: 'material-sourcing',
    name: 'Premium Material Sourcing',
    description: 'Selecting and preparing the finest Canadian cedar and components',
    duration: '1-2 weeks',
    content: {
      title: 'Sourcing Premium Materials',
      subtitle: 'We\'re handpicking the finest Canadian cedar and premium components for your sauna',
      videoPlaceholder: 'lumber-mill-video.mp4',
      features: [
        'Grade-A Canadian cedar selection',
        'Premium hardware procurement',
        'Insulation materials prepared',
        'Electrical components tested'
      ],
      nextSteps: [
        'Materials delivered to workshop',
        'Final quality inspection',
        'Production begins'
      ]
    },
    icon: 'TreePine',
    color: '#65a30d'
  },
  {
    id: 'manufacturing',
    name: 'Handcrafted Manufacturing',
    description: 'Your sauna is being expertly crafted by our master builders',
    duration: '3-6 weeks',
    content: {
      title: 'Master Craftsmanship in Action',
      subtitle: 'Watch as skilled artisans handcraft your luxury outdoor sauna',
      videoPlaceholder: 'manufacturing-process-video.mp4',
      features: [
        'Precision cutting and milling',
        'Expert joinery and assembly',
        'Quality control at each stage',
        'Custom finishing applied'
      ],
      nextSteps: [
        'Final assembly completion',
        'Quality assurance testing',
        'Packaging preparation'
      ]
    },
    icon: 'Hammer',
    color: '#dc2626'
  },
  {
    id: 'quality-control',
    name: 'Quality Assurance',
    description: 'Final inspection and testing to ensure perfection',
    duration: '2-3 days',
    content: {
      title: 'Ensuring Perfection',
      subtitle: 'Every detail is inspected to meet our luxury standards',
      features: [
        'Comprehensive quality inspection',
        'Structural integrity testing',
        'Finish quality verification',
        'Hardware functionality check'
      ],
      nextSteps: [
        'Packaging for shipment',
        'Shipping documentation',
        'Delivery coordination'
      ]
    },
    icon: 'Shield',
    color: '#7c3aed'
  },
  {
    id: 'shipping-preparation',
    name: 'Shipping Preparation',
    description: 'Carefully packaging and preparing for secure transport',
    duration: '1-2 days',
    content: {
      title: 'Preparing for Safe Delivery',
      subtitle: 'Your sauna is being carefully packaged for secure transport',
      features: [
        'Protective packaging applied',
        'Shipping labels and documentation',
        'Carrier coordination completed',
        'Tracking information generated'
      ],
      nextSteps: [
        'Pickup by freight carrier',
        'In-transit monitoring',
        'Delivery scheduling'
      ]
    },
    icon: 'Package',
    color: '#ea580c'
  },
  {
    id: 'in-transit',
    name: 'In Transit',
    description: 'Your sauna is on its way to you',
    duration: '3-10 days',
    content: {
      title: 'Your Sauna is Coming Home',
      subtitle: 'Track your sauna\'s journey to your doorstep',
      features: [
        'Real-time GPS tracking',
        'Delivery updates and notifications',
        'Protected freight handling',
        'Weather monitoring'
      ],
      nextSteps: [
        'Delivery appointment scheduling',
        'Site preparation guidance',
        'Installation team coordination'
      ],
      estimatedDate: 'Will be calculated based on shipping'
    },
    icon: 'Truck',
    color: '#0891b2'
  },
  {
    id: 'delivery-scheduled',
    name: 'Delivery Scheduled',
    description: 'Delivery appointment confirmed - prepare for arrival',
    duration: '1-3 days',
    content: {
      title: 'Almost There!',
      subtitle: 'Your delivery has been scheduled - here\'s what to expect',
      features: [
        'Confirmed delivery date and time',
        'Site preparation checklist',
        'Installation team assigned',
        'Final coordination complete'
      ],
      nextSteps: [
        'Prepare delivery site',
        'Ensure access for freight truck',
        'Installation team arrival'
      ],
      estimatedDate: 'Confirmed delivery date will show here'
    },
    icon: 'Calendar',
    color: '#dc2626'
  },
  {
    id: 'delivered',
    name: 'Delivered',
    description: 'Your sauna has arrived and is ready for installation',
    duration: 'Same day',
    content: {
      title: 'Your Sauna Has Arrived!',
      subtitle: 'Professional installation begins immediately',
      features: [
        'Sauna components delivered safely',
        'Professional installation team on-site',
        'Quality check of all components',
        'Installation process begins'
      ],
      nextSteps: [
        'Foundation preparation',
        'Assembly and installation',
        'Final testing and commissioning'
      ]
    },
    icon: 'Home',
    color: '#059669'
  },
  {
    id: 'installation',
    name: 'Professional Installation',
    description: 'Expert installation and setup of your luxury sauna',
    duration: '4-8 hours',
    content: {
      title: 'Professional Installation in Progress',
      subtitle: 'Our certified installers are setting up your sauna',
      videoPlaceholder: 'installation-process-video.mp4',
      features: [
        'Foundation and base preparation',
        'Structural assembly',
        'Electrical connections',
        'Final calibration and testing'
      ],
      nextSteps: [
        'System testing and commissioning',
        'Customer walkthrough',
        'Warranty registration'
      ]
    },
    icon: 'Wrench',
    color: '#7c3aed'
  },
  {
    id: 'completed',
    name: 'Installation Complete',
    description: 'Your luxury sauna is ready to enjoy!',
    duration: 'Complete',
    content: {
      title: 'Welcome to Your New Sauna Experience!',
      subtitle: 'Your luxury outdoor sauna is ready for you to enjoy',
      features: [
        'Complete installation and testing',
        'Customer training and walkthrough',
        'Warranty documentation provided',
        'Care and maintenance guide included'
      ],
      nextSteps: [
        'Enjoy your new sauna!',
        'Follow maintenance schedule',
        'Contact us for any questions'
      ]
    },
    icon: 'Award',
    color: '#059669'
  }
];

// Helper function to get current stage
export function getCurrentStage(orderStatus: string): JourneyStage {
  const statusMapping: { [key: string]: string } = {
    'pending': 'order-confirmed',
    'confirmed': 'design-finalization',
    'processing': 'manufacturing',
    'manufacturing': 'manufacturing',
    'quality-check': 'quality-control',
    'ready-to-ship': 'shipping-preparation',
    'shipped': 'in-transit',
    'out-for-delivery': 'delivery-scheduled',
    'delivered': 'delivered',
    'installing': 'installation',
    'completed': 'completed'
  };

  const stageId = statusMapping[orderStatus] || 'order-confirmed';
  return SAUNA_JOURNEY_STAGES.find(stage => stage.id === stageId) || SAUNA_JOURNEY_STAGES[0];
}

// Helper function to get stage progress
export function getStageProgress(orderStatus: string): number {
  const currentStage = getCurrentStage(orderStatus);
  const currentIndex = SAUNA_JOURNEY_STAGES.findIndex(stage => stage.id === currentStage.id);
  return ((currentIndex + 1) / SAUNA_JOURNEY_STAGES.length) * 100;
}