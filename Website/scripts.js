function func(){
    console.log("bullshit");
}

firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("logged in");
        window.location.href = "home.html";
      // User is signed in.
    } 
  });

function signup(email,password){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        Swal.fire(
          'Error',
          errorMessage,
          'error'
        );
        // ...
    });
}
//signup("matan@rav.com","123123123");

function signin(){
    var email = document.getElementById("loginEmail").value;
    var password = document.getElementById("loginPassword").value;
    console.log(email+'\n'+password);
    
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        Swal.fire(
          'Error',
          errorMessage,
          'error'
        );
        // ...
      });
      
}

//signin("matan@rav.com","123123123");


function signup(){
    console.log("firing up");
    (async function getFormValues () {
        const {value: formValues} = await Swal.fire({
          title: 'Sign Up',
          html:
            '<input placeholder="Enter email" id="swal-input1" class="swal2-input">' +
            '<input placeholder="Enter Password" id="swal-input2" class="swal2-input">',
          focusConfirm: false,
          preConfirm: () => {
            return [
              document.getElementById('swal-input1').value,
              document.getElementById('swal-input2').value
            ]
          }
        })
        
        if (formValues) {

          var email = formValues[0];
          var password = formValues[1];
          console.log("the password is:"+password+'\n'+'the email is :'+email);
          var exceptionerror = null;
          firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            exceptionerror={errorCode,errorMessage};
            console.log(exceptionerror);
            // ...
          }).then(()=>{
            if(exceptionerror!=null){ 

                Swal.fire(
                  'Error',
                  exceptionerror.errorMessage,
                  'error'
                );
              }
              //login success
              else{
                Swal.fire(
                    'success',
                    'created account'+email,
                    'success'
                  );
              }
          });

        }
        })();
}

//signin("matan@rav.com","123123123");
