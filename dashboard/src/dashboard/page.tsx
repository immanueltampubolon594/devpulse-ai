"use client"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  GitPullRequest, Zap, Terminal, Search, Bell, 
  Command, ArrowUpRight, Cpu, Code2, Clock, 
  ChevronRight, LayoutGrid, ShieldCheck, GitBranch, // Ganti Github jadi GitBranch
  AlertTriangle, CheckCircle2, History, ShieldAlert
} from "lucide-react"

// Struktur data dari Backend
interface Review {
  id: number
  repo_name: string
  author: string
  ai_response: string
  created_at: string
  pr_number: number
}

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("Dashboard")

  const fetchReviews = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/reviews")
      const data = await res.json()
      setReviews(data)
      setLoading(false)
    } catch (e) {
      console.log("Menunggu Backend Go aktif...")
    }
  }

  useEffect(() => {
    fetchReviews()
    const interval = setInterval(fetchReviews, 5000)
    return () => clearInterval(interval)
  }, [])

  // Fungsi Filter khusus untuk TAB SECURITY
  const securityReviews = reviews.filter(r => 
    r.ai_response.toLowerCase().includes("security") || 
    r.ai_response.toLowerCase().includes("password") || 
    r.ai_response.toLowerCase().includes("leak") ||
    r.ai_response.toLowerCase().includes("bahaya")
  )

  // Ambil daftar Repo Unik untuk TAB PULL REQUESTS
  const uniqueRepos = [...new Set(reviews.map(r => r.repo_name))]

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] text-[#1a1a1a] font-sans selection:bg-blue-100 uppercase-none">
      
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-slate-200 flex flex-col p-6 hidden lg:flex bg-white">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Zap size={20} className="text-white" fill="white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-900">DevPulse</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem 
            icon={<LayoutGrid size={19}/>} 
            label="Dashboard" 
            active={activeTab === "Dashboard"} 
            onClick={() => setActiveTab("Dashboard")}
          />
          <NavItem 
            icon={<GitBranch size={19}/>} 
            label="Pull Requests" 
            active={activeTab === "Pull Requests"} 
            onClick={() => setActiveTab("Pull Requests")}
          />
          <NavItem 
            icon={<ShieldCheck size={19}/>} 
            label="Security Scan" 
            active={activeTab === "Security"} 
            onClick={() => setActiveTab("Security")}
          />
          <NavItem 
            icon={<History size={19}/>} 
            label="Audit Logs" 
            active={activeTab === "Logs"} 
            onClick={() => setActiveTab("Logs")}
          />
        </nav>

        <div className="mt-auto p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engine Live</span>
          </div>
          <p className="text-[11px] text-slate-600 font-semibold mb-3">Go Backend Operational</p>
          <button className="w-full py-2 bg-white border border-slate-200 rounded-lg text-[10px] font-bold uppercase hover:bg-slate-100 transition-all">Manual v1.0</button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col max-h-screen overflow-hidden">
        
        <header className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md z-20">
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <Command size={16} />
            <div className="h-4 w-[1px] bg-slate-200" />
            <span className="text-xs font-black tracking-widest text-slate-400">IMMANUEL</span>
            <ChevronRight size={14} />
            <span className="text-sm text-slate-900 font-bold">{activeTab}</span>
          </div>
          <div className="flex items-center gap-6">
            <Search size={19} className="text-slate-400" />
            <Bell size={19} className="text-slate-400" />
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-lg shadow-blue-500/20">
              IT
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10 bg-[#FAFAFA]">
          <div className="max-w-5xl mx-auto">
            
            <AnimatePresence mode="wait">
              {/* --- TAB 1: DASHBOARD --- */}
              {activeTab === "Dashboard" && (
                <motion.div key="dash" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                  <div className="flex justify-between items-end mb-12">
                    <div>
                      <h2 className="text-4xl font-semibold tracking-tight text-slate-900 mb-2">Review Feed</h2>
                      <p className="text-slate-500 font-medium italic">All incoming code analysis from GitHub clusters.</p>
                    </div>
                    <div className="flex gap-4">
                      <StatCard label="Total Reviews" value={reviews.length} />
                      <StatCard label="Security Ok" value={reviews.length - securityReviews.length} icon={<CheckCircle2 size={14} className="text-green-500" />} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {reviews.map((r, index) => (
                      <ReviewCard key={r.id} r={r} index={index} />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* --- TAB 2: PULL REQUESTS (List Repo) --- */}
              {activeTab === "Pull Requests" && (
                <motion.div key="prs" initial={{opacity:0, y: 10}} animate={{opacity:1, y:0}}>
                  <h2 className="text-3xl font-bold mb-8">Active Repositories</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {uniqueRepos.map(repo => (
                      <div key={repo} className="p-6 bg-white border border-slate-200 rounded-3xl flex justify-between items-center hover:border-blue-500 transition-all shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-blue-600">
                             <Code2 size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold text-lg">{repo}</h4>
                            <p className="text-sm text-slate-500">{reviews.filter(r => r.repo_name === repo).length} Reviews Analysis</p>
                          </div>
                        </div>
                        <ChevronRight className="text-slate-300" />
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* --- TAB 3: SECURITY SCAN --- */}
              {activeTab === "Security" && (
                <motion.div key="sec" initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 className="text-3xl font-bold mb-2">Security Hub</h2>
                  <p className="text-slate-500 mb-10">Filtering all reviews for critical vulnerabilities and leaks.</p>
                  
                  {securityReviews.length > 0 ? (
                    securityReviews.map((r) => (
                      <div key={r.id} className="p-6 bg-red-50 border border-red-100 rounded-3xl mb-4 flex gap-4">
                        <ShieldAlert className="text-red-600 shrink-0" size={24} />
                        <div>
                          <h4 className="font-bold text-red-900 mb-1">{r.repo_name} - PR #{r.pr_number}</h4>
                          <p className="text-sm text-red-700/80 leading-relaxed font-medium">"{r.ai_response.substring(0, 200)}..."</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="py-32 text-center bg-white border-2 border-dashed border-slate-200 rounded-[3rem]">
                      <ShieldCheck size={48} className="mx-auto text-green-500 mb-4" />
                      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No Security Vulnerabilities Detected</p>
                    </div>
                  )}
                </motion.div>
              )}

              {/* --- TAB 4: AUDIT LOGS --- */}
              {activeTab === "Logs" && (
                <motion.div key="logs" initial={{opacity:0}} animate={{opacity:1}}>
                  <h2 className="text-3xl font-bold mb-8">System Logs</h2>
                  <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                         <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <th className="p-4">Event</th>
                            <th className="p-4">Timestamp</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Engine</th>
                         </tr>
                      </thead>
                      <tbody className="text-xs font-mono text-slate-600">
                        {reviews.map(r => (
                          <tr key={r.id} className="border-b border-slate-50">
                            <td className="p-4 font-bold">RECV_WEBHOOK_PR_{r.pr_number}</td>
                            <td className="p-4">{new Date(r.created_at).toLocaleString()}</td>
                            <td className="p-4 text-green-600">200_OK_SUCCESS</td>
                            <td className="p-4">GROQ_LLAMA_3.3</td>
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

// Komponen Card Review (Dashboard)
function ReviewCard({ r, index }: { r: Review, index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white border border-slate-200 p-6 rounded-[1.5rem] flex flex-col md:flex-row gap-6 hover:border-blue-400 hover:shadow-2xl transition-all duration-300 group"
    >
      <div className="flex-1">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-[11px] font-bold text-slate-500 border border-slate-200">
              {r.author.substring(0,2).toUpperCase()}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">@{r.author}</h4>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                <Clock size={10} />
                {new Date(r.created_at).toLocaleString()}
              </div>
            </div>
          </div>
          <div className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-lg border border-slate-100">
            PR #{r.pr_number}
          </div>
        </div>
        <div className="mb-4 flex items-center gap-2">
          <GitBranch size={14} className="text-blue-500" />
          <span className="text-xs font-bold text-slate-900 tracking-tight">{r.repo_name}</span>
        </div>
        <div className="p-5 bg-slate-50 rounded-2xl border border-slate-50 group-hover:bg-white transition-colors">
          <div className="flex items-center gap-2 mb-3">
            <Cpu size={14} className="text-blue-600" />
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">AI Engineering Insight</span>
          </div>
          <p className="text-[13px] leading-relaxed text-slate-600 font-medium whitespace-pre-wrap">{r.ai_response}</p>
        </div>
      </div>
      <div className="flex md:flex-col justify-start">
        <a href={`https://github.com/immanueltampubolon594/${r.repo_name}/pull/${r.pr_number}`} target="_blank" className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-400 transition-all">
          <ArrowUpRight size={18} />
        </a>
      </div>
    </motion.div>
  )
}

function NavItem({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm transition-all duration-200 cursor-pointer font-bold ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'}`}
    >
      <div className={active ? "text-white" : "text-slate-400"}>{icon}</div>
      <span>{label}</span>
      {active && <ChevronRight size={14} className="ml-auto opacity-50" />}
    </div>
  )
}

function StatCard({ label, value, icon }: { label: string, value: any, icon?: any }) {
  return (
    <div className="bg-white px-6 py-4 rounded-2xl shadow-sm border border-slate-200 text-center min-w-[120px]">
      <div className="flex items-center justify-center gap-2 mb-1">
        {icon}
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      </div>
      <span className="text-2xl font-black text-slate-900 leading-none">{value}</span>
    </div>
  )
}