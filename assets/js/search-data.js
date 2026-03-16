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
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/resume/";
          },
        },{id: "articles-improving-sight-perception-in-stealth-prototype",
          title: 'Improving Sight Perception in Stealth Prototype',
          description: "Awareness Scoring, Vision Cone, State Integration",
          section: "Articles",handler: () => {
              window.location.href = "/articles/improving-sight-perception/";
            },},{id: "articles-data-driven-item-system-in-stealth-prototype",
          title: 'Data-Driven Item System in Stealth Prototype',
          description: "DataAssets, DataTables, Inventory Component",
          section: "Articles",handler: () => {
              window.location.href = "/articles/item-management-system/";
            },},{id: "articles-race-track-generation-in-alpaca-dash",
          title: 'Race Track Generation in Alpaca Dash',
          description: "Pipeline, Bezier Splines, Mesh Generation",
          section: "Articles",handler: () => {
              window.location.href = "/articles/race-track-generation/";
            },},{id: "projects-alpaca-dash",
          title: 'Alpaca Dash',
          description: "Thrilling alpaca racing game",
          section: "Projects",handler: () => {
              window.location.href = "/projects/alpaca-dash/";
            },},{id: "projects-defi-land",
          title: 'DeFi Land',
          description: "Thrilling farming game",
          section: "Projects",handler: () => {
              window.location.href = "/projects/defi-land/";
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
            },},{id: "showcases-alpaca-dash",
          title: 'Alpaca Dash',
          description: "Alpaca Dash is an online racing game where players compete on dynamic, obstacle-filled tracks. I was responsible for core gameplay engineering, including implementing racer movement along Bezier tracks, race track and obstacle generation systems, and responsive UI and VFX to enhance player feedback. I also contributed tools and backend integrations that streamlined development across the team. My work focused on making gameplay both technically solid and fun to play.",
          section: "Showcases",handler: () => {
              window.location.href = "/showcases/alpaca-dash-showcase.html";
            },},{id: "showcases-defi-land",
          title: 'DeFi-Land',
          description: "A farming-simulation project that blends casual mini-games with blockchain-based progression. My contributions centered on building core gameplay systems - from interactive farming mechanics to mini-games that tied into on-chain rewards. I worked closely with designers and artists to ensure the systems were smooth, extensible and delivered an engaging player experience. Beyond feature work, I focused on maintainable code structure to support the project&#39;s rapid growth.",
          section: "Showcases",handler: () => {
              window.location.href = "/showcases/defi-land-showcase.html";
            },},{id: "showcases-gameplay-reel",
          title: 'Gameplay Reel',
          description: "",
          section: "Showcases",handler: () => {
              window.location.href = "/showcases/gameplay-reel.html";
            },},{id: "showcases-stealth-game-prototype",
          title: 'Stealth Game Prototype',
          description: "A 2-minute overview of my custom AI system for a stealth prototype. The system combines extended perception with finite state machines layered over Unreal&#39;s Behavior Tree and State Tree frameworks, enabling enemies to patrol, search, and chase players in a rule-based manner. I implemented pathfinding with dynamic investigation points projected on the navmesh, ensuring enemies react believably to sound and sight stimuli. Additional features like Safezones and a GUID-based payload event system extend Unreal&#39;s perception API, providing context-aware, modular logic that layes the foundation for goal-driven behaviors.",
          section: "Showcases",handler: () => {
              window.location.href = "/showcases/stealth-prototype-ai-system.html";
            },},{id: "writeups-ai-system-overview",
          title: 'AI System Overview',
          description: "Detailed analysis of stealth mechanics and AI system",
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
