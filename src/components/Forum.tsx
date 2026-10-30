import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  ThumbsUp,
  MessageCircle,
  Send,
  User,
  MapPin,
  Tag,
  Plus,
  Users,
  Sparkles,
  BookOpen,
  Award,
  TrendingUp,
  DollarSign,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  Share2,
  X,
  Heart,
  HelpCircle,
  Filter,
  Flame,
  ArrowRight,
  Wifi,
  WifiOff,
  CornerDownRight,
  Search,
  CheckCheck,
  Clock,
  Camera,
  Upload
} from 'lucide-react';
import { ForumPost, ChatMessage, FarmerExperience, Language } from '../types/nammaraitha';
import { FORUM_POSTS } from '../data/mockData';
import { CHAT_CHANNELS, INITIAL_CHAT_MESSAGES, INITIAL_EXPERIENCES, ChatChannel } from '../data/communityData';
import { t } from '../utils/translations';

interface ForumProps {
  lang: Language;
}

type CommunityView = 'chat' | 'experiences' | 'qa';
type QueryFilter = 'all' | 'queries-only' | 'open' | 'resolved';

export const Forum: React.FC<ForumProps> = ({ lang }) => {
  const [activeView, setActiveView] = useState<CommunityView>('chat');

  // --- REAL-TIME WEBSOCKET & CHAT STATE ---
  const [activeChannelId, setActiveChannelId] = useState<string>('queries');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const wsRef = useRef<WebSocket | null>(null);

  // Chat Input State
  const [chatInputText, setChatInputText] = useState('');
  const [chatSenderName, setChatSenderName] = useState(() => {
    return localStorage.getItem('nammaraitha_user_name') || 'Farmer Mitra';
  });
  const [chatSenderLocation, setChatSenderLocation] = useState(() => {
    return localStorage.getItem('nammaraitha_user_location') || 'Mandya, Karnataka';
  });
  const [chatSenderRole, setChatSenderRole] = useState<'Farmer' | 'Agri Specialist' | 'Progressive Grower'>('Farmer');
  
  // Query-specific state
  const [isQueryMode, setIsQueryMode] = useState<boolean>(true);
  const [selectedCropTag, setSelectedCropTag] = useState<string>('General Crop');
  const [replyTarget, setReplyTarget] = useState<{ id: string; author: string; text: string } | null>(null);
  const [queryFilter, setQueryFilter] = useState<QueryFilter>('all');
  const [chatSearchQuery, setChatSearchQuery] = useState('');

  // Image upload in chat
  const [chatImageInput, setChatImageInput] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const imageFileInputRef = useRef<HTMLInputElement>(null);

  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Persist name & location
  useEffect(() => {
    if (chatSenderName) localStorage.setItem('nammaraitha_user_name', chatSenderName);
    if (chatSenderLocation) localStorage.setItem('nammaraitha_user_location', chatSenderLocation);
  }, [chatSenderName, chatSenderLocation]);

  // Initial fetch from REST API
  useEffect(() => {
    fetch('/api/community/messages')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
          setChatMessages(data.messages);
          if (data.onlineCount) setOnlineCount(data.onlineCount);
        }
      })
      .catch((err) => console.warn('Could not load initial chat messages via REST:', err));
  }, []);

  // WebSocket connection & lifecycle with auto-reconnect
  useEffect(() => {
    let reconnectTimeout: any = null;

    const connectWebSocket = () => {
      try {
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${window.location.host}/ws/chat`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);

            if (data.type === 'init') {
              if (Array.isArray(data.messages) && data.messages.length > 0) {
                setChatMessages(data.messages);
              }
              if (data.onlineCount) {
                setOnlineCount(data.onlineCount);
              }
            } else if (data.type === 'chat:message' && data.message) {
              const newMsg: ChatMessage = data.message;
              setChatMessages((prev) => {
                if (prev.some((m) => m.id === newMsg.id)) return prev;
                return [...prev, newMsg];
              });
              setTimeout(() => {
                chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            } else if (data.type === 'chat:update' && data.message) {
              const updated: ChatMessage = data.message;
              setChatMessages((prev) =>
                prev.map((m) => (m.id === updated.id ? updated : m))
              );
            } else if (data.type === 'presence') {
              if (data.onlineCount) {
                setOnlineCount(data.onlineCount);
              }
            }
          } catch (err) {
            console.warn('Error parsing incoming WebSocket message:', err);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          // Auto reconnect after 3 seconds
          reconnectTimeout = setTimeout(connectWebSocket, 3000);
        };

        ws.onerror = (err) => {
          console.warn('WebSocket connection error:', err);
          ws.close();
        };
      } catch (err) {
        console.warn('WebSocket setup exception:', err);
        reconnectTimeout = setTimeout(connectWebSocket, 3000);
      }
    };

    connectWebSocket();

    return () => {
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
      if (wsRef.current) wsRef.current.close();
    };
  }, []);

  // Handle Send Chat / Query
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      channelId: activeChannelId,
      senderName: chatSenderName.trim() || 'Raitha Mitra',
      senderRole: chatSenderRole,
      senderLocation: chatSenderLocation.trim() || 'Karnataka',
      text: chatInputText.trim(),
      image: chatImageInput.trim() || undefined,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
      isQuery: isQueryMode,
      queryCrop: isQueryMode ? selectedCropTag : undefined,
      queryStatus: isQueryMode ? 'open' : undefined,
      replyToId: replyTarget ? replyTarget.id : undefined,
      replyToAuthor: replyTarget ? replyTarget.author : undefined,
      replyToText: replyTarget ? replyTarget.text : undefined,
    };

    // Apply optimistically locally
    setChatMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });

    // Send through WebSocket if available
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat:message',
          message: newMsg,
        })
      );
    } else {
      // Fallback to HTTP POST
      try {
        await fetch('/api/community/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newMsg),
        });
      } catch (err) {
        console.warn('Failed to post message over HTTP:', err);
      }
    }

    setChatInputText('');
    setChatImageInput('');
    setShowImageInput(false);
    setReplyTarget(null);

    setTimeout(() => {
      chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Like a chat message
  const handleLikeChat = async (msgId: string) => {
    // Optimistic update
    setChatMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, likes: m.likes + 1 } : m))
    );

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat:like',
          messageId: msgId,
        })
      );
    } else {
      try {
        await fetch(`/api/community/messages/${msgId}/like`, { method: 'POST' });
      } catch (err) {
        console.warn('Failed to like message over HTTP:', err);
      }
    }
  };

  // Mark a query as resolved
  const handleResolveQuery = async (msgId: string) => {
    // Optimistic update
    setChatMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, queryStatus: 'resolved' } : m))
    );

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'chat:resolve',
          messageId: msgId,
        })
      );
    } else {
      try {
        await fetch(`/api/community/messages/${msgId}/resolve`, { method: 'POST' });
      } catch (err) {
        console.warn('Failed to resolve query over HTTP:', err);
      }
    }
  };

  // Handle Image Upload File
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvt) => {
        const dataUrl = uploadEvt.target?.result as string;
        setChatImageInput(dataUrl);
        setShowImageInput(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // --- EXPERIENCES STATE ---
  const [experiences, setExperiences] = useState<FarmerExperience[]>(() => {
    try {
      const saved = localStorage.getItem('nammaraitha_experiences_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_EXPERIENCES;
  });

  const [selectedExpCategory, setSelectedExpCategory] = useState<string>('all');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [newExpData, setNewExpData] = useState<Partial<FarmerExperience>>({
    category: 'organic',
  });

  useEffect(() => {
    try {
      localStorage.setItem('nammaraitha_experiences_v1', JSON.stringify(experiences));
    } catch (e) {}
  }, [experiences]);

  // --- Q&A FORUM STATE ---
  const [posts, setPosts] = useState<ForumPost[]>(FORUM_POSTS);
  const [isPostingQA, setIsPostingQA] = useState(false);
  const [newQATitle, setNewQATitle] = useState('');
  const [newQAContent, setNewQAContent] = useState('');
  const [newQACrop, setNewQACrop] = useState('Paddy');
  const [qaAuthorName, setQaAuthorName] = useState('');
  const [qaLocation, setQaLocation] = useState('');
  const [replyPostId, setReplyPostId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [replierName, setReplierName] = useState('');

  // Handle Like Experience
  const handleLikeExperience = (expId: string) => {
    setExperiences((prev) =>
      prev.map((exp) => (exp.id === expId ? { ...exp, likes: exp.likes + 1 } : exp))
    );
  };

  // Handle Submit Experience
  const handleSubmitExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpData.farmerName || !newExpData.title || !newExpData.story) return;

    const newEntry: FarmerExperience = {
      id: `exp-${Date.now()}`,
      farmerName: newExpData.farmerName,
      village: newExpData.village || 'Local Village',
      district: newExpData.district || 'Karnataka',
      phone: newExpData.phone,
      crop: newExpData.crop || 'Crop Produce',
      landAcreage: newExpData.landAcreage || '3 Acres',
      technique: newExpData.technique || 'Innovative Agri Practice',
      title: newExpData.title,
      story: newExpData.story,
      costSaved: newExpData.costSaved || 'Substantial Input Savings',
      yieldGained: newExpData.yieldGained || 'Healthy Yield Boost',
      keyAdvice: newExpData.keyAdvice || 'Continuous field observation and soil health maintenance.',
      image: newExpData.image || 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
      likes: 1,
      commentsCount: 0,
      date: 'Just now',
      category: (newExpData.category as any) || 'organic',
    };

    setExperiences([newEntry, ...experiences]);
    setIsShareModalOpen(false);
    setNewExpData({ category: 'organic' });
    setActiveView('experiences');
  };

  // Handle Q&A Post
  const handleAddQAPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQATitle.trim() || !newQAContent.trim()) return;

    const newPost: ForumPost = {
      id: `fp-${Date.now()}`,
      author: qaAuthorName.trim() || 'Raitha Bandhu',
      authorRole: 'Farmer',
      location: qaLocation.trim() || 'Karnataka',
      cropTag: newQACrop,
      title: newQATitle.trim(),
      content: newQAContent.trim(),
      likes: 1,
      date: 'Just now',
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setIsPostingQA(false);
    setNewQATitle('');
    setNewQAContent('');
  };

  const handleAddQAReply = (postId: string) => {
    if (!replyText.trim()) return;

    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p;
        return {
          ...p,
          replies: [
            ...p.replies,
            {
              id: `rep-${Date.now()}`,
              author: replierName.trim() || 'Fellow Farmer',
              content: replyText.trim(),
              date: 'Just now',
            },
          ],
        };
      })
    );

    setReplyText('');
    setReplyPostId(null);
  };

  const currentChannel = CHAT_CHANNELS.find((c) => c.id === activeChannelId) || CHAT_CHANNELS[0];

  // Filtering messages in active channel
  const activeChannelMessages = chatMessages.filter((m) => {
    if (m.channelId !== activeChannelId) return false;

    // Filter by query status
    if (queryFilter === 'queries-only' && !m.isQuery) return false;
    if (queryFilter === 'open' && (!m.isQuery || m.queryStatus !== 'open')) return false;
    if (queryFilter === 'resolved' && (!m.isQuery || m.queryStatus !== 'resolved')) return false;

    // Search query filter
    if (chatSearchQuery.trim()) {
      const q = chatSearchQuery.toLowerCase();
      const matchText = m.text.toLowerCase().includes(q);
      const matchAuthor = m.senderName.toLowerCase().includes(q);
      const matchCrop = m.queryCrop?.toLowerCase().includes(q);
      if (!matchText && !matchAuthor && !matchCrop) return false;
    }

    return true;
  });

  const filteredExperiences = experiences.filter((exp) => {
    if (selectedExpCategory === 'all') return true;
    return exp.category === selectedExpCategory;
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-800/90 border border-emerald-400/40 text-amber-300 text-xs font-bold shadow-sm">
              <span className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>
                {lang === 'kn' ? 'ಲೈವ್ ರೈತರ ಸಮುದಾಯ' : 'Live Farmer Query & Chat Hub'} &bull; {onlineCount} {onlineCount === 1 ? 'Farmer' : 'Farmers'} Online
              </span>
              <span className="text-[10px] text-emerald-200">
                ({isConnected ? 'Real-Time Sync' : 'Reconnecting...'})
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold font-heading tracking-tight">
              {lang === 'kn' ? 'ರೈತರ ಸಂವಾದ & ನೇರ ಪ್ರಶ್ನೋತ್ತರ ವೇದಿಕೆ' : 'Farmer Community Query & Live Chat'}
            </h2>
            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              {lang === 'kn'
                ? 'ಯಾವುದೇ ಬೆಳೆ ರೋಗ, ಬೀಜ, ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಸಂದೇಹಗಳ ಬಗ್ಗೆ ತಕ್ಷಣ ಪ್ರಶ್ನೆ ಕೇಳಿ. ದೇಶಾದ್ಯಂತ ರೈತರು ಮತ್ತು ಕೃಷಿ ತಜ್ಞರೊಂದಿಗೆ ನೈಜ ಸಮಯದಲ್ಲಿ ಲೈವ್ ಚಾಟ್ ಮಾಡಿ.'
                : 'Ask any urgent farming queries on pests, seeds, weather, or market rates. Chat in real time with progressive growers, agronomists, and neighboring farmers across Karnataka and India.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setActiveView('chat');
                setActiveChannelId('queries');
                setIsQueryMode(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs shadow-lg transition"
            >
              <HelpCircle className="w-4 h-4 text-emerald-950" />
              <span>{lang === 'kn' ? '+ ಹೊಸ ಪ್ರಶ್ನೆ ಕೇಳಿ' : '+ Ask a Farming Query'}</span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs border border-emerald-600/50 shadow transition"
            >
              <Award className="w-4 h-4 text-amber-300" />
              <span>{lang === 'kn' ? 'ಅನುಭವ ಹಂಚಿಕೊಳ್ಳಿ' : 'Share Experience'}</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs between Chat, Experience Stories, and Q&A */}
        <div className="relative z-10 flex items-center gap-2 mt-6 pt-5 border-t border-emerald-800/80 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveView('chat')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeView === 'chat'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            <span>{lang === 'kn' ? 'ಲೈವ್ ರೈತರ ಚಾಟ್ & ಪ್ರಶ್ನೋತ್ತರ' : 'Live Farmer Query Chat'}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </button>

          <button
            onClick={() => setActiveView('experiences')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeView === 'experiences'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>{lang === 'kn' ? 'ರೈತರ ಯಶೋಗಾಥೆಗಳು' : 'Farmer Experience Stories'} ({experiences.length})</span>
          </button>

          <button
            onClick={() => setActiveView('qa')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
              activeView === 'qa'
                ? 'bg-white text-emerald-950 shadow-md'
                : 'bg-emerald-900/70 hover:bg-emerald-800 text-emerald-200'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-sky-400" />
            <span>{lang === 'kn' ? 'ಚರ್ಚಾ ವೇದಿಕೆ' : 'Q&A Discussion Board'} ({posts.length})</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: LIVE KISAN CHAT ROOM & QUERY DESK */}
      {activeView === 'chat' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Chat Channels Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Live Rooms List */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <h3 className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>{lang === 'kn' ? 'ಚಾಟ್ ವಿಭಾಗಗಳು' : 'Query & Chat Topics'}</span>
                </h3>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                  {isConnected ? 'Real-Time' : 'Syncing'}
                </span>
              </div>

              <div className="space-y-1.5">
                {CHAT_CHANNELS.map((ch) => {
                  const isSelected = activeChannelId === ch.id;
                  const channelMsgCount = chatMessages.filter((m) => m.channelId === ch.id).length;
                  const queryCount = chatMessages.filter((m) => m.channelId === ch.id && m.isQuery).length;

                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setActiveChannelId(ch.id);
                        if (ch.id === 'queries') {
                          setIsQueryMode(true);
                        }
                      }}
                      className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between gap-2 ${
                        isSelected
                          ? 'bg-emerald-800 text-white shadow-md'
                          : 'bg-stone-50 hover:bg-emerald-50/60 text-stone-700 border border-stone-200/70'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-xl shrink-0">{ch.icon}</span>
                        <div className="min-w-0">
                          <div className={`font-bold text-xs truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                            {lang === 'kn' ? ch.nameKn : ch.name}
                          </div>
                          <div className={`text-[10px] truncate ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                            {ch.description}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 flex items-center gap-1">
                        {queryCount > 0 && (
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                            isSelected ? 'bg-amber-400 text-emerald-950' : 'bg-amber-100 text-amber-800'
                          }`}>
                            ? {queryCount}
                          </span>
                        )}
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-emerald-950 text-emerald-300' : 'bg-stone-200 text-stone-700'
                        }`}>
                          {channelMsgCount}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Profile Tag Box */}
            <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm space-y-3">
              <h4 className="font-bold text-stone-900 text-xs flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Your Farmer Identity (No Login Needed)</span>
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  Open Chat
                </span>
              </h4>
              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-0.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={chatSenderName}
                    onChange={(e) => setChatSenderName(e.target.value)}
                    placeholder="Your Name (e.g. Ramesh Gowda)"
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-0.5">
                    Village / District
                  </label>
                  <input
                    type="text"
                    value={chatSenderLocation}
                    onChange={(e) => setChatSenderLocation(e.target.value)}
                    placeholder="Your Village/District (e.g. Mandya, Karnataka)"
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-semibold text-stone-500 uppercase tracking-wider block mb-0.5">
                    Role in Chat
                  </label>
                  <select
                    value={chatSenderRole}
                    onChange={(e) => setChatSenderRole(e.target.value as any)}
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 bg-stone-50"
                  >
                    <option value="Farmer">Farmer (ರೈತ)</option>
                    <option value="Progressive Grower">Progressive Grower (ಪ್ರಗತಿಪರ ಬೆಳೆಗಾರ)</option>
                    <option value="Agri Specialist">Agri Specialist / Agronomist (ಕೃಷಿ ತಜ್ಞ)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Active Chat Thread Box (8 cols) */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[700px] overflow-hidden">
              {/* Channel Header & Filters */}
              <div className="p-4 bg-stone-50 border-b border-stone-200 shrink-0 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-100 flex items-center justify-center text-xl shadow-inner shrink-0">
                      {currentChannel.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-stone-900 text-sm flex items-center gap-2">
                        <span>{lang === 'kn' ? currentChannel.nameKn : currentChannel.name}</span>
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      </h3>
                      <p className="text-xs text-stone-500 line-clamp-1">{currentChannel.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span>{onlineCount} Active</span>
                    </span>
                  </div>
                </div>

                {/* Filter and Search Bar for queries */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1 border-t border-stone-200/60">
                  <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
                    {(
                      [
                        { id: 'all', label: 'All Messages' },
                        { id: 'queries-only', label: '❓ Queries' },
                        { id: 'open', label: '⏳ Open Queries' },
                        { id: 'resolved', label: '✅ Solved' },
                      ] as const
                    ).map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setQueryFilter(f.id)}
                        className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition whitespace-nowrap ${
                          queryFilter === f.id
                            ? 'bg-emerald-800 text-white shadow-xs'
                            : 'bg-white hover:bg-stone-200 text-stone-600 border border-stone-200'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Search bar */}
                  <div className="relative w-full sm:w-48">
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={chatSearchQuery}
                      onChange={(e) => setChatSearchQuery(e.target.value)}
                      placeholder="Search query / crop..."
                      className="w-full pl-8 pr-3 py-1 rounded-xl bg-white border border-stone-200 text-xs focus:ring-2 focus:ring-emerald-600"
                    />
                    {chatSearchQuery && (
                      <button
                        onClick={() => setChatSearchQuery('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-stone-50/50">
                {activeChannelMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 text-stone-400 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-stone-100 flex items-center justify-center">
                      <HelpCircle className="w-6 h-6 stroke-[1.5] text-stone-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-700 text-sm">No queries or messages matching this view</h4>
                      <p className="text-xs text-stone-400 max-w-sm mt-1">
                        Be the first farmer to post a query or crop update in this room! Fellow farmers will answer in real time.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setQueryFilter('all');
                        setChatSearchQuery('');
                        setIsQueryMode(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow"
                    >
                      + Ask a Query Here
                    </button>
                  </div>
                ) : (
                  activeChannelMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 rounded-2xl border transition space-y-2.5 max-w-3xl ${
                        msg.isQuery
                          ? msg.queryStatus === 'resolved'
                            ? 'bg-emerald-50/60 border-emerald-300 shadow-xs'
                            : 'bg-amber-50/40 border-amber-300/80 shadow-xs'
                          : 'bg-white border-stone-200/90 shadow-xs'
                      }`}
                    >
                      {/* Message Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-full text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-sm ${
                            msg.senderRole === 'Agri Specialist'
                              ? 'bg-sky-700'
                              : msg.senderRole === 'Progressive Grower'
                              ? 'bg-amber-600'
                              : 'bg-emerald-700'
                          }`}>
                            {msg.senderName.substring(0, 1).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-bold text-xs text-stone-900">{msg.senderName}</span>
                              <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                                {msg.senderRole}
                              </span>

                              {/* Query Badge */}
                              {msg.isQuery && (
                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                                  msg.queryStatus === 'resolved'
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : 'bg-amber-200 text-amber-950 border border-amber-400'
                                }`}>
                                  <span>❓ Farmer Query</span>
                                  {msg.queryCrop && <span>&bull; {msg.queryCrop}</span>}
                                </span>
                              )}

                              {msg.queryStatus === 'resolved' && (
                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                                  <CheckCheck className="w-3 h-3" />
                                  <span>Solved</span>
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right text-[11px] text-stone-400 flex items-center gap-2 shrink-0">
                          <span className="hidden sm:flex items-center gap-0.5 text-stone-500">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            <span>{msg.senderLocation}</span>
                          </span>
                          <span className="hidden sm:inline">&bull;</span>
                          <span className="text-stone-400 font-medium">{msg.timestamp}</span>
                        </div>
                      </div>

                      {/* Quoted Reply context if this message is a reply */}
                      {msg.replyToAuthor && (
                        <div className="pl-4 ml-2 border-l-2 border-emerald-500 bg-emerald-50/50 py-1.5 px-3 rounded-r-xl text-xs text-stone-600 space-y-0.5">
                          <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                            <CornerDownRight className="w-3 h-3" />
                            <span>Replying to {msg.replyToAuthor}</span>
                          </div>
                          {msg.replyToText && (
                            <p className="text-[11px] text-stone-500 line-clamp-1 italic">
                              "{msg.replyToText}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <p className="text-xs sm:text-sm text-stone-800 leading-relaxed whitespace-pre-line pl-1">
                        {msg.text}
                      </p>

                      {/* Attached Photo */}
                      {msg.image && (
                        <div className="pl-1 pt-1">
                          <img
                            src={msg.image}
                            alt="Farm crop query"
                            className="max-h-60 rounded-xl object-cover border border-stone-200 shadow-sm"
                          />
                        </div>
                      )}

                      {/* Action Bar (Like, Reply, Resolve) */}
                      <div className="pl-1 pt-1.5 flex flex-wrap items-center gap-3 text-xs border-t border-stone-200/50">
                        <button
                          type="button"
                          onClick={() => handleLikeChat(msg.id)}
                          className="flex items-center gap-1 text-stone-500 hover:text-emerald-700 font-semibold transition"
                        >
                          <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{msg.likes > 0 ? `${msg.likes} Helpful` : 'Helpful'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setReplyTarget({
                              id: msg.id,
                              author: msg.senderName,
                              text: msg.text.substring(0, 60),
                            });
                          }}
                          className="flex items-center gap-1 text-stone-500 hover:text-emerald-700 font-semibold transition"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-sky-600" />
                          <span>Reply to Query</span>
                        </button>

                        {msg.isQuery && msg.queryStatus !== 'resolved' && (
                          <button
                            type="button"
                            onClick={() => handleResolveQuery(msg.id)}
                            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-bold transition ml-auto bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
                          >
                            <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mark as Solved</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatMessagesEndRef} />
              </div>

              {/* Chat Input & Query Composer */}
              <div className="p-3 sm:p-4 bg-white border-t border-stone-200 shrink-0 space-y-2.5">
                {/* Active Reply Banner */}
                {replyTarget && (
                  <div className="flex items-center justify-between p-2 rounded-xl bg-sky-50 border border-sky-200 text-xs text-sky-900">
                    <div className="flex items-center gap-2">
                      <CornerDownRight className="w-4 h-4 text-sky-600 shrink-0" />
                      <span className="font-semibold">Replying to {replyTarget.author}:</span>
                      <span className="italic text-sky-700 line-clamp-1">"{replyTarget.text}..."</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyTarget(null)}
                      className="text-sky-500 hover:text-sky-800 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}

                {/* Query Mode Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsQueryMode(!isQueryMode)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                        isQueryMode
                          ? 'bg-amber-400 text-emerald-950 shadow-xs'
                          : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                      }`}
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{isQueryMode ? '❓ Query Mode (Active)' : '+ Mark as Query'}</span>
                    </button>

                    {isQueryMode && (
                      <select
                        value={selectedCropTag}
                        onChange={(e) => setSelectedCropTag(e.target.value)}
                        className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-300 text-xs font-semibold text-stone-800 focus:outline-none"
                      >
                        <option value="General Crop">General Farm Query</option>
                        <option value="Tomato">Tomato / ಟೊಮೆಟೊ</option>
                        <option value="Paddy / Rice">Paddy / ಭತ್ತ</option>
                        <option value="Cotton">Cotton / ಹತ್ತಿ</option>
                        <option value="Chilli">Chilli / ಮೆಣಸಿನಕಾಯಿ</option>
                        <option value="Sugarcane">Sugarcane / ಕಬ್ಬು</option>
                        <option value="Arecanut">Arecanut / ಅಡಿಕೆ</option>
                        <option value="Maize">Maize / ಮೆಕ್ಕೆಜೋಳ</option>
                        <option value="Groundnut">Groundnut / ಕಡಲೆಕಾಯಿ</option>
                        <option value="Market Price">Mandi Rates & Pricing</option>
                        <option value="Fertilizer">Fertilizers & Soil</option>
                        <option value="Govt Subsidy">Govt Scheme / KCC</option>
                      </select>
                    )}
                  </div>

                  <span className="text-[11px] text-stone-400 hidden sm:inline">
                    Instant real-time broadcast to all farmers
                  </span>
                </div>

                {/* Attached Image Preview if present */}
                {chatImageInput && (
                  <div className="relative inline-block border rounded-xl overflow-hidden shadow-xs">
                    <img src={chatImageInput} alt="Attached" className="h-20 w-auto object-cover" />
                    <button
                      type="button"
                      onClick={() => setChatImageInput('')}
                      className="absolute top-1 right-1 p-1 bg-stone-900/80 rounded-full text-white hover:bg-rose-600 transition"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}

                {/* Image URL input drawer */}
                {showImageInput && !chatImageInput && (
                  <div className="flex items-center gap-2 p-2 bg-stone-50 rounded-xl border border-stone-200">
                    <ImageIcon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <input
                      type="url"
                      value={chatImageInput}
                      onChange={(e) => setChatImageInput(e.target.value)}
                      placeholder="Paste Image URL of affected leaf or harvest..."
                      className="w-full bg-transparent text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => imageFileInputRef.current?.click()}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 whitespace-nowrap px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200"
                    >
                      Upload File
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowImageInput(false)}
                      className="text-stone-400 hover:text-rose-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Hidden File Input */}
                <input
                  ref={imageFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFileChange}
                />

                <form onSubmit={handleSendChat} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      if (!showImageInput && !chatImageInput) {
                        imageFileInputRef.current?.click();
                      } else {
                        setShowImageInput(!showImageInput);
                      }
                    }}
                    className="p-2.5 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-emerald-700 transition"
                    title="Upload or Attach Crop Photo"
                  >
                    <Camera className="w-4 h-4" />
                  </button>

                  <input
                    type="text"
                    required
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    placeholder={
                      isQueryMode
                        ? `Ask your query on ${selectedCropTag}... (e.g. How to prevent fruit rot in continuous rain?)`
                        : `Message #${currentChannel.name.split(' ')[0]}...`
                    }
                    className="flex-1 px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-300 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                  />

                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm shadow-md transition"
                  >
                    <Send className="w-4 h-4" />
                    <span className="hidden sm:inline">{isQueryMode ? 'Post Query' : 'Send'}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: FARMER EXPERIENCE STORIES */}
      {activeView === 'experiences' && (
        <div className="space-y-6">
          {/* Categories Bar & Share Button */}
          <div className="bg-white p-4 rounded-3xl border border-stone-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
              <span className="font-bold text-stone-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </span>
              {[
                { id: 'all', label: 'All Stories' },
                { id: 'organic', label: '🌿 Organic & ZBNF' },
                { id: 'water', label: '💧 Water Saving / Drip' },
                { id: 'pest', label: '🐛 Natural Pest Control' },
                { id: 'yield', label: '🌾 High Yield' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedExpCategory(c.id)}
                  className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition ${
                    selectedExpCategory === c.id
                      ? 'bg-emerald-800 text-white shadow-sm'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-emerald-950 font-extrabold text-xs shadow-md transition shrink-0"
            >
              <Award className="w-4 h-4" />
              <span>+ Post Your Farming Experience</span>
            </button>
          </div>

          {/* Stories Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredExperiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-3xl border border-stone-200 shadow-sm hover:shadow-md transition flex flex-col justify-between overflow-hidden"
              >
                <div>
                  {/* Photo Banner if available */}
                  {exp.image && (
                    <div className="relative h-48 w-full bg-stone-100 overflow-hidden">
                      <img src={exp.image} alt={exp.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-900/80 backdrop-blur text-white font-bold text-xs shadow">
                          🌱 {exp.crop}
                        </span>
                        <span className="px-2 py-1 rounded-lg bg-stone-900/80 backdrop-blur text-amber-300 font-bold text-xs shadow">
                          {exp.landAcreage}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-4">
                    {/* Farmer Identity */}
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center shadow-inner">
                          {exp.farmerName.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-stone-900 leading-snug">{exp.farmerName}</h4>
                          <p className="text-xs text-stone-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-emerald-600" />
                            <span>{exp.village}, {exp.district}</span>
                          </p>
                        </div>
                      </div>

                      <span className="text-[11px] font-semibold text-stone-400">
                        {exp.date}
                      </span>
                    </div>

                    {/* Technique Badge */}
                    <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                      ✨ Technique: {exp.technique}
                    </div>

                    {/* Title & Story */}
                    <div>
                      <h3 className="font-extrabold text-base text-stone-900 leading-snug">
                        {exp.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-stone-600 mt-2 leading-relaxed whitespace-pre-line">
                        {exp.story}
                      </p>
                    </div>

                    {/* Impact / Results Box */}
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-emerald-800 block">Cost Saved</span>
                        <span className="text-xs font-extrabold text-stone-900">{exp.costSaved}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-800 block">Yield Gained</span>
                        <span className="text-xs font-extrabold text-stone-900">{exp.yieldGained}</span>
                      </div>
                    </div>

                    {/* Advice Quote */}
                    <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-xs text-emerald-950 italic">
                      &ldquo;{exp.keyAdvice}&rdquo;
                    </div>
                  </div>
                </div>

                {/* Bottom Bar: Like, Phone */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleLikeExperience(exp.id)}
                    className="flex items-center gap-1 text-stone-600 hover:text-emerald-700 font-bold transition"
                  >
                    <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    <span>{exp.likes} Farmers Inspired</span>
                  </button>

                  {exp.phone && (
                    <a
                      href={`tel:${exp.phone}`}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-200 text-emerald-800 font-bold hover:bg-emerald-50 transition shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Call Farmer</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: Q&A DISCUSSION BOARD */}
      {activeView === 'qa' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-4 rounded-3xl border border-stone-200 shadow-sm">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Have a crop question? Ask local agronomists & farmers</h3>
              <p className="text-xs text-stone-500">Post any pest, seed, or soil query directly without logging in.</p>
            </div>
            <button
              onClick={() => setIsPostingQA(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition"
            >
              + Ask Question
            </button>
          </div>

          <div className="space-y-4">
            {posts.map((p) => (
              <div key={p.id} className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {p.author.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-stone-900 flex items-center gap-2">
                        <span>{p.author}</span>
                        <span className="px-2 py-0.2 rounded-full bg-stone-100 text-stone-500 font-normal text-[10px]">
                          {p.authorRole}
                        </span>
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{p.location}</span>
                        <span>&bull;</span>
                        <span>{p.date}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                    🌱 {p.cropTag}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-stone-900 leading-snug">{p.title}</h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed whitespace-pre-line">
                    {p.content}
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-2 border-t border-stone-100 text-xs text-stone-500">
                  <button
                    onClick={() => {
                      setPosts((prev) =>
                        prev.map((item) => (item.id === p.id ? { ...item, likes: item.likes + 1 } : item))
                      );
                    }}
                    className="flex items-center gap-1.5 hover:text-emerald-700 font-semibold transition"
                  >
                    <ThumbsUp className="w-4 h-4 text-emerald-600" />
                    <span>{p.likes} Likes</span>
                  </button>

                  <button
                    onClick={() => setReplyPostId(replyPostId === p.id ? null : p.id)}
                    className="flex items-center gap-1.5 hover:text-emerald-700 font-semibold transition"
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>{p.replies.length} Replies</span>
                  </button>
                </div>

                {p.replies.length > 0 && (
                  <div className="space-y-2.5 pt-3 border-t border-stone-100 pl-4 border-l-2 border-l-emerald-600/30">
                    {p.replies.map((r) => (
                      <div key={r.id} className="bg-stone-50 p-3 rounded-2xl border border-stone-100 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-bold text-stone-800">
                          <span>{r.author}</span>
                          <span className="text-stone-400 font-normal">{r.date}</span>
                        </div>
                        <p className="mt-1 text-stone-600 leading-relaxed">{r.content}</p>
                      </div>
                    ))}
                  </div>
                )}

                {replyPostId === p.id && (
                  <div className="pt-3 border-t border-stone-100 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={replierName}
                        onChange={(e) => setReplierName(e.target.value)}
                        placeholder="Your Name (e.g. Ramesh)"
                        className="w-1/3 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a helpful agricultural reply..."
                        className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-600"
                      />
                      <button
                        onClick={() => handleAddQAReply(p.id)}
                        className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: SHARE FARMING EXPERIENCE STORY */}
      {isShareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-emerald-800 border border-emerald-500/30 text-amber-300">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base">Share Your Farming Success / Experience Story</h3>
                  <p className="text-xs text-emerald-200">Inspire thousands of fellow farmers across India (No login needed)</p>
                </div>
              </div>
              <button
                onClick={() => setIsShareModalOpen(false)}
                className="text-emerald-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitExperience} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newExpData.farmerName || ''}
                    onChange={(e) => setNewExpData({ ...newExpData, farmerName: e.target.value })}
                    placeholder="e.g. Anand Gowda"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Village / Taluk</label>
                  <input
                    type="text"
                    value={newExpData.village || ''}
                    onChange={(e) => setNewExpData({ ...newExpData, village: e.target.value })}
                    placeholder="e.g. Pandavapura"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">District</label>
                  <input
                    type="text"
                    value={newExpData.district || ''}
                    onChange={(e) => setNewExpData({ ...newExpData, district: e.target.value })}
                    placeholder="e.g. Mandya"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Crop Grown *</label>
                  <input
                    type="text"
                    required
                    value={newExpData.crop || ''}
                    onChange={(e) => setNewExpData({ ...newExpData, crop: e.target.value })}
                    placeholder="e.g. Byadgi Chilli"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Land Size</label>
                  <input
                    type="text"
                    value={newExpData.landAcreage || ''}
                    onChange={(e) => setNewExpData({ ...newExpData, landAcreage: e.target.value })}
                    placeholder="e.g. 2.5 Acres"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Contact Phone (Optional)</label>
                  <input
                    type="text"
                    value={newExpData.phone || ''}
                    onChange={(e) => setNewExpData({ ...newExpData, phone: e.target.value })}
                    placeholder="e.g. 9845012345"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Experience Title *</label>
                <input
                  type="text"
                  required
                  value={newExpData.title || ''}
                  onChange={(e) => setNewExpData({ ...newExpData, title: e.target.value })}
                  placeholder="e.g. Cut pesticide cost by 70% using fermented buttermilk and neem oil"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Detailed Story / What Worked *</label>
                <textarea
                  required
                  rows={4}
                  value={newExpData.story || ''}
                  onChange={(e) => setNewExpData({ ...newExpData, story: e.target.value })}
                  placeholder="Explain step-by-step how you prepared the formulation, timing of application, and actual field observation..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Cost Saved Estimate</label>
                  <input
                    type="text"
                    value={newExpData.costSaved || ''}
                    onChange={(e) => setNewExpData({ ...newExpData, costSaved: e.target.value })}
                    placeholder="e.g. ₹18,000 saved per acre"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Yield Gained Estimate</label>
                  <input
                    type="text"
                    value={newExpData.yieldGained || ''}
                    onChange={(e) => setNewExpData({ ...newExpData, yieldGained: e.target.value })}
                    placeholder="e.g. +4 Quintals extra yield"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsShareModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow"
                >
                  Post Story Live
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: POST Q&A FORUM QUESTION */}
      {isPostingQA && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden my-6">
            <div className="px-6 py-4 bg-gradient-to-r from-emerald-900 to-teal-900 text-white flex items-center justify-between">
              <h3 className="font-extrabold text-base">Ask a Farming Question to the Community</h3>
              <button onClick={() => setIsPostingQA(false)} className="text-emerald-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddQAPost} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={qaAuthorName}
                    onChange={(e) => setQaAuthorName(e.target.value)}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">District / Location</label>
                  <input
                    type="text"
                    required
                    value={qaLocation}
                    onChange={(e) => setQaLocation(e.target.value)}
                    placeholder="e.g. Shimoga"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Related Crop</label>
                <select
                  value={newQACrop}
                  onChange={(e) => setNewQACrop(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                >
                  <option value="Paddy / Rice">Paddy / Rice (ಭತ್ತ)</option>
                  <option value="Tomato">Tomato (ಟೊಮೆಟೊ)</option>
                  <option value="Chilli">Chilli (ಮೆಣಸಿನಕಾಯಿ)</option>
                  <option value="Cotton">Cotton (ಹತ್ತಿ)</option>
                  <option value="Arecanut">Arecanut (ಅಡಿಕೆ)</option>
                  <option value="Sugarcane">Sugarcane (ಕಬ್ಬು)</option>
                  <option value="Maize">Maize (ಮೆಕ್ಕೆಜೋಳ)</option>
                  <option value="Pulses">Pulses / Dal (ತೊಗರಿ/ಕಡಲೆ)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Question Title *</label>
                <input
                  type="text"
                  required
                  value={newQATitle}
                  onChange={(e) => setNewQATitle(e.target.value)}
                  placeholder="e.g. What is the best organic spray for leaf curling in Chilli?"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Description / Details *</label>
                <textarea
                  required
                  rows={4}
                  value={newQAContent}
                  onChange={(e) => setNewQAContent(e.target.value)}
                  placeholder="Provide field symptoms, age of crop, soil type, and what you've tried so far..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPostingQA(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 shadow"
                >
                  Post Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
