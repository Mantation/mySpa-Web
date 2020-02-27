firebaseConfig = {
    apiKey: "AIzaSyCl_RKUkkRjCGgs1fYE-ee3VZ9PvJZoOb4",
    authDomain: "myspa-5b893.firebaseapp.com",
    databaseURL: "https://myspa-5b893.firebaseio.com",
    projectId: "myspa-5b893",
    storageBucket: "myspa-5b893.appspot.com",
    messagingSenderId: "825775443939",
    appId: "1:825775443939:web:bb6734113073a015"
  };
  // Initialize Firebase
  var FireStoreDatabase;
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    }
  const app = firebase.app();
   
 



//page identifiers
var identifier = document.getElementById('identifier').getAttribute("value");
if (identifier == "welcome"){
    //$("#progress").hide();
    //initialize app
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        }
    //FireStoreDatabase = firebase.firestore();
    //registration variables
    var reg_spa;
    var reg_loc;
    var reg_email;
    var reg_password;
    var reg_confirm_password;
    var reg_banner;
    var Document;
    var key;
     //Login Page
    //function to create a user
    function createUser(){
        var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if(RegisterIsValid()){
            if(emailFormat.test(String(reg_email.value).toLowerCase())){
                if ((reg_confirm_password || reg_confirm_password.value)&&(reg_password || reg_password.value)&&(reg_confirm_password.value == reg_password.value)){
                    //firebase.auth().createUserWithEmailAndPassword(email.value, password.value).catch(function(error) {
                    var Close = document.getElementsByClassName("closer");
                    Close[0].click();
                    $("#progress").show();
                    firebase.auth().createUserWithEmailAndPassword(reg_email.value, reg_password.value).then(function(user){
                        //if user created successfully
                        const app = firebase.app();
                        const db = firebase.firestore();
                        //submit info
                        db.collection("spa").add({
                            //add user information to the database
                            spa: reg_spa.value,
                            location: reg_loc.value,
                            email: reg_email.value,
                            bannerSet: false,
                            banner: "n/a",
                            status: "active",
                            admin:true,
                            date: getCurrentDate(),
                            time: getCurrentTime(),
                            document: "",
                            subscription: "active",
                            varified:false
                        })
                        .then(function(docRef) {
                            //get the document reference number
                            Document = docRef.id;
                            db.collection("spa").doc(docRef.id).update({
                                "document": docRef.id
                                
                            })
                            .then(function() {
                                //submit Image          
                                //check picture
                                if(Picture && Picture != ""){
                                    //initialize storage
                                    var storage = firebase.storage().ref();
                                    //Initialize file
                                    var img = "profilePic."+picExtention;
                                    const PropicRef = storage.child('userImages/'+Document+'/'+img);
                                    //Initialize upload task
                                    const task = PropicRef.put(Picture);
                                    //handle call backs
                                    task.then(function(snapshot){
                                        // Handle successful uploads on complete
                                        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                                        task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                                            //update picture url and isprofilepic set
                                            var picRef = db.collection("spa").doc(Document);
                                                return picRef.update({
                                                    bannerSet:true,
                                                    banner:downloadURL,
                                                })
                                                .then(function() {
                                                    //set nav details
                                                    Picture = "";
                                                    $("#progress").hide();
                                                    closeDialogShowSuccess();
                                                    window.setTimeout(wait,5000);
                                                    var user = firebase.auth().currentUser;
                                                        user.sendEmailVerification().then(function() {
                                                        // Email sent.
                                                            window.location.href = "https://myspa-5b893.firebaseapp.com/verify.html";
                                                        }).catch(function(error) {
                                                        // An error happened.
                                                        closeDialogShowError("error :"+error.code + " : " + error);
                                                    });
                                                    
                                                    //window.location.href = "http://localhost:5000/verify.html";
                                                    
                                                })
                                                .catch(function(error) {
                                                    // The document probably doesn't exist.
                                                    Picture = ""
                                                    $("#progress").hide();
                                                    closeDialogShowError("error :"+error.code + " : " + error);
                                                });
                                        });
                                    })
                                    .catch((error) => {
                                        Picture = ""
                                        $("#progress").hide();
                                        closeDialogShowError("error :"+error.code + " : " + error);
                                    });
                                }
                                reg_spa.value = "";
                                reg_loc.value = "";
                                reg_email.value ="";
                                reg_banner.src = "";
                                reg_password.value = "";
                                password.value = "";
                                reg_confirm_password.value = "";
                                reg_spa.focus();
                                $("#progress").hide();
                                //closeDialogShowError("Successfully registered. You are not yet fully activated, please contact your report doctor to resolve the matter.");
                                closeDialogShowSuccess();
                                window.setTimeout(wait,5000);
                                window.location.href = "https://myspa-5b893.firebaseapp.com/verify.html";
                            });
                        })
                        .catch(function(error) {
                            //get errors and handle exception
                            $("#progress").hide();
                            closeDialogShowError(error);
                        });

                    }).catch(function(error) {
                    // //get errors and handle exceptions
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    success = false;
                    $("#progress").hide();
                    closeDialogShowError(errorMessage);
                    // ...
                    });
                }else{
                    reg_password.focus();
                    reg_password.style.borderColor = "red";
                    reg_confirm_password.style.borderColor = "red";
                    $("#progress").hide();
                    closeDialogShowError("Password mismatch!");
                }    
            }else{
                reg_email.focus();
                reg_email.style.borderColor = "red";
                $("#progress").hide();
                closeDialogShowError("invalid email address entered!");
            }
        }else{
                //form is invalid
                $("#progress").hide();
                closeDialogShowError("Enter all the required fields");
        }
    }
    //LogIn page
    //function to sign in the user
    function SignInUser(){
        $("#progress").show();
        var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //The username and password that you entered did not match our records. Please double-check and try again.
        var mail = document.getElementById('username');
        var pass = document.getElementById('password');
        if(emailFormat.test(String(mail.value).toLowerCase())){
            if(pass || pass.value){
            //firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                firebase.auth().signInWithEmailAndPassword(mail.value, pass.value).then(function(user){
                    var user = firebase.auth().currentUser;
                    if(user.emailVerified && user){
                        localStorage.setItem("active_email",mail.value);
                        //window.location.href = "https://myspa-5b893.firebaseapp.com/main.html";
                        window.location.href = "http://localhost:5000/main.html";
                    }else{
                        window.location.href = "https://myspa-5b893.firebaseapp.com/re-verify.html";
                        //window.location.href = "http://localhost:5000/re-verify.html";

                    }
                    
                    //window.location.href = "https://myspa-5b893.firebaseapp.com/main.html";
                    //window.location.href = "http://localhost:5000/main.html";
                    //validateuser(id,mail.value);
                }).catch(function(error) {
                // Handle Errors here.
                $("#progress").hide();
                var errorCode = error.code;
                var errorMessage = error.message;
                closeDialogShowError(errorMessage);
                // ...
                });
            }else{
                closeDialogShowError("enter password!");
                mail.focus();
                mail.style.borderColor = "red";
            }
        }else{
            closeDialogShowError("invalid email address entered!");
            mail.focus();
            mail.style.borderColor = "red";
        }
        
    }

     //LogIn page
    //Validate all fields in the form
    function RegisterIsValid() {
        var results = true;
        reg_spa = document.getElementById('spa');
        reg_loc = document.getElementById('location');
        reg_email = document.getElementById('reg_email');
        reg_banner = document.getElementById('propic');
        reg_password = document.getElementById('newpassword');
        reg_confirm_password = document.getElementById('confirm_password');

        //$('#loader').hide();
        if (!reg_spa.value){
            reg_spa.focus();
            reg_spa.style.borderColor = "red";
            results = false;
        }
        if (!reg_loc.value){
            reg_loc.focus();
            reg_loc.style.borderColor = "red";
            results = false;
        }
        if (!reg_email.value){
            reg_email.focus();
            reg_email.style.borderColor = "red";
            results = false;
            var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        }
        if (reg_banner.src == ""){
            reg_banner.focus();
            reg_banner.style.borderColor = "red";
            results = false;
        }
        if (!reg_password.value){
            reg_password.focus();
            reg_password.style.borderColor = "red";
            results = false;
        }
        if (!reg_confirm_password.value){
            reg_confirm_password.focus();
            reg_confirm_password.style.borderColor = "red";
            results = false;
        }
        return results;
    }

}else{
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        }
    FireStoreDatabase = firebase.firestore();
    
    //get spa's information
    document.addEventListener("DOMContentLoaded",event=>{
        var Emailvalue = localStorage.getItem("active_email");
        //const snapshot = firebase.firestore().collection('userInformation').get();
        //return snapshot.docs.map(doc => doc.data());
        FireStoreDatabase.collection('spa').get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
            let items = doc.data();
            /* Make data suitable for rendering */
            //console.log("counting users",i++);
                if (Emailvalue === items.email){
                    localStorage.setItem("selected_id",items["document"]);
                    //console.log(Emailvalue);
                    //console.log(localStorage.getItem("selected_id"));
                    //set profile information
                    if(items.subscription == "active"){
                        setProfileInformation(FireStoreDatabase);
                        BirthdayCounts();
                    }else{                     
                        closeDialogShowError("Inactive subscription, sorry for any incovinience endured.Kindly contact us to make arrangements! )-:");
                        automaticLogOutUser();   
                    }
                    
                }
            });
            //Hide info section
            hideInfoShowBookings();
            //allocate Bookings
            Bookings();
            isFirebaseConnected();
            //load offline on view
            $(".headerPage").load("/offline.html",function(){
                $("#progress").hide();
            });
        });
    });
    
    //check to see if there's a current user logged in
    IsLoggedIn();

}

// wait function
function wait(){
    console.log("waiting...");
}

//set user profile information
function setProfileInformation(db){
    //initializeApp
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    //get local variables
    var selected_id = localStorage.getItem("selected_id");
    var docRef = db.collection("spa").doc(selected_id);
    docRef.get().then(function(doc) {
        if (doc.exists) {
            let items = doc.data();
            //set data on navbar elements
            var Name = document.getElementById("emp_name");
            var Emp_No = document.getElementById("emp_no");
            var Role = document.getElementById("emp_role");
            var Image = document.getElementById("propic_main");
            var boldSurname = items.spa.bold();
            //get db values
            var status = items.status;
            var subscription = items.subscription;
            Name.innerHTML = boldSurname+" "+items.location;
            Emp_No.innerHTML = "varified? : " + items.varified;
            Role.innerHTML = items.status;
            if(items.bannerSet){
                //Image.src=items.banner;
            }
            if(status == "inactive"){
                closeDialogShowError("you are not yet activated, kindly make a follow up to resolve this matter. You'll be logged out in 5 second(s)");
                automaticLogOutUser();
                //determine doctor's subscription
            }else if(subscription == "inactive"){
                closeDialogShowError("You have an inactive subscription. You'll be logged out in 5 second(s)");
                automaticLogOutUser();
            }
        } else {
            // doc.data() will be undefined in this case
            closeDialogShowError("No such document!");
        }
    }).catch(function(error) {
        //console.log("Error getting document:", error);
        closeDialogShowError(error);
    });
}
//show registration page
function spaRegistration(){
    $(document).ready(function(){
        $('#dialog').modal('show');
        //$("#progress").show();
    });
}
var Picture;
var picExtention;
//update user's own profile picture
function showImage(){
    Picture = "";
    picExtention = "";
    var RealFile = document.getElementById("real-file");
    RealFile.click();
    RealFile.addEventListener("change",function(){
        if(RealFile.value){
            //getting value of the uploaded file
            Picture = RealFile.value;
            var file = RealFile.value.split("\\");
            var fileName = file[file.length-1];
            var pic  = fileName.split(".");
            picExtention = pic[1].toLowerCase();
            //checking to see if it's a picture
            if(picExtention == 'png' || picExtention == 'jpg' || picExtention == 'jpeg'){
                var obj = new FileReader();
                obj.onload = function(data){
                    var user_Image = document.getElementById("propic");
                    user_Image.src = data.target.result;
                }
                //previewing before uploading
                obj.readAsDataURL(this.files[0]);
                Picture = this.files[0];
            }else{
                //invalid file choosen
                alert("Invalid File, please choose a picture");
                Picture = "";
            }
            
        }else{
            //Nothing choosen
            Picture = "";
        }

    });
}

 //DialogMessage on Error
function closeDialogShowError(errorMessage){
    //hide message dialog
    $("#progress").hide();
    //change modal attributes & show it
    $('#alertDialog').modal('show');
    var Response = document.getElementById("response");
    Response.innerHTML = errorMessage;
    Response.value = errorMessage;
    //$('#response').val(errorMessage);
    $('.modal-header').css('background-color', 'red');
  }
  //DialogMessage on Success
function closeDialogShowSuccess(){
    //hide message dialog
    $("#progress").hide();
    //show modal
    $('#alertDialog').modal('show');
    var Response = document.getElementById("response");
    Response.innerHTML = "Information successfully submitted!";
    Response.value = "Information successfully submitted!";
    $('.modal-header').css('background-color', 'green');
}
// Function to test if date is in the past
function isDatepast(date,row,column){
var tableTime = document.getElementById("dtBasicExample").rows[row+1].cells[0].innerHTML;
var past;
//current Date
 //var now = new Date();
 //now.setHours(0,0,0,0);
 //var dDate = new Date();
 //dDate.setHours(5,5,5,5);
 var now = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
 var dDate = new Date(date+" "+tableTime+":59");
 if(dDate<now){
    past = false;
 }else{
    past = true;
 }
 return past;

}
//Function to get current date
function getCurrentDate() {
    var d = new Date();
        month = d.getMonth() + 1;
        day =  d.getDate();
        year = d.getFullYear();
        Hours = d.getHours();
        Minutes = d.getMinutes();
        Seconds = d.getSeconds();

    if (month < 10){
        month = '0' + month;
    }
    if (day < 10){
        day = '0' + day;
    } 

    return year+"/"+month+"/"+day;
}
//Function to get current time
function getCurrentTime() {
    var d = new Date();
        month = d.getMonth() + 1;
        day =  d.getDate();
        year = d.getFullYear();
        Hours = d.getHours();
        Minutes = d.getMinutes();
        Seconds = d.getSeconds();
        if (Minutes < 10){
            Minutes = "0"+Minutes;
        }
        if (Seconds < 10){
            Seconds = "0"+Seconds;
        }
    return Hours+":"+Minutes+":"+Seconds;
}
 // get current user
 function IsLoggedIn(){
    var results;
  firebase.auth().onAuthStateChanged(user => {
      if (!user) {
          // user is logged out
          window.location.href = "https://myspa-5b893.firebaseapp.com/index.html";
          //window.location.href = "http://localhost:5000/index.html";
          results = false;
      }else{
          results = true;
      }
      return results;
    });
}
// log out function
function logOut(){
    firebaseConfig = {
        apiKey: "AIzaSyCl_RKUkkRjCGgs1fYE-ee3VZ9PvJZoOb4",
        authDomain: "myspa-5b893.firebaseapp.com",
        databaseURL: "https://myspa-5b893.firebaseio.com",
        projectId: "myspa-5b893",
        storageBucket: "",
        messagingSenderId: "825775443939",
        appId: "1:825775443939:web:bb6734113073a015"
      };
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        }
        firebase.auth().signOut()
        .then(function() {
        // Sign-out successful.
        window.location.href = "https://myspa-5b893.firebaseapp.com/index.html";
        //window.location.href = "http://localhost:5000/index.html";
        })
        .catch(function(error) {
        // An error happened
        closeDialogShowError(error);
        });
    
}
//Log out user automatically
function automaticLogOutUser(){
    setTimeout(function () {
        logOut();
        //do something once
      }, 5000);
}
//initialize first letter of the word
function InitializeFirstLetter(value){
    return value.substring(0,1).toUpperCase()+ value.substring(1,value.length).toLowerCase();
}
//check if value is a number
function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}
//clear an array
function clearArray(array){
    if(array){
        for (let index = 0; index < array.length; index++) {
            array.shift();
        }
    }
}
//function to calculate Age
function calculateAge(birthday) { // birthday is a date
    var newDate = new Date(birthday);
    var ageDifMs = newDate.getTime() - Date.now();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1969);
}
//function to calculate days
function calculateDays(birthday) { // birthday is a date
    var newDate = new Date(birthday);
    var curDate = new Date();
    newDate.setHours(0,0,0,0);
    curDate.setHours(0,0,0,0);
    var ageDifMs = newDate.getTime() - curDate.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    var days = ageDifMs/(1000*3600*24);
    //return Math.abs(ageDate.getUTCDay());
    return parseInt(days);
}


//Beautician's section

//show registration page /beautician
function beauticianRegistration(){
    $(document).ready(function(){
        $('#dialogBeaut').modal('show');
        $("#beautPassport").val('');
        $("#beautId").val('');
        var id = document.getElementById("sa");
        var passport = document.getElementById("non");
        id.addEventListener("click",function(){
            $("#beautPassport").hide();
            $("#beautId").show();
        });
        passport.addEventListener("click",function(){
            $("#beautPassport").show();
            $("#beautId").hide();
        });
        id.click();
        //gender
        var male = document.getElementById("male_beaut");
        male.click();    
    });
}
//Access beautician's information
function viewBeauticians(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/beauticians.html",function(){
        $(document).ready(
            function(){
                setBeauticiansToDataTable();
        });
    });
}
// set beauticians to the DataTable
function setBeauticiansToDataTable(){
    //get documents
    var count = 0;
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_beauticians").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var names = items.name;
            var surname = items.surname;
            var gender = items.gender;
            var idnum = items.IdNumber;
            var status= items.status;
            var Document = items.document;
            //Add data to the table
            //Table for Open Tasks
            var table = document.getElementById("dtBasicExample");
            var body = document.getElementById("beauticiansTable");
            //create a row
            var row = body.insertRow(count);
            //insert cells
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            // Add some text to the new cells:
            cell1.innerHTML = InitializeFirstLetter(names);
            cell2.innerHTML = InitializeFirstLetter(surname);
            cell3.innerHTML = gender;
            cell4.innerHTML = idnum;
            cell5.innerHTML = InitializeFirstLetter(status);
            //cell5.innerHTML = Age; calculating age
            //cell6.innerHTML = Status;medicalAid
            var btn = document.createElement('input');
            btn.type = "button";
            btn.style.backgroundColor = "grey";
            btn.style.color = "white";
            btn.style.borderColor = "blue";
            btn.style.marginRight = "50%";
            btn.style.marginLeft = "30%";
            btn.className = "btn";
            if (status == "active"){
                btn.style.backgroundColor = "red";
                btn.value = "Deactivate";
             }else{
                btn.style.backgroundColor = "green";
                btn.value = "Activate";
            }
            btn.onclick = (function (Document,status){return function(){ammendBeauticianStatus(Document,status);}})(Document,status);
            cell6.appendChild(btn);
            var btnView = document.createElement('input');
            btnView.type = "button";
            btnView.style.backgroundColor = "grey";
            btnView.style.color = "white";
            btnView.style.borderColor = "blue";
            btnView.style.marginRight = "50%";
            btnView.style.marginLeft = "30%";
            btnView.className = "btn";
            btnView.value = "View";
            btnView.onclick = (function (items){return function(){ammendBeauticianData(items);}})(items);
            cell7.appendChild(btnView);
            count++;
        });
        $('#dtBasicExample').DataTable();
    });
}
// function to change beautician's Status
function ammendBeauticianStatus(Doc,status){
    $("#progress").show();
    //get stored patient information
    var selected_id = localStorage.getItem("selected_id");//dr
    //switch statuses
    var newStatus = "";
    if(status == "active"){
        newStatus = "inactive";
    }else{
        newStatus = "active";
    }
    //initialize db
    var db = "";
    db = FireStoreDatabase;
    var docRef = db.collection(selected_id+"_beauticians").doc(Doc);
    var updateNow = 'StatusUpdateTime_'+getCurrentDate().replace(/\//g,'-')+"_"+getCurrentTime();
    //update
    return docRef.update({
        //update status
        [updateNow]:true,
        status:newStatus
    })
    .then(function() {
        $("#progress").hide();
        //click View Beauticians link
        var Beaut = document.getElementById("viewbeuaticians");
        Beaut.click();
        closeDialogShowSuccess();
    })
    .catch(function(error) {
        $("#progress").hide();
        // The document probably doesn't exist.
        closeDialogShowError(error);
    });


}
// function to change beautician's data
function ammendBeauticianData(items){
    $(document).ready(function(){
        $('#dialogEditBeaut').modal('show');
        //set header
        var header = document.getElementById("headers");
        header.innerHTML = InitializeFirstLetter(items.name) +" "+ InitializeFirstLetter(items.surname);
        //get values
        var newTitle = document.getElementById("titles");
        var newName = document.getElementById("names");
        var newSurname = document.getElementById("surnames");
        var newDOB = document.getElementById("beaut_dobs");
        var id = document.getElementById("sas");
        var passport = document.getElementById("nons");
        var newID = document.getElementById("beautIds");
        var newPassport = document.getElementById("beautPassports");
        var newEmail = document.getElementById("beaut_emails");
        var newMale = document.getElementById("male_beauts");
        var newFemale = document.getElementById("Female_beauts");
        //add values
        newTitle.value = items.title;
        newName.value = items.name;
        newSurname.value = items.surname;
        newDOB.value = items.dateOfBirth;
        newID.value = items.IdNumber;
        newEmail.value = items.email;
        //beautician Id//client ID
        $("#beautPassports").val('');
        $("#beautIds").val('');
        id.addEventListener("click",function(){
            $("#beautPassports").hide();
            $("#beautIds").show();
        });
        passport.addEventListener("click",function(){
            $("#beautPassports").show();
            $("#beautIds").hide();
        });
        //set IdNumber
          if(!items.citizen){
            id.checked = true;
            newID.value = items.IdNumber;
            id.click();
          }else{
            if(items.citizen =="citizen"){
                newID.value = items.IdNumber;
                id.checked = true;
                id.click();
            }else{
                newPassport.value = items.IdNumber;
                passport.checked = true;
                passport.click();
            }
          }
        //beautician gender
        if(items.gender == 'Male'){
            newMale.checked = true;
        }else{
            newFemale.checked = true;
        }
        BeauticianId = items.document;
    });
}
var BeauticianId;
//function to submit ammended Beautician data
function submitBeauticianData(){
    //get values
    var Gender;
    var Title;
    var citizen;
    var newTitle = document.getElementById("titles");
    var newName = document.getElementById("names");
    var newSurname = document.getElementById("surnames");
    var newDOB = document.getElementById("beaut_dobs");
    var newCitizen = document.getElementById("sas");
    var newNonCitizen = document.getElementById("nons");
    var newID = document.getElementById("beautIds");
    var newPassport = document.getElementById("beautPassports");
    var newEmail = document.getElementById("beaut_emails");
    var newMale = document.getElementById("male_beauts");
    var newFemale = document.getElementById("Female_beauts");
    //get documents
    var count = 0;
    var selected_id = localStorage.getItem("selected_id");//spa
    //email format
    var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!newName.value){
        newName.style.borderColor ="red";
        newName.focus();
    }else if(!newSurname.value){
        newSurname.style.borderColor ="red";
        newSurname.focus();
    }else if(!newDOB.value){
        newDOB.style.borderColor ="red";
        newDOB.focus();
    }else if((newCitizen.checked && !newID.value) || (newCitizen.checked && newID.value.length < 13)){
        newID.style.borderColor ="red";
        newID.focus();
    }else if(newNonCitizen.checked && !newPassport.value){
        newPassport.style.borderColor ="red";
        newPassport.focus();
    }else if(!newEmail.value || !emailFormat.test(String(newEmail.value).toLowerCase())){
        newEmail.style.borderColor ="red";
        newEmail.focus();
    }else{
        //hide active window
        var Close = document.getElementById("closed");
        Close.click();
        $("#progress").show();
        var IDNumber;
        //get if
        if(newCitizen.checked){
            citizen = "citizen";
            IDNumber = newID.value;
        }else{
            citizen = "non-citizen";
            IDNumber = newPassport.value;
        }
        //get gender
        if (newMale.checked){
            Gender ="Male";
        }else{
            Gender ="Female";
        }
        //get Title
        Title = newTitle.value;

        //initialize db
        var db = "";
        db = FireStoreDatabase;
        var docRef = db.collection(selected_id+"_beauticians").doc(BeauticianId);
        var updateNow = 'StatusUpdateTime_'+getCurrentDate().replace(/\//g,'-')+"_"+getCurrentTime();
        //update
        return docRef.update({
            //update status
            title:Title,
            name: newName.value,
            surname: newSurname.value,
            dateOfBirth: newDOB.value,
            citizen:citizen,
            IdNumber:IDNumber,
            email:newEmail.value,
            gender:Gender,
            [updateNow]:true,
        })
        .then(function() {
            $("#progress").hide();
            //click View Beauticians link
            var Beaut = document.getElementById("viewbeuaticians");
            Beaut.click();
            closeDialogShowSuccess();
        })
        .catch(function(error) {
            $("#progress").hide();
            // The document probably doesn't exist.
            closeDialogShowError(error);
        });
    }
}
// add a new beautician
function addBeautician (){
    //$("#dialogBeaut").hide();
    //initialize db
    //var db = "";
    //db = FireStoreDatabase;
    //get documents
    var count = 0;
    var selected_id = localStorage.getItem("selected_id");//spa
    //get values
    var Gender;
    var Title;
    var citizen;
    var newTitle = document.getElementById("title");
    var newName = document.getElementById("name");
    var newSurname = document.getElementById("surname");
    var newDOB = document.getElementById("beaut_dob");
    var newCitizen = document.getElementById("sa");
    var newNonCitizen = document.getElementById("non");
    var newID = document.getElementById("beautId");
    var newPassport = document.getElementById("beautPassport");
    var newEmail = document.getElementById("beaut_email");
    var newMale = document.getElementById("male_beaut");
    var newFemale = document.getElementById("Female_beaut");
    //email format
    var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!newName.value){
        newName.style.borderColor ="red";
        newName.focus();
    }else if(!newSurname.value){
        newSurname.style.borderColor ="red";
        newSurname.focus();
    }else if(!newDOB.value){
        newDOB.style.borderColor ="red";
        newDOB.focus();
    }else if((newCitizen.checked && !newID.value) || (newCitizen.checked && newID.value.length < 13)){
        newID.style.borderColor ="red";
        newID.focus();
    }else if(newNonCitizen.checked && !newPassport.value){
        newPassport.style.borderColor ="red";
        newPassport.focus();
    }else if(!newEmail.value || !emailFormat.test(String(newEmail.value).toLowerCase())){
        newEmail.style.borderColor ="red";
        newEmail.focus();
    }else{
        var Close = document.getElementById("close");
        Close.click();
        $("#progress").show();
        var IDNumber;
        //get if
        if(newCitizen.checked){
            citizen = "citizen";
            IDNumber = newID.value;
        }else{
            citizen = "non-citizen";
            IDNumber = newPassport.value;
        }
        //get gender
        if (newMale.checked){
            Gender ="Male";
        }else{
            Gender ="Female";
        }
        //get Title
        Title = newTitle.value;

        //add data
        FireStoreDatabase.collection(selected_id+"_beauticians").add({
            date: getCurrentDate(),
            time: getCurrentTime(),
            title:Title,
            name: newName.value,
            surname: newSurname.value,
            dateOfBirth: newDOB.value,
            citizen:citizen,
            IdNumber:IDNumber,
            email:newEmail.value,
            gender:Gender,
            status:"active"
        })
        .then(function(docRef) {
            FireStoreDatabase.collection(selected_id+"_beauticians").doc(docRef.id).update({
                "document": docRef.id
            })
            var Beaut = document.getElementById("viewbeuaticians");
            Beaut.click();
            $(document).ready(
                function(){
                    $("#progress").hide();
                    newName.value = "";
                    newSurname.value = "";
                    newDOB.value = "";
                    newID.value = "";
                    newPassport.value = "";
                    newEmail.value = "";
                    newName.focus();
                    
            });
            
        })
        .catch(function(error) {
            //console.error("Error writing document: ", error);
            closeDialogShowError(error);
        });

    }
}

//Client's section

