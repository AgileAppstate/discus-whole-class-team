import React, { Component } from "react";

class Navbar extends Component {
  render() {
    return (
      <div>
        <header class="text-gray-600 body-font">
          <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
            <a href="/" class="flex  font-bold items-center text-black mb-4 md:mb-0">
              <span class="ml-3 text-2xl">DiSCuS</span>
            </a>
            <nav class="md:ml-auto md:mr-auto flex flex-wrap items-center text-base justify-center">
              <a href="/About" class="mr-5 hover:text-gray-900">About</a>
              <a href="/Mission" class="mr-5 hover:text-gray-900">Mission</a>
              <a href="/Docs" class="mr-5 hover:text-gray-900">Docs</a>
            </nav>
            <a href="/Login">
            <button class="inline-flex items-center bg-black text-white border-0 py-1 px-3 focus:outline-none hover:bg-slate-600 rounded text-base mt-4 md:mt-0">
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
