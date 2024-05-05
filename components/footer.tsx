import Script from "next/script";

import Container from "./container";
import { SRC_CODE_LINK } from "../lib/constants";

const Footer = () => {
  return (
    <>
      <Script src="https://platform.twitter.com/widgets.js"></Script>
      <footer className="bg-neutral-50 border-t border-neutral-200">
        <Container>
          <div className="py-28 flex flex-col lg:flex-row items-center">
            <div className="tracking-tighter leading-tight text-center lg:text-center mb-10 lg:mb-0 lg:pr-4 lg:w-1/2">
              <a
                className="twitter-follow-button"
                data-show-count="true"
                data-size="large"
              >
                My Dev Twitter
              </a>
            </div>

            <div className="flex flex-col lg:flex-row justify-center items-center lg:pl-4 lg:w-1/2">
              <a
                href={SRC_CODE_LINK}
                className="mx-3 bg-black hover:bg-white hover:text-black border border-black text-white font-bold py-3 px-12 lg:px-8 duration-200 transition-colors mb-6 lg:mb-0"
              >
                View on GitHub
              </a>
            </div>
          </div>
        </Container>
      </footer>
    </>
  );
};

export default Footer;
