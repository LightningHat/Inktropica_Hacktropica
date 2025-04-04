document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const fileUpload = document.getElementById("fileUpload")
    const uploadArea = document.getElementById("uploadArea")
    const uploadedFiles = document.getElementById("uploadedFiles")
    const trainModelBtn = document.getElementById("trainModelBtn")
    const inputText = document.getElementById("inputText")
    const convertBtn = document.getElementById("convertBtn")
    const clearBtn = document.getElementById("clearBtn")
    const loadingIndicator = document.getElementById("loadingIndicator")
    const handwritingOutput = document.getElementById("handwritingOutput")
    const outputImage = document.getElementById("outputImage")
    const placeholderMessage = document.getElementById("placeholderMessage")
    const downloadBtn = document.getElementById("downloadBtn")
    const shareBtn = document.getElementById("shareBtn")
  
    // Style controls
    const slantRange = document.getElementById("slantRange")
    const thicknessRange = document.getElementById("thicknessRange")
    const spacingRange = document.getElementById("spacingRange")
  
    // File upload handling
    if (uploadArea && fileUpload) {
      uploadArea.addEventListener("click", () => {
        fileUpload.click()
      })
  
      uploadArea.addEventListener("dragover", (e) => {
        e.preventDefault()
        
              uploadArea.style.borderColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-color');
        uploadArea.style.backgroundColor = "rgba(108, 99, 255, 0.05)"
      })
  
      uploadArea.addEventListener("dragleave", () => {
        uploadArea.style.borderColor = ""
        uploadArea.style.backgroundColor = ""
      })
  
      uploadArea.addEventListener("drop", (e) => {
        e.preventDefault()
        uploadArea.style.borderColor = ""
        uploadArea.style.backgroundColor = ""
  
        if (e.dataTransfer.files.length) {
          handleFiles(e.dataTransfer.files)
        }
      })
  
      fileUpload.addEventListener("change", () => {
        if (fileUpload.files.length) {
          handleFiles(fileUpload.files)
        }
      })
    }
  
    // Handle uploaded files
    function handleFiles(files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
  
        // Only accept image files
        if (!file.type.match("image.*")) {
          alert("Please upload image files only.")
          continue
        }
  
        const fileItem = document.createElement("div")
        fileItem.className = "file-item"
  
        const fileIcon = document.createElement("i")
        fileIcon.className = "fas fa-file-image"
  
        const fileName = document.createElement("span")
        fileName.className = "file-name"
        fileName.textContent = file.name
  
        const removeBtn = document.createElement("i")
        removeBtn.className = "fas fa-times remove-file"
        removeBtn.addEventListener("click", () => {
          fileItem.remove()
          updateTrainButtonState()
        })
  
        fileItem.appendChild(fileIcon)
        fileItem.appendChild(fileName)
        fileItem.appendChild(removeBtn)
  
        uploadedFiles.appendChild(fileItem)
      }
  
      updateTrainButtonState()
    }
  
    // Update train button state based on uploaded files
    function updateTrainButtonState() {
      const fileCount = uploadedFiles.querySelectorAll(".file-item").length
      trainModelBtn.disabled = fileCount < 3
    }
  
    // Train model button click
    if (trainModelBtn) {
      trainModelBtn.addEventListener("click", () => {
        // Simulate training process
        trainModelBtn.disabled = true
        trainModelBtn.textContent = "Training..."
  
        setTimeout(() => {
          trainModelBtn.textContent = "Model Trained!"
          trainModelBtn.classList.add("success")
  
          // Enable convert button
          if (convertBtn) {
            convertBtn.disabled = false
          }
  
          // After 2 seconds, reset button
          setTimeout(() => {
            trainModelBtn.textContent = "Train Model"
            trainModelBtn.classList.remove("success")
            trainModelBtn.disabled = false
          }, 2000)
        }, 3000)
      })
    }
  
    // Convert button click
    if (convertBtn) {
      convertBtn.addEventListener("click", () => {
        const text = inputText.value.trim()
  
        if (!text) {
          alert("Please enter some text to convert.")
          return
        }
  
        // Show loading indicator
        loadingIndicator.classList.remove("hidden")
        placeholderMessage.classList.add("hidden")
        outputImage.classList.add("hidden")
  
        // Disable buttons during conversion
        convertBtn.disabled = true
        clearBtn.disabled = true
  
        // Simulate conversion process
        setTimeout(() => {
          // Hide loading indicator
          loadingIndicator.classList.add("hidden")
  
          // Show output image
          outputImage.classList.remove("hidden")
  
          // Enable buttons
          convertBtn.disabled = false
          clearBtn.disabled = false
          downloadBtn.disabled = false
          shareBtn.disabled = false
  
          // Apply style adjustments
          applyStyleAdjustments()
        }, 2000)
      })
    }
  
    // Clear button click
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        inputText.value = ""
        outputImage.classList.add("hidden")
        placeholderMessage.classList.remove("hidden")
        downloadBtn.disabled = true
        shareBtn.disabled = true
      })
    }
  
    // Style adjustment controls
    function applyStyleAdjustments() {
      if (outputImage) {
        const slant = slantRange.value
        const thickness = thicknessRange.value
        const spacing = spacingRange.value
  
        outputImage.style.transform = `skewX(${slant}deg)`
        outputImage.style.filter = `contrast(${thickness})`
        outputImage.style.letterSpacing = `${spacing}px`
      }
    }
  
    if (slantRange) {
      slantRange.addEventListener("input", applyStyleAdjustments)
    }
  
    if (thicknessRange) {
      thicknessRange.addEventListener("input", applyStyleAdjustments)
    }
  
    if (spacingRange) {
      spacingRange.addEventListener("input", applyStyleAdjustments)
    }
  
    // Download button click
    if (downloadBtn) {
      downloadBtn.addEventListener("click", () => {
        // Simulate download
        alert("Your handwritten text has been downloaded!")
      })
    }
  
    // Share button click
    if (shareBtn) {
      shareBtn.addEventListener("click", () => {
        // Simulate sharing
        alert("Sharing options would appear here in a production environment.")
      })
    }
  
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
  })
  
  