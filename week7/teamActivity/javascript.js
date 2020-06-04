//create an array of hikes

import { Hike } from './Hike.js'

let hikeList = new Array()

hikeList.push(new Hike("Bechler Falls", "falls.jpg", "Image of Bechler Falls",
  "3 miles", "Easy", "Beautiful short hike along the Bechler river to Bechler Falls",
  "Take Highway 20 north to Ashton. Turn right into the town and continue through. Follow that road for a few miles then turn left again onto the Cave Falls road.Drive to the end of the Cave Falls road. There is a parking area at the trailhead.",
  Date.now()))

hikeList.push(new Hike(
  "Teton Canyon",
  "falls.jpg",
  "Image of Bechler Falls",
  "3 miles",
  "Easy",
  "Beautiful short (or long) hike through Teton Canyon.",
  "Take Highway 33 East to Driggs. Turn left onto Teton Canyon Road. Follow that road for a few miles then turn right onto Staline Raod for a short distance, then left onto Alta Road. Veer right after Alta back onto Teton Canyon Road. There is a parking area at the trailhead.",
  Date.now()))

hikeList.push(new Hike(
  "Denanda Falls",
  "falls.jpg",
  "Image of Bechler Falls",
  "7 miles",
  "Moderate",
  "Beautiful hike through Bechler meadows river to Denanda Falls",
  "Take Highway 20 north to Ashton. Turn right into the town and continue through. Follow that road for a few miles then turn left again onto the Cave Falls road. Drive to until you see the sign for Bechler Meadows on the left. Turn there. There is a parking area at the trailhead.",
  Date.now()
))

console.table(hikeList)
const imgBasePath = "//byui-cit.github.io/cit261/examples/";
//on load grab the array and insert it into the page




console.table(hikeList)

window.addEventListener("load", () => {

  hikeList.forEach(hike => {
    hike.addComment("NewComment", "This is a comment")
  })
  
  showHikeList();


  let hikeNames = document.querySelectorAll(".hikeName")
  


  hikeNames.forEach((hike) => {

    hike.addEventListener("click", () => {
      let obj = hikeList.find(o => o.name === hike.textContent)

      if (!obj.showingDetails) {
        let details = obj.renderDetailedHike()
        hike.parentElement.appendChild(details)
        obj.showingDetails = true
      }
      else {
        console.log(hike.parentElement.lastChild)

        hike.parentElement.removeChild(hike.parentElement.lastChild)
        obj.showingDetails = false
      }
      
    })

  })
});

function showHikeList() {
  const hikeListElement = document.getElementById("hikes");
  hikeListElement.innerHTML = "";
  renderHikeList(hikeList, hikeListElement);
}

function renderHikeList(hikes, parent) {
  hikes.forEach(hike => {
    parent.appendChild(hike.renderHike());
  });
}




