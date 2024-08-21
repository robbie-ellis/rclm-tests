document.addEventListener("DOMContentLoaded", () => {
  const originHtml = document.getElementById("first-paragraph");
  const htmlSplitBySpace = originHtml.innerHTML.split(" ");
  const htmlSplitByTags = [];
  
  htmlSplitBySpace.forEach((el) => {
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

  const htmlGlossed = [];
  
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
      const glossDescription = [];
      dataSet.forEach((el) => {
        glossTerms.push(el[0]);
        glossDescription.push(el[1]);
      });
      //console.log(glossTerms);
      //console.log(glossDescription);
      
      htmlSplitByTags.forEach((el, index) => {
        if (glossTerms.includes(el)) {
          htmlGlossed.push(`<span class="gloss">${el}</span>`);
        } else {
          htmlGlossed.push(el);
        }
      });
      console.log(htmlSplitByTags);
      console.log(glossTerms);
      console.log(htmlGlossed);
      
      
    })
    .catch(error => {
      console.error("There was a problem fetching gloss.json", error);
    });
});