"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Play, Pause, SkipForward, SkipBack, Volume2, Maximize,
  BookOpen, CheckCircle, Circle, Clock, FileText, Download,
  MessageSquare, ArrowLeft, Star,
  Monitor, Lightbulb, Code2, Award,
} from "lucide-react";

const lessonData = [
  { id: 1, title: "Introduction et Configuration", duration: "15:30", completed: true, type: "video" },
  { id: 2, title: "Les Fondamentaux", duration: "28:45", completed: true, type: "video" },
  { id: 3, title: "Quiz — Les Bases", duration: "10 min", completed: true, type: "quiz" },
  { id: 4, title: "Structures de Données", duration: "35:20", completed: false, type: "video" },
  { id: 5, title: "TP Pratique — Mini Projet", duration: "45:00", completed: false, type: "practice" },
  { id: 6, title: "Fonctions Avancées", duration: "42:15", completed: false, type: "video" },
  { id: 7, title: "Programmation Asynchrone", duration: "38:50", completed: false, type: "video" },
  { id: 8, title: "Quiz — Intermédiaire", duration: "15 min", completed: false, type: "quiz" },
  { id: 9, title: "APIs et Fetch", duration: "33:10", completed: false, type: "video" },
  { id: 10, title: "Projet Final Guidé", duration: "1:20:00", completed: false, type: "practice" },
  { id: 11, title: "Design Patterns", duration: "40:00", completed: false, type: "video" },
  { id: 12, title: "Examen Final", duration: "30 min", completed: false, type: "quiz" },
];

