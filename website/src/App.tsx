import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import WhyArsx from './components/WhyArsx'
import WhatWeHave from './components/WhatWeHave'
import Team from './components/Team'
import WorkWithUs from './components/WorkWithUs'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <WhyArsx />
        <WhatWeHave />
        <Team />
        <WorkWithUs />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
