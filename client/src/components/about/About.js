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
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <h1 className="font-bold sm:text-3xl lg:text-6xl text-black">DiSCuS - Digital Signage Control System</h1>
          </div>
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img className="object-cover object-center rounded w-full" alt="hero" src={svg} />
          </div>
          <div className="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-slate-600">
              <h1 className="font-bold sm:text-3xl lg:text-7xl text-black">DiSCuS</h1>Throw your digitial messages further.
            </h1>
            <p className="mb-8 leading-relaxed text-lg text-black">
             Developed in partial fulfillment of requirement of CS 5666 Software Engineering, Fall 2022.
            </p>
            {/* <div className="flex justify-center">
              <a href="/About">
                <button className="inline-flex text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-slate-600 rounded text-lg">
                  Learn More
                </button>
              </a>
            </div> */}
          </div>
          </div>
          <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <br></br>
           Web Team: Derek, Alcinder, Logan, Luke, Katherine <br></br>
           Util Team: Christine, Phillip, Jacob, Thom, Tyler <br></br>
           CLI/ API Team: Alex, Eli, Vidhi, Olivia, Sami <br></br>
           Product Owner: Dr. Jay Fenwick  link to webpage <br></br>
           <a href="https://github.com/AgileAppstate/discus-whole-class-team">
                <button className="inline-flex text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-slate-600 rounded text-lg">
                  GitHub Repo
                </button>
              </a>
          </div>
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