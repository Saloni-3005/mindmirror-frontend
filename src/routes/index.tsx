import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "../../supabaseClient"; // path check kar lena
import {
  useWallet
} from "../../context/WalletContext";
import {
  LayoutDashboard,
  Gamepad2,
  TrendingUp,
  Trophy,
  Award,
  Settings,
  Search,
  Bell,
  Flame,
  Play,
  Lock,
  Clock,
  Zap,
  Code2,
  Menu,
  X,
  ChevronRight,
  Target,
  Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/_layout/")({
  component: Dashboard,
});

type Difficulty = "Beginner" | "Intermediate" | "Advanced";

type Game = {
  title: string;
  icon: string;
  difficulty: Difficulty;
  progress: number;
  xp: number;
  time: string;
  locked?: boolean;
  accent: string;
};

const games: Game[] = [
  { title: "Logic Maze", icon: "🧩", difficulty: "Beginner", progress: 72, xp: 120, time: "10 min", accent: "from-secondary/30 to-primary/10" },
  { title: "Brain Blast", icon: "🔁", difficulty: "Intermediate", progress: 45, xp: 150, time: "12 min", accent: "from-indigo-500/20 to-indigo-500/5" },
  { title: "Trivia", icon: "🐛", difficulty: "Intermediate", progress: 30, xp: 220, time: "18 min", accent: "from-violet-500/20 to-violet-500/5" },
  { title: "Zip", icon: "⚔️", difficulty: "Intermediate", progress: 100, xp: 240, time: "20 min", accent: "from-emerald-500/20 to-emerald-500/5" },
  { title: "Stop Motion Studio", icon: "📦", difficulty: "Beginner", progress: 88, xp: 130, time: "8 min", accent: "from-secondary/30 to-primary/10" },
  { title: "Piano", icon: "🎯", difficulty: "Intermediate", progress: 12, xp: 260, time: "22 min", accent: "from-indigo-500/20 to-indigo-500/5" },
  { title: "Math Shop Game", icon: "⚡", difficulty: "Advanced", progress: 0, xp: 380, time: "30 min", locked: true, accent: "from-rose-500/20 to-rose-500/5" },
  { title: "AI Escape", icon: "🤖", difficulty: "Advanced", progress: 0, xp: 420, time: "35 min", locked: true, accent: "from-violet-500/20 to-violet-500/5" },
];

// const sidebarItems = [
//   { label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
//   { label: "Categories", icon: Gamepad2, key: "categories" },
//   { label: "Progress", icon: TrendingUp, key: "progress" },
//   { label: "Leaderboard", icon: Trophy, key: "leaderboard" },
//   { label: "Achievements", icon: Award, key: "achievements" },
//   { label: "Settings", icon: Settings, key: "settings" },
// ];

const difficultyStyles: Record<Difficulty, string> = {
  Beginner: "bg-success/20 text-success border-success/30",
  Intermediate: "bg-warning/20 text-warning border-warning/30",
  Advanced: "bg-danger/20 text-danger border-danger/30",
};

function Dashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
const [showAuth, setShowAuth] = useState(false);
const [sessionTimer, setSessionTimer] =
  useState<any>(null);
