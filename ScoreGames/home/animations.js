let timeline = gsap.timeline()

timeline.from(".pageHeader", { duration: 1, y: "-150" })
        .from(".themeToggle", {duration: 2, ease: "power4", x: -250}, "<1")
        .from(".myGames", { duration: 1, y: -150}, 0.5)
        .from(".editButton", { duration: 1, x: 250}, 0.5)
        .from("#addGameButton", {duration: 1, x: 250}, 0.5)