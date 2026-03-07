import React, { useState, useRef } from "react"
import { useOutletContext } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Loader2, AlertCircle, Leaf, Camera, ScanLine } from "lucide-react"
import { analyzeLeafImage } from "@/services/geminiService"
import { motion, AnimatePresence } from "motion/react"
import Markdown from 'react-markdown'

const t = {
  en: {
    title: "AI Disease Detection",
    subtitle: "Capture or upload a leaf image for instant diagnosis and treatment plans.",
    scanner: "Scanner",
    supported: "Supported: Paddy, Corn, Areca nut, Tomato",
    tapCamera: "Tap to open camera",
    orButtons: "or use the buttons below",
    gallery: "Gallery",
    camera: "Camera",
    analyzing: "Analyzing...",
    analyzeCrop: "Analyze Crop",
    diagnosisResults: "Diagnosis Results",
    aiPowered: "AI-powered analysis and recommendations",
    runningCnn: "Running CNN-based classification...",
    error: "Failed to analyze image. Please try again.",
    awaiting: "Awaiting image upload...",
  },
  kn: {
    title: "AI ರೋಗ ಪತ್ತೆ",
    subtitle: "ತ್ವರಿತ ರೋಗನಿರ್ಣಯ ಮತ್ತು ಚಿಕಿತ್ಸಾ ಯೋಜನೆಗಳಿಗಾಗಿ ಎಲೆಯ ಚಿತ್ರವನ್ನು ಸೆರೆಹಿಡಿಯಿರಿ ಅಥವಾ ಅಪ್‌ಲೋಡ್ ಮಾಡಿ.",
    scanner: "ಸ್ಕ್ಯಾನರ್",
    supported: "ಬೆಂಬಲಿತ: ಭತ್ತ, ಜೋಳ, ಅಡಿಕೆ, ಟೊಮೆಟೊ",
    tapCamera: "ಕ್ಯಾಮೆರಾ ತೆರೆಯಲು ಟ್ಯಾಪ್ ಮಾಡಿ",
    orButtons: "ಅಥವಾ ಕೆಳಗಿನ ಬಟನ್‌ಗಳನ್ನು ಬಳಸಿ",
    gallery: "ಗ್ಯಾಲರಿ",
    camera: "ಕ್ಯಾಮೆರಾ",
    analyzing: "ವಿಶ್ಲೇಷಿಸಲಾಗುತ್ತಿದೆ...",
    analyzeCrop: "ಬೆಳೆಯನ್ನು ವಿಶ್ಲೇಷಿಸಿ",
    diagnosisResults: "ರೋಗನಿರ್ಣಯದ ಫಲಿತಾಂಶಗಳು",
    aiPowered: "AI-ಚಾಲಿತ ವಿಶ್ಲೇಷಣೆ ಮತ್ತು ಶಿಫಾರಸುಗಳು",
    runningCnn: "CNN ಆಧಾರಿತ ವರ್ಗೀಕರಣವನ್ನು ನಡೆಸಲಾಗುತ್ತಿದೆ...",
    error: "ಚಿತ್ರವನ್ನು ವಿಶ್ಲೇಷಿಸಲು ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ಪುನಃ ಪ್ರಯತ್ನಿಸಿ.",
    awaiting: "ಚಿತ್ರ ಅಪ್‌ಲೋಡ್‌ಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ...",
  },
  hi: {
    title: "AI रोग पहचान",
    subtitle: "त्वरित निदान और उपचार योजनाओं के लिए एक पत्ती की छवि कैप्चर या अपलोड करें।",
    scanner: "स्कैनर",
    supported: "समर्थित: धान, मक्का, सुपारी, टमाटर",
    tapCamera: "कैमरा खोलने के लिए टैप करें",
    orButtons: "या नीचे दिए गए बटन का उपयोग करें",
    gallery: "गैलरी",
    camera: "कैमरा",
    analyzing: "विश्लेषण कर रहा है...",
    analyzeCrop: "फसल का विश्लेषण करें",
    diagnosisResults: "निदान परिणाम",
    aiPowered: "AI-संचालित विश्लेषण और सिफारिशें",
    runningCnn: "CNN-आधारित वर्गीकरण चला रहा है...",
    error: "छवि का विश्लेषण करने में विफल। कृपया पुनः प्रयास करें।",
    awaiting: "छवि अपलोड की प्रतीक्षा कर रहा है...",
  },
  ta: {
    title: "AI நோய் கண்டறிதல்",
    subtitle: "உடனடி நோயறிதல் மற்றும் சிகிச்சை திட்டங்களுக்கு இலை படத்தை எடுக்கவும் அல்லது பதிவேற்றவும்.",
    scanner: "ஸ்கேனர்",
    supported: "ஆதரவு: நெல், சோளம், பாக்கு, தக்காளி",
    tapCamera: "கேமராவைத் திறக்க தட்டவும்",
    orButtons: "அல்லது கீழே உள்ள பொத்தான்களைப் பயன்படுத்தவும்",
    gallery: "கேலரி",
    camera: "கேமரா",
    analyzing: "பகுப்பாய்வு செய்கிறது...",
    analyzeCrop: "பயிரை பகுப்பாய்வு செய்",
    diagnosisResults: "நோயறிதல் முடிவுகள்",
    aiPowered: "AI-இயங்கும் பகுப்பாய்வு மற்றும் பரிந்துரைகள்",
    runningCnn: "CNN-அடிப்படையிலான வகைப்பாட்டை இயக்குகிறது...",
    error: "படத்தை பகுப்பாய்வு செய்ய முடியவில்லை. மீண்டும் முயற்சிக்கவும்.",
    awaiting: "படம் பதிவேற்றத்திற்காக காத்திருக்கிறது...",
  },
  te: {
    title: "AI వ్యాధి గుర్తింపు",
    subtitle: "తక్షణ రోగ నిర్ధారణ మరియు చికిత్స ప్రణాళికల కోసం ఆకు చిత్రాన్ని క్యాప్చర్ చేయండి లేదా అప్‌లోడ్ చేయండి.",
    scanner: "స్కానర్",
    supported: "మద్దతు: వరి, మొక్కజొన్న, వక్క, టమోటా",
    tapCamera: "కెమెరాను తెరవడానికి నొక్కండి",
    orButtons: "లేదా దిగువ బటన్లను ఉపయోగించండి",
    gallery: "గ్యాలరీ",
    camera: "కెమెరా",
    analyzing: "విశ్లేషిస్తోంది...",
    analyzeCrop: "పంటను విశ్లేషించండి",
    diagnosisResults: "రోగ నిర్ధారణ ఫలితాలు",
    aiPowered: "AI-ఆధారిత విశ్లేషణ మరియు సిఫార్సులు",
    runningCnn: "CNN-ఆధారిత వర్గీకరణను నడుపుతోంది...",
    error: "చిత్రాన్ని విశ్లేషించడంలో విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.",
    awaiting: "చిత్రం అప్‌లోడ్ కోసం వేచి ఉంది...",
  },
  ml: {
    title: "AI രോഗ നിർണ്ണയം",
    subtitle: "തൽക്ഷണ രോഗനിർണ്ണയത്തിനും ചികിത്സാ പദ്ധതികൾക്കുമായി ഒരു ഇലയുടെ ചിത്രം എടുക്കുക അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യുക.",
    scanner: "സ്കാനർ",
    supported: "പിന്തുണയ്ക്കുന്നത്: നെല്ല്, ചോളം, അടയ്ക്ക, തക്കാളി",
    tapCamera: "ക്യാമറ തുറക്കാൻ ടാപ്പുചെയ്യുക",
    orButtons: "അല്ലെങ്കിൽ താഴെയുള്ള ബട്ടണുകൾ ഉപയോഗിക്കുക",
    gallery: "ഗാലറി",
    camera: "ക്യാമറ",
    analyzing: "വിശകലനം ചെയ്യുന്നു...",
    analyzeCrop: "വിള വിശകലനം ചെയ്യുക",
    diagnosisResults: "രോഗനിർണ്ണയ ഫലങ്ങൾ",
    aiPowered: "AI-അധിഷ്ഠിത വിശകലനവും ശുപാർശകളും",
    runningCnn: "CNN അടിസ്ഥാനമാക്കിയുള്ള വർഗ്ഗീകരണം പ്രവർത്തിപ്പിക്കുന്നു...",
    error: "ചിത്രം വിശകലനം ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു. വീണ്ടും ശ്രമിക്കുക.",
    awaiting: "ചിത്രം അപ്‌ലോഡ് ചെയ്യുന്നതിനായി കാത്തിരിക്കുന്നു...",
  },
  mr: { title: "AI रोग शोध", subtitle: "त्वरित निदान आणि उपचार योजनांसाठी पानाचे चित्र काढा किंवा अपलोड करा.", scanner: "स्कॅनर", supported: "समर्थित: भात, मका, सुपारी, टोमॅटो", tapCamera: "कॅमेरा उघडण्यासाठी टॅप करा", orButtons: "किंवा खालील बटणे वापरा", gallery: "गॅलरी", camera: "कॅमेरा", analyzing: "विश्लेषण करत आहे...", analyzeCrop: "पिकाचे विश्लेषण करा", diagnosisResults: "निदान परिणाम", aiPowered: "AI-चालित विश्लेषण आणि शिफारसी", runningCnn: "CNN-आधारित वर्गीकरण चालवत आहे...", error: "प्रतिमेचे विश्लेषण करण्यात अयशस्वी. कृपया पुन्हा प्रयत्न करा.", awaiting: "प्रतिमा अपलोडची प्रतीक्षा करत आहे..." },
  gu: { title: "AI રોગ નિદાન", subtitle: "ત્વરિત નિદાન અને સારવાર યોજનાઓ માટે પાંદડાની છબી કેપ્ચર કરો અથવા અપલોડ કરો.", scanner: "સ્કેનર", supported: "સમર્થિત: ડાંગર, મકાઈ, સોપારી, ટામેટા", tapCamera: "કેમેરા ખોલવા માટે ટેપ કરો", orButtons: "અથવા નીચેના બટનોનો ઉપયોગ કરો", gallery: "ગેલેરી", camera: "કેમેરા", analyzing: "વિશ્લેષણ કરી રહ્યું છે...", analyzeCrop: "પાકનું વિશ્લેષણ કરો", diagnosisResults: "નિદાન પરિણામો", aiPowered: "AI-સંચાલિત વિશ્લેષણ અને ભલામણો", runningCnn: "CNN-આધારિત વર્ગીકરણ ચલાવી રહ્યું છે...", error: "છબીનું વિશ્લેષણ કરવામાં નિષ્ફળ. કૃપા કરીને ફરી પ્રયાસ કરો.", awaiting: "છબી અપલોડની રાહ જોઈ રહ્યું છે..." },
  bn: { title: "AI রোগ নির্ণয়", subtitle: "তাত্ক্ষণিক রোগ নির্ণয় এবং চিকিত্সা পরিকল্পনার জন্য একটি পাতার ছবি তুলুন বা আপলোড করুন।", scanner: "স্ক্যানার", supported: "সমর্থিত: ধান, ভুট্টা, সুপারি, টমেটো", tapCamera: "ক্যামেরা খুলতে আলতো চাপুন", orButtons: "অথবা নীচের বোতামগুলি ব্যবহার করুন", gallery: "গ্যালারি", camera: "ক্যামেরা", analyzing: "বিশ্লেষণ করা হচ্ছে...", analyzeCrop: "ফসল বিশ্লেষণ করুন", diagnosisResults: "রোগ নির্ণয়ের ফলাফল", aiPowered: "AI-চালিত বিশ্লেষণ এবং সুপারিশ", runningCnn: "CNN-ভিত্তিক শ্রেণীবিভাগ চালানো হচ্ছে...", error: "ছবি বিশ্লেষণ করতে ব্যর্থ হয়েছে। আবার চেষ্টা করুন।", awaiting: "ছবি আপলোডের জন্য অপেক্ষা করা হচ্ছে..." },
  pa: { title: "AI ਰੋਗ ਪਛਾਣ", subtitle: "ਤੁਰੰਤ ਨਿਦਾਨ ਅਤੇ ਇਲਾਜ ਯੋਜਨਾਵਾਂ ਲਈ ਪੱਤੇ ਦੀ ਤਸਵੀਰ ਲਓ ਜਾਂ ਅੱਪਲੋਡ ਕਰੋ।", scanner: "ਸਕੈਨਰ", supported: "ਸਮਰਥਿਤ: ਝੋਨਾ, ਮੱਕੀ, ਸੁਪਾਰੀ, ਟਮਾਟਰ", tapCamera: "ਕੈਮਰਾ ਖੋਲ੍ਹਣ ਲਈ ਟੈਪ ਕਰੋ", orButtons: "ਜਾਂ ਹੇਠਾਂ ਦਿੱਤੇ ਬਟਨਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ", gallery: "ਗੈਲਰੀ", camera: "ਕੈਮਰਾ", analyzing: "ਵਿਸ਼ਲੇਸ਼ਣ ਕਰ ਰਿਹਾ ਹੈ...", analyzeCrop: "ਫਸਲ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ", diagnosisResults: "ਨਿਦਾਨ ਨਤੀਜੇ", aiPowered: "AI-ਸੰਚਾਲਿਤ ਵਿਸ਼ਲੇਸ਼ਣ ਅਤੇ ਸਿਫ਼ਾਰਸ਼ਾਂ", runningCnn: "CNN-ਅਧਾਰਤ ਵਰਗੀਕਰਨ ਚਲਾ ਰਿਹਾ ਹੈ...", error: "ਚਿੱਤਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰਨ ਵਿੱਚ ਅਸਫਲ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।", awaiting: "ਚਿੱਤਰ ਅੱਪਲੋਡ ਦੀ ਉਡੀਕ ਕਰ ਰਿਹਾ ਹੈ..." },
  or: { title: "AI ରୋଗ ଚିହ୍ନଟ", subtitle: "ତୁରନ୍ତ ରୋଗ ନିର୍ଣ୍ଣୟ ଏବଂ ଚିକିତ୍ସା ଯୋଜନା ପାଇଁ ଏକ ପତ୍ରର ଚିତ୍ର ନିଅନ୍ତୁ କିମ୍ବା ଅପଲୋଡ୍ କରନ୍ତୁ।", scanner: "ସ୍କାନର୍", supported: "ସମର୍ଥିତ: ଧାନ, ମକା, ଗୁଆ, ଟମାଟୋ", tapCamera: "କ୍ୟାମେରା ଖୋଲିବାକୁ ଟ୍ୟାପ୍ କରନ୍ତୁ", orButtons: "କିମ୍ବା ତଳେ ଥିବା ବଟନ୍ ବ୍ୟବହାର କରନ୍ତୁ", gallery: "ଗ୍ୟାଲେରୀ", camera: "କ୍ୟାମେରା", analyzing: "ବିଶ୍ଳେଷଣ କରୁଛି...", analyzeCrop: "ଫସଲ ବିଶ୍ଳେଷଣ କରନ୍ତୁ", diagnosisResults: "ରୋଗ ନିର୍ଣ୍ଣୟ ଫଳାଫଳ", aiPowered: "AI-ଚାଳିତ ବିଶ୍ଳେଷଣ ଏବଂ ସୁପାରିଶ", runningCnn: "CNN-ଆଧାରିତ ବର୍ଗୀକରଣ ଚଲାଉଛି...", error: "ଚିତ୍ର ବିଶ୍ଳେଷଣ କରିବାରେ ବିଫଳ। ଦୟାକରି ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।", awaiting: "ଚିତ୍ର ଅପଲୋଡ୍ ପାଇଁ ଅପେକ୍ଷା କରୁଛି..." },
  ur: { title: "AI بیماری کی تشخیص", subtitle: "فوری تشخیص اور علاج کے منصوبوں کے لیے پتے کی تصویر لیں یا اپ لوڈ کریں۔", scanner: "اسکینر", supported: "معاونت یافتہ: دھان، مکئی، سپاری، ٹماٹر", tapCamera: "کیمرہ کھولنے کے لیے تھپتھپائیں", orButtons: "یا نیچے دیے گئے بٹن استعمال کریں", gallery: "گیلری", camera: "کیمرہ", analyzing: "تجزیہ کر رہا ہے...", analyzeCrop: "فصل کا تجزیہ کریں", diagnosisResults: "تشخیص کے نتائج", aiPowered: "AI سے چلنے والا تجزیہ اور سفارشات", runningCnn: "CNN پر مبنی درجہ بندی چلا رہا ہے...", error: "تصویر کا تجزیہ کرنے میں ناکام۔ براہ کرم دوبارہ کوشش کریں۔", awaiting: "تصویر اپ لوڈ کا انتظار کر رہا ہے..." }
}

