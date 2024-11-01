document.addEventListener("DOMContentLoaded", () => {
  const glossButton = document.getElementById("toggle-gloss");
  let tooltipOn = false;
  const tooltip = document.getElementById("tooltip");
  const originalParagraphs = document.getElementsByClassName("manuscript");
  const glossTerms = [];
  const glossDescriptions = [];
  const manuscriptAuthor = originalParagraphs[0].id;
  
  /*
  Checks for which manuscript is on the page, and accesses 
  the corresponding data
  */
  if (manuscriptAuthor.includes("harley")) {
    getData("https://robbie-ellis.github.io/rclm-json/gloss.json");
  } else if (manuscriptAuthor.includes("egerton")) {
    getData("https://robbie-ellis.github.io/egerton-json/egerton-gloss.json");
  } else if (manuscriptAuthor.includes("other")) {  //replace other with manuscript name
    getData("https://robbie-ellis.github.io/rclm-json/gloss.json"); //replace path with correct gloss path
  };

  /*
  Actually fetches the data, and if successful executes processing 
  of each paragraph and generation of gloss functionality
  */ 
  function getData(url) {
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error("Response for gloss.json was not ok");
        }
        return response.json();
      })
      .then(response => {
        const dataSet = response.gloss;
        dataSet.forEach((el) => {
          glossTerms.push(el[0].toLowerCase());
          glossDescriptions.push(el[1]);
        });
        processParagraphs();
        generateFunctionality();
      }) 
      .catch(error => {
        console.error("There was a problem fetching gloss.json", error);
      });
  };

  /*
  Pulls each paragraph apart and wraps gloss words in tags 
  for associated data
  */
  function processParagraphs() {
    for (let i = 0; i < originalParagraphs.length; i++) {
      const htmlSplitByTags = [];
      const htmlSplit = originalParagraphs[i].innerHTML.split(" ");
      
      const htmlSpacingElementsAdded = [];
      htmlSplit.forEach((el, index) => {
        htmlSpacingElementsAdded.push(el);
        if (index < htmlSplit.length - 1) {
          htmlSpacingElementsAdded.push(" ");
        }
      });

      htmlSpacingElementsAdded.forEach((el) => {
        findTags(el);
      });

      //Find tags needs to be recursive
      function findTags(el) {
        if (el.includes("<")) {
          const substring1 = el.substring(0, el.indexOf("<"));
          htmlSplitByTags.push(substring1);
          let remainder = el.substring(el.indexOf("<"));
          const tag = remainder.substring(0, remainder.indexOf(">") + 1);
          htmlSplitByTags.push(tag);
          remainder = remainder.substring(remainder.indexOf(">") + 1);
          findTags(remainder); // Recursion!  Woot!
        } else {
          htmlSplitByTags.push(el);
        }
      }
      
      const htmlWithGlossSpans = [];
      htmlSplitByTags.forEach((el) => {
        if (glossTerms.includes(el.toLowerCase())) {
          htmlWithGlossSpans.push(`<span class="gloss">${el}</span>`);
        } else {
          htmlWithGlossSpans.push(el);
        }
      });
      
      const htmlOutput = htmlWithGlossSpans.join("");
      originalParagraphs[i].innerHTML = htmlOutput;
    }
  }

  //Generates event listeners for gloss functionality
  function generateFunctionality() {
    glossButton.addEventListener("click", toggleGloss);
    
    function toggleGloss() {
      tooltipOn = !tooltipOn;
      const glosses = document.getElementsByClassName("gloss");
      if (tooltipOn) {
        for (let i = 0; i < glosses.length; i++) {
          glosses[i].style.color = "orange";
          glossButton.innerText = "Turn off gloss"
        }
      } else {
        for (let i = 0; i < glosses.length; i++) {
          glosses[i].style.color = "#333";
          glossButton.innerText = "Turn on gloss"
        }
      }
    }
    
    // Event listeners for the gloss tooltip
    const glossClassElements = document.getElementsByClassName("gloss");
    for (let i = 0; i < glossClassElements.length; i++) {
      glossClassElements[i].addEventListener("mouseover", showToolTip);
      glossClassElements[i].addEventListener("mouseout", hideToolTip);
      glossClassElements[i].addEventListener("mousemove", captureMouseLocation);
    };
  }

  //Assigns appropriate text to tooltip
  function showToolTip(event) {
    if (tooltipOn) {
      tooltip.innerText = 
        glossDescriptions[glossTerms.indexOf(event.target.innerText.toLowerCase())];
      tooltip.style.opacity = 1;
    }
  };
  
  //Hides tooltip
  function hideToolTip() {
    tooltip.innerText = "";
    tooltip.style.opacity = 0;
  }

  //Aligns the tooltip to the right of, and under the word
  function captureMouseLocation(event) {
    const x = event.clientX;
    const y = event.clientY;
    tooltip.style.left = `${x + 10}px`;
    tooltip.style.top = `${y + 10}px`;
  }
});