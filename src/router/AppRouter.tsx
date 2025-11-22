// src/app/AppRouter.tsx (или где он у тебя лежит)
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { AssistantPage, NotFoundPage } from '@pages';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Главная страница ассистента */}
        <Route
          path="/"
          element={
            <Layout>
              <AssistantPage />
            </Layout>
          }
        />

        {/* Любой неизвестный путь -> красивая 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};
