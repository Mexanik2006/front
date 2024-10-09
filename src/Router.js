import React from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App';
import Login from './pages/Login/Login';
import { useAuthContext } from './hooks/useAuthContext';
import UploadAddress from './components/uploads/UploadAddress';
import DownloadAddress from './components/download/DownloadAddress';
import UploadImege from './components/uploads/UploadImege';
import DownloadImage from './components/download/DownloadImege';
import UploadVideo from './components/uploads/UploadVideo';
import DownloadVideo from './components/download/DownloadVideo';
import UploadFile from './components/uploads/UploadFile';
import DownloadFile from './components/download/DownloadFile';

function Router() {
    const { user } = useAuthContext();

    return (
        <BrowserRouter>
            <Routes>
                {/* Login Route */}
                <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />

                {/* Home Route */}
                <Route path="/" element={user ? <App /> : <Navigate to="/login" />} />

                {/* upload */}
                <Route path="/address-upload" element={user ? <UploadAddress /> : <Navigate to="/login" />} />
                <Route path="/image-upload" element={user ? <UploadImege /> : <Navigate to="/login" />} />
                <Route path="/video-upload" element={user ? <UploadVideo /> : <Navigate to="/login" />} />
                <Route path="/file-upload" element={user ? <UploadFile /> : <Navigate to="/login" />} />

                {/* download */}
                <Route path="/address-download" element={user ? <DownloadAddress /> : <Navigate to="/login" />} />
                <Route path="/image-download" element={user ? <DownloadImage /> : <Navigate to="/login" />} />
                <Route path="/video-download" element={user ? <DownloadVideo /> : <Navigate to="/login" />} />
                <Route path="/file-download" element={user ? <DownloadFile /> : <Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
