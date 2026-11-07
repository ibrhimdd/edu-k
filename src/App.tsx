/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { HomePage } from './components/home/HomePage';
import { SimplifiedStudentPortal } from './components/student/SimplifiedStudentPortal';
import { SimplifiedTeacherPortal } from './components/teacher/SimplifiedTeacherPortal';
import { StudentDashboard } from './components/student/StudentDashboard';
import { LearningUnitsView } from './components/student/LearningUnitsView';
import { IndividualProjectWorkspace } from './components/student/IndividualProjectWorkspace';
import { CollaborativeProjectWorkspace } from './components/student/CollaborativeProjectWorkspace';
import { AssessmentsView } from './components/student/AssessmentsView';
import { EngagementScaleView } from './components/student/EngagementScaleView';
import { TeacherDashboard } from './components/teacher/TeacherDashboard';
import { InteractiveDemoTour } from './components/common/InteractiveDemoTour';
import { AuthModal } from './components/common/AuthModal';
import { LoginPage } from './components/auth/LoginPage';
import { 
  BookOpen, 
  Layers, 
  Award, 
  HelpCircle, 
  Sparkles, 
  Database, 
  ShieldCheck, 
  X,
  FileCode2,
  Users,
  Code2,
  Compass,
  Home,
  UserPlus
} from 'lucide-react';
import { FIRESTORE_COLLECTIONS_METADATA, FIRESTORE_SECURITY_RULES } from './data/firestoreSchemaJson';

const MainLayout: React.FC = () => {
  const { currentUser, activeTab, setActiveTab, isAuthenticated } = useApp();
  const [showArchModal, setShowArchModal] = useState<boolean>(false);
  const [showTourModal, setShowTourModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  if (!isAuthenticated) {
    return <LoginPage onOpenArchitecture={() => setShowArchModal(true)} />;
  }

  const isTeacher = currentUser.role === 'teacher_admin';
  const isCollaborative = currentUser.role === 'student_collaborative';

  return (
    <div className="min-h-screen bg-[#EDF6F9] text-[#1F2937] flex flex-col font-cairo selection:bg-[#006D77] selection:text-white" dir="rtl">
      
      {/* Platform Navigation Header */}
      <Header 
        onOpenArchitectureModal={() => setShowArchModal(true)}
        onOpenTourModal={() => setShowTourModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4">
        {activeTab === 'home' ? (
          <HomePage 
            onOpenTour={() => setShowTourModal(true)}
            onOpenAuth={() => setShowAuthModal(true)}
            onOpenArch={() => setShowArchModal(true)}
          />
        ) : activeTab === 'engagement_scale' ? (
          <EngagementScaleView 
            asRefereeMode={isTeacher}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        ) : isTeacher ? (
          <SimplifiedTeacherPortal />
        ) : (
          <SimplifiedStudentPortal />
        )}
      </main>

      {/* Interactive Demo Tour */}
      <InteractiveDemoTour 
        isOpen={showTourModal} 
        onClose={() => setShowTourModal(false)} 
      />

      {/* Auth & Registration Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* Educational Platform Footer */}
      <footer className="bg-[#004D54] border-t border-[#83C5BE] mt-auto py-5 px-4 space-y-3 text-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#006D77] text-white flex items-center justify-center font-black text-xs border border-[#E29578]/50/30">
              E
            </div>
            <span className="text-white">
              <strong>منصة التعلم الإلكترونية القائمة على المشروعات لتعليم البرمجة</strong> (GitHub)
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab('home')}
              className="font-bold text-[#E29578] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>الشاشة الرئيسية</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowAuthModal(true)}
              className="font-bold text-[#E29578] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>تسجيل الدخول / حساب جديد</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowTourModal(true)}
              className="font-bold text-[#E29578] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>دليل المنصة</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowArchModal(true)}
              className="font-bold text-[#E29578] hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>مخطط بنية النظام و Firestore</span>
            </button>
          </div>
        </div>

        {/* Academic Supervision & Developer Copyright Bar */}
        <div className="max-w-7xl mx-auto pt-3 border-t border-[#83C5BE]/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-white">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E29578]"></span>
            <span className="text-white">المشرف العام: <strong className="text-[#E29578]">د. محمد رضوان أبو حشيش</strong></span>
          </div>
          <div className="text-white">
            جميع الحقوق محفوظة للدفلبر <strong className="text-[#E29578]">إبراهيم الخولي</strong> © 2026
          </div>
        </div>
      </footer>

      {/* Firestore Architecture & Spec Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#83C5BE] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#EDF6F9] text-[#006D77] flex items-center justify-between border-b border-[#83C5BE]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#006D77] flex items-center justify-center text-white">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#004D54]">مخطط بنية النظام وقواعد بيانات Firestore</h3>
                  <p className="text-xs text-[#91472F]">التوثيق الهيكلي والتصميم التجريبي لبيئة التعلم (GitHub)</p>
                </div>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="p-2 rounded-xl text-[#006D77] hover:bg-[#006D77] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#006D77]">
              <div>
                <h4 className="font-bold text-[#004D54] text-base mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#E29578]" />
                  مجموعات Firestore الرئيسية (Collections):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FIRESTORE_COLLECTIONS_METADATA.map((col, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-[#83C5BE] bg-[#EDF6F9]">
                      <span className="font-mono text-xs font-bold text-[#E29578] block">{col.name}</span>
                      <p className="text-xs text-[#006D77]/80 mt-1">{col.description}</p>
                      <div className="text-[11px] text-[#006D77] mt-2 font-mono bg-white p-2 rounded border border-[#83C5BE]">
                        المسار: {col.path}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-[#004D54] text-base mb-2 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-[#E29578]" />
                  قواعد الأمان والتحقق (Security Rules):
                </h4>
                <pre className="bg-[#EDF6F9] text-[#006D77] p-4 rounded-xl font-mono text-xs overflow-x-auto text-left border border-[#83C5BE]" dir="ltr">
                  {FIRESTORE_SECURITY_RULES}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#EDF6F9] border-t border-[#83C5BE] flex justify-end">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-6 py-2 rounded-xl bg-[#006D77] text-white font-bold text-xs hover:bg-[#E29578] transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}

export default App;