useEffect(() => {
  const handleUnload = async () => {

  const sessionId =
    localStorage.getItem(
      'platformSessionId'
    );

  if (!sessionId) return;

  localStorage.removeItem(
    'platformSessionId'
  );
};
  supabase.auth.getUser().then(({ data }) => {
    console.log("Logged in user:", data.user);
    setUser(data.user);
    supabase.auth.getSession().then(({ data }) => {
  console.log("SESSION:", data.session);
  console.log("ACCESS TOKEN:", data.session?.access_token);
});
  });

  const { data: listener } =
  supabase.auth.onAuthStateChange(
    async (_event, session) => {
      setUser(session?.user || null);

// ✅ logout UI instantly update
if (_event === 'SIGNED_OUT') {

  setUser(null);

  localStorage.removeItem(
    'platformSessionId'
  );

  localStorage.removeItem(
    'sessionRewardGiven'
  );

  return;
}

// ✅ sirf login logic niche chalega
if (_event !== 'SIGNED_IN') {
  return;
}
      // ✅ USER LOGGED IN
      if (session?.user) {

        // CHECK existing session
        const existingSession =
          localStorage.getItem(
            'platformSessionId'
          );

        // 🚫 already running
        if (existingSession) {

          console.log(
            'Session already active:',
            existingSession
          );

          return;
        }

        try {

          const token =
            session.access_token;

          const response =
            await fetch(
              'https://wallet-api-backend-production.up.railway.app/session/start',
              {
                method: 'POST',

                headers: {
                  Authorization:
                    `Bearer ${token}`,

                  'Content-Type':
                    'application/json',
                },
              }
            );

          const data =
            await response.json();

          console.log(
            'Platform Session Started:',
            data
          );

          // SAVE SESSION ID
          localStorage.setItem(
            'platformSessionId',
            data.session.id
          );
          localStorage.removeItem(
  'sessionRewardGiven'
);

// start2MinRewardTimer();

          // AUTO END AFTER 30 MIN
          const timer = setTimeout(
            async () => {

              try {

                const currentSessionId =
                  localStorage.getItem(
                    'platformSessionId'
                  );
                  // reset reward flag


                if (!currentSessionId) {
                  return;
                }

                const session =
                  await supabase.auth.getSession();

                const token =
                  session.data.session
                  ?.access_token;

                if (!token) {
                  return;
                }

                const res = await fetch(
                  'https://wallet-api-backend-production.up.railway.app/session/end',
                  {
                    method: 'POST',

                    headers: {
                      Authorization:
                        `Bearer ${token}`,

                      'Content-Type':
                        'application/json',
                    },

                    body: JSON.stringify({
                      sessionId:
                        currentSessionId,
                    }),
                  }
                );

                const result =
                  await res.json();

                console.log(
                  'Session auto ended:',
                  result
                );
                
                localStorage.removeItem(
                  'platformSessionId'
                );
                localStorage.removeItem(
  'sessionRewardGiven'
);

                fetchWallet();

              } catch (err) {

                console.error(
                  'Auto session end failed:',
                  err
                );
              }

            },

            30 * 60 * 1000
          );

          setSessionTimer(timer);
          
        } catch (err) {

          console.error(
            'Session start failed:',
            err
          );
        }
      }
    }
  );
    window.addEventListener(
  'beforeunload',
  handleUnload
);

  return () => {

  listener.subscription.unsubscribe();

  window.removeEventListener(
    'beforeunload',
    handleUnload
  );

  if (sessionTimer) {
    clearTimeout(sessionTimer);
  }
};
}, []);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logicMazeStats, setLogicMazeStats] = useState({
  progress: 0,
  coins: 0,
  completed: 0,
  time: "0 min",
  });
  const [brainBlastStats, setBrainBlastStats] = useState({
  progress: 0,
  coins: 0,
  completed: 0,
  time: "0 min",
});
const [triviaStats, setTriviaStats] = useState({
  progress: 0,
  coins: 0,
  completed: 0,
  time: "0 min",
});
const [zipStats, setZipStats] = useState({
  progress: 0,
  coins: 0,
  completed: 0,
  time: "0 min",
});
  const {
  coins: walletCoins,
  setCoins: setWalletCoins
} = useWallet();
  const [searchTerm, setSearchTerm] = useState("");
//   const start2MinRewardTimer = async () => {

//   console.log("2 min timer started");

//   setTimeout(async () => {

//     try {

//       const rewarded =
//         localStorage.getItem(
//           'sessionRewardGiven'
//         );

//       if (rewarded === 'true') {
//         console.log("Already rewarded");
//         return;
//       }

//       const currentSessionId =
//         localStorage.getItem(
//           'platformSessionId'
//         );

//       if (!currentSessionId) {
//         console.log("No session found");
//         return;
//       }

//       const session =
//         await supabase.auth.getSession();

//       const token =
//         session.data.session
//         ?.access_token;

