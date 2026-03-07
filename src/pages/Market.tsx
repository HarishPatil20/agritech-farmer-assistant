import React, { useState, useEffect, useMemo } from "react"
import { useOutletContext } from "react-router-dom"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { MapPin, LineChart as ChartIcon, TrendingUp, TrendingDown, Wheat, Sprout, Carrot, Coffee, Leaf, Trees, Apple } from "lucide-react"
import { motion } from "motion/react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

// --- Mock Data ---
const locationData: Record<string, string[]> = {
  Karnataka: ["Mandya", "Mysuru", "Shimoga", "Davangere", "Kolar","Bijapur","Kalaburagi"],
  Kerala: ["Wayanad", "Idukki", "Palakkad"],
  "Tamil Nadu": ["Coimbatore", "Erode", "Madurai"],
  AndhraPradesh: ["Guntur", "Kurnool", "Chittoor"],
  Maharashtra: ["Pune", "Nashik", "Nagpur"],
  Gujarat: ["Ahmedabad", "Surat", "Rajkot"],
  Punjab: ["Ludhiana", "Amritsar"],
  "West Bengal": ["Hooghly", "Burdwan"],
  "Uttar Pradesh": ["Agra", "Varanasi"],
  "Madhya Pradesh": ["Indore", "Bhopal", "Ujjain"],
  Rajasthan: ["Jaipur", "Jodhpur", "Kota"],
}


