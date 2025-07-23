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
        },{id: "post-test-post",
        
          title: "test post",
        
        description: "testing post",
        section: "Posts",
        handler: () => {
          
            window.location.href = "/blog/2025/test/";
          
        },
      },{id: "books-the-godfather",
          title: 'The Godfather',
          description: "",
          section: "Books",handler: () => {
              window.location.href = "/books/the_godfather/";
            },},{id: "news-a-simple-inline-announcement",
          title: 'A simple inline announcement.',
          description: "",
          section: "News",},{id: "news-a-long-announcement-with-details",
          title: 'A long announcement with details',
          description: "",
          section: "News",handler: () => {
              window.location.href = "/news/announcement_2/";
            },},{id: "news-a-simple-inline-announcement-with-markdown-emoji-sparkles-smile",
          title: 'A simple inline announcement with Markdown emoji! :sparkles: :smile:',
          description: "",
          section: "News",},{id: "projects-alpaca-dash",
          title: 'Alpaca Dash',
          description: "Thrilling alpaca racing game",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Unity/AlpacaDash/";
            },},{id: "projects-defi-land",
          title: 'DeFi Land',
          description: "Thrilling farming game",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Unity/DeFiLand/";
            },},{id: "projects-stealth-game-prototype",
          title: 'Stealth Game Prototype',
          description: "Faith In Abyss",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Unreal%20Engine/FaithInAbyss/";
            },},{id: "projects-mage-ability-demo",
          title: 'Mage Ability Demo',
          description: "Project to showcase mage abilities",
          section: "Projects",handler: () => {
              window.location.href = "/projects/Unreal%20Engine/MageDemo/";
            },},{id: "writeups-stealth-ai",
          title: 'Stealth AI',
          description: "",
          section: "Writeups",handler: () => {
              window.location.href = "/writeups/stealth-ai/";
            },},{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6D%61%74%65.%64%6F%6C%69%64%7A%65%31@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-github',
        title: 'GitHub',
        section: 'Socials',
        handler: () => {
          window.open("https://github.com/mdoli17", "_blank");
        },
      },{
        id: 'social-linkedin',
        title: 'LinkedIn',
        section: 'Socials',
        handler: () => {
          window.open("https://www.linkedin.com/in/matedolidze", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=qc6CJjYAAAAJ", "_blank");
        },
      },{
        id: 'social-artstation',
        title: 'Artstation',
        section: 'Socials',
        handler: () => {
          window.open("https://www.artstation.com/matedolidze", "_blank");
        },
      },{
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
