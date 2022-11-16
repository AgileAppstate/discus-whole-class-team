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
              <a href="/Mission" className="mr-5 hover:text-gray-900">
                Mission
              </a>
              <a href="/Docs" className="mr-5 hover:text-gray-900">
                Docs
              </a>
              <a href="/Media" className="mr-5 hover:text-gray-900">
                Media
              </a>
            </nav>
            <a href="/Login">
              <button className="inline-flex items-center bg-black text-white border-0 py-1 px-3 focus:outline-none hover:bg-slate-600 rounded text-base mt-4 md:mt-0">
                Login
              </button>
            </a>
          </div>
        </header>
      </div>
    );
  }
}

export default Navbar;
