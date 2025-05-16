document.addEventListener("DOMContentLoaded",function() {


  const searchButton = document.getElementById("search-btn");
  const usernameInput = document.getElementById("user-input");
  const statsContainer = document.querySelector(".stats-container");
  const easyProgressCircle = document.querySelector(".easy-progress");
  const mediumProgressCircle = document.querySelector(".medium-progress");
  const hardProgressCircle = document.querySelector(".hard-progress");
  const easyLabel = document.getElementById("easy-label");
  const mediumLabel = document.getElementById("medium-label");
  const hardLabel = document.getElementById("hard-label");
  const cardStatsContainer = document.querySelector(".stats-card");



  function validateUsername(username){
    if(username.trim()===""){
      alert("username should not be empty");
      return false;
    }

    const regex = /^[a-zA-Z0-9_-]{3,20}$/;
    const isMatching = regex.test(username);
    if(!isMatching){
      alert("Invalid Username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username){
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`
    try{
      searchButton.textContent = "Searching";
      searchButton.disabled = true;

      const response = await fetch(url);
      if(!response.ok){
        throw new Error("Unable to fetch the user details");
      }
      const parsedData = await response.json();
      console.log("logging data: ", parsedData);
      displayUserData(parsedData);
    }
    catch(error){
      statsContainer.innerHTML = `<p>No Data Found</p>`;
    }

    finally{
      searchButton.textContent = "Search";
      searchButton.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle){
    const progressDegree = (solved/total)*100;
    circle.style.setProperty("--progress-degree",`${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(parsedData){
    const totalQues = parsedData.totalQuestions;
    const easyQues = parsedData.totalEasy;
    const mediumQues = parsedData.totalMedium;
    const hardQues = parsedData.totalHard;

    const solvedQues = parsedData.totalSolved;
    const solvedEasy = parsedData.easySolved;
    const solvedMedium = parsedData.mediumSolved;
    const solvedHard = parsedData.hardSolved;

    updateProgress(solvedEasy, easyQues, easyLabel, easyProgressCircle);
    updateProgress(solvedMedium, mediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(solvedHard, hardQues, hardLabel, hardProgressCircle);

    const cardsData = [
      {label: "Acceptance Rate",value: parsedData.acceptanceRate},
      {label: "Ranking",value: parsedData.ranking},
      {label: "Contribution Points",value: parsedData.contributionPoints},
    ];
    
    cardStatsContainer.innerHTML = cardsData.map(
      data => {
        return `
          <div class="card">
          <h4>${data.label}</h4>
          <p>${data.value}</p>
          </div>
        `
      }
    ).join('');

  }



  searchButton.addEventListener('click',function(){
    const username = usernameInput.value;
    console.log("Name of user: ",username);

    if(validateUsername(username)){
      fetchUserDetails(username);
    }
  })



})