type Lang = keyof typeof t

export function DiseaseDetection() {
  const { lang: contextLang } = useOutletContext<{ lang: string }>() || { lang: "en" }
  const lang = (contextLang in t ? contextLang : "en") as Lang
  const currentT = t[lang]

  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setResult(null)
        setError(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setIsAnalyzing(true)
    setError(null)
    
    try {
      const base64Data = selectedImage.split(',')[1]
      const analysisResult = await analyzeLeafImage(base64Data, lang)
      setResult(analysisResult)
    } catch (err) {
      setError(currentT.error)
      console.error(err)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight text-emerald-950">{currentT.title}</h1>
        <p className="text-emerald-700/80 mt-1">{currentT.subtitle}</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-emerald-100 shadow-md overflow-hidden">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-50">
              <CardTitle className="text-emerald-950 flex items-center gap-2">
                <ScanLine className="h-5 w-5 text-emerald-600" />
                {currentT.scanner}
              </CardTitle>
              <CardDescription>{currentT.supported}</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="relative group">
                <div 
                  className={`border-2 border-dashed rounded-2xl p-2 transition-all duration-300 ${selectedImage ? 'border-emerald-400 bg-emerald-50/30' : 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50/50 cursor-pointer'}`}
                  onClick={() => !selectedImage && cameraInputRef.current?.click()}
                >
                  {selectedImage ? (
                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl shadow-inner">
                      <img src={selectedImage} alt="Selected leaf" className="object-cover w-full h-full" />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-emerald-900/20 backdrop-blur-[2px] flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent h-[200%] animate-scan" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-16 text-emerald-800/60">
                      <div className="bg-white p-4 rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform">
                        <Camera className="h-10 w-10 text-emerald-500" />
                      </div>
                      <p className="text-base font-medium text-emerald-900">{currentT.tapCamera}</p>
                      <p className="text-sm mt-1">{currentT.orButtons}</p>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  className="h-12 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-5 w-5" />
                  {currentT.gallery}
                </Button>
                <Button 
                  className="h-12 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                  onClick={() => cameraInputRef.current?.click()}
                >
                  <Camera className="mr-2 h-5 w-5" />
                  {currentT.camera}
                </Button>
              </div>

              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <input type="file" ref={cameraInputRef} onChange={handleImageUpload} accept="image/*" capture="environment" className="hidden" />
              
              <Button 
                size="lg"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white h-14 text-lg" 
                disabled={!selectedImage || isAnalyzing} 
                onClick={handleAnalyze}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    {currentT.analyzing}
                  </>
                ) : (
                  <>
                    <ImageIcon className="mr-2 h-5 w-5" />
                    {currentT.analyzeCrop}
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-emerald-100 shadow-md bg-white">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-50">
              <CardTitle className="text-emerald-950">{currentT.diagnosisResults}</CardTitle>
              <CardDescription>{currentT.aiPowered}</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <AnimatePresence mode="wait">
                {isAnalyzing ? (
                  <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64 text-emerald-700">
                    <div className="relative">
                      <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20"></div>
                      <Loader2 className="h-10 w-10 animate-spin text-emerald-600 mb-4 relative z-10" />
                    </div>
                    <p className="font-medium animate-pulse">{currentT.runningCnn}</p>
                  </motion.div>
                ) : error ? (
                  <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64 text-red-500">
                    <AlertCircle className="h-10 w-10 mb-4" />
                    <p className="font-medium">{error}</p>
                  </motion.div>
                ) : result ? (
                  <motion.div key="result" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="prose prose-sm max-w-none prose-emerald prose-p:leading-relaxed prose-headings:text-emerald-900">
                    <div className="markdown-body">
                      <Markdown>{result}</Markdown>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center justify-center h-64 text-emerald-800/30">
                    <Leaf className="h-16 w-16 mb-4" />
                    <p className="font-medium">{currentT.awaiting}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