//       if (!token) {
//         console.log("No token");
//         return;
//       }

//       console.log("Calling reward API...");

//       const rewardRes = await fetch(
//         'https://wallet-api-backend-production.up.railway.app/wallet/earn/event',
//         {
//           method: 'POST',

//           headers: {
//             Authorization:
//               `Bearer ${token}`,

//             'Content-Type':
//               'application/json',
//           },

//           body: JSON.stringify({
//             amount: 10,
//             description:
//               '2 minute session reward',
//           }),
//         }
//       );

//       const rewardData =
//         await rewardRes.json();

//       console.log(
//         '2 min reward success:',
//         rewardData
//       );

//       localStorage.setItem(
//         'sessionRewardGiven',
//         'true'
//       );

//       // ✅ instant UI update
//       setWalletCoins(
//         Number(rewardData.balance) || 0
//       );

//       // ✅ backend sync
//       fetchWallet();

//     } catch (err) {

//       console.error(
//         '2 min reward failed:',
//         err
//       );
//     }

//   }, 2 * 60 * 1000);
// };
const updateWalletFromGame = async (coins: number, level?: number) => {
  try {
    console.log("Updating wallet...");
    console.log("Coins:", coins);

    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;

    if (!token) return;

    const res = await fetch("https://wallet-api-backend-production.up.railway.app/wallet/earn/event", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        games,
        level,
        rewardType: "GAME_REWARD"
      }),
    });

    const data = await res.json();

console.log("Wallet API Response:", data);

