import React, { Component } from "react";
import svg from "../../images/discus-logo.svg"

export default class Header extends Component {
  render() {
    return (
      <section class="text-gray-600 body-font">
        <div class="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          <div class="lg:max-w-lg lg:w-full md:w-1/2 w-5/6 mb-10 md:mb-0">
            <img
              class="object-cover object-center rounded w-full"
              alt="hero"
              src={svg}
            />
          </div>
          <div class="lg:flex-grow md:w-1/2 lg:pl-24 md:pl-16 flex flex-col md:items-start md:text-left items-center text-center">
            <h1 class="title-font sm:text-4xl text-3xl mb-4 font-medium text-slate-600">
              <h1 class="font-bold sm:text-3xl lg:text-7xl text-black">DiSCuS</h1>Digital Signage Control System
            </h1>
            <p class="mb-8 leading-relaxed text-lg text-black">
              A web-accessible and/or command line interface application will
              provide use cases. The utility application will run upon direct
              invocation by the web UI and/or CLI, and also periodically via
              crontab to effect visible signage changes as specified.
            </p>
            <div class="flex justify-center">
              <a href="/About">
              <button class="inline-flex text-white bg-black border-0 py-2 px-6 focus:outline-none hover:bg-slate-600 rounded text-lg">
                Learn More
              </button>
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }
}
