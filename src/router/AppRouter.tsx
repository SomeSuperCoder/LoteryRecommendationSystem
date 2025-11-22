import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import { Layout } from '@/components/layout/Layout';

import { HomePage, AssistantPage } from '@pages';

export const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <AssistantPage />
            </Layout>
          }
        />
        <Route
          path="/assistant"
          element={
            <Layout>
              <AssistantPage />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