setWalletCoins(Number(data.balance) || 0);

    // ✅ backup sync from backend
    fetchWallet();

  } catch (err) {
    console.error("Wallet update failed:", err);
  }
};

  const fetchWallet = useCallback(async () => {
  try {
    const session = await supabase.auth.getSession();

    console.log("SESSION:", session);

    const token = session.data.session?.access_token;

    console.log("TOKEN:", token);

    if (!token) {
      console.log("No token found");
      return;
    }

    const res = await fetch("https://wallet-api-backend-production.up.railway.app/wallet/balance", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    console.log("Wallet API Response:", data);

    setWalletCoins(Number(data.balance) || 0);

  } catch (err) {
    console.error("Fetch wallet failed:", err);
  }
}, [setWalletCoins]);

  useEffect(() => {
  const loadStats = () => {
    const progress = Number(localStorage.getItem("logicMazeProgress")) || 0;
    const coins = Number(localStorage.getItem("logicMazeCoins")) || 0;
    const completed = Number(localStorage.getItem("logicMazeCompleted")) || 0;
    const time = Number(localStorage.getItem("logicMazeTime")) || 0;
    const bbProgress = Number(localStorage.getItem("brainBlastProgress")) || 0;
const bbCoins = Number(localStorage.getItem("brainBlastCoins")) || 0;
const bbCompleted = Number(localStorage.getItem("brainBlastCompleted")) || 0;
const bbTime = Number(localStorage.getItem("brainBlastTime")) || 0;
const triviaProgress = Number(localStorage.getItem("triviaProgress")) || 0;
const triviaCoins = Number(localStorage.getItem("triviaCoins")) || 0;
const triviaCompleted = Number(localStorage.getItem("triviaCompleted")) || 0;
const triviaTime = Number(localStorage.getItem("triviaTime")) || 0;
const zipProgress = Number(localStorage.getItem("zipProgress")) || 0;
const zipCoins = Number(localStorage.getItem("zipCoins")) || 0;
const zipCompleted = Number(localStorage.getItem("zipCompleted")) || 0;
const zipTime = Number(localStorage.getItem("zipTime")) || 0;

    setLogicMazeStats({
      progress,
      coins,
      completed,
      time: `${time} min`,
    });
    setBrainBlastStats({
  progress: bbProgress,
  coins: bbCoins,
  completed: bbCompleted,
  time: `${bbTime} min`,
});


setTriviaStats({
  progress: triviaProgress,
  coins: triviaCoins,
  completed: triviaCompleted,
  time: `${triviaTime} min`,
});
setZipStats({
  progress: zipProgress,
  coins: zipCoins,
  completed: zipCompleted,
  time: `${zipTime} min`,
});
  };

  loadStats();

  window.addEventListener("focus", loadStats);
  window.addEventListener("storage", loadStats);

  const handleMessage = (event: MessageEvent) => {
    if (event.data.type === "GAME_REWARD") {
  console.log("Reward received:", event.data);

  updateWalletFromGame(
    Number(event.data.coins || 0),
    event.data.level
  );
}
  if (event.data) {

  // LOGIC MAZE
  if (event.data.type === "GAME_PROGRESS_UPDATE") {
    setLogicMazeStats({
      progress: event.data.progress,
      coins: event.data.coins,
      completed: event.data.completed || 0,
      time: `${event.data.time} min`,
    });
  }

  // BRAIN BLAST
  if (event.data.type === "BRAIN_BLAST_UPDATE") {
    setBrainBlastStats({
      progress: event.data.progress,
      coins: event.data.coins,
      completed: event.data.completed || 0,
      time: `${event.data.time} min`,
    });
  }

  if (event.data.type === "TRIVIA_UPDATE") {
  setTriviaStats({
    progress: event.data.progress,
    coins: event.data.coins,
    completed: event.data.completed || 0,
    time: `${event.data.time} min`,
  });
}
  // ZIP MASTER (NEW)
if (event.data.type === "ZIP_MASTER_UPDATE") {
  const data = event.data.payload;

  setZipStats({
    progress: (data.stars.filter((s: number) => s > 0).length / 25) * 100,
    coins: data.coins,
    completed: data.stars.filter((s: number) => s > 0).length,
    time: `${data.time || 0} min`,
  });
  fetchWallet();
  
}
}
  };

  window.addEventListener("message", handleMessage);

  return () => {
    window.removeEventListener("focus", loadStats);
    window.removeEventListener("storage", loadStats);
    window.removeEventListener("message", handleMessage);
  };
}, []);
useEffect(() => {

  if (!user) return;

  fetchWallet();

  const existingSession =
    localStorage.getItem(
      'platformSessionId'
    );

  const rewarded =
    localStorage.getItem(
      'sessionRewardGiven'
    );

  // ✅ page refresh ke baad bhi timer continue
  // if (
  //   existingSession &&
  //   rewarded !== 'true'
  // ) {
  //   start2MinRewardTimer();
  // }

}, [user]);

  return (
    <div className="min-h-screen text-foreground bg-background">
      {showAuth && (
  <AuthModal
    onClose={() => setShowAuth(false)}
    setUser={setUser}
  />
)}
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-40 glass flex items-center justify-between px-4 h-14 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <Code2 className="h-4 w-4" />
          </div>
          {/* <span className="font-display font-bold text-base">CodeArena</span> */}
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg hover:bg-surface-elevated transition"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex">

        {/* Sidebar — mobile drawer */}
        {/* <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/60 lg:hidden"
                onClick={() => setMobileOpen(false)}
              /> */}
              <motion.div
                initial={{ x: -320 }}
                animate={{ x: 0 }}
                exit={{ x: -320 }}
                transition={{ type: "spring", damping: 26, stiffness: 220 }}
                className="fixed left-0 top-0 bottom-0 z-50 lg:hidden"
              >
                
              </motion.div>
            {/* </> */}
          {/* )} */}
        {/* </AnimatePresence> */}

        {/* Main */}
        <main className="flex-1 min-w-0 px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <Header
  walletCoins={walletCoins}
  searchTerm={searchTerm}
  setSearchTerm={setSearchTerm}
  user={user}
  setShowAuth={setShowAuth}
  sessionTimer={sessionTimer}
/>
            <Hero />
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-8">
<GamesSection
  logicMazeStats={logicMazeStats}
  brainBlastStats={brainBlastStats}
  triviaStats={triviaStats}
  zipStats={zipStats}
  searchTerm={searchTerm}
/>
              <SidePanel />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* ───────────────────────── Sidebar ───────────────────────── */

function Sidebar({
  walletCoins,
  active,
  setActive,
  navigate,
  className = "",
  onClose,
}: {
  walletCoins: number;
  active: string;
  setActive: (k: string) => void;
  className?: string;
  navigate: any;
  onClose?: () => void;
}) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`${className} sticky top-0 h-screen w-72 shrink-0 flex-col bg-white text-white border-r border-border p-5`}
    >
      {/* Logo */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2.5">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-glow">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          {/* <div className="leading-tight">
            <div className="font-display font-bold text-lg">CodeArena</div>
            <div className="text-[11px] text-white/70">Play. Code. Level up.</div>
          </div> */}
        </div>
        {onClose && (
          <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg hover:bg-surface-elevated">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Nav */}
      {/* <nav className="flex-1 space-y-1">
        {sidebarItems.map((item, i) => {
          const isActive = active === item.key;
          const Icon = item.icon;
          return (
            <motion.button
              key={item.key}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.3 }}
              onClick={() => {
  setActive(item.key);

  if (item.key === "categories") {
    navigate({ to: "/categories" });
  }
}}
              className={`relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "text-white"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/10 border border-primary/20"
                  transition={{ type: "spring", damping: 24, stiffness: 240 }}
                />
              )}
              <Icon className="relative h-4.5 w-4.5 shrink-0" />
              <span className="relative">{item.label}</span>
              {isActive && <ChevronRight className="relative ml-auto h-4 w-4 text-primary" />}
            </motion.button>
          );
        })}
      </nav> */}

      {/* Profile / XP card */}
      {/* <div className="mt-6 space-y-0"> */}
        {/* <div className="mt-6 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4 text-white"> */}
  
  {/* Top Profile */}
  {/* <div className="flex items-center gap-3">
    <img
      src="https://api.dicebear.com/7.x/adventurer/svg?seed=Alex"
      alt="avatar"
      className="h-10 w-10 rounded-full border-2 border-white"
    /> */}
    {/* <div> */}
      {/* <div className="text-sm font-semibold">Alex Chen</div>
      <div className="text-xs bg-yellow-300 text-black px-2 py-0.5 rounded-full inline-block mt-1">
        Level 12
      </div> */}
    {/* </div> */}

  
  {/* Button */}
  {/* <button className="mt-4 w-full bg-yellow-300 text-black text-sm font-semibold py-2 rounded-lg hover:scale-105 transition">
    Upgrade to Pro
  </button> */}

    </motion.aside>
  )
}

/* ───────────────────────── Header ───────────────────────── */

function Header({ walletCoins, searchTerm, setSearchTerm, user, setShowAuth, sessionTimer }: any) {
  const [showDropdown, setShowDropdown] = useState(false);
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
  Welcome back,{" "}
  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
    {user?.user_metadata?.name || user?.email || "Player"}
  </span>
</h1>
        <p className="text-sm text-muted-foreground mt-1">Ready to crack today's challenge?</p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex-1 md:flex-none md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
  type="text"
  placeholder="Search games..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  className="w-full h-10 pl-9 pr-3 rounded-lg bg-card border border-border shadow-soft text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition"
/>
        </div>

        <div className="flex items-center gap-1.5 h-10 px-3 rounded-lg bg-card border border-border shadow-soft">
          <Flame className="h-4 w-4 text-orange-400" />
          <span className="text-sm font-semibold">7</span>
          <span className="hidden sm:inline text-xs text-muted-foreground">day streak</span>
        </div>
        <div className="flex items-center gap-2 h-10 px-4 rounded-lg bg-yellow-400/20 border border-yellow-400/30">
          <span>🪙</span>
          <span className="font-bold text-white-300">{walletCoins}</span>
        </div>

        <button className="relative h-10 w-10 grid place-items-center rounded-lg bg-card border border-border shadow-soft hover:border-primary/40 transition">
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
        </button>

<div className="relative">
  {user ? (
    <>
      {/* Username Button */}
      <button
        onClick={() => setShowDropdown((prev: boolean) => !prev)}
        className="h-10 px-4 flex items-center rounded-lg bg-card border border-border cursor-pointer"
      >
        <span className="text-sm font-medium">
          {user.user_metadata?.name || user.email}
        </span>
      </button>

      {/* Click Dropdown */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg z-50">
          <button
            onClick={async () => {
              const sessionId =
  localStorage.getItem(
    'platformSessionId'
  );

const session =
  await supabase.auth.getSession();

const token =
  session.data.session
  ?.access_token;

if (sessionId && token) {

  await fetch(
    'https://wallet-api-backend-production.up.railway.app/session/end',
    {
      method: 'POST',

      headers: {
        Authorization:
          `Bearer ${token}`,

        'Content-Type':
          'application/json',
      },

      body: JSON.stringify({
        sessionId,
      }),
    }
  );

  localStorage.removeItem(
    'platformSessionId'
  );
  localStorage.removeItem(
  'sessionRewardGiven'
);
}
if (sessionTimer) {
  clearTimeout(sessionTimer);
}
await supabase.auth.signOut();

setShowDropdown(false);
            }}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      )}
    </>
  ) : (
    <button
      onClick={() => setShowAuth(true)}
      className="h-10 px-3 rounded-lg bg-primary text-white text-sm"
    >
      Login
    </button>
  )}
</div>
      </div>
    </motion.header>
  );
}
/* ───────────────────────── Hero ───────────────────────── */