//show registration page /client
function clientRegistration(){
    $(document).ready(function(){
        $('#dialogClient').modal('show');
    });
}
//Access clients's information
function viewClients(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/clients.html",function(){
        $(document).ready(
            function(){
                $("#beautPassport").hide();
                //client ID
                var id = document.getElementById("sa");
                var passport = document.getElementById("non");
                id.addEventListener("click",function(){
                    $("#beautPassport").hide();
                    $("#beautId").val('').focus();
                    $("#beautId").show();
                });
                passport.addEventListener("click",function(){
                    $("#beautPassport").show();
                    $("#beautPassport").val('').focus();
                    $("#beautId").hide();
                });
                id.click();
                //gender
                var male = document.getElementById("male_beaut");
                male.click();
                //If on medication
                var yes = document.getElementById("yes_medic");
                var no = document.getElementById("no_medic");
                yes.addEventListener("click",function(){
                    $("#medication").prop('disabled', false);
                });
                no.addEventListener("click",function(){
                    $("#medication").prop('disabled', true);
                });
                yes.click();
                //if on condition
                var conditionYes = document.getElementById("yes_condition");
                var conditionNo = document.getElementById("no_condition");
                conditionYes.addEventListener("click",function(){
                    $("#medical_condition").prop('disabled', false);
                })
                conditionNo.addEventListener("click",function(){
                    $("#medical_condition").prop('disabled', true);
                })
                conditionYes.click();
                setClientsToDataTable();
            });
    });
}
// set clients to the DataTable
function setClientsToDataTable(){
    //get documents
    var count = 0;
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_clients").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var names = items.name;
            var surname = items.surname;
            var gender = items.gender;
            var dob = items.dateOfBirth;
            var idnum = items.IdNumber;
            var File = items.file;
            var status= items.status;
            var Document = items.document;
            //Add data to the table
            //Table for Open Tasks
            var table = document.getElementById("dtBasicExample");
            var body = document.getElementById("clientsTable");
            //create a row
            var row = body.insertRow(count);
            //insert cells
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            // Add some text to the new cells:
            cell1.innerHTML = InitializeFirstLetter(names);
            cell2.innerHTML = InitializeFirstLetter(surname);
            if(gender){
                cell3.innerHTML = gender;
            }else{
                cell3.innerHTML = "<font color = 'red'><strong>Incomplete</strong></font>";
            }
            if(dob){
                cell4.innerHTML = dob;
            }else{
                cell4.innerHTML = "<font color = 'red'><strong>Incomplete</strong></font>";
            }
            if(idnum){
                cell5.innerHTML = idnum;
            }else{
                cell5.innerHTML = "<font color = 'red'><strong>Incomplete</strong></font>";
            }

            cell6.innerHTML = "#"+File;
            //cell5.innerHTML = Age; calculating age
            //cell6.innerHTML = Status;medicalAid
            var btn = document.createElement('input');
            btn.type = "button";
            btn.style.backgroundColor = "grey";
            btn.style.color = "white";
            btn.style.borderColor = "blue";
            btn.style.marginRight = "80%";
            btn.style.marginLeft = "20%";
            btn.className = "btn";
            btn.value = "view";
            btn.onclick = (function (items){return function(){ammendClientInfo(items);}})(items);
            cell7.appendChild(btn);
            count++;
        });
        $('#dtBasicExample').DataTable();
    });
}
//function to modify client's information
function ammendClientInfo(items){
    //assign items to data
    Clientdata = items;
    //show dialog
    $(document).ready(function(){
        $('#dialogClientAmmend').modal('show');

          //set header
          var header = document.getElementById("headers");
          header.innerHTML = InitializeFirstLetter(items.name) +" "+ InitializeFirstLetter(items.surname);
          //get documents
          var count = 0;
          var selected_id = localStorage.getItem("selected_id");//spa
          //get values
          var Gender;
          var Title;
          var medication = "none";
          var condition = "none";
          var newTitle = document.getElementById("titles");
          var newName = document.getElementById("names");
          var newSurname = document.getElementById("surnames");
          var newDOB = document.getElementById("beaut_dobs");
          var id = document.getElementById("sas");
          var passport = document.getElementById("nons");
          var newID = document.getElementById("beautIds");
          var newPassport = document.getElementById("beautPassports");
          var newEmail = document.getElementById("beaut_emails");
          var newMale = document.getElementById("male_beauts");
          var newFemale = document.getElementById("Female_beauts");
          var newPhone = document.getElementById("cells");
          var newAddress = document.getElementById("physicals");
          var newYesMedication = document.getElementById("yes_medics");
          var newNoMedication = document.getElementById("no_medics");
          var newMedication = document.getElementById("medications");
          var newYesCondition = document.getElementById("yes_conditions");
          var newNoCondition = document.getElementById("no_conditions");
          var newCondition = document.getElementById("medical_conditions");
          //next of Kin
          var kinName = document.getElementById("kin_names");
          var kinPhone = document.getElementById("kin_cells");
          //client ID
          $("#beautPassports").val('');
          $("#beautIds").val('');
          id.addEventListener("click",function(){
              $("#beautPassports").hide();
              $("#beautIds").show();
          });
          passport.addEventListener("click",function(){
              $("#beautPassports").show();
              $("#beautIds").hide();
          });
  
          //If on medication
          newYesMedication.addEventListener("click",function(){
              $("#medications").prop('disabled', false);
          })
          newNoMedication.addEventListener("click",function(){
              $("#medications").prop('disabled', true);
          })
          //if on condition
          newYesCondition.addEventListener("click",function(){
              $("#medical_conditions").prop('disabled', false);
          })
          newNoCondition.addEventListener("click",function(){
              $("#medical_conditions").prop('disabled', true);
          })
          //set values
          newTitle.value = items.title;
          newName.value = items.name;
          newSurname.value = items.surname;
          if(items.dateOfBirth){
            newDOB.value = items.dateOfBirth;
          }
          //set IdNumber
          if(!items.citizen){
            id.checked = true;
            newID.value = items.IdNumber;
            id.click();
          }else{
            if(items.citizen =="citizen"){
                newID.value = items.IdNumber;
                id.checked = true;
                id.click();
            }else{
                newPassport.value = items.IdNumber;
                passport.checked = true;
                passport.click();
            }
          }
          if(items.email){
            newEmail.value = items.email;
          }
          if(items.phone){
            newPhone.value = items.phone;
          }
          if(items.address){
            newAddress.value = items.address;
          }
          if(items.kinName){
            kinName.value = items.kinName;
          }
          if(items.kinPhone){
            kinPhone.value = items.kinPhone;
          }
          //gender
          if (items.gender == "Male"){
              newMale.checked =true;
          }else{
              newFemale.checked =true;
          }
          //Medication
          if (items.medication == "none" || !items.medication){
              newNoMedication.checked =true;
              newMedication.value = "";
          }else{
              newYesMedication.checked =true;
              newMedication.value = items.medication;
          }
          //Condition
          if (items.condition == "none" || !items.condition){
              newNoCondition.checked =true;
              newCondition.value = "";
          }else{
              newYesCondition.checked =true;
              newCondition.value = items.condition;
          }
    });
      
}
var bookingId;
var Clientdata;
//submit modified client data
function submitClientInfo(fromClientSection){
//get documents
    var selected_id = localStorage.getItem("selected_id");//spa
    //get values
    var Gender;
    var Title;
    var medication = "none";
    var condition = "none";
    var citizen;
    var newTitle = document.getElementById("titles");
    var newName = document.getElementById("names");
    var newSurname = document.getElementById("surnames");
    var newDOB = document.getElementById("beaut_dobs");
    var newCitizen = document.getElementById("sas");
    var newNonCitizen = document.getElementById("nons");
    var newID = document.getElementById("beautIds");
    var newPassport = document.getElementById("beautPassports");
    var newEmail = document.getElementById("beaut_emails");
    var newMale = document.getElementById("male_beauts");
    var newFemale = document.getElementById("Female_beauts");
    var newPhone = document.getElementById("cells");
    var newAddress = document.getElementById("physicals");
    var newYesMedication = document.getElementById("yes_medics");
    var newNoMedication = document.getElementById("no_medics");
    var newMedication = document.getElementById("medications");
    var newYesCondition = document.getElementById("yes_conditions");
    var newNoCondition = document.getElementById("no_conditions");
    var newCondition = document.getElementById("medical_conditions");
    //next of Kin
    var kinName = document.getElementById("kin_names");
    var kinPhone = document.getElementById("kin_cells");
    //email format
    var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!newName.value){
        newName.style.borderColor ="red";
        newName.focus();
    }else if(!newSurname.value){
        newSurname.style.borderColor ="red";
        newSurname.focus();
    }else if(!newDOB.value){
        newDOB.style.borderColor ="red";
        newDOB.focus();
    }else if((newCitizen.checked && !newID.value) || (newCitizen.checked && newID.value.length < 13)){
        newID.style.borderColor ="red";
        newID.focus();
    }else if(newNonCitizen.checked && !newPassport.value){
        newPassport.style.borderColor ="red";
        newPassport.focus();
    }else if(!newEmail.value || !emailFormat.test(String(newEmail.value).toLowerCase())){
        newEmail.style.borderColor ="red";
        newEmail.focus();
    }else if(!newPhone.value || newPhone.value.length < 10 || newPhone.value.substring(0,1)!="0"){
        newPhone.style.borderColor ="red";
        newPhone.focus();
    }else if(!newAddress.value){
        newAddress.style.borderColor ="red";
        newAddress.focus();
    }else if(newYesMedication.checked && !newMedication.value){
        newMedication.style.borderColor ="red";
        newMedication.focus();
    }else if(newYesCondition.checked && !newCondition.value){
        newCondition.style.borderColor ="red";
        newCondition.focus();
    }else if(!kinName.value){
        kinName.style.borderColor ="red";
        kinName.focus();
    }else if(!kinPhone.value || kinPhone.value.length < 10 || kinPhone.value.substring(0,1)!="0"){
        kinPhone.style.borderColor ="red";
        kinPhone.focus();
    }else{
        var IDNumber;
        //get if
        if(newCitizen.checked){
            citizen = "citizen";
            IDNumber = newID.value;
        }else{
            citizen = "non-citizen";
            IDNumber = newPassport.value;
        }
        //get gender
        if (newMale.checked){
            Gender ="Male";
        }else{
            Gender ="Female";
        }
        //get medication
        if (newYesMedication.checked){
            medication = newMedication.value;
        }
        //get condition
        if (newYesCondition.checked){
            condition = newCondition.value;
        }
        Title = newTitle.value;
        var modified = false;
        if(Clientdata.title != Title){
            modified = true;
        }
        if(Clientdata.name != newName.value){
            modified = true;
        }
        if(Clientdata.surname != newSurname.value){
            modified = true;
        }
        if(Clientdata.dateOfBirth != newDOB.value){
            modified = true;
        }
        if(Clientdata.IdNumber != IDNumber){
            modified = true;
        }
        if(Clientdata.email != newEmail.value){
            modified = true;
        }
        if(Clientdata.gender != Gender){
            modified = true;
        }
        if(Clientdata.phone != newPhone.value){
            modified = true;
        }
        if(Clientdata.address != newAddress.value){
            modified = true;
        }
        if(Clientdata.medication != medication){
            modified = true;
        }
        if(Clientdata.condition != condition){
            modified = true;
        }
        if(Clientdata.kinName != kinName.value){
            modified = true;
        }
        if(Clientdata.kinPhone != kinPhone.value){
            modified = true;
        }
        var isModified = new Boolean(modified);
        if(isModified == true){
            var updateNow = 'profileupdateTime_'+getCurrentDate().replace(/\//g,'-');
            var Close = document.getElementById("close_");
            Close.click();
            $("#progress").show();
            FireStoreDatabase.collection(selected_id+"_clients").doc(Clientdata.document).update({
                title:Title,
                name: newName.value,
                surname: newSurname.value,
                dateOfBirth: newDOB.value,
                IdNumber:IDNumber,
                email:newEmail.value,
                gender:Gender,
                citizen:citizen,
                phone:newPhone.value,
                address:newAddress.value,
                kinName:kinName.value,
                kinPhone:kinPhone.value,
                [updateNow]:getCurrentTime(),
                medication:medication,
                condition:condition,
            })
            .then(function() {
                $(document).ready(function(){
                    //console.log("Document successfully updated!");
                    var isFromClients = new Boolean(fromClientSection);
                    if(isFromClients == true){
                        var Clients = document.getElementById("viewclients");
                        Clients.click();
                        $("#progress").hide();
                        closeDialogShowSuccess();
                    }else{
                        //update bookings section
                        //console.log("booking Id ",bookingId);
                            FireStoreDatabase.collection(selected_id+"_bookings").doc(bookingId).update({
                                clientProfile:true,
                            })
                            .then(function(){
                                $("#progress").hide();
                                var Bookings = document.getElementById("viewbookings");
                                Bookings.click();
                            })
                            .catch(function(error) {
                                $("#progress").hide();
                                //console.error("Error writing document: ", error);
                                closeDialogShowError(error);
                                //console.log(error);
                            });
                    }
                    
                    
                });
            })
            .catch(function(error) {
                $("#progress").hide();
                //console.error("Error writing document: ", error);
                closeDialogShowError(error);
            });
        }else{
            closeDialogShowError("no details ammended");
        }
    }


}
// add a new client
function addClient (){
    //get documents
    var selected_id = localStorage.getItem("selected_id");//spa
    //get values
    var Gender;
    var Title;
    var medication = "none";
    var condition = "none";
    var citizen;
    var newTitle = document.getElementById("beaut_title");
    var newName = document.getElementById("beaut_name");
    var newSurname = document.getElementById("beaut_surname");
    var newDOB = document.getElementById("beaut_dob");
    var newCitizen = document.getElementById("sa");
    var newNonCitizen = document.getElementById("non");
    var newID = document.getElementById("beautId");
    var newPassport = document.getElementById("beautPassport");
    var newEmail = document.getElementById("beaut_email");
    var newMale = document.getElementById("male_beaut");
    var newPhone = document.getElementById("beaut_cell");
    var newAddress = document.getElementById("physical");
    var newYesMedication = document.getElementById("yes_medic");
    var newMedication = document.getElementById("medication");
    var newYesCondition = document.getElementById("yes_condition");
    var newCondition = document.getElementById("medical_condition");
    //next of Kin
    var kinName = document.getElementById("kin_name");
    var kinPhone = document.getElementById("kin_cell");
    //email format
    var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!newName.value){
        newName.style.borderColor ="red";
        newName.focus();
    }else if(!newSurname.value){
        newSurname.style.borderColor ="red";
        newSurname.focus();
    }else if(!newDOB.value){
        newDOB.style.borderColor ="red";
        newDOB.focus();
    }else if((newCitizen.checked && !newID.value) || (newCitizen.checked && newID.value.length < 13)){
        newID.style.borderColor ="red";
        newID.focus();
    }else if(newNonCitizen.checked && !newPassport.value){
        newPassport.style.borderColor ="red";
        newPassport.focus();
    }else if(!newEmail.value || !emailFormat.test(String(newEmail.value).toLowerCase())){
        newEmail.style.borderColor ="red";
        newEmail.focus();
    }else if(!newPhone.value || newPhone.value.length < 10 || newPhone.value.substring(0,1)!="0"){
        newPhone.style.borderColor ="red";
        newPhone.focus();
    }else if(!newAddress.value){
        newAddress.style.borderColor ="red";
        newAddress.focus();
    }else if(newYesMedication.checked && !newMedication.value){
        newMedication.style.borderColor ="red";
        newMedication.focus();
    }else if(newYesCondition.checked && !newCondition.value){
        newCondition.style.borderColor ="red";
        newCondition.focus();
    }else if(!kinName.value){
        kinName.style.borderColor ="red";
        kinName.focus();
    }else if(!kinPhone.value || kinPhone.value.length < 10 || kinPhone.value.substring(0,1)!="0"){
        kinPhone.style.borderColor ="red";
        kinPhone.focus();
    }else{
        var IDNumber;
        //get if
        if(newCitizen.checked){
            citizen = "citizen";
            IDNumber = newID.value;
        }else{
            citizen = "non-citizen";
            IDNumber = newPassport.value;
        }
        //get gender
        if (newMale.checked){
            Gender ="Male";
        }else{
            Gender ="Female";
        }
        //get medication
        if (newYesMedication.checked){
            medication = newMedication.value;
        }
        //get condition
        if (newYesCondition.checked){
            condition = newCondition.value;
        }
        Title = newTitle.value;
        var Close = document.getElementById("beaut_close");
        Close.click();
        $("#progress").show();
        var Count = 1;
        FireStoreDatabase.collection(selected_id+"_clients").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                let items = doc.data();
                /* Make data suitable for rendering */
                var names = items.name;
                Count++
            })
            //add data
            FireStoreDatabase.collection(selected_id+"_clients").add({
                date: getCurrentDate(),
                time: getCurrentTime(),
                file:Count,
                title:Title,
                name: newName.value,
                surname: newSurname.value,
                dateOfBirth: newDOB.value,
                IdNumber:IDNumber,
                email:newEmail.value,
                gender:Gender,
                citizen:citizen,
                phone:newPhone.value,
                address:newAddress.value,
                medication:medication,
                condition:condition,
                kinName:kinName.value,
                kinPhone:kinPhone.value,
                status:"active"
            })
            .then(function(docRef) {
                FireStoreDatabase.collection(selected_id+"_clients").doc(docRef.id).update({
                    "document": docRef.id
                })
                var Clients = document.getElementById("viewclients");
                Clients.click();
                $(document).ready(
                    function(){
                        $("#progress").hide();
                        newName.value = "";
                        newSurname.value = "";
                        newDOB.value = "";
                        newID.value = "";
                        newPassport.value = "";
                        newEmail.value = "";
                        newPhone.value = "";
                        newAddress.value = "";
                        newMedication.value = "";
                        newCondition.value = "";
                        kinName.value = "";
                        kinPhone.value = "";
                        newPassport.value = "";
                        newName.focus();
                        
                });
                
            })
            .catch(function(error) {
                //console.error("Error writing document: ", error);
                closeDialogShowError(error);
            });
        })

    }
}

