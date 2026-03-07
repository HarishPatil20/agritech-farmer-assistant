import { Outlet, useLocation, Link } from "react-router-dom"
import { Sidebar } from "./Sidebar"
import { motion, AnimatePresence } from "motion/react"
import { useState } from "react"
import { Languages, LayoutDashboard, Camera, TrendingUp, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

const t = {
  en: { home: "Home", scan: "Scan", market: "Market", chat: "Chat" },
  kn: { home: "ಮುಖಪುಟ", scan: "ಸ್ಕ್ಯಾನ್", market: "ಮಾರುಕಟ್ಟೆ", chat: "ಚಾಟ್" },
  hi: { home: "होम", scan: "स्कैन", market: "बाजार", chat: "चैट" },
  ta: { home: "முகப்பு", scan: "ஸ்கேன்", market: "சந்தை", chat: "அரட்டை" },
  te: { home: "హోమ్", scan: "స్కాన్", market: "మార్కెట్", chat: "చాట్" },
  ml: { home: "ഹോം", scan: "സ്കാൻ", market: "വിപണി", chat: "ചാറ്റ്" },
  mr: { home: "मुख्यपृष्ठ", scan: "स्कॅन", market: "बाजार", chat: "चॅट" },
  gu: { home: "હોમ", scan: "સ્કેન", market: "બજાર", chat: "ચેટ" },
  bn: { home: "হোম", scan: "স্ক্যান", market: "বাজার", chat: "চ্যাট" },
  pa: { home: "ਮੁੱਖ ਪੰਨਾ", scan: "ਸਕੈਨ", market: "ਬਾਜ਼ਾਰ", chat: "ਚੈਟ" },
  or: { home: "ହୋମ୍", scan: "ସ୍କାନ୍", market: "ବଜାର", chat: "ଚାଟ୍" },
  ur: { home: "ہوم", scan: "اسکین", market: "مارکیٹ", chat: "چیٹ" }
}

type Lang = keyof typeof t

export function Layout() {
  const location = useLocation()
  const [lang, setLang] = useState("en")
  const currentLang = (lang in t ? lang : "en") as Lang
  const currentT = t[currentLang]

  const links = [
    { name: currentT.home, href: "/dashboard", icon: LayoutDashboard },
    { name: currentT.scan, href: "/disease-detection", icon: Camera },
    { name: currentT.market, href: "/market", icon: TrendingUp },
    { name: currentT.chat, href: "/chatbot", icon: MessageSquare },
  ]

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f4f9f5] flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-emerald-950 text-white z-20 shadow-md">
        <span className="font-bold tracking-wide text-lg">AgriTech</span>
        <div className="flex items-center gap-2 bg-emerald-900/50 p-1.5 rounded-lg border border-emerald-800">
          <Languages className="h-4 w-4 text-emerald-400" />
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)}
            className="bg-transparent border-none text-xs font-medium text-white focus:ring-0 cursor-pointer outline-none"
          >
            <option value="en" className="text-black">EN</option>
            <option value="kn" className="text-black">KN</option>
            <option value="hi" className="text-black">HI</option>
            <option value="ta" className="text-black">TA</option>
            <option value="te" className="text-black">TE</option>
            <option value="ml" className="text-black">ML</option>
            <option value="mr" className="text-black">MR</option>
            <option value="gu" className="text-black">GU</option>
            <option value="bn" className="text-black">BN</option>
            <option value="pa" className="text-black">PA</option>
            <option value="or" className="text-black">OR</option>
            <option value="ur" className="text-black">UR</option>
          </select>
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar lang={lang} setLang={setLang} />
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative pb-24 md:pb-8">
        <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/leaves/1920/1080')] opacity-[0.03] pointer-events-none bg-cover bg-center mix-blend-multiply"></div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full relative z-10 max-w-6xl mx-auto"
          >
            <Outlet context={{ lang, setLang }} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-emerald-100 flex justify-around p-2 z-50 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = location.pathname === link.href
          return (
            <Link
              key={link.name}
              to={link.href}
              className={cn(
                "flex flex-col items-center gap-1 p-2 rounded-xl min-w-[64px] transition-all",
                isActive ? "text-emerald-600" : "text-slate-400 hover:text-emerald-500"
              )}
            >
              <div className={cn("p-1.5 rounded-full transition-colors", isActive ? "bg-emerald-100" : "")}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[10px] font-medium">{link.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
