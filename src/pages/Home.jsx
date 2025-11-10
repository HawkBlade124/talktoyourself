import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  

  return (
    <div>
        <section id="hero" className="flex items-center justify-center m-auto">
          <h1>Talk to yourself. Your thought organizer tool.</h1>
        </section>        
        <div className="auto ">
          <section>
            <h2>What is this tool?</h2>
            <div className="">
              <p>This tool lets you collectively gather and organize your thoughts into thought bubbles, and </p>

            </div>
          </section>
          <section>
            {/* About */}
          </section>
          <section>
            {/* CTA */}
          </section>                  
        </div>
    </div>
  );
}

export default Home;
