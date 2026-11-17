export interface AssemblyStage {
  id: string;
  index: string;
  name: string;
  shortLabel: string;
  subtitle: string;
  description: string;
  startProgress: number;
  endProgress: number;
  focusFrame: number;
  metrics: Array<{ label: string; value: string }>;
  hotspot: {
    xPercent: number;
    yPercent: number;
    label: string;
    detail: string;
  };
}

export interface InternalComponent {
  id: string;
  index: string;
  title: string;
  category: string;
  summary: string;
  engineeringNote: string;
  specs: Array<{ label: string; value: string }>;
  stageId: string;
  span?: 'wide' | 'standard';
}

export interface PlatformProfile {
  id: 'desktop' | 'laptop';
  name: string;
  tagline: string;
  chip: string;
  memory: string;
  aiTops: string;
  powerEnvelope: string;
  benchmarks: Array<{
    workload: string;
    blackwellValue: number;
    prevGenValue: number;
    unit: string;
    deltaLabel: string;
  }>;
}

export const TOTAL_VIDEO_FRAMES = 240;

export const ASSEMBLY_STAGES: AssemblyStage[] = [
  {
    id: 'exploded-overview',
    index: '01',
    name: 'Full Exploded Stack',
    shortLabel: 'Exploded',
    subtitle: 'Four-tier precision chassis architecture',
    description:
      'Every millimeter from the CNC-machined die-cast frame to the triple-axial shroud is aligned along a unified vertical thermal axis, separating structural load from airflow channels.',
    startProgress: 0.0,
    endProgress: 0.18,
    focusFrame: 0,
    metrics: [
      { label: 'Total Layers', value: '4 Subsystems' },
      { label: 'Slot Footprint', value: '3.8-Slot' },
      { label: 'Chassis Rigidity', value: '+42% Stiffness' },
    ],
    hotspot: {
      xPercent: 61,
      yPercent: 52,
      label: 'Vertical Stack Alignment',
      detail: 'Die-cast frame, 14-layer PCB, vapor chamber & quad-fan shroud',
    },
  },
  {
    id: 'backplate-pcb',
    index: '02',
    name: 'Backplate & 14-Layer PCB',
    shortLabel: 'PCB & Die',
    subtitle: 'GB202 silicon paired with 32GB GDDR7',
    description:
      'The vented aluminum backplate seats beneath a custom high-density 14-layer PCB featuring the 92.2B-transistor GB202 Blackwell die, 16 GDDR7 modules, and 24+4 phase power delivery.',
    startProgress: 0.18,
    endProgress: 0.42,
    focusFrame: 66,
    metrics: [
      { label: 'Transistor Count', value: '92.2 Billion' },
      { label: 'Memory Bandwidth', value: '1,792 GB/s' },
      { label: 'VRM Architecture', value: '24+4 Phase' },
    ],
    hotspot: {
      xPercent: 60,
      yPercent: 63,
      label: 'GB202 Blackwell Die',
      detail: 'TSMC 4NP custom node · 21,760 CUDA cores · PCIe 5.0 x16',
    },
  },
  {
    id: 'vapor-chamber',
    index: '03',
    name: 'Vapor Chamber & Heatpipes',
    shortLabel: 'Vapor Chamber',
    subtitle: 'Phase-change copper coldplate thermal bridge',
    description:
      'A precision-milled copper vapor chamber with integrated phase-change thermal pad mates directly to the GB202 die and GDDR7 array, routing heat across eight sintered copper heatpipes.',
    startProgress: 0.42,
    endProgress: 0.65,
    focusFrame: 118,
    metrics: [
      { label: 'Copper Heatpipes', value: '8× 6mm Sintered' },
      { label: 'Fin Surface Area', value: '2,480 cm²' },
      { label: 'Core Delta Reduction', value: '-6.4 °C' },
    ],
    hotspot: {
      xPercent: 62,
      yPercent: 57,
      label: 'Milled Copper Coldplate',
      detail: 'Direct die + VRAM contact with dual-circuit vapor diffusion',
    },
  },
  {
    id: 'axial-cooling',
    index: '04',
    name: 'Quad Axial-Tech Array',
    shortLabel: 'Cooling Array',
    subtitle: 'High-static-pressure dual-flow fan assembly',
    description:
      'Three front Axial-Tech fans paired with an opposing rear exhaust fan drive up to 20% higher airflow and static pressure through the dense heatsink fin stack at whisper-quiet RPM.',
    startProgress: 0.65,
    endProgress: 0.84,
    focusFrame: 158,
    metrics: [
      { label: 'Fan Configuration', value: '4× Axial-Tech' },
      { label: 'Airflow Gain', value: '+20% CFM' },
      { label: 'Acoustic Floor', value: '28.4 dBA' },
    ],
    hotspot: {
      xPercent: 58,
      yPercent: 39,
      label: 'Barrier-Ring Fan Blades',
      detail: 'Dual-ball bearings with 0dB passive stop below 50 °C',
    },
  },
  {
    id: 'final-shroud',
    index: '05',
    name: 'ROG Astral RTX 5090',
    shortLabel: 'Assembled',
    subtitle: 'Locked chassis & Aura Sync edge array',
    description:
      'The reinforced metal shroud locks down over the fin matrix, sealing the airflow tunnel and illuminating precision-diffused edge channels ready for 4K path tracing and local AI inference.',
    startProgress: 0.84,
    endProgress: 1.0,
    focusFrame: 224,
    metrics: [
      { label: 'AI Performance', value: '3,352 AI TOPS' },
      { label: 'Frame Multiplier', value: 'DLSS 4 MFG' },
      { label: 'Board Power', value: '575W TGP' },
    ],
    hotspot: {
      xPercent: 62,
      yPercent: 51,
      label: 'Complete Assembly',
      detail: '3× DisplayPort 2.1b · 2× HDMI 2.1b · 16-pin 12V-2x6',
    },
  },
];

