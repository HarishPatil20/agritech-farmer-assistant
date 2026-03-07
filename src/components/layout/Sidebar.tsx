import { Link, useLocation } from "react-router-dom"
import { Leaf, LayoutDashboard, MessageSquare, LogOut, Camera, TrendingUp, Languages } from "lucide-react"
import { cn } from "@/lib/utils"

interface SidebarProps {
  lang?: string
  setLang?: (lang: string) => void
}

const t = {
  en: {
    dashboard: "Dashboard",
    diseaseDetection: "Disease Detection",
    marketPrices: "Market Prices",
    farmerAssistant: "Farmer Assistant",
    logout: "Log out"
  },
  kn: {
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    diseaseDetection: "ರೋಗ ಪತ್ತೆ",
    marketPrices: "ಮಾರುಕಟ್ಟೆ ಬೆಲೆಗಳು",
    farmerAssistant: "ರೈತ ಸಹಾಯಕ",
    logout: "ಲಾಗ್ ಔಟ್"
  },
  hi: {
    dashboard: "डैशबोर्ड",
    diseaseDetection: "रोग पहचान",
    marketPrices: "बाजार भाव",
    farmerAssistant: "किसान सहायक",
    logout: "लॉग आउट"
  },
  ta: {
    dashboard: "டாஷ்போர்டு",
    diseaseDetection: "நோய் கண்டறிதல்",
    marketPrices: "சந்தை விலைகள்",
    farmerAssistant: "விவசாயி உதவியாளர்",
    logout: "வெளியேறு"
  },
  te: {
    dashboard: "డాష్‌బోర్డ్",
    diseaseDetection: "వ్యాధి గుర్తింపు",
    marketPrices: "మార్కెట్ ధరలు",
    farmerAssistant: "రైతు సహాయకుడు",
    logout: "లాగ్ అవుట్"
  },
  ml: {
    dashboard: "ഡാഷ്ബോർഡ്",
    diseaseDetection: "രോഗ നിർണ്ണയം",
    marketPrices: "വിപണി വിലകൾ",
    farmerAssistant: "കർഷക സഹായി",
    logout: "ലോഗ് ഔട്ട്"
  },
  mr: { dashboard: "डॅशबोर्ड", diseaseDetection: "रोग शोध", marketPrices: "बाजारभाव", farmerAssistant: "शेतकरी सहाय्यक", logout: "लॉग आउट" },
  gu: { dashboard: "ડેશબોર્ડ", diseaseDetection: "રોગ નિદાન", marketPrices: "બજાર ભાવ", farmerAssistant: "ખેડૂત સહાયક", logout: "લૉગ આઉટ" },
  bn: { dashboard: "ড্যাশবোর্ড", diseaseDetection: "রোগ নির্ণয়", marketPrices: "বাজার দর", farmerAssistant: "কৃষক সহকারী", logout: "লগ আউট" },
  pa: { dashboard: "ਡੈਸ਼ਬੋਰਡ", diseaseDetection: "ਰੋਗ ਪਛਾਣ", marketPrices: "ਬਾਜ਼ਾਰ ਦੀਆਂ ਕੀਮਤਾਂ", farmerAssistant: "ਕਿਸਾਨ ਸਹਾਇਕ", logout: "ਲਾਗ ਆਉਟ" },
  or: { dashboard: "ଡ୍ୟାସବୋର୍ଡ", diseaseDetection: "ରୋଗ ଚିହ୍ନଟ", marketPrices: "ବଜାର ଦର", farmerAssistant: "କୃଷକ ସହାୟକ", logout: "ଲଗ୍ ଆଉଟ୍" },
  ur: { dashboard: "ڈیش بورڈ", diseaseDetection: "بیماری کی تشخیص", marketPrices: "مارکیٹ کی قیمتیں", farmerAssistant: "کسان کا معاون", logout: "لاگ آؤٹ" }
}

type Lang = keyof typeof t

export function Sidebar({ lang = "en", setLang }: SidebarProps) {
  const location = useLocation()
  const currentLang = (lang in t ? lang : "en") as Lang
  const currentT = t[currentLang]
  
  const links = [
    { name: currentT.dashboard, href: "/dashboard", icon: LayoutDashboard },
    { name: currentT.diseaseDetection, href: "/disease-detection", icon: Camera },
    { name: currentT.marketPrices, href: "/market", icon: TrendingUp },
    { name: currentT.farmerAssistant, href: "/chatbot", icon: MessageSquare },
  ]

  return (
    <div className="flex h-full w-64 flex-col bg-emerald-950 text-white shadow-xl relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-emerald-800/50 to-transparent pointer-events-none"></div>
      
      <div className="flex h-20 items-center gap-3 px-6 relative z-10 border-b border-emerald-800/50">
        <div className="rounded-xl bg-emerald-500 p-2 shadow-lg shadow-emerald-500/20">
          <Leaf className="h-6 w-6 text-white" />
        </div>
        <span className="text-2xl font-bold tracking-wide text-emerald-50">AgriTech</span>
      </div>
      
      <nav className="flex-1 space-y-2 px-4 py-6 relative z-10">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname === link.href
          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200 group relative overflow-hidden",
                isActive 
                  ? "text-emerald-950 bg-emerald-400 shadow-md shadow-emerald-900/20" 
                  : "text-emerald-100/80 hover:bg-emerald-900/50 hover:text-white"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-full"></div>
              )}
              <Icon className={cn("h-5 w-5 transition-transform duration-200", isActive ? "scale-110" : "group-hover:scale-110")} />
              {link.name}
            </Link>
          )
        })}
      </nav>
      
      <div className="mt-auto border-t border-emerald-800/50 p-4 bg-emerald-900/20 space-y-3 relative z-10">
        {setLang && (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-emerald-300 bg-emerald-950/50 border border-emerald-800/50">
            <Languages className="h-5 w-5 text-emerald-400 shrink-0" />
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="bg-transparent border-none text-sm font-medium text-emerald-100 focus:ring-0 cursor-pointer outline-none w-full appearance-none"
            >
              <option value="en" className="text-black">English</option>
              <option value="kn" className="text-black">ಕನ್ನಡ (Kannada)</option>
              <option value="hi" className="text-black">हिंदी (Hindi)</option>
              <option value="ta" className="text-black">தமிழ் (Tamil)</option>
              <option value="te" className="text-black">తెలుగు (Telugu)</option>
              <option value="ml" className="text-black">മലയാളം (Malayalam)</option>
              <option value="mr" className="text-black">मराठी (Marathi)</option>
              <option value="gu" className="text-black">ગુજરાતી (Gujarati)</option>
              <option value="bn" className="text-black">বাংলা (Bengali)</option>
              <option value="pa" className="text-black">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="or" className="text-black">ଓଡ଼ିଆ (Odia)</option>
              <option value="ur" className="text-black">اردو (Urdu)</option>
            </select>
          </div>
        )}
        
        <Link
          to="/"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-emerald-200/80 transition-all hover:bg-red-500/10 hover:text-red-400 group"
        >
          <LogOut className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
          {currentT.logout}
        </Link>
      </div>
    </div>
  )
}
