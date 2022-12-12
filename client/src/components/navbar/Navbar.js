import React, { Component } from 'react';

class Navbar extends Component {
  render() {
    return (
      <div>
        <header className="text-gray-600 body-font">
          <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a href="/" className="flex  font-bold items-center text-black mb-4 md:mb-0">
              <span className="ml-3 text-2xl">DiSCuS</span>
            </a>
            <nav className="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
              <a href="/About" className="mr-5 hover:text-gray-900">
                About
              </a>
              <a href="/Media" className="mr-5 hover:text-gray-900">
                Media
              </a>
              <a href="/Playlists" className="mr-5 hover:text-gray-900">
                Playlists
              </a>
              <a href="/Channels" className="mr-5 hover:text-gray-900">
                Channels
              </a>
              <a href="/LiveFeed" className="mr-5 hover:text-gray-900">
                Live Feed
              </a>
            </nav>
          </div>
        </header>
      </div>
    );
  }
}

export default Navbar;
