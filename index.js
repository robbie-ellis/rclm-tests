document.addEventListener("DOMContentLoaded", () => {
  const tooltip = document.getElementById("tooltip");
  const originHtml = document.getElementById("first-paragraph");
  const htmlSplit = originHtml.innerHTML.split(" ");

  const htmlSpacingElementsAdded = [];
  htmlSplit.forEach((el, index) => {
    htmlSpacingElementsAdded.push(el);
    if (index < htmlSplit.length - 1) {
      htmlSpacingElementsAdded.push(" ");
    }
  });
  //console.log(htmlSpacingElementsAdded);
  const htmlSplitByTags = [];
  
  htmlSpacingElementsAdded.forEach((el) => {
    findTags(el);
  });
  //console.log(htmlSplitByTags);

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
  
  fetch("./gloss.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Response for gloss.json was not ok");
      }
      return response.json();
    })
    .then(response => {
      const dataSet = response.gloss;
      const glossTerms = [];
      const glossDescriptions = [];
      dataSet.forEach((el) => {
        glossTerms.push(el[0]);
        glossDescriptions.push(el[1]);
      });
      //console.log(glossTerms);
      //console.log(glossDescription);
      
      htmlSplitByTags.forEach((el) => {
        if (glossTerms.includes(el)) {
          htmlWithGlossSpans.push(`<span class="gloss">${el}</span>`);
        } else {
          htmlWithGlossSpans.push(el);
        }
      });
      //console.log(htmlSplitByTags);
      //console.log(glossTerms);
      //console.log(htmlWithGlossSpans);
      
      const htmlOutput = htmlWithGlossSpans.join("");
      console.log(originHtml.innerHTML);
      console.log(htmlOutput);

      originHtml.innerHTML = htmlOutput;

      function showToolTip(event) {
        tooltip.innerText = 
          glossDescriptions[glossTerms.indexOf(event.target.innerText)];
        tooltip.style.opacity = 1;
      };
      
      function hideToolTip() {
        tooltip.innerText = "";
        tooltip.style.opacity = 0;
      }

      function captureMouseLocation(event) {
        const x = event.clientX;
        const y = event.clientY;
        tooltip.style.left = `${x + 10}px`;
        tooltip.style.top = `${y + 10}px`;
      }
      // Event listeners for the gloss tooltip
      const glossClassElements = document.getElementsByClassName("gloss");
      for (let i = 0; i < glossClassElements.length; i++) {
        glossClassElements[i].addEventListener("mouseover", showToolTip);
        glossClassElements[i].addEventListener("mouseout", hideToolTip);
        glossClassElements[i].addEventListener("mousemove", captureMouseLocation);
      };
    })
    .catch(error => {
      console.error("There was a problem fetching gloss.json", error);
    });
});