export const INTERNAL_COMPONENTS: InternalComponent[] = [
  {
    id: 'gb202-die',
    index: '01',
    title: 'GB202 Blackwell Silicon Die',
    category: 'Compute Core',
    summary:
      'Custom 4NP silicon packing 5th-Gen Tensor Cores with native FP4 precision and 4th-Gen Ray Tracing Cores built for neural shaders and full path tracing.',
    engineeringNote:
      'Hardware flip-chip packaging sits flush within a protective stainless perimeter shim to maintain uniform mounting pressure across the 750mm² die.',
    specs: [
      { label: 'CUDA Cores', value: '21,760' },
      { label: 'AI Compute', value: '3,352 TOPS' },
      { label: 'Ray Tracing', value: '318 TFLOPS' },
      { label: 'Process Node', value: 'TSMC 4NP' },
    ],
    stageId: 'backplate-pcb',
    span: 'wide',
  },
  {
    id: 'gddr7-memory',
    index: '02',
    title: '32GB GDDR7 PAM3 Memory Subsystem',
    category: 'Memory Bus',
    summary:
      'Sixteen 28 Gbps GDDR7 modules across a wide 512-bit interface deliver 1.79 TB/s peak bandwidth for 4K neural textures and 70B-parameter local models.',
    engineeringNote:
      'PAM3 signaling doubles symbol efficiency over NRZ while cutting per-bit thermal dissipation inside the compact PCB footprint.',
    specs: [
      { label: 'Capacity', value: '32 GB GDDR7' },
      { label: 'Interface Width', value: '512-bit' },
      { label: 'Bandwidth', value: '1,792 GB/s' },
    ],
    stageId: 'backplate-pcb',
    span: 'standard',
  },
  {
    id: 'vapor-chamber-subsystem',
    index: '03',
    title: 'Patented Milled Vapor Chamber',
    category: 'Thermal Transfer',
    summary:
      'CNC-grooved channels inside the copper vapor chamber sit directly under eight sintered heatpipes, accelerating liquid-to-vapor phase cycling under sustained 575W loads.',
    engineeringNote:
      'Phase-change TIM replaces traditional paste to eliminate pump-out over thousands of thermal cycles.',
    specs: [
      { label: 'Coldplate', value: 'Pure Copper' },
      { label: 'Heatpipes', value: '8× Sintered' },
      { label: 'Thermal Delta', value: '-6.4 °C' },
    ],
    stageId: 'vapor-chamber',
    span: 'standard',
  },
  {
    id: 'power-delivery',
    index: '04',
    title: '24+4 Phase Digital VRM & PCB',
    category: 'Power Delivery',
    summary:
      'High-ampere MOSFET power stages paired with 2oz copper PCB planes and protective conformal coating stabilize transient spikes up to 600W.',
    engineeringNote:
      'Power Detector+ monitors per-pin 12V-2x6 current distribution in real time to prevent connector load imbalance.',
    specs: [
      { label: 'VRM Stages', value: '24+4 Phase' },
      { label: 'PCB Layers', value: '14-Layer 2oz' },
      { label: 'Power Input', value: '1× 12V-2x6' },
    ],
    stageId: 'backplate-pcb',
    span: 'standard',
  },
  {
    id: 'quad-axial',
    index: '05',
    title: 'Quad Axial-Tech Cooling Matrix',
    category: 'Aerodynamics',
    summary:
      'Three front intake fans synchronize with a fourth pass-through rear fan on the vented backplate, creating an unobstructed vertical pressure column.',
    engineeringNote:
      'Scaled-down fan hubs allow longer curved blades bounded by a structural barrier ring to focus downward static pressure.',
    specs: [
      { label: 'Fan Count', value: '4 Axial-Tech' },
      { label: 'Pressure Gain', value: '+20% CFM' },
      { label: 'Zero-RPM Mode', value: '< 50 °C' },
    ],
    stageId: 'axial-cooling',
    span: 'standard',
  },
];