//Bookings section BBBBBBBBBBBBB**********************BBB***
var cellColumns;
var cellRows;
//view Bookings
//Access beautician's information
function viewBookings(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/bookings.html",function(){
        $(document).ready(
            function(){
                //get the selected date
                var selectedDate = document.getElementById("date");
                selectedDate.value = getCurrentDate().replace(/\//g,'-');
                Bookings();
                //Hide info section
                hideInfoShowBookings();
        });
    });
}
//initiate bookings
function Bookings(){
    //empty table headers & footers
    $("#bookingsTable").empty();
    $("#head").empty();
    $("#foot").empty();
    $(document).ready(
        function(){
                //Date
                var selectedDate = document.getElementById("date");
                //Save Therapists data
                Therapists = [];
                Therapists_Doc = [];
                //set section
                //assign header & footer for table
                var HeaderMain = document.getElementById("head");
                var FooterMain = document.getElementById("foot");
                //cerate section
                var headerSection = document.createElement("th");
                var footerSection = document.createElement("th");
                //assign values
                headerSection.innerHTML = "<font color = 'red'>schedule </font>";
                headerSection.className = "th-sm";
                footerSection.innerHTML = "<font color = 'red'>schedule </font>";
                //append values
                HeaderMain.appendChild(headerSection);
                FooterMain.appendChild(footerSection);
                //get documents
                var count = 0;
                var selected_id = localStorage.getItem("selected_id");//spa
                FireStoreDatabase.collection(selected_id+"_beauticians").get().then(function(querySnapshot) {
                    querySnapshot.forEach(function(doc) {
                        let items = doc.data();
                        /* Make data suitable for rendering */
                        var name = items.name;
                        var surname = items.surname;
                        var Document = items.document;
                        var OffDay = items["OffDay_"+selectedDate.value];//items["OffDay_"+getCurrentDate().replace(/\//g,'-')];
                        var status = items.status;
                        //if therapist is off
                        if(status == 'active'){
                            //assign header & footer for table
                            var thead = document.getElementById("head");
                            var tfoot = document.getElementById("foot");
                            //insert headings
                            var header = document.createElement("th");
                            var footer = document.createElement("th");
                            if(count % 2 == 0 ){
                                header.style.color = "blue"
                                footer.style.color = "blue"
                            }else{
                                header.style.color = "green"
                                footer.style.color = "green"
                            }
                            header.className = "th-sm";
                            footer.className = "th-sm";

                            
                            if(OffDay){
                                header.innerHTML = InitializeFirstLetter(name)+" "+ InitializeFirstLetter(surname)+" - <strong><font color = 'red'>Off</font></strong><span hidden>"+Document+"</span>";
                                footer.innerHTML = InitializeFirstLetter(name)+" "+ InitializeFirstLetter(surname);

                            }else{
                                header.innerHTML = InitializeFirstLetter(name)+" "+ InitializeFirstLetter(surname)+"<span hidden>"+Document+"</span>";
                                footer.innerHTML = InitializeFirstLetter(name)+" "+ InitializeFirstLetter(surname);
                                Therapists[Therapists.length] = InitializeFirstLetter(name)+" "+ InitializeFirstLetter(surname);
                                Therapists_Doc[Therapists_Doc.length] = Document;
                            }
                            
                            thead.appendChild(header);
                            tfoot.appendChild(footer);
                            header.style.cursor = "pointer";
                            header.addEventListener("click",function(event){
                                $('#dialogOffDay').modal('show');
                                var name = document.getElementById("t_name");
                                var value = event.target.innerHTML.split('<span hidden="">');
                                name.innerHTML = value[0]+"<span hidden>"+value[1];
                                var isOff = value[0].split("</font>");
                                var Off = isOff[0].split('<font color="red">');
                                var Button = document.getElementById("off");
                                if(Off[1] == "Off"){
                                    Button.className = "btn btn-lg btn-success btn-block text-center mb-3";
                                    Button.innerHTML = "Book In"
                                }else{
                                    Button.className = "btn btn-lg btn-danger btn-block text-center mb-3";
                                    Button.innerHTML = "Book Off"
                                }
                            })

                            //append values
                            //HeaderMain.appendChild(header);
                            //FooterMain.appendChild(footer);

                            count++;
                        }
                    });
                    $(document).ready(
                        function(){
                            setBookingHeaders(count);
                            //allocateBookings();               
                    });
                    //$('#dtBasicExample').DataTable();
                });
        });
}
//set Bookings date
function selectBookingDate(){
    var BookingDate = document.getElementById("date");
    //empty table
    $("#bookingsTable").empty();
    $("#head").empty();
    $("#foot").empty();
    $(document).ready(
        function(){
            Bookings();
            allocateBookings();
        });
}
//allocate schedule
function setBookingHeaders(total){
    cellColumns = total + 1;
    cellRows = 157;
    var basicTime = "8:00";
     //Add data to the table
             //Table for Open Tasks
             var table = document.getElementById("dtBasicExample");
             var body = document.getElementById("bookingsTable");

             for (let index = 0; index < cellRows; index++) {
                 //create a row
                var row = body.insertRow(index);
                for (let x = 0; x < cellColumns; x++) {
                    //insert cells
                    if(x==0){
                    var cell = row.insertCell(x);
                        if(index == 0){
                            cell.innerHTML = basicTime;
                            cell.style.color = "red";
                        }else{
                            //set time by 30min each
                            var newtime = basicTime.split(":");
                            if(newtime[1] == "55" ){
                                var addHour = parseInt(newtime[0]) + 1;
                                basicTime = addHour + ":00";
                                cell.innerHTML = basicTime;
                            }else{
                                var min = parseFloat(newtime[1]) + 5;
                                if(min ==5 ){
                                    basicTime = newtime[0] + ":0" + min;
                                }else{
                                    basicTime = newtime[0] + ":" + min;
                                }
                                cell.innerHTML = basicTime;
                            }
                            cell.style.color = "red"
                        }   
                    }else{
                        //color code cell for Off Therapist
                        var cell = row.insertCell(x);
                        cell.innerHTML = "";
                        cell.onclick = (function (index,x){return function(){openBookDialog(index,x);}})(index,x);
                        cell.className = "bookings";
                        cell.style.cursor = "pointer";
                    }
                }
             }
             //allocate all bookings after setting headers
             allocateBookings();
}
var Therapists;
var Therapists_Doc;
//function to open the booking dialog
function openBookDialog(row,column){
    var date = document.getElementById("date");
    var BookingSection = document.getElementById("dtBasicExample").rows[row+1].cells[column].innerHTML;
    var TherapistHeader = document.getElementById("dtBasicExample").rows[0].cells[column].innerHTML;
    var isOff = TherapistHeader.split("</font>");
    var Off = isOff[0].substring(isOff[0].length - 3, isOff[0].length);
    var TherapistName = TherapistHeader.split('<span hidden="">');
    //assign Bookings section's value
    selectedBooking = BookingSection;
    //Check if Therapist is not Off
    if (Off != "Off"){
        //open only for future dates
        if(isDatepast(date.value,row,column)){
            if(BookingSection != ""){
                var getInfo = BookingSection.split("<br>");
                var removeLessThan = getInfo[2].split("<");
                var removeGreaterThan = removeLessThan[1].split(">");
                var docFinder = removeGreaterThan[1].split("~");
                var documentNo = docFinder[0];
                var From =  docFinder[1];
                var To =  docFinder[2];
                var Category = docFinder[3];
                var Duration = docFinder[4];
                var client = getInfo[0];
                var service = getInfo[1];
                //show cancel pop-up
                $('#dialogCancelBooking').modal('show');
                var Client = document.getElementById("clients");
                var Treatment = document.getElementById("treatments");
                var Document = document.getElementById("documents");
                var cancel = document.getElementById("cancel");
                var edit = document.getElementById("edit");
                Client.value = client;
                Treatment.value = service;
                Document.value = documentNo + "~" + column + "~" + To + "~" + From;
                var Cancelcenter = document.getElementById("Cancelcenter");
                var Heading = document.getElementById("headerCancel");
                cancel.addEventListener("click",function(event){
                    Cancelcenter.style.height = "320px";
                    $("#treatment_label").show();
                    $("#treatments").show();
                    $("#e_cancel").show();
                    $("#date_label").hide();
                    $("#e_date").hide();
                    $("#e_schedule").hide();
                    $("#e_daterow").hide();
                    $("#e_edit").hide();
                    $("#cats_").hide();
                    $("#treats_").hide();
                    $("#priceTag").hide();
                    $("#comboLabel_").hide();
                    $("#comboSection_").hide();
                    $("#options_").hide();
                    $("#addCombo_").hide();
                    Heading.innerHTML = "Cancel Booking";
                    Heading.style.color = "white";
                });
                edit.addEventListener("click",function(event){
                    var SameTreat = document.getElementById("sameTreatment");
                    var editTreat = document.getElementById("editTreatment");
                    SameTreat.click();
                    if(SameTreat.checked){
                        Cancelcenter.style.height = "560";
                    }else if(editTreat.checked){
                        Cancelcenter.style.height = "850px";
                    }else{
                        Cancelcenter.style.height = "1020px";
                        $("#comboSection_").show();
                    }
                    $("#treatment_label").show();
                    $("#treatments").show();
                    $("#date_label").show();
                    $("#e_date").show();
                    $("#e_schedule").show();
                    $("#e_daterow").show();
                    $("#e_edit").show();
                    $("#e_cancel").hide();
                    $("#cats_").show();
                    $("#treats_").show();
                    $("#priceTag").show();
                    $("#comboLabel_").show();
                    $("#options_").show();
                    Heading.innerHTML = "Edit Booking";
                    Heading.style.color = "white";

                });
                edit.click();
                //set beauticians
                var Beautician = document.getElementById("e_beautician");
                var BeauticianDoc = document.getElementById("e_beauticianDoc");
                $("#e_beautician").empty();
                var therapistProfile = TherapistName[0];
                var chosenIndex = 0;
                for (let index = 0; index < Therapists.length; index++) {
                    //initialize therapist documenta
                    //create lists
                    if(index==0){
                        BeauticianDoc.value = Therapists_Doc[0];
                    }
                    var opt = document.createElement('option');
                    opt.id = index;
                    opt.value = index;
                    opt.innerHTML = Therapists[index]
                    Beautician.addEventListener("change",function(event){
                        BeauticianDoc.value = Therapists_Doc[Beautician.selectedIndex];
                    });
                    Beautician.appendChild(opt);
                    if(therapistProfile == Therapists[index]){
                        chosenIndex = index;
                    }
                        
                }
                //Initialize Therapists list
                Beautician.selectedIndex = chosenIndex;

                var allTimeFrame = [];
                 //main page date value
                var BookingDate = document.getElementById("date");
                var editDate = document.getElementById("e_date");
                var set = false;
                editDate.addEventListener("change",function(event){
                    $("#e_edit").prop('disabled', true);
                    //BookingDate.click()
                    //set date on main window
                    if(set == false){
                        set = true;
                        BookingDate.value =  event.target.value;
                        selectBookingDate();
                        //reset times on the from list
                        $("#e_from").empty();
                        var now = new Date(getCurrentDate().replace(/\//g,'-'));
                        var dDate = new Date(BookingDate.value);
                        var From = document.getElementById("e_from");
                        var found = false;
                        var noOfTimes = 0;
                        if(dDate.getTime() > now.getTime()){
                            $("#e_edit").prop('disabled', false);
                            for (let index = 0; index < allTimeFrame.length; index++) {
                                var opt = document.createElement('option');
                                opt.id = index+"_a";
                                opt.value = index;
                                opt.innerHTML = allTimeFrame[index];
                                From.appendChild(opt);
                                if(found==true){
                                    if(docFinder[2] == allTimeFrame[index]){
                                        found = false;
                                    }
                                    noOfTimes++;
                                }
                                if(docFinder[1] == allTimeFrame[index]){
                                    found = true;
                                }
                            }
                            //set a select value
                            document.getElementById("0_a").selected = true;
                            var Tot = document.getElementById("e_to");
                            Tot.value = allTimeFrame[noOfTimes];                                    
                        }else{
                            if(dDate.getTime() == now.getTime()){
                                $("#e_edit").prop('disabled', false);
                                for (let index = 0; index < allTimeFrame.length; index++) {
                                    var Now = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
                                    var DDate = new Date(getCurrentDate().replace(/\//g,'-')+" "+allTimeFrame[index]+":59");
                                    var opt = document.createElement('option');
                                    opt.id = index+"_a";
                                    opt.value = index;
                                    opt.innerHTML = allTimeFrame[index];
                                    From.appendChild(opt);
                                    if(docFinder[1] == allTimeFrame[index]){
                                        selected = index+"_a";
                                    } 
                                }
                                document.getElementById(selected).selected = true;
                                var Tot = document.getElementById("e_to");
                                Tot.value = docFinder[2];
                            }else{
                                $("#e_edit").prop('disabled', true);
                                var Tot = document.getElementById("e_to");
                                Tot.value = "";
                            }
                        }
                        set = false;
                    }

                });
                editDate.value = BookingDate.value;
                //Handle From entries
                $("#e_from").empty();
                var From = document.getElementById("e_from");
                From.addEventListener("change",function(event){
                    var duration = document.getElementById("duration_");
                    var from = From[this.selectedIndex].innerHTML;
                    var myDuration = 0;
                     //Add To for scheduling
                    //Add To for scheduling
                    var SameTreat = document.getElementById("sameTreatment");
                    if(SameTreat.checked){
                        myDuration = Duration * 12;
                    }else{
                        myDuration = parseInt(duration.value * 12);
                    }
                    for (let index = 0; index < allTimeFrame.length; index++) {
                        if (allTimeFrame[index] == from){
                                var Tot = document.getElementById("e_to");
                                if((index+myDuration)>allTimeFrame.length){
                                    Tot.value = "Beyond Schedule";
                                    Tot.style.color = 'red';
                                }else{
                                    Tot.value = allTimeFrame[index+myDuration];
                                    document.getElementById('e_to').style.removeProperty('color');
                                }
                                
                                break;
                        }
                    }
                    
                });
                cellRows = 157; 
                var now = new Date(getCurrentDate().replace(/\//g,'-'));//+" "+getCurrentTime());
                var dDate = new Date(BookingDate.value);// +" 23:59:59");
                var startTime;
                var selected;
                //Handle Date value
                if(dDate.getTime() > now.getTime()){
                    for (let index = 0; index < cellRows; index++) {
                        //time
                        var tableTime = document.getElementById("dtBasicExample").rows[index+1].cells[0].innerHTML; 
                        //get To object
                        var To = document.getElementById("e_to");
                        //create lists
                        var opt = document.createElement('option');
                        opt.value = index;
                        opt.innerHTML = tableTime;
                        From.appendChild(opt);
                        if(index==0){startTime = tableTime}
                        allTimeFrame[index] = tableTime;
                    }
                    From.selectedIndex = 0;
                }else{
                    for (let index = 0; index < cellRows; index++) {
                        //time
                        var tableTime = document.getElementById("dtBasicExample").rows[index+1].cells[0].innerHTML;
                        //determine the current time
                        var tbl = new Date(getCurrentDate().replace(/\//g,'-')+" "+tableTime+":00");
                        var cur = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
                        //get To object
                        var To = document.getElementById("e_to");
                        //create lists
                        var opt = document.createElement('option');
                        opt.value = index;
                        opt.innerHTML = tableTime;
                        From.appendChild(opt);
                        if(index==0){startTime = tableTime}
                        if(docFinder[1] == tableTime){
                            selected = index;
                        }
                        allTimeFrame[index] = tableTime;
                    }
                    From.selectedIndex = selected;
                }
                //Add To for scheduling
                var Tot = document.getElementById("e_to");
                //Tot.value = docFinder[2];//time;
                // handle treatment types
                var SameTreat = document.getElementById("sameTreatment");
                var editTreat = document.getElementById("editTreatment");
                var designTreat = document.getElementById("designTreatment");
                var CategoryTreat = document.getElementById("cats_");
                var TreatmentTreat = document.getElementById("treats_");
                var priceTreat = document.getElementById("priceTag");
                var comboLabelTreat = document.getElementById("comboLabel_");
                var comboListTreat = document.getElementById("comboSection_");
                SameTreat.addEventListener("click",function(event){
                    CategoryTreat.hidden = true;
                    TreatmentTreat.hidden = true;
                    priceTreat.hidden = true;
                    comboListTreat.hidden = true;
                    comboLabelTreat.hidden = true;
                    $("#addCombo_").hide();
                    Cancelcenter.style.height = "510px";
                    setTreatment_(From.options[From.selectedIndex].innerHTML,Duration);
                    //Tot.value = time; //docFinder[2];//time;
                });
                editTreat.addEventListener("click",function(event){
                    CategoryTreat.hidden = false;
                    TreatmentTreat.hidden = false;
                    priceTreat.hidden = false;
                    comboListTreat.hidden = true;
                    comboLabelTreat.hidden = true;
                    Cancelcenter.style.height = "800px";
                    var From = document.getElementById("e_from");
                    $("#addCombo_").hide();
                    setTreatment_(From.options[From.selectedIndex].innerHTML,"");
                });
                designTreat.addEventListener("click",function(event){
                    CategoryTreat.hidden = false;
                    TreatmentTreat.hidden = false;
                    priceTreat.hidden = false;
                    comboListTreat.hidden = false;
                    comboLabelTreat.hidden = false;
                    $("#options_").show();
                    $("#comboSection_").show();
                    $("#combos_").empty();
                    $("#addCombo_").show();
                    Cancelcenter.style.height = "1020px";
                    setTreatment_(From.options[From.selectedIndex].innerHTML,"");
                });
                SameTreat.click();

            }else{
                $(document).ready(function(){
                    $('#dialogBookNow').modal('show');
                    clearArray(clientId);
                    clearArray(BeautId);
                    clearArray(TreatDuration);
                    clearArray(TreatPrice);
                    setClients();
                    setBeauticians(column);
                    //get Time
                    var Time = document.getElementById("dtBasicExample").rows[row+1].cells[0].innerHTML;
                    setTreatment(Time);
                    var Client = document.getElementById("client");
                    var Beautician = document.getElementById("beauticianDoc");
                    var Treatment = document.getElementById("treatment");
                    //remove red border from client input
                    document.getElementById('clientel').style.removeProperty('border');
                    //initialize client input by clearing it & removing the cancel section on the far right
                    $(".autocomplete .close").removeClass('visible');
                    //set empty to client input
                    $(".autocomplete input").val('').focus();
                    var Bookingcenter = document.getElementById("Bookingcenter");
                    //handle existing & none existing users
                    var Existing = document.getElementById("existing");
                    var New = document.getElementById("new");
                    Existing.addEventListener("click",function(event){
                        $("#name").hide();
                        $("#name_").hide();
                        $("#surname").hide();
                        $("#surname_").hide();
                        $("#title").hide();
                        $("#title_").hide();
                        $("#cell").hide();
                        $("#profile_row").hide();
                        $("#info_row").hide();
                        $("#phone_").hide();
                        $("#client").show();
                        $(".autocomplete").show();
                        $('.listDialog').removeClass('open');
                        //checked items to resize
                        var Default = document.getElementById("default");
                        if(Default.checked){
                            Bookingcenter.style.height = "640px";
                        }else{
                            Bookingcenter.style.height = "860px";
                        }
                        //Bookingcenter.style.height = "1020px";
                        //$("#client_").show();
                        var cLhead = document.getElementById("client_");
                        cLhead.innerHTML = "Select Client:<font color = 'red'> *</font>"
                    });
                    New.addEventListener("click",function(event){
                        $("#name").show();
                        $("#name_").show();
                        $("#surname").show();
                        $("#surname_").show();
                        $("#title").show();
                        $("#title_").show();
                        $("#cell").show();
                        $("#profile_row").show();
                        $("#info_row").show();
                        $("#phone_").show();
                        $("#client").hide();
                        $(".autocomplete").hide();
                        $('.listDialog').removeClass('open');
                        //check default gender
                        var Male = document.getElementById("male_beauti");
                        Male.checked = true;
                        //checked items to resize
                        var Default = document.getElementById("default");
                        if(Default.checked){
                            Bookingcenter.style.height = "800px";
                        }else{
                            Bookingcenter.style.height = "1020px";
                        }
                        //Bookingcenter.style.height = "1020px";
                        //$("#client_").hide();
                        var cLhead = document.getElementById("client_");
                        cLhead.innerHTML = "New Client:<font color = 'red'> *</font>"
                        var newName = document.getElementById("name");
                        var newSurname = document.getElementById("surname");
                        var newPhone = document.getElementById("cell");
                        newName.value = "";
                        newSurname.value = "";
                        newPhone.value = "";
                    });
                    Existing.click();
                    //handle Combos & Default treatments
                    var Default = document.getElementById("default");
                    var Combo = document.getElementById("combo");
                    $("#combos").empty();
                    Default.addEventListener("click",function(event){
                        $("#comboSection").hide();
                        $("#comboLabel").hide();
                        $("#addCombo").hide();
                        $('.listDialog').removeClass('open');
                        if(Existing.checked){
                            Bookingcenter.style.height = "640px";
                        }else{
                            Bookingcenter.style.height = "800px";
                        }
                    });
                    Combo.addEventListener("click",function(event){
                        $("#comboSection").show();
                        $("#comboLabel").show();
                        $("#combos").empty();
                        $("#addCombo").show();
                        $('.listDialog').removeClass('open');
                        if(Existing.checked){
                            Bookingcenter.style.height = "860px";
                        }else{
                            Bookingcenter.style.height = "1020px";
                        }
                        var Button = document.getElementById("addCombo");
                        Button.addEventListener("click",function(event){
                        });
                    });
                    Default.click();
                });
            }
        }else{

            if(BookingSection != ""){
                 //ratings section
                var getInfo = BookingSection.split("<br>");
                var removeLessThan = getInfo[2].split("<");
                var removeGreaterThan = removeLessThan[1].split(">");
                var docFinder = removeGreaterThan[1].split("~");
                //var documentNo = docFinder[0];
                //var From =  docFinder[1];
                var To =  docFinder[2];
                var today = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
                var bookEndDay = new Date(date.value +" "+To+":00");
                if(today.getTime()>bookEndDay.getTime()){
                    var Header = document.getElementById("dtBasicExample").rows[0].cells[column].innerHTML;
                    $(document).ready(function(){
                        var header = document.getElementById("headercx");
                        header.innerHTML =  Header;
                        header.style.className = "text-light";
                        header.style.bgColor = "white";
                        $('#dialogRatings').modal('show');
                        var defaultBGColor = "#007bff";
                        $("#one-icon").css('color', defaultBGColor);
                        $("#two-icon").css('color', defaultBGColor);
                        $("#three-icon").css('color', defaultBGColor);
                        $("#four-icon").css('color', defaultBGColor);
                        $("#five-icon").css('color', defaultBGColor);
                        $("#six-icon").css('color', defaultBGColor);
                        $("#seven-icon").css('color', defaultBGColor);
                        $("#eight-icon").css('color', defaultBGColor);
                        $("#nine-icon").css('color', defaultBGColor);
                        $("#ten-icon").css('color', defaultBGColor);
                        $("#one").css('color', defaultBGColor);
                        $("#two").css('color', defaultBGColor);
                        $("#three").css('color', defaultBGColor);
                        $("#four").css('color', defaultBGColor);
                        $("#five").css('color', defaultBGColor);
                        $("#six").css('color', defaultBGColor);
                        $("#seven").css('color', defaultBGColor);
                        $("#eight").css('color', defaultBGColor);
                        $("#nine").css('color', defaultBGColor);
                        $("#ten").css('color', defaultBGColor);
                        var BookingSection = document.getElementById("dtBasicExample").rows[row+1].cells[column].innerHTML;
                        //get the cell
                        var getInfo = BookingSection.split("<br>");
                        var removeLessThan = getInfo[2].split("<");
                        var removeGreaterThan = removeLessThan[1].split(">");
                        var documentNo = removeGreaterThan[1];
                        var client = getInfo[0];
                        var service = getInfo[1];
                        //allocate rating variables
                        RatingClient = client;
                        RatingService = service;
                        RatingColumn = column;
                        RatingRow = row;
                    });
                    
                }
            }
        }
    } 
}
var clientId;
var clientSex;
//set clients to the list
function setClients(){
    clientId=[];
    clientSex =[];
    var allclients = [];
    var allDocuments = [];
    var allSex = [];
    var count = 0;
     //get documents
     var selected_id = localStorage.getItem("selected_id");//spa
     //clear all
     $("#client").empty();
     FireStoreDatabase.collection(selected_id+"_clients").get().then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
             let items = doc.data();
             /* Make data suitable for rendering */
             var name = items.name;
             var surname = items.surname;
             var doc = items.document;
             var gender = items.gender;
             allclients[count] = InitializeFirstLetter(name)+" "+ InitializeFirstLetter(surname)+"_"+count;
             allDocuments[count] = doc;
             allSex[count] = gender;
             /*//get clients object
             var Client = document.getElementById("client");
             //create lists
             var opt = document.createElement('option');
             opt.value = count;
             opt.innerHTML = InitializeFirstLetter(name)+" "+ InitializeFirstLetter(surname);
             opt.onchange = (function (doc){return function(){setClientDocument(doc);}})(doc);
             Client.appendChild(opt);
             clientId[count] = doc;
             clientSex[count] = gender;*/
             count++;
         });
          //reset
          var newArrayList = [];
          allclients.sort();
          $("#client").empty();
         //$("#client").empty();
         //get clients object
         var Client = document.getElementById("client");
         for (let index = 0; index < allclients.length; index++) {
             //create lists
             var opt = document.createElement('option');
             var clientName = allclients[index].split("_");
             var doc = allDocuments[clientName[1]];
             opt.value = index;
             opt.innerHTML = clientName[0];
             newArrayList[index] = clientName[0];
             opt.onchange = (function (doc){return function(){setClientDocument(doc);}})(doc);
             Client.appendChild(opt);
             clientId[index] = allDocuments[clientName[1]];
             clientSex[index] = allSex[clientName[1]];
             if(index ==0){
                 var ClientDocument = document.getElementById("clienDoc");
                 var ClientGender= document.getElementById("clienGender");
                 ClientDocument.value = doc;
                 ClientGender.value = allSex[clientName[1]];
                 Client.selectedIndex = 0;
             }      
         }
         fillUpComplete(newArrayList,clientId,clientSex);
     });

}
//set document when client is chosen
function setClientDocument(event){
    var ClientDocument = document.getElementById("clienDoc");
    var ClientGender= document.getElementById("clienGender");
    ClientDocument.value = clientId[this.selectedIndex];
    ClientGender.value = clientSex[this.selectedIndex];
}
var BeautId;
var BeautHeader;
//set beauticians to the list
function setBeauticians(Col){
    var Details = document.getElementById("dtBasicExample").rows[0].cells[Col].innerHTML;
    var NameDetails = Details.split('<span hidden="">');
    BeautHeader = NameDetails[0];
    BeautId = [];
    var count = 0;
     //get documents
     var selected_id = localStorage.getItem("selected_id");//spa
     //clear all
     $("#beautician").empty();
     FireStoreDatabase.collection(selected_id+"_beauticians").get().then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
             let items = doc.data();
             /* Make data suitable for rendering */
             var name = items.name;
             var surname = items.surname;
             var doc = items.document;
             var status= items.status;
             var OffDay = items["OffDay_"+getCurrentDate().replace(/\//g,'-')];
             //check if status is active & is not off
             if(status == "active" && !OffDay){
                //get beautician object
                var Beautician = document.getElementById("beautician");
                //create lists
                var opt = document.createElement('option');
                opt.value = count;
                opt.innerHTML = InitializeFirstLetter(name)+" "+ InitializeFirstLetter(surname);
                opt.onchange = (function (doc){return function(){setBeauticianDocument(doc);}})(doc);
                Beautician.appendChild(opt);
                BeautId[count] = doc;
                if(count ==0){
                    var BeauticianDoc = document.getElementById("beauticianDoc");
                    BeauticianDoc.value = doc;
                }
                count++;
            }
         });
         var Beautician = document.getElementById("beautician");
         for(var i = 0, j = Beautician.options.length; i < j; ++i) {
            if(Beautician.options[i].innerHTML === BeautHeader) {
                Beautician.selectedIndex = i;
               break;
            }
        }
     });
}
//set document when beauticians is chosen
function setBeauticianDocument(event){
    var Beautician = document.getElementById("beauticianDoc");
    Beautician.value = BeautId[this.selectedIndex];
}
var TreatDuration;
var TreatPrice;
var Category = [];
//set treatments to the list
function setTreatment(time){
    TreatDuration = [];
    TreatPrice = [];
    var count = 0;
    var Duration;
    //categories
    Category = [];
    var catcount = 0;
     //get documents
     var selected_id = localStorage.getItem("selected_id");//spa
     //clear all
     $("#treatment").empty();
     $("#category").empty();
     FireStoreDatabase.collection(selected_id+"_services").get().then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
             let items = doc.data();
             /* Make data suitable for rendering */
             var name = items.name;
             var duration = items.duration;
             var amount = items.amount;
             var description = items.description;
             /*/get clients object
             var Treatment = document.getElementById("treatment");
             //create lists
             var opt = document.createElement('option');
             opt.value = count;
             opt.innerHTML = InitializeFirstLetter(name);
             opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
             Treatment.appendChild(opt);
             TreatDuration[count] = duration;
             TreatPrice[count] = "R "+amount;*/
             //group all categories

             var categories = document.getElementById("category");
             var found = false;
             for (let index = 0; index < Category.length; index++) {
                 if(Category[index].toLowerCase() == name.toLowerCase()){
                    found = true;
                    break;
                 }
             }

            var Available = new Boolean(found);
            if(Available == false){
                Category[catcount] = name;
                var Opt = document.createElement('option');
                Opt.value = count;
                Opt.innerHTML = InitializeFirstLetter(name);
                Opt.onchange = (function (name){return function(){setTreatmentCategory(name);}})(name);
                categories.appendChild(Opt);
                catcount++;
            }
            //add all treament values
            if(Category[0].toLowerCase() == name.toLowerCase()){
                var Treatment = document.getElementById("treatment");
                //create lists
                var opt = document.createElement('option');
                opt.value = count;
                opt.innerHTML = InitializeFirstLetter(description);
                opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
                Treatment.appendChild(opt);
            }
             if(count ==0){
                var Treatment = document.getElementById("duration");
                var From = document.getElementById("from");
                var Price = document.getElementById("price");
                Treatment.value = duration;
                From.value = time;
                Price.value = "R "+amount;
                Duration = duration;
             }
             count++;
         });
         durationTo(time,Duration);
     });

}
var catName;
//set Treatments when Category is chosen
function setTreatmentCategory(event){
    var Categories = document.getElementById("category");
    var Cat = Category[this.selectedIndex];
    var count = 0;
    var timeDuration = [];
    $("#treatment").empty();
    //get documents
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_services").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var name = items.name;
            var duration = items.duration;
            var amount = items.amount;
            var description = items.description;
            if(name.toLowerCase() == Cat.toLowerCase()){
                //get clients object
                var Treatment = document.getElementById("treatment");
                //create lists
                var opt = document.createElement('option');
                opt.value = count;
                opt.innerHTML = InitializeFirstLetter(description);
                //opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
                Treatment.appendChild(opt);
                TreatDuration[count] = duration;
                TreatPrice[count] = "R "+amount;
                //set initial values
                if(count ==0){
                    var Treatment = document.getElementById("duration");
                    var From = document.getElementById("from");
                    var Price = document.getElementById("price");
                    Treatment.value = duration;
                    //From.value = time;
                    Price.value = "R "+amount;
                    Duration = duration;
                 }
                 timeDuration[count] = parseFloat(items.duration);
                 count++;
             }
        });
        //set Time
        var From = document.getElementById("from");
        durationTo(From.value,parseFloat(timeDuration[0]));
    });
}
//set document when client is chosen
function setTreatmentDocument(event){
    var count = 0;
    $("#to").empty();
    var TreatmentFrom = document.getElementById("from");
    var TreatmentDuration = document.getElementById("duration");
    var TreatmentPrice = document.getElementById("price");
    TreatmentDuration.value = TreatDuration[this.selectedIndex];
    TreatmentPrice.value = TreatPrice[this.selectedIndex];
    //var Duration = TreatDuration[this.selectedIndex];
    //var Price = TreatPrice[this.selectedIndex];
    var newDuration = TreatmentDuration.value.split(".");
    var Hours = newDuration[0];
    var Min = newDuration[1];
    var getFrom = TreatmentFrom.value.split(":");
    var fromHour = getFrom[0];
    var fromMin =getFrom[1];
    var finalHour = parseInt(Hours)+parseInt(fromHour);
    var finalTime;
    if (Min){
        var newMin = "0."+Min;
        var finalMin = newMin * 60;
        var DetermineHour = parseInt(finalMin) + parseInt(fromMin);
        if(DetermineHour >= 60){
            finalHour+=1;
            finalMin = DetermineHour - 60;
            if(finalMin == 0){
                finalMin = "00";
            }
        }else{
            finalMin = DetermineHour;
        }
        finalTime = finalHour+":"+finalMin;
    }else{

        finalTime = finalHour+":"+fromMin;
    }
    var found = false;
    for (let index = 0; index < cellRows; index++) {
        var tableTime = document.getElementById("dtBasicExample").rows[index+1].cells[0].innerHTML;
        if(tableTime == finalTime){
            found = true;
        }
        if(found){
            //get To object
            var To = document.getElementById("to");
            //create lists
            var opt = document.createElement('option');
            opt.value = index;
            opt.innerHTML = tableTime;
            //opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
            To.appendChild(opt);

        }

    }
    TreatmentDuration.value = TreatDuration[this.selectedIndex];

    /*var basicTime = "7:30";
    var TargetTime;
    var found = false;
    TreatmentDuration.value = TreatDuration[this.selectedIndex];
    TreatmentPrice.value = TreatPrice[this.selectedIndex];
    var newDuration = TreatmentDuration.value * 2;
    for (let index = 0; index < cellRows - 1; index++) {
        var newtime = basicTime.split(":");
        var primarytime = newtime[0]+":"+newtime[1];
        if(newtime[1] == "55" ){
            var addHour = parseInt(newtime[0]) + 1;
            basicTime = addHour + ":00";
        }else{
            var min = parseFloat(newtime[1]) + 5;
            if(min ==5 ){
                basicTime = newtime[0] + ":0" + min;
            }else{
                basicTime = newtime[0] + ":" + min;
            }
            //basicTime = newtime[0] + ":30";
        }
        if(count>0){
            if(newDuration < 0){
                if(!found){
                    TargetTime = basicTime;
                    found = true;
                }
                //get To object
                var To = document.getElementById("to");
                //create lists
                var opt = document.createElement('option');
                opt.value = count-1;
                opt.innerHTML = basicTime;
                //opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
                To.appendChild(opt);
            count++;
            }else{
                newDuration --;
            }
        }
        if(basicTime == TreatmentFrom.value || primarytime == TreatmentFrom.value ){
                newDuration --;
                count++;
        }
        
    }
    TreatmentDuration.value = TargetTime;*/
}
//set duration To for bookings
function durationTo(time,selectedDuration){
    var count = 0;
    var basicTime = "8:00";
    var newDuration = parseInt(selectedDuration * 12);
    var finalDuration = parseInt(selectedDuration * 12);
    var TreatmentFrom = document.getElementById("from");
    var newDew = ""+selectedDuration;
    var target = newDew.split(".");
    var targetFrom = TreatmentFrom.value.split(":");
    var hour = target[0];
    var minute = target[1];
    var Thour = targetFrom[0];
    var Tminute = targetFrom[1];
    var To = "0";
    if(minute){
        var h = parseInt(hour) + parseInt(Thour);
        var minZero = minute.substring(0,1);
        var minJ = minute.substring(1,minute.length) * 60;
        To = h + ":" + minZero+minJ;
    }else{
        var h = parseInt(hour) + parseInt(Thour);
        To = h + ":" + Tminute;
    }
    $("#to").empty();
    for (let index = 0; index < cellRows -1; index++) {
        var newtime = basicTime.split(":");
        if(newtime[1] == "55" ){
            var addHour = parseInt(newtime[0]) + 1;
            basicTime = addHour + ":00";
        }else{
            var min = parseFloat(newtime[1]) + 5;
            if(min ==5 ){
                basicTime = newtime[0] + ":0" + min;
            }else{
                basicTime = newtime[0] + ":" + min;
            }

            //basicTime = newtime[0] + ":30";
        }
        //setting duration to

        if(count>0){
            if(newDuration == 0){
            //get To object
            var To = document.getElementById("to");
            //create lists
            var opt = document.createElement('option');
            opt.value = count-1;
            opt.innerHTML = basicTime;
            //opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
            To.appendChild(opt);
            count++;
            //reset border
            document.getElementById('to').style.removeProperty('border');
            }else{
                newDuration --;
                count++;
            }
        }
        if(basicTime == time || (time=="8:00" && basicTime == "8:05")){
            if(count ==0){
                count++;
                newDuration --;
                if(finalDuration == 1 && time == "8:00"){
                //get To object
                    var To = document.getElementById("to");
                    //create lists
                    var opt = document.createElement('option');
                    opt.value = 0;
                    opt.innerHTML = basicTime;
                    //opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
                    To.appendChild(opt);
                }else if(time == "8:00"){
                    newDuration --;
                }
            }            
        }
    }
    
}
//alocate and assign all bookings per date
function allocateBookings(){
    $(document).ready(
        function(){
            //variables
            var Incomplete = [];
            var Concelled = [];
            var count = 0;
            //get the selected date
            var selectedDate = document.getElementById("date");
            //get documents
            var selected_id = localStorage.getItem("selected_id");//spa
            FireStoreDatabase.collection(selected_id+"_bookings").where("date","==",selectedDate.value).get().then(function(querySnapshot) {
                querySnapshot.forEach(function(doc) {
                    let items = doc.data();
                    /* Make data suitable for rendering */
                    var clientId = items.clientId;
                    var clientName = items.clientName;
                    var gender = items.clientGender;
                    var Document = items.document;
                    var Treatment = items.treatment;
                    var Category = items.category;
                    var Time = items.time;
                    var beautician = InitializeFirstLetter(items.beauticianName);
                    var beauticianId = items.beauticianId;
                    var Cancelled = items.cancelled;
                    var completeProfile = items.clientProfile;
                    var from = items.startTime;
                    var to = items.endtime;
                    var duration = items.defaultDuration;
                    var OffDay = items["OffDay_"+getCurrentDate().replace(/\//g,'-')];
                    // check for incomplete profiles
                    //alert(items.clientProfile)
                        if(items.clientProfile == false){
                            var incompleteProfile = new Boolean(completeProfile);
                            var found = false;
                            if(incompleteProfile == false && items.cancelled == false){
                                var Incvalue = "<font color = 'maroon' class = '"+items.document+"'><strong id = '"+clientId+"' class = '"+items.document+" '>"+InitializeFirstLetter(clientName)+"</strong></font>"+"<br>"+from+" - "+to+"~"+beauticianId+"~"+clientId+"~"+items.beauticianName+"~"+items.document;
                                    for (let index = 0; index < Incomplete.length; index++) {
                                        if(Incvalue.trim() === Incomplete[index].trim()){
                                            found = true;
                                            break;
                                        }
                                    }
                                    var IsFound = new Boolean(found);
                                    if(IsFound == false){
                                        Incomplete[Incomplete.length] = Incvalue;
                                    }
                            }
                        }
                    // check for cancelled appointments
                        if(items.cancelled == true){
                                var Cancvalue = "<font color = 'maroon'><strong id = '"+clientId+"'>"+InitializeFirstLetter(clientName)+"</strong></font>"+"<br>"+from+" - "+to+"~"+beauticianId+"~"+clientId+"~"+items.beauticianName;
                                    for (let index = 0; index < Concelled.length; index++) {
                                        if(Cancvalue.trim() === Concelled[index].trim()){
                                            found = true;
                                            break;
                                        }
                                    }
                                    var IsFound = new Boolean(found);
                                    if(IsFound == false){
                                        Concelled[Concelled.length] = Cancvalue;
                                    }
                        }
                    //assign bookings to the datatable
                    var headerIndex;
                    for (let index = 0; index < cellColumns; index++) {
                        var newheader = document.getElementById("dtBasicExample").rows[0].cells[index].innerHTML;
                        var findheader = newheader.split('<span hidden="">');
                        header = findheader[0];
                        if(beautician.toLowerCase() === header.toLowerCase()){
                            headerIndex = index;
                            break;
                        }
                    }
                    //assign bookings based on from & To
                    var found = false;
                    for (let index = 0; index < cellRows; index++) {
                        var searchTime = document.getElementById("dtBasicExample").rows[index+1].cells[0].innerHTML;
                        if(searchTime == from){
                            found = true;
                        }
                        if(found){
                            if(!Cancelled){
                                var sex;
                                var name;
                                if(gender !=="undefined"){
                                    if(gender == "Male"){
                                        sex = "Mr";
                                    }else{
                                        sex = "Ms";
                                    }
                                    name =sex +", "+ InitializeFirstLetter(items.clientName);
                                }else{
                                    name = InitializeFirstLetter(items.clientName);
                                }
                                
                                var treatment = Treatment;
                                //set table value
                                if(items.rating){
                                    document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].innerHTML = name +"<br>"+treatment + "<br><span id='doc' hidden>"+Document+"~"+from+"~"+to+"~"+Category+"~"+duration+"</span>";
                                }else{
                                    document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].innerHTML = name +"<br>"+treatment + "<br><span id='doc' hidden>"+Document+"~"+from+"~"+to+"~"+Category+"~"+duration+"</span>";
                                    document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].style.color = "red";
                                }
                                document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].style.backgroundColor = "pink";
                            }

                        }
                        //place time before the final time
                        var finatSearchTime = document.getElementById("dtBasicExample").rows[index+2].cells[0].innerHTML;
                        if(finatSearchTime == to){
                            found = false;
                        }
                    }
                    //old version
                    /*var defaultTime = "7:55";
                    for (let index = 0; index < cellRows; index++) {
                        var newtime = defaultTime.split(":");
                        if(newtime[1] == "55" ){
                            var addHour = parseInt(newtime[0]) + 1;
                            defaultTime = addHour + ":00";
                            if(defaultTime == Time){
                                //check if it's not cancelled
                                if(!Cancelled){
                                    var sex;
                                        if(gender == "Male"){
                                            sex = "Mr";
                                        }else{
                                            sex = "Ms";
                                        }
                                    var name =sex +", "+ InitializeFirstLetter(items.clientName);
                                    var treatment = Treatment;
                                    //set table value
                                    if(items.rating){
                                        document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].innerHTML = name +"<br>"+treatment + "<br><span id='doc' hidden>"+Document+"~"+from+"~"+to+"~"+Category+"~"+duration+"</span>";
                                    }else{
                                        document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].innerHTML = name +"<br>"+treatment + "<br><span id='doc' hidden>"+Document+"~"+from+"~"+to+"~"+Category+"~"+duration+"</span>";
                                        document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].style.color = "red";
                                    }
                                    document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].style.backgroundColor = "pink";
                                }
                            }
                        }else{
                            var min = parseFloat(newtime[1]) + 5;
                            if(min ==5 ){
                                defaultTime = newtime[0] + ":0" + min;
                            }else{
                                defaultTime = newtime[0] + ":" + min;
                            }
                            //defaultTime = newtime[0] + ":30";
                            if(defaultTime == Time){
                                if(!Cancelled){
                                    var sex;
                                    if(gender == "Male"){
                                        sex = "Mr";
                                    }else{
                                        sex = "Ms";
                                    }
                                    var name =sex +", "+ InitializeFirstLetter(items.clientName);
                                    var treatment = Treatment;
                                    //set table value
                                    if(items.rating){
                                        document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].innerHTML = name +"<br>"+treatment + "<br><span id='doc' hidden>"+Document+"~"+from+"~"+to+"~"+Category+"~"+duration+"</span>";
                                    }else{
                                        document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].innerHTML = name +"<br>"+treatment + "<br><span id='doc' hidden>"+Document+"~"+from+"~"+to+"~"+Category+"~"+duration+"</span>";
                                        document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].style.color = "red";
                                    }
                                    document.getElementById("dtBasicExample").rows[index + 1].cells[headerIndex].style.backgroundColor = "pink";
                                }    
                            }
                        }
                        
                    }*/
                    count++;
                });
                Incomplete.sort();
                var Today = getCurrentDate().replace(/\//g,'-');
                if(selectedDate.value == Today){
                    //show info section -- Incomplete Profiles
                    if(Incomplete.length > 0){
                        showInfoShowBookings();
                        $("#clientlist").empty();
                        $("#incompletes").show();
                        var userList = document.getElementById("clientlist");
                        userList.innerHTML = "<h5><font color = 'red'>Clients list</font></h5>";
                        for (let index = 0; index < Incomplete.length; index++) {
                            var inc = Incomplete[index].split("~");
                            var Li = document.createElement('li');
                            Li.innerHTML = inc[0];
                            Li.value = index;
                            Li.className = inc[4];
                            Li.id = inc[2]; 
                            Li.style.cursor = "pointer";
                            Li.addEventListener("click",function(event){
                                //alert(event.target.id);
                                FireStoreDatabase.collection(selected_id+"_clients").where("document","==",event.target.id).get().then(function(querySnapshot) {
                                    querySnapshot.forEach(function(doc) {
                                        let items = doc.data();
                                        if(items.document = event.target.id){
                                            //allocate booking Id
                                            bookingId = event.target.className;
                                            ammendClientInfo(items);
                                        }
                                    })
                                });
                            });
                            userList.appendChild(Li);
                        }
                    }else{
                        $("#incompletes").hide();
                    }
                    //show info section -- Cancellation Section
                    if(Concelled.length > 0){
                        showInfoShowBookings();
                        $("#cancellist").empty();
                        $("#cancels").show();
                        var userList = document.getElementById("cancellist");
                        userList.innerHTML = "<h5><font color = 'red'>Follow ups</font></h5>";
                        Concelled.sort();
                        var sortList = [];
                        for (let x = 0; x < Concelled.length; x++) {
                            var inc = Concelled[x].split("~");
                            var getTime = inc[0].split("<br>");
                            var myTime = getTime[1].substring(0,5);
                            sortList[x] = myTime + inc[0]+" under <font color = 'blue' id = '"+inc[2]+"'>"+InitializeFirstLetter(inc[3]+"</font>");
                        }
                        sortList.sort();
                        for (let index = 0; index < sortList.length; index++) {
                            var inc = Concelled[index].split("~");
                            var A = document.createElement('a');
                            var Li = document.createElement('li');
                            //Li Tag
                            //Li.id = "user_"+index;
                            Li.id = inc[2]; 
                            Li.innerHTML = sortList[index].substring(5,sortList[index].length);//remove the times we used to sort with
                            Li.value = index;  
                            //A.href = "#"
                            A.id = "user_"+index;
                            //A.id=inc[2];
                            A.style.cursor = "pointer";
                            //if Li is clicked
                            Li.addEventListener("click",function(event){
                                $('#dialogPreviewClient').modal('show');
                                var Name = document.getElementById("c_name");
                                var Phone = document.getElementById("c_phone");
                                var Email = document.getElementById("c_email");
                                Name.innerHTML = "";
                                Phone.innerHTML = "";
                                Email.innerHTML = "";
                                FireStoreDatabase.collection(selected_id+"_clients").where("document","==",event.target.id).get().then(function(querySnapshot) {
                                    querySnapshot.forEach(function(doc) {
                                        let items = doc.data();
                                        /* Make data suitable for rendering */
                                        var names = items.name;
                                        var surname = items.surname;
                                        var email = items.email;
                                        var phone = items.phone;
                                        Name.innerHTML = "<font color = 'maroon'><strong>"+InitializeFirstLetter(names)+" "+InitializeFirstLetter(surname)+"</strong></font>";
                                        if (phone){
                                            Phone.innerHTML = phone;
                                        }else{
                                            Phone.innerHTML = "<font color = 'red'>Phone<br>Unavailable</font>";
                                        }
                                        if (email){
                                            Email.innerHTML = email;
                                        }else{
                                            Email.innerHTML = "<font color = 'red'>Email<br>Unavailable</font>";
                                        }
                                    });
                                });
                            });
                            A.appendChild(Li);
                            userList.appendChild(A);
                        }
                    }else{
                        $("#cancels").hide();
                    }
                    //if both of them are empty
                    if(Concelled.length == 0 && Incomplete.length == 0){
                        hideInfoShowBookings()
                    }

                }else{
                    //If date is not today then hide info window
                    hideInfoShowBookings();
                }
                //handle off therapists
                var columns = document.getElementById("dtBasicExample").rows[0].cells;
                for (let index = 0; index < columns.length; index++) {
                    var TherapistHeader = document.getElementById("dtBasicExample").rows[0].cells[index].innerHTML;
                    var isOff = TherapistHeader.split("</font>");
                    var Off = isOff[0].substring(isOff[0].length - 3, isOff[0].length);
                    if(Off == "Off"){
                        for (let x = 0; x < cellRows; x++) {
                            var Column = document.getElementById("dtBasicExample").rows[x+1].cells[index];
                            Column.style.backgroundColor = "grey";
                        }

                    }
                    
                }
                //var body = document.getElementById("bookingsTable");
                //if(body){
                //    $(document).ready(
                //        function(){
                intervalTime = setInterval(indicateCurrentTime, 10000);
                //    });
                //}
            });
            //clear time indicator interval
            //clearInterval(intervalTime);
        });
}
var intervalTime;
//function to indicate current time
function indicateCurrentTime(){ //clearInterval(intervalTime);
    $(window).ready(
        function(){
            cellRows = 157;
            var body = document.getElementById("bookingsTable");
            if(body){
                //selected info
                var selectedDate = new Date(document.getElementById("date").value +" 00:00:00"); //2019-08-28
                //default info
                var currentDate = new Date(getCurrentDate().replace(/\//g,'-') +" 00:00:00");
                //Time
                var currentTime = new Date(getCurrentTime().substring(0,5) +" 00:00:00");
                //var BookingSection = document.getElementById("dtBasicExample").rows[cellRows].cells[0].innerHTML;
                var now = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime().substring(0,5));
                var TableDate = new Date(document.getElementById("date").value +" 08:00");
                if(selectedDate.getTime() == currentDate.getTime() && now.getTime() > TableDate.getTime()){
                    $(document).ready(
                        function(){
                            for (let index = 0; index < cellRows; index++) {
                                if(document.getElementById("dtBasicExample").rows[index+1]){
                                    var tableTime = document.getElementById("dtBasicExample").rows[index+1].cells[0].innerHTML;             
                                    var dateNow = new Date(getCurrentDate().replace(/\//g,'-') +  " " + getCurrentTime().substring(0,5));
                                    var dateChoosen = new Date(getCurrentDate().replace(/\//g,'-')  +  " " + tableTime);
                                    //var closeTime = document.getElementById("dtBasicExample").rows[cellRows].cells[0].innerHTML;
                                    //console.log(dateChoosen.getTime() > dateNow.getTime());
                                    //console.log(index+1 == cellRows);
                                    if(dateChoosen.getTime() >= dateNow.getTime() || index+1 == cellRows){
                                        if (index+1 == cellRows){
                                            var myRowBefore = document.getElementById("dtBasicExample").rows[index];
                                            var myRow = document.getElementById("dtBasicExample").rows[index+1];
                                            if(body){
                                                myRowBefore.style.backgroundColor = "none";
                                                myRow.style.backgroundColor = "maroon";
                                            }
                                            //break;                        
                                        }else{
                                            var myRowAfter = document.getElementById("dtBasicExample").rows[index+1];
                                            var bgColor = myRowAfter.style.backgroundColor;
                                            var myRowBefore = document.getElementById("dtBasicExample").rows[index-1];
                                            myRowBefore.style.backgroundColor = bgColor;
                                            var myRow = document.getElementById("dtBasicExample").rows[index];
                                            if(body){
                                                myRow.style.backgroundColor = "maroon";
                                            }
                                            break;
                                        }
                                    }
                                }
                            }
                        });
                }
            }else{
                clearInterval(intervalTime);
            }
    //console.log(getCurrentTime());
    });
}
//submit a booking
function submitBooking(){
    //get documents
    var selected_id = localStorage.getItem("selected_id");//spa
    //get values
    var selectedClient = document.getElementById("clientel");
    var Client = document.getElementById("client");
    var ClientId = document.getElementById("clienDoc");
    var Beautician = document.getElementById("beautician");
    var BeauticianId = document.getElementById("beauticianDoc");
    var Treatment = document.getElementById("treatment");
    var From = document.getElementById("from");
    var To = document.getElementById("to");
    var Column = Beautician.options[Beautician.selectedIndex].value;
    var New = document.getElementById("new");
    //To.style.borderColor ="transparent";
     if(!To.value){
        To.style.borderColor ="red";
        To.focus();
     }else if(!selectedClient.value && !New.checked){
        selectedClient.style.borderColor ="red";
        selectedClient.focus();
     }else{
            //close modal
            var Close = document.getElementById("close");
            Close.click();
            //search tables headers 
            cellRows = 157;
            var found = false;
            var basicTime = "7:30";
            var startTime = From.value;
            var finalTime = To.options[To.selectedIndex].innerHTML;
            var allTimes = [];
            var count;
            var doubleBook;
            //Add data to the table
             //Table for Open Tasks
             var table = document.getElementById("dtBasicExample");
             var body = document.getElementById("bookingsTable");
             count= 0;
             doubleBook = false;
             //get beautician
             var headerIndex;
             for (let index = 0; index < cellColumns; index++) {
                 var newheader = document.getElementById("dtBasicExample").rows[0].cells[index].innerHTML;
                 var findheader = newheader.split('<span hidden="">');
                 header = findheader[0];
                 var beaut = Beautician.options[Beautician.selectedIndex].innerHTML;
                   if(beaut.toLowerCase() === header.toLowerCase()){
                     headerIndex = index;
                     break;
                   }
             }
                //search cells
                for (let x = 0; x < cellRows; x++) {
                    //set time by 30min each
                    var newtime = basicTime.split(":");
                    if(newtime[1] == "55" ){
                        var addHour = parseInt(newtime[0]) + 1;
                        basicTime = addHour + ":00";
                    }else{
                        var min = parseFloat(newtime[1]) + 5;
                        if(min ==5 ){
                            basicTime = newtime[0] + ":0" + min;
                        }else{
                            basicTime = newtime[0] + ":" + min;
                        }
                        //basicTime = newtime[0] + ":30";
                    }
                    if(startTime == basicTime){
                        found = true;
                    }
                    if(found){
                        var allocated = document.getElementById("dtBasicExample").rows[x+1].cells[headerIndex].innerHTML;
                        if(finalTime == basicTime){
                            if(allocated !=""){
                                doubleBook = true;
                                break;
                            }
                            allTimes[count] = basicTime;
                            break;
                        }
                        if(allocated !=""){
                            doubleBook = true;
                            break;
                        }
                        allTimes[count] = basicTime;
                        count++;
                    }
                }
                if (doubleBook){
                    closeDialogShowError("You cannot double book!");
                }else{
                    $("#progress").show();
                    //capture client first if it's a new client
                    //if adding a new client in the process
                    var New = document.getElementById("new");
                    if(New.checked){
                        var newName = document.getElementById("name");
                        var newSurname = document.getElementById("surname");
                        var newTitle = document.getElementById("title");
                        var newPhone = document.getElementById("cell");
                        if(!newName.value){
                            newName.style.borderColor ="red";
                            newName.focus();
                        }else if(!newSurname.value){
                            newSurname.style.borderColor ="red";
                            newSurname.focus();
                        }else if(!newPhone.value || newPhone.value.length < 10 || newPhone.value.substring(0,1)!="0"){
                            newPhone.style.borderColor ="red";
                            newPhone.focus();
                        }
                        var Close = document.getElementById("close");
                        Close.click();
                        var Count = 1;
                        var newClientDoc;
                        FireStoreDatabase.collection(selected_id+"_clients").get().then(function(querySnapshot) {
                            querySnapshot.forEach(function(doc) {
                                let items = doc.data();
                                /* Make data suitable for rendering */
                                var names = items.name;
                                Count++
                            })
                            //add data
                            FireStoreDatabase.collection(selected_id+"_clients").add({
                                date: getCurrentDate(),
                                time: getCurrentTime(),
                                file:Count,
                                title:newTitle.value,
                                name: newName.value,
                                surname: newSurname.value,
                                phone:newPhone.value,
                                status:"active",
                                incomplete:true,
                                startTime:startTime,
                                endtime:finalTime,
                            })
                            .then(function(docRef) {
                                //send Id to ID document
                                newClientId = docRef.id;
                                FireStoreDatabase.collection(selected_id+"_clients").doc(docRef.id).update({
                                    "document": docRef.id
                                })
                                //allocate bookings per schedule
                                //ammending
                                /*for (let index = 0; index < allTimes.length; index++) {
                                    if((index+1)== allTimes.length){
                                        bookPerTime(allTimes[index],true, newClientId);
                                    }else{
                                        bookPerTime(allTimes[index],false, newClientId);
                                    }
                                }*/
                                bookPerTime(true, newClientId);
                            })
                            .catch(function(error) {
                                //console.error("Error writing document: ", error);
                                closeDialogShowError(error);
                            });
                        })
                    }else{
                        //allocate bookings per schedule
                        //ammending
                        /*for (let index = 0; index < allTimes.length; index++) {
                            if((index+1)== allTimes.length){
                                bookPerTime(allTimes[index],true,"");
                            }else{
                                bookPerTime(allTimes[index],false,"");
                            }
                            
                        }*/
                        bookPerTime(true,"");

                    }
                }
            }
}
var newClientId;
//submit bookings per date
function bookPerTime(complete,newclientId){//(time,complete,newclientId){
    //Date value
    var newDate;
    //get values
    var selectedClient = document.getElementById("clientel");
    var Client = document.getElementById("client");
    var ClientId = document.getElementById("clienDoc");
    var Beautician = document.getElementById("beautician");
    var BeauticianId = document.getElementById("beauticianDoc");
    var Treatment = document.getElementById("treatment");
    var Category = document.getElementById("category");
    var Price = document.getElementById("price");
    var Duration = document.getElementById("duration");
    var ClientGender= document.getElementById("clienGender");
    var From = document.getElementById("from");
    var To = document.getElementById("to");
    var BookingDate = document.getElementById("date");
    //Booking times
    var startTime = From.value;
    var finalTime = To.options[To.selectedIndex].innerHTML;
    //determine client
    if (newclientId == ""){
        newclientId = ClientId.value;
    }
    newDate = BookingDate.value;
    //get documents
    var selected_id = localStorage.getItem("selected_id");//spa
    var client;
    var clientSex;
    var profile;
    var duration;
    //if it's a new client
    var New = document.getElementById("new");
    if(New.checked){
        var newName = document.getElementById("name");
        var newSurname = document.getElementById("surname");
        //setting new Name
        client = InitializeFirstLetter(newName.value)+" "+InitializeFirstLetter(newSurname.value);
        //for incomplete profile
        profile = false;
        // for gender
        var male = document.getElementById("male_beauti");
        if(male.checked){
            clientSex = "Male"
        }else{
            clientSex = "Female"
        }
        //ClientId.value = newClientId;
    }else{
        client = selectedClient.value; //Client.options[Client.selectedIndex].innerHTML;
        profile = true;
        clientSex =ClientGender.value;
    }
    //if it's a combo
    var category;
    var treatment;
    var Combo = document.getElementById("combo");
    if(Combo.checked){
        var treats = "";
        var Hours = 0;
        var price = 0
        var UL = document.getElementById("combos");
        category = "Combo";
        var ULsize = UL.getElementsByTagName("li");
        for (let index = 0; index < ULsize.length; index++) {
            var getTreats = ULsize[index].innerHTML.split(" : ");
            var getHours = getTreats[1].split(" ")
            treats+= getTreats[0]+" + ";
            Hours += parseFloat(getHours[0]);
            price +=parseInt(getHours[3]);
        }
        Price.value = "R "+price;
        treatment = treats.substring(0,treats.length - 3);
        duration = Hours;
        var Hour = Hours+"";
        var newTime = Hour.split(".");
        var newHours = newTime[0];
        var newMinutes = newTime[1];
        var InitialTime = startTime.split(":");
        var InitialHour = parseInt(InitialTime[0]);
        var InitialMinutes = parseInt(InitialTime[1]);
        if(!newMinutes){
            var finalHour = parseInt(InitialHour) + parseInt(Hours);
            if(InitialMinutes<10){
                finalTime = finalHour +":0"+ InitialMinutes;
            }else{
                finalTime = finalHour +":"+ InitialMinutes;
            }
        }else{
            var myMin = "0."+newMinutes;
            var newMin = parseInt(myMin*60);
            var finalMinute = parseInt(newMin) + parseInt(InitialMinutes);
            var fMin = finalMinute + "";
            var getRemainder = fMin.split(".");
            var finalHour = parseInt(InitialHour) + parseInt(newHours);
            //check if minutes are an hour
            if(finalMinute>= 60){
                finalHour += parseInt(finalMinute / 60)
                finalMinute = finalMinute % 60;
            }
                if(finalMinute<10){
                    finalTime = finalHour +":0"+finalMinute;
                }else{
                    finalTime = finalHour +":"+finalMinute;
                }
            /*if(!getRemainder[1]){
                var finalHour = parseInt(InitialHour) + parseInt(newHours);
                if(getRemainder[0].length<1){
                    finalTime = finalHour +":0"+getRemainder[0];
                }else{
                    finalTime = finalHour +":"+getRemainder[0];
                }
            }else{
                var finalHour = parseInt(InitialHour) + parseInt(newHours) ;
                alert(InitialHour);
                alert(Hours);
                alert(getRemainder[0]);
                alert(finalHour);
                var min = parseInt(getRemainder[1])+parseInt(InitialMinutes);
                if(getRemainder[1].length<1){
                    finalTime = finalHour +":0"+min;
                }else{
                    finalTime = finalHour +":"+min;
                }
            }*/

        }   
    }else{
        category = Category.options[Category.selectedIndex].innerHTML;
        treatment = Treatment.options[Treatment.selectedIndex].innerHTML;
        duration = Duration.value;
    }
    //add data
    /*FireStoreDatabase.collection(selected_id+"_"+BookingDate.value).add({
        date: getCurrentDate(),
        time: time,
        defaultDuration: Duration.value,
        beauticianName: Beautician.options[Beautician.selectedIndex].innerHTML,
        beauticianId:BeauticianId.value,
        clientName: Client.options[Client.selectedIndex].innerHTML,
        clientId: ClientId.value,
        clientGender:ClientGender.value,
        treatment:Treatment.options[Treatment.selectedIndex].innerHTML,
        amount:Price.value,
        cancelled:false
    })*/
    //make a booking
    //Check booking slots
    var finalBookingDate = new Date(getCurrentDate().replace(/\//g,'-')+" 21:00:00");
    var treatmentDate = new Date(getCurrentDate().replace(/\//g,'-')+" "+finalTime+":00")
    if(treatmentDate.getTime() <= finalBookingDate.getTime()){
        $(document).ready(
            function(){
                FireStoreDatabase.collection(selected_id+"_bookings").add({
                submissionDate:getCurrentDate(),
                submissionTime:getCurrentTime(),
                cancelled:false,
                date: BookingDate.value,
                //time: time,
                defaultDuration: duration,
                beauticianName: Beautician.options[Beautician.selectedIndex].innerHTML,
                beauticianId:BeautId[Beautician.selectedIndex],
                clientName: client,
                clientId: newclientId,//ClientId.value,
                clientGender:clientSex,
                clientProfile:profile,
                treatment:treatment,
                category:category,
                amount:Price.value,
                startTime:startTime,
                endtime:finalTime
            })
            .then(function(docRef) {
                FireStoreDatabase.collection(selected_id+"_bookings").doc(docRef.id).update({
                    "document": docRef.id
                })
                if(complete){
                    //var Bookings = document.getElementById("viewbookings");
                    //Bookings.click();
                    $(document).ready(
                        function(){
                            $("#progress").hide();
                            BookingDate.value = newDate;
                            selectBookingDate();        
                    });
                }else{
                    $("#progress").hide();
                }
                
            })
            .catch(function(error) {
                //console.error("Error writing document: ", error);
                closeDialogShowError(error);
                $("#progress").hide();
            });
        });
    }else{
        closeDialogShowError("The booking you're trying to make is beyond the 21:00 schedule");
    }
}
// cancel a certain booking
function cancelBooking(){
    var newDate;
    //close modal
    var CloseModal = document.getElementById("closes");
    CloseModal.click();
    //show dialog
    $("#progress").show();
    //date value
    var BookingDate = document.getElementById("date");
    //date value
    var docRef = document.getElementById("documents");
    //get documents
    var selected_id = localStorage.getItem("selected_id");//spa
    //set cancelled to true
    newDate = BookingDate.value;
    //table
    var column = docRef.value.split("~");
    var Document = column[0];
    var From = column[3];
    var To = column[2];
    var client = document.getElementById("clients").value;
    var treatment = document.getElementById("treatments").value;
    var closeTime = false;
    FireStoreDatabase.collection(selected_id+"_bookings").doc(Document).update({
        cancelled : true,
        cancelledDate : getCurrentDate(),
        cancelledTime : getCurrentTime()
    })
    .then(function() {
    //console.log("Document successfully updated!");
        $("#progress").hide();
        var Bookings = document.getElementById("viewbookings");
        Bookings.click();
        $(document).ready(
            function(){
                BookingDate.value = newDate;
                closeTime = false;   
            });
    })
    .catch(function(error) {
    //console.error("Error writing document: ", error);
        $("#progress").hide();
        closeDialogShowError(error);
    });

    /*old modified version
    var newColumn = document.getElementById("dtBasicExample").rows[index+1].cells[column[1]].innerHTML;
    var end_To = document.getElementById("dtBasicExample").rows[index+1].cells[0].innerHTML;
    if(newColumn){
        var findName = newColumn.split("<br>");
        var Name = findName[0];
        var Treatment = findName[1];
        var RemoveGreather = findName[2].split(">");
        var RemoveSmaller = RemoveGreather[1].split("<");
        var SearchDocument = RemoveSmaller[0].split("~");
        var Document = SearchDocument[0];
        var from = SearchDocument[1];
        var to = SearchDocument[2];
        if(client == Name && treatment == Treatment && From == from && To == to){
                //check for last entry
            if(end_To == To){
                closeTime = true;
                console.log("the same at",end_To);
            }
            FireStoreDatabase.collection(selected_id+"_bookings").doc(Document).update({
                cancelled : true,
                cancelledDate : getCurrentDate(),
                cancelledTime : getCurrentTime()
            })
            .then(function() {
            //console.log("Document successfully updated!");
                if(closeTime == true){
                    $("#progress").hide();
                    var Bookings = document.getElementById("viewbookings");
                    Bookings.click();
                    $(document).ready(
                        function(){
                            BookingDate.value = newDate;
                            closeTime = false;   
                    });
                }
            })
            .catch(function(error) {
            //console.error("Error writing document: ", error);
                closeDialogShowError(error);
            });
        }
    }*/
        /*FireStoreDatabase.collection(selected_id+"_bookings").doc(docRef.value).update({
            cancelled : true,
            cancelledDate : getCurrentDate(),
            cancelledTime : getCurrentTime()
        })
        .then(function() {
            //console.log("Document successfully updated!");
            $("#progress").hide();
            var Bookings = document.getElementById("viewbookings");
            Bookings.click();
            $(document).ready(
                function(){
                    BookingDate.value = newDate;      
            }); 
        })
        .catch(function(error) {
        //console.error("Error writing document: ", error);
        closeDialogShowError(error);
        });*/


}
//###################@@@@@@@@@@@@@@@@@@@@#!#!#!#!#!  EDiT SECTION  #!#!#!#!#!###################@@@@@@@@@@@@@@@@@@@@
//function to modify a certain booking
var comboDuration;
var selectedBooking;
function editBooking(){
    //get documents
    var selected_id = localStorage.getItem("selected_id");//spa
    //get all values
    var newDate = document.getElementById("e_date");
    var newTherapist = document.getElementById("e_beautician");
    var newTherapistDoc = document.getElementById("e_beauticianDoc");
    var newFrom = document.getElementById("e_from");
    var newTo = document.getElementById("e_to");
    var getDocument = document.getElementById("documents");
    var newDuration = document.getElementById("duration_");
    var getDoc = getDocument.value.split("~");
    var newDocument = getDoc[0];
    //check for Double Bookings
    //first get Therapist
    var headerName;
    var headerDoc;
    var headerIndex;
    var Columns = document.getElementById("dtBasicExample").rows[0].cells.length;
    for (let index = 0; index < Columns; index++) {
        var Header = document.getElementById("dtBasicExample").rows[0].cells[index].innerHTML;
        var getHeader = Header.split('<span hidden="">');
        var TherapistHeader = getHeader[0];
        if(getHeader[1]){
            var getDocument = getHeader[1].split("</");
            if(newTherapist[newTherapist.selectedIndex].innerHTML == TherapistHeader){
                headerName = TherapistHeader;
                headerIndex = index;
                headerDoc = getDocument[0];
                break;
            }
        }
        
    }
    //Identify if he's already booked for that requested time
    var cellRows = 157;
    var found = false;
    var allowed = false;
    for (let index = 0; index < cellRows; index++) {
        var searchTime = document.getElementById("dtBasicExample").rows[index+1].cells[0].innerHTML;
        var startSearch = document.getElementById("dtBasicExample").rows[index+1].cells[headerIndex].innerHTML;
        if(searchTime == newFrom[newFrom.selectedIndex].innerHTML){
            found = true;
        }
        if(found){
            if(startSearch != "" && startSearch != selectedBooking){
                allowed = false;
                closeDialogShowError("You cannot double book!");
                break;
            }else if(newTo.value == searchTime){
                allowed = true;
                found = false;
                break;
            }

        }
        
    }

    if (allowed){
        //close modal
        var Close = document.getElementById("closes");
        Close.click();
        //show progress
        $("#progress").show();
        var selectedDate = document.getElementById("date");
        var updateNow = 'StatusUpdateTime_'+getCurrentDate().replace(/\//g,'-')+"_"+getCurrentTime();
        var SameTreat = document.getElementById("sameTreatment");
        var editTreat = document.getElementById("editTreatment");
        var designTreat = document.getElementById("designTreatment");
        if(editTreat.checked == true){
            var Cat = document.getElementById("category_");
            var Treat = document.getElementById("treatment_");
            var Price = document.getElementById("price_");
            //set editted booking on for editted type
            FireStoreDatabase.collection(selected_id+"_bookings").doc(newDocument).update({
                defaultDuration: newDuration.value,
                category:Cat[Cat.selectedIndex].innerHTML,
                treatment:Treat[Treat.selectedIndex].innerHTML,
                date:newDate.value,
                [updateNow]:true,
                beauticianName:newTherapist[newTherapist.selectedIndex].innerHTML,
                beauticianId:newTherapistDoc.value,
                endtime:newTo.value,
                startTime:newFrom[newFrom.selectedIndex].innerHTML,
                amount:Price.value,
            })
            .then(function() {
                var Bookings = document.getElementById("viewbookings");
                Bookings.click();
                $(document).ready(
                    function(){
                        setTimeout(function () {
                            $("#progress").hide();
                            var isSet = false;
                            while (!isSet) {
                                var myDate = document.getElementById("date");
                                myDate.value = newDate.value;
                                if(selectedDate.value == myDate.value){
                                    isSet = true;
                                }
                            }
                            
                        }, 555);                    
                });
            })
            .catch(function(error) {
                closeDialogShowError("error :"+error.code + " : " + error);
            });
    
        }else if(designTreat.checked == true){
        var Cat = document.getElementById("category_");
        var Treat = document.getElementById("treatment_");
        var Price = document.getElementById("price_");
        var From = document.getElementById("e_from");
        var Combo = document.getElementById("combo");
        var startTime = From.options[From.selectedIndex].innerHTML;
        var treats = "";
        var Hours = 0;
        var price = 0
        var UL = document.getElementById("combos_");
        var category = "Combo";
        var ULsize = UL.getElementsByTagName("li");
        for (let index = 0; index < ULsize.length; index++) {
            var getTreats = ULsize[index].innerHTML.split(" : ");
            var getHours = getTreats[1].split(" ")
            treats+= getTreats[0]+" + ";
            Hours += parseFloat(getHours[0]);
            price +=parseInt(getHours[3]);
        }
        Price.value = "R "+price;
        var treatment = treats.substring(0,treats.length - 3);
        var Hour = Hours+"";
        var newTime = Hour.split(".");
        var newHours = newTime[0];
        var newMinutes = newTime[1];
        var InitialTime = startTime.split(":");
        var InitialHour = parseInt(InitialTime[0]);
        var InitialMinutes = parseInt(InitialTime[1]);
        if(!newMinutes){
            var finalHour = parseInt(InitialHour) + parseInt(Hours);
            if(InitialMinutes<10){
                finalTime = finalHour +":0"+ InitialMinutes;
            }else{
                finalTime = finalHour +":"+ InitialMinutes;
            }
        }else{
            var myMin = "0."+newMinutes;
            var newMin = parseInt(myMin*60);
            var finalMinute = parseInt(newMin) + parseInt(InitialMinutes);
            var fMin = finalMinute + "";
            var getRemainder = fMin.split(".");
            var finalHour = parseInt(InitialHour) + parseInt(newHours);
            //check if minutes are an hour
            if(finalMinute>= 60){
                finalHour += parseInt(finalMinute / 60)
                finalMinute = finalMinute % 60;
            }
                if(finalMinute<10){
                    finalTime = finalHour +":0"+finalMinute;
                }else{
                    finalTime = finalHour +":"+finalMinute;
                }
        }
        //set editted booking on for combo type
        FireStoreDatabase.collection(selected_id+"_bookings").doc(newDocument).update({
                defaultDuration: comboDuration,
                category:category,
                treatment:treatment,
                date:newDate.value,
                [updateNow]:true,
                beauticianName:newTherapist[newTherapist.selectedIndex].innerHTML,
                beauticianId:newTherapistDoc.value,
                endtime:newTo.value,
                startTime:newFrom[newFrom.selectedIndex].innerHTML,
                amount:Price.value,
            })
            .then(function() {
                var Bookings = document.getElementById("viewbookings");
                Bookings.click();
                $(document).ready(
                    function(){
                        setTimeout(function () {
                            $("#progress").hide();
                            var isSet = false;
                            while (!isSet) {
                                var myDate = document.getElementById("date");
                                myDate.value = newDate.value;
                                if(selectedDate.value == myDate.value){
                                    isSet = true;
                                }
                            }                            
                        }, 555);
                });
            })
            .catch(function(error) {
                closeDialogShowError("error :"+error.code + " : " + error);
            });

        }else{
            //set editted booking on for same type
            FireStoreDatabase.collection(selected_id+"_bookings").doc(newDocument).update({
                date:newDate.value,
                [updateNow]:true,
                beauticianName:newTherapist[newTherapist.selectedIndex].innerHTML,
                beauticianId:newTherapistDoc.value,
                endtime:newTo.value,
                startTime:newFrom[newFrom.selectedIndex].innerHTML,
            })
            .then(function() {
                selectedDate.value = getCurrentDate().replace(/\//g,'-');
                var Bookings = document.getElementById("viewbookings");
                Bookings.click();
                $(document).ready(
                    function(){
                        setTimeout(function () {
                            $("#progress").hide();
                            if(selectedDate.value != newDate.value){
                                var myDate = document.getElementById("date");
                                myDate.value = newDate.value;
                            }
                            
                        }, 555);
                });
            })
            .catch(function(error) {
                closeDialogShowError("error :"+error.code + " : " + error);
            });
        }
    }


}
//set all treaments to the edit table
var TreatDuration_;
var TreatPrice_;
var Category_ = [];
//set treatments to the list
function setTreatment_(time, Dur){
    console.log(Dur);
    TreatDuration_ = [];
    TreatPrice_ = [];
    var count = 0;
    var Duration;
    //categories
    Category_ = [];
    var catcount = 0;
     //get documents
     var selected_id = localStorage.getItem("selected_id");//spa
     //clear all
     $("#treatment_").empty();
     $("#category_").empty();
     FireStoreDatabase.collection(selected_id+"_services").get().then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
             let items = doc.data();
             /* Make data suitable for rendering */
             var name = items.name;
             var duration = items.duration;
             var amount = items.amount;
             var description = items.description;
             /*/get clients object
             var Treatment = document.getElementById("treatment");
             //create lists
             var opt = document.createElement('option');
             opt.value = count;
             opt.innerHTML = InitializeFirstLetter(name);
             opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
             Treatment.appendChild(opt);
             TreatDuration[count] = duration;
             TreatPrice[count] = "R "+amount;*/
             //group all categories

             var categories = document.getElementById("category_");
             //var categories = document.getElementById("treatments");
             var found = false;
             for (let index = 0; index < Category_.length; index++) {
                 if(Category_[index].toLowerCase() == name.toLowerCase()){
                    found = true;
                    break;
                 }
             }

            var Available = new Boolean(found);
            if(Available == false){
                Category_[catcount] = name;
                var Opt = document.createElement('option');
                Opt.value = count;
                Opt.innerHTML = InitializeFirstLetter(name);
                Opt.onchange = (function (name){return function(){setTreatmentCategory_(name);}})(name);
                categories.appendChild(Opt);
                catcount++;
            }
            //add all treament values
            if(Category_[0].toLowerCase() == name.toLowerCase()){
                var Treatment = document.getElementById("treatment_");
                //create lists
                var opt = document.createElement('option');
                opt.value = count;
                opt.innerHTML = InitializeFirstLetter(description);
                opt.onchange = (function (doc){return function(){setTreatmentDocument_(doc);}})(doc);
                Treatment.appendChild(opt);
            }
             if(count ==0){
                var Treatment = document.getElementById("duration_");
                var From = document.getElementById("e_from");
                var Price = document.getElementById("price_");
                Treatment.value = duration;
                From.selectedIndex = From.value;
                //From.value = time;
                Price.value = "R "+amount;
                if(Dur !=""){
                    Duration = Dur;
                }else{
                    Duration = duration;
                }
             }
             count++;
         });
            durationTo_(time,Duration);
     });

}
//set duration To for bookings on editBookings
function durationTo_(time,selectedDuration){
    var count = 0;
    var basicTime = "8:00";
    var newDuration = parseInt(selectedDuration * 12);
    var finalDuration = parseInt(selectedDuration * 12);
    var TreatmentTo = document.getElementById("e_to");
    var From = document.getElementById("e_from");
    var newDew = ""+selectedDuration;
    var target = newDew.split(".");
    var targetFrom = From.options[From.selectedIndex].innerHTML.split(":");
    var hour = target[0];
    var minute = target[1];
    var Thour = targetFrom[0];
    var Tminute = targetFrom[1];
    var To = "0";
    //calculate Time
    var Hours = parseFloat(selectedDuration) +  parseFloat(Thour);
    var Hour = Hours+"";
    var newTime = Hour.split(".");
    var newHours = newTime[0];
    var newMinutes = newTime[1];
    var InitialTime = From.options[From.selectedIndex].innerHTML.split(":");
    var InitialHour = parseInt(InitialTime[0]);
    var InitialMinutes = parseInt(InitialTime[1]);
    var finalTime = "00:00";
    if(!newMinutes){
        var finalHour = Hours;
        if(InitialMinutes<10){
            finalTime = finalHour +":0"+ InitialMinutes;
        }else{
            finalTime = finalHour +":"+ InitialMinutes;
        }
    }else{
        var myMin = "0."+newMinutes;
        var newMin = parseInt(myMin*60);
        var finalMinute = newMin;
        var fMin = finalMinute + "";
        var getRemainder = fMin.split(".");
        var finalHour = InitialHour;
        //check if minutes are an hour
        if(finalMinute>= 60){
            finalHour += parseInt(finalMinute / 60)
            finalMinute = finalMinute % 60;
        }
        if(finalMinute<10){
            finalTime = finalHour +":0"+finalMinute;
        }else{
            finalTime = finalHour +":"+finalMinute;
        }
    }
    TreatmentTo.value = "";
    TreatmentTo.value = finalTime;

    
}
//set Treatments when Category is chosen on edit
function setTreatmentCategory_(event){
    var Categories = document.getElementById("category_");
    var Cat = document.getElementById("treatments");//Category_[this.selectedIndex];
    var count = 0;
    var timeDuration = [];
    $("#treatment_").empty();
    //get documents
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_services").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var name = items.name;
            var duration = items.duration;
            var amount = items.amount;
            var description = items.description;
            if(name.toLowerCase() == Categories.options[Categories.selectedIndex].innerHTML.toLowerCase()){
                //get clients object
                var Treatment = document.getElementById("treatment_");
                //create lists
                var opt = document.createElement('option');
                opt.value = count;
                opt.innerHTML = InitializeFirstLetter(description);
                //opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
                Treatment.appendChild(opt);
                TreatDuration_[count] = duration;
                TreatPrice_[count] = "R "+amount;
                //set initial values
                if(count ==0){
                    var Treatment = document.getElementById("duration_");
                    var From = document.getElementById("e_from");
                    var Price = document.getElementById("price_");
                    Treatment.value = duration;
                    From.selectedIndex = From.value;
                    //From.value = time;
                    Price.value = "R "+amount;
                 }
                 timeDuration[count] = parseFloat(items.duration);
                 count++;
             }
        });
        //set Time
        var From = document.getElementById("e_from");
        durationTo_(From.options[From.selectedIndex].innerHTML,parseFloat(timeDuration[0]));
    });

}
//set document when client is chosen for edit booking
function setTreatmentDocument_(event){
    var count = 0;
    var TreatmentTo = document.getElementById("e_to");
    var TreatmentFrom = document.getElementById("e_from");
    var TreatmentDuration = document.getElementById("duration_");
    var TreatmentPrice = document.getElementById("price_");
    TreatmentDuration.value = TreatDuration_[this.selectedIndex];
    TreatmentPrice.value = TreatPrice_[this.selectedIndex];
    //var Duration = TreatDuration[this.selectedIndex];
    //var Price = TreatPrice[this.selectedIndex];
    var newDuration = TreatmentDuration.value.split(".");
    var Hours = newDuration[0];
    var Min = newDuration[1];
    var getFrom = TreatmentFrom.options[TreatmentFrom.selectedIndex].innerHTML.split(":");
    var fromHour = getFrom[0];
    var fromMin =getFrom[1];
    var finalHour = parseInt(Hours)+parseInt(fromHour);
    var finalTime;
    if (Min){
        var newMin = "0."+Min;
        var finalMin = newMin * 60;
        var DetermineHour = parseInt(finalMin) + parseInt(fromMin);
        if(DetermineHour >= 60){
            finalHour+=1;
            finalMin = DetermineHour - 60;
            if(finalMin == 0){
                finalMin = "00";
            }
        }else{
            finalMin = DetermineHour;
        }
        finalTime = finalHour+":"+finalMin;
    }else{

        finalTime = finalHour+":"+fromMin;
    }
    var found = false;
    for (let index = 0; index < cellRows; index++) {
        var tableTime = document.getElementById("dtBasicExample").rows[index+1].cells[0].innerHTML;
        if(tableTime == finalTime){
            found = true;
        }
        if(found){
            //get To object
            var To = document.getElementById("e_to");
            //create lists
            var opt = document.createElement('option');
            opt.value = index;
            opt.innerHTML = tableTime;
            //opt.onchange = (function (doc){return function(){setTreatmentDocument(doc);}})(doc);
            To.appendChild(opt);

        }

    }
    TreatmentTo.value = finalTime;

}
//function to add Treatments to list of Combos when aditing a booking
function addToList_(){
    var Treatment = document.getElementById("treatment_");
    var Category = document.getElementById("category_");
    var Duration = document.getElementById("duration_");
    var Price = document.getElementById("price_");
    var From = document.getElementById("e_from");
    var Column = Treatment.options[Treatment.selectedIndex].innerHTML;
    var UL = document.getElementById("combos_");
    var ULsize = UL.getElementsByTagName("li").length
    var total = parseInt(ULsize);
    var Li = document.createElement("li");
    var Span = document.createElement("span");
    var To = document.getElementById("e_to");
    Span.className = "badge badge-pill badge-danger";
    Span.innerHTML = "X";
    Span.id = "for_"+total
    Span.style.cursor = "pointer";
    Span.value = total;
    Span.addEventListener("click",function(event){
        var UL = document.getElementById("combos_");
        var AllUL = UL.getElementsByTagName("li");
        var getId = event.target.id.split("_");
        var Id = getId[1];
        for (var i = 0; i < AllUL.length; i++) {
            if(AllUL[i].id == Id){
                UL.removeChild(UL.childNodes[i])
                //Calculate List values
                var comboLabel = document.getElementById("comboLabel_");
                var UL = document.getElementById("combos_");
                var price = 0;
                var ULsize = UL.getElementsByTagName("li");
                for (let index = 0; index < ULsize.length; index++) {
                    var getTreats = ULsize[index].innerHTML.split(" : ");
                    var getHours = getTreats[1].split(" ")
                    price +=parseInt(getHours[3]);
                }
                comboLabel.innerHTML = "List of treatments (Combo)<font color = 'red'> *  </font>      R "+price;
                break;
            }
        }
    });
    Li.innerHTML = Treatment.options[Treatment.selectedIndex].innerHTML +" : "+Duration.value+" Hours&nbsp;&nbsp;&nbsp;&nbsp"+Price.value+" &nbsp;&nbsp;&nbsp;&nbsp";
    Li.id = total;
    Li.appendChild(Span);
    UL.appendChild(Li);
    //Calculate List values
    var comboLabel = document.getElementById("comboLabel_");
    var UL = document.getElementById("combos_");
    var price = 0;
    var Hours = 0;
    var ULsize = UL.getElementsByTagName("li");
        for (let index = 0; index < ULsize.length; index++) {
            var getTreats = ULsize[index].innerHTML.split(" : ");
            var getHours = getTreats[1].split(" ")
            price +=parseInt(getHours[3]);
            Hours += parseFloat(getHours[0]);
        }
        //assign combo duration variable
        comboDuration = Hours;
    //calculate Time
        var Hour = Hours+"";
        var newTime = Hour.split(".");
        var newHours = newTime[0];
        var newMinutes = newTime[1];
        var InitialTime = From.options[From.selectedIndex].innerHTML.split(":");
        var InitialHour = parseInt(InitialTime[0]);
        var InitialMinutes = parseInt(InitialTime[1]);
        var finalTime = "00:00";
        if(!newMinutes){
            var finalHour = parseInt(InitialHour) + parseInt(Hours);
            if(InitialMinutes<10){
                finalTime = finalHour +":0"+ InitialMinutes;
            }else{
                finalTime = finalHour +":"+ InitialMinutes;
            }
        }else{
            var myMin = "0."+newMinutes;
            var newMin = parseInt(myMin*60);
            var finalMinute = parseInt(newMin) + parseInt(InitialMinutes);
            var fMin = finalMinute + "";
            var getRemainder = fMin.split(".");
            var finalHour = parseInt(InitialHour) + parseInt(newHours);
            //check if minutes are an hour
            if(finalMinute>= 60){
                finalHour += parseInt(finalMinute / 60)
                finalMinute = finalMinute % 60;
            }
            if(finalMinute<10){
                finalTime = finalHour +":0"+finalMinute;
            }else{
                finalTime = finalHour +":"+finalMinute;
            }
        }
        To.value = finalTime;
    comboLabel.innerHTML = "List of treatments (Combo)<font color = 'red'> *  </font>      R "+price;
}

//function to add Treatments to list of Combos for an initial booking
function addToList(){
    var Treatment = document.getElementById("treatment");
    var Category = document.getElementById("category");
    var Duration = document.getElementById("duration");
    var Price = document.getElementById("price");
    var From = document.getElementById("from");
    var Column = Treatment.options[Treatment.selectedIndex].innerHTML;
    var UL = document.getElementById("combos");
    var ULsize = UL.getElementsByTagName("li").length
    var total = parseInt(ULsize);
    var Li = document.createElement("li");
    var Span = document.createElement("span");
    var To = document.getElementById("to");
    Span.className = "badge badge-pill badge-danger";
    Span.innerHTML = "X";
    Span.id = "for_"+total
    Span.style.cursor = "pointer";
    Span.value = total;
    Span.addEventListener("click",function(event){
        var UL = document.getElementById("combos");
        var AllUL = UL.getElementsByTagName("li");
        var getId = event.target.id.split("_");
        var Id = getId[1];
        for (var i = 0; i < AllUL.length; i++) {
            if(AllUL[i].id == Id){
                UL.removeChild(UL.childNodes[i])
                //Calculate List values
                var comboLabel = document.getElementById("comboLabel");
                var UL = document.getElementById("combos");
                var price = 0;
                var ULsize = UL.getElementsByTagName("li");
                for (let index = 0; index < ULsize.length; index++) {
                    var getTreats = ULsize[index].innerHTML.split(" : ");
                    var getHours = getTreats[1].split(" ")
                    price +=parseInt(getHours[3]);
                }
                comboLabel.innerHTML = "List of treatments (Combo)<font color = 'red'> *  </font>      R "+price;
                break;
            }
        }
    });
    Li.innerHTML = Treatment.options[Treatment.selectedIndex].innerHTML +" : "+Duration.value+" Hours&nbsp;&nbsp;&nbsp;&nbsp "+Price.value+" &nbsp;&nbsp;&nbsp;&nbsp";
    Li.id = total;
    Li.appendChild(Span);
    UL.appendChild(Li);
    //Calculate List values
    var comboLabel = document.getElementById("comboLabel");
    var UL = document.getElementById("combos");
    var price = 0;
    var Hours = 0;
    var ULsize = UL.getElementsByTagName("li");
        for (let index = 0; index < ULsize.length; index++) {
            var getTreats = ULsize[index].innerHTML.split(" : ");
            var getHours = getTreats[1].split(" ")
            price +=parseFloat(getHours[3]);
            Hours += parseFloat(getHours[0]);
        }
    //calculate Time
        var Hour = Hours+"";
        var newTime = Hour.split(".");
        var newHours = newTime[0];
        var newMinutes = newTime[1];
        var InitialTime = From.value.split(":");
        var InitialHour = parseInt(InitialTime[0]);
        var InitialMinutes = parseInt(InitialTime[1]);
        var finalTime = "00:00";
        if(!newMinutes){
            var finalHour = parseInt(InitialHour) + parseInt(Hours);
            if(InitialMinutes<10){
                finalTime = finalHour +":0"+ InitialMinutes;
            }else{
                finalTime = finalHour +":"+ InitialMinutes;
            }
        }else{
            var myMin = "0."+newMinutes;
            var newMin = parseInt(myMin*60);
            var finalMinute = parseInt(newMin) + parseInt(InitialMinutes);
            var fMin = finalMinute + "";
            var getRemainder = fMin.split(".");
            var finalHour = parseInt(InitialHour) + parseInt(newHours);
            //check if minutes are an hour
            if(finalMinute>= 60){
                finalHour += parseInt(finalMinute / 60)
                finalMinute = finalMinute % 60;
            }
            if(finalMinute<10){
                finalTime = finalHour +":0"+finalMinute;
            }else{
                finalTime = finalHour +":"+finalMinute;
            }
        }
        var Tosize = To.getElementsByTagName("option");
        var start = 0;
        for (let index = 0; index < Tosize.length; index++) {
            if(index == 0){
                start = To.value;
            }
            if(To.options[index].innerHTML == finalTime){
                To.selectedIndex = index;
                break;
            }            
        }
    comboLabel.innerHTML = "List of treatments (Combo)<font color = 'red'> *  </font>      R "+price;
}

//services section ssssssssssssssssssssssssss------------------------+++++++++++

//show service recording page /services
function serviceRegistration(){
    $(document).ready(function(){
        $('#dialogService').modal('show');
    });
}
//Access services's information
function viewServices(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/services.html",function(){
        $(document).ready(
            function(){
                setServicesToDataTable();
        });
    });
}
// set services to the DataTable
function setServicesToDataTable(){
    //get documents
    var count = 0;
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_services").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var name = items.name;
            var description = items.description;
            var time = items.duration +" hours";
            var Document = items.document;
            var Status = items.status;
            var Amount = items.amount;
            //Add data to the table
            //Table for Open Tasks
            var table = document.getElementById("dtBasicExample");
            var body = document.getElementById("servicesTable");
            //create a row
            var row = body.insertRow(count);
            //insert cells
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);

            // Add some text to the new cells:
            cell1.innerHTML = InitializeFirstLetter(name);
            cell2.innerHTML = description;
            cell3.innerHTML = time;
            cell4.innerHTML = "R " + Amount;
            //cell5.innerHTML = Age; calculating age
            //cell6.innerHTML = Status;medicalAid
            //activate/deactivate button
            var btn = document.createElement('input');
            btn.type = "button";
            btn.style.backgroundColor = "grey";
            btn.style.color = "white";
            btn.style.borderColor = "blue";
            btn.style.marginRight = "80%";
            btn.style.marginLeft = "20%";
            btn.className = "btn";
            if (Status == "active"){
                btn.style.backgroundColor = "red";
                btn.value = "Suspend";
             }else{
                btn.style.backgroundColor = "green";
                btn.value = "Activate";
            }
            btn.onclick = (function (Document,Status){return function(){ammendServiceStatus(Document,Status);}})(Document,Status);
            cell5.appendChild(btn);
            //view Ammend button
            var btns = document.createElement('input');
            btns.type = "button";
            btns.style.backgroundColor = "grey";
            btns.style.color = "white";
            btns.style.borderColor = "blue";
            btns.style.marginRight = "80%";
            btns.style.marginLeft = "20%";
            btns.className = "btn";
            btns.value = "View";
            btns.onclick = (function (items){return function(){viewService(items);}})(items);
            cell6.appendChild(btns);


            count++;
        });
        $('#dtBasicExample').DataTable();
    });

}
var serviceDocument;
var serviceDescription;
// function to view current service information
function viewService(items){
    $(document).ready(function(){
        $('#dialogAmmendService').modal('show');
        //get values
        var newTreatmentName = document.getElementById("names");
        var newTreatmentDescription = document.getElementById("treatments");
        var newHours = document.getElementById("hour");
        var newAmount = document.getElementById("amounts");
        newTreatmentName.value = items.name;
        newTreatmentDescription.value = items.description;
        newHours.value = items.duration;
        newAmount.value = items.amount;
        serviceDocument = items.document;
        serviceDescription = items.description;
    });

}
// function to update a service
function ammendServiceInfo(){
    $(document).ready(function(){
        $('#dialogAmmendService').modal('show');
        //get documents
        var selected_id = localStorage.getItem("selected_id");//spa
        //get values
        var newTreatmentName = document.getElementById("names");
        var newTreatmentDescription = document.getElementById("treatments");
        var newHours = document.getElementById("hour");
        var newAmount = document.getElementById("amounts");
        if(!newTreatmentDescription.value){
        newTreatmentDescription.style.borderColor ="red";
        newTreatmentDescription.focus();
        }else if(!isNumber(newAmount.value)){
            newAmount.style.borderColor ="red";
            newAmount.focus();
        }else{
            var Close = document.getElementById("closed");
            Close.click();
            $("#progress").show();
            var updateNow = 'profileupdateTime_'+getCurrentDate().replace(/\//g,'-');
            var ammendDesc = 'previousDescription_'+getCurrentDate().replace(/\//g,'-')+"_"+getCurrentTime().replace(/:/g,'-');
            FireStoreDatabase.collection(selected_id+"_services").doc(serviceDocument).update({
                amount:newAmount.value,
                description: newTreatmentDescription.value,
                duration:newHours.value,
                [updateNow]:getCurrentTime(),
                [ammendDesc]:serviceDescription,
            })
            .then(function() {
                $(document).ready(function(){
                    //console.log("Document successfully updated!");
                    $("#progress").hide();
                    var Services = document.getElementById("viewservices");
                    Services.click(); 
                    closeDialogShowSuccess();                    
                });
            })
            .catch(function(error) {
                $("#progress").hide();
                //console.error("Error writing document: ", error);
                closeDialogShowError(error);
            });

        }
    });

}
// function to change beautician's Status
function ammendServiceStatus(Doc,status){
    $("#progress").show();
    //get stored patient information
    var selected_id = localStorage.getItem("selected_id");//dr
    //switch statuses
    var newStatus = "";
    if(status == "active"){
        newStatus = "inactive";
    }else{
        newStatus = "active";
    }
    //initialize db
    var db = "";
    db = FireStoreDatabase;
    var docRef = db.collection(selected_id+"_services").doc(Doc);
    var updateNow = 'StatusUpdateTime_'+getCurrentDate().replace(/\//g,'-')+"_"+getCurrentTime();
    //update
    return docRef.update({
        //update status
        [updateNow]:true,
        status:newStatus
    })
    .then(function() {
        $("#progress").hide();
        //click View Services link
        var Services = document.getElementById("viewservices");
        Services.click();
        closeDialogShowSuccess();
        //console.log("Document successfully updated!");
    })
    .catch(function(error) {
        $("#progress").hide();
        // The document probably doesn't exist.
        //console.error("Error updating document: ", error);
        closeDialogShowError(error);
    });
}
//function to add treatments
function addTreatment(){
     //get documents
     var selected_id = localStorage.getItem("selected_id");//spa
     //get values
     var newTreatmentName = document.getElementById("name");
     var newTreatmentDescription = document.getElementById("treatment");
     var newHours = document.getElementById("hours");
     var newAmount = document.getElementById("amount");
     if(!newTreatmentName.value){
        newTreatmentName.style.borderColor ="red";
        newTreatmentName.focus();
     }else if(!newTreatmentDescription.value){
        newTreatmentDescription.style.borderColor ="red";
        newTreatmentDescription.focus();
     }else if(!isNumber(newAmount.value)){
        newAmount.style.borderColor ="red";
        newAmount.focus();
     }else{
         var Close = document.getElementById("close");
         Close.click();
         $("#progress").show();
         //add data
         FireStoreDatabase.collection(selected_id+"_services").add({
             date: getCurrentDate(),
             time: getCurrentTime(),
             name: newTreatmentName.value,
             amount:newAmount.value,
             description: newTreatmentDescription.value,
             duration:newHours.value,
             status:"active"
         })
         .then(function(docRef) {
             FireStoreDatabase.collection(selected_id+"_services").doc(docRef.id).update({
                 "document": docRef.id
             })
             var Services = document.getElementById("viewservices");
             Services.click();
             $(document).ready(
                 function(){
                     $("#progress").hide();
                     newTreatmentName.value = "";
                     newTreatmentDescription.value = "";
                     newTreatmentName.focus();
                     
             });
             
         })
         .catch(function(error) {
             //console.error("Error writing document: ", error);
             closeDialogShowError(error);
         });
 
     }

}

//Birthdays section +++++++++++++++********&&&&&&&&&& Happpppppyyyy

//view Birthdays
function viewBirthdays(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/birthdays.html",function(){
        $(document).ready(
            function(){
                setBirthdaysToDataTable();
        });
    });
}
// set client's birthdays to the DataTable
function setBirthdaysToDataTable(){
    //get documents
    var count = 0;
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_clients").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var week = 7;
            var title = items.title;
            var name = items.name;
            var surname = items.surname;
            var email = items.email;
            var phone = items.phone;
            var gender= items.gender;
            var dob = items.dateOfBirth;
            var Document = items.document;
            if(dob){
                //get birthdate
                var getYear = getCurrentDate().split("/");
                var CurrentYear = getYear[0];
                var getDOB = dob.split("-");
                var CurrentBirthday = CurrentYear+"-"+getDOB[1]+"-"+ getDOB[2];
            }
            //get number of days between
            //var daysNo = Math.round((new Date(CurrentBirthday) - new Date (getCurrentDate().replace(/\//g,'-')) /(1000*60*60*24)));
            //alert (CurrentBirthday);
            //alert (calculateDays(CurrentBirthday));
            if(items.address){
                var address= items.address.replace(/\\n/g,'<br>');
                var Address;
                var newAddress = address.split("\n");
                if(calculateDays(CurrentBirthday)<= week && calculateDays(CurrentBirthday) >= 0){
                    for (let index = 0; index < newAddress.length; index++) {
                        Address = newAddress + "<br>";
                    }
                    //Add data to the table
                    //Table for Open Tasks
                    var table = document.getElementById("dtBasicExample");
                    var body = document.getElementById("birthdaysTable");
                    //create a row
                    var row = body.insertRow(count);
                    //insert cells
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    var cell7 = row.insertCell(6);
                    // Add some text to the new cells:
                    cell1.innerHTML = title + ", " + InitializeFirstLetter(name) +" "+ InitializeFirstLetter(surname);
                    cell2.innerHTML = gender;
                    cell3.innerHTML = email;
                    cell4.innerHTML = phone;
                    cell5.innerHTML = Address.replace(/,/g,'<br>');
                    cell6.innerHTML = CurrentBirthday;
                    cell7.innerHTML = calculateAge(dob);
                    //cell5.innerHTML = Age; calculating age
                    //cell6.innerHTML = Status;medicalAid
                    count++;
                }
            }
        });
        $('#dtBasicExample').DataTable();
    });
}
//function to count Birthdays & show on badger
function BirthdayCounts(){
    //get documents
    var count = 0;
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_clients").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var week = 7;
            var dob = items.dateOfBirth;
            //if date of birth is available
            if(dob){
                //get birthdate
                var getYear = getCurrentDate().split("/");
                var CurrentYear = getYear[0];
                var getDOB = dob.split("-");
                var CurrentBirthday = CurrentYear+"-"+getDOB[1]+"-"+ getDOB[2];
                //get number of days between
                //var daysNo = Math.round((new Date(CurrentBirthday) - new Date (getCurrentDate().replace(/\//g,'-')) /(1000*60*60*24)));
                //alert (CurrentBirthday);
                //alert (calculateDays(CurrentBirthday));
                if(calculateDays(CurrentBirthday)<= week && calculateDays(CurrentBirthday) >= 0){
                    count++;
                    //set Birthday badger count
                    var notifier = document.getElementById("bday_notifyer");
                    notifier.innerHTML = count;
                    notifier.className = "badge badge-pill badge-danger";
                    $("#notifications").show();
                    var notification = document.getElementById("notifications");
                    notification.innerHTML = count;
                    notification.className = "badge badge-pill badge-warning notification";
                }
            }
        });
    });

}