// --- Translations ---
const t = {
  en: {
    title: "Smart Mandi Dashboard",
    subtitle: "Advanced Agri-Market Analysis & Triple-Crop Trends",
    selectLang: "Language",
    selectState: "Select State",
    selectDistrict: "Select District",
    marketPrices: "Market Prices",
    commodity: "Commodity",
    variety: "Variety",
    market: "Market",
    price: "Price (₹/Qtl)",
    analyzeTrends: "Analyze Trends (Select 3 Crops)",
    crop1: "Crop 1",
    crop2: "Crop 2",
    crop3: "Crop 3",
    noData: "Select a district to view market data.",
    perQtl: "per Qtl",
    select: "-- Select --",
    selectCropsMsg: "Select crops to view historical trends",
    priceChange: "Change"
  },
  kn: {
    title: "ಸ್ಮಾರ್ಟ್ ಮಂಡಿ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    subtitle: "ಸುಧಾರಿತ ಕೃಷಿ-ಮಾರುಕಟ್ಟೆ ವಿಶ್ಲೇಷಣೆ",
    selectLang: "ಭಾಷೆ",
    selectState: "ರಾಜ್ಯವನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    selectDistrict: "ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆ ಮಾಡಿ",
    marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    commodity: "ಬೆಳೆ",
    variety: "ವೈವಿಧ್ಯ",
    market: "ಮಾರುಕಟ್ಟೆ",
    price: "ಬೆಲೆ (₹/Qtl)",
    analyzeTrends: "ಟ್ರೆಂಡ್‌ಗಳನ್ನು ವಿಶ್ಲೇಷಿಸಿ (3 ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ)",
    crop1: "ಬೆಳೆ 1",
    crop2: "ಬೆಳೆ 2",
    crop3: "ಬೆಳೆ 3",
    noData: "ಮಾರುಕಟ್ಟೆ ಡೇಟಾವನ್ನು ವೀಕ್ಷಿಸಲು ಜಿಲ್ಲೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ.",
    perQtl: "ಪ್ರತಿ ಕ್ವಿಂಟಾಲ್‌ಗೆ",
    select: "-- ಆಯ್ಕೆಮಾಡಿ --",
    selectCropsMsg: "ಐತಿಹಾಸಿಕ ಟ್ರೆಂಡ್‌ಗಳನ್ನು ವೀಕ್ಷಿಸಲು ಬೆಳೆಗಳನ್ನು ಆಯ್ಕೆಮಾಡಿ",
    priceChange: "ಬದಲಾವಣೆ"
  },
  hi: {
    title: "स्मार्ट मंडी डैशबोर्ड",
    subtitle: "उन्नत कृषि-बाजार विश्लेषण",
    selectLang: "भाषा",
    selectState: "राज्य चुनें",
    selectDistrict: "जिला चुनें",
    marketPrices: "बाजार भाव",
    commodity: "फसल",
    variety: "किस्म",
    market: "मंडी",
    price: "भाव (₹/Qtl)",
    analyzeTrends: "रुझानों का विश्लेषण करें (3 फसलें चुनें)",
    crop1: "फसल 1",
    crop2: "फसल 2",
    crop3: "फसल 3",
    noData: "बाजार डेटा देखने के लिए एक जिले का चयन करें।",
    perQtl: "प्रति क्विंटल",
    select: "-- चुनें --",
    selectCropsMsg: "ऐतिहासिक रुझान देखने के लिए फसलें चुनें",
    priceChange: "परिवर्तन"
  },
  ta: {
    title: "ஸ்மார்ட் மண்டி டாஷ்போர்டு",
    subtitle: "மேம்பட்ட வேளாண்-சந்தை பகுப்பாய்வு",
    selectLang: "மொழி",
    selectState: "மாநிலத்தை தேர்ந்தெடுக்கவும்",
    selectDistrict: "மாவட்டத்தை தேர்ந்தெடுக்கவும்",
    marketPrices: "சந்தை விலைகள்",
    commodity: "பயிர்",
    variety: "ரகம்",
    market: "சந்தை",
    price: "விலை (₹/Qtl)",
    analyzeTrends: "போக்குகள் பகுப்பாய்வு (3 பயிர்களைத் தேர்ந்தெடுக்கவும்)",
    crop1: "பயிர் 1",
    crop2: "பயிர் 2",
    crop3: "பயிர் 3",
    noData: "சந்தை தரவைக் காண ஒரு மாவட்டத்தைத் தேர்ந்தெடுக்கவும்.",
    perQtl: "குவிண்டாலுக்கு",
    select: "-- தேர்ந்தெடுக்கவும் --",
    selectCropsMsg: "வரலாற்று போக்குகளைக் காண பயிர்களைத் தேர்ந்தெடுக்கவும்",
    priceChange: "மாற்றம்"
  },
  te: {
    title: "స్మార్ట్ మండి డాష్‌బోర్డ్",
    subtitle: "అధునాతన వ్యవసాయ-మార్కెట్ విశ్లేషణ",
    selectLang: "భాష",
    selectState: "రాష్ట్రాన్ని ఎంచుకోండి",
    selectDistrict: "జిల్లాను ఎంచుకోండి",
    marketPrices: "మార్కెట్ ధరలు",
    commodity: "పంట",
    variety: "రకం",
    market: "మార్కెట్",
    price: "ధర (₹/Qtl)",
    analyzeTrends: "ట్రెండ్‌లను విశ్లేషించండి (3 పంటలను ఎంచుకోండి)",
    crop1: "పంట 1",
    crop2: "పంట 2",
    crop3: "పంట 3",
    noData: "మార్కెట్ డేటాను వీక్షించడానికి జిల్లాను ఎంచుకోండి.",
    perQtl: "క్వింటాల్‌కు",
    select: "-- ఎంచుకోండి --",
    selectCropsMsg: "చారిత్రక ట్రెండ్‌లను వీక్షించడానికి పంటలను ఎంచుకోండి",
    priceChange: "మార్పు"
  },
  ml: {
    title: "സ്മാർട്ട് മണ്ടി ഡാഷ്ബോർഡ്",
    subtitle: "വിപുലമായ കാർഷിക-വിപണി വിശകലനം",
    selectLang: "ഭാഷ",
    selectState: "സംസ്ഥാനം തിരഞ്ഞെടുക്കുക",
    selectDistrict: "ജില്ല തിരഞ്ഞെടുക്കുക",
    marketPrices: "വിപണി വിലകൾ",
    commodity: "വിള",
    variety: "ഇനം",
    market: "വിപണി",
    price: "വില (₹/Qtl)",
    analyzeTrends: "ട്രെൻഡുകൾ വിശകലനം ചെയ്യുക (3 വിളകൾ തിരഞ്ഞെടുക്കുക)",
    crop1: "വിള 1",
    crop2: "വിള 2",
    crop3: "വിള 3",
    noData: "വിപണി ഡാറ്റ കാണാൻ ഒരു ജില്ല തിരഞ്ഞെടുക്കുക.",
    perQtl: "ക്വിന്റലിന്",
    select: "-- തിരഞ്ഞെടുക്കുക --",
    selectCropsMsg: "ചരിത്രപരമായ ട്രെൻഡുകൾ കാണാൻ വിളകൾ തിരഞ്ഞെടുക്കുക",
    priceChange: "മാറ്റം"
  },
  mr: { 
    title: "स्मार्ट मंडी डॅशबोर्ड", 
    subtitle: "प्रगत कृषी-बाजार विश्लेषण", 
    selectLang: "भाषा", 
    selectState: "राज्य निवडा", 
    selectDistrict: "जिल्हा निवडा", 
    marketPrices: "बाजारभाव", 
    commodity: "पीक", 
    variety: "जात", 
    market: "बाजार", 
    price: "किंमत (₹/Qtl)", 
    analyzeTrends: "कल विश्लेषण (३ पिके निवडा)", 
    crop1: "पीक १", 
    crop2: "पीक २", 
    crop3: "पीक ३", 
    noData: "बाजार डेटा पाहण्यासाठी जिल्हा निवडा.", 
    perQtl: "प्रति क्विंटल", 
    select: "-- निवडा --", 
    selectCropsMsg: "ऐतिहासिक कल पाहण्यासाठी पिके निवडा",
    priceChange: "बदल"
  },
  gu: { 
    title: "સ્માર્ટ મંડી ડેશબોર્ડ", 
    subtitle: "અદ્યતન કૃષિ-બજાર વિશ્લેષણ", 
    selectLang: "ભાષા", 
    selectState: "રાજ્ય પસંદ કરો", 
    selectDistrict: "જિલ્લો પસંદ કરો", 
    marketPrices: "બજાર ભાવ", 
    commodity: "પાક", 
    variety: "જાત", 
    market: "બજાર", 
    price: "કિંમત (₹/Qtl)", 
    analyzeTrends: "વલણોનું વિશ્લેષણ કરો (3 પાક પસંદ કરો)", 
    crop1: "પાક 1", 
    crop2: "પાક 2", 
    crop3: "પાક 3", 
    noData: "બજાર ડેટા જોવા માટે જિલ્લો પસંદ કરો.", 
    perQtl: "પ્રતિ ક્વિન્ટલ", 
    select: "-- પસંદ કરો --", 
    selectCropsMsg: "ઐતિહાસિક વલણો જોવા માટે પાક પસંદ કરો",
    priceChange: "ફેરફાર"
  },
  bn: { 
    title: "স্মার্ট মান্ডি ড্যাশবোর্ড", 
    subtitle: "উন্নত কৃষি-বাজার বিশ্লেষণ", 
    selectLang: "ভাষা", 
    selectState: "রাজ্য নির্বাচন করুন", 
    selectDistrict: "জেলা নির্বাচন করুন", 
    marketPrices: "বাজার দর", 
    commodity: "ফসল", 
    variety: "জাত", 
    market: "বাজার", 
    price: "দাম (₹/Qtl)", 
    analyzeTrends: "প্রবণতা বিশ্লেষণ (৩টি ফসল)", 
    crop1: "ফসল ১", 
    crop2: "ফসল ২", 
    crop3: "ফসল ৩", 
    noData: "বাজারের ডেটা দেখতে একটি জেলা নির্বাচন করুন।", 
    perQtl: "প্রতি কুইন্টাল", 
    select: "-- নির্বাচন করুন --", 
    selectCropsMsg: "ঐতিহাসিক প্রবণতা দেখতে ফসল নির্বাচন করুন",
    priceChange: "পরিবর্তন"
  },
  pa: { 
    title: "ਸਮਾਰਟ ਮੰਡੀ ਡੈਸ਼ਬੋਰਡ", 
    subtitle: "ਉੱਨਤ ਖੇਤੀ-ਬਾਜ਼ਾਰ ਵਿਸ਼ਲੇਸ਼ਣ", 
    selectLang: "ਭਾਸ਼ਾ", 
    selectState: "ਰਾਜ ਚੁਣੋ", 
    selectDistrict: "ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ", 
    marketPrices: "ਬਾਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ", 
    commodity: "ਫਸਲ", 
    variety: "ਕਿਸਮ", 
    market: "ਬਾਜ਼ਾਰ", 
    price: "ਕੀਮਤ (₹/Qtl)", 
    analyzeTrends: "ਰੁਝਾਨਾਂ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ (3 ਫਸਲਾਂ ਚੁਣੋ)", 
    crop1: "ਫਸਲ 1", 
    crop2: "ਫਸਲ 2", 
    crop3: "ਫਸਲ 3", 
    noData: "ਬਾਜ਼ਾਰ ਡੇਟਾ ਦੇਖਣ ਲਈ ਇੱਕ ਜ਼ਿਲ੍ਹਾ ਚੁਣੋ।", 
    perQtl: "ਪ੍ਰਤੀ ਕੁਇੰਟਲ", 
    select: "-- ਚੁਣੋ --", 
    selectCropsMsg: "ਇਤਿਹਾਸਕ ਰੁਝਾਨ ਦੇਖਣ ਲਈ ਫਸਲਾਂ ਚੁਣੋ",
    priceChange: "ਬਦਲਾਅ"
  },
  or: { 
    title: "ସ୍ମାର୍ଟ ମଣ୍ଡି ଡ୍ୟାସବୋର୍ଡ", 
    subtitle: "ଉନ୍ନତ କୃଷି-ବଜାର ବିଶ୍ଳେଷଣ", 
    selectLang: "ଭାଷା", 
    selectState: "ରାଜ୍ୟ ବାଛନ୍ତୁ", 
    selectDistrict: "ଜିଲ୍ଲା ବାଛନ୍ତୁ", 
    marketPrices: "ବଜାର ଦର", 
    commodity: "ଫସଲ", 
    variety: "କିସମ", 
    market: "ବଜାର", 
    price: "ଦର (₹/Qtl)", 
    analyzeTrends: "ଧାରା ବିଶ୍ଳେଷଣ କରନ୍ତୁ (୩ଟି ଫସଲ ବାଛନ୍ତୁ)", 
    crop1: "ଫସଲ ୧", 
    crop2: "ଫସଲ ୨", 
    crop3: "ଫସଲ ୩", 
    noData: "ବଜାର ତଥ୍ୟ ଦେଖିବାକୁ ଏକ ଜିଲ୍ଲା ବାଛନ୍ତୁ।", 
    perQtl: "ପ୍ରତି କ୍ୱିଣ୍ଟାଲ୍", 
    select: "-- ବାଛନ୍ତୁ --", 
    selectCropsMsg: "ଐତିହାସିକ ଧାରା ଦେଖିବାକୁ ଫସଲ ବାଛନ୍ତୁ",
    priceChange: "ପରିବର୍ତ୍ତନ"
  },
  ur: { 
    title: "سمارٹ منڈی ڈیش بورڈ", 
    subtitle: "اعلی درجے کی زرعی مارکیٹ کا تجزیہ", 
    selectLang: "زبان", 
    selectState: "ریاست منتخب کریں", 
    selectDistrict: "ضلع منتخب کریں", 
    marketPrices: "مارکیٹ کی قیمتیں", 
    commodity: "فصل", 
    variety: "قسم", 
    market: "مارکیٹ", 
    price: "قیمت (₹/Qtl)", 
    analyzeTrends: "رجحانات کا تجزیہ کریں (3 فصلیں منتخب کریں)", 
    crop1: "فصل 1", 
    crop2: "فصل 2", 
    crop3: "فصل 3", 
    noData: "مارکیٹ کا ڈیٹا دیکھنے کے لیے ایک ضلع منتخب کریں۔", 
    perQtl: "فی کوئنٹل", 
    select: "-- منتخب کریں --", 
    selectCropsMsg: "تاریخی رجحانات دیکھنے کے لیے فصلیں منتخب کریں",
    priceChange: "تبدیلی"
  }
}

