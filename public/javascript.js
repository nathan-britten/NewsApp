


const GetAPIData = (function(){

  const accessData = function(){
    
    const searchTerm = document.querySelector(".searchTerm").value;
    let from = document.querySelector("#datemin").value
    let to = document.querySelector("#datemax").value
    let language = document.querySelector("#language").value

    if(from === "" || to === ""){
      let todaysDate = new Date;

      let date = todaysDate.getDate()
      let month = todaysDate.getMonth();
      let year = todaysDate.getFullYear();
      month += 1
      from = `${year}-${month}-${date}`
      to = `${year}-${month}-${date}`
    }

    if(language === ""){
      language = "en"
    }
    console.log(language)

    // domains=bbc.co.uk,techcrunch.com,engadget.com,usatoday.com,sky.com,theguardian.com,skysports.com,football365.com,abcnews.go.com,abc.net.au,aljazeera.com,apnews.com,bbc.co.uk/sport,businessinsider.com,cbsnews.com,cnbc.com,news.google.com,nbcnews.com,huffingtonpost.com,theverge.com,washingtonpost.com,time.com,wired.com


    if(searchTerm !== ""){
      fetch(`https://newsapi.org/v2/everything?q=${searchTerm}&from=${from}&to=${to}&sortBy=popularity&language=${language}&apiKey=67f9d041fb49469e8993de4d5414b40c`)
      .then(function(results){
        //  console.log(results)
         return results.json()
      })
        .then(function(data){
          if(data.totalResults === 0){
            console.log("hello")

            let parent = document.querySelector(".popularSearch")
            let child = document.querySelector(".d-inline")
      
            uiController.generateErrorMessage(parent,child, "No matching news articles")


          } else {

          }
          uiController.callPopulateMainPage(data);
          console.log(data)
        })
        .catch(function(err){
          console.log(err)
        })
    } else {






    }

  }

  return {
    callAccessData: function(){
      accessData();
    },

    retrievePreferencesFromAPI: function(){
      document.querySelector(".myNewsOutput").innerHTML ="";


      let preferenceArray =[]
      const dataHolder = document.querySelectorAll(".preference-item");

      for(let i=0; i < dataHolder.length; i++){

        preferenceArray.push(dataHolder[i].innerText)

      }

    

      const preferences = preferenceArray;
      const data = "";
      let apiData = "";
      preferences.forEach(function(preference){
      fetch(`https://newsapi.org/v2/everything?q=${preference}&sortBy=relevancy&sources?language=
      en&apiKey=67f9d041fb49469e8993de4d5414b40c`)
     .then(function(res){
       return res.json()
     })
      .then(data => {

           
          data = {
            data :data,
            preference : preference
          }

          uiController.populateMyNewsPage(data)

          // apiData = data;
          // emptyArray.push(apiData)
          // console.log(emptyArray)
          // console.log(emptyArray)
          // console.log(emptyArray.length)

        })
        .catch(err => {
          console.log(err)
        })

      })
     


    }




  }
})();