//Consultations section ~~~~~~~~~______________+++++++++++++++++++++++

//view consultations
//view Birthdays
function viewConsultations(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/consultations.html",function(){
        $(document).ready(
            function(){
                setConsultationYears();
                //$('#dtBasicExample').DataTable();
               
                //setBirthdaysToDataTable();
        });
    });
}
//set years
function setConsultationYears(){
    var Years = [];
    var count = 0;
    var getYear = getCurrentDate().split("/");
    var CurrentYear = getYear[0];
    //get the selected date
    var selectedYear = document.getElementById("year");
    //create the first item
    //create lists
    var opt = document.createElement('option');
    opt.value = count;
    opt.innerHTML = CurrentYear;
    selectedYear.onchange = (function (CurrentYear){return function(){perConsultation(CurrentYear);}})(CurrentYear);
    selectedYear.appendChild(opt);
    Years[count]= CurrentYear;
     //get documents
     var selected_id = localStorage.getItem("selected_id");//spa
     FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            var getDate = items.date.split("-");
            var newYear = getDate[0];
            var Cancelled = items.cancelled;
            var isCancelled = new Boolean(Cancelled);
            if(isCancelled == false){
                //check if is not the same year
                if(CurrentYear != newYear){
                    //check if the year doesn't already exist in the list
                    var found = false;
                    for (let index = 0; index < Years.length; index++) {
                        if(newYear == Years[index]){
                            found = true;
                            break;
                        }
                    }
                    var foundInList = new Boolean(found);
                    if(foundInList == false){
                        count++;
                        Years[count] = newYear;
                        //create lists
                        var opt = document.createElement('option');
                        opt.value = count;
                        opt.innerHTML = newYear;
                        selectedYear.onchange = (function (newYear){return function(){perConsultation(newYear);}})(newYear);
                        selectedYear.appendChild(opt);
                    }
                }
            }
        });
        //set consultants
        var SelectYear = document.getElementById("year");
        SelectYear.options[SelectYear.selectedIndex].innerHTML = CurrentYear;
        //console.log(SelectYear.options[SelectYear.selectedIndex].innerHTML);
        perConsultation(CurrentYear);
        //setConsultants();
        //defaultconsultation();
    });
    
}
// function to set clients on the list
function setConsultants(){
    //empty consultation table
    $("#consultationTable").empty();
    var clients = [];
    var clientsCount = 0;
    //get Selected year
    var SelectYear = document.getElementById("year");
    var CurrentYear = SelectYear.options[SelectYear.selectedIndex].innerHTML;
     //get documents
     var selected_id = localStorage.getItem("selected_id");//spa
     FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            var sex = items.clientGender;
            var client = items.clientName;
            var cancelled = items.cancelled;
            var date = items.date;
            var newYears = date.split("-");
            var Year = newYears[0];
            var isCancelled = new Boolean(cancelled);
            if(isCancelled == false){
                //check for date similarities
                if(CurrentYear == Year){
                    var Sex;
                    if(sex == "Male"){
                        Sex = "Mr";
                    }else{
                        Sex = "Ms";
                    }
                    //set clients list
                    var clientFound = false
                    if(clients.length == 0){
                        clients[0] = Sex +", "+client;
                        clientsCount ++;
                    }else{
                        for (let index = 0; index < clients.length; index++) {
                            if(clients[index] == Sex +", "+client){
                                clientFound = true;
                                break;
                            }
                            
                        }
                        if(!clientFound){
                            clients[clientsCount] = Sex +", "+client;
                            clientsCount ++;
                        }
                    }
                }
            }
        });
         //set Clients
        //allocate clients in the table
        var tableHeaders = 13;
        //Table
        var body = document.getElementById("consultationTable");
        for (let index = 0; index < clients.length; index++) {
            //create a row
            var row = body.insertRow(index);
            for (let x = 0; x < tableHeaders; x++) {
                if(x == 0){
                    //insert cells
                    var cell = row.insertCell(0);
                    // Add some text to the new cells:
                    cell.innerHTML = clients[index];
                    //document.getElementById("dtBasicExample").rows[index + 1].cells[0].innerHTML = clients[index];
                }else{
                    //create a row
                    //var row = body.insertRow(x);
                    //insert cells
                    var cell = row.insertCell(x);
                    // Add some text to the new cells:
                    cell.innerHTML = "";
                    //document.getElementById("dtBasicExample").rows[index + 1].cells[x].innerHTML = "";
                }
            }
        }
        var rowNum = document.getElementById("dtBasicExample").getElementsByTagName("tr").length;
        RowNum = rowNum;
        $('#dtBasicExample').DataTable();
    });
}
var RowNum;
//function to set consultations per chosen year
function perConsultation(year){
    setConsultants();
    //table columns
    var count = 0;
    var tableHeaders = 13;
    var consultTable = document.getElementById("consultationTable");
    var Year = document.getElementById("year");
    //var selectedYear = Year.options[Year.selectedIndex].innerHTML;
    //get the selected date
    var selectedYear = document.getElementById("year");
        //get documents
        var selected_id = localStorage.getItem("selected_id");//spa
        FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
            querySnapshot.forEach(function(doc) {
                let items = doc.data();
                var date = items.date.split("-");
                var Time = items.time;
                var client = items.clientName;
                var Cancelled = items.cancelled;
                var month = parseInt(date[1]);
                var day = date[2];
                var sex = items.clientGender;
                var treatment = items.treatment;
                var isCancelled = new Boolean(Cancelled);
                if(isCancelled == false){
                    var Sex;
                    //check for Dates similarities
                        if(sex == "Male"){
                            Sex = "Mr";
                        }else{
                            Sex = "Ms";
                        }
                        var clientName = Sex +", "+client;
                        var clientRow;
                        for (let index = 0; index < RowNum; index++) {
                            var tableName = document.getElementById("dtBasicExample").rows[index].cells[0].innerHTML;
                            if((index > 0) && (index < RowNum)){
                                if(tableName == clientName){
                                    clientRow = index;
                                    //document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = "";
                                    //break;
                                }

                            }
                            
                        }
                        var newDate = items.date;
                        //check dates and list only past dates
                        if(calculateDays(newDate) <= 0){
                            //set bookings
                            if(date[0] == Year.options[Year.selectedIndex].innerHTML){
                                    var main = document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML;
                                    //document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = day;//main+","+day;
                                    if(main == ""){
                                        document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = day+" - <br>"+treatment;
                                    }else{
                                        var dDates;
                                        var categorize = (main+",<br>"+day+" - "+treatment).split(",");
                                        if(!main.includes(day)){
                                            //document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = day;
                                            //document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = main+","+day;
                                            if(categorize.length % 4 == 0){
                                                dDates = main+",<br>"+day+" - "+treatment+"<br>";
                                            }else{
                                                //if(main>=day){
                                                //    dDates = day+","+main;
                                                //}else{
                                                    dDates = main+",<br>"+day+" - "+treatment;
                                                //}
                                            }
                                            document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = dDates;
                                        }else{
                                            var found = false;
                                            for (let index = 0; index < categorize.length; index++) {
                                                if(day == categorize[index]){
                                                    found = true;
                                                    break;
                                                }
                                                
                                            }
                                            if(!found){
                                                if(categorize.length % 4 == 0){
                                                    document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = main+",<br>"+day+" - "+treatment;
                                                }else{
                                                    document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = main+",<br>"+day+" - "+treatment;
                                                }
                                            }

                                        }
                                    }
                            }
                        }
                    }
                
            });
        });

}
//set default consultation per client
function defaultconsultation(){
     //table columns
     var tableHeaders = 13;
     var consultTable = document.getElementById("consultationTable");
     var Year = document.getElementById("year");
     //var selectedYear = Year.options[Year.selectedIndex].innerHTML;
     //get the selected date
     var selectedYear = document.getElementById("year");
         //get documents
         var selected_id = localStorage.getItem("selected_id");//spa
         FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
             querySnapshot.forEach(function(doc) {
                let items = doc.data();
                var date = items.date.split("-");
                var Time = items.time;
                var client = items.clientName;
                var Cancelled = items.cancelled;
                var treatment = items.treatment;
                var month = parseInt(date[1]);
                var day = date[2];
                var sex = items.clientGender;
                var Sex;
                var isCancelled = new Boolean(Cancelled);
                if(isCancelled == false){
                 //
                    if(sex == "Male"){
                        Sex = "Mr";
                    }else{
                        Sex = "Ms";
                    }
                    var clientName = Sex +", "+client;
                    var clientRow;
                    for (let index = 0; index < RowNum; index++) {
                        var tableName = document.getElementById("dtBasicExample").rows[index].cells[0].innerHTML;
                        if(index > 0 && index < RowNum){
                            if(tableName == clientName){
                                clientRow = index;
                                //document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = "";
                                break;
                            }
    
                        }
                        
                    }
                    //set bookings
                    if(date[0] == Year.options[Year.selectedIndex].innerHTML){
                        //check cancellations
                            var main = document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML;
                            if(count == 0){
                                document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = day +"<br>"+treatment;//main+","+day;
                            }else{
                                if(main == ""){
                                    document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = day+"<br>"+treatment;
                                }else{
                                    if(!main.includes(day)){
                                        //document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = day;
                                        //document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = main+","+day;
                                        var dDates;
                                        var categorize = (main+","+day+"<br>"+treatment).split(",");
                                        if(categorize.length % 4 == 0){
                                            dDates = main+","+day+"<br>"+treatment+"<br>"
                                        }else{
                                            dDates = main+","+day+"<br>"+treatment;
                                        }
                                        document.getElementById("dtBasicExample").rows[clientRow].cells[month].innerHTML = dDates;
                                    }
                                }
                            }
                    }
                    count++;
                }
                    
            });
         });
 

}

