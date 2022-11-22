import React from 'react';
import { Countdown } from './components/countDown';
import { GoalCard } from './components/goalCard';
import { Navbar } from './components/navbar'
import { Stats } from './components/stats';
import AppContextProvider from "./context/AppContextProvider";

function App() {

  const LaunchDay = new Date('November 23, 2022 23:00:00');

  return (
    <>
      <AppContextProvider>
        <Navbar />
        <div className='flex flex-col justify-center'>
          <h1 className='text-7xl	font-bold	mt-4 m-auto'>Amazonas Crowfunding</h1>
          <h2 className='text-4xl	font-bold	mt-2 m-auto'>Help NOW for a BETTER TOMORROW</h2>
          <Countdown LaunchDate={LaunchDay} />
          <div className='flex flex-row m-auto'>
            <GoalCard Objective="1000" Pledged="800" ActualPledged="500" UserPledge="1" />
            <div className='my-auto' >
              <Stats tokenPrice="0.1" totalBuyers="3878" userBalance="20" />
            </div>
          </div>
        </div>
      </AppContextProvider>
    </>
  );
}

export default App;