export const PLATFORM_PROFILES: Record<'desktop' | 'laptop', PlatformProfile> = {
  desktop: {
    id: 'desktop',
    name: 'ROG Astral GeForce RTX 5090',
    tagline: 'Uncompromising 575W desktop flagship with 32GB GDDR7 and quad-fan vapor chamber cooling.',
    chip: 'GB202 · 21,760 CUDA Cores',
    memory: '32GB GDDR7 · 512-bit · 1,792 GB/s',
    aiTops: '3,352 AI TOPS (FP4)',
    powerEnvelope: '575W TGP · 3.8-Slot',
    benchmarks: [
      {
        workload: 'Cyberpunk 2077 · 4K Full Path Tracing + DLSS 4',
        blackwellValue: 242,
        prevGenValue: 112,
        unit: 'FPS',
        deltaLabel: '2.16× vs RTX 4090',
      },
      {
        workload: 'Blackwell Neural Rendering · Alan Wake 2 4K',
        blackwellValue: 218,
        prevGenValue: 98,
        unit: 'FPS',
        deltaLabel: '2.22× vs RTX 4090',
      },
      {
        workload: 'FLUX.1 FP4 Image Synthesis (1024×1024)',
        blackwellValue: 3.8,
        prevGenValue: 8.6,
        unit: 'sec',
        deltaLabel: '2.26× Faster',
      },
      {
        workload: 'Blender Cycles Classroom Render',
        blackwellValue: 412,
        prevGenValue: 245,
        unit: 'samples/s',
        deltaLabel: '+68% Throughput',
      },
    ],
  },
  laptop: {
    id: 'laptop',
    name: 'Blackwell GeForce RTX 5090 Laptops',
    tagline: 'Max-Q Blackwell architecture bringing 24GB GDDR7 and DLSS 4 Multi-Frame Generation to ultra-thin 18mm chassis.',
    chip: 'GB203 · 10,496 CUDA Cores',
    memory: '24GB GDDR7 · 256-bit · 896 GB/s',
    aiTops: '1,824 AI TOPS (FP4)',
    powerEnvelope: '95W–175W Max-Q',
    benchmarks: [
      {
        workload: 'Cyberpunk 2077 · 1600p Path Tracing + DLSS 4',
        blackwellValue: 186,
        prevGenValue: 88,
        unit: 'FPS',
        deltaLabel: '2.11× vs RTX 4090 Laptop',
      },
      {
        workload: 'Unreal Engine 5.5 Lumen Viewport (4K)',
        blackwellValue: 134,
        prevGenValue: 69,
        unit: 'FPS',
        deltaLabel: '+94% Viewport Fluidity',
      },
      {
        workload: 'Local Llama-3 70B Quantized Token Stream',
        blackwellValue: 28.4,
        prevGenValue: 11.2,
        unit: 'tok/s',
        deltaLabel: '2.53× Inference Speed',
      },
      {
        workload: 'Max-Q Acoustic Power Efficiency',
        blackwellValue: 41,
        prevGenValue: 51,
        unit: 'dBA',
        deltaLabel: '-10 dBA Quieter',
      },
    ],
  },
};