function Hero() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-hero-grad text-white shadow-soft"
    >
      <div className="absolute inset-0 bg-hero-grad pointer-events-none" />
      {/* floating code symbols */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {["{ }", "</>", "()", "[ ]", "==", "=>"].map((s, i) => (
          <motion.span
            key={i}
            className="absolute font-mono text-primary/20 font-bold select-none"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
              fontSize: `${14 + (i % 3) * 6}px`,
            }}
            animate={{ y: [0, -14, 0], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.3 }}
          >
            {s}
          </motion.span>
        ))}
      </div>

      <div className="relative p-6 sm:p-10 grid md:grid-cols-[1fr_auto] gap-6 items-center">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium">
            <Sparkles className="h-3 w-3" /> Daily Challenge live
          </div>
          <h2 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
            Learn Coding Through Games
          </h2>
          <p className="mt-2 text-sm sm:text-base text-white/80 max-w-lg">
            Solve challenges, build logic, level up. Each game teaches a new programming concept.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-glow transition"
            >
              <Play className="h-4 w-4 fill-current" /> Continue Playing
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 h-11 px-5 rounded-lg bg-white/20 border border-white/30 text-white backdrop-blur font-semibold text-sm hover:border-primary/40 transition"
            >
              Explore Games <ChevronRight className="h-4 w-4" />
            </motion.button>
          </div>
        </div>

        <div className="hidden md:block">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-44 h-44 rounded-2xl bg-gradient-to-br from-primary/30 to-secondary/30 border border-primary/30 grid place-items-center shadow-glow"
          >
            <div className="absolute inset-3 rounded-xl border border-primary/20" />
            <Code2 className="h-16 w-16 text-primary" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}

