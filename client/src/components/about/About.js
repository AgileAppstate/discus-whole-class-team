import React from 'react';
import svg from '../../images/discus-logo.svg';

class About extends React.Component {
  state = {
    About: [],
    columns: []
  };

  render() {
    return (
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 md:flex-row flex-col items-center">
          <h1 className="font-bold sm:text-3xl lg:text-6xl text-black">
            DiSCuS - Digital Signage Control System
          </h1>
        </div>
        <div className="container mx-auto flex px-5 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img className="object-cover object-center rounded w-full" alt="hero" src={svg} />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-slate-600">
              <h1 className="font-bold sm:text-3xl lg:text-7xl text-black">DiSCuS</h1>Throw your
              digitial messages further.
            </h1>
            <p className="mb-8 leading-relaxed text-lg text-black">
              Developed in partial fulfillment of requirement of CS 5666:<br></br> Software
              Engineering Fall 2022.
            </p>
          </div>
        </div>
        <div className="container mx-auto flex px-5 py-10 md:flex-row flex-col items-center">
          <p className="w-full text-3xl text-left">
            <b>Web Team: </b>{' '}
            <a
              href="https://github.com/SageJames"
              onMouseOver="this.style.color='#FFF'"
              target={'blank'}
            >
              Alcinder Lewis
            </a>
            ,{' '}
            <a href="https://github.com/wilsondc5" target={'blank'}>
              Derek Wilson
            </a>
            ,{' '}
            <a href="https://github.com/bealkg" target={'blank'}>
              Katherine Beal
            </a>
            ,{' '}
            <a href="https://github.com/loganwrichardson" target={'blank'}>
              Logan Richardson
            </a>
            ,{' '}
            <a href="https://github.com/pattersonlt" target={'blank'}>
              Luke Patterson
            </a>
            <br></br>
            <br></br>
            <b>CLI/ API Team: </b>{' '}
            <a href="https://github.com/ChrisCarter01" target={'blank'}>
              Christine Carter
            </a>
            ,{' '}
            <a href="https://github.com/zzMountainManzz" target={'blank'}>
              Jacob Villemagne
            </a>
            ,{' '}
            <a href="https://github.com/phdavis1027" target={'blank'}>
              Phillip Davis
            </a>
            ,{' '}
            <a href="https://github.com/cosmicboots" target={'blank'}>
              Thom Dickson
            </a>
            ,{' '}
            <a href="https://github.com/t9605tripp" target={'blank'}>
              Tyler Tripp
            </a>
            <br></br>
            <br></br>
            <b>Util Team: </b>{' '}
            <a href="https://github.com/alexpclarke" target={'blank'}>
              Alex Clarke
            </a>
            ,{' '}
            <a href="https://github.com/eliorians" target={'blank'}>
              Eli Orians
            </a>
            ,{' '}
            <a href="https://github.com/hessorr" target={'blank'}>
              Olivia Hess
            </a>
            ,{' '}
            <a href="https://github.com/KittenMoon" target={'blank'}>
              Sami Griep
            </a>
            ,{' '}
            <a href="https://github.com/Vidhi67" target={'blank'}>
              Vidhi Patel
            </a>
            <br></br>
            <br></br>
            <b>Product Owner: </b>{' '}
            <a href="https://compsci.appstate.edu/faculty-staff/dr-jay-fenwick" target={'blank'}>
              Dr. Jay Fenwick
            </a>
            <br></br>
          </p>
        </div>
        <div className="container mx-auto flex px-5 md:flex-row flex-col items-center">
          <a href="https://github.com/AgileAppstate/discus-whole-class-team" target={'blank'}>
            <button className="inline-flex text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-slate-600 rounded text-lg">
              GitHub Repo
            </button>
          </a>
        </div>
        <br></br>
        <br></br>
      </section>

      //   {/* <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-slate-600">
      //          <h1 className="font-bold sm:text-3xl lg:text-7xl text-black">DiSCuS</h1>
      //          DigitalSignage Control System
      //        </h1> */}
      //      <h1 className="font-bold sm:text-3xl lg:text-6xl text-black">DiSCuS - Digital Signage Control System</h1>
      //    <br/>
      //    <h3 className="title-font sm:text-2xl text-3xl mb-4 font-medium text-slate-600">
      //          <h3 className="font-bold sm:text-3xl lg:text-5xl text-black">Media</h3>
      //          Upload and view media files.
      //        </h3>

      //   <h3 className="title-font sm:text-2xl text-3xl mb-4 font-medium text-slate-600">
      //          <h3 className="font-bold sm:text-3xl lg:text-5xl text-black">Playlists</h3>
      //          Organize media.
      //        </h3>

      //   <h3 className="title-font sm:text-2xl text-3xl mb-4 font-medium text-slate-600">
      //          <h3 className="font-bold sm:text-3xl lg:text-5xl text-black">Channels</h3>
      //          Control playback.
      //        </h3>

      //   <h3 className="title-font sm:text-2xl text-3xl mb-4 font-medium text-slate-600">
      //          <h3 className="font-bold sm:text-3xl lg:text-5xl text-black">Live Feed</h3>
      //          Monitor the live stream.
      //        </h3>

      //    <br></br>
      //  </div>
    );
  }
}

export default About;
