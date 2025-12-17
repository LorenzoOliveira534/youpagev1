
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  Wallet, 
  Calendar, 
  ArrowRight, 
  Menu, 
  X, 
  Star, 
  Zap, 
  Layout,
  Heart,
  Mail,
  Lock,
  ShieldCheck,
  Chrome,
  AlertCircle,
  Plus,
  TrendingUp,
  TrendingDown,
  BrainCircuit,
  Trash2,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

// --- Types & Interfaces ---
type AuthMode = 'login' | 'register' | 'verify' | 'none';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  category: 'chore' | 'work' | 'personal';
}

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
}

interface UserData {
  name: string;
  tasks: Task[];
  transactions: Transaction[];
}

// --- Mock Data Service ---
const StorageService = {
  saveData: (data: UserData) => {
    localStorage.setItem('youpage_data', JSON.stringify(data));
  },
  loadData: (): UserData => {
    const data = localStorage.getItem('youpage_data');
    return data ? JSON.parse(data) : {
      name: 'Usuário',
      tasks: [],
      transactions: []
    };
  },
  clear: () => localStorage.removeItem('youpage_data')
};

// --- AI Service ---
const getAIInsights = async (data: UserData) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Analise os seguintes dados do YouPage em português brasileiro:
    Tarefas: ${JSON.stringify(data.tasks)}
    Transações: ${JSON.stringify(data.transactions)}
    
    Por favor, dê um conselho curto (máximo 3 frases) e motivacional sobre como melhorar a rotina ou as finanças. Seja direto e amigável.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (err) {
    return "Não consegui analisar seus dados agora, mas continue focado na sua organização!";
  }
};

// --- UI Components (Landing Page) ---

const AnimatedShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
    <motion.div 
      animate={{ 
        y: [0, -40, 0],
        rotate: [0, 90, 0],
        scale: [1, 1.1, 1]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-20 right-10 w-64 h-64 bg-[#F1B9A6] opacity-30 rounded-[30% 70% 70% 30% / 30% 30% 70% 70%]"
    />
    <motion.div 
      animate={{ 
        x: [0, 50, 0],
        rotate: [0, -45, 0],
      }}
      transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      className="absolute bottom-20 -left-10 w-96 h-96 bg-[#FA7217] opacity-10 rounded-full blur-3xl"
    />
    <motion.div 
      animate={{ 
        y: [0, 60, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-1/2 left-1/4 w-32 h-32 bg-[#0E1359] opacity-5 rounded-lg rotate-12"
    />
  </div>
);

const FeatureCard = ({ icon: Icon, title, description, color }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-white p-8 rounded-3xl shadow-sm border border-[#D6D1C4] hover:shadow-xl transition-all h-full"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner ${color}`}>
      <Icon className="text-white" size={28} />
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-[#0E1359]/60 leading-relaxed">{description}</p>
  </motion.div>
);

const Hero = ({ onAuth }: { onAuth: (mode: AuthMode) => void }) => {
  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex items-center">
      <AnimatedShapes />
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 bg-[#F1B9A6] text-[#0E1359] px-4 py-1.5 rounded-full text-sm font-bold mb-6 shadow-sm">
            <Zap size={16} fill="currentColor" />
            <span>ORGANIZAÇÃO REAL PARA PESSOAS REAIS</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Sua rotina, <br />
            <span className="text-[#FA7217]">suas regras.</span> <br />
            Finalmente.
          </h1>
          <p className="text-xl text-[#0E1359]/70 mb-10 max-w-lg leading-relaxed">
            Pare de lutar contra aplicativos complexos. O YouPage é o controlador de tarefas, finanças e hábitos que se molda à sua vida, não o contrário.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => onAuth('register')}
              className="bg-[#0E1359] text-white px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#0E1359]/90 transition-all shadow-xl group"
            >
              Criar minha página
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="bg-white text-[#0E1359] border-2 border-[#D6D1C4] px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-[#F1B9A6]/20 transition-all">
              Ver demonstração
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, type: "spring" }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="relative bg-[#0E1359] rounded-3xl p-8 shadow-2xl overflow-hidden aspect-square flex flex-col justify-center">
             <div className="absolute top-0 right-0 w-32 h-32 bg-[#FA7217] rounded-bl-full opacity-20" />
             <div className="space-y-6">
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Finanças</span>
                    <span className="text-[#F1B9A6]">+ R$ 2.450</span>
                  </div>
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '65%' }}
                      transition={{ duration: 1.5, delay: 0.8 }}
                      className="bg-[#FA7217] h-full" 
                    />
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-6 h-6 rounded-md border-2 border-[#F1B9A6] flex items-center justify-center">
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2 }}
                        className="w-3 h-3 bg-[#F1B9A6] rounded-sm" 
                      />
                    </div>
                    <span className="text-white">Academia às 18:00</span>
                  </div>
                </motion.div>

                <motion.div 
                   initial={{ y: 20, opacity: 0 }}
                   animate={{ y: 0, opacity: 1 }}
                   transition={{ delay: 0.9 }}
                   className="flex gap-2"
                >
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className={`h-8 w-8 rounded-lg flex items-center justify-center ${i === 3 ? 'bg-[#FA7217] text-white' : 'bg-white/5 text-white/40'}`}>
                      {i + 10}
                    </div>
                  ))}
                </motion.div>
             </div>
          </div>
          
          <motion.div 
             animate={{ y: [0, -15, 0] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute -top-6 -right-6 w-20 h-20 bg-[#F1B9A6] rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Star className="text-[#0E1359]" fill="currentColor" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="funcionalidades" className="py-24 px-6 bg-[#D6D1C4]/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Tudo o que você precisa em <br />
            <span className="text-[#FA7217]">um só lugar</span>
          </motion.h2>
          <p className="text-lg text-[#0E1359]/60 max-w-2xl mx-auto">
            Esqueça a troca frenética de abas. Centralize sua vida financeira e produtiva com simplicidade.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={CheckCircle2}
            title="Gestão de Tarefas"
            description="Crie listas que fazem sentido para você. Do mercado às metas anuais, organize tudo com um clique."
            color="bg-[#0E1359]"
          />
          <FeatureCard 
            icon={Wallet}
            title="Controle Financeiro"
            description="Saiba exatamente para onde seu dinheiro vai. Gráficos simples e entrada rápida de despesas."
            color="bg-[#FA7217]"
          />
          <FeatureCard 
            icon={Calendar}
            title="Rotina & Hábitos"
            description="Desenvolva constância com nosso rastreador de hábitos integrado ao seu calendário."
            color="bg-[#F1B9A6]"
          />
        </div>
      </div>
    </section>
  );
};

const RoutineFit = () => {
  return (
    <section id="sobre" className="py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-[#0E1359] h-40 rounded-3xl flex items-center justify-center p-6 text-white text-center font-bold">
                  Interface Limpa
                </div>
                <div className="bg-[#F1B9A6] h-60 rounded-3xl flex items-center justify-center relative overflow-hidden">
                  <Heart className="text-[#0E1359] opacity-20 scale-[4]" />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="bg-[#FA7217] h-60 rounded-3xl flex flex-col justify-end p-6 text-white font-bold">
                   Foco no Usuário
                </div>
                <div className="bg-[#D6D1C4] border-2 border-[#0E1359]/10 h-40 rounded-3xl flex items-center justify-center">
                  <Layout className="text-[#0E1359]" size={40} />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              A ferramenta que <br />
              <span className="text-[#FA7217]">entende sua pressa.</span>
            </h2>
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                   <Zap size={24} className="text-[#FA7217]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Acesso Instantâneo</h4>
                  <p className="text-[#0E1359]/60">Sem telas de carregamento infinitas ou menus escondidos. O que importa está sempre à mão.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-md">
                   <Star size={24} className="text-[#FA7217]" />
                </div>
                <div>
                  <h4 className="text-xl font-bold mb-1">Personalização Total</h4>
                  <p className="text-[#0E1359]/60">Mude cores, mude formas, mude a ordem. O YouPage é um quadro em branco para sua vida.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const CTA = ({ onAuth }: { onAuth: (mode: AuthMode) => void }) => {
  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-5xl mx-auto bg-[#0E1359] rounded-[3rem] p-12 md:p-20 text-center text-white relative z-10"
      >
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none rounded-[3rem]">
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-[#FA7217] rounded-full blur-[100px] opacity-20" />
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-[#F1B9A6] rounded-full blur-[100px] opacity-20" />
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight">
          Pronto para ter o <br /> 
          controle de volta?
        </h2>
        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto">
          Junte-se a milhares de pessoas que transformaram o caos em clareza com o YouPage.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button 
            onClick={() => onAuth('register')}
            className="bg-[#FA7217] text-white px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-[0_0_30px_rgba(250,114,23,0.5)] transition-all"
          >
            Criar conta gratuita
          </button>
        </div>
        <p className="mt-8 text-white/40 text-sm">
          Não é necessário cartão de crédito.
        </p>
      </motion.div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-[#D6D1C4]/50 py-12 px-6 border-t border-[#0E1359]/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#FA7217] rounded-lg rotate-12 flex items-center justify-center text-white font-bold">
            Y
          </div>
          <span className="text-xl font-bold">YouPage</span>
        </div>
        
        <div className="flex gap-8 text-[#0E1359]/60 font-medium">
          <a href="#" className="hover:text-[#FA7217] transition-colors">Privacidade</a>
          <a href="#" className="hover:text-[#FA7217] transition-colors">Termos</a>
          <a href="#" className="hover:text-[#FA7217] transition-colors">Ajuda</a>
          <a href="#" className="hover:text-[#FA7217] transition-colors">Contato</a>
        </div>

        <div className="text-[#0E1359]/40 text-sm">
          © {new Date().getFullYear()} YouPage. Feito com amor por você.
        </div>
      </div>
    </footer>
  );
};

// --- Dashboard Component ---

const Dashboard = ({ user, onLogout }: { user: UserData, onLogout: () => void }) => {
  const [data, setData] = useState<UserData>(user);
  const [newTask, setNewTask] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  useEffect(() => {
    StorageService.saveData(data);
  }, [data]);

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    const item: Task = { id: Date.now().toString(), text: newTask, completed: false, category: 'personal' };
    setData(prev => ({ ...prev, tasks: [item, ...prev.tasks] }));
    setNewTask('');
  };

  const addTransaction = (type: 'income' | 'expense') => {
    if (!newDesc.trim() || !newAmount) return;
    const trans: Transaction = {
      id: Date.now().toString(),
      description: newDesc,
      amount: parseFloat(newAmount),
      type,
      date: new Date().toLocaleDateString('pt-BR')
    };
    setData(prev => ({ ...prev, transactions: [trans, ...prev.transactions] }));
    setNewDesc('');
    setNewAmount('');
  };

  const toggleTask = (id: string) => {
    setData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const removeTask = (id: string) => {
    setData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const totals = useMemo(() => {
    const income = data.transactions.filter(t => t.type === 'income').reduce((acc, t) => acc + t.amount, 0);
    const expense = data.transactions.filter(t => t.type === 'expense').reduce((acc, t) => acc + t.amount, 0);
    return { income, expense, balance: income - expense };
  }, [data.transactions]);

  const fetchInsights = async () => {
    setAiLoading(true);
    const insight = await getAIInsights(data);
    setAiInsight(insight);
    setAiLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#D6D1C4] pt-24 pb-12 px-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-[#0E1359]">Olá, {data.name}! 👋</h1>
            <p className="text-[#0E1359]/60">Sua vida organizada em um só lugar.</p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={fetchInsights}
              className="bg-[#FA7217] text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:shadow-lg transition-all"
            >
              <BrainCircuit size={20} />
              {aiLoading ? 'Analisando...' : 'IA Insight'}
            </button>
            <button 
              onClick={onLogout}
              className="bg-white text-[#0E1359] border-2 border-[#0E1359]/5 px-4 py-3 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {aiInsight && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 bg-[#0E1359] text-white rounded-[2rem] shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FA7217] opacity-10 rounded-bl-full" />
            <div className="flex gap-4 items-center">
              <div className="w-12 h-12 bg-[#FA7217] rounded-xl flex items-center justify-center flex-shrink-0">
                <BrainCircuit className="text-white" />
              </div>
              <p className="text-lg italic leading-relaxed">"{aiInsight}"</p>
              <button onClick={() => setAiInsight(null)} className="ml-auto text-white/40 hover:text-white"><X size={20}/></button>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#D6D1C4]">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Wallet className="text-[#FA7217]" /> Finanças
              </h2>
              <div className="space-y-4 mb-8">
                <div className="p-4 bg-[#F1B9A6]/20 rounded-2xl">
                  <span className="text-sm font-bold text-[#0E1359]/40 uppercase tracking-wider">Saldo</span>
                  <p className={`text-3xl font-black ${totals.balance >= 0 ? 'text-[#0E1359]' : 'text-red-500'}`}>
                    R$ {totals.balance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs font-bold opacity-40 uppercase">Entradas</span>
                    <p className="font-bold flex items-center gap-1 text-green-600"><TrendingUp size={14}/> R$ {totals.income}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold opacity-40 uppercase">Saídas</span>
                    <p className="font-bold flex items-center gap-1 text-red-500"><TrendingDown size={14}/> R$ {totals.expense}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <input type="text" placeholder="O que?" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} className="w-full p-3 bg-[#D6D1C4]/20 rounded-xl outline-none" />
                <input type="number" placeholder="Valor" value={newAmount} onChange={(e) => setNewAmount(e.target.value)} className="w-full p-3 bg-[#D6D1C4]/20 rounded-xl outline-none" />
                <div className="flex gap-2">
                  <button onClick={() => addTransaction('income')} className="flex-1 bg-[#0E1359] text-white py-3 rounded-xl font-bold">In</button>
                  <button onClick={() => addTransaction('expense')} className="flex-1 bg-[#FA7217] text-white py-3 rounded-xl font-bold">Out</button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-[#D6D1C4]">
              <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                <CheckCircle2 className="text-[#0E1359]" /> Tarefas
              </h2>
              <form onSubmit={addTask} className="flex gap-2 mb-8">
                <input type="text" placeholder="O que fazer?" value={newTask} onChange={(e) => setNewTask(e.target.value)} className="flex-1 p-4 bg-[#D6D1C4]/20 rounded-2xl outline-none" />
                <button className="bg-[#0E1359] text-white p-4 rounded-2xl"><Plus /></button>
              </form>
              <div className="space-y-3">
                {data.tasks.map(task => (
                  <div key={task.id} className="flex items-center gap-4 p-4 rounded-2xl border border-[#D6D1C4]">
                    <button onClick={() => toggleTask(task.id)} className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${task.completed ? 'bg-[#0E1359] border-[#0E1359]' : ''}`}>
                      {task.completed && <CheckCircle2 size={14} className="text-white" />}
                    </button>
                    <span className={`flex-1 ${task.completed ? 'line-through opacity-40' : ''}`}>{task.text}</span>
                    <button onClick={() => removeTask(task.id)} className="text-red-300 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Navbar (Shared) ---

const Navbar = ({ onAuth, user, onLogout }: { onAuth: (mode: AuthMode) => void, user: UserData | null, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isScrolled = scrolled || !!user;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-[#0E1359]/90 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-10 h-10 bg-[#FA7217] rounded-xl rotate-12 flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-2xl -rotate-12">Y</span>
          </div>
          <span className={`text-2xl font-bold tracking-tight ${isScrolled ? 'text-white' : 'text-[#0E1359]'}`}>YouPage</span>
        </div>

        <div className="hidden md:flex gap-8 items-center font-medium">
          {!user ? (
            <>
              <a href="#funcionalidades" className={`${isScrolled ? 'text-white/80' : 'text-[#0E1359]/80'} hover:text-[#FA7217] transition-colors`}>Funcionalidades</a>
              <button onClick={() => onAuth('login')} className={`${isScrolled ? 'text-white/80' : 'text-[#0E1359]/80'} hover:text-[#FA7217] transition-colors`}>Entrar</button>
              <button 
                onClick={() => onAuth('register')}
                className="bg-[#FA7217] text-white px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(250,114,23,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                Começar Grátis
              </button>
            </>
          ) : (
            <div className="flex items-center gap-4 bg-white/10 px-4 py-2 rounded-2xl text-white">
              <UserIcon className="text-[#FA7217]" size={20} />
              <span className="font-bold">{user.name}</span>
            </div>
          )}
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className={isScrolled ? 'text-white' : 'text-[#0E1359]'} /> : <Menu className={isScrolled ? 'text-white' : 'text-[#0E1359]'} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-[#0E1359] p-6 shadow-2xl flex flex-col gap-4 text-white md:hidden"
          >
            {user ? (
              <button onClick={onLogout} className="text-left font-bold text-red-400">Sair</button>
            ) : (
              <>
                <a href="#funcionalidades" onClick={() => setIsOpen(false)}>Funcionalidades</a>
                <button onClick={() => { onAuth('login'); setIsOpen(false); }} className="text-left font-bold">Entrar</button>
                <button onClick={() => { onAuth('register'); setIsOpen(false); }} className="bg-[#FA7217] w-full py-3 rounded-xl font-bold">Começar Grátis</button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const AuthSection = ({ mode, setMode, onClose, onAuthSuccess }: { mode: AuthMode, setMode: (m: AuthMode) => void, onClose: () => void, onAuthSuccess: (name: string) => void }) => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState(['', '', '', '']);
  const inputRefs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    if (value !== '' && index < 3) inputRefs[index + 1].current?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && verificationCode[index] === '' && index > 0) inputRefs[index - 1].current?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    setTimeout(() => {
      setIsSubmitting(false);
      if (mode === 'register') setMode('verify');
      else if (mode === 'verify') {
        if (verificationCode.join('') === '1234') onAuthSuccess(name || 'Explorador');
        else setError('Código incorreto. Use "1234".');
      } else {
        onAuthSuccess('Usuário');
      }
    }, 1200);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0E1359]/20 backdrop-blur-xl">
      <motion.div layoutId="auth-card" initial={{ y: 50, scale: 0.9 }} animate={{ y: 0, scale: 1 }} exit={{ y: 50, scale: 0.9 }} className="bg-white w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-8 right-8 p-2 rounded-full hover:bg-gray-100 z-10"><X size={24} className="text-[#0E1359]" /></button>
        <div className="p-10 md:p-14">
          <AnimatePresence mode="wait">
            {mode === 'verify' ? (
              <motion.div key="verify" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="text-center">
                <div className="w-20 h-20 bg-[#F1B9A6] rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg"><ShieldCheck size={40} className="text-[#0E1359]" /></div>
                <h2 className="text-3xl font-bold mb-4">Verificação</h2>
                <p className="mb-8">Código para <strong>{email}</strong>. Use <strong>1234</strong>.</p>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="flex gap-4 justify-center">
                    {verificationCode.map((digit, i) => (
                      <input key={i} ref={inputRefs[i]} type="text" maxLength={1} value={digit} onChange={(e) => handleDigitChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)} className="w-12 h-16 text-center text-2xl font-bold border-2 rounded-2xl border-[#D6D1C4] focus:border-[#FA7217] outline-none" />
                    ))}
                  </div>
                  {error && <p className="text-red-500 font-bold">{error}</p>}
                  <button className="w-full bg-[#0E1359] text-white py-4 rounded-2xl font-bold">Verificar</button>
                </form>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                <h2 className="text-3xl font-bold mb-8">{mode === 'login' ? 'Entrar' : 'Cadastrar'}</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {mode === 'register' && (
                    <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Seu Nome" className="w-full px-6 py-4 border-2 border-[#D6D1C4] rounded-2xl focus:border-[#FA7217] outline-none" />
                  )}
                  <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-6 py-4 border-2 border-[#D6D1C4] rounded-2xl focus:border-[#FA7217] outline-none" />
                  <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Senha" className="w-full px-6 py-4 border-2 border-[#D6D1C4] rounded-2xl focus:border-[#FA7217] outline-none" />
                  <button className="w-full bg-[#0E1359] text-white py-4 rounded-2xl font-bold">{mode === 'login' ? 'Entrar' : 'Próximo'}</button>
                  <button type="button" onClick={() => onAuthSuccess('Google User')} className="w-full bg-white border-2 border-[#D6D1C4] text-[#0E1359] py-4 rounded-2xl font-bold flex items-center justify-center gap-2"><Chrome size={20} className="text-[#4285F4]" /> Google</button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

// --- Main App ---

const App: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('none');
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('youpage_user');
    if (saved) {
      setCurrentUser(StorageService.loadData());
    }
  }, []);

  const handleAuthSuccess = (name: string) => {
    const existingData = StorageService.loadData();
    const newUser = { ...existingData, name };
    setCurrentUser(newUser);
    StorageService.saveData(newUser);
    localStorage.setItem('youpage_user', 'active');
    setAuthMode('none');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('youpage_user');
  };

  return (
    <div className="relative overflow-x-hidden selection:bg-[#FA7217] selection:text-white">
      <Navbar onAuth={setAuthMode} user={currentUser} onLogout={handleLogout} />
      
      {currentUser ? (
        <Dashboard user={currentUser} onLogout={handleLogout} />
      ) : (
        <main>
          <Hero onAuth={setAuthMode} />
          <Features />
          <RoutineFit />
          <CTA onAuth={setAuthMode} />
          <Footer />
        </main>
      )}

      <AnimatePresence>
        {authMode !== 'none' && (
          <AuthSection 
            mode={authMode} 
            setMode={setAuthMode} 
            onClose={() => setAuthMode('none')} 
            onAuthSuccess={handleAuthSuccess}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