/* ───────────────────────── Games Section ───────────────────────── */

function GamesSection({
  logicMazeStats,
  brainBlastStats,
  triviaStats,
  zipStats,
  searchTerm,
}: any) {
const filteredGames = games.filter((g) =>
  g.title.toLowerCase().includes(searchTerm.toLowerCase())
);
  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold">Popular Games</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Pick a challenge and start coding</p>
        </div>
        <button className="hidden sm:inline-flex items-center gap-1 text-sm text-primary hover:underline underline-offset-4">
          View all <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">

  {filteredGames.length === 0 ? (
    <div className="col-span-full text-center py-10 text-gray-500 text-lg font-medium">
      No games found
    </div>
  ) : (
    filteredGames.map((g, i) => {
     const updatedGame =
  g.title === "Logic Maze"
    ? {
        ...g,
        progress: logicMazeStats.progress,
        xp: logicMazeStats.coins,
        time: logicMazeStats.time,
      }
    : g.title === "Brain Blast"
    ? {
        ...g,
        progress: brainBlastStats.progress,
        xp: brainBlastStats.coins,
        time: brainBlastStats.time,
      }
    : g.title === "Trivia"
? {
    ...g,
    progress: triviaStats.progress,
    xp: triviaStats.coins,
    time: triviaStats.time,
  }: g.title === "Zip"
? {
    ...g,
    progress: zipStats.progress,
    xp: zipStats.coins,
    time: zipStats.time,
  }:g

      return <GameCard key={g.title} game={updatedGame} index={i} />;
    })
  )}

</div>
          
    </section>
  );
}

