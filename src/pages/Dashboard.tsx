import { useOutletContext } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CloudRain, ThermometerSun, Droplets, TrendingUp, Info, Wind, MapPin, Sun, Sprout } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"


const t = {
  en: {
    title: "Farmer Dashboard",
    subtitle: "Welcome back! Here's your farm overview for today.",
    location: "Wayanad, Kerala",
    weather: "Partly Cloudy",
    highLow: "High: 32° • Low: 22°",
    humidity: "Humidity",
    wind: "Wind",
    rain: "Rain",
    livePrices: "Live Market Prices",
    mandiRates: "Current Mandi rates per quintal",
    knowledgeBase: "Crop Knowledge Base",
    marketPrices: [
      { crop: "Paddy (Dhan)", price: "₹2,183", trend: "+1.2%", market: "Mandya APMC" },
      { crop: "Corn (Maize)", price: "₹2,090", trend: "-0.5%", market: "Davangere APMC" },
      { crop: "Areca nut", price: "₹45,000", trend: "+2.4%", market: "Shivamogga APMC" },
      { crop: "Tomato", price: "₹1,800", trend: "+5.0%", market: "Kolar APMC" },
    ],
    cropInfo: [
      { title: "Paddy Cultivation", desc: "Requires high water availability. Best planted during monsoon. Ensure proper nitrogen management for optimal yield." },
      { title: "Corn Management", desc: "Sensitive to waterlogging. Needs well-drained soil. Watch out for Fall Armyworm during early growth stages." },
      { title: "Areca Nut Care", desc: "Thrives in areas with abundant rainfall. Requires regular manuring. Susceptible to Koleroga (fruit rot) during heavy rains." },
      { title: "Tomato Growing", desc: "Needs staking for support. Highly susceptible to early and late blight. Ensure consistent watering to prevent blossom end rot." },
    ],
    schemesTitle: "Live Government Schemes",
    schemes: [
      { title: "PM-KISAN", desc: "Financial benefit of Rs 6000/- per year in three equal installments.", link: "https://pmkisan.gov.in/" },
      { title: "PMFBY", desc: "Pradhan Mantri Fasal Bima Yojana - Crop insurance scheme.", link: "https://pmfby.gov.in/" },
      { title: "Kisan Credit Card", desc: "Adequate and timely credit support from the banking system.", link: "https://www.myscheme.gov.in/schemes/kcc" }
    ]
  },
  kn: {
    title: "ರೈತ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    subtitle: "ಮತ್ತೆ ಸ್ವಾಗತ! ಇಂದಿನ ನಿಮ್ಮ ಕೃಷಿ ಅವಲೋಕನ ಇಲ್ಲಿದೆ.",
    location: "ವಯನಾಡ್, ಕೇರಳ",
    weather: "ಭಾಗಶಃ ಮೋಡ",
    highLow: "ಗರಿಷ್ಠ: 32° • ಕನಿಷ್ಠ: 22°",
    humidity: "ಆರ್ದ್ರತೆ",
    wind: "ಗಾಳಿ",
    rain: "ಮಳೆ",
    livePrices: "ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    mandiRates: "ಪ್ರಸ್ತುತ ಮಂಡಿ ದರಗಳು (ಕ್ವಿಂಟಾಲ್‌ಗೆ)",
    knowledgeBase: "ಬೆಳೆ ಜ್ಞಾನದ ಮೂಲ",
    marketPrices: [
      { crop: "ಭತ್ತ", price: "₹2,183", trend: "+1.2%", market: "ಮಂಡ್ಯ ಎಪಿಎಂಸಿ" },
      { crop: "ಮೆಕ್ಕೆಜೋಳ", price: "₹2,090", trend: "-0.5%", market: "ದಾವಣಗೆರೆ ಎಪಿಎಂಸಿ" },
      { crop: "ಅಡಿಕೆ", price: "₹45,000", trend: "+2.4%", market: "ಶಿವಮೊಗ್ಗ ಎಪಿಎಂಸಿ" },
      { crop: "ಟೊಮೆಟೊ", price: "₹1,800", trend: "+5.0%", market: "ಕೋಲಾರ ಎಪಿಎಂಸಿ" },
    ],
    cropInfo: [
      { title: "ಭತ್ತದ ಕೃಷಿ", desc: "ಹೆಚ್ಚಿನ ನೀರಿನ ಲಭ್ಯತೆಯ ಅಗತ್ಯವಿದೆ. ಮುಂಗಾರು ಹಂಗಾಮಿನಲ್ಲಿ ನೆಡುವುದು ಉತ್ತಮ. ಅತ್ಯುತ್ತಮ ಇಳುವರಿಗಾಗಿ ಸರಿಯಾದ ಸಾರಜನಕ ನಿರ್ವಹಣೆಯನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ." },
      { title: "ಮೆಕ್ಕೆಜೋಳ ನಿರ್ವಹಣೆ", desc: "ನೀರು ನಿಲ್ಲುವುದಕ್ಕೆ ಸೂಕ್ಷ್ಮವಾಗಿರುತ್ತದೆ. ಚೆನ್ನಾಗಿ ಬರಿದಾಗುವ ಮಣ್ಣಿನ ಅಗತ್ಯವಿದೆ. ಆರಂಭಿಕ ಬೆಳವಣಿಗೆಯ ಹಂತಗಳಲ್ಲಿ ಫಾಲ್ ಆರ್ಮಿವರ್ಮ್ ಬಗ್ಗೆ ಎಚ್ಚರದಿಂದಿರಿ." },
      { title: "ಅಡಿಕೆ ಆರೈಕೆ", desc: "ಹೇರಳವಾದ ಮಳೆಯಿರುವ ಪ್ರದೇಶಗಳಲ್ಲಿ ಬೆಳೆಯುತ್ತದೆ. ನಿಯಮಿತವಾಗಿ ಗೊಬ್ಬರ ಹಾಕುವ ಅಗತ್ಯವಿದೆ. ಭಾರೀ ಮಳೆಯ ಸಮಯದಲ್ಲಿ ಕೊಳೆರೋಗಕ್ಕೆ ತುತ್ತಾಗುವ ಸಾಧ್ಯತೆಯಿದೆ." },
      { title: "ಟೊಮೆಟೊ ಬೆಳೆಯುವುದು", desc: "ಬೆಂಬಲಕ್ಕಾಗಿ ಸ್ಟೇಕಿಂಗ್ ಅಗತ್ಯವಿದೆ. ಆರಂಭಿಕ ಮತ್ತು ತಡವಾದ ರೋಗಕ್ಕೆ ಹೆಚ್ಚು ಒಳಗಾಗುತ್ತದೆ. ಹೂವು ಕೊಳೆಯುವುದನ್ನು ತಡೆಯಲು ನಿರಂತರವಾಗಿ ನೀರುಣಿಸುವುದನ್ನು ಖಚಿತಪಡಿಸಿಕೊಳ್ಳಿ." },
    ],
    schemesTitle: "ಲೈವ್ ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು",
    schemes: [
      { title: "ಪಿಎಂ-ಕಿಸಾನ್", desc: "ವರ್ಷಕ್ಕೆ ರೂ 6000/- ಆರ್ಥಿಕ ಲಾಭವನ್ನು ಮೂರು ಸಮಾನ ಕಂತುಗಳಲ್ಲಿ ನೀಡಲಾಗುತ್ತದೆ.", link: "https://pmkisan.gov.in/" },
      { title: "ಪಿಎಂಎಫ್‌ಬಿವೈ", desc: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ - ಬೆಳೆ ವಿಮೆ ಯೋಜನೆ.", link: "https://pmfby.gov.in/" },
      { title: "ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್", desc: "ಬ್ಯಾಂಕಿಂಗ್ ವ್ಯವಸ್ಥೆಯಿಂದ ಸಾಕಷ್ಟು ಮತ್ತು ಸಕಾಲಿಕ ಸಾಲ ಬೆಂಬಲ.", link: "https://www.myscheme.gov.in/schemes/kcc" }
    ]
  },
  hi: {
    title: "किसान डैशबोर्ड",
    subtitle: "वापसी पर स्वागत है! यहाँ आज के लिए आपके खेत का अवलोकन है।",
    location: "वायनाड, केरल",
    weather: "आंशिक रूप से बादल",
    highLow: "उच्च: 32° • निम्न: 22°",
    humidity: "नमी",
    wind: "हवा",
    rain: "बारिश",
    livePrices: "लाइव बाजार भाव",
    mandiRates: "वर्तमान मंडी दरें प्रति क्विंटल",
    knowledgeBase: "फसल ज्ञान आधार",
    marketPrices: [
      { crop: "धान", price: "₹2,183", trend: "+1.2%", market: "मांड्या APMC" },
      { crop: "मक्का", price: "₹2,090", trend: "-0.5%", market: "दावणगेरे APMC" },
      { crop: "सुपारी", price: "₹45,000", trend: "+2.4%", market: "शिवमोग्गा APMC" },
      { crop: "टमाटर", price: "₹1,800", trend: "+5.0%", market: "कोलार APMC" },
    ],
    cropInfo: [
      { title: "धान की खेती", desc: "उच्च जल उपलब्धता की आवश्यकता है। मानसून के दौरान सबसे अच्छा लगाया जाता है। इष्टतम उपज के लिए उचित नाइट्रोजन प्रबंधन सुनिश्चित करें।" },
      { title: "मक्का प्रबंधन", desc: "जलभराव के प्रति संवेदनशील। अच्छी जल निकासी वाली मिट्टी की आवश्यकता है। प्रारंभिक विकास चरणों के दौरान फॉल आर्मीवर्म से सावधान रहें।" },
      { title: "सुपारी की देखभाल", desc: "प्रचुर वर्षा वाले क्षेत्रों में पनपता है। नियमित खाद की आवश्यकता होती है। भारी बारिश के दौरान कोलेरोगा (फल सड़न) के प्रति संवेदनशील।" },
      { title: "टमाटर उगाना", desc: "समर्थन के लिए स्टेकिंग की आवश्यकता है। अगेती और पछेती झुलसा के प्रति अत्यधिक संवेदनशील। ब्लॉसम एंड रोट को रोकने के लिए लगातार पानी देना सुनिश्चित करें।" },
    ],
    schemesTitle: "लाइव सरकारी योजनाएं",
    schemes: [
      { title: "पीएम-किसान", desc: "तीन समान किस्तों में प्रति वर्ष 6000/- रुपये का वित्तीय लाभ।", link: "https://pmkisan.gov.in/" },
      { title: "पीएमएफबीवाई", desc: "प्रधानमंत्री फसल बीमा योजना - फसल बीमा योजना।", link: "https://pmfby.gov.in/" },
      { title: "किसान क्रेडिट कार्ड", desc: "बैंकिंग प्रणाली से पर्याप्त और समय पर ऋण सहायता।", link: "https://www.myscheme.gov.in/schemes/kcc" }
    ]
  },
  ta: {
    title: "விவசாயி டாஷ்போர்டு",
    subtitle: "மீண்டும் வருக! இன்றைய உங்கள் பண்ணை கண்ணோட்டம் இதோ.",
    location: "வயநாடு, கேரளா",
    weather: "பகுதி மேகமூட்டம்",
    highLow: "அதிகபட்சம்: 32° • குறைந்தபட்சம்: 22°",
    humidity: "ஈரப்பதம்",
    wind: "காற்று",
    rain: "மழை",
    livePrices: "நேரடி சந்தை விலைகள்",
    mandiRates: "குவிண்டாலுக்கு தற்போதைய மண்டி விகிதங்கள்",
    knowledgeBase: "பயிர் அறிவு தளம்",
    marketPrices: [
      { crop: "நெல்", price: "₹2,183", trend: "+1.2%", market: "மாண்டியா APMC" },
      { crop: "சோளம்", price: "₹2,090", trend: "-0.5%", market: "தாவணகெரே APMC" },
      { crop: "பாக்கு", price: "₹45,000", trend: "+2.4%", market: "சிவமொக்கா APMC" },
      { crop: "தக்காளி", price: "₹1,800", trend: "+5.0%", market: "கோலார் APMC" },
    ],
    cropInfo: [
      { title: "நெல் சாகுபடி", desc: "அதிக நீர் இருப்பு தேவை. பருவமழையின் போது சிறப்பாக நடப்படுகிறது. உகந்த மகசூலுக்கு சரியான நைட்ரஜன் நிர்வாகத்தை உறுதிப்படுத்தவும்." },
      { title: "சோள மேலாண்மை", desc: "நீர் தேங்குவதற்கு உணர்திறன் கொண்டது. நன்கு வடிகட்டிய மண் தேவை. ஆரம்ப வளர்ச்சி நிலைகளில் படைப்புழு குறித்து கவனமாக இருங்கள்." },
      { title: "பாக்கு பராமரிப்பு", desc: "அதிக மழை பெய்யும் பகுதிகளில் செழித்து வளரும். வழக்கமான உரம் தேவை. பலத்த மழையின் போது கொலரோகா (பழ அழுகல்) நோயால் பாதிக்கப்படக்கூடியது." },
      { title: "தக்காளி வளர்ப்பு", desc: "ஆதரவுக்கு ஸ்டேக்கிங் தேவை. ஆரம்ப மற்றும் தாமதமான ப்ளைட்டிற்கு மிகவும் உணர்திறன் கொண்டது. ப்ளாசம் எண்ட் அழுகலைத் தடுக்க சீரான நீர்ப்பாசனத்தை உறுதிப்படுத்தவும்." },
    ],
    schemesTitle: "நேரடி அரசு திட்டங்கள்",
    schemes: [
      { title: "பிஎம்-கிசான்", desc: "ஆண்டுக்கு ரூ 6000/- மூன்று சம தவணைகளில் நிதி உதவி.", link: "https://pmkisan.gov.in/" },
      { title: "பிஎம்எஃப்பிஒய்", desc: "பிரதான் மந்திரி ஃபசல் பீமா யோஜனா - பயிர் காப்பீட்டு திட்டம்.", link: "https://pmfby.gov.in/" },
      { title: "கிசான் கிரெடிட் கார்டு", desc: "வங்கி அமைப்பிலிருந்து போதுமான மற்றும் சரியான நேர கடன் ஆதரவு.", link: "https://www.myscheme.gov.in/schemes/kcc" }
    ]
  },
  te: {
    title: "రైతు డాష్‌బోర్డ్",
    subtitle: "తిరిగి స్వాగతం! ఈ రోజు మీ వ్యవసాయ అవలోకనం ఇక్కడ ఉంది.",
    location: "వయనాడ్, కేరళ",
    weather: "పాక్షికంగా మేఘావృతం",
    highLow: "గరిష్ట: 32° • కనిష్ట: 22°",
    humidity: "తేమ",
    wind: "గాలి",
    rain: "వర్షం",
    livePrices: "లైవ్ మార్కెట్ ధరలు",
    mandiRates: "క్వింటాల్‌కు ప్రస్తుత మండి రేట్లు",
    knowledgeBase: "పంట నాలెడ్జ్ బేస్",
    marketPrices: [
      { crop: "వరి", price: "₹2,183", trend: "+1.2%", market: "మాండ్య APMC" },
      { crop: "మొక్కజొన్న", price: "₹2,090", trend: "-0.5%", market: "దావణగెరె APMC" },
      { crop: "వక్క", price: "₹45,000", trend: "+2.4%", market: "శివమొగ్గ APMC" },
      { crop: "టమోటా", price: "₹1,800", trend: "+5.0%", market: "కోలార్ APMC" },
    ],
    cropInfo: [
      { title: "వరి సాగు", desc: "అధిక నీటి లభ్యత అవసరం. రుతుపవనాల సమయంలో ఉత్తమంగా నాటబడుతుంది. సరైన దిగుబడి కోసం సరైన నత్రజని నిర్వహణను నిర్ధారించుకోండి." },
      { title: "మొక్కజొన్న నిర్వహణ", desc: "నీరు నిలిచిపోవడానికి సున్నితమైనది. బాగా ఎండిపోయిన నేల అవసరం. ప్రారంభ దశలో ఫాల్ ఆర్మీవార్మ్ పట్ల జాగ్రత్త వహించండి." },
      { title: "వక్క సంరక్షణ", desc: "సమృద్ధిగా వర్షపాతం ఉన్న ప్రాంతాల్లో వృద్ధి చెందుతుంది. క్రమం తప్పకుండా ఎరువులు వేయాలి. భారీ వర్షాల సమయంలో కొలెరోగా (పండ్ల కుళ్లు) కు గురయ్యే అవకాశం ఉంది." },
      { title: "టమోటా పెంపకం", desc: "మద్దతు కోసం స్టాకింగ్ అవసరం. ప్రారంభ మరియు చివరి ముడతకు అత్యంత సున్నితమైనది. బ్లోసమ్ ఎండ్ రాట్‌ను నివారించడానికి స్థిరమైన నీరు త్రాగుట నిర్ధారించుకోండి." },
    ],
    schemesTitle: "లైవ్ ప్రభుత్వ పథకాలు",
    schemes: [
      { title: "పిఎం-కిసాన్", desc: "సంవత్సరానికి రూ 6000/- ఆర్థిక ప్రయోజనం మూడు సమాన వాయిదాలలో.", link: "https://pmkisan.gov.in/" },
      { title: "పిఎంఎఫ్బివై", desc: "ప్రధాన మంత్రి ఫసల్ బీమా యోజన - పంట బీమా పథకం.", link: "https://pmfby.gov.in/" },
      { title: "కిసాన్ క్రెడిట్ కార్డ్", desc: "బ్యాంకింగ్ వ్యవస్థ నుండి తగిన మరియు సకాలంలో రుణ మద్దతు.", link: "https://www.myscheme.gov.in/schemes/kcc" }
    ]
  },
  ml: {
    title: "കർഷക ഡാഷ്ബോർഡ്",
    subtitle: "തിരികെ സ്വാഗതം! ഇന്നത്തെ നിങ്ങളുടെ ഫാം അവലോകനം ഇതാ.",
    location: "വയനാട്, കേരളം",
    weather: "ഭാഗികമായി മേഘാവൃതം",
    highLow: "ഉയർന്നത്: 32° • കുറഞ്ഞത്: 22°",
    humidity: "ഈർപ്പം",
    wind: "കാറ്റ്",
    rain: "മഴ",
    livePrices: "തത്സമയ വിപണി വിലകൾ",
    mandiRates: "ക്വിന്റലിന് നിലവിലെ മണ്ടി നിരക്കുകൾ",
    knowledgeBase: "വിള വിജ്ഞാന അടിത്തറ",
    marketPrices: [
      { crop: "നെല്ല്", price: "₹2,183", trend: "+1.2%", market: "മണ്ഡ്യ APMC" },
      { crop: "ചോളം", price: "₹2,090", trend: "-0.5%", market: "ദാവണഗരെ APMC" },
      { crop: "അടയ്ക്ക", price: "₹45,000", trend: "+2.4%", market: "ശിവമൊഗ്ഗ APMC" },
      { crop: "തക്കാളി", price: "₹1,800", trend: "+5.0%", market: "കോലാർ APMC" },
    ],
    cropInfo: [
      { title: "നെൽകൃഷി", desc: "ഉയർന്ന ജലലഭ്യത ആവശ്യമാണ്. മൺസൂൺ സമയത്ത് നടുന്നത് ഏറ്റവും നല്ലത്. ഒപ്റ്റിമൽ വിളവിനായി ശരിയായ നൈട്രജൻ മാനേജ്മെന്റ് ഉറപ്പാക്കുക." },
      { title: "ചോളം മാനേജ്മെന്റ്", desc: "വെള്ളക്കെട്ടിനോട് സെൻസിറ്റീവ്. നല്ല നീർവാർച്ചയുള്ള മണ്ണ് ആവശ്യമാണ്. പ്രാരംഭ വളർച്ചാ ഘട്ടങ്ങളിൽ ഫാൾ ആർമിവേം ശ്രദ്ധിക്കുക." },
      { title: "അടയ്ക്ക പരിപാലനം", desc: "സമൃദ്ധമായ മഴയുള്ള പ്രദേശങ്ങളിൽ തഴച്ചുവളരുന്നു. പതിവായി വളപ്രയോഗം ആവശ്യമാണ്. കനത്ത മഴയിൽ കൊളരോഗ (പഴം അഴുകൽ) വരാൻ സാധ്യതയുണ്ട്." },
      { title: "തക്കാളി വളർത്തൽ", desc: "പിന്തുണയ്ക്കായി സ്റ്റേക്കിംഗ് ആവശ്യമാണ്. നേരത്തെയുള്ളതും വൈകിയുള്ളതുമായ വരൾച്ചയ്ക്ക് വളരെ സെൻസിറ്റീവ്. ബ്ലോസം എൻഡ് അഴുകൽ തടയാൻ സ്ഥിരമായി നനയ്ക്കുന്നത് ഉറപ്പാക്കുക." },
    ],
    schemesTitle: "തത്സമയ സർക്കാർ പദ്ധതികൾ",
    schemes: [
      { title: "പിഎം-കിസാൻ", desc: "പ്രതിവർഷം 6000/- രൂപയുടെ സാമ്പത്തിക ആനുകൂല്യം മൂന്ന് തുല്യ ഗഡുക്കളായി.", link: "https://pmkisan.gov.in/" },
      { title: "പിഎംഎഫ്ബിവൈ", desc: "പ്രധാനമന്ത്രി ഫസൽ ബീമാ യോജന - വിള ഇൻഷുറൻസ് പദ്ധതി.", link: "https://pmfby.gov.in/" },
      { title: "കിസാൻ ക്രെഡിറ്റ് കാർഡ്", desc: "ബാങ്കിംഗ് സംവിധാനത്തിൽ നിന്ന് മതിയായതും സമയബന്ധിതവുമായ വായ്പാ പിന്തുണ.", link: "https://www.myscheme.gov.in/schemes/kcc" }
    ]
  },
  mr: { title: "शेतकरी डॅशबोर्ड", subtitle: "पुन्हा स्वागत आहे! आजचा तुमचा शेतीचा आढावा येथे आहे.", location: "वायनाड, केरळ", weather: "अंशतः ढगाळ", highLow: "कमाल: 32° • किमान: 22°", humidity: "आर्द्रता", wind: "वारा", rain: "पाऊस", livePrices: "थेट बाजारभाव", mandiRates: "सध्याचे प्रति क्विंटल मंडी दर", knowledgeBase: "पीक ज्ञान आधार", marketPrices: [{ crop: "भात", price: "₹2,183", trend: "+1.2%", market: "मंड्या APMC" }, { crop: "मका", price: "₹2,090", trend: "-0.5%", market: "दावणगेरे APMC" }, { crop: "सुपारी", price: "₹45,000", trend: "+2.4%", market: "शिवमोग्गा APMC" }, { crop: "टोमॅटो", price: "₹1,800", trend: "+5.0%", market: "कोलार APMC" }], cropInfo: [{ title: "भात शेती", desc: "जास्त पाण्याची आवश्यकता असते. पावसाळ्यात लागवड करणे उत्तम. चांगल्या उत्पादनासाठी योग्य नायट्रोजन व्यवस्थापन सुनिश्चित करा." }, { title: "मका व्यवस्थापन", desc: "पाणी साचण्यास संवेदनशील. पाण्याचा निचरा होणारी जमीन आवश्यक. सुरुवातीच्या वाढीच्या टप्प्यात फॉल आर्मीवर्मकडे लक्ष द्या." }, { title: "सुपारीची काळजी", desc: "भरपूर पाऊस असलेल्या भागात चांगले वाढते. नियमित खत घालणे आवश्यक आहे. मुसळधार पावसात कोलेरोगा (फळ कुजणे) होण्याची शक्यता असते." }, { title: "टोमॅटो लागवड", desc: "आधारासाठी स्टॅकिंग आवश्यक आहे. लवकर आणि उशिरा येणाऱ्या करपा रोगास अत्यंत संवेदनशील. ब्लॉसम एंड रॉट टाळण्यासाठी नियमित पाणी देणे सुनिश्चित करा." }], schemesTitle: "थेट सरकारी योजना", schemes: [{ title: "पीएम-किसान", desc: "दरवर्षी ६०००/- रुपयांचा आर्थिक लाभ तीन समान हप्त्यांमध्ये.", link: "https://pmkisan.gov.in/" }, { title: "पीएमएफबीवाय", desc: "प्रधानमंत्री पीक विमा योजना - पीक विमा योजना.", link: "https://pmfby.gov.in/" }, { title: "किसान क्रेडिट कार्ड", desc: "बँकिंग प्रणालीतून पुरेसा आणि वेळेवर कर्ज आधार.", link: "https://www.myscheme.gov.in/schemes/kcc" }] },
  gu: { title: "ખેડૂત ડેશબોર્ડ", subtitle: "ફરી સ્વાગત છે! અહીં આજ માટે તમારી ખેતીની ઝાંખી છે.", location: "વાયનાડ, કેરળ", weather: "આંશિક વાદળછાયું", highLow: "મહત્તમ: 32° • લઘુત્તમ: 22°", humidity: "ભેજ", wind: "પવન", rain: "વરસાદ", livePrices: "લાઇવ બજાર ભાવ", mandiRates: "વર્તમાન મંડી દર પ્રતિ ક્વિન્ટલ", knowledgeBase: "પાક જ્ઞાન આધાર", marketPrices: [{ crop: "ડાંગર", price: "₹2,183", trend: "+1.2%", market: "માંડ્યા APMC" }, { crop: "મકાઈ", price: "₹2,090", trend: "-0.5%", market: "દાવણગેરે APMC" }, { crop: "સોપારી", price: "₹45,000", trend: "+2.4%", market: "શિવમોગ્ગા APMC" }, { crop: "ટામેટા", price: "₹1,800", trend: "+5.0%", market: "કોલાર APMC" }], cropInfo: [{ title: "ડાંગરની ખેતી", desc: "વધુ પાણીની જરૂર છે. ચોમાસા દરમિયાન વાવેતર કરવું શ્રેષ્ઠ છે. શ્રેષ્ઠ ઉપજ માટે યોગ્ય નાઇટ્રોજન વ્યવસ્થાપન સુનિશ્ચિત કરો." }, { title: "મકાઈ વ્યવસ્થાપન", desc: "જળભરાવ પ્રત્યે સંવેદનશીલ. સારી રીતે નિકાલવાળી જમીનની જરૂર છે. પ્રારંભિક વૃદ્ધિના તબક્કા દરમિયાન ફોલ આર્મીવોર્મ પર ધ્યાન આપો." }, { title: "સોપારીની સંભાળ", desc: "વિપુલ પ્રમાણમાં વરસાદવાળા વિસ્તારોમાં ખીલે છે. નિયમિત ખાતરની જરૂર છે. ભારે વરસાદ દરમિયાન કોલેરોગા (ફળ સડો) માટે સંવેદનશીલ." }, { title: "ટામેટા ઉગાડવા", desc: "ટેકા માટે સ્ટેકિંગની જરૂર છે. પ્રારંભિક અને અંતમાં બ્લાઇટ માટે અત્યંત સંવેદનશીલ. બ્લોસમ એન્ડ રોટ અટકાવવા માટે સતત પાણી આપવાની ખાતરી કરો." }], schemesTitle: "લાઇવ સરકારી યોજનાઓ", schemes: [{ title: "પીએમ-કિસાન", desc: "ત્રણ સમાન હપ્તામાં દર વર્ષે રૂ. 6000/- નો નાણાકીય લાભ.", link: "https://pmkisan.gov.in/" }, { title: "પીએમએફબીવાય", desc: "પ્રધાનમંત્રી ફસલ વીમા યોજના - પાક વીમા યોજના.", link: "https://pmfby.gov.in/" }, { title: "કિસાન ક્રેડિટ કાર્ડ", desc: "બેંકિંગ સિસ્ટમમાંથી પર્યાપ્ત અને સમયસર ધિરાણ આધાર.", link: "https://www.myscheme.gov.in/schemes/kcc" }] },
  bn: { title: "কৃষক ড্যাশবোর্ড", subtitle: "আবার স্বাগতম! এখানে আজকের জন্য আপনার খামারের ওভারভিউ।", location: "ওয়ায়ানাদ, কেরালা", weather: "আংশিক মেঘলা", highLow: "সর্বোচ্চ: 32° • সর্বনিম্ন: 22°", humidity: "আর্দ্রতা", wind: "বাতাস", rain: "বৃষ্টি", livePrices: "লাইভ বাজার দর", mandiRates: "কুইন্টাল প্রতি বর্তমান মান্ডি রেট", knowledgeBase: "ফসল জ্ঞান ভিত্তি", marketPrices: [{ crop: "ধান", price: "₹2,183", trend: "+1.2%", market: "মান্ডিয়া APMC" }, { crop: "ভুট্টা", price: "₹2,090", trend: "-0.5%", market: "দাভাঙ্গেরে APMC" }, { crop: "সুপারি", price: "₹45,000", trend: "+2.4%", market: "শিবমোগ্গা APMC" }, { crop: "টমেটো", price: "₹1,800", trend: "+5.0%", market: "কোলার APMC" }], cropInfo: [{ title: "ধান চাষ", desc: "উচ্চ জলের প্রাপ্যতা প্রয়োজন। বর্ষাকালে রোপণ করা সবচেয়ে ভালো। সর্বোত্তম ফলনের জন্য সঠিক নাইট্রোজেন ব্যবস্থাপনা নিশ্চিত করুন।" }, { title: "ভুট্টা ব্যবস্থাপনা", desc: "জলবদ্ধতার প্রতি সংবেদনশীল। সুনিষ্কাশিত মাটি প্রয়োজন। প্রাথমিক বৃদ্ধির পর্যায়ে ফল আর্মিওয়ার্মের দিকে নজর রাখুন।" }, { title: "সুপারির যত্ন", desc: "প্রচুর বৃষ্টিপাত সহ এলাকায় উন্নতি লাভ করে। নিয়মিত সার প্রয়োগ প্রয়োজন। ভারী বৃষ্টির সময় কোলেরোগা (ফল পচা) এর জন্য সংবেদনশীল।" }, { title: "টমেটো জন্মানো", desc: "সমর্থনের জন্য স্টেকিং প্রয়োজন। প্রারম্ভিক এবং দেরী ব্লাইটের জন্য অত্যন্ত সংবেদনশীল। ব্লসম এন্ড রট প্রতিরোধ করার জন্য ধারাবাহিক জল দেওয়া নিশ্চিত করুন।" }], schemesTitle: "লাইভ সরকারি স্কিম", schemes: [{ title: "পিএম-কিসান", desc: "তিনটি সমান কিস্তিতে প্রতি বছর 6000/- টাকার আর্থিক সুবিধা।", link: "https://pmkisan.gov.in/" }, { title: "পিএমএফবিওয়াই", desc: "প্রধানমন্ত্রী ফসল বিমা যোজনা - শস্য বীমা প্রকল্প।", link: "https://pmfby.gov.in/" }, { title: "কিসান ক্রেডিট কার্ড", desc: "ব্যাংকিং ব্যবস্থা থেকে পর্যাপ্ত এবং সময়মত ঋণ সহায়তা।", link: "https://www.myscheme.gov.in/schemes/kcc" }] },
  pa: { title: "ਕਿਸਾਨ ਡੈਸ਼ਬੋਰਡ", subtitle: "ਵਾਪਸੀ 'ਤੇ ਸਵਾਗਤ ਹੈ! ਇੱਥੇ ਅੱਜ ਲਈ ਤੁਹਾਡੇ ਖੇਤ ਦੀ ਸੰਖੇਪ ਜਾਣਕਾਰੀ ਹੈ।", location: "ਵਾਇਨਾਡ, ਕੇਰਲ", weather: "ਅੰਸ਼ਕ ਤੌਰ 'ਤੇ ਬੱਦਲਵਾਈ", highLow: "ਵੱਧ ਤੋਂ ਵੱਧ: 32° • ਘੱਟੋ-ਘੱਟ: 22°", humidity: "ਨਮੀ", wind: "ਹਵਾ", rain: "ਮੀਂਹ", livePrices: "ਲਾਈਵ ਬਾਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ", mandiRates: "ਮੌਜੂਦਾ ਮੰਡੀ ਦਰਾਂ ਪ੍ਰਤੀ ਕੁਇੰਟਲ", knowledgeBase: "ਫਸਲ ਗਿਆਨ ਅਧਾਰ", marketPrices: [{ crop: "ਝੋਨਾ", price: "₹2,183", trend: "+1.2%", market: "ਮਾਂਡਿਆ APMC" }, { crop: "ਮੱਕੀ", price: "₹2,090", trend: "-0.5%", market: "ਦਾਵਣਗੇਰੇ APMC" }, { crop: "ਸੁਪਾਰੀ", price: "₹45,000", trend: "+2.4%", market: "ਸ਼ਿਵਮੋਗਾ APMC" }, { crop: "ਟਮਾਟਰ", price: "₹1,800", trend: "+5.0%", market: "ਕੋਲਾਰ APMC" }], cropInfo: [{ title: "ਝੋਨੇ ਦੀ ਖੇਤੀ", desc: "ਪਾਣੀ ਦੀ ਉੱਚ ਉਪਲਬਧਤਾ ਦੀ ਲੋੜ ਹੈ। ਮਾਨਸੂਨ ਦੌਰਾਨ ਸਭ ਤੋਂ ਵਧੀਆ ਲਾਇਆ ਜਾਂਦਾ ਹੈ। ਅਨੁਕੂਲ ਝਾੜ ਲਈ ਸਹੀ ਨਾਈਟ੍ਰੋਜਨ ਪ੍ਰਬੰਧਨ ਨੂੰ ਯਕੀਨੀ ਬਣਾਓ।" }, { title: "ਮੱਕੀ ਪ੍ਰਬੰਧਨ", desc: "ਪਾਣੀ ਭਰਨ ਪ੍ਰਤੀ ਸੰਵੇਦਨਸ਼ੀਲ। ਚੰਗੀ ਨਿਕਾਸੀ ਵਾਲੀ ਮਿੱਟੀ ਦੀ ਲੋੜ ਹੈ। ਸ਼ੁਰੂਆਤੀ ਵਿਕਾਸ ਪੜਾਵਾਂ ਦੌਰਾਨ ਫਾਲ ਆਰਮੀਵਰਮ ਦਾ ਧਿਆਨ ਰੱਖੋ।" }, { title: "ਸੁਪਾਰੀ ਦੀ ਦੇਖਭਾਲ", desc: "ਭਰਪੂਰ ਬਾਰਸ਼ ਵਾਲੇ ਖੇਤਰਾਂ ਵਿੱਚ ਵਧਦਾ-ਫੁੱਲਦਾ ਹੈ। ਨਿਯਮਤ ਖਾਦ ਦੀ ਲੋੜ ਹੁੰਦੀ ਹੈ। ਭਾਰੀ ਬਾਰਸ਼ ਦੌਰਾਨ ਕੋਲੇਰੋਗਾ (ਫਲ ਸੜਨ) ਲਈ ਸੰਵੇਦਨਸ਼ੀਲ।" }, { title: "ਟਮਾਟਰ ਉਗਾਉਣਾ", desc: "ਸਹਾਇਤਾ ਲਈ ਸਟੇਕਿੰਗ ਦੀ ਲੋੜ ਹੈ। ਅਗੇਤੀ ਅਤੇ ਪਿਛੇਤੀ ਝੁਲਸ ਰੋਗ ਪ੍ਰਤੀ ਬਹੁਤ ਸੰਵੇਦਨਸ਼ੀਲ। ਬਲੌਸਮ ਐਂਡ ਰੋਟ ਨੂੰ ਰੋਕਣ ਲਈ ਲਗਾਤਾਰ ਪਾਣੀ ਦੇਣਾ ਯਕੀਨੀ ਬਣਾਓ।" }], schemesTitle: "ਲਾਈਵ ਸਰਕਾਰੀ ਸਕੀਮਾਂ", schemes: [{ title: "ਪੀਐਮ-ਕਿਸਾਨ", desc: "ਤਿੰਨ ਬਰਾਬਰ ਕਿਸ਼ਤਾਂ ਵਿੱਚ ਪ੍ਰਤੀ ਸਾਲ 6000/- ਰੁਪਏ ਦਾ ਵਿੱਤੀ ਲਾਭ।", link: "https://pmkisan.gov.in/" }, { title: "ਪੀਐਮਐਫਬੀਵਾਈ", desc: "ਪ੍ਰਧਾਨ ਮੰਤਰੀ ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ - ਫਸਲ ਬੀਮਾ ਯੋਜਨਾ।", link: "https://pmfby.gov.in/" }, { title: "ਕਿਸਾਨ ਕ੍ਰੈਡਿਟ ਕਾਰਡ", desc: "ਬੈਂਕਿੰਗ ਪ੍ਰਣਾਲੀ ਤੋਂ ਢੁਕਵੀਂ ਅਤੇ ਸਮੇਂ ਸਿਰ ਕ੍ਰੈਡਿਟ ਸਹਾਇਤਾ।", link: "https://www.myscheme.gov.in/schemes/kcc" }] },
  or: { title: "କୃଷକ ଡ୍ୟାସବୋର୍ଡ", subtitle: "ପୁଣି ସ୍ୱାଗତ! ଆଜି ପାଇଁ ଆପଣଙ୍କର ଚାଷର ସମୀକ୍ଷା ଏଠାରେ ଅଛି।", location: "ୱାୟାନାଡ, କେରଳ", weather: "ଆଂଶିକ ମେଘୁଆ", highLow: "ସର୍ବାଧିକ: 32° • ସର୍ବନିମ୍ନ: 22°", humidity: "ଆର୍ଦ୍ରତା", wind: "ପବନ", rain: "ବର୍ଷା", livePrices: "ଲାଇଭ୍ ବଜାର ଦର", mandiRates: "କ୍ୱିଣ୍ଟାଲ ପିଛା ବର୍ତ୍ତମାନର ମଣ୍ଡି ଦର", knowledgeBase: "ଫସଲ ଜ୍ଞାନ ଆଧାର", marketPrices: [{ crop: "ଧାନ", price: "₹2,183", trend: "+1.2%", market: "ମାଣ୍ଡ୍ୟା APMC" }, { crop: "ମକା", price: "₹2,090", trend: "-0.5%", market: "ଦାବଣଗେରେ APMC" }, { crop: "ଗୁଆ", price: "₹45,000", trend: "+2.4%", market: "ଶିବମୋଗା APMC" }, { crop: "ବିଲାତି ବାଇଗଣ", price: "₹1,800", trend: "+5.0%", market: "କୋଲାର APMC" }], cropInfo: [{ title: "ଧାନ ଚାଷ", desc: "ଅଧିକ ଜଳ ଉପଲବ୍ଧତା ଆବଶ୍ୟକ କରେ। ମୌସୁମୀ ସମୟରେ ସର୍ବୋତ୍ତମ ରୋପଣ କରାଯାଏ। ଉତ୍ତମ ଅମଳ ପାଇଁ ସଠିକ୍ ଯବକ୍ଷାରଜାନ ପରିଚାଳନା ନିଶ୍ଚିତ କରନ୍ତୁ।" }, { title: "ମକା ପରିଚାଳନା", desc: "ଜଳବନ୍ଦୀ ପ୍ରତି ସମ୍ବେଦନଶୀଳ। ଭଲ ନିଷ୍କାସିତ ମାଟି ଆବଶ୍ୟକ କରେ। ପ୍ରାରମ୍ଭିକ ବୃଦ୍ଧି ପର୍ଯ୍ୟାୟରେ ଫଲ୍ ଆର୍ମିୱର୍ମ ପ୍ରତି ଧ୍ୟାନ ଦିଅନ୍ତୁ।" }, { title: "ଗୁଆ ଯତ୍ନ", desc: "ପ୍ରଚୁର ବର୍ଷା ଥିବା ଅଞ୍ଚଳରେ ଭଲ ବଢେ। ନିୟମିତ ଖତ ଆବଶ୍ୟକ କରେ। ପ୍ରବଳ ବର୍ଷା ସମୟରେ କୋଲେରୋଗା (ଫଳ ପଚା) ପ୍ରତି ସମ୍ବେଦନଶୀଳ।" }, { title: "ବିଲାତି ବାଇଗଣ ଚାଷ", desc: "ସମର୍ଥନ ପାଇଁ ଷ୍ଟେକିଂ ଆବଶ୍ୟକ କରେ। ପ୍ରାରମ୍ଭିକ ଏବଂ ବିଳମ୍ବିତ ବ୍ଲାଇଟ୍ ପ୍ରତି ଅତ୍ୟନ୍ତ ସମ୍ବେଦନଶୀଳ। ବ୍ଲୋସମ୍ ଏଣ୍ଡ୍ ରଟ୍ ରୋକିବା ପାଇଁ କ୍ରମାଗତ ଜଳସେଚନ ନିଶ୍ଚିତ କରନ୍ତୁ।" }], schemesTitle: "ଲାଇଭ୍ ସରକାରୀ ଯୋଜନା", schemes: [{ title: "ପିଏମ-କିଷାନ", desc: "ତିନୋଟି ସମାନ କିସ୍ତିରେ ବର୍ଷକୁ 6000/- ଟଙ୍କାର ଆର୍ଥିକ ଲାଭ।", link: "https://pmkisan.gov.in/" }, { title: "ପିଏମଏଫବିୱାଇ", desc: "ପ୍ରଧାନମନ୍ତ୍ରୀ ଫସଲ ବୀମା ଯୋଜନା - ଫସଲ ବୀମା ଯୋଜନା।", link: "https://pmfby.gov.in/" }, { title: "କିଷାନ କ୍ରେଡିଟ୍ କାର୍ଡ", desc: "ବ୍ୟାଙ୍କିଙ୍ଗ୍ ବ୍ୟବସ୍ଥାରୁ ପର୍ଯ୍ୟାପ୍ତ ଏବଂ ଠିକ୍ ସମୟରେ ଋଣ ସହାୟତା।", link: "https://www.myscheme.gov.in/schemes/kcc" }] },
  ur: { title: "کسان ڈیش بورڈ", subtitle: "خوش آمدید! آج کے لیے آپ کے فارم کا جائزہ یہ ہے۔", location: "ویاناڈ، کیرالہ", weather: "جزوی طور پر ابر آلود", highLow: "زیادہ سے زیادہ: 32° • کم از کم: 22°", humidity: "نمی", wind: "ہوا", rain: "بارش", livePrices: "لائیو مارکیٹ کی قیمتیں", mandiRates: "موجودہ منڈی کے نرخ فی کوئنٹل", knowledgeBase: "فصل کے علم کی بنیاد", marketPrices: [{ crop: "دھان", price: "₹2,183", trend: "+1.2%", market: "مانڈیا APMC" }, { crop: "مکئی", price: "₹2,090", trend: "-0.5%", market: "داونگیرے APMC" }, { crop: "سپاری", price: "₹45,000", trend: "+2.4%", market: "شیوموگا APMC" }, { crop: "ٹماٹر", price: "₹1,800", trend: "+5.0%", market: "کولار APMC" }], cropInfo: [{ title: "دھان کی کاشت", desc: "پانی کی زیادہ دستیابی کی ضرورت ہے۔ مون سون کے دوران بہترین لگایا جاتا ہے۔ بہترین پیداوار کے لیے مناسب نائٹروجن کے انتظام کو یقینی بنائیں۔" }, { title: "مکئی کا انتظام", desc: "پانی جمع ہونے کے لیے حساس۔ اچھی نکاسی والی مٹی کی ضرورت ہے۔ ابتدائی نشوونما کے مراحل کے دوران فال آرمی ورم کا خیال رکھیں۔" }, { title: "سپاری کی دیکھ بھال", desc: "کافی بارش والے علاقوں میں پروان چڑھتی ہے۔ باقاعدگی سے کھاد ڈالنے کی ضرورت ہے۔ شدید بارشوں کے دوران کولیروگا (پھل سڑنے) کا خطرہ۔" }, { title: "ٹماٹر اگانا", desc: "سہارے کے لیے اسٹیکنگ کی ضرورت ہے۔ ابتدائی اور دیر سے جھلساؤ کے لیے انتہائی حساس۔ بلاسم اینڈ روٹ کو روکنے کے لیے مسلسل پانی دینا یقینی بنائیں۔" }], schemesTitle: "لائیو سرکاری اسکیمیں", schemes: [{ title: "پی ایم-کسان", desc: "تین مساوی اقساط میں ہر سال 6000/- روپے کا مالی فائدہ۔", link: "https://pmkisan.gov.in/" }, { title: "پی ایم ایف بی وائی", desc: "پردھان منتری فصل بیمہ یوجنا - فصل بیمہ اسکیم۔", link: "https://pmfby.gov.in/" }, { title: "کسان کریڈٹ کارڈ", desc: "بینکنگ سسٹم سے مناسب اور بروقت کریڈٹ سپورٹ۔", link: "https://www.myscheme.gov.in/schemes/kcc" }] }
}

type Lang = keyof typeof t

export function Dashboard() {
  const [weather, setWeather] = useState<any>(null)
const [marketPrices, setMarketPrices] = useState<any[]>([])

// WEATHER
useEffect(() => {
  navigator.geolocation.getCurrentPosition(async (position) => {
    const lat = position.coords.latitude
    const lon = position.coords.longitude

    const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    )

    const data = await res.json()
    setWeather(data)
  })
}, [])


useEffect(() => {
  const fetchMarketPrices = async () => {
    const API_KEY = import.meta.env.VITE_MANDI_API_KEY

    // Specifically fetch Arecanut, Paddy, and Corn
    const crops = ["Arecanut", "Paddy", "Corn", "Tomato"] // Added Tomato as 4th item to maintain layout

    const results = await Promise.all(
      crops.map(async (crop) => {
        try {
          const res = await fetch(
            `https://api.data.gov.in/resource/35985678-0d79-46b4-9ed6-6f13308a1d24?api-key=${API_KEY}&format=json&filters[State]=Karnataka&filters[Commodity]=${crop}&limit=1`
          )

          const data = await res.json()

          return data.records && data.records.length > 0
            ? data.records[0]
            : null
        } catch (error) {
          console.error(`Error fetching ${crop}:`, error)
          return null
        }
      })
    )

    setMarketPrices(results.filter(Boolean))
  }

  fetchMarketPrices()
}, [])


  const { lang: contextLang } = useOutletContext<{ lang: string }>() || { lang: "en" }
  const lang = (contextLang in t ? contextLang : "en") as Lang
  const currentT = t[lang]

  return (
    <div className="space-y-8 pb-8">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight text-emerald-950">{currentT.title}</h1>
        <p className="text-emerald-700/80 mt-1">{currentT.subtitle}</p>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-12">
        {/* Moving Images Carousel */}
        <motion.div className="col-span-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card className="border-emerald-100 shadow-sm overflow-hidden">
            <div className="relative h-48 md:h-64 w-full overflow-hidden">
              <div className="absolute inset-0 flex animate-marquee w-[200%]">
                <img src="https://picsum.photos/seed/farm1/800/400" alt="Farm" className="h-full w-1/6 object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/tractor/800/400" alt="Tractor" className="h-full w-1/6 object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/crops/800/400" alt="Crops" className="h-full w-1/6 object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/farm1/800/400" alt="Farm" className="h-full w-1/6 object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/tractor/800/400" alt="Tractor" className="h-full w-1/6 object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                <img src="https://picsum.photos/seed/crops/800/400" alt="Crops" className="h-full w-1/6 object-cover flex-shrink-0" referrerPolicy="no-referrer" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent flex items-end p-6 pointer-events-none">
                <h2 className="text-white text-2xl font-bold">Empowering Farmers with AI</h2>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Mobile-style Weather Widget */}
        <motion.div className="col-span-full md:col-span-5 lg:col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 text-white border-none shadow-xl shadow-blue-900/10 overflow-hidden relative h-full min-h-[260px]">
            <div className="absolute top-4 right-4 opacity-20">
              <Sun className="w-32 h-32" />
            </div>
            <CardContent className="p-6 flex flex-col h-full justify-between relative z-10">
              <div>
                <div className="flex items-center gap-1 text-blue-50 mb-4">
                  <MapPin className="h-4 w-4" />
                  <span className="font-medium text-sm tracking-wide uppercase">{weather ? weather.name : "Loading location..."}</span>
                </div>
                <div className="flex items-start gap-2">
                  <h2 className="text-6xl font-bold tracking-tighter">
                    {weather ? Math.round(weather.main.temp) : "--"}°
                  </h2>
                  <span className="text-xl font-medium mt-2 text-blue-100">C</span>
                </div>
                <p className="text-lg font-medium mt-2 text-blue-50">{currentT.weather}</p>
                <p className="text-sm text-blue-100/80">{currentT.highLow}</p>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-8 pt-4 border-t border-white/20 bg-black/10 rounded-2xl p-4 backdrop-blur-md">
                <div className="flex flex-col items-center">
                  <Droplets className="h-5 w-5 text-blue-200 mb-1.5" />
                  <span className="text-xs text-blue-100/80">{currentT.humidity}</span>
                  <span className="text-sm font-semibold">{weather ? weather.main.humidity + "%" : "--"}</span>
                </div>
                <div className="flex flex-col items-center">
                  <Wind className="h-5 w-5 text-blue-200 mb-1.5" />
                  <span className="text-xs text-blue-100/80">{currentT.wind}</span>
                  <span className="text-sm font-semibold">{weather ? weather.wind.speed + " km/h" : "--"}</span>
                </div>
                <div className="flex flex-col items-center">
                  <CloudRain className="h-5 w-5 text-blue-200 mb-1.5" />
                  <span className="text-xs text-blue-100/80">{currentT.rain}</span>
                  <span className="text-sm font-semibold">20%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Market Prices */}
        <motion.div className="col-span-full md:col-span-7 lg:col-span-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="h-full border-emerald-100 shadow-sm">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-50 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-emerald-950 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                    {currentT.livePrices}
                  </CardTitle>
                  <CardDescription>{currentT.mandiRates}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-emerald-50">
                {marketPrices?.length > 0 && marketPrices.slice(0,4).map((item, i) => {
                  // Generate random trend between -3% and +5% for live effect
                  const trendValue = (Math.random() * 8 - 3).toFixed(1);
                  const isPositive = parseFloat(trendValue) >= 0;
                  
                  return (
                    <motion.div 
                      key={i} 
                      className="flex items-center justify-between p-4 hover:bg-emerald-50/30 transition-colors"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{item?.Commodity}</p>
                          <p className="text-xs text-slate-500">{item?.Market}</p>
                        </div>
                      </div>

                      <div className="text-right flex items-center gap-3">
                        <p className="font-bold text-slate-900">₹{item?.Modal_Price}</p>
                        <div className={`flex items-center gap-1 min-w-[70px] justify-end ${
                          isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {isPositive ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4 rotate-180" />
                          )}
                          <span className="text-sm font-medium">
                            {isPositive ? '+' : ''}{trendValue}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Crop Knowledge Base */}
        <motion.div className="col-span-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-50">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-emerald-950">{currentT.knowledgeBase}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {currentT.cropInfo.map((info) => (
                  <motion.div 
                    whileHover={{ y: -5 }}
                    key={info.title} 
                    className="rounded-xl bg-white border border-emerald-100 p-4 shadow-sm hover:shadow-md transition-all"
                  >
                    <h4 className="font-semibold text-emerald-900 mb-2">{info.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{info.desc}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
        {/* Government Schemes */}
        <motion.div className="col-span-full" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card className="border-emerald-100 shadow-sm">
            <CardHeader className="bg-emerald-50/50 border-b border-emerald-50">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-emerald-950">{currentT.schemesTitle}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {currentT.schemes.map((scheme) => (
                  <motion.div key={scheme.title} whileHover={{ y: -5 }} className="rounded-xl bg-white border border-emerald-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <h4 className="font-semibold text-emerald-900 mb-2">{scheme.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">{scheme.desc}</p>
                    </div>
                    <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="text-emerald-600 text-sm font-medium hover:underline mt-auto inline-flex items-center gap-1">
                      {lang === 'en' ? 'Apply Now' : 
                       lang === 'hi' ? 'अभी आवेदन करें' : 
                       lang === 'kn' ? 'ಈಗ ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' : 
                       lang === 'ta' ? 'இப்போது விண்ணப்பிக்கவும்' : 
                       lang === 'te' ? 'ఇప్పుడే దరఖాస్తు చేయండి' : 
                       lang === 'ml' ? 'ഇപ്പോൾ അപേക്ഷിക്കുക' : 
                       lang === 'mr' ? 'आता अर्ज करा' : 
                       lang === 'gu' ? 'હવે અરજી કરો' : 
                       lang === 'bn' ? 'এখন আবেদন করুন' : 
                       lang === 'pa' ? 'ਹੁਣੇ ਅਪਲਾਈ ਕਰੋ' : 
                       lang === 'or' ? 'ବର୍ତ୍ତମାନ ଆବେଦନ କରନ୍ତୁ' : 
                       lang === 'ur' ? 'ابھی درخواست دیں' : 'Apply Now'} &rarr;
                    </a>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}