export default function CoursePlayerPage({ params }: { params: Promise<{ slug: string }> }) {
  const [slug, setSlug] = useState<string>("");
  const [activeLesson, setActiveLesson] = useState(4);
  const [isPlaying, setIsPlaying] = useState(false);
  // const [_progress] = useState(33);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<"content" | "notes" | "discussion">("content");
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([
    { id: 1, text: "Les closures sont des fonctions qui capturent leur environnement lexical.", time: "Leçon 2, 12:30" },
    { id: 2, text: "Penser à utiliser async/await plutôt que .then() pour la lisibilité.", time: "Leçon 4, 08:15" },
  ]);

  const [course, setCourse] = useState<{ slug: string; title: string; image: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    params.then((p) => {
      setSlug(p.slug);
      setLoading(true);
      setError(false);
      fetch(`/api/courses/${p.slug}`)
        .then((res) => { if (!res.ok) throw new Error(); return res.json(); })
        .then((data) => { setCourse(data); setLoading(false); })
        .catch(() => { setError(true); setLoading(false); });
    });
  }, [params]);
  const completedLessons = lessonData.filter((l) => l.completed).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="animate-pulse space-y-6 w-full max-w-2xl px-4">
          <div className="h-8 w-64 bg-white/10 rounded-lg" />
          <div className="aspect-video bg-white/10 rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 w-3/4 bg-white/10 rounded" />
            <div className="h-4 w-1/2 bg-white/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!course || error) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-display font-bold">Formation introuvable</h2>
          <p className="text-gray-400">Cette formation n&apos;existe pas ou a été retirée.</p>
          <Link
            href="/academie"
            className="inline-flex items-center gap-2 px-6 py-3 bg-cyan text-navy rounded-xl font-semibold hover:bg-cyan/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Retour à l&apos;académie
          </Link>
        </div>
      </div>
    );
  }

  const addNote = () => {
    if (!note.trim()) return;
    setNotes([...notes, { id: Date.now(), text: note, time: `Leçon ${activeLesson}, maintenant` }]);
    setNote("");
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-navy border-b border-white/10 px-4 py-3">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-4">
            <Link href={`/academie/${slug || course.slug}`} className="text-gray-300 hover:text-cyan transition-colors flex items-center gap-2 text-sm">
              <ArrowLeft className="w-4 h-4" /> Retour
            </Link>
            <div className="hidden sm:block h-4 w-px bg-white/20" />
            <h1 className="hidden sm:block text-white font-display font-semibold text-sm truncate max-w-md">{course.title}</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan to-green rounded-full transition-all" style={{ width: `${(completedLessons / lessonData.length) * 100}%` }} />
              </div>
              <span>{completedLessons}/{lessonData.length}</span>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-white p-1">
              <BookOpen className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex max-w-[1920px] mx-auto">
        {/* Sidebar - Programme */}
        <aside className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 fixed lg:sticky top-[57px] left-0 z-40 w-80 h-[calc(100vh-57px)] bg-[var(--card-bg)] border-r border-[var(--card-border)] overflow-y-auto transition-transform`}>
          <div className="p-4 border-b border-[var(--card-border)]">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                <Image src={course.image} alt={course.title} fill className="object-cover" sizes="48px" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Formation en cours</p>
                <p className="text-sm font-semibold truncate max-w-[180px]">{course.title}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Programme</p>
            {lessonData.map((lesson, idx) => (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(idx + 1)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all group ${
                  activeLesson === idx + 1
                    ? "bg-cyan/10 text-cyan"
                    : "hover:bg-[var(--card-border)] text-[var(--foreground)]"
                }`}
              >
                {lesson.completed ? (
                  <CheckCircle className="w-4 h-4 text-green shrink-0" />
                ) : activeLesson === idx + 1 ? (
                  <Play className="w-4 h-4 text-cyan shrink-0" />
                ) : (
                  <Circle className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{lesson.title}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    {lesson.type === "video" && <Monitor className="w-3 h-3" />}
                    {lesson.type === "quiz" && <Lightbulb className="w-3 h-3" />}
                    {lesson.type === "practice" && <Code2 className="w-3 h-3" />}
                    {lesson.duration}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="p-4 border-t border-[var(--card-border)]">
            <div className="glass rounded-xl p-4 text-center">
              <Award className="w-8 h-8 text-amber mx-auto mb-2" />
              <p className="text-sm font-semibold">Certificat</p>
              <p className="text-xs text-gray-400 mt-1">Complétez 100% du cours pour obtenir votre certificat</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Video Player */}
          <div className="relative aspect-video bg-black max-h-[70vh]">
            <Image
              src={course.image}
              alt="Leçon en cours"
              fill
              className="object-cover opacity-40"
              sizes="100vw"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-20 h-20 rounded-full bg-cyan/20 border-2 border-cyan flex items-center justify-center hover:bg-cyan/30 transition-all hover:scale-110"
              >
                {isPlaying ? <Pause className="w-8 h-8 text-cyan" /> : <Play className="w-8 h-8 text-cyan ml-1" />}
              </button>
              <p className="text-white mt-4 font-display font-semibold text-lg">
                {lessonData[activeLesson - 1]?.title}
              </p>
            </div>

            {/* Player Controls */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
              <div className="w-full h-1 bg-white/20 rounded-full mb-3 cursor-pointer group">
                <div className="h-full bg-cyan rounded-full relative" style={{ width: "35%" }}>
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-cyan rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center gap-4">
                  <button onClick={() => setActiveLesson(Math.max(1, activeLesson - 1))}><SkipBack className="w-4 h-4" /></button>
                  <button onClick={() => setIsPlaying(!isPlaying)}>
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={() => setActiveLesson(Math.min(lessonData.length, activeLesson + 1))}><SkipForward className="w-4 h-4" /></button>
                  <span className="text-xs text-gray-400">12:45 / {lessonData[activeLesson - 1]?.duration}</span>
                </div>
                <div className="flex items-center gap-4">
                  <Volume2 className="w-4 h-4 cursor-pointer" />
                  <Maximize className="w-4 h-4 cursor-pointer" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-[var(--card-border)]">
            <div className="max-w-4xl mx-auto flex gap-0">
              {([["content", "Contenu", FileText], ["notes", "Notes", BookOpen], ["discussion", "Discussion", MessageSquare]] as const).map(([key, label, Icon]) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as typeof activeTab)}
                  className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === key
                      ? "border-cyan text-cyan"
                      : "border-transparent text-gray-400 hover:text-[var(--foreground)]"
                  }`}
                >
                  <Icon className="w-4 h-4" /> {label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto p-6">
            {activeTab === "content" && (
              <div className="prose prose-invert max-w-none">
                <h2 className="font-display text-2xl font-bold mb-4">{lessonData[activeLesson - 1]?.title}</h2>
                <div className="glass rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-amber" /> Objectifs d&apos;apprentissage
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green mt-0.5 shrink-0" /> Comprendre les concepts fondamentaux de cette section</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green mt-0.5 shrink-0" /> Savoir appliquer ces notions dans des cas pratiques</li>
                    <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-green mt-0.5 shrink-0" /> Maîtriser les bonnes pratiques et patterns associés</li>
                  </ul>
                </div>
                <div className="glass rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-lg mb-3">Ressources de la leçon</h3>
                  <div className="space-y-3">
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--card-border)] transition-colors">
                      <FileText className="w-5 h-5 text-cyan" />
                      <div className="flex-1"><p className="text-sm font-medium">Support de cours PDF</p><p className="text-xs text-gray-400">2.4 MB</p></div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </a>
                    <a href="#" className="flex items-center gap-3 p-3 rounded-lg bg-[var(--card-bg)] hover:bg-[var(--card-border)] transition-colors">
                      <Code2 className="w-5 h-5 text-green" />
                      <div className="flex-1"><p className="text-sm font-medium">Code source des exemples</p><p className="text-xs text-gray-400">GitHub Repository</p></div>
                      <Download className="w-4 h-4 text-gray-400" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <input
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNote()}
                    placeholder="Ajouter une note pour cette leçon..."
                    className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-cyan"
                  />
                  <button onClick={addNote} className="px-4 py-2.5 bg-cyan text-navy rounded-lg text-sm font-semibold hover:bg-cyan/90 transition-colors">
                    Ajouter
                  </button>
                </div>
                <div className="space-y-3">
                  {notes.map((n) => (
                    <div key={n.id} className="glass rounded-xl p-4">
                      <p className="text-sm">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-2 flex items-center gap-1"><Clock className="w-3 h-3" /> {n.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "discussion" && (
              <div className="space-y-4">
                {[
                  { user: "Kofi M.", text: "Excellente explication sur les promesses ! J'ai enfin compris la différence entre async/await et .then().", time: "Il y a 2h", likes: 5 },
                  { user: "Aminata S.", text: "Est-ce que quelqu'un peut m'aider avec l'exercice 3 ? J'ai un problème avec le scope.", time: "Il y a 5h", likes: 2 },
                  { user: "David HOUNSOU", text: "Bonjour Aminata, n'hésitez pas à revoir la section sur les closures, ça devrait vous aider !", time: "Il y a 4h", likes: 8, isInstructor: true },
                ].map((msg, idx) => (
                  <div key={idx} className={`glass rounded-xl p-4 ${"isInstructor" in msg && msg.isInstructor ? "border-l-4 border-cyan" : ""}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-violet flex items-center justify-center text-white text-xs font-bold">
                        {msg.user[0]}
                      </div>
                      <span className="text-sm font-semibold">{msg.user}</span>
                      {"isInstructor" in msg && msg.isInstructor && (
                        <span className="text-xs bg-cyan/20 text-cyan px-2 py-0.5 rounded-full">Instructeur</span>
                      )}
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-300 ml-11">{msg.text}</p>
                    <div className="flex items-center gap-4 mt-2 ml-11">
                      <button className="text-xs text-gray-400 hover:text-cyan flex items-center gap-1">
                        <Star className="w-3 h-3" /> {msg.likes}
                      </button>
                      <button className="text-xs text-gray-400 hover:text-cyan">Répondre</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