const uiController = (function(){

  const populateMainPage = function(data){
    output = "";
    console.log(data.articles)
    data.articles.forEach(function(article, index){

      if(!article.urlToImage){
        article.urlToImage = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=750&q=80"
      }
      if(article.urlToImage){
        uiController.createOutput(article, index)
      }


    })
    document.querySelector(".output").innerHTML = output;
  }

  return {
    callPopulateMainPage: function(data){
      populateMainPage(data);
    },

   createOutput(article, index, counter){
    if(article.title === null || article.publishedAt === null || article.description === null || article.urlToImage === null){

    }else{

      output += `

    <div class="col-md-4 col-6 my-1" data-newsitem-${index}>
        <div class="card">
          <img class="card-img-top" src="${article.urlToImage}" alt="Card image cap" data-image-${index} data-counter="${counter}">
          <div class="card-body" data-cardbody-${index} data-counter="${counter}">
          <h5 class="card-title break ow-anywhere" data-cardtitle-${index} data-counter="${counter}">${article.title.substring(0,35) +"..."}</h5>
          <p class="card-subtitle my-2 text-muted ow-anywhere" data-cardsubtitle-${index} data-counter="${counter}" >${article.publishedAt.substring(0,10)}</p>
          <p class="card-text" data-cardtext-${index} data-counter="${counter}">${article.description.substring(0,100)+"..."}</p>
          <a href="${article.url}" class="btn btn-primary" data-url-${index} data-counter="${counter}">Read </a>
          <i class="btn  later far fa-clock" data-later-${index} data-test="${index}" data-counter="${counter}" data-id="${article.id}"></i>
          <div class="emptyPlaceholder" data-placeholder-${index}></div>
        </div>
      </div>
    </div>
    `
    }

    return output;
    },

    populateMyNewsPage: function(data, index){

      let headerOutput = "";
      let contentOutput = "";
       output = "";
      console.log(data.data.articles)

        data.data.articles.forEach(function(article, index){

          let newGroupCounter = document.querySelectorAll(".news-group").length
          if(article.urlToImage){

            contentOutput = uiController.createOutput(article, index, newGroupCounter)

          }

        })
      
        headerOutput += `
        
        <div class="container news-group" data-id="${index}">
        <h2 class="news-heading">${data.preference}</h2>
          <div class="row output my-2 flex-nowrap new-group-content">
          ${contentOutput}
         </div>
        </div>
        ` ;

        // headerOutput += contentOutput

        



   



      document.querySelector(".myNewsOutput").innerHTML += headerOutput;
      uiController.showNoPreferencesMessage()


      // document.querySelector(".new-group-content").innerHTML = contentOutput;




    },

    addPreferenceToUl: function(){


    
        let input = document.querySelector(".topicsAdd").value
        if(input !== ""){
          console.log(input)
          let count = document.querySelectorAll(".preference-item").length + 1
          input[0].toUpperCase()
          const output = `
          
          <tr class="text-center">
          <td class="preference-item">${input}</td>
          <td><i class="ml-3 far fa-times-circle removePreferenceButton"></i></td>
        </tr>
          
          `
          document.querySelector(".preferences").innerHTML += output;
          document.querySelector(".topicsAdd").value = "";

        } else {

          let parent = document.querySelector(".side-menu-form")
          let child = document.querySelector(".side-menu-output")
    
          uiController.generateErrorMessage(parent,child, "Add a topic")
        }

    
       
     
  


    },

    removePreferenceFromUl: function(e){

        if(e.target.classList.contains("removePreferenceButton")){

          e.target.parentElement.parentElement.remove()

        }

  


    },

    toggleSideMenu: function(){
    
      document.querySelector(".side-menu").classList.toggle("menu-slidein")

    },

    generateErrorMessage: function(parent, child, message){


      if(document.querySelectorAll(".alert-danger").length < 1){


        let newItem = document.createElement("div")
        let text = document.createTextNode(message)
        newItem.className = "alert alert-danger"
        newItem.setAttribute("role", "alert")
        newItem.appendChild(text)
  

  
        parent.insertBefore(newItem, child)
        
        setTimeout(function(){
          newItem.remove()
        },2500)

      } 


    },

    togglePadlockMenu: function(){
      document.querySelector(".second-half").classList.toggle("login-menu-in")
    },

    decreaseReadLater: function(){
      let temp = document.querySelector(".tally").innerHTML;

        let amountRead = parseInt(temp)

        amountRead--

        document.querySelector(".tally").innerHTML = amountRead
    }, 
       increaseReadLater: function(){
      let temp = document.querySelector(".tally").innerHTML;

        let amountRead = parseInt(temp)

        amountRead++

        document.querySelector(".tally").innerHTML = amountRead
    },

    checkDbForDuplicates(e, data){
      const allTitles = document.querySelectorAll(".articleTitleArray")
      const indexNumber = e.target.dataset.test
      const counter = e.target.dataset.counter



      for(let i = 0; i < allTitles.length; i++){
   
        if(data.title === allTitles[i].innerHTML){

          if(document.querySelector(".home")!== null || document.querySelectorAll(".news-group").length === 1 ){
            console.log(indexNumber)
            console.log("SORRY BRUV")
            let parent = document.querySelector(`[data-cardbody-${indexNumber}]`)
            let child = document.querySelector(`[data-placeholder-${indexNumber}]`)
      
            uiController.generateErrorMessage(parent,child, "Already added")


          } else {
            console.log("SORRY BRUV")
            let parent = document.querySelectorAll(`[data-cardbody-${indexNumber}]`)[counter]
            let child = document.querySelectorAll(`[data-placeholder-${indexNumber}]`)[counter]
      
            uiController.generateErrorMessage(parent,child, "Already added")




          }




        }
      }
     },

    checkClientForDuplicates(e){
      const indexNumber = e.target.dataset.test
      const counter = e.target.dataset.counter

      for(let i = 0; i < clientTitleCheckerArray.length; i++){
   
        if(data.title === clientTitleCheckerArray[i]){

          if(document.querySelector(".home")!== null || document.querySelectorAll(".news-group").length === 1 ){
            console.log("SORRY BRUV")
            console.log(indexNumber)
            let parent = document.querySelector(`[data-cardbody-${indexNumber}]`)
            let child = document.querySelector(`[data-placeholder-${indexNumber}]`)
      
            uiController.generateErrorMessage(parent,child, "Already added")

          } else {

            console.log("SORRY BRUV")
            let parent = document.querySelector(`[data-cardbody-${indexNumber}]`)[counter]
            let child = document.querySelector(`[data-placeholder-${indexNumber}]`)[counter]
      
            uiController.generateErrorMessage(parent,child, "Already added")

          }


        }
      }

     },

     showNoPreferencesMessage(){
  
    
      if(document.querySelector(".news-group") === null && !document.querySelector(".preferenceMessage")) {



        let h3 = document.createElement("h3")
        let text = document.createTextNode("Add some topics to get started")
        h3.classList.add("text-center")
        h3.classList.add("preferenceMessage")
        h3.appendChild(text)

        console.log(h3)
        document.querySelector(".otherOutput").appendChild(h3)
        

        document.querySelector(".editTopicsButton").innerHTML = "Add"

      } else {

        document.querySelector(".editTopicsButton").innerHTML = "Edit"

        document.querySelector(".preferenceMessage").remove()


      }

     }



  }

})();

