import { useState } from 'react'

interface LiveSessionsProps {}

interface LiveSession {
  id: string
  title: string
  mentor: string
  time: string
  category: string
  level: string
  seatsText: string
  price: string
  isPro?: boolean
}

interface Recording {
  title: string
  mentor: string
  date: string
  duration: string
  image: string
}

function LiveSessions({}: LiveSessionsProps) {
  const [rsvpedEvents, setRsvpedEvents] = useState<Record<string, boolean>>({})
  const [currentPage, setCurrentPage] = useState(1)
  const [sessions] = useState<LiveSession[]>([
    {
      id: '1',
      title: 'Advanced Jazz Voicings & Transitional Runs',
      mentor: 'Stephanie Halim',
      time: 'Oct 26 • 2:00 PM',
      category: 'Jazz & Gospel',
      level: 'All Levels',
      seatsText: '12/50 Filled',
      price: 'FREE'
    }
  ])

  const [replays] = useState<Recording[]>([
    {
      title: 'Jazz Phrasing: Beyond Scales',
      mentor: 'Julian Vane',
      date: 'Oct 12',
      duration: '48:20',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAdLuOmcEgwNzePralCoRpB5C-Xa-Y2wf33tGHpPI2p1IPbzaWoYK7-2-v6HzQWBPO8cj5CPeJaxBlMdO794eITzvMWHpfQlqh_WSb2rISmwjbHPLfH41K5pdxlFcjbrvDl58vFaEK1kcC83Z6V7pfQqWc932oHzsVtt4TZ8JR9p1_hVTceOQ3hdM_scSqNJULf-luEIRhazKhT5Yfk4SCWJdUlMhhyezAZq2Fm-2WpQI5a-XMTT2A'
    },
    {
      title: 'Introduction to Spiritual Jazz',
      mentor: 'Dr. Elena Ross',
      date: 'Oct 05',
      duration: '55:12',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1EkgaLu97uAO4kQtxiGH4-at6gyt6lvmABluDCFCwac5oiLe8gDxXyrDsSkA9XO5MBr9A5ltyk5ow-dB9qYLTg9F3tAAFI5bYbjWx-20pxnECWuD1T4ahc85ZXd5JkHXq7hg00ORZECMLhdxe1nQsyBUsOkDw06dpoFj72M_5ZD4vyvWfTClYHHxmsE4p7bgheFZoe5WEPzacsHaorptyETBE4w79pz9imFpmEzWpAbf9lZlM5Qw'
    },
    {
      title: '7th Chord Mastery Techniques',
      mentor: 'Sarah Jenkins',
      date: 'Sep 28',
      duration: '32:45',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXtQwidF-MKvtHUNafzn5kTMX5Z1brecf9cndEgDw7NHZBIsDyB4iYOo5YW4EaZoKsRRUFp2LpYHVSTUCAv_vZB-HY8MMRuXoeDbtax7GnN3OSMOT6ctaXojzPI0Ub25wxtTblMya4g7gx6SgFdSkt6W_9Zr6i7yas7nV8JOE8MvlZS4_N4PSUACzBNbRy-6r47BLaHRHG1eroBLSu_hvVWQK23gsPYokoOxaIkCu0ZJ5gWJEOVpE'
    },
    {
      title: 'Gospel Passing Chords masterclass',
      mentor: 'Stephanie Halim',
      date: 'Sep 21',
      duration: '45:10',
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Neo-Soul Movements masterclass',
      mentor: 'Stephanie Halim',
      date: 'Sep 14',
      duration: '50:15',
      image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Classical touch on Jazz masterclass',
      mentor: 'Julian Vane',
      date: 'Sep 07',
      duration: '40:30',
      image: 'https://images.unsplash.com/photo-1544984243-ec57ea16fe25?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'Tritone Substitutions masterclass',
      mentor: 'Dr. Elena Ross',
      date: 'Aug 31',
      duration: '58:00',
      image: 'https://images.unsplash.com/photo-1442504028989-ab58b5f29a4a?auto=format&fit=crop&w=600&q=80'
    },
    {
      title: 'A Whole New World masterclass',
      mentor: 'Stephanie Halim',
      date: 'Aug 24',
      duration: '35:40',
      image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=600&q=80'
    }
  ])

  // Replays pagination logic (6 items per page, 3 top, 3 bottom)
  const itemsPerPage = 6
  const totalPages = Math.ceil(replays.length / itemsPerPage)
  const validCurrentPage = Math.min(Math.max(1, currentPage), totalPages || 1)
  const startIndex = (validCurrentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedReplays = replays.slice(startIndex, endIndex)

  return (
    <main 
      className="pt-4 pb-8 px-6 flex-grow flex flex-col"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 240, 237, 0.65) 50%, rgba(255, 243, 240, 0.5) 100%), url('/music-air.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
      }}
    >
      <div className="max-w-[860px] mx-auto w-full space-y-5">
        
        {/* Page Header */}
        <div className="relative w-full pt-4 pb-1">
          <h1
            className="text-[#7c5a4d] leading-none mb-1"
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              fontWeight: 600,
            }}
          >
            Live Masterclasses
          </h1>
        </div>

        {/* Featured Monthly Session Card */}
        {sessions.map((session) => (
          <div 
            key={session.id}
            className="relative rounded-2xl overflow-hidden p-4 md:p-5 flex flex-col md:flex-row gap-5 shadow-[0_12px_32px_rgba(94,74,65,0.06)] hover:shadow-[0_16px_40px_rgba(94,74,65,0.1)] transition-all duration-300"
            style={{
              border: '2px solid transparent',
              background: `linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85)) padding-box, linear-gradient(135deg, #8b7368 0%, #dfa38f 30%, #ffd0ab 60%, #f5b8c9 100%) border-box`,
            }}
          >
            {/* Left Part: Calendar / Date Badge */}
            <div 
              className="w-full md:w-[130px] md:h-[130px] shrink-0 aspect-video md:aspect-square rounded-xl flex flex-col items-center justify-center text-center p-3 relative overflow-hidden shadow-md"
              style={{
                border: '2px solid transparent',
                background: `linear-gradient(135deg, rgba(232, 212, 204, 0.95) 0%, rgba(206, 184, 175, 0.95) 100%) padding-box, linear-gradient(135deg, #8b7368 0%, #dfa38f 30%, #ffd0ab 60%, #f5b8c9 100%) border-box`,
              }}
            >
              <div className="absolute top-0 right-0 w-12 h-12 bg-white/10 rounded-full blur-lg"></div>
              <span className="text-[8px] font-bold tracking-widest text-[#503b33] uppercase font-mono mb-1 bg-white/35 px-2 py-0.5 rounded-full">
                Next Session
              </span>
              <span className="text-[26px] font-black text-[#3d2218] leading-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                Oct 26
              </span>
              <span className="text-[10px] font-bold text-[#503b33] mt-1.5 flex items-center gap-1 font-sans">
                <span className="material-symbols-outlined text-[13px]" style={{ fontVariationSettings: "'FILL' 1" }}>schedule</span>
                2:00 PM WIB
              </span>
            </div>

            {/* Right Part: Session Details */}
            <div className="flex-grow flex flex-col justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-[#3d251c] font-bold text-sm md:text-base leading-snug" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {session.title}
                </h2>
                <p className="text-[#5c4a43] text-xs leading-relaxed" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Join Stephanie Halim in this exclusive monthly masterclass. Learn advanced chord voicings, transitional jazz runs, and get live real-time feedback on your piano technique.
                </p>
              </div>

              {/* Mentor and Join button row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#8a6858]/10">
                <div>
                  <span className="text-[8px] uppercase font-bold text-[#8a6858] block tracking-wide font-sans">Instructor</span>
                  <h4 className="text-[11px] font-bold text-[#3d251c]">{session.mentor}</h4>
                </div>

                <button 
                  onClick={() => {
                    const isRsvped = rsvpedEvents[session.id];
                    setRsvpedEvents(prev => ({ ...prev, [session.id] : !prev[session.id] }));
                    if (!isRsvped) {
                      alert("You have joined this session! The Zoom link has been automatically sent to your registered membership email.");
                    }
                  }}
                  className={`px-4.5 py-2.5 rounded-lg text-[10px] font-bold hover:shadow-md active:scale-95 transition-all border-none cursor-pointer flex items-center justify-center gap-1.5 ${
                    rsvpedEvents[session.id] 
                      ? 'text-[#6a564d] shadow-sm' 
                      : 'bg-gradient-to-br from-[#8b7368] to-[#dfa38f] text-white hover:from-[#7a6258] hover:to-[#ce927f]'
                  }`}
                  style={rsvpedEvents[session.id] ? {
                    border: '2px solid transparent',
                    background: 'linear-gradient(rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)) padding-box, linear-gradient(135deg, #8b7368 0%, #dfa38f 30%, #ffd0ab 60%, #f5b8c9 100%) border-box'
                  } : undefined}
                >
                  {rsvpedEvents[session.id] ? (
                    <>
                      <span className="material-symbols-outlined text-[13px] text-[#8a6858] font-bold">done</span>
                      Joined
                    </>
                  ) : (
                    "Join Session"
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}



        {/* Recorded Replays Section */}
        <section className="border-t border-[#8a6858]/10 pt-6">
          <div className="flex items-center justify-between gap-4 flex-wrap mb-3">
            <h3 className="text-[#3d251c] font-bold text-sm md:text-base" style={{ fontFamily: "'Playfair Display', serif" }}>
              Recorded Replay Library
            </h3>
            
            {/* Compact Top Pagination Controls for Replays */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2.5 bg-white/60 backdrop-blur-md px-2.5 py-1.5 rounded-[4px] border border-[#dfa38f]/20 text-xs text-[#5c453c] font-bold shadow-sm ml-auto">
                <button
                  type="button"
                  disabled={validCurrentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="p-0.5 hover:bg-[#f6eae0] text-[#ab7e66] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border-none bg-transparent flex items-center justify-center rounded"
                  title="Previous Page"
                >
                  <span className="material-symbols-outlined text-base">chevron_left</span>
                </button>
                <span className="select-none text-[#4a372e] font-sans">
                  Page {validCurrentPage} of {totalPages}
                </span>
                <button
                  type="button"
                  disabled={validCurrentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="p-0.5 hover:bg-[#f6eae0] text-[#ab7e66] disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer border-none bg-transparent flex items-center justify-center rounded"
                  title="Next Page"
                >
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {paginatedReplays.map((rep, idx) => (
              <div 
                key={idx} 
                className="group relative bg-white/85 backdrop-blur-md border border-white/50 rounded-xl overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                {/* Video Thumbnail */}
                <div className="relative aspect-[16/9] bg-zinc-200 overflow-hidden">
                  <img 
                    src={rep.image} 
                    alt={rep.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  {/* Dark overlay */}
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/25 transition-colors"></div>
                  {/* Duration Badge */}
                  <span className="absolute bottom-2.5 right-2.5 bg-black/75 backdrop-blur-sm text-white px-1.5 py-0.5 rounded-md text-[8px] font-bold font-mono">
                    {rep.duration}
                  </span>
                  {/* Translucent Play Button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-8 h-8 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center shadow-lg">
                      <span className="material-symbols-outlined text-white text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                        play_arrow
                      </span>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-3 flex-grow flex flex-col justify-between gap-2.5">
                  <div>
                    <span className="text-[8px] uppercase font-bold tracking-wider text-[#8a6858] block mb-0.5">
                      {rep.mentor}
                    </span>
                    <h4 className="text-[11px] font-bold text-[#3d251c] line-clamp-1 leading-snug">
                      {rep.title}
                    </h4>
                  </div>
                  <div className="text-[9px] text-[#81756f] border-t border-[#8a6858]/5 pt-1.5 font-sans">
                    Recorded {rep.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  )
}

export default LiveSessions
