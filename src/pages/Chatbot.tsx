import React, { useState, useRef, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Send, Bot, User, Loader2, Globe } from "lucide-react"
import { sendMessageToChatbot } from "@/services/geminiService"
import { cn } from "@/lib/utils"

const t = {
  en: {
    title: "Farmer Assistant",
    subtitle: "Multilingual AI Chatbot (Kannada, English, Malayalam, Tamil, Telugu)",
    online: "Online | Ready to help",
    typing: "Typing...",
    placeholder: "Ask about crop diseases, fertilizers, or schemes...",
    poweredBy: "Powered by Google Gemini AI",
    you: "You",
    error: "Sorry, I am having trouble connecting right now. Please try again later.",
    welcome: "Hello! I am your AgriTech Assistant. I can speak Kannada, English, Malayalam, Tamil, and Telugu. How can I help you with your crops today?"
  },
  kn: {
    title: "ರೈತ ಸಹಾಯಕ",
    subtitle: "ಬಹುಭಾಷಾ AI ಚಾಟ್‌ಬಾಟ್ (ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್, ಮಲಯಾಳಂ, ತಮಿಳು, ತೆಲುಗು)",
    online: "ಆನ್‌ಲೈನ್ | ಸಹಾಯ ಮಾಡಲು ಸಿದ್ಧ",
    typing: "ಟೈಪ್ ಮಾಡಲಾಗುತ್ತಿದೆ...",
    placeholder: "ಬೆಳೆ ರೋಗಗಳು, ರಸಗೊಬ್ಬರಗಳು ಅಥವಾ ಯೋಜನೆಗಳ ಬಗ್ಗೆ ಕೇಳಿ...",
    poweredBy: "Google Gemini AI ನಿಂದ ನಡೆಸಲ್ಪಡುತ್ತಿದೆ",
    you: "ನೀವು",
    error: "ಕ್ಷಮಿಸಿ, ಸಂಪರ್ಕಿಸುವಲ್ಲಿ ನನಗೆ ತೊಂದರೆಯಾಗುತ್ತಿದೆ. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    welcome: "ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ಅಗ್ರಿಟೆಕ್ ಸಹಾಯಕ. ನಾನು ಕನ್ನಡ, ಇಂಗ್ಲಿಷ್, ಮಲಯಾಳಂ, ತಮಿಳು ಮತ್ತು ತೆಲುಗು ಮಾತನಾಡಬಲ್ಲೆ. ಇಂದು ನಿಮ್ಮ ಬೆಳೆಗಳಿಗೆ ನಾನು ಹೇಗೆ ಸಹಾಯ ಮಾಡಬಹುದು?"
  },
  hi: {
    title: "किसान सहायक",
    subtitle: "बहुभाषी AI चैटबॉट (कन्नड़, अंग्रेजी, मलयालम, तमिल, तेलुगु)",
    online: "ऑनलाइन | मदद के लिए तैयार",
    typing: "टाइप कर रहा है...",
    placeholder: "फसल रोगों, उर्वरकों या योजनाओं के बारे में पूछें...",
    poweredBy: "Google Gemini AI द्वारा संचालित",
    you: "आप",
    error: "क्षमा करें, मुझे अभी कनेक्ट करने में परेशानी हो रही है। कृपया बाद में पुनः प्रयास करें।",
    welcome: "नमस्ते! मैं आपका एग्रीटेक सहायक हूँ। मैं कन्नड़, अंग्रेजी, मलयालम, तमिल और तेलुगु बोल सकता हूँ। आज मैं आपकी फसलों के साथ आपकी कैसे मदद कर सकता हूँ?"
  },
  ta: {
    title: "விவசாயி உதவியாளர்",
    subtitle: "பன்மொழி AI சாட்போட் (கன்னடம், ஆங்கிலம், மலையாளம், தமிழ், தெலுங்கு)",
    online: "ஆன்லைன் | உதவ தயார்",
    typing: "தட்டச்சு செய்கிறது...",
    placeholder: "பயிர் நோய்கள், உரங்கள் அல்லது திட்டங்கள் பற்றி கேளுங்கள்...",
    poweredBy: "Google Gemini AI ஆல் இயக்கப்படுகிறது",
    you: "நீங்கள்",
    error: "மன்னிக்கவும், இணைப்பதில் சிக்கல் உள்ளது. சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்.",
    welcome: "வணக்கம்! நான் உங்கள் அக்ரிடெக் உதவியாளர். நான் கன்னடம், ஆங்கிலம், மலையாளம், தமிழ் மற்றும் தெலுங்கு பேச முடியும். இன்று உங்கள் பயிர்களுக்கு நான் எவ்வாறு உதவ முடியும்?"
  },
  te: {
    title: "రైతు సహాయకుడు",
    subtitle: "బహుభాషా AI చాట్‌బాట్ (కన్నడ, ఇంగ్లీష్, మలయాళం, తమిళం, తెలుగు)",
    online: "ఆన్‌లైన్ | సహాయం చేయడానికి సిద్ధంగా ఉంది",
    typing: "టైప్ చేస్తోంది...",
    placeholder: "పంట వ్యాధులు, ఎరువులు లేదా పథకాల గురించి అడగండి...",
    poweredBy: "Google Gemini AI ద్వారా ఆధారితం",
    you: "మీరు",
    error: "క్షమించండి, కనెక్ట్ చేయడంలో నాకు ఇబ్బంది ఉంది. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.",
    welcome: "నమస్కారం! నేను మీ అగ్రిటెక్ అసిస్టెంట్‌ని. నేను కన్నడ, ఇంగ్లీష్, మలయాళం, తమిళం మరియు తెలుగు మాట్లాడగలను. ఈ రోజు మీ పంటలతో నేను మీకు ఎలా సహాయం చేయగలను?"
  },
  ml: {
    title: "കർഷക സഹായി",
    subtitle: "ബഹുഭാഷാ AI ചാറ്റ്ബോട്ട് (കന്നഡ, ഇംഗ്ലീഷ്, മലയാളം, തമിഴ്, തെലുങ്ക്)",
    online: "ഓൺലൈൻ | സഹായിക്കാൻ തയ്യാറാണ്",
    typing: "ടൈപ്പ് ചെയ്യുന്നു...",
    placeholder: "വിള രോഗങ്ങൾ, വളങ്ങൾ അല്ലെങ്കിൽ പദ്ധതികളെക്കുറിച്ച് ചോദിക്കുക...",
    poweredBy: "Google Gemini AI നൽകുന്നത്",
    you: "നിങ്ങൾ",
    error: "ക്ഷമിക്കണം, ബന്ധിപ്പിക്കുന്നതിൽ എനിക്ക് പ്രശ്നമുണ്ട്. ദയവായി പിന്നീട് വീണ്ടും ശ്രമിക്കുക.",
    welcome: "നമസ്കാരം! ഞാൻ നിങ്ങളുടെ അഗ്രിടെക് അസിസ്റ്റന്റാണ്. എനിക്ക് കന്നഡ, ഇംഗ്ലീഷ്, മലയാളം, തമിഴ്, തെലുങ്ക് സംസാരിക്കാൻ കഴിയും. ഇന്ന് നിങ്ങളുടെ വിളകളെ എങ്ങനെ സഹായിക്കാനാകും?"
  },
  mr: { title: "शेतकरी सहाय्यक", subtitle: "बहुभाषिक AI चॅटबॉट", online: "ऑनलाइन | मदतीसाठी तयार", typing: "टाइप करत आहे...", placeholder: "पीक रोग, खते किंवा योजनांबद्दल विचारा...", poweredBy: "Google Gemini AI द्वारे समर्थित", you: "तुम्ही", error: "क्षमस्व, कनेक्ट करण्यात समस्या येत आहे. कृपया नंतर पुन्हा प्रयत्न करा.", welcome: "नमस्कार! मी तुमचा कृषी सहाय्यक आहे. मी तुम्हाला कशी मदत करू शकतो?" },
  gu: { title: "ખેડૂત સહાયક", subtitle: "બહુભાષી AI ચેટબોટ", online: "ઓનલાઇન | મદદ માટે તૈયાર", typing: "ટાઇપ કરી રહ્યું છે...", placeholder: "પાકના રોગો, ખાતરો અથવા યોજનાઓ વિશે પૂછો...", poweredBy: "Google Gemini AI દ્વારા સંચાલિત", you: "તમે", error: "માફ કરશો, કનેક્ટ કરવામાં સમસ્યા આવી રહી છે. કૃપા કરીને પછીથી ફરી પ્રયાસ કરો.", welcome: "નમસ્તે! હું તમારો કૃષિ સહાયક છું. હું તમને કેવી રીતે મદદ કરી શકું?" },
  bn: { title: "কৃষক সহকারী", subtitle: "বহুভাষিক এআই চ্যাটবট", online: "অনলাইন | সাহায্য করতে প্রস্তুত", typing: "টাইপ করা হচ্ছে...", placeholder: "ফসলের রোগ, সার বা স্কিম সম্পর্কে জিজ্ঞাসা করুন...", poweredBy: "Google Gemini AI দ্বারা চালিত", you: "আপনি", error: "দুঃখিত, সংযোগ করতে সমস্যা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।", welcome: "হ্যালো! আমি আপনার কৃষি সহকারী। আমি আপনাকে কীভাবে সাহায্য করতে পারি?" },
  pa: { title: "ਕਿਸਾਨ ਸਹਾਇਕ", subtitle: "ਬਹੁ-ਭਾਸ਼ਾਈ AI ਚੈਟਬੋਟ", online: "ਔਨਲਾਈਨ | ਮਦਦ ਲਈ ਤਿਆਰ", typing: "ਟਾਈਪ ਕਰ ਰਿਹਾ ਹੈ...", placeholder: "ਫਸਲਾਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ, ਖਾਦਾਂ ਜਾਂ ਸਕੀਮਾਂ ਬਾਰੇ ਪੁੱਛੋ...", poweredBy: "Google Gemini AI ਦੁਆਰਾ ਸੰਚਾਲਿਤ", you: "ਤੁਸੀਂ", error: "ਮੁਆਫ ਕਰਨਾ, ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਆ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਬਾਅਦ ਵਿੱਚ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।", welcome: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਤੁਹਾਡੀ ਕਿਵੇਂ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?" },
  or: { title: "କୃଷକ ସହାୟକ", subtitle: "ବହୁଭାଷୀ AI ଚାଟବଟ୍", online: "ଅନଲାଇନ୍ | ସାହାଯ୍ୟ ପାଇଁ ପ୍ରସ୍ତୁତ", typing: "ଟାଇପ୍ କରୁଛି...", placeholder: "ଫସଲ ରୋଗ, ସାର କିମ୍ବା ଯୋଜନା ବିଷୟରେ ପଚାରନ୍ତୁ...", poweredBy: "Google Gemini AI ଦ୍ୱାରା ପରିଚାଳିତ", you: "ଆପଣ", error: "କ୍ଷମା କରିବେ, ସଂଯୋଗ କରିବାରେ ସମସ୍ୟା ହେଉଛି। ଦୟାକରି ପରେ ପୁଣି ଚେଷ୍ଟା କରନ୍ତୁ।", welcome: "ନମସ୍କାର! ମୁଁ ଆପଣଙ୍କର କୃଷି ସହାୟକ। ମୁଁ ଆପଣଙ୍କୁ କିପରି ସାହାଯ୍ୟ କରିପାରିବି?" },
  ur: { title: "کسان کا معاون", subtitle: "کثیر لسانی AI چیٹ بوٹ", online: "آن لائن | مدد کے لیے تیار", typing: "ٹائپ کر رہا ہے...", placeholder: "فصل کی بیماریوں، کھادوں یا اسکیموں کے بارے میں پوچھیں...", poweredBy: "Google Gemini AI کے ذریعے تقویت یافتہ", you: "آپ", error: "معذرت، جڑنے میں مسئلہ ہو رہا ہے۔ براہ کرم بعد میں دوبارہ کوشش کریں۔", welcome: "ہیلو! میں آپ کا زرعی معاون ہوں۔ میں آپ کی کیسے مدد کر سکتا ہوں؟" }
}

type Lang = keyof typeof t

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

export function Chatbot() {
  const { lang: contextLang } = useOutletContext<{ lang: string }>() || { lang: "en" }
  const lang = (contextLang in t ? contextLang : "en") as Lang
  const currentT = t[lang]

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: currentT.welcome
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Update welcome message when language changes
  useEffect(() => {
    setMessages(prev => {
      const newMessages = [...prev]
      if (newMessages.length > 0 && newMessages[0].id === "1") {
        newMessages[0].content = currentT.welcome
      }
      return newMessages
    })
  }, [currentT.welcome])

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim()
    }

    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await sendMessageToChatbot(userMessage.content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error("Failed to send message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: currentT.error
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] md:h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{currentT.title}</h1>
        <p className="text-slate-500 flex items-center gap-2 mt-1">
          <Globe className="h-4 w-4" />
          {currentT.subtitle}
        </p>
      </div>

      <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-md">
        <CardHeader className="bg-emerald-50 border-b border-emerald-100 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-600 p-2 rounded-full">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg text-emerald-900">AgriBot</CardTitle>
              <CardDescription className="text-emerald-700">{currentT.online}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex w-max max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm",
                msg.role === "user"
                  ? "ml-auto bg-emerald-600 text-white rounded-tr-none"
                  : "bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm"
              )}
            >
              <div className="flex items-center gap-2 mb-1 opacity-80 text-xs font-medium">
                {msg.role === "user" ? (
                  <>{currentT.you} <User className="h-3 w-3" /></>
                ) : (
                  <><Bot className="h-3 w-3" /> AgriBot</>
                )}
              </div>
              <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
            </div>
          ))}
          {isLoading && (
            <div className="flex w-max max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-3 text-sm bg-white border border-slate-200 text-slate-900 rounded-tl-none shadow-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                <span className="text-slate-500">{currentT.typing}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>

        <div className="p-4 bg-white border-t border-slate-200">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={currentT.placeholder}
              className="flex-1 rounded-full px-4 focus-visible:ring-emerald-500"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="icon" 
              className="rounded-full bg-emerald-600 hover:bg-emerald-700 h-10 w-10 shrink-0"
              disabled={!input.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-2 text-xs text-slate-400">
            {currentT.poweredBy}
          </div>
        </div>
      </Card>
    </div>
  )
}
