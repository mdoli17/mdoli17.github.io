// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-home",
    title: "Home",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-projects",
          title: "Projects",
          description: "A collection of projects on which I&#39;ve worked on",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-resume",
          title: "Resume",
          description: "This is a description of the page. You can modify it in &#39;_pages/cv.md&#39;. You can also change or remove the top pdf download button.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/resume/";
          },
        },{id: "projects-alpaca-dash",
          title: 'Alpaca Dash',
          description: "Thrilling alpaca racing game",
          section: "Projects",handler: () => {
              window.location.href = "/projects/alpaca-dash/";
            },},{id: "projects-defi-land",
          title: 'DeFi Land',
          description: "Thrilling farming game",
          section: "Projects",handler: () => {
              window.location.href = "/projects/DeFiLand/";
            },},{id: "projects-stealth-game-prototype",
          title: 'Stealth Game Prototype',
          description: "Faith In Abyss",
          section: "Projects",handler: () => {
              window.location.href = "/projects/faith-in-abyss/";
            },},{id: "projects-mage-ability-demo",
          title: 'Mage Ability Demo',
          description: "Project to showcase mage abilities",
          section: "Projects",handler: () => {
              window.location.href = "/projects/MageDemo/";
            },},{id: "showcases-thrilling-alpaca-racing",
          title: 'Thrilling Alpaca Racing',
          description: "Description of the test showcase, here You can Write everything you like to have",
          section: "Showcases",handler: () => {
              window.location.href = "/showcases/alpaca-dash-showcase.html";
            },},{id: "showcases-stealth-game-prototype",
          title: 'Stealth Game Prototype',
          description: "A 2-minute overview of my custom AI system for a stealth prototype. The system integrates extended perception with layered state and behavior tree management, enabling enemies to patrol,search, and chase in response to player actions. Additional features like Safezones and a GUID-based payload event system extend Unreal&#39;s perception API, providing context-aware, modular logic to support engaging stealth gameplay.",
          section: "Showcases",handler: () => {
              window.location.href = "/showcases/stealth-prototype-ai-system.html";
            },},{id: "showcases-test-showcase-1",
          title: 'test-showcase-1',
          description: "Description of the test showcase, here You can Write everything you like to have",
          section: "Showcases",handler: () => {
              window.location.href = "/showcases/test-showcase-1.html";
            },},{id: "writeups-ability-system",
          title: 'Ability System',
          description: "Implementation of Ability System in Faith in Abyss",
          section: "Writeups",handler: () => {
              window.location.href = "/projects/faith-in-abyss/ability-system/";
            },},{id: "writeups-ai-system-overview",
          title: 'AI System Overview',
          description: "Implementation of AI System in Faith in Abyss",
          section: "Writeups",handler: () => {
              window.location.href = "/projects/faith-in-abyss/ai-system-overview/";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
