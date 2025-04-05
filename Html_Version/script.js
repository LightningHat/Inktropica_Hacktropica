document.addEventListener("DOMContentLoaded", () => {
    // Mobile menu toggle
    const menuToggle = document.querySelector(".menu-toggle")
    const navLinks = document.querySelector(".nav-links")
  
    if (menuToggle) {
      menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active")
  
        // Add styles for active mobile menu
        if (navLinks.classList.contains("active")) {
          navLinks.style.display = "flex"
          navLinks.style.flexDirection = "column"
          navLinks.style.position = "absolute"
          navLinks.style.top = "80px"
          navLinks.style.left = "0"
          navLinks.style.width = "100%"
          navLinks.style.backgroundColor = "white"
          navLinks.style.padding = "20px"
          navLinks.style.boxShadow = "0 10px 15px rgba(0, 0, 0, 0.1)"
          navLinks.style.zIndex = "1000"
        } else {
          navLinks.style.display = ""
          navLinks.style.flexDirection = ""
          navLinks.style.position = ""
          navLinks.style.top = ""
          navLinks.style.left = ""
          navLinks.style.width = ""
          navLinks.style.backgroundColor = ""
          navLinks.style.padding = ""
          navLinks.style.boxShadow = ""
          navLinks.style.zIndex = ""
        }
      })
    }
  
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        e.preventDefault()
  
        const targetId = this.getAttribute("href")
        if (targetId === "#") return
  
        const targetElement = document.querySelector(targetId)
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 100,
            behavior: "smooth",
          })
  
          // Close mobile menu if open
          if (navLinks.classList.contains("active")) {
            navLinks.classList.remove("active")
            navLinks.style.display = ""
            navLinks.style.flexDirection = ""
            navLinks.style.position = ""
            navLinks.style.top = ""
            navLinks.style.left = ""
            navLinks.style.width = ""
            navLinks.style.backgroundColor = ""
            navLinks.style.padding = ""
            navLinks.style.boxShadow = ""
            navLinks.style.zIndex = ""
          }
        }
      })
    })
  
    // Animate elements on scroll
    const animateOnScroll = () => {
      const elements = document.querySelectorAll(".feature-card, .benefit-card, .team-member, .step")
  
      elements.forEach((element) => {
        const elementPosition = element.getBoundingClientRect().top
        const windowHeight = window.innerHeight
  
        if (elementPosition < windowHeight - 100) {
          element.style.opacity = "1"
          element.style.transform = "translateY(0)"
        }
      })
    }
  
    // Set initial styles for animation
    document.querySelectorAll(".feature-card, .benefit-card, .team-member, .step").forEach((element) => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      element.style.transition = "opacity 0.5s ease, transform 0.5s ease"
    })
  
    // Run animation on load and scroll
    window.addEventListener("load", animateOnScroll)
    window.addEventListener("scroll", animateOnScroll)
  })
  
  