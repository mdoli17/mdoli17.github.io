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
            },},{id: "articles-designing-tutorial-system-architecture-in-alpaca-dash",
          title: 'Designing Tutorial System Architecture in Alpaca Dash',
          description: "Description for race track generation in alpaca dash",
          section: "Articles",handler: () => {
              window.location.href = "/articles/tutorial-system/";
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
            },},{id: "showcases-alpaca-dash-showcase",
          title: 'Alpaca Dash - Showcase',
          description: "TODO - Instead of gameplay, add a showcase video when it&#39;s complete",
          section: "Showcases",handler: () => {
              window.location.href = "/showcases/alpaca-dash-showcase.html";
            },},{id: "showcases-defi-land-showcase",
          title: 'DeFi-Land Showcase',
          description: "TODO - Instead of gameplay, add a showcase video when it&#39;s complete",
          section: "Showcases",handler: () => {
              window.location.href = "/showcases/defi-land-showcase.html";
            },},{id: "showcases-stealth-game-prototype",
          title: 'Stealth Game Prototype',
          description: "A 2-minute overview of my custom AI system for a stealth prototype. The system integrates extended perception with layered state and behavior tree management, enabling enemies to patrol,search, and chase in response to player actions. Additional features like Safezones and a GUID-based payload event system extend Unreal&#39;s perception API, providing context-aware, modular logic to support engaging stealth gameplay.",
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
