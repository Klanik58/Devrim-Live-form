import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import { useAppContext } from './hooks/useAppContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ForumPage from './pages/ForumPage';
import TopicPage from './pages/TopicPage';
import HomePage from './pages/HomePage';

const Notification = () => {
    const { notification } = useAppContext();
    if (!notification.message) return null;

    const baseClasses = "fixed bottom-5 right-5 px-6 py-3 rounded-lg shadow-lg text-white font-semibold transition-opacity duration-300";
    const typeClasses = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-blue-600",
    };

    return (
        <div className={`${baseClasses} ${typeClasses[notification.type]}`}>
            {notification.message}
        </div>
    );
};


function App() {
    const { page } = useAppContext();

    const renderPage = () => {
        switch (page.name) {
            case 'login':
                return <LoginPage />;
            case 'register':
                return <RegisterPage />;
            case 'profile':
                return <ProfilePage />;
            case 'forgot-password':
                return <ForgotPasswordPage />;
            case 'leaderboard':
                return <LeaderboardPage />;
            case 'forum':
                 return <ForumPage categoryId={page.params?.id as number} />;
            case 'topic':
                return <TopicPage postId={page.params?.id as number} />;
            case 'home':
            default:
                return <HomePage />;
        }
    };

    return (
        <div className="bg-gray-900 text-gray-300 min-h-screen font-sans flex flex-col">
            <Header />
            <div className="flex-grow">
              {renderPage()}
            </div>
            <Footer />
            <Notification />
        </div>
    );
}

export default App;