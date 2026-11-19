import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../src/app/globals.css';
import './web.css';
import { PublicApp } from './public-app';
createRoot(document.getElementById('root')!).render(<React.StrictMode><PublicApp/></React.StrictMode>);