function GameCard({ game, index }: { game: Game; index: number }) {
  const locked = !!game.locked;

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05, ease: "easeOut" }}
      whileHover={!locked ? { y: -4 } : {}}

      onClick={() => {
    if (game.title === "Logic Maze") {
      window.open("/logic_maze.html", "_blank");
    }
    if (game.title === "Brain Blast") {
    window.open("/brain_blast.html", "_blank");
  }
  if (game.title === "Trivia") {
  window.open("/trivia.html", "_blank");
}
// ✅ NEW GAMES
  if (game.title === "Zip") {
    window.open("/zip_master.html", "_blank");
  }

  if (game.title === "Stop Motion Studio") {
    window.open("/stop_motion.html", "_blank");
  }

  if (game.title === "Piano") {
    window.open("/piano.html", "_blank");
  }
  if (game.title === "Math Shop Game") {
  window.open("/math_shop_final.html", "_blank");
}
  }}

      className={`group relative flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden shadow-card transition-colors ${
        !locked ? "hover:border-primary/40" : "opacity-75"
      }`}
    >
      {/* gradient header */}
      <div className={`relative h-28 bg-gradient-to-br ${game.accent} border-b border-border overflow-hidden`}>
        <div className="absolute inset-0 grid place-items-center text-5xl">
          <motion.span
            whileHover={{ scale: 1.15, rotate: 6 }}
            transition={{ type: "spring", damping: 14 }}
          >
            {game.icon}
          </motion.span>
        </div>
        <span
          className={`absolute top-3 left-3 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-semibold border ${difficultyStyles[game.difficulty]}`}
        >
          {game.difficulty}
        </span>
        {locked && (
          <div className="absolute inset-0 grid place-items-center bg-muted/60 backdrop-blur-sm">
            <div className="grid place-items-center h-10 w-10 rounded-full bg-surface-elevated border border-border">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <h3 className="font-display font-semibold text-base leading-tight">{game.title}</h3>

        {/* Progress */}
        <div>
          <div className="flex items-center justify-between text-[11px] text-muted-foreground mb-1.5">
            <span>Progress</span>
            <span className="text-foreground font-medium">{game.progress}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${game.progress}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: "easeOut", delay: 0.2 + index * 0.04 }}
              className={`h-full rounded-full ${game.progress === 100 ? "bg-success" : "bg-gradient-to-r from-primary to-secondary"}`}
            />
          </div>
        </div>

        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-1">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🪙</span>
            <span className="font-medium text-foreground">{game.xp}</span> Coins
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {game.time}
          </div>
        </div>

        <motion.button
          whileHover={!locked ? { scale: 1.02 } : {}}
          whileTap={!locked ? { scale: 0.98 } : {}}
          disabled={locked}
          className={`mt-2 inline-flex items-center justify-center gap-2 h-10 rounded-lg text-sm font-semibold transition ${
            locked
              ? "bg-surface-elevated text-muted-foreground cursor-not-allowed"
              : "bg-primary text-primary-foreground hover:opacity-90 hover:bg-primary hover:text-primary-foreground"
          }`}
        >
          {locked ? (<><Lock className="h-3.5 w-3.5" /> Locked</>) : (<><Play className="h-3.5 w-3.5 fill-current" /> Play</>)}
        </motion.button>
      </div>
    </motion.article>
  );
}

