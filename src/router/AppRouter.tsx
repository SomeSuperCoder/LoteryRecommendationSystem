import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@pages';
import { Assistant } from '@/components/assistant/Assistants';
export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/assistant" element={<Assistant />} />
      </Routes>
    </BrowserRouter>
  );
};
