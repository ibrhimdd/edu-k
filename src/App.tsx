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
    <div className="min-h-screen bg-[#0e1b14] text-white flex flex-col font-sans selection:bg-[#355834] selection:text-[#355834]" dir="rtl">
      
      {/* Platform Navigation Header */}
      <Header 
        onOpenArchitectureModal={() => setShowArchModal(true)}
        onOpenTourModal={() => setShowTourModal(true)}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
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
      <footer className="bg-[#14281d] border-t border-[#355834] mt-auto py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#c2a878]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#355834] text-white flex items-center justify-center font-black text-xs">
              E
            </div>
            <span className="text-[#355834]">
              <strong>منصة التعلم الإلكترونية القائمة على المشروعات لتعليم البرمجة</strong> (EduCode PBL Platform)
            </span>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <button
              onClick={() => setActiveTab('home')}
              className="font-bold text-[#c2a878] hover:text-[#c2a878] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Home className="w-3.5 h-3.5" />
              <span>الشاشة الرئيسية</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowAuthModal(true)}
              className="font-bold text-[#c2a878] hover:text-[#c2a878] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>تسجيل الدخول / حساب جديد</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowTourModal(true)}
              className="font-bold text-[#c2a878] hover:text-[#c2a878] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>دليل المنصة</span>
            </button>
            <span>•</span>
            <button
              onClick={() => setShowArchModal(true)}
              className="font-bold text-[#c2a878] hover:text-[#c2a878] flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Database className="w-3.5 h-3.5" />
              <span>مخطط بنية النظام و Firestore</span>
            </button>
          </div>
        </div>
      </footer>

      {/* Firestore Architecture & Spec Modal */}
      {showArchModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#14281d] rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-[#355834] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#0e1b14] text-white flex items-center justify-between border-b border-[#355834]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#355834] flex items-center justify-center text-white">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">مخطط بنية النظام وقواعد بيانات Firestore</h3>
                  <p className="text-xs text-[#c2a878]">التوثيق الهيكلي والتصميم التجريبي لبيئة التعلم (EduCode PBL)</p>
                </div>
              </div>
              <button
                onClick={() => setShowArchModal(false)}
                className="p-2 rounded-xl text-[#355834] hover:bg-[#355834] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 text-sm text-[#355834]">
              <div>
                <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#c2a878]" />
                  مجموعات Firestore الرئيسية (Collections):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FIRESTORE_COLLECTIONS_METADATA.map((col, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-[#355834] bg-[#0e1b14]">
                      <span className="font-mono text-xs font-bold text-[#c2a878] block">{col.name}</span>
                      <p className="text-xs text-[#355834]/80 mt-1">{col.description}</p>
                      <div className="text-[11px] text-[#355834] mt-2 font-mono bg-[#14281d] p-2 rounded border border-[#355834]">
                        المسار: {col.path}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-white text-base mb-2 flex items-center gap-2">
                  <FileCode2 className="w-4 h-4 text-[#c2a878]" />
                  قواعد الأمان والتحقق (Security Rules):
                </h4>
                <pre className="bg-[#0e1b14] text-white p-4 rounded-xl font-mono text-xs overflow-x-auto text-left border border-[#355834]" dir="ltr">
                  {FIRESTORE_SECURITY_RULES}
                </pre>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#0e1b14] border-t border-[#355834] flex justify-end">
              <button
                onClick={() => setShowArchModal(false)}
                className="px-6 py-2 rounded-xl bg-[#355834] text-white font-bold text-xs hover:bg-[#6e633d] transition-colors cursor-pointer"
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