// Company Profile ******************---------------------------------------------

//view profile section
function viewProfile(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/profile.html",function(){
        $(document).ready(
            function(){
                companyInfo();
                //setConsultationYears();
        });
    });

}

//function to set company information on display
function companyInfo(){
    // get corresnponding fields
    //profile
    var Image = document.getElementById("propic");
    var Name = document.getElementById("name");
    var Location = document.getElementById("location");
    //contact information
    var Email = document.getElementById("email");
    var Phone = document.getElementById("phone");
    var Altphone = document.getElementById("altphone");
    //Address information
    var Addr_physical = document.getElementById("physical");
    var Addr_postal = document.getElementById("postal");

    //get documents
    var selected_id = localStorage.getItem("selected_id");
    //query the db
    var docRef = FireStoreDatabase.collection("spa").doc(selected_id);
    docRef.get().then(function(doc) {
        let items = doc.data();
        Image.src=items.banner;
        Name.value = items.spa;
        Location.value = items.location;
        //check contact info

        Email.value = items.email;
        //check phone
        if(items.phone){
            Phone.value = items.phone;
        }
        //check phone
        if(items.alternatePhone){
            Altphone.value = items.alternatePhone;
        }
        //check address information
        if(items.address_physical){
            Addr_physical.value  = items.address_physical;
        }
        if(items.address_postal){
            Addr_postal.value  = items.address_postal;
        }
    }).catch(function(error) {
        //console.log("Error getting document:", error);
        closeDialogShowError("error :"+error.code + " : " + error);
    });
}

