import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {hasSupabase} from '@/lib/db/index.js';

const PREVIEW=process.env.PREVIEW_MODE==='1';
export const metadata={
  robots:PREVIEW?{index:false,follow:false}:undefined,
  title:{default:'estateXpert · Verified resale homes in South India for NRI families',template:'%s · estateXpert'},
  description:'Verified resale flats, villas, plots and offices in Telangana, Andhra Pradesh, Kerala and Tamil Nadu. Legal papers, nearby places and video walkthroughs in your time zone.'
};
export const viewport={width:'device-width',initialScale:1,themeColor:'#0D2D4A'};

export default function RootLayout({children}){
  return(
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin=""/>
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"/>
      </head>
      <body suppressHydrationWarning>
        {(PREVIEW||!hasSupabase())&&<div className="proto">{PREVIEW?'Preview for review: all listings, prices, names and papers are sample content and not real offers.':'Demo mode: sample listings, names and prices. Nothing here is real or sent anywhere.'}</div>}
        <Header/>
        <main id="main" className="enter">{children}</main>
        <Footer/>
      </body>
    </html>
  );
}
