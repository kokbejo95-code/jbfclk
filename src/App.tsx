import { useState, useEffect, useRef } from 'react';
import { CheckCircle2, ExternalLink, ShieldCheck, Zap, Info, MousePointer2, Loader2, ShieldAlert, RefreshCw, XCircle, Shield } from 'lucide-react';

// Placeholders - Replace these with your actual values
const FACEBOOK_PAGE_URL = "https://www.facebook.com/jbzytech"; 
const FINAL_LINK = "https://example.com/your-secret-link";

export default function App() {
  const [status, setStatus] = useState<'unverified' | 'interacted' | 'checking' | 'failed' | 'verified'>('unverified');
  const [isMouseOver, setIsMouseOver] = useState(false);
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [iframeKey, setIframeKey] = useState(0); 
  const containerRef = useRef<HTMLDivElement>(null);
  const interactionTime = useRef<number>(0);

  // Load Facebook SDK
  useEffect(() => {
    const loadSDK = () => {
      if (document.getElementById('facebook-jssdk')) {
        setSdkLoaded(true);
        return;
      }
      const fjs = document.getElementsByTagName('script')[0];
      const js = document.createElement('script') as HTMLScriptElement;
      js.id = 'facebook-jssdk';
      js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v18.0";
      fjs.parentNode?.insertBefore(js, fjs);
      js.onload = () => setSdkLoaded(true);
    };
    loadSDK();
  }, []);

  // Detect interaction with the iframe
  useEffect(() => {
    const handleBlur = () => {
      if (isMouseOver) {
        interactionTime.current = Date.now();
        setStatus('interacted');
      }
    };
    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, [isMouseOver]);

  const handleVerify = () => {
    // If they haven't interacted at all, it's a definite fail
    if (status === 'unverified') {
      setStatus('failed');
      return;
    }

    setStatus('checking');
    
    // Simulate a more rigorous check
    setTimeout(() => {
      const timeSinceInteraction = Date.now() - interactionTime.current;
      
      // If interaction was too long ago or non-existent, fail
      if (timeSinceInteraction > 120000 || status === 'unverified') {
        setStatus('failed');
      } else {
        setStatus('verified');
      }
    }, 4000);
  };

  const refreshStatus = () => {
    setIframeKey(prev => prev + 1);
    setStatus('unverified');
    interactionTime.current = 0;
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-50 font-sans" dir="rtl">
      {/* Header */}
      <header className="pt-16 pb-12 px-4 text-center bg-gradient-to-b from-blue-900/20 to-transparent">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
            <Shield size={16} />
            <span>Copyright for the blog jbzy2tech.blogspot.com</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            بوابة <span className="text-blue-500">المحتوى الآمن</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl mb-8 leading-relaxed">
            يجب تأكيد المتابعة الحقيقية لفتح الرابط المشفر.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-2xl mx-auto w-full px-4 pb-20">
        <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 md:p-12 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10">
            {/* Status Indicator */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold mb-8 border transition-all ${
              status === 'verified' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 
              status === 'failed' ? 'bg-red-500/10 border-red-500/20 text-red-500' :
              status === 'interacted' ? 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500' :
              'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              {status === 'verified' ? <CheckCircle2 size={14} /> : status === 'failed' ? <XCircle size={14} /> : <RefreshCw size={14} className={status === 'checking' ? 'animate-spin' : ''} />}
              {status === 'verified' ? 'الحالة: متابع مؤكد' : status === 'checking' ? 'جاري المزامنة...' : status === 'failed' ? 'فشل التحقق' : status === 'interacted' ? 'تم رصد تفاعل - اضغط تأكيد' : 'الحالة: بانتظار المتابعة'}
            </div>

            {(status === 'unverified' || status === 'interacted' || status === 'failed') && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-4 text-white">1. اضغط متابعة:</h2>
                  <div 
                    ref={containerRef}
                    onMouseEnter={() => setIsMouseOver(true)}
                    onMouseLeave={() => setIsMouseOver(false)}
                    className="relative group bg-white p-10 rounded-[2rem] flex flex-col items-center justify-center shadow-2xl border-4 border-blue-500/30 min-h-[180px]"
                  >
                    {!sdkLoaded && <Loader2 className="animate-spin text-slate-400" size={24} />}
                    <div className={`transform scale-[1.8] py-6 ${sdkLoaded ? 'opacity-100' : 'opacity-0'}`}>
                      <iframe 
                        key={iframeKey}
                        src={`https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(FACEBOOK_PAGE_URL)}&tabs&width=180&height=70&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId`} 
                        width="180" height="70" style={{ border: 'none', overflow: 'hidden' }} scrolling="no" frameBorder="0" allowFullScreen={true} allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      ></iframe>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4 text-white text-right">2. تأكيد المتابعة:</h2>
                  <button 
                    onClick={handleVerify}
                    className="w-full py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-3"
                  >
                    تأكيد المتابعة الآن
                    <ShieldCheck size={24} />
                  </button>
                  
                  {status === 'failed' && (
                    <p className="text-red-500 text-sm animate-bounce">
                      يرجى التأكد من الضغط على زر المتابعة أعلاه أولاً!
                    </p>
                  )}
                </div>
              </div>
            )}

            {status === 'checking' && (
              <div className="py-12 animate-in fade-in duration-300">
                <Loader2 size={64} className="text-blue-500 animate-spin mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-white mb-2">فحص بروتوكول الأمان...</h2>
                <p className="text-slate-400">نتأكد من أن المتابعة حقيقية وليست وهمية.</p>
                <div className="mt-8 w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full animate-[progress_4s_linear]"></div>
                </div>
              </div>
            )}

            {status === 'verified' && (
              <div className="animate-in fade-in zoom-in duration-500">
                <div className="w-20 h-20 bg-green-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white">تم التحقق بنجاح!</h2>
                <p className="text-slate-400 mb-8">تم فتح الرابط. يرجى عدم إلغاء المتابعة لضمان استمرار الوصول.</p>

                <div className="w-full p-8 bg-green-600 rounded-3xl shadow-2xl border border-green-500/30">
                  <a href={FINAL_LINK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-4 bg-white text-green-700 px-10 py-5 rounded-2xl font-bold text-2xl hover:bg-slate-100 transition-all w-full justify-center">
                    اذهب للرابط الآن
                    <ExternalLink size={28} />
                  </a>
                </div>
                
                <button onClick={refreshStatus} className="mt-10 text-slate-500 text-sm hover:text-slate-400 underline flex items-center justify-center gap-2 mx-auto">
                  <RefreshCw size={14} />
                  إعادة فحص حالة المتابعة
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Security Info */}
        <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/20 rounded-3xl flex items-start gap-4 text-blue-400 text-sm leading-relaxed">
          <ShieldAlert size={24} className="shrink-0 mt-1" />
          <p>
            **نظام الحماية:** هذا النظام يكتشف إلغاء المتابعة التلقائي. إذا قمت بإلغاء المتابعة، قد يتم حظرك من الوصول إلى الروابط المستقبلية. نحن نستخدم تقنيات متوافقة مع سياسات فيسبوك الرسمية.
          </p>
        </div>
      </main>

      <footer className="py-10 text-center text-slate-700 text-xs border-t border-slate-900 mt-auto">
        <p>&copy; {new Date().getFullYear()} Jbzy Tech - جميع الحقوق محفوظة</p>
      </footer>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
