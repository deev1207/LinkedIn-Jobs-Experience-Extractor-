const map = new Map()
var started = false;

async function test(ms) {
  started = true;
  await sleep(ms);
  const jobList = document.querySelectorAll('ul.scaffold-layout__list-container li.jobs-search-results__list-item');

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1
  };

  const callback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const job_id = entry.target.getAttribute('data-occludable-job-id');
        const href = entry.target.querySelector('div div.job-card-container div.job-card-list__entity-lockup div.artdeco-entity-lockup__content div.artdeco-entity-lockup__title a').getAttribute('href');

        if (map.get(job_id) == undefined) {

          getDetails(href, job_id, entry.target);
        } else {
          addExpChild(entry.target, map.get(job_id), job_id);
        }

        observer.unobserve(entry.target);
      }
    });
  };

  const observer = new IntersectionObserver(callback, options);

  for (let i = 0; i < jobList.length; i++) {
    const child = jobList[i];
    if (child != null) {
      observer.observe(child);
    }
  }

};


async function getDetails(href, job_id, child) {
  if (child.classList.contains("already-done")) {
    return;
  }
  child.classList.add("already-done");
  const response = await fetch(href);
  const data = await response.text();
  const regex = /\b(?!1[6-9]|[2-9][0-9]|[1-9][0-9][0-9])(([a-zA-Z]+)?[0-9][.]?[0-9]?)\s*(?:to|\+|\-)?\s*([1-9]?[0-9]?)?(\s*years|yrs|Years|Yrs|year|Year|months|Months)\b/g;
  const match = (data).match(regex);
  const regex2 = /(?!1[6-9]|[2-9][0-9]|[1-9][0-9][0-9])([0-9][.]?[0-9]?)\s*(?:to|\+|\-)?\s*([1-9]?[0-9]?)?(\s*years|yrs|Years|Yrs|year|Year|months|Months)/;
  console.log(match);
  if (match != null && match.length > 0) {
    const extractedYears = match.map(entry => (entry).match(regex2));
    if (extractedYears.length > 0) {
      addExpChild(child, extractedYears[0][0], job_id)
      map.set(job_id, extractedYears[0][0]);
    }
  }



}



function addExpChild(child, txt, job_id) {
  if (document.getElementById("exp " + job_id) == null) {
    let ul = document.createElement("ul");
    let p = document.createElement("li");
    p.textContent = txt
    p.id = "exp " + job_id;
    p.style = "color: " + "red" + ";";
    ul.appendChild(p)
    child
      .querySelector('div div.job-card-container div.job-card-list__entity-lockup div.flex-grow-1 div.artdeco-entity-lockup__caption')
      .appendChild(ul)
  }

  else {
    document.getElementById("exp" + job_id).textContent = txt;
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

window.onload = function () {
  console.log("load");
  test(1000);
}

window.addEventListener("click", function () {
  console.log("click");
  test(2500);
});

if (!started) {
  console.log("start");
  test(1000)
}


