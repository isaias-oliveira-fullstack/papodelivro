import { Routes, Route } from "react-router-dom";

import AppContent from "@/layouts/AppContent";

import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import BookDetailPage from "@/pages/BookDetailPage";
import BookPage from "@/pages/BookPage";
import FavoritesPage from "@/pages/FavoritesPage";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "@/routes/PrivateRoute";
import PublicRoute from "@/routes/PublicRoute";
import MyBooksPage from "@/pages/MyBooksPage";
import MyBookDetailPage from "@/pages/MyBookDetailPage";
import AdminApprovalPage from "@/pages/AdminApprovalPage";
import AdminMessagesPage from "@/pages/AdminMessagesPage";
import AdminBooksPage from "@/pages/AdminBooksPage";
import AdminBookDetailPage from "@/pages/AdminBookDetailPage";
import AdminUsersPage from "@/pages/AdminUsersPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import SubmitPromptPage from "@/pages/SubmitPromptPage";
import ContactPage from "@/pages/ContactPage";
import MySummariesPage from "@/pages/MySummariesPage";
import MyReviewsPage from "@/pages/MyReviewsPage";
import ProfilePage from "@/pages/ProfilePage";
import MyMessagesPage from "@/pages/MyMessagesPage";
import SubmitSummaryPage from "@/pages/SubmitSummaryPage";
import TermsUsePage from "@/pages/TermsUsePage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";

const AppRoutes = () => {
  return (
    <Routes>

      <Route element={<AppContent />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/livros" element={<BookPage />} />
        <Route path="/livro/:slug" element={<BookDetailPage />} />
        <Route path="/enviar-resumo" element={<SubmitSummaryPage />} />
        <Route path="/proposta-resumo/:slug?" element={<SubmitPromptPage />} />
        <Route path="/favoritos" element={<FavoritesPage />} />
        <Route path="/fale-conosco" element={<ContactPage />} />
        <Route path="/termos-de-uso" element={<TermsUsePage /> } />
        <Route path="/politica-de-privacidade" element={<PrivacyPolicyPage  /> } />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        <Route element={<PrivateRoute />}>
          <Route path="/meus-resumos" element={<MySummariesPage />} />
          <Route path="/meus-livros" element={<MyBooksPage />} />
          <Route path="/meus-livros/:bookId" element={<MyBookDetailPage />} />
          <Route path="/minhas-avaliacoes" element={<MyReviewsPage />} />
          <Route path="/perfil" element={<ProfilePage />} />
          <Route path="/minhas-mensagens" element={<MyMessagesPage />} />
        </Route>
        
        <Route element={<AdminRoute />}>
          <Route path="/admin/aprovacoes" element={<AdminApprovalPage />} />
          <Route path="/admin/mensagens" element={<AdminMessagesPage />} />
          <Route path="/admin/livros" element={<AdminBooksPage />} />
          <Route path="/admin/livros/:bookId" element={<AdminBookDetailPage />} />
          <Route path="/admin/usuarios" element={<AdminUsersPage />} />
        </Route>
      </Route>

    </Routes>
  );
};

export default AppRoutes;