//upload user Information
function updateSpaDetails(){
    //firebase.initializeApp(firebaseConfig);
    //get corresponding fields to update
    // get corresnponding fields
    //profile
    var Image = document.getElementById("propic");
    var Name = document.getElementById("name");
    var Location = document.getElementById("location");
    //contact information
    var Email = document.getElementById("email");
    var Phone = document.getElementById("phone");
    var Altphone = document.getElementById("altphone");
    //Address information
    var Addr_physical = document.getElementById("physical");
    var Addr_postal = document.getElementById("postal");
    //email format
    var emailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    //check for nulls
    if(!Name.value){
    Name.style.borderColor ="red";
    Name.focus();
    }else if(!Location.value){
    Location.style.borderColor ="red";
    Location.focus();
    }else if(!Email.value || !emailFormat.test(String(Email.value).toLowerCase())){
    Email.style.borderColor ="red";
    Email.focus();
    }else if(!Phone.value || Phone.value.length<10 || Phone.value.substring(0,1)!="0"){
    Phone.style.borderColor ="red";
    Phone.focus();
    }else if(!Altphone.value || Altphone.value.length<10 || Altphone.value.substring(0,1)!="0"){
    Altphone.style.borderColor ="red";
    Altphone.focus();
    }else if(!Addr_physical.value){
    Addr_physical.style.borderColor ="red"
    Addr_physical.focus()
    }else if(!Addr_postal.value){
    Addr_postal.style.borderColor ="red"
    Addr_postal.focus()
    }else{
        $("#progress").show();
        if(!Picture == ""){
            //initialize storage
            var storage = firebase.storage().ref();
            //Initialize file
            var img = "profilePic."+picExtention;
            var selected_id = localStorage.getItem("selected_id");
            const PropicRef = storage.child('userImages/'+selected_id+'/'+img);
            //Initialize upload task
            const task = PropicRef.put(Picture);
            //handle call backs
            task.then(function(snapshot){
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                task.snapshot.ref.getDownloadURL().then(function(downloadURL) {
                    //update picture url and isprofilepic set
                    var picRef = FireStoreDatabase.collection("spa").doc(selected_id);
                        return picRef.update({
                            banner:downloadURL,
                        })
                        .then(function() {
                            //set nav details
                            setProfileInformation(FireStoreDatabase);
                            var Image = document.getElementById("propic_main");
                            Image.src=downloadURL;
                            viewProfile();
                            //closeDialogShowSuccess();
                            //console.log("Document successfully updated!");
                            
                        })
                        .catch(function(error) {
                            // The document probably doesn't exist.
                            //console.error("Error updating document: ", error);
                            closeDialogShowError("error :"+error.code + " : " + error);
                        });
                  });
            })
            .catch((error) => {
                closeDialogShowError("error :"+error.code + " : " + error);
            });
        }
        //update database documents
        //get documents
        var selected_id = localStorage.getItem("selected_id");
        //db variables
        //const app = firebase.app();
        //const db = firebase.firestore();
        //get document reference to update
        var docRef = FireStoreDatabase.collection("spa").doc(selected_id);
        var updateNow = 'profileupdateTime_'+getCurrentDate().replace(/\//g,'-');
        return docRef.update({
            name: Name.value,
            location: Location.value,
            email: Email.value,
            phone:Phone.value,
            alternatePhone: Altphone.value,
            address_physical:Addr_physical.value,
            address_postal:Addr_postal.value,
            [updateNow]:getCurrentTime()
        })
        .then(function() {
            if(Picture == ""){
                location.reload();
                $(document).ready(
                    function(){
                        var Profile = document.getElementById("profile");
                        Profile.click()
                        //companyInfo();
                        //setConsultationYears();
                });
            //viewProfile();
            }
            closeDialogShowSuccess();
            //console.log("Document successfully updated!");
        })
        .catch(function(error) {
            // The document probably doesn't exist.
            //console.error("Error updating document: ", error);
            closeDialogShowError("error :"+error.code + " : " + error);
        });
    
    }
}

//Ratings section +++++++++++++++==============================**********************&&&&&&&&&
var RatingClient;
var RatingService;
var RatingColumn;
var RatingRow;
function submitRatings(){
    //get ratings
    var Rating = document.getElementById("rating");
    var Rate = Rating.value;
    var maxTable = 157;
    if(Rating.value){
        Rating.value = "";
        //close modal
        var Close = document.getElementById("closer");
        Close.click();
        //get documents
        var selected_id = localStorage.getItem("selected_id");//spa
        
        var BookingSection = document.getElementById("dtBasicExample").rows[RatingRow+1].cells[RatingColumn].innerHTML;
        if(BookingSection!=""){
            //get the cell
            var getInfo = BookingSection.split("<br>");
            var removeLessThan = getInfo[2].split("<");
            var removeGreaterThan = removeLessThan[1].split(">");
            var getDocument = removeGreaterThan[1].split("~");
            var documentNo = getDocument[0];
            var client = getInfo[0];
            var service = getInfo[1];
            if(client == RatingClient && service == RatingService){
                //close modal
                $("#progress").show();
                FireStoreDatabase.collection(selected_id+"_bookings").doc(documentNo).update({
                    "rating": Rate
                })
                .then(function() {
                    selectBookingDate();
                    $("#progress").hide();
                    //console.error("Document successfully submitted");
                })
                .catch(function(error) {
                    //console.error("Error writing document: ", error);
                    $("#progress").hide();
                    closeDialogShowError(error);
                });
                }
            }
            //if(index+1 == maxTable){
            //    $("#progress").hide();
            //    closeDialogShowSuccess();
           // }
    }else{
        closeDialogShowError("Please rate this therapist");
    }

}

//view Ratings
function viewRatings(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/ratings.html",function(){
        $(document).ready(
            function(){
                var selectedDate = document.getElementById("date");
                selectedDate.value = getCurrentDate().replace(/\//g,'-');
                getRelatedTherapistLabels();
                //setConsultationYears();
                //$('#dtBasicExample').DataTable();
               
                //setBirthdaysToDataTable();
        });
    });
}
//function to get all therapists Labels
function getRelatedTherapistLabels(){
    //get documents
    var count = 0;
    var Labels = [];
    var Docies = [];
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_beauticians").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var name = items.name +" "+ items.surname;
            var status= items.status;
            var Document = items.document;
            if(status == "active"){
                Labels[count] = name;
                Docies[count] = Document;
                count++
            }
        });
        getRelatedTherapistData(Labels,Docies);
    });

}
//function to get all therapists data
function getRelatedTherapistData(Labels,Documents){
    var myDate = document.getElementById("date")
    var myDatefinal = myDate.value.length-3;
    //get documents
    var count = 0;
    var Data = [];
    var total = 0;
    //initialize Data
    for (let index = 0; index < Documents.length; index++) {
        Data[index] = 0;
    }
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var rating= items.rating;
            var therapist= items.beauticianId;
            var date = items.date;
            var datefinal = date.length-3;
            //for the chosen month
            if (myDate.value.substring(0,myDatefinal)== date.substring(0,datefinal)){
                for (let index = 0; index < Documents.length; index++) {
                    if(Documents[index] == therapist){
                        if(rating){
                            total=parseInt(rating);
                            Data[index] = parseInt(rating);
                        }
                    }
                }    
            }         
            
        });
        performanceChart(Data,Labels);
    });
        //console.log("my chart data",Data);
        //performanceChart(Data,Labels);
}
//function to set the chart in the table
function performanceChart(Data,Labels){
    var ctx = document.getElementById('performChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: Labels,
            datasets: [{
                label: Labels.length+' number of Therapists',
                data: Data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
//ratings per date chosen
function selectRatingsDate(){
    //empty canvas & remove canvas
    $('#performChart').remove();
    $('#graph-container').append('<canvas class = "my-4 w-100 chartjs-render-monitor" id="performChart"><canvas>');
    getRelatedTherapistLabels();
}
//Dashboard section*****************---------- */

//view Ratings
function viewReports(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/reports.html",function(){
        $(document).ready(
            function(){
                var selectedDate = document.getElementById("date");
                selectedDate.disabled = true;
                acquireLabels();
                
        });
    });
}

//Chat Labels
var weekly = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
var monthly = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var today = ['Today'];
var yearly;
var beauticians;
var beauticianDocuments;
var treatments;
var treatmentsDocument;
var yearly;
var yearlyDocument;
//function to get Labels for rendering perfomance chats
function acquireLabels(){
    yearly = [];
    yearlyDocument = [];
    beauticians = [];
    beauticianDocuments = [];
    treatments = [];
    treatmentsDocument = [];
    //view yearly
    yearlyLabel();
}
//function to get yearly labels
function yearlyLabel(){
    var count = 0;
    var getYear = getCurrentDate().split("/");
    var CurrentYear = getYear[0];
    //get the selected date
    var selectedYear = document.getElementById("year");
    //create the first item
    //create lists
    var opt = document.createElement('option');
    opt.value = count;
    opt.innerHTML = CurrentYear;
    selectedYear.onchange = (function (){return function(){yearMonthReload();}})();
    selectedYear.appendChild(opt);
    yearly[count]= CurrentYear;
     //get documents
     var selected_id = localStorage.getItem("selected_id");//spa
     FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            var getDate = items.date.split("-");
            var newYear = getDate[0];
            //check if is not the same year
            if(CurrentYear != newYear){
                //check if the year doesn't already exist in the list
                var found = false;
                for (let index = 0; index < yearly.length; index++) {
                    if(newYear == yearly[index]){
                        found = true;
                        break;
                    }
                }
                var foundInList = new Boolean(found);
                if(foundInList == false){
                    count++;
                    yearly[count]= newYear;
                    //create lists
                    var opt = document.createElement('option');
                    opt.value = count;
                    opt.innerHTML = newYear;
                    selectedYear.onchange = (function (){return function(){yearMonthReload();}})();
                    selectedYear.appendChild(opt);
                }
            }
        });
        //beauticians
        beauticianLabel();
    });

}
//function to get beauticians labels
function beauticianLabel(){
    //get documents
    var count = 0;
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_beauticians").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var name = items.name +" "+ items.surname;
            var status= items.status;
            var Document = items.document;
            if(status == "active"){
                beauticians[count] = name;
                beauticianDocuments[count] = Document;
                count++
            }
        });
            //treatments
        treatmentLabel(yearly,yearlyDocument,beauticians,beauticianDocuments,treatments,treatmentsDocument);
    });
    
}
//function to get treatments labels
function treatmentLabel(){
     //get documents
     var count = 0;
     var found = false;
     var selected_id = localStorage.getItem("selected_id");//spa
     FireStoreDatabase.collection(selected_id+"_services").get().then(function(querySnapshot) {
         querySnapshot.forEach(function(doc) {
             let items = doc.data();
             /* Make data suitable for rendering */
             var Name = items.name;
             var Document = items.document;
             for (let index = 0; index < treatments.length; index++) {
                 if(treatments[index].trim() == Name.trim()){
                    found = true;
                    break;
                 }else{
                    found = false;
                 }
             }
             var foundInList = new Boolean(found);
             if(foundInList == false){
                treatments[count] = Name;
                treatmentsDocument[count] = Document;
                count++;
             }
             
         });
         yearMonthlyHours();
         yearMonthlyPerformance();
         yearMonthlyServices();
         //set the below graphics after year graph has graphitized
         TreatmentPerformance();
         TherapistPerformance();
     });
 
    
}
//function to manage Time frame select
function timeFrame(event){
    //clear time indicator interval
    clearInterval(intervalTime);
    var TimeFrame = document.getElementById("time");
    if(TimeFrame[this.selectedIndex].innerHTML == "Yearly"){
        $("#year").empty();
        //ad years to the list
        var Year = document.getElementById("year");
        for (var i = 0; i<yearly.length; i++){
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = yearly[i];
            Year.appendChild(opt);
        }
        //enable years
        var SelectYear = document.getElementById("year");
        SelectYear.disabled = false;
        //disable date
        var selectedDate = document.getElementById("date");
        selectedDate.disabled = true;
        //adding selection
        var YearField = document.getElementById("yearfield");
        YearField.innerHTML = "Select Years";
        //preset Chart
        yearMonthReload();

    }else if(TimeFrame[this.selectedIndex].innerHTML == "Monthly"){
        $("#year").empty();
        //enable years
        var SelectYear = document.getElementById("year");
        SelectYear.disabled = false;
        //disable date
        var selectedDate = document.getElementById("date");
        selectedDate.disabled = true;
        //adding months
        var YearField = document.getElementById("yearfield");
        YearField.innerHTML = "Select Months";
        var SelectYear = document.getElementById("year");
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        for (var i = 0; i<months.length; i++){
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = months[i];
            SelectYear.appendChild(opt);
        }
        //preset Chart
        yearMonthReload();

    }else if(TimeFrame[this.selectedIndex].innerHTML == "Weekly"){
        var DateField = document.getElementById("datefield");
        DateField.innerHTML = "Select any day within a week";
        //disable date
        var selectedDate = document.getElementById("date");
        selectedDate.disabled = false;
        //dissable years
        var SelectYear = document.getElementById("year");
        SelectYear.disabled = true;
        //initiate the day
        selectedDate.value = getCurrentDate().replace(/\//g,'-');
        //preset Chart
        dayWeeklyReload();
    }else{
        var DateField = document.getElementById("datefield");
        DateField.innerHTML = "Select a day";
        //disable date
        var selectedDate = document.getElementById("date");
        selectedDate.disabled = false;
        //adissable years
        var SelectYear = document.getElementById("year");
        SelectYear.disabled = true;
        //initiate the day
        selectedDate.value = getCurrentDate().replace(/\//g,'-');
        //preset Chart
        dayWeeklyReload();
    }

}
//HOURS CHART *&&&&*&##@@@@@@@@@@@@@@@@@&&&&&&&&&&&&&&&^^^^^^^^^^^^^^^^^^^^^^
//year/month selection
function yearMonthlyHours(){
    var TimeFrame = document.getElementById("time");
    var mytime = TimeFrame.options[TimeFrame.selectedIndex].innerHTML;
    var year = document.getElementById("year");
    var myYear = year.options[year.selectedIndex].innerHTML;
    //get documents
    var beauticianIndex = 0;
    var count = 0;
    var Data = [];
    var DateTreatment = [];
    //initialize Data
    for (let index = 0; index < beauticianDocuments.length; index++) {
        Data[index] = 0;
    }
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var duration= items.defaultDuration;
            var therapist= items.beauticianId;
            var treatment = items.treatment;
            var date = items.date;
            var time = items.time;
            var bdDate = new Date(date+" 00:00:00");
            var now = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
            var Cancelled = items.cancelled;
            var isCancelled = new Boolean(Cancelled);
            if(isCancelled == false){
                //allow only past dates
                if(now.getTime()>=bdDate.getTime()){
                    //for the chosen year
                    if(mytime == "Yearly"){
                        //if the fall in the same year
                        if (date.substring(0,4)== myYear){
                            var found = false;
                            //if the therapist is found
                            for (let x = 0; x < DateTreatment.length; x++) {
                                if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                    found=true;
                                    break;
                                }
                            }
                            var foundInList = new Boolean(found);
                            //if the treatment & date is found
                            if(foundInList == false){
                                for (let index = 0; index < beauticianDocuments.length; index++) {
                                    //if the therapist is found
                                    if(beauticianDocuments[index] == therapist){
                                        if(duration){
                                            Data[index]+=parseFloat(duration);
                                            DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                            count++;
                                            break;

                                        }
                                    }
                                }
                            }
                        }    
                    //for months
                    }else{
                        var monIndex = 0;
                        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
                        for (let index = 0; index < months.length; index++) {
                            if(months[index] == myYear){
                                    if(index < 9){
                                        monIndex = "0"+parseInt(index+1);
                                    }else{
                                        monIndex = index+1;
                                    }
                                    break;
                                }
                        }
                        var newDate = date.split("-");
                        var found = false;
                        //for the chosen year and month
                        if (monIndex == newDate[1]){
                            for (let index = 0; index < beauticianDocuments.length; index++) {
                                //if the therapist is found
                                if(beauticianDocuments[index] == therapist){
                                    for (let x = 0; x < DateTreatment.length; x++) {
                                        if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                            found=true;
                                            break;
                                        }
                                    }
                                }
                            }
                                var foundInList = new Boolean(found);
                                //if the treatment & date is found
                                if(foundInList == false){
                                    for (let index = 0; index < beauticianDocuments.length; index++) {
                                        //if the therapist is found
                                        if(beauticianDocuments[index] == therapist){
                                            if(duration){
                                                    Data[index]+=parseFloat(duration);
                                                    DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                                    count++;
                                                    break;
                                            }
                                        }
                                    }
                                }        
                        }
                    }

                }   
            }
        });
            hoursChart(beauticians,Data);
        
    });
        //console.log("my chart data",Data);
        //performanceChart(Data,Labels);
}
//day/weekly selection
function dayWeeklyHours(){
    var TimeFrame = document.getElementById("time");
    var mytime = TimeFrame.options[TimeFrame.selectedIndex].innerHTML;
    var DateFrame = document.getElementById("date");
    var selectedDate = DateFrame.value;
    //get documents
    var count = 0;
    var Data = [];
    var DateTreatment = [];
    var dateFrom;
    var DateTo;
    //initialize Data
    for (let index = 0; index < beauticianDocuments.length; index++) {
        Data[index] = 0;
    }
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var duration= items.defaultDuration;
            var therapist= items.beauticianId;
            var treatment = items.treatment;
            var date = items.date;
            var time = items.time;
            var bdDate = new Date(date+" 00:00:01");
            var now = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
            var Cancelled = items.cancelled;
            var isCancelled = new Boolean(Cancelled);
            if(isCancelled == false){
                //allow only past dates
                if(now.getTime()>=bdDate.getTime()){
                    //for the chosen year
                    if(mytime == "Daily"){
                        //if the fall in the same year
                        if (date == selectedDate){
                            var found = false;
                            //if the therapist is found
                            for (let x = 0; x < DateTreatment.length; x++) {
                                if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                    found=true;
                                    break;
                                }
                            }
                            var foundInList = new Boolean(found);
                            //if the treatment & date is found
                            if(foundInList == false){
                                for (let index = 0; index < beauticianDocuments.length; index++) {
                                    //if the therapist is found
                                    if(beauticianDocuments[index] == therapist){
                                        if(duration){
                                            Data[index]+=parseFloat(duration);
                                            DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                            count++;
                                            break;

                                        }
                                    }
                                }
                            }
                        }    
                    //for months
                    }else{
                        //Determine Date time
                        var newDate = new Date(selectedDate.replace(/\//g,'-')+" "+getCurrentTime());
                        var WeekPrior = new Date(newDate).setDate(newDate.getDate() - 7);
                        dateFrom = new Date(WeekPrior);
                        dateTo = newDate = new Date(selectedDate.replace(/\//g,'-')+" "+getCurrentTime());
                        var weekBefore = new Date(WeekPrior);
                        var dBDate = new Date(date+" 00:00:01");
                        var found = false;
                        //if date is within this week
                        if ((dBDate.getTime() >= weekBefore.getTime()) && (dBDate.getTime() <=newDate.getTime())){
                            //if the therapist is found
                            for (let x = 0; x < DateTreatment.length; x++) {
                                if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                    found=true;
                                    break;
                                }
                            }
                                var foundInList = new Boolean(found);
                                //if the treatment & date is found
                                if(foundInList == false){
                                    for (let index = 0; index < beauticianDocuments.length; index++) {
                                        //if the therapist is found
                                        if(beauticianDocuments[index] == therapist){
                                            if(duration){
                                                Data[index]+=parseFloat(duration);
                                                DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                                count++;
                                                break;
                                            }
                                        }
                                    }
                                }        
                        }
                    }

                }   
            }
        });
            hoursChart(beauticians,Data);        
    });
}
//function to reloadDataperYearMonth
function yearMonthReload(){
    //remove hours chart & reload hourschart
    $('#hoursChart').remove();
    $('#canvas-hour').append('<canvas class = "my-4 w-100 chartjs-render-monitor" id="hoursChart" width="350" height="350"><canvas>');
    //remove performance chart & reload hourschart
    $('#performanceChart').remove();
    $('#canvas-performance').append('<canvas class = "my-4 w-100 chartjs-render-monitor" id="performanceChart" width="350" height="350"><canvas>');
     //remove services chart & reload serviceschart
     $('#servicesChart').remove();
     $('#canvas-services').append('<canvas class = "my-4 w-100 chartjs-render-monitor" id="servicesChart" width="900" height="350"><canvas>');
    yearMonthlyHours();
    yearMonthlyPerformance();
    yearMonthlyServices();
}
//function to reloadDataperDayWeek
function dayWeeklyReload(){
     //remove hours chart & reload hourschart
    $('#hoursChart').remove();
    $('#canvas-hour').append('<canvas class = "my-4 w-100 chartjs-render-monitor" id="hoursChart" width="350" height="350"><canvas>');
    //remove performance chart & reload hourschart
    $('#performanceChart').remove();
    $('#canvas-performance').append('<canvas class = "my-4 w-100 chartjs-render-monitor" id="performanceChart" width="350" height="350"><canvas>');
    //remove services chart & reload serviceschart
    $('#servicesChart').remove();
    $('#canvas-services').append('<canvas class = "my-4 w-100 chartjs-render-monitor" id="servicesChart" width="900" height="350"><canvas>');
    dayWeeklyHours();
    dayWeeklyPersformance();
    dayWeeklyServices();
}
//Hours per Therapist chart
function hoursChart(Labels,Data){
    var ctx = document.getElementById('hoursChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Labels,
            datasets: [{
                label: 'Hours worked per Therapist',
                data: Data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(10, 20, 74, 0.2)',
                    'rgba(0, 120, 214, 0.2)',
                    'rgba(100, 120, 214, 0.2)',
                    'rgba(55, 10, 104, 0.2)',
                    'rgba(182, 109, 01, 0.2)',
                    'rgba(23, 45, 30, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(10, 20, 74, 1)',
                    'rgba(0, 120, 214, 1)',
                    'rgba(100, 120, 214, 1)',
                    'rgba(55, 10, 104, 1)',
                    'rgba(182, 109, 01, 1)',
                    'rgba(23, 45, 30, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
//Days/Performance CHART *&&&&*&##@@@@@@@@@@@@@@@@@&&&&&&&&&&&&&&&^^^^^^^^^^^^^^^^^^^^^^
//Days per Year/Month/Week/day
function yearMonthlyPerformance(){
    var TimeFrame = document.getElementById("time");
    var mytime = TimeFrame.options[TimeFrame.selectedIndex].innerHTML;
    var year = document.getElementById("year");
    var myYear = year.options[year.selectedIndex].innerHTML;
    //get documents
    var beauticianIndex = 0;
    var count = 0;
    var Data = [];
    var DateTreatment = [];
    //initialize Data
    for (let index = 0; index < weekly.length; index++) {
        Data[index] = 0;
    }
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var duration= items.defaultDuration;
            var therapist= items.beauticianId;
            var treatment = items.treatment;
            var date = items.date;
            var time = items.time;
            var bdDate = new Date(date+" 00:00:00");
            var now = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
            var Cancelled = items.cancelled;
            var isCancelled = new Boolean(Cancelled);
            if(isCancelled == false){
                //allow only past dates
                if(now.getTime()>= bdDate.getTime()){
                    //for the chosen year
                    if(mytime == "Yearly"){
                        //if the fall in the same year
                        if (date.substring(0,4)== myYear){
                            var found = false;
                            //if the therapist is found
                            for (let x = 0; x < DateTreatment.length; x++) {
                                if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                    found=true;
                                    break;
                                }
                            }
                            var foundInList = new Boolean(found);
                            //if the treatment & date is found
                            if(foundInList == false){
                                for (let index = 0; index < beauticianDocuments.length; index++) {
                                    //if the therapist is found
                                    if(beauticianDocuments[index] == therapist){
                                        if(duration){
                                            //Determine Date time
                                            var dbDate = new Date(date+" 00:00:01");
                                            for (let x = 0; x < weekly.length; x++) {
                                                //check day of the week
                                                if(dbDate.getDay() == x){
                                                    Data[x]+=parseFloat(duration);
                                                    DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                                    count++;
                                                    break;
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }    
                    //for months
                    }else{
                        var monIndex = 0;
                        for (let index = 0; index < monthly.length; index++) {
                            if(monthly[index] == myYear.substring(0,3)){
                                    if(index < 9){
                                        monIndex = "0"+parseInt(index+1);
                                    }else{
                                        monIndex = index+1;
                                    }
                                    break;
                                }
                        }
                        var newDate = date.split("-");
                        var found = false;
                        //for the chosen year and month
                        if (monIndex == newDate[1]){
                            for (let index = 0; index < DateTreatment.length; index++) {
                                //if the therapist is found
                                    for (let x = 0; x < DateTreatment.length; x++) {
                                        if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                            found=true;
                                            break;
                                        }
                                    }
                            }
                                var foundInList = new Boolean(found);
                                //if the treatment & date is found
                                if(foundInList == false){
                                    for (let index = 0; index < beauticianDocuments.length; index++) {
                                        //if the therapist is found
                                        if(beauticianDocuments[index] == therapist){
                                            if(duration){
                                                //Determine Date time
                                                var dbDate = new Date(date+" 00:00:01");
                                                for (let x = 0; x < weekly.length; x++) {
                                                    //check day of the week
                                                    if(dbDate.getDay() == x){
                                                        Data[x]+=parseFloat(duration);
                                                        DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                                        count++;
                                                        break;
                                                    }
                                                    
                                                }
                                            }
                                        }
                                    }
                                }        
                        }
                    }

                }   
            }
        });
        DaysChart(weekly,Data);
    });
        //console.log("my chart data",Data);
        //performanceChart(Data,Labels);
}
//day/weekly selection
function dayWeeklyPersformance(){
    var TimeFrame = document.getElementById("time");
    var mytime = TimeFrame.options[TimeFrame.selectedIndex].innerHTML;
    var DateFrame = document.getElementById("date");
    var selectedDate = DateFrame.value;
    //get documents
    var count = 0;
    var Data = [];
    var DateTreatment = [];
    var dateFrom;
    var DateTo;
    //initialize Data
    for (let index = 0; index < weekly.length; index++) {
        Data[index] = 0;
    }
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var duration= items.defaultDuration;
            var therapist= items.beauticianId;
            var treatment = items.treatment;
            var date = items.date;
            var time = items.time;
            var bdDate = new Date(date+" 00:00:00");
            var now = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
            var Cancelled = items.cancelled;
            var isCancelled = new Boolean(Cancelled);
            if(isCancelled == false){
                //allow only past dates
                if(now.getTime()>=bdDate.getTime()){
                    //for the chosen year
                    if(mytime == "Daily"){
                        //if the fall in the same year
                        if (date == selectedDate){
                            var found = false;
                            //if the therapist is found
                            for (let x = 0; x < DateTreatment.length; x++) {
                                if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                    found=true;
                                    break;
                                }
                            }
                            var foundInList = new Boolean(found);
                            //if the treatment & date is found
                            if(foundInList == false){
                                for (let index = 0; index < beauticianDocuments.length; index++) {
                                    //if the therapist is found
                                    if(beauticianDocuments[index] == therapist){
                                        if(duration){
                                            //Determine Date time
                                            var dbDate = new Date(date+" 00:00:01");
                                            for (let x = 0; x < weekly.length; x++) {
                                                //check day of the week
                                                if(dbDate.getDay() == x){
                                                    Data[x]+=parseFloat(duration);
                                                    DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                                    count++;
                                                    break;
                                                }
                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }    
                    //for months
                    }else{
                        //Determine Date time
                        var newDate = new Date(selectedDate.replace(/\//g,'-')+" "+getCurrentTime());
                        var WeekPrior = new Date(newDate).setDate(newDate.getDate() - 7);
                        dateFrom = new Date(WeekPrior);
                        dateTo = newDate = new Date(selectedDate.replace(/\//g,'-')+" "+getCurrentTime());
                        var weekBefore = new Date(WeekPrior);
                        var dBDate = new Date(date+"  00:00:00");
                        var found = false;
                        //if date is within this week
                        if ((dBDate.getTime() >= weekBefore.getTime() ) && (dBDate.getTime() <=newDate.getTime())){
                            //if the therapist is found
                            for (let x = 0; x < DateTreatment.length; x++) {
                                if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                    found=true;
                                    break;
                                }
                            }
                                var foundInList = new Boolean(found);
                                //if the treatment & date is found
                                if(foundInList == false){
                                    for (let index = 0; index < beauticianDocuments.length; index++) {
                                        //if the therapist is found
                                        if(beauticianDocuments[index] == therapist){
                                            if(duration){
                                                //Determine Date time
                                                var dbDate = new Date(date+" 00:00:01");
                                                for (let x = 0; x < weekly.length; x++) {
                                                    //check day of the week
                                                    if(dbDate.getDay() == x){
                                                        Data[x]+=parseFloat(duration);
                                                        DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                                        count++;
                                                        break;
                                                    }                                        
                                                }
                                            }
                                        }
                                    }
                                }        
                        }
                    }

                }   
            }
        });
        DaysChart(weekly,Data);        
    });


}
//Daily performance chart
function DaysChart(Labels,Data){
    //make data to start at 0
    Data[Data.length] = 0;
    var ctx = document.getElementById('performanceChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'horizontalBar',
        data: {
            labels: Labels,
            datasets: [{
                label: 'Daily performance per hour',
                data: Data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            }
        }
    });
}
//Services/Therapist CHART *&&&&*&##@@@@@@@@@@@@@@@@@&&&&&&&&&&&&&&&^^^^^^^^^^^^^^^^^^^^^^
var performanceData = [];
var Border = [];
var Background = [];
//get individual service data to plot on the graph
function getPerformanceData(mylabel,myData){
    for (let index = 0; index < mylabel.length; index++) {
        determineBorder(index)
        determineBackground(index);
        var newData = [];
        var newColor = [];
        var newBacground = [];
        newData[0]=0;
        newData[1]=myData[index];
        newColor[0]=Border[index];
        newBacground[0]=Background[index];
        performanceData[index] = {label:mylabel[index],data:newData,backgroundColor:newBacground,
                    borderColor :newColor,
                    borderWidth: 1
                };
    }
    //ServicesChart(mylabel);
}
//Determine Background
function determineBackground(index){
    var color = "";
    if (index == 0){
        Background[index] = "rgba(255, 99, 132, 0.2)";
    }else if (index == 1){
        Background[index] = 'rgba(54, 162, 235, 0.2)';
    }else if (index == 2){
        Background[index] = 'rgba(255, 206, 86, 0.2)';
    }else if (index == 3){
        Background[index] = 'rgba(75, 192, 192, 0.2)';
    }else if (index == 4){
        Background[index] = 'rgba(153, 102, 255, 0.2)';
    }else {
        Background[index] = 'rgba(255, 159, 64, 0.2)';
    }

}
//Determine Border
function determineBorder(index){
    var color = "";
    if (index == 0){
        Border[index] = 'rgba(255, 99, 132, 1)';
    }else if (index == 1){
        Border[index] = 'rgba(54, 162, 235, 1)';
    }else if (index == 2){
        Border[index] = 'rgba(255, 206, 86, 1)';
    }else if (index == 3){
        Border[index] = 'rgba(75, 192, 192, 1)';
    }else if (index == 4){
        Border[index] = 'rgba(153, 102, 255, 1)';
    }else {
        Border[index] = 'rgba(255, 159, 64, 1)';
    }

}
//Year/Monthly selection
function yearMonthlyServices(){
    var TimeFrame = document.getElementById("time");
    var mytime = TimeFrame.options[TimeFrame.selectedIndex].innerHTML;
    var year = document.getElementById("year");
    var myYear = year.options[year.selectedIndex].innerHTML;
    //get documents
    var count = 0;
    var Data = [];
    var DateTreatment = [];
    //initialize Data
    for (let index = 0; index < treatmentsDocument.length; index++) {
        Data[index] = 0;
    }
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var duration= items.defaultDuration;
            var therapist= items.beauticianId;
            var treatment = items.treatment;
            var date = items.date;
            var time = items.time;
            var Category = items.category;
            var bdDate = new Date(date+" 00:00:00");
            var now = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
            var Category = items.category;
            var Cancelled = items.cancelled;
            var isCancelled = new Boolean(Cancelled);
            if(isCancelled == false){
                //allow only past dates
                if(now.getTime()>=bdDate.getTime()){
                    //for the chosen year
                    if(mytime == "Yearly"){
                        //if the fall in the same year
                        if (date.substring(0,4)== myYear){
                            var found = false;
                            //if the therapist is found
                            for (let x = 0; x < DateTreatment.length; x++) {
                                if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                    found=true;
                                    break;
                                }
                            }
                            var foundInList = new Boolean(found);
                            //if the treatment & date is found
                            if(foundInList == false){
                                for (let index = 0; index < treatments.length; index++) {
                                    //if the therapist is found
                                    if(treatments[index].toLowerCase() == Category.toLowerCase()){
                                        if(duration){
                                            Data[index]+=parseFloat(duration);
                                            DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                            count++;
                                            break;

                                        }
                                    }
                                }
                            }
                        }    
                    //for months
                    }else{
                        var monIndex = 0;
                        for (let index = 0; index < monthly.length; index++) {
                            if(monthly[index] == myYear.substring(0,3)){
                                    if(index < 9){
                                        monIndex = "0"+parseInt(index+1);
                                    }else{
                                        monIndex = index+1;
                                    }
                                    break;
                                }
                        }
                        var newDate = date.split("-");
                        var found = false;
                        //for the chosen year and month
                        if (monIndex == newDate[1]){
                            for (let index = 0; index < treatmentsDocument.length; index++) {
                                //if the therapist is found
                            //    if(beauticianDocuments[index] == therapist){
                                    for (let x = 0; x < DateTreatment.length; x++) {
                                        if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                            found=true;
                                            break;
                                        }
                                    }
                                //}
                            }
                                var foundInList = new Boolean(found);
                                //if the treatment & date is found
                                if(foundInList == false){
                                    for (let index = 0; index < treatments.length; index++) {
                                        //if the therapist is found
                                        if(treatments[index].toLowerCase() == Category.toLowerCase()){
                                            if(duration){
                                                    Data[index]+=parseFloat(duration);
                                                    DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                                    count++;
                                                    break;
                                            }
                                        }
                                    }
                                }        
                        }
                    }

                }
            }   
        });
        ServicesChart(treatments,Data);
        
    });
        //console.log("my chart data",Data);
        //performanceChart(Data,Labels);
}
//Day/Weekly selection
function dayWeeklyServices(){
    var TimeFrame = document.getElementById("time");
    var mytime = TimeFrame.options[TimeFrame.selectedIndex].innerHTML;
    var DateFrame = document.getElementById("date");
    var selectedDate = DateFrame.value;
    //get documents
    var count = 0;
    var Data = [];
    var DateTreatment = [];
    //initialize Data
    for (let index = 0; index < treatmentsDocument.length; index++) {
        Data[index] = 0;
    }
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var duration= items.defaultDuration;
            var therapist= items.beauticianId;
            var treatment = items.treatment;
            var Category = items.category;
            var date = items.date;
            var time = items.time;
            var bdDate = new Date(date+" 00:00:00");
            var now = new Date(getCurrentDate().replace(/\//g,'-')+" "+getCurrentTime());
            var Category = items.category;
            var isCancelled = new Boolean(Cancelled);
            if(isCancelled == false){
                //allow only past dates
                if(now.getTime()>=bdDate.getTime()){
                    //for the chosen year
                    if(mytime == "Daily"){
                        //if the fall in the same year
                        if (date == selectedDate){
                            var found = false;
                            //if the therapist is found
                            for (let x = 0; x < DateTreatment.length; x++) {
                                if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                    found=true;
                                    break;
                                }
                            }
                            var foundInList = new Boolean(found);
                            //if the treatment & date is found
                            if(foundInList == false){
                                for (let index = 0; index < treatments.length; index++) {
                                    //if the therapist is found
                                    if(treatments[index].toLowerCase() == Category.toLowerCase()){
                                        if(duration){
                                            //Determine Date time
                                                    Data[index]+=parseFloat(duration);
                                                    DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                                    count++;
                                                    break;
                                                //}
                                                
                                            //}
                                        }
                                    }
                                }
                            }
                        }    
                    //for months
                    }else{
                        //Determine Date time
                        var newDate = new Date(selectedDate.replace(/\//g,'-')+" "+getCurrentTime());
                        var WeekPrior = new Date(newDate).setDate(newDate.getDate() - 7);
                        dateFrom = new Date(WeekPrior);
                        dateTo = newDate = new Date(selectedDate.replace(/\//g,'-')+" "+getCurrentTime());
                        var weekBefore = new Date(WeekPrior);
                        var dBDate = new Date(date+" 00:00:01");
                        var found = false;
                        //if date is within this week
                        if ((dBDate.getTime() >= weekBefore.getTime()) && (dBDate.getTime() <=newDate.getTime())){
                            //if the therapist is found
                            for (let x = 0; x < DateTreatment.length; x++) {
                                if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                                    found=true;
                                    break;
                                }
                            }
                                var foundInList = new Boolean(found);
                                //if the treatment & date is found
                                if(foundInList == false){
                                    for (let index = 0; index < treatments.length; index++) {
                                        //if the therapist is found
                                        if(treatments[index].toLowerCase() == Category.toLowerCase()){
                                            if(duration){
                                                Data[index]+=parseFloat(duration);
                                                DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                                count++;
                                                break;
                                            }
                                        }
                                    }
                                }        
                        }
                    }

                }
            }
        });
        ServicesChart(treatments,Data);     
    });



}
//Services chart
function ServicesChart(Labels,Data){
    var ctx = document.getElementById('servicesChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Labels,
            datasets: [{
                label: 'Performance of services',
                data: Data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(10, 20, 74, 0.2)',
                    'rgba(0, 120, 214, 0.2)',
                    'rgba(100, 120, 214, 0.2)',
                    'rgba(55, 10, 104, 0.2)',
                    'rgba(182, 109, 01, 0.2)',
                    'rgba(23, 45, 30, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(10, 20, 74, 1)',
                    'rgba(0, 120, 214, 1)',
                    'rgba(100, 120, 214, 1)',
                    'rgba(55, 10, 104, 1)',
                    'rgba(182, 109, 01, 1)',
                    'rgba(23, 45, 30, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            }
        }
    });
    /*var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Labels,
            datasets: performanceData
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        //suggestedMin: 50,
                        beginAtZero: true
                    }
                }]
            }
        }
      });  */ 
}
//Therapist per hour CHART *&&&&*&##@@@@@@@@@@@@@@@@@&&&&&&&&&&&&&&&^^^^^^^^^^^^^^^^^^^^^^
function TherapistPerformance(){
    //get documents
    var count = 0;
    var Data = [];
    var DateTreatment = [];
    var myYear = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    //initialize Data
    for (let index = 0; index < monthly.length; index++) {
        Data[index] = 0;
    }
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var duration= items.defaultDuration;
            var therapist= items.beauticianId;
            var treatment = items.treatment;
            var date = items.date;
            var time = items.time;
            var Category = items.category;
            var Cancelled = items.cancelled;
            var isCancelled = new Boolean(Cancelled);
            if(isCancelled == false){
                //check months index
                var monIndex = getCurrentDate().replace(/\//g,'-').split("-");
                var newDate = date.split("-");
                var found = false;
                if(monIndex[0] == newDate[0]){
                    //if the therapist is found
                    //if(beauticianDocuments[index] == therapist){
                    //Data[count] = 
                    for (let x = 0; x < DateTreatment.length; x++) {
                        if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                            found=true;
                            break;
                        }
                    }
                    var foundInList = new Boolean(found);
                    //if the treatment & date is found
                    if(foundInList == false){
                        for (let index = 0; index < monthly.length; index++) {
                        //if the therapist is found
                            if(newDate[1] == (index+1)){
                                if(duration){
                                    Data[index]+=parseFloat(duration);
                                    DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                    count++;
                                    break;
                                    
                                }
                            }
                        }
                    }        
                }
                count++;
            }
        });
        TherapistPerformanceChart(monthly,Data);
    });


}
//performance chart
function TherapistPerformanceChart(Labels,Data){
    var ctx = document.getElementById('allHoursChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: Labels,
            datasets: [{
                label: 'Performance of services',
                data: Data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(10, 20, 74, 0.2)',
                    'rgba(0, 120, 214, 0.2)',
                    'rgba(100, 120, 214, 0.2)',
                    'rgba(55, 10, 104, 0.2)',
                    'rgba(182, 109, 01, 0.2)',
                    'rgba(23, 45, 30, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(10, 20, 74, 1)',
                    'rgba(0, 120, 214, 1)',
                    'rgba(100, 120, 214, 1)',
                    'rgba(55, 10, 104, 1)',
                    'rgba(182, 109, 01, 1)',
                    'rgba(23, 45, 30, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            }
        }
    });
    //set performance contribution
    var total = 0;
    var contribution = document.getElementById('hoursList');
    var count = 0;
    //get total
    for (let index = 0; index < Data.length; index++) {
        total+=Data[index];
    }
    //set analysis
    for (let index = 0; index < Data.length; index++) {
        var newColor;
        if(Data[index]>0){
            count++;
            var opt = document.createElement('small');
            opt.value = index;
            var percentage = parseInt((Data[index]/total)*100);
            //console.log(percentage);
            if (percentage<= 20){
                newColor = "Red";
            }else if (percentage > 20 && percentage <= 40){
                newColor = "maroon";
            }else if (percentage > 40 && percentage <= 60){
                newColor = "blue";
            }else if (percentage > 60 && percentage <= 80){
                newColor = "green";
            }else{
                newColor = "lime";
            }
        opt.innerHTML = count+". "+Labels[index]+" - <font color = '"+newColor+"'>"+parseFloat((Data[index]/total)*100).toFixed(2) + "%</font><br>";
        contribution.appendChild(opt);
        }
    }
}
//Popular Treatments CHART *&&&&*&##@@@@@@@@@@@@@@@@@&&&&&&&&&&&&&&&^^^^^^^^^^^^^^^^^^^^^^
//show popular treatments
function TreatmentPerformance(){
    //get documents
    var count = 0;
    var Data = [];
    var DateTreatment = [];
    //initialize Data
    for (let index = 0; index < treatmentsDocument.length; index++) {
        Data[index] = 0;
    }
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var duration= items.defaultDuration;
            var therapist= items.beauticianId;
            var treatment = items.treatment;
            var date = items.date;
            var time = items.time;
            var Category = items.category;
            var Cancelled = items.cancelled;
            var isCancelled = new Boolean(Cancelled);
            if(isCancelled == false){
                //allow only past dates
                if(date.substring(0,4) == getCurrentDate().substring(0,4)){
                    var found = false;
                    //if the therapist is found
                    for (let x = 0; x < DateTreatment.length; x++) {
                        if(DateTreatment[x] == date+"~"+treatment+"~"+therapist){
                            found=true;
                            break;
                        }
                    }
                    var foundInList = new Boolean(found);
                    //if the treatment & date is found
                    if(foundInList == false){
                        for (let index = 0; index < treatments.length; index++) {
                            //if the therapist is found
                            if(treatments[index].toLowerCase() == Category.toLowerCase()){
                                if(duration){
                                    Data[index]+=parseFloat(duration);
                                    DateTreatment[count]= date+"~"+treatment+"~"+therapist;
                                    count++;
                                    break;

                                }
                            }
                        }
                    }
                }
            }
        });
        TreatmentPerformanceChart(treatments,Data);
    });

}
//performance chart
function TreatmentPerformanceChart(Labels,Data){
    var ctx = document.getElementById('allTreatmentChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Labels,
            datasets: [{
                label: 'Most Popular Treatments',
                data: Data,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    'rgba(10, 20, 74, 0.2)',
                    'rgba(0, 120, 214, 0.2)',
                    'rgba(100, 120, 214, 0.2)',
                    'rgba(55, 10, 104, 0.2)',
                    'rgba(182, 109, 01, 0.2)',
                    'rgba(23, 45, 30, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(10, 20, 74, 1)',
                    'rgba(0, 120, 214, 1)',
                    'rgba(100, 120, 214, 1)',
                    'rgba(55, 10, 104, 1)',
                    'rgba(182, 109, 01, 1)',
                    'rgba(23, 45, 30, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }],
            }
        }
    });
    //set performance contribution
    var total = 0;
    var contribution = document.getElementById('TreatmentList');
    var count = 0;
    //get total
    for (let index = 0; index < Data.length; index++) {
        total+=Data[index];
    }
    //set analysis
    for (let index = 0; index < Data.length; index++) {
        var newColor = "";
        if(Data[index]>0){
            count++;
            var opt = document.createElement('small');
            opt.value = index;
            var percentage = parseInt((Data[index]/total)*100);
            if (percentage<= 20){
                newColor = "Red";
            }else if (percentage > 20 && percentage <= 40){
                newColor = "maroon";
            }else if (percentage > 40 && percentage <= 60){
                newColor = "blue";
            }else if (percentage > 60 && percentage <= 80){
                newColor = "green";
            }else{
                newColor = "lime";
            }
        opt.innerHTML = count+". "+Labels[index]+" - <font color = '"+newColor+"'>"+parseFloat((Data[index]/total)*100).toFixed(2) + "%</font><br>";
        contribution.appendChild(opt);
        }
    }
}
//Sales section*******&&&&&&&&&&&&&&&&&&&&&&&##################%%%%%%%%^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
function viewSales(){
    //clear time indicator interval
    clearInterval(intervalTime);
    var MainWindow = document.getElementById("mainwindow");
    MainWindow.style.backgroundColor = "#FFFFFF";
    MainWindow.style.backgroundImage = "none";
    $(".main").load("/sales.html",function(){
        $(document).ready(
            function(){
                var selectedDate = document.getElementById("date");
                selectedDate.value = getCurrentDate().replace(/\//g,'-');
                var Year = document.getElementById("year");
                Year.disabled = true;
                //allocate first daily sales
                allocateSales("Daily",selectedDate.value,"");
                
        });
    });
}
var bookingYears = [];
//function to set Sales Data
function allocateSales(Category,newDate,year){
    console.log(year);
    localStorage.setItem("salesFrame",Category+"~"+newDate+"~"+year);
    //get documents
    bookingYears = [];
    var count = 0;
    var Treatments = [];
    var Sales = [];
    var Therapists = [];
    var Monthly = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    var selected_id = localStorage.getItem("selected_id");//spa
    FireStoreDatabase.collection(selected_id+"_bookings").get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
            let items = doc.data();
            /* Make data suitable for rendering */
            var date = items.date;
            var treatment = items.treatment;
            var duration = items.defaultDuration;
            var from = items.startTime;
            var to = items.endtime;
            var therapist= items.beauticianName;
            var client = items.clientName;
            var price = items.amount;
            var Cancelled = items.cancelled;
            //if they were not cancelled bookings
            if(!Cancelled){
                //check dates
                var selected = date.split("-");
                var selectedMon = selected[1];
                var selectedYear = selected[0];
                //load years
                if(year == "" || year == selectedYear){
                    var found = false;
                    for (let index = 0; index < bookingYears.length; index++) {
                        if(bookingYears[index] == selectedYear){
                            found = true;
                            break;
                        }
                    }
                    var isFound = new Boolean(found);
                    if(isFound == false){
                        bookingYears[bookingYears.length] = selectedYear;
                    }
                    //check if it's daily
                    if(Category == "Daily"){
                        if(newDate == date){
                            Treatments[Treatments.length] = date+"~"+treatment+"~"+duration+"~"+from+" - "+to+"~"+therapist+"~"+client+"~"+price;
                        }
                    //check if it's monthly
                    }else if(Category == "Monthly"){
                        var mon = 0;
                        for (let index = 0; index < Monthly.length; index++) {
                            if (newDate == Monthly[index]){
                                mon = index+1;
                                break;
                            }
                        }
                        if(selectedMon == mon){
                            Treatments[Treatments.length] = date+"~"+treatment+"~"+duration+"~"+from+" - "+to+"~"+therapist+"~"+client+"~"+price;
                        }
                    //check if it's yearly
                    }else{
                        if(Category == "Yearly"){
                            if(newDate == selectedYear){
                                Treatments[Treatments.length] = date+"~"+treatment+"~"+duration+"~"+from+" - "+to+"~"+therapist+"~"+client+"~"+price;
                            }
                        }

                    }
                    count++;
                }else{
                    var found = false;
                    for (let index = 0; index < bookingYears.length; index++) {
                        if(bookingYears[index] == selectedYear){
                            found = true;
                            break;
                        }
                    }
                    var isFound = new Boolean(found);
                    if(isFound == false){
                        bookingYears[bookingYears.length] = selectedYear;
                    }
                }
            }        
        })
        //sort array
        Treatments.sort();
        //Transactions Table
        var table = document.getElementById("dtBasicExample");
        var body = document.getElementById("salesTable");
        var Tbody = document.getElementById("therapistsTable");
        var Button = document.getElementById("print");
        if(Treatments.length == 0){
            //create a row
            var row = body.insertRow(0);
            var Row = Tbody.insertRow(0);
            //insert cells
            var cell_1 = Row.insertCell(0);
            var cell_2 = Row.insertCell(0);
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            var cell3 = row.insertCell(2);
            var cell4 = row.insertCell(3);
            var cell5 = row.insertCell(4);
            var cell6 = row.insertCell(5);
            var cell7 = row.insertCell(6);
            // Add some text to the new cells:
            cell_1.innerHTML = "***";
            cell_2.innerHTML = "***";
            cell1.innerHTML = "***";
            cell2.innerHTML = "***";
            cell3.innerHTML = "***";
            cell4.innerHTML = "No Sales for the selected category";
            cell5.innerHTML = "***";
            cell6.innerHTML = "***";
            cell7.innerHTML = "***";
            Button.disabled = true;
        }else{
            localStorage.setItem("Treatments",Treatments);
            Treatments[Treatments.length] = 0;
            Treatments[Treatments.length] = 0;
            var counter = 0;
            //set transactions to the table
            for (let index = 0; index < Treatments.length; index++) {
                if(Treatments[index] == 0){
                var row = body.insertRow(index);
                //insert cells
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);
                var cell7 = row.insertCell(6);
                // Add some text to the new cells:
                cell1.innerHTML = " ";
                cell2.innerHTML = " ";
                cell3.innerHTML = " ";
                cell4.innerHTML = " ";
                cell5.innerHTML = " ";
                    
                if (counter ==0){
                    cell6.innerHTML = "<p></p>";
                    cell7.innerHTML = " ";
                }else{
                    cell6.innerHTML = "<b>Total</b>";
                    //Calculate Totals
                    var amount = 0;
                    for (let x = 0; x < Sales.length; x++) {
                        var getAmount = Sales[x].split(" ");
                        amount+=parseFloat(getAmount[1]);
                    }
                    cell7.innerHTML = "<strong><font color = 'purple'>R "+amount+"</font></strong>";
                }
                counter++;

                }else{
                    //get values
                    var values = Treatments[index].split("~");
                    //create a row
                    var row = body.insertRow(index);
                    //insert cells
                    var cell1 = row.insertCell(0);
                    var cell2 = row.insertCell(1);
                    var cell3 = row.insertCell(2);
                    var cell4 = row.insertCell(3);
                    var cell5 = row.insertCell(4);
                    var cell6 = row.insertCell(5);
                    var cell7 = row.insertCell(6);
                    // Add some text to the new cells:
                    cell1.innerHTML = values[0];
                    cell2.innerHTML = values[1];
                    cell3.innerHTML = values[2]+" Hours";
                    cell4.innerHTML = values[3];
                    cell5.innerHTML = values[4];
                    cell6.innerHTML = values[5];
                    cell7.innerHTML = values[6];
                    //sales 
                    Sales[index] = values[6];
                    //therapists
                    Therapists[index] = values[4];
                } 
                localStorage.setItem("Sales",Sales);
                localStorage.setItem("Therapists",Therapists);
            }
            Button.disabled = false;
        }
        var therfound = false;
        var therfoundAt = 0;
        var therapistAmount = [];
        var therapistName = [];
        //set Therapists Table
        for (let i = 0; i < Therapists.length; i++) {
            for (let j = 0; j < therapistName.length; j++) {
                //check availability
                if(Therapists[i] == therapistName[j]){
                    therfoundAt = j;
                    therfound = true;
                    break;
                }
            }
            var foundTher = new Boolean(therfound);
            if(foundTher==true){
                var amount = parseFloat(therapistAmount[therfoundAt].substring(2,therapistAmount[therfoundAt].length)) + parseFloat(Sales[i].substring(2,Sales[i].length));
                therapistAmount[therfoundAt] = "R "+amount;
                therfound = false;
            }else{
                therapistName[therapistName.length] = Therapists[i];
                therapistAmount[therapistAmount.length] = Sales[i];
            }                  
        }
        localStorage.setItem("TherapistName",therapistName);
        localStorage.setItem("TherapistAmount",therapistAmount);
        //show Therapists
        var Tbody = document.getElementById("therapistsTable");
        for (let index = 0; index < therapistName.length; index++) {
            var row = Tbody.insertRow(index);
            //insert cells
            var cell1 = row.insertCell(0);
            var cell2 = row.insertCell(1);
            // Add some text to the new cells:
            cell1.innerHTML = therapistName[index];
            cell2.innerHTML = "<strong><font color = 'purple'>"+therapistAmount[index]+"</font></strong>";
                         
        }
    });
}
//function to print Sales
function printSales(){
    var params = [
        'height='+screen.height,
        'width='+screen.width,
        'fullscreen=yes' // only works in IE, but here for completeness
    ].join(',');
    window.open("https://myspa-5b893.firebaseapp.com/previewsales.html?","",params);
    //window.open("http://localhost:5000/previewsales.html?","",params);
    //localStorage.setItem("Notes",notes);
    //localStorage.setItem("Image",image);
}
//Determine Sales Category Time frame
function SalesTimeFrame(event){
    //clear table
    $("#salesTable").empty();
    $("#therapistsTable").empty();
    var TimeFrame = document.getElementById("time");
    if(TimeFrame[this.selectedIndex].innerHTML == "Yearly"){
        $("#year").empty();
        $("#years").empty();
        //ad years to the list
        var Year = document.getElementById("year");
        var Years = document.getElementById("years");
        for (var i = 0; i<bookingYears.length; i++){
            //for year element
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = bookingYears[i];
            Year.appendChild(opt);
            //for years element
            var option = document.createElement('option');
            option.value = i;
            option.innerHTML = bookingYears[i];
            Years.appendChild(option);
        }
        //hide Years
        Years.hidden = true;
        //enable years
        var SelectYear = document.getElementById("year");
        SelectYear.disabled = false;
        //disable date
        var selectedDate = document.getElementById("date");
        selectedDate.disabled = true;
        selectedDate.hidden = false;
        var DateField = document.getElementById("datefield");
        DateField.innerHTML = "Date<font color = 'red'> *</font>";
        //adding selection
        var YearField = document.getElementById("yearfield");
        YearField.innerHTML = "Select Year:<font color = 'red'> *</font>";
        //set Default
        allocateSales("Yearly",bookingYears[0], "");
    }else if(TimeFrame[this.selectedIndex].innerHTML == "Monthly"){
        $("#year").empty();
        $("#years").empty();
        //add years to the list
        var Years = document.getElementById("years");
        for (var i = 0; i<bookingYears.length; i++){
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = bookingYears[i];
            Years.appendChild(opt);
        }
        //show Years
        Years.hidden = false;
        //enable years
        var SelectYear = document.getElementById("year");
        SelectYear.disabled = false;
        //disable date
        var selectedDate = document.getElementById("date");
        selectedDate.disabled = true;
        selectedDate.hidden = true;
        //Changing description
        //adding months
        var DateField = document.getElementById("datefield");
        DateField.innerHTML = "Select Year:<font color = 'red'> *</font>";
        //adding months
        var YearField = document.getElementById("yearfield");
        YearField.innerHTML = "Select Months:<font color = 'red'> *</font>";
        var SelectYear = document.getElementById("year");
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        for (var i = 0; i<months.length; i++){
            var opt = document.createElement('option');
            opt.value = i;
            opt.innerHTML = months[i];
            SelectYear.appendChild(opt);
        }
        //set Default
        allocateSales("Monthly",months[0],Years[Years.selectedIndex].innerHTML);
    }else{
        //add years to the list
        var Years = document.getElementById("years");
        //hide Years
        Years.hidden = true;
        var DateField = document.getElementById("datefield");
        DateField.innerHTML = "Date<font color = 'red'> *</font>";
        //disable date
        var selectedDate = document.getElementById("date");
        selectedDate.disabled = false;
        selectedDate.hidden = false;
        //adissable years
        var SelectYear = document.getElementById("year");
        SelectYear.disabled = true;
        //initiate the day
        selectedDate.value = getCurrentDate().replace(/\//g,'-');
        //set Default
        allocateSales("Daily",selectedDate.value,"");
    }

}
//reload Sales for selected year/month
function salesYMReload(event){
    //clear table
    $("#salesTable").empty();
    $("#therapistsTable").empty();
    var TimeFrame = document.getElementById("time");
    var YearMonth = document.getElementById("year");
    var Years = document.getElementById("years");
    if(Years.hidden == true){
        allocateSales(TimeFrame[TimeFrame.selectedIndex].innerHTML,YearMonth[this.selectedIndex].innerHTML,"");
    }else{
        allocateSales(TimeFrame[TimeFrame.selectedIndex].innerHTML,YearMonth[this.selectedIndex].innerHTML,Years[Years.selectedIndex].innerHTML);
    }
}
//reload Sales for selected year/month
function salesYearsReload(event){
    //clear table
    $("#salesTable").empty();
    $("#therapistsTable").empty();
    var TimeFrame = document.getElementById("time");
    var YearMonth = document.getElementById("year");
    var Years = document.getElementById("years");
    allocateSales(TimeFrame[TimeFrame.selectedIndex].innerHTML,YearMonth[YearMonth.selectedIndex].innerHTML,Years[this.selectedIndex].innerHTML);
}
//reload Sales for selected year/month
function salesDayReload(event){
    //clear table
    $("#salesTable").empty();
    $("#therapistsTable").empty();
    var TimeFrame = document.getElementById("time");
    var selectedDate = document.getElementById("date");
    allocateSales(TimeFrame[TimeFrame.selectedIndex].innerHTML,selectedDate.value,"");
}
//function to hide information Table
function hideInfoShowBookings(){
    //Hide info section
    var BookingInfoSection = document.getElementById("Bookinfo");
    if(BookingInfoSection){
        BookingInfoSection.style.display = "none";
    }
    //Extend Booking Table
    var BookingTableSection = document.getElementById("BookTable");
    if(BookingTableSection){
        BookingTableSection.className = "form-group col-md-12";
    }
}
//function to show information Table
function showInfoShowBookings(){
    //show info section
    var BookingInfoSection = document.getElementById("Bookinfo");
    if(BookingInfoSection.style.display === "none"){
        BookingInfoSection.style.display = "block";
        BookingInfoSection.className = "form-group col-md-3";
    }
    
    //Extend Booking Table
    var BookingTableSection = document.getElementById("BookTable");
    BookingTableSection.className = "form-group col-md-9";
}
//Therapist Book Off
function BookOff(){
     //get the selected date
     var selectedDate = document.getElementById("date");
     selectedDate.value = getCurrentDate().replace(/\//g,'-');
     var name = document.getElementById("t_name");
     var value = name.innerHTML.split('<span hidden="">');
     var Name = value[0];
     var getDocument = value[1].split("<");
     var Document = getDocument[0];
    //first get Table therapists bookings
    //first get Therapist
    var headerName;
    var headerDoc;
    var headerIndex;
    var Columns = document.getElementById("dtBasicExample").rows[0].cells.length;
    for (let index = 0; index < Columns; index++) {
        var Header = document.getElementById("dtBasicExample").rows[0].cells[index].innerHTML;
        var getHeader = Header.split('<span hidden="">');
        var TherapistHeader = getHeader[0];
        if(getHeader[1]){
            var getDocument = getHeader[1].split("</");
            if(Name == TherapistHeader){
                headerIndex = index;
                break;
            }
        }
        
    }
    cellRows = 156; 
    var hasContents = false;
    for (let i = 0; i < cellRows; i++) {
        var booking = document.getElementById("dtBasicExample").rows[i+1].cells[headerIndex].innerHTML;
        if(booking!=""){
            hasContents = true;
        }
        
    }
    var hasBookings = new Boolean(hasContents);
    //close modal
    var Close = document.getElementById("closet");
    Close.click();
    if(hasBookings == true){
        closeDialogShowError("Kindly Move/Cancel "+Name+"'s bookings before booking him/her off.");
    }else{
        //update values
        //get stored patient information
        var selected_id = localStorage.getItem("selected_id");//dr
        var docRef = FireStoreDatabase.collection(selected_id+"_beauticians").doc(Document);
        var updateOffDate =  "OffDay_"+getCurrentDate().replace(/\//g,'-');
        var Button = document.getElementById("off");
        var off = true;
        if(Button.className == "btn btn-lg btn-success btn-block text-center mb-3"){
            off = false;
        }
        $("#progress").show();
        return docRef.update({
            //update status
            [updateOffDate]:off,
        })
        .then(function() {
            $("#progress").hide();
            var Bookings = document.getElementById("viewbookings");
            Bookings.click();
            //$("#progress").hide();
            //click View Beauticians link
            //var Beaut = document.getElementById("viewbeuaticians");
            //Beaut.click();
            //closeDialogShowSuccess();
        })
        .catch(function(error) {
            $("#progress").hide();
            // The document probably doesn't exist.
            closeDialogShowError(error);
        });
    }
}
var closeCounter;
//fill up autocomplete textbox
function fillUpComplete(myList,docs,gender){
    var isSet = false;
    clearDialog();
    function initDialog(){
        for (let index = 0; index < myList.length; index++) {
            $('.listDialog').append('<div id="client_'+index+'">' + myList[index]+'</div>');
        }
    }
    function clearDialog(){
        $('.listDialog').empty();
    }
    $(".autocomplete #input").click(function(){
        if(!isSet){
            $('.listDialog').addClass('open');
        }

    });
    $('body').on('click','.listDialog > div', function(){
        $(".autocomplete input").val($(this).text()).focus();
        $(".autocomplete .close").addClass('visible');
        var ClientDocument = document.getElementById("clienDoc");
        var ClientGender= document.getElementById("clienGender");
        var index = this.id.split("_");
        var content = parseInt(index[1])
        ClientDocument.value = docs[content];
        ClientGender.value = gender[content];
        isSet = true;
        closeCounter = 0;
    });
    
    $(".autocomplete .close").click(function(){
        if(closeCounter == 0){
            if(isSet){
                clearDialog();
                initDialog();
            }
            isSet = false;
            $('.listDialog').addClass('open');
            $(".autocomplete input").val('').focus();
            $(this).removeClass('visible');
            expandMajorDialog();
        }
        closeCounter++;
        
    });
    function match(str){
        str = str.toLowerCase();
        clearDialog();
        for (let i = 0; i < myList.length; i++) {
            if(myList[i].toLowerCase().startsWith(str)){
                $('.listDialog').append('<div id="client_'+i+'">' + myList[i]+'</div>');
            }
        }
    }
    $(".autocomplete input").on("input", function(){
        $('.listDialog').addClass('open');
        isSet = false;
        match($(this).val());
    });
    $('body').click(function(e){
        if(!$(e.target).is("input, .close")){
            var Dialog = document.getElementsByClassName("listDialog open");
            if(Dialog[0]){
                var openAvail = Dialog[0].className.split(" ");
                if(openAvail[1]){
                    $('.listDialog').removeClass('open');
                    //remove Xtra height
                    contractMajorDialog()
                }
            }
        }
    });
    $(".autocomplete input").on("change", function(){
        if(!isSet){
            $(".autocomplete input").val('');
            //clearDialog();
            //initDialog();
            //$('.listDialog').removeClass('open');
        }
    });
    $(".autocomplete input").on("click", function(){
        var Dialog = document.getElementsByClassName("listDialog");
        if(Dialog[0]){
            var openAvail = Dialog[0].className.split(" ");
            if(!openAvail[1]){
                if($(".autocomplete input").val()==""){
                    var BookDialog = document.getElementById("Bookingcenter");
                    clearDialog();
                    initDialog();
                    $('.listDialog').addClass('open');
                    expandMajorDialog();
                }

            }
        }
    });
    function searchedClient(){
        $('body').on('click','.listDialog > div', function(){
            $(".autocomplete input").val($(this).text()).focus();
            $(".autocomplete .close").addClass('visible');
            var ClientDocument = document.getElementById("clienDoc");
            var ClientGender= document.getElementById("clienGender");
            var index = this.id.split("_");
            var content = parseInt(index[1])
            ClientDocument.value = docs[content];
            ClientGender.value = gender[content];
            isSet = true;
            myBookWindow.style.height = BookWindow;
        });

    }
    function expandMajorDialog(){
        var BookDialog = document.getElementById("Bookingcenter");
        var removePX = BookDialog.style.height.substring(0,BookDialog.style.height.length - 2)
        BookDialog.style.height = (parseInt(removePX) + 320)+"px";

    }
    function contractMajorDialog(){
        var BookDialog = document.getElementById("Bookingcenter");
        var removePX = BookDialog.style.height.substring(0,BookDialog.style.height.length - 2)
        BookDialog.style.height = (parseInt(removePX) - 320)+"px";

    }

    initDialog();

}
var Results
//fucntion to check if firebase is still connected
function isFirebaseConnected(){
    //FireStoreDatabase = firebase.firestore();
    //var connectedRef = firebase.database().ref(".info/connected");
    var firebaseRef = new Firebase('https://myspa-5b893.firebaseio.com');
    firebaseRef.child('.info/connected').on('value', function(snap) {
        if (snap.val() === true) {
            results = true;
        } else {
            results = false;
        }
        setTimeout(function () {
            if(!results && Results != ""){
                var MainWindow = document.getElementById("mainwindow");
                MainWindow.style.backgroundColor = "#FFFFFF";
                MainWindow.style.backgroundImage = "none";
                var headerWindow = document.getElementsByClassName("headerPage");
                headerWindow[0].style.backgroundColor = "#FFFFFF";
                headerWindow[0].style.backgroundImage = "block";
                headerWindow[0].hidden = false;
                MainWindow.hidden = true;
                $(".headerPage").show();
                $(".modal-backdrop").hide();
                /*$("#mainwindow").load("/404.html");
                $("#mainwindow").load("/404.html",function(){
                    $(document).ready(
                        function(){
                            //var Reload = document.getElementById("reload");
                            //Reload.hidden = false;
                    });
                });*/
                Results = "";
            }

            
            //do something once
          }, 5000);
    });
}

/*Password ammend & reset*/

//function to show password reset window
function viewPasswordChangeWindow(){
    $(document).ready(function(){
        $('#dialogPassword').modal('show');
        $("#currentpass").val('').focus();
        $('#newpassword').val('');
        $("#confirm_password").val('');
    });
}

//function to update password
function upDatePassword(){
    let user = firebase.auth().currentUser;
    //fields
    var currentPass = document.getElementById("currentpass");
    var newPass = document.getElementById("newpassword");
    var confirmPass = document.getElementById("confirm_password");
    var Email = localStorage.getItem("active_email");
    document.getElementById('currentpass').style.removeProperty('border');
    document.getElementById('newpassword').style.removeProperty('border');
    document.getElementById('confirm_password').style.removeProperty('border');
    //if fields are not empty
    if(currentPass.value && newPass.value && confirmPass.value){
        //if newly typed passwords are the same
        if(newPass.value == confirmPass.value){
            $("#progress").show();
            //creating credentials
            var credential = firebase.auth.EmailAuthProvider.credential(
                firebase.auth().currentUser.email,
                currentPass.value
            );
            var passvalue = currentPass.value;
            var Creds = (Email,passvalue);
            //reauthorize
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                //update password
                user.updatePassword(newPass.value).then(() => {
                    // Update successful.
                    $("#progress").hide();
                    var Close = localStorage.getItem("close");
                    Close.click();
                    closeDialogShowSuccess("Password successfully updated.");
                    }, (error) => {
                    // An error happened.
                    $("#progress").hide();
                    closeDialogShowError(error);
                    });

            }).catch(function(error) {
                $("#progress").hide();
                closeDialogShowError("Invalid password provided. "+  error);
            });
        }else{
            closeDialogShowError("Password mismatch!");
            newPass.focus();
            newPass.style.borderColor ="red";
            confirmPass.style.borderColor ="red";
        }
    }else{
        if(!currentPass.value){
            currentPass.style.borderColor ="red";
        }else if(!newPass.value){
            newPass.style.borderColor ="red";
        }else{
            confirmPass.style.borderColor ="red";
        }
    }

}
//function to reverify
function reverify(){
    firebaseConfig = {
        apiKey: "AIzaSyCl_RKUkkRjCGgs1fYE-ee3VZ9PvJZoOb4",
        authDomain: "myspa-5b893.firebaseapp.com",
        databaseURL: "https://myspa-5b893.firebaseio.com",
        projectId: "myspa-5b893",
        storageBucket: "myspa-5b893.appspot.com",
        messagingSenderId: "825775443939",
        appId: "1:825775443939:web:bb6734113073a015"
      };
      // Initialize Firebase
      var FireStoreDatabase;
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        }
    $("#progress").show();
    var user = firebase.auth().currentUser;
        user.sendEmailVerification().then(function() {
            // Email sent.
            closeDialogShowSuccess();
        }).catch(function(error) {
             // An error happened.
             closeDialogShowError("error :"+error.code + " : " + error);
    });                                  
}