const dataController = (function(e){


  return{
    sendToDatabase : function(data){


        fetch("/readlater", {

          method: "POST",
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(function(res){
          console.log(res)
        })
        .catch(function(res){
          console.log("THERE WAS AN ERROR")
          console.log(res)
        })


      



  
    },

    removeFromDatabase: function(data, id){
      console.log(id)
      if(id !== undefined){

   

          data.id = id
        fetch("/readlater/" + id, {

          method: "DELETE",
          body: JSON.stringify(data),
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          }
        })
        .then(function(res){
          // console.log(res)
        })
        .catch(function(res){
          console.log(res)
        })


     

        

      }
      
    },

    addPreferenceToDb: function(){

      let preferenceArray =[]
      const dataHolder = document.querySelectorAll(".preference-item");

      for(let i=0; i < dataHolder.length; i++){

        preferenceArray.push(dataHolder[i].innerText)

      }

      document.querySelector(".topicsDisplay").value = preferenceArray;

      console.log(preferenceArray)
      console.log(typeof preferenceArray)



      fetch("/mynews", {

        method: "POST",
        body: JSON.stringify(preferenceArray),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(function(res){
        console.log(res)
      })
      .catch(function(res){
        // console.log("THERE WAS AN ERROR")
        // console.log(res)
      })


    // }

 

    },

    sendPopularSearchToDb: function(searchValue){

   
      let send = {

        searchValue: searchValue
      }

      console.log(send)

      fetch("/new", {

        method: "POST",
        body: JSON.stringify(send),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then(function(res){
        // console.log(res)
      })
      .catch(function(err){
        // console.log("THERE WAS AN ERROR")
        console.log(err)
      })

      
      

    },

    createDataForMyNews: function(e){
      const indexNumber = e.target.dataset.test
      const counter = e.target.dataset.counter

      let image,
          title,
          date,
          info,
          url;


      if(e.target.classList.contains("later")){
        // console.log("hello")
        e.target.classList.toggle("later-active")

        setTimeout(function(){
          e.target.classList.toggle("later-active")
        },150)
       
        if(document.querySelector(".home") !== null){

          image = document.querySelector(`[data-image-${indexNumber}]`).src;
          title = document.querySelector(`[data-cardtitle-${indexNumber}]`).innerHTML
          date = document.querySelector(`[data-cardsubtitle-${indexNumber}]`).innerHTML;
          info = document.querySelector(`[data-cardtext-${indexNumber}]`).innerHTML;
          url = document.querySelector(`[data-url-${indexNumber}]`).href;
          
        } else  {


          image = document.querySelectorAll(`[data-image-${indexNumber}]`)[counter].src;
          title = document.querySelectorAll(`[data-cardtitle-${indexNumber}]`)[counter].innerHTML
          date = document.querySelectorAll(`[data-cardsubtitle-${indexNumber}]`)[counter].innerHTML;
          info = document.querySelectorAll(`[data-cardtext-${indexNumber}]`)[counter].innerHTML;
          url = document.querySelectorAll(`[data-url-${indexNumber}]`)[counter].href;

        }


      }



      if(e.target.classList.contains("remove")){


         image = document.querySelector(`[data-image-${indexNumber}]`).src;
         title = document.querySelector(`[data-cardtitle-${indexNumber}]`).innerHTML
         date = document.querySelector(`[data-cardsubtitle-${indexNumber}]`).innerHTML;
         info = document.querySelector(`[data-cardtext-${indexNumber}]`).innerHTML;
         url = document.querySelector(`[data-url-${indexNumber}]`).href;


      }




        data = {
          image: image, 
          title: title,
          date: date,
          info: info,
          url: url
        }
        // console.log(data)
        return data
      
    }




}
  
})()


window.addEventListener("keydown", function(e){
    if(e.keyCode === 13){
      e.preventDefault()
    }
})

if(document.querySelector(".mynews") !== null){
  uiController.showNoPreferencesMessage()







  document.querySelector(".myNews").classList.add("whiteBackground")
  document.querySelector(".myNews a").classList.add("darkText")


  GetAPIData.retrievePreferencesFromAPI()


  document.querySelector(".savePreferences").addEventListener("click", function(e){
    e.preventDefault();
    dataController.addPreferenceToDb()
    GetAPIData.retrievePreferencesFromAPI()
    uiController.toggleSideMenu()
    uiController.showNoPreferencesMessage()
  })
  
  document.querySelector(".addTopicButton").addEventListener("click", function(e){
    e.preventDefault()
    uiController.addPreferenceToUl()
  })

  document.querySelector(".editTopicsButton").addEventListener("click", function(e){
    e.preventDefault()
    uiController.toggleSideMenu()
  })

  document.querySelector(".close-side-menu").addEventListener("click", function(){
    uiController.toggleSideMenu()
  })





}

if(document.querySelector(".readlater") !== null){
  document.querySelector(".readLater").classList.add("whiteBackground")
  document.querySelector(".readLater a").classList.add("darkText")
}


if(document.querySelector(".home") !== null) {
  setTimeout(function(){
  GetAPIData.callAccessData()
  },1000)

  document.querySelector(".popular").classList.add("whiteBackground")
  document.querySelector(".popular a").classList.add("darkText")
  


    document.querySelector(".searchAPI").addEventListener("click", function(e){
      e.preventDefault()
      let data = document.querySelector(".searchTerm").value;

      if(document.querySelector(".searchTerm").value === ""){
      let parent = document.querySelector(".popularSearch")
      let child = document.querySelector(".d-inline")

      uiController.generateErrorMessage(parent,child, "Enter a valid search")
      }
      else{
        dataController.sendPopularSearchToDb(data)
        GetAPIData.callAccessData()
        document.querySelector(".multi-collapse").classList.remove("show")
  
      }




    })
  


}

let clientTitleCheckerArray = [];



  window.addEventListener("click", function(e){
    const data =  dataController.createDataForMyNews(e);

    const counter = e.target.dataset.counter


    if(e.target.classList.contains("later")){
      
      if(document.querySelector(".active").innerHTML === "nobody"){
        
      const indexNumber = e.target.dataset.test
      let parent = document.querySelectorAll(".card-body")[indexNumber]
      let child = document.querySelectorAll(".emptyPlaceholder")[indexNumber]

      uiController.generateErrorMessage(parent,child, "Sign in required")

      } else {


     //checks the current clicked title vs ones from the server
     uiController.checkDbForDuplicates(e, data)
     uiController.checkClientForDuplicates(e)

      //if the error doesn't show, add the data
      if(document.querySelector(".alert")){

      } else {
        uiController.increaseReadLater()
        dataController.sendToDatabase(data);
        clientTitleCheckerArray.push(data.title)
        console.log(clientTitleCheckerArray)
        
        document.querySelector(".tally").classList.add("bigger")
        this.setTimeout(function(){
          document.querySelector(".tally").classList.remove("bigger")
        },500)

      }


    }

    }


    if(e.target.classList.contains("remove")){
      const id = e.target.getAttribute("data-id")
      console.log(id)
      dataController.removeFromDatabase(data, id);
      const indexNumber = e.target.dataset.test
      document.querySelector(`[data-readlater-${indexNumber}]`).remove()
      uiController.decreaseReadLater()




    }

    uiController.removePreferenceFromUl(e)

    })










  document.querySelector(".padlock").addEventListener("click", function(){
    console.log("hello")
    uiController.togglePadlockMenu()
    
  })

  window.addEventListener("resize", function(){
    if(innerWidth > 650){
      
   document.querySelector(".second-half").classList.add("login-menu-in")
  }
})

document.querySelector(".myNews").addEventListener("click", function(){
 

 location.href = "/mynews#mynews"

})

document.querySelector(".popular").addEventListener("click", function(){
 

  location.href = "/#popular"
 
 })

document.querySelector(".readLater").addEventListener("click", function(){
 

 location.href = "/readlater#readlater"

console.log(location.href)
})
 
if(document.querySelector(".loginPage") !== null){
  document.querySelector(".inputurl").value = location.href

}


if(document.querySelector(".mess")){
  setTimeout(function(){

    document.querySelector(".mess").classList.add("hide")
    document.querySelector(".mess").remove()

  },3500)
}


if(document.querySelector(".registerPage") || document.querySelector(".registerPage")) {
  document.querySelector("#username").addEventListener("blur", nameValidation);
  document.querySelector("#password").addEventListener("blur", passwordValidation);

  document.querySelector(".register-button").addEventListener("click", function(e){


    let allValidations =  document.querySelectorAll("input")
  
    for(let i= 0; i < allValidations.length; i++){
  
     if(allValidations[i].classList.contains("invalid")){
       e.preventDefault();
  
     }
     if(!allValidations[i].classList.contains("is-valid")){
       e.preventDefault();
       let parent = document.querySelector(".form-group")
       let child = document.querySelector(".loginLink")
  
       uiController.generateErrorMessage(parent,child, "Enter a valid username")
  
     }
  
  
    }
  })


}




function nameValidation(){
console.log("hello")
  const name = document.querySelector("#username");
  const re = /^[a-zA-Z0-9_@./#&+-]{1,25}$/;

  if(!re.test(name.value)){
    name.classList.remove("is-valid")
    name.classList.add("is-invalid")
  } else{
    name.classList.remove("is-invalid")
    name.classList.add("is-valid")
  }
}

function passwordValidation(){
 
  const password = document.querySelector("#password");

  const re =/(?=.*[A-Z])(?!.\n)(?!.*\s).{8,}/;
  // const re =/[a-z0-9]/;

  if(!re.test(password.value)){
    password.classList.remove("is-valid")
    password.classList.add("is-invalid")
  } else{
    password.classList.remove("is-invalid")
    password.classList.add("is-valid")
  }

}





  setTimeout(() => {
    console.log(document.querySelector(".tally").innerHTML)
    if(document.querySelector(".tally").innerHTML === ""){

      document.querySelector(".tally").innerHTML = 0
    } else {
      document.querySelector(".tally").innerHTML = document.querySelector(".articleAmount").innerHTML
    }





})