/* ───────────────────────── Side Panel ───────────────────────── */

function SidePanel() {
  const missions = [
    { label: "Solve 3 puzzles", progress: 66, reward: 80 },
    { label: "Reach Level 13", progress: 40, reward: 150 },
    { label: "Win 1 duel", progress: 0, reward: 60 },
  ];
  const achievements = [
    { icon: "🏅", label: "First Function", time: "2h ago" },
    { icon: "🎯", label: "Perfect Run", time: "Yesterday" },
    { icon: "🔥", label: "7-day Streak", time: "Today" },
  ];
  const week = [40, 65, 30, 80, 55, 90, 72];

  return (
    <aside className="space-y-5">
      {/* Daily missions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="rounded-2xl bg-surface border border-border p-5 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Daily Missions
          </h3>
          <span className="text-[11px] text-muted-foreground">3 / 5</span>
        </div>
        <ul className="space-y-3.5">
          {missions.map((m, i) => (
            <li key={m.label}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="text-foreground">{m.label}</span>
                <span className="text-muted-foreground">+{m.reward} Coins</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${m.progress}%` }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                />
              </div>
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Weekly progress */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="rounded-2xl bg-surface border border-border p-5 shadow-card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" /> Weekly Progress
          </h3>
          <span className="text-[11px] text-emerald-400 font-medium">+18%</span>
        </div>
        <div className="flex items-end justify-between gap-1.5 h-24">
          {week.map((v, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              animate={{ height: `${v}%` }}
              transition={{ duration: 0.7, delay: 0.4 + i * 0.05, ease: "easeOut" }}
              className="flex-1 rounded-md bg-gradient-to-t from-primary/40 to-secondary/60"
            />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-muted-foreground">
          {["M","T","W","T","F","S","S"].map((d, i) => <span key={i}>{d}</span>)}
        </div>
      </motion.div>

      {/* Recent achievements */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="rounded-2xl bg-surface border border-border p-5 shadow-card"
      >
        <h3 className="font-display font-semibold text-base flex items-center gap-2 mb-4">
          <Award className="h-4 w-4 text-primary" /> Recent Achievements
        </h3>
        <ul className="space-y-2.5">
          {achievements.map((a) => (
            <li key={a.label} className="flex items-center gap-3 p-2.5 rounded-lg bg-surface-elevated/60 border border-border/60">
              <div className="grid h-8 w-8 place-items-center rounded-md bg-muted text-base">{a.icon}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium truncate">{a.label}</div>
                <div className="text-[11px] text-muted-foreground">{a.time}</div>
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </aside>
  );
}
function AuthModal({ onClose, setUser }: any) {
  const [loading, setLoading] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuth = async () => {
    if (loading) return;
    setLoading(true);
    try {
      if (isSignup) {
        if (password !== confirmPassword) {
          alert("Passwords do not match");
          setLoading(false);
          return;
        }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name } },
        });
        if (error) alert(error.message);
        else alert("Signup successful! Check email.");
        onClose();
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) alert(error.message);
        else {
          setUser(data.user);
          onClose();
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-[9999]"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="bg-white p-6 rounded-xl w-80 shadow-xl"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-bold mb-4">
          {isSignup ? "Sign Up" : "Login"}
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAuth();
          }}
          className="space-y-3"
        >
          {isSignup && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              className="w-full border border-gray-300 p-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="w-full border border-gray-300 p-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={isSignup ? "new-password" : "current-password"}
            className="w-full border border-gray-300 p-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {isSignup && (
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full border border-gray-300 p-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-400 text-gray-900 font-semibold p-2 rounded-lg hover:bg-yellow-500 transition disabled:opacity-50"
          >
            {loading ? "Processing..." : isSignup ? "Register" : "Login"}
          </button>
        </form>

        <div className="flex justify-between mt-3">
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-blue-500 hover:underline"
          >
            {isSignup ? "Already have account? Login" : "Create account"}
          </button>
          <button
            onClick={onClose}
            className="text-sm text-gray-500 hover:underline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}