type Lang = keyof typeof t

export function Market() {
  const { lang: contextLang } = useOutletContext<{ lang: string }>() || { lang: "en" }
  const lang = (contextLang in t ? contextLang : "en") as Lang
  
  const [selectedState, setSelectedState] = useState("")
  const [selectedDistrict, setSelectedDistrict] = useState("")
  
  const [crop1, setCrop1] = useState("")
  const [crop2, setCrop2] = useState("")
  const [crop3, setCrop3] = useState("")

  // Store price trends for each commodity
  const [priceTrends, setPriceTrends] = useState<Record<string, { trend: string, isPositive: boolean }>>({})

  const getCropIcon = (commodity: string) => {
    const lower = commodity.toLowerCase();
    if (lower.includes('paddy') || lower.includes('ragi') || lower.includes('corn') || lower.includes('jowar') || lower.includes('wheat')) return Wheat;
    if (lower.includes('tomato') || lower.includes('onion') || lower.includes('potato') || lower.includes('ginger') || lower.includes('chilli')) return Carrot;
    if (lower.includes('coffee') || lower.includes('tea')) return Coffee;
    if (lower.includes('coconut') || lower.includes('areca') || lower.includes('banana') || lower.includes('pineapple')) return Trees;
    if (lower.includes('apple') || lower.includes('mango') || lower.includes('grapes')) return Apple;
    return Sprout;
  }

  // Filtered table data
const [districtData, setDistrictData] = useState<any[]>([])
const [loading, setLoading] = useState(false)

useEffect(() => {
  if (!selectedState || !selectedDistrict) return

  const fetchData = async () => {
    try {
      setLoading(true)

      const API_KEY = import.meta.env.VITE_MANDI_API_KEY

      const res = await fetch(
        `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=${API_KEY}&format=json&filters[State]=${selectedState}&filters[District]=${selectedDistrict}&limit=20`
      )

      const data = await res.json()

      const formatted =
  data.records?.map((item: any) => ({
    commodity: item.Commodity || "Unknown",
    variety: item.Variety || "Standard",
    market: item.Market || item.District,
    price: Number(item.Modal_Price) || 0
  })) || []
    const uniqueCrops = Object.values(
  formatted.reduce((acc: any, item: any) => {
    if (!acc[item.commodity]) {
      acc[item.commodity] = item
    }
    return acc
  }, {})
)

setDistrictData(uniqueCrops)

      // Generate random trends for each commodity
      const trends: Record<string, { trend: string, isPositive: boolean }> = {}
      uniqueCrops.forEach((item: any) => {
        const trendValue = (Math.random() * 8 - 3).toFixed(1)
        trends[item.commodity] = {
          trend: trendValue,
          isPositive: parseFloat(trendValue) >= 0
        }
      })
      setPriceTrends(trends)

    } catch (err) {
      console.error("Mandi API error", err)
      setDistrictData([])
    } finally {
      setLoading(false)
    }
  }

  fetchData()
}, [selectedState, selectedDistrict])

  // Available crops for dropdowns based on district
  const availableCrops = useMemo(() => {
  const crops = new Set(districtData.map((d) => d.commodity))
  return Array.from(crops)
}, [districtData])

  // Reset crops when district changes
  useEffect(() => {
    if (availableCrops.length >= 3) {
      setCrop1(availableCrops[0])
      setCrop2(availableCrops[1])
      setCrop3(availableCrops[2])
    } else if (availableCrops.length > 0) {
      setCrop1(availableCrops[0])
      setCrop2("")
      setCrop3("")
    }
  }, [selectedDistrict, availableCrops])

  // Generate 8 days of historical data (7 days + Today)
  const chartData = useMemo(() => {
    if (!crop1 && !crop2 && !crop3) return []
    
    const data = []
    const today = new Date()
    
    // Get base prices for realistic variation
const getBasePrice = (crop: string) => {
  const found = districtData.find(d => d.commodity === crop)
  return found ? Number(found.price) : 2000
}
    
    const base1 = getBasePrice(crop1)
    const base2 = getBasePrice(crop2)
    const base3 = getBasePrice(crop3)

    for (let i = 7; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(d.getDate() - i)
      const dateStr = i === 0 ? "Today" : d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      
      const point: any = { date: dateStr }
      
      // Add random fluctuation (-5% to +5%)
      if (crop1) point[crop1] = Math.round(base1 * (1 + (Math.random() * 0.1 - 0.05)))
      if (crop2) point[crop2] = Math.round(base2 * (1 + (Math.random() * 0.1 - 0.05)))
      if (crop3) point[crop3] = Math.round(base3 * (1 + (Math.random() * 0.1 - 0.05)))
      
      data.push(point)
    }
    return data
  }, [crop1, crop2, crop3])

  const currentT = t[lang]

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-emerald-950">{currentT.title}</h1>
          <p className="text-emerald-700/80 mt-1">{currentT.subtitle}</p>
        </div>
      </motion.div>

      {/* Location Selectors */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="border-emerald-100 shadow-md bg-white/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {currentT.selectState}
                </label>
                <select 
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value)
                    setSelectedDistrict("")
                  }}
                  className="w-full h-12 rounded-xl border-emerald-200 bg-emerald-50/50 px-4 text-emerald-950 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                >
                  <option value="">-- {currentT.selectState} --</option>
                  {Object.keys(locationData).map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-emerald-900 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {currentT.selectDistrict}
                </label>
                <select 
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  disabled={!selectedState}
                  className="w-full h-12 rounded-xl border-emerald-200 bg-emerald-50/50 px-4 text-emerald-950 focus:ring-2 focus:ring-emerald-500 outline-none transition-all disabled:opacity-50"
                >
                  <option value="">-- {currentT.selectDistrict} --</option>
                  {selectedState && locationData[selectedState].map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Market Data Grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="border-emerald-100 shadow-md overflow-hidden bg-transparent border-none">
          <CardHeader className="bg-emerald-50/80 border-b border-emerald-100 rounded-t-xl">
            <CardTitle className="text-emerald-950 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
              {currentT.marketPrices}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 bg-emerald-50/30 rounded-b-xl">
             {loading ? (
    <p className="text-center py-10 text-gray-500">
      Loading live mandi prices...
    </p>

  ) : districtData.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                {districtData.map((row, i) => {
                  const Icon = getCropIcon(row.commodity);
                  const trend = priceTrends[row.commodity] || { trend: "0.0", isPositive: true };
                  
                  return (
                   <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4 w-full group"
                  >
                    <div className="bg-emerald-100/50 p-3 rounded-full text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      <Icon className="h-6 w-6"/>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-emerald-950 text-lg break-words">
                        {row.commodity}
                      </h3>
                      <p className="text-xs text-emerald-700/70 truncate">
                        {row.market} • {row.variety}
                      </p>
                    </div>

                    <div className="text-right flex flex-col items-end">
                      <p className="font-black text-emerald-700 text-lg">
                        ₹{row.price}
                      </p>
                      <div className={`flex items-center gap-1 text-xs font-medium ${
                        trend.isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trend.isPositive ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>
                          {trend.isPositive ? '+' : ''}{trend.trend}%
                        </span>
                      </div>
                      <p className="text-[10px] text-emerald-600/60 uppercase mt-1">
                        PER QTL
                      </p>
                    </div>
                  </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="p-12 text-center text-emerald-800/50 bg-white rounded-2xl border border-emerald-100 border-dashed">
                <MapPin className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>{currentT.noData}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Triple Crop Comparison Graph */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card className="border-emerald-100 shadow-md">
          <CardHeader className="bg-emerald-50/80 border-b border-emerald-100">
            <CardTitle className="text-emerald-950 flex items-center gap-2">
              <ChartIcon className="h-5 w-5 text-emerald-600" />
              {currentT.analyzeTrends}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { label: currentT.crop1, val: crop1, set: setCrop1, color: "border-red-200 focus:ring-red-500" },
                { label: currentT.crop2, val: crop2, set: setCrop2, color: "border-blue-200 focus:ring-blue-500" },
                { label: currentT.crop3, val: crop3, set: setCrop3, color: "border-green-200 focus:ring-green-500" },
              ].map((c, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-xs font-semibold text-emerald-900 uppercase tracking-wider">{c.label}</label>
                  <select 
                    value={c.val}
                    onChange={(e) => c.set(e.target.value)}
                    className={`w-full h-10 rounded-lg bg-white px-3 text-sm text-slate-900 focus:ring-2 outline-none transition-all border ${c.color}`}
                  >
                    <option value="">{currentT.select}</option>
                    {availableCrops.map(crop => (
                      <option key={crop} value={crop}>{crop}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div className="h-[400px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis 
                      dataKey="date" 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#64748b" 
                      fontSize={12} 
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                      formatter={(value: number, name: string) => [`₹${value}`, name]}
                    />
                    <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                    {crop1 && <Line type="monotone" dataKey={crop1} stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                    {crop2 && <Line type="monotone" dataKey={crop2} stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                    {crop3 && <Line type="monotone" dataKey={crop3} stroke="#22c55e" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-emerald-800/40">
                  <p>{currentT.selectCropsMsg}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}