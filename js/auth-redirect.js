let user = localStorage.getItem("lifelogCurrentUser");
console.log({user})

if(!user){
  window.location.replace("signup.html");
}

