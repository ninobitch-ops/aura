export type Archetype = 
  | 'fintech'
  | 'fitness'
  | 'iot'
  | 'kanban'
  | 'ecommerce'
  | 'chat'
  | 'ai_studio'
  | 'music_synth'
  | 'notes_wiki'
  | 'food_delivery'
  | 'travel_planner'
  | 'general_dashboard';

export interface ParsedPromptAST {
  archetype: Archetype;
  title: string;
  tagline: string;
  features: string[];
  entities: string[];
  themeColors: {
    primary: string;
    secondary: string;
    accent: string;
    bgDark: string;
    bgCard: string;
    textPrimary: string;
  };
  components: string[];
  actions: string[];
  initialStateSpec: Record<string, any>;
  hasAudio: boolean;
  hasCharts: boolean;
  hasTimer: boolean;
}

export function parsePromptToAST(prompt: string, userTheme?: string): ParsedPromptAST {
  const p = prompt.toLowerCase();

  let archetype: Archetype = 'general_dashboard';
  let title = 'AuraBot Application';
  let tagline = 'Prompt-Synthesized Program';
  let features = ['Interactive Dashboard', 'Real-Time State', 'Local Persistence', 'Responsive UI'];
  let entities = ['Items', 'Metrics', 'Events', 'Settings'];
  let components = ['Header', 'StatsOverview', 'DataGrid', 'ActionModal', 'SettingsDrawer'];
  let actions = ['Create', 'Update', 'Filter', 'Export', 'Toggle'];
  let hasAudio = false;
  let hasCharts = true;
  let hasTimer = false;

  if (p.includes('crypto') || p.includes('defi') || p.includes('wallet') || p.includes('token') || p.includes('trading') || p.includes('fintech') || p.includes('bank') || p.includes('invest') || p.includes('vault')) {
    archetype = 'fintech';
    title = 'AetherVault DeFi & Crypto Nexus';
    tagline = 'Decentralized Asset Management & Real-Time Trading Terminal';
    features = ['Live Multi-Chain Portfolio', 'Instant Token Swap Engine', 'Staking APY Calculator', 'Transaction Ledger', 'Market Depth Visualizer'];
    entities = ['Tokens', 'Transactions', 'StakingPools', 'Watchlist'];
    components = ['WalletBalanceCard', 'TokenSwapEngine', 'LivePriceChart', 'TransactionHistory', 'StakingYieldModal'];
    actions = ['SwapTokens', 'StakeAssets', 'SendTransaction', 'ToggleLiveFeed', 'FilterTimeframe'];
    hasCharts = true;
    hasAudio = true;
  } else if (p.includes('fit') || p.includes('workout') || p.includes('gym') || p.includes('health') || p.includes('run') || p.includes('exercise') || p.includes('calorie') || p.includes('hiit')) {
    archetype = 'fitness';
    title = 'PulseFit Pro Biometrics';
    tagline = 'High-Intensity Training & Biometric Performance Companion';
    features = ['Interactive HIIT Interval Timer', 'Workout Logbook & Set Tracker', 'Heart-Rate Zone Telemetry', 'Hydration & Calorie Rings', 'Weekly Goal Progress'];
    entities = ['Workouts', 'Exercises', 'Biometrics', 'Goals'];
    components = ['IntervalTimer', 'BiometricRings', 'WorkoutLogbook', 'ExerciseSelector', 'CalorieGraph'];
    actions = ['StartTimer', 'LogWorkout', 'AddHydration', 'ResetInterval', 'CompleteSet'];
    hasTimer = true;
    hasCharts = true;
    hasAudio = true;
  } else if (p.includes('smart home') || p.includes('iot') || p.includes('thermostat') || p.includes('sensor') || p.includes('device') || p.includes('lighting') || p.includes('automation')) {
    archetype = 'iot';
    title = 'OmniGrid Smart IoT Hub';
    tagline = 'Futuristic Environmental & Smart Home Control Center';
    features = ['Interactive Room Light Matrix', 'Radial Climate & HVAC Thermostat', 'Solar & Energy Telemetry', 'Security Camera & Lock Toggles', 'Automated Routine Triggers'];
    entities = ['Rooms', 'Devices', 'Routines', 'EnergyLogs'];
    components = ['FloorPlanGrid', 'RadialThermostat', 'DeviceToggleCard', 'EnergyGraph', 'RoutineTriggerList'];
    actions = ['ToggleDevice', 'AdjustTemperature', 'ActivateRoutine', 'LockSecurity', 'ChangeScene'];
    hasCharts = true;
    hasAudio = true;
  } else if (p.includes('kanban') || p.includes('task') || p.includes('todo') || p.includes('project') || p.includes('scrum') || p.includes('agile') || p.includes('sprint') || p.includes('board')) {
    archetype = 'kanban';
    title = 'CyberSprint Agile Matrix';
    tagline = 'High-Velocity Project Management & Sprint Telemetry';
    features = ['Drag & Drop Kanban Columns', 'Task Creation Modal with Tags', 'Sprint Velocity & Burndown', 'Priority & Assignee Badges', 'Filter & Search Bar'];
    entities = ['Tasks', 'Columns', 'Sprints', 'TeamMembers'];
    components = ['KanbanBoard', 'TaskCard', 'NewTaskModal', 'SprintBurndown', 'FilterBar'];
    actions = ['MoveTask', 'CreateTask', 'DeleteTask', 'SetPriority', 'FilterTasks'];
    hasCharts = true;
    hasAudio = true;
  } else if (p.includes('shop') || p.includes('ecommerce') || p.includes('store') || p.includes('sneaker') || p.includes('product') || p.includes('cart') || p.includes('buy') || p.includes('drop')) {
    archetype = 'ecommerce';
    title = 'Apex HypeDrop E-Commerce';
    tagline = 'Limited Edition Streetwear & Tech Vault';
    features = ['Live Drop Countdown Timer', 'Interactive 3D Product Showcase', 'Dynamic Size & Color Selector', 'Sliding Cart Drawer with Promo Codes', 'One-Click Checkout Simulator'];
    entities = ['Products', 'CartItems', 'Sizes', 'Orders'];
    components = ['ProductHero', 'ProductGrid', 'SizeSelector', 'CartDrawer', 'CheckoutModal'];
    actions = ['AddToCart', 'RemoveFromCart', 'SelectSize', 'ApplyPromo', 'ProcessOrder'];
    hasTimer = true;
    hasCharts = false;
    hasAudio = true;
  } else if (p.includes('chat') || p.includes('message') || p.includes('social') || p.includes('messenger') || p.includes('dm') || p.includes('discord') || p.includes('voice note')) {
    archetype = 'chat';
    title = 'OmniChat Nexus Protocols';
    tagline = 'Next-Gen Encrypted Voice & Direct Communications';
    features = ['Channel & Direct Message Switching', 'Audio Waveform Voice Note Simulator', 'Emoji Reactions & Attachments', 'Active User Presence & Typing Status', 'Message Search & Pinned Posts'];
    entities = ['Channels', 'Messages', 'Users', 'Attachments'];
    components = ['SidebarChannelList', 'ChatWindow', 'MessageBubble', 'VoiceRecorderBar', 'UserPresencePanel'];
    actions = ['SendMessage', 'SendVoiceNote', 'AddReaction', 'SwitchChannel', 'SearchMessages'];
    hasAudio = true;
    hasCharts = false;
  } else if (p.includes('music') || p.includes('synth') || p.includes('audio') || p.includes('sound') || p.includes('beat') || p.includes('piano') || p.includes('drum')) {
    archetype = 'music_synth';
    title = 'NeonWave Synthesizer & Beat Lab';
    tagline = 'Web Audio Multi-Oscillator & Drum Step Sequencer';
    features = ['Real-time Web Audio Synthesizer Keys', '16-Step Beat Drum Sequencer', 'Filter Cutoff & Resonance Dials', 'Preset Waveform Selectors (Sine, Saw, Square)', 'Record & Loop Playback'];
    entities = ['Steps', 'Patterns', 'Presets', 'Tracks'];
    components = ['SynthesizerKeyboard', 'DrumSequencerGrid', 'KnobControls', 'WaveformVisualizer', 'TransportControls'];
    actions = ['PlayNote', 'ToggleStep', 'ChangeBPM', 'SwitchWaveform', 'StartSequencer'];
    hasAudio = true;
    hasCharts = true;
  } else if (p.includes('note') || p.includes('wiki') || p.includes('document') || p.includes('journal') || p.includes('memo') || p.includes('write')) {
    archetype = 'notes_wiki';
    title = 'NeuroNote Second Brain Wiki';
    tagline = 'Bi-Directional Knowledge Graph & Markdown Journal';
    features = ['Markdown Editor with Live Preview', 'Interactive Graph View Knowledge Map', 'Tagging & Folder Hierarchy', 'Quick Search & Fuzzy Finder', 'Pinned Notes & Auto-Save'];
    entities = ['Notes', 'Tags', 'Folders', 'Links'];
    components = ['NoteListSidebar', 'MarkdownEditor', 'GraphVisualizer', 'TagFilter', 'NewNoteModal'];
    actions = ['CreateNote', 'SaveNote', 'DeleteNote', 'ToggleGraph', 'SearchNotes'];
    hasCharts = true;
  } else if (p.includes('food') || p.includes('recipe') || p.includes('restaurant') || p.includes('delivery') || p.includes('meal')) {
    archetype = 'food_delivery';
    title = 'CyberBite Gourmet Delivery';
    tagline = 'Hyper-Fast Drone Delivery & Artisanal Kitchens';
    features = ['Live Drone Delivery Map Tracker', 'Menu Customizer & Dietary Filters', 'Nutrition & Macro Counter', 'Interactive Cart & Tip Calculator', 'Order Status Timeline'];
    entities = ['Restaurants', 'MenuItems', 'Orders', 'Cart'];
    components = ['MenuGrid', 'DietaryFilter', 'DroneMapTracker', 'OrderSummaryDrawer', 'MacroBreakdown'];
    actions = ['AddItem', 'ApplyFilter', 'TrackOrder', 'Checkout', 'RateDelivery'];
    hasCharts = false;
    hasAudio = true;
  } else if (p.includes('travel') || p.includes('trip') || p.includes('flight') || p.includes('hotel') || p.includes('itinerary')) {
    archetype = 'travel_planner';
    title = 'Horizon Odyssey Travel Planner';
    tagline = 'Smart Itinerary Architect & Multi-City Navigator';
    features = ['Interactive Day-by-Day Itinerary Builder', 'Budget & Expense Currency Converter', 'Interactive Destination Map Pinboard', 'Packing Checklist & Weather Forecast', 'Flight & Hotel Reservation Cards'];
    entities = ['Trips', 'ItineraryDays', 'Expenses', 'Checklist'];
    components = ['TripOverview', 'ItineraryTimeline', 'ExpenseTracker', 'PackingChecklist', 'DestinationCards'];
    actions = ['AddActivity', 'AddExpense', 'ToggleChecklist', 'SwitchDay', 'ExportItinerary'];
    hasCharts = true;
  }

  // Theme colors
  const themeColors = {
    primary: '#00F0FF', // Electric Cyan
    secondary: '#2563EB', // Cobalt Blue
    accent: '#A855F7', // Neon Purple
    bgDark: '#090D16',
    bgCard: '#0F172A',
    textPrimary: '#F8FAFC',
  };

  if (userTheme === 'neon-purple') {
    themeColors.primary = '#A855F7';
    themeColors.secondary = '#EC4899';
    themeColors.accent = '#00F0FF';
  } else if (userTheme === 'emerald-matrix') {
    themeColors.primary = '#10B981';
    themeColors.secondary = '#059669';
    themeColors.accent = '#34D399';
  } else if (userTheme === 'sunset-amber') {
    themeColors.primary = '#F59E0B';
    themeColors.secondary = '#EF4444';
    themeColors.accent = '#8B5CF6';
  } else if (userTheme === 'cobalt-blue') {
    themeColors.primary = '#3B82F6';
    themeColors.secondary = '#1D4ED8';
    themeColors.accent = '#06B6D4';
  }

  return {
    archetype,
    title,
    tagline,
    features,
    entities,
    themeColors,
    components,
    actions,
    initialStateSpec: {},
    hasAudio,
    hasCharts,
    hasTimer,
  };
}
