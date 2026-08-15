"use client"
import { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  GitPullRequest, Zap, Terminal, Search, Bell, 
  Command, ArrowUpRight, Cpu, Code2, Clock, 
  ChevronRight, LayoutGrid, ShieldCheck, GitBranch, 
  AlertTriangle, CheckCircle2, History, ShieldAlert, LogOut
} from "lucide-react"

// 1. Struktur Data
interface Review {
  id: number; repo_name: string; author: string; 
  ai_response: string; created_at: string; pr_number: number;
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Dashboard")

  // 2. Fungsi Ambil Data
  const fetchReviews = async () => {
    try {
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/reviews?user=${session?.user?.name}`)
      const data = await res.json()
      setReviews(data)
      setLoading(false)
    } catch (e) {
      console.log("Backend offline...")
    }
  }

  useEffect(() => {
    if (session) {
      fetchReviews()
      const interval = setInterval(fetchReviews, 5000)
      return () => clearInterval(interval)
    }
  }, [session])

  // 3. Logika Filter Data
  const securityReviews = reviews.filter(r => 
    r.ai_response.toLowerCase().includes("security") || 
    r.ai_response.toLowerCase().includes("password") || 
    r.ai_response.toLowerCase().includes("leak") ||
    r.ai_response.toLowerCase().includes("bahaya")
  )

  const uniqueRepos = [...new Set(reviews.map(r => r.repo_name))]

  // 4. Pencegatan Login
  if (status === "loading") return <div className="min-h-screen flex items-center justify-center bg-white font-bold">LOADING...</div>

  if (!session) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
        <ShieldCheck size={60} className="text-blue-600 mb-6" />
        <h1 className="text-4xl font-black text-slate-900 mb-4">Access Denied</h1>
        <p className="text-slate-500 mb-10 max-w-sm font-medium">Please sign in with GitHub to access DevPulse dashboard.</p>
        <button onClick={() => signIn("github")} className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl flex items-center gap-3">
          <GitBranch size={20} /> Sign in with GitHub
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-[#1a1a1a] font-sans selection:bg-blue-100">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-72 border-r border-slate-200 flex flex-col p-6 hidden lg:flex bg-white">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">DevPulse</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<LayoutGrid size={19}/>} label="Dashboard" active={activeTab === "Dashboard"} onClick={() => setActiveTab("Dashboard")} />
          <NavItem icon={<GitBranch size={19}/>} label="Pull Requests" active={activeTab === "Pull Requests"} onClick={() => setActiveTab("Pull Requests")} />
          <NavItem icon={<ShieldCheck size={19}/>} label="Security Scan" active={activeTab === "Security"} onClick={() => setActiveTab("Security")} />
          <NavItem icon={<History size={19}/>} label="Audit Logs" active={activeTab === "Logs"} onClick={() => setActiveTab("Logs")} />
        </nav>

        <div className="mt-auto p-5 bg-slate-50 rounded-2xl border border-slate-200 text-slate-900">
          <div className="flex items-center gap-3 mb-4">
            <img src={session.user?.image || ""} className="w-8 h-8 rounded-full border border-white shadow-sm" alt="profile" />
            <div className="overflow-hidden">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Authenticated</p>
               <p className="text-xs font-bold truncate">{session.user?.name}</p>
            </div>
          </div>
          <button onClick={() => signOut()} className="w-full py-2.5 bg-white border border-red-100 rounded-xl text-[10px] font-black text-red-500 hover:bg-red-50 transition-all uppercase tracking-widest flex items-center justify-center gap-2">
            <LogOut size={12} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden text-slate-900">
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4 text-slate-400 font-medium text-sm">
            <Command size={16} /> <div className="h-4 w-[1px] bg-slate-200" />
            <span className="font-bold text-slate-900 uppercase tracking-wide">{activeTab}</span>
          </div>
          <div className="flex items-center gap-6">
            <Bell size={18} className="text-slate-400" />
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">IT</div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
          <div className="max-w-5xl mx-auto text-slate-900">
            <AnimatePresence mode="wait">

              {/* TAB 1: DASHBOARD */}
              {activeTab === "Dashboard" && (
                <motion.div key="dash" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="space-y-4">
                  <div className="mb-10">
                    <h2 className="text-4xl font-bold tracking-tight text-slate-900 mb-2">Review Feed</h2>
                    <p className="text-slate-500 font-medium italic text-sm">Welcome back, {session.user?.name}. Here are your latest code reports.</p>
                  </div>
                  {reviews.length > 0 ? (
                    reviews.map((r, index) => <ReviewCard key={r.id} r={r} index={index} />)
                  ) : (
                    <div className="py-20 text-center text-slate-400 font-medium border-2 border-dashed border-slate-200 rounded-[3rem]">Waiting for GitHub telemetry data...</div>
                  )}
                </motion.div>
              )}

              {/* TAB 2: PULL REQUESTS (LIST REPO) */}
              {activeTab === "Pull Requests" && (
                <motion.div key="prs" initial={{opacity:0, y: 10}} animate={{opacity:1, y: 0}} exit={{opacity:0}}>
                  <h2 className="text-3xl font-bold text-slate-900 mb-8">Active Repositories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uniqueRepos.length > 0 ? uniqueRepos.map(repo => (
                      <div key={repo} className="p-6 bg-white border border-slate-200 rounded-[2rem] flex justify-between items-center shadow-sm hover:border-blue-500 transition-all group">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
                             <Code2 size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{repo}</h4>
                            <p className="text-sm text-slate-500">{reviews.filter(r => r.repo_name === repo).length} Total Analysis</p>
                          </div>
                        </div>
                        <ChevronRight className="text-slate-300" />
                      </div>
                    )) : <p className="text-slate-400 italic">No repositories detected yet.</p>}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: SECURITY SCAN */}
              {activeTab === "Security" && (
                <motion.div key="sec" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Security Hub</h2>
                  <p className="text-slate-500 mb-10">Monitoring for critical vulnerabilities and leaked secrets.</p>
                  {securityReviews.length > 0 ? (
                    securityReviews.map((r) => (
                      <div key={r.id} className="p-6 bg-red-50 border border-red-100 rounded-[1.5rem] mb-4 flex gap-4">
                        <ShieldAlert className="text-red-600 shrink-0" size={24} />
                        <div>
                          <h4 className="font-bold text-red-900 mb-2">{r.repo_name} - Pull Request #{r.pr_number}</h4>
                          <div className="p-4 bg-white/50 rounded-xl text-sm text-red-700 italic border border-red-100 leading-relaxed font-medium">"{r.ai_response.substring(0, 300)}..."</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-32 text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
                      <ShieldCheck size={48} className="mx-auto text-green-500 mb-4" />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No Security Risks Found</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TAB 4: AUDIT LOGS */}
              {activeTab === "Logs" && (
                <motion.div key="logs" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <h2 className="text-3xl font-bold text-slate-900 mb-8">Technical Logs</h2>
                  <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="p-5">Process ID</th>
                            <th className="p-5">Timestamp</th>
                            <th className="p-5">Status</th>
                         </tr>
                      </thead>
                      <tbody className="text-xs font-mono text-slate-600">
                        {reviews.map(r => (
                          <tr key={r.id} className="border-b border-slate-50">
                            <td className="p-5 font-bold text-slate-900">WEBHOOK_RECV_PR_{r.pr_number}</td>
                            <td className="p-5">{new Date(r.created_at).toLocaleString()}</td>
                            <td className="p-5 text-green-600 font-black">200_OK_SUCCESS</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  )
}

// --- KOMPONEN PEMBANTU ---

function ReviewCard({ r, index }: { r: Review, index: number }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className="bg-white border border-slate-200 p-6 rounded-[1.5rem] flex gap-6 hover:border-blue-400 hover:shadow-2xl transition-all duration-300">
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-sm text-slate-900">@{r.author}</span>
          <span className="px-2 py-1 bg-slate-100 rounded text-[10px] font-bold text-slate-400 tracking-widest uppercase">PR #{r.pr_number}</span>
        </div>
        <h4 className="text-blue-600 font-bold mb-4 flex items-center gap-2"><Code2 size={16}/> {r.repo_name}</h4>
        <p className="text-[14px] leading-relaxed whitespace-pre-wrap font-medium text-slate-700">
  {r.ai_response}
</p>
      </div>
      <div className="flex md:flex-col justify-start">
        <a href={`https://github.com/immanueltampubolon594/${r.repo_name}/pull/${r.pr_number}`} target="_blank" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-all">
          <ArrowUpRight size={18} />
        </a>
      </div>
    </motion.div>
  )
}

function NavItem({ icon, label, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-200 cursor-pointer font-bold ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}>
      <div className={active ? "text-white" : "text-slate-400"}>{icon}</div>
      <span>{label}</span>
      {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </div>
  )
}