document.addEventListener("DOMContentLoaded", () => {
  const originHtml = document.getElementById("first-paragraph");
  const htmlSplitBySpace = originHtml.innerHTML.split(" ");
  const htmlSplitByTags = [];
  
  htmlSplitBySpace.forEach((el) => {
    findTags(el);
  });
  console.log(htmlSplitByTags);

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

  const glossedWords = [];
  
  fetch("./gloss.json")
    .then(response => {
      if (!response.ok) {
        throw new Error("Response for gloss.json was not ok");
      }
      return response.json();
    })
    .then(response => {
      const dataSet = response.gloss;
      //console.log(dataSet[0][0]);
      
      /*
      originTextWords.forEach((el) => {
        if (dataSet)
      })
      */
      
    })
    .catch(error => {
      console.error("There was a problem fetching gloss.json", error);
    });
});