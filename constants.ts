export interface SamplePoint {
  name: string;
  status: 'Safe' | 'Unsafe' | 'Unknown';
  contaminants: string[]; // specific contaminants for this point if known, otherwise general
}

export interface WaterData {
  id: string;
  name: string; // English name
  nameUrdu: string; // Roman Urdu name approximation
  lat: number;
  lng: number;
  safePercentage: number;
  unsafePercentage: number;
  status: 'Safe' | 'Moderate' | 'Unsafe' | 'Unknown';
  contaminants: string[];
  description: string;
  samplePoints: SamplePoint[];
}

export const CITIES_DATA: WaterData[] = [
  {
    id: 'isb',
    name: 'Islamabad',
    nameUrdu: 'Islamabad',
    lat: 33.6844,
    lng: 73.0479,
    safePercentage: 71,
    unsafePercentage: 29,
    status: 'Moderate',
    contaminants: ['Bacteria', 'Iron'],
    description: '71% sources safe. Main issues are bacterial contamination and Iron.',
    samplePoints: [
      { name: 'Filtration Plant, F-6/1 (W. Supply)', status: 'Safe', contaminants: [] },
      { name: 'Tube Well No. 145, I-10/2 (T.Well)', status: 'Unsafe', contaminants: ['Bacteria'] },
      { name: 'Water Works, Simly Dam Road (W. Supply)', status: 'Safe', contaminants: [] },
      { name: 'Filtration Plant, G-9 Markaz (W. Supply)', status: 'Safe', contaminants: [] },
      { name: 'Tube Well, Blue Area (T.Well)', status: 'Safe', contaminants: [] },
      { name: 'Public Tap, Bhara Kahu (Tap)', status: 'Unsafe', contaminants: ['Bacteria', 'Iron'] },
      { name: 'Tube Well, Tarlai Kalan (T.Well)', status: 'Unsafe', contaminants: ['Bacteria'] },
      { name: 'Filtration Plant, Rawal Town (W. Supply)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'rwp',
    name: 'Rawalpindi',
    nameUrdu: 'Rawalpindi',
    lat: 33.5651,
    lng: 73.0169,
    safePercentage: 62,
    unsafePercentage: 38,
    status: 'Moderate',
    contaminants: ['Bacteria', 'Nitrate', 'Iron', 'TDS'],
    description: 'Moderate quality. Nitrate and bacterial issues found.',
    samplePoints: [
      { name: 'Muslim Town Haji Chowk (T. Well)', status: 'Unsafe', contaminants: ['TDS', 'Bacteria'] },
      { name: 'PAF Base, Minhas Camp (T. Well)', status: 'Unsafe', contaminants: ['Nitrate'] },
      { name: 'Raja Bazar, 64 TMA Office (T. Well)', status: 'Unsafe', contaminants: ['Iron'] },
      { name: 'Tanki, Saidpur Rd. (W. Supply)', status: 'Safe', contaminants: [] },
      { name: 'Dk. Kala Khan (T. Well)', status: 'Safe', contaminants: [] },
      { name: 'Football Grd. Westridge (T. Well)', status: 'Safe', contaminants: [] },
      { name: 'Military Hospital (T. Well)', status: 'Safe', contaminants: [] },
      { name: 'Hockey Stadium, Saddar (T. Well)', status: 'Safe', contaminants: [] },
      { name: 'Masjid, Dhamial Rd. (Bore)', status: 'Safe', contaminants: [] },
      { name: 'Mandi Morr (Public Tap)', status: 'Unsafe', contaminants: ['Bacteria', 'Nitrate'] },
      { name: 'Satellite Town (W. Supply)', status: 'Safe', contaminants: [] },
      { name: 'Bahria Town Phase 4 (T. Well)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'lhr',
    name: 'Lahore',
    nameUrdu: 'Lahore',
    lat: 31.5497,
    lng: 74.3436,
    safePercentage: 69,
    unsafePercentage: 31,
    status: 'Moderate',
    contaminants: ['Bacteria', 'Arsenic', 'Iron', 'TDS'],
    description: 'Mostly safe, but Arsenic and bacterial contamination are present in some areas.',
    samplePoints: [
      { name: 'Tube Well, Block H, Johar Town (T.Well)', status: 'Unsafe', contaminants: ['Arsenic'] },
      { name: 'Filtration Plant, Gulberg III (W. Supply)', status: 'Safe', contaminants: [] },
      { name: 'Tube Well, Karim Block, Iqbal Town (T.Well)', status: 'Safe', contaminants: [] },
      { name: 'Public Tap, Walled City (Tap)', status: 'Unsafe', contaminants: ['Bacteria', 'TDS'] },
      { name: 'Tube Well, DHA Phase 1 (T.Well)', status: 'Safe', contaminants: [] },
      { name: 'Water Works, Model Town (W. Supply)', status: 'Safe', contaminants: [] },
      { name: 'Tube Well, Samanabad (T.Well)', status: 'Unsafe', contaminants: ['Arsenic'] }
    ]
  },
  {
    id: 'mul',
    name: 'Multan',
    nameUrdu: 'Multan',
    lat: 30.1575,
    lng: 71.5249,
    safePercentage: 6,
    unsafePercentage: 94,
    status: 'Unsafe',
    contaminants: ['Bacteria', 'Arsenic', 'TDS'],
    description: 'Critically unsafe. High Arsenic and bacterial presence.',
    samplePoints: [
        { name: 'Chah Keemay Wala Opp. Zakaria University (H. Pump)', status: 'Unsafe', contaminants: ['Arsenic', 'TDS'] },
        { name: 'Bahauddin Zakaria University (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Punjab Police Line, Malital Road (T.Well)', status: 'Unsafe', contaminants: ['Bacteria'] },
        { name: 'Jamia Qasim ul Uloom Gul Gusht Colony (T.Well)', status: 'Unsafe', contaminants: ['Arsenic'] },
        { name: 'Jamia Masjid Bilal, Tariqabad (H. Pump)', status: 'Unsafe', contaminants: ['Bacteria'] },
        { name: 'Well -9, C-20, Pak Arab Fertilizer Corp (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'WAPDA (NGPS) Piran Ghaib (Well)', status: 'Safe', contaminants: [] },
        { name: 'Shah Rukan Alam Colony, G Block (W. Supply)', status: 'Unsafe', contaminants: ['Bacteria'] },
        { name: 'Nishter Hospital, Multan (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Well -1, Cantonment Board Metro Plaza (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Ch. Medical Store Basti Khudadad (H. Pump)', status: 'Unsafe', contaminants: ['Arsenic'] },
        { name: 'Munir Hotel Oppsite, Solkex Factory (H. Pump)', status: 'Unsafe', contaminants: ['Bacteria'] },
        { name: 'WAPDA Colony, Qasim Pur (T.Well)', status: 'Safe', contaminants: [] },
        { name: '132 KV Grid Station, Vehari Road (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Ismail Textile Mills (Pvt.) Ltd (H. Pump)', status: 'Unsafe', contaminants: ['TDS', 'Arsenic'] },
        { name: 'Lucky Linker Pesticide Company (H. Pump)', status: 'Unsafe', contaminants: ['TDS'] }
    ]
  },
  {
    id: 'khi',
    name: 'Karachi',
    nameUrdu: 'Karachi',
    lat: 24.8607,
    lng: 67.0011,
    safePercentage: 7,
    unsafePercentage: 93,
    status: 'Unsafe',
    contaminants: ['Bacteria', 'Fluoride', 'Chlorides', 'TDS', 'Turbidity', 'Hardness'],
    description: 'Critically unsafe. 93% samples contaminated.',
    samplePoints: [
      { name: 'Pumping Station, Clifton (W. Supply)', status: 'Unsafe', contaminants: ['TDS', 'Bacteria'] },
      { name: 'Filtration Plant, COD Hills (W. Supply)', status: 'Unsafe', contaminants: ['Bacteria'] },
      { name: 'Public Tap, Orangi Town (Tap)', status: 'Unsafe', contaminants: ['Bacteria'] },
      { name: 'Water Supply, Landhi (W. Supply)', status: 'Unsafe', contaminants: ['TDS'] },
      { name: 'Tube Well, Malir Cantt (T.Well)', status: 'Unsafe', contaminants: ['TDS'] },
      { name: 'Public Tap, Lyari (Tap)', status: 'Unsafe', contaminants: ['Bacteria', 'Turbidity'] },
      { name: 'Gulshan-e-Iqbal Block 13 (T.Well)', status: 'Unsafe', contaminants: ['Bacteria'] },
      { name: 'DHA Phase 5 (W. Supply)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'guj',
    name: 'Gujranwala',
    nameUrdu: 'Gujranwala',
    lat: 32.1603,
    lng: 74.1855,
    safePercentage: 50,
    unsafePercentage: 50,
    status: 'Moderate',
    contaminants: ['Bacteria'],
    description: 'Half of the sources are contaminated, primarily with bacteria.',
    samplePoints: [
      { name: 'Tube Well, Satellite Town (T.Well)', status: 'Safe', contaminants: [] },
      { name: 'Public Tap, Model Town (Tap)', status: 'Unsafe', contaminants: ['Bacteria'] },
      { name: 'Filtration Plant, Peoples Colony (W. Supply)', status: 'Safe', contaminants: [] },
      { name: 'City Center Main Bazar (Tap)', status: 'Unsafe', contaminants: ['Bacteria'] },
      { name: 'Tube Well, Wapda Town (T.Well)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'fsd',
    name: 'Faisalabad',
    nameUrdu: 'Faisalabad',
    lat: 31.4504,
    lng: 73.1350,
    safePercentage: 41,
    unsafePercentage: 59,
    status: 'Unsafe',
    contaminants: ['TDS', 'Iron', 'Chloride', 'Nitrate', 'Hardness', 'Bacteria', 'Fluoride'],
    description: 'Majority sources unsafe due to high TDS and chemical contamination.',
    samplePoints: [
      { name: 'Tube Well, Madina Town (T.Well)', status: 'Safe', contaminants: [] },
      { name: 'Public Tap, Peoples Colony No. 1 (Tap)', status: 'Unsafe', contaminants: ['TDS', 'Fluoride'] },
      { name: 'Tube Well, Ghulam Muhammad Abad (T.Well)', status: 'Unsafe', contaminants: ['Bacteria'] },
      { name: 'Water Supply, Samanabad (W. Supply)', status: 'Unsafe', contaminants: ['Hardness'] },
      { name: 'Filtration Plant, D-Ground (W. Supply)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'bwp',
    name: 'Bahawalpur',
    nameUrdu: 'Bahawalpur',
    lat: 29.3544,
    lng: 71.6911,
    safePercentage: 24,
    unsafePercentage: 76,
    status: 'Unsafe',
    contaminants: ['Bacteria', 'Arsenic', 'Iron', 'TDS', 'Turbidity', 'Hardness', 'Fluoride'],
    description: 'Highly unsafe. High levels of Arsenic and Iron reported.',
    samplePoints: [
        { name: 'Tube Well, Model Town A (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Public Tap, Satellite Town (Tap)', status: 'Unsafe', contaminants: ['Arsenic'] },
        { name: 'Cantt Water Supply (W. Supply)', status: 'Safe', contaminants: [] },
        { name: 'Hand Pump, Islami Colony (H. Pump)', status: 'Unsafe', contaminants: ['Bacteria'] },
        { name: 'Tube Well, One Unit Staff Colony (T.Well)', status: 'Unsafe', contaminants: ['TDS'] }
    ]
  },
  {
    id: 'gjt',
    name: 'Gujrat',
    nameUrdu: 'Gujrat',
    lat: 32.5731,
    lng: 74.0750,
    safePercentage: 100,
    unsafePercentage: 0,
    status: 'Safe',
    contaminants: [],
    description: 'Excellent water quality. All monitored sources were found safe.',
    samplePoints: [
        { name: 'Tube Well, City Area (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Water Supply, Small Industrial Estate (W. Supply)', status: 'Safe', contaminants: [] },
        { name: 'Tube Well, University of Gujrat (T.Well)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'kas',
    name: 'Kasur',
    nameUrdu: 'Kasur',
    lat: 31.1160,
    lng: 74.4463,
    safePercentage: 90,
    unsafePercentage: 10,
    status: 'Safe',
    contaminants: ['Bacteria', 'Turbidity'],
    description: 'Generally safe water, with minor bacterial issues.',
    samplePoints: [
        { name: 'Main Water Works, City Center (W. Supply)', status: 'Safe', contaminants: [] },
        { name: 'Public Tap, Khudian (Tap)', status: 'Unsafe', contaminants: ['Bacteria'] }
    ]
  },
  {
    id: 'sgd',
    name: 'Sargodha',
    nameUrdu: 'Sargodha',
    lat: 32.0836,
    lng: 72.6711,
    safePercentage: 17,
    unsafePercentage: 83,
    status: 'Unsafe',
    contaminants: ['Bacteria', 'Hardness', 'TDS', 'Chloride', 'Nitrate', 'Iron'],
    description: 'Very poor quality. High hardness and salinity (TDS).',
    samplePoints: [
        { name: 'Tube Well, Satellite Town (T.Well)', status: 'Unsafe', contaminants: ['TDS'] },
        { name: 'Water Supply, University Road (W. Supply)', status: 'Unsafe', contaminants: ['Hardness'] },
        { name: 'Cantt Area Water Works (W. Supply)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'skp',
    name: 'Sheikhupura',
    nameUrdu: 'Sheikhupura',
    lat: 31.7131,
    lng: 73.9783,
    safePercentage: 40,
    unsafePercentage: 60,
    status: 'Unsafe',
    contaminants: ['Bacteria', 'Nitrate', 'Hardness', 'TDS', 'Arsenic', 'Turbidity', 'Iron'],
    description: 'Unsafe. Contains various chemical contaminants and bacteria.',
    samplePoints: [
        { name: 'Tube Well, Housing Colony (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Public Tap, Bhikhi Road (Tap)', status: 'Unsafe', contaminants: ['Arsenic'] }
    ]
  },
  {
    id: 'skt',
    name: 'Sialkot',
    nameUrdu: 'Sialkot',
    lat: 32.4945,
    lng: 74.5229,
    safePercentage: 100,
    unsafePercentage: 0,
    status: 'Safe',
    contaminants: [],
    description: 'Excellent water quality. 100% safe samples.',
    samplePoints: [
        { name: 'Cantt Water Supply (W. Supply)', status: 'Safe', contaminants: [] },
        { name: 'Tube Well, City Area (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Water Works, Industrial Area (W. Supply)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'abt',
    name: 'Abbottabad',
    nameUrdu: 'Abbottabad',
    lat: 34.1688,
    lng: 73.2215,
    safePercentage: 45,
    unsafePercentage: 55,
    status: 'Unsafe',
    contaminants: ['Iron'],
    description: 'Unsafe mainly due to high Iron content.',
    samplePoints: [
        { name: 'Tube Well, Jinnahabad (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Public Tap, Mandian (Tap)', status: 'Unsafe', contaminants: ['Iron'] },
        { name: 'Water Supply, Kakul (W. Supply)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'man',
    name: 'Mangora (Swat)',
    nameUrdu: 'Mangora',
    lat: 34.7717,
    lng: 72.3602,
    safePercentage: 80,
    unsafePercentage: 20,
    status: 'Safe',
    contaminants: ['Iron'],
    description: 'Mostly safe, some issues with Iron.',
    samplePoints: [
        { name: 'Water Supply, Mingora City (W. Supply)', status: 'Safe', contaminants: [] },
        { name: 'Public Tap, Saidu Sharif (Tap)', status: 'Unsafe', contaminants: ['Iron'] }
    ]
  },
  {
    id: 'mdn',
    name: 'Mardan',
    nameUrdu: 'Mardan',
    lat: 34.1986,
    lng: 72.0404,
    safePercentage: 55,
    unsafePercentage: 45,
    status: 'Moderate',
    contaminants: ['Iron'],
    description: 'Moderate. Iron contamination is significant.',
    samplePoints: [
        { name: 'Public Tap, City Center (Tap)', status: 'Unsafe', contaminants: ['Iron'] },
        { name: 'Tube Well, Sheikh Maltoon Town (T.Well)', status: 'Safe', contaminants: [] }
    ]
  },
  {
    id: 'psh',
    name: 'Peshawar',
    nameUrdu: 'Peshawar',
    lat: 34.0151,
    lng: 71.5249,
    safePercentage: 50,
    unsafePercentage: 50,
    status: 'Moderate',
    contaminants: ['Iron'],
    description: 'Half of the sources affected by Iron contamination.',
    samplePoints: [
        { name: 'Tube Well, Hayatabad Phase 3 (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Water Supply, University Town (W. Supply)', status: 'Safe', contaminants: [] },
        { name: 'Public Tap, Saddar (Tap)', status: 'Unsafe', contaminants: ['Iron'] },
        { name: 'Tube Well, Gulbahar (T.Well)', status: 'Unsafe', contaminants: ['Bacteria'] }
    ]
  },
  {
    id: 'qta',
    name: 'Quetta',
    nameUrdu: 'Quetta',
    lat: 30.1798,
    lng: 66.9750,
    safePercentage: 35,
    unsafePercentage: 65,
    status: 'Unsafe',
    contaminants: ['Bacteria', 'Fluoride', 'Chloride', 'Hardness', 'TDS'],
    description: 'Critical. Fluoride and bacterial contamination are high.',
    samplePoints: [
        { name: 'Tube Well, Cantt (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Public Tap, Satellite Town (Tap)', status: 'Unsafe', contaminants: ['Fluoride'] },
        { name: 'Water Supply, Jinnah Town (W. Supply)', status: 'Safe', contaminants: [] },
        { name: 'Tube Well, Hazara Town (T.Well)', status: 'Unsafe', contaminants: ['Bacteria'] }
    ]
  },
  {
    id: 'hyd',
    name: 'Hyderabad',
    nameUrdu: 'Hyderabad',
    lat: 25.3960,
    lng: 68.3578,
    safePercentage: 20,
    unsafePercentage: 80,
    status: 'Unsafe',
    contaminants: ['Bacteria', 'Turbidity', 'Hardness', 'Chlorides', 'TDS'],
    description: 'Highly unsafe. Bacterial and chemical contamination widespread.',
    samplePoints: [
        { name: 'Filtration Plant, Qasimabad (W. Supply)', status: 'Unsafe', contaminants: ['Turbidity'] },
        { name: 'Public Tap, Latifabad Unit 6 (Tap)', status: 'Unsafe', contaminants: ['TDS'] },
        { name: 'Water Works, City Area (W. Supply)', status: 'Unsafe', contaminants: ['Bacteria'] }
    ]
  },
  {
    id: 'suk',
    name: 'Sukkur',
    nameUrdu: 'Sukkur',
    lat: 27.7131,
    lng: 68.8492,
    safePercentage: 33,
    unsafePercentage: 67,
    status: 'Unsafe',
    contaminants: ['Iron', 'Chloride', 'TDS', 'Hardness', 'Turbidity', 'Fluoride', 'Bacteria', 'Arsenic'],
    description: 'Unsafe. High Iron and TDS levels.',
    samplePoints: [
        { name: 'Tube Well, Barrage Colony (T.Well)', status: 'Safe', contaminants: [] },
        { name: 'Public Tap, Old Sukkur (Tap)', status: 'Unsafe', contaminants: ['TDS'] }
    ]
  }
];