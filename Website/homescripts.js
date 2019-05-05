
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
var myuid ="";
var database = firebase.database();
var mychoices=null;
var defaultflag = true;
var stockid = {
    Apple:"AAPL",
    Disney:"DIS",
    Google:"GOOGL",
    Microsoft:"MSFT",
    Netflix:"NFLX",
}
var stockdata=null;
/*
When user change occures, change like logout and login
*/
firebase.auth().onAuthStateChanged(function(user) {
    //if user isnt signed in, redirect to login page.
    if (!user) {
      console.log("No user is signed in.");
      window.location.href = "index.html";

    }else{
        console.log(user);
        myuid=user.uid;
        console.log("myuid is:"+myuid);

        var starCountRef = firebase.database().ref('users/' + myuid);
        starCountRef.on('value', function(snapshot) {
        let res = snapshot.val();
        console.log("my uid is"+myuid+"res is±:");
        console.log(res);
        //if theres no data in his database, then add the default option, aka he's subscribed to everything.
        if(res==null){
            var companies = {Tesla:1,
                Microsoft:1,
                Apple:1,
                Disney:1,
                Netflix:1,
                Google:1,
            };
            console.log("fikrst login");
            writeUserData(myuid,companies);
        }
        else{
            mychoices=res.stockchoices;
            let choicenames = Object.keys(mychoices);
            console.log(choicenames)
            for(let i =0;i<choicenames.length;i++){
                document.getElementsByName(choicenames[i])[0].checked = mychoices[choicenames[i]];
                console.log(choicenames[i]);
            }
            console.log("my choices are:");
            console.log(mychoices);
            if(stockdata==null){
                StocksToArray().then(res=>{
                    console.log("stocks to array has returned:");
                    console.log(res);
                    stockdata=res;
                    drawelements();
                    hideunselected(mychoices,0);
                });
            }
            else hideunselected(mychoices,1000);
        }

        });
    }
  });
console.log("mirfacl");
/*
logs the user out, used by the logout button.
*/
function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        window.location.href = "index.html";
      }).catch(function(error) {
        // An error happened.
      });
}
/*
userID - the users unique ID
choices- the choices the user chose (Apple,etc)

the function updates the database with his currect choices. 
*/
function writeUserData(userId,choices) {
    firebase.database().ref('/users/' + userId).set({
      stockchoices:choices
    });
}
function settings(){

}
/*
whenever the user clicks save settings in the setting page.
the function reads which checkboxes the user has checked then sends the data to the firebase server.
those are now his subscription choices.
*/
function savechanges(){
    var changed;
    console.log(document.getElementById("checkboxcontainer").children);
    let res={};
    for(let i=0;i<document.getElementById("checkboxcontainer").childElementCount;i++){
        // console.log(document.getElementById("checkboxcontainer").childNodes[i]);
        if(document.getElementById("checkboxcontainer").children[i].nodeName=="INPUT"){
            console.log(document.getElementById("checkboxcontainer").children[i].name);
            res[document.getElementById("checkboxcontainer").children[i].name]=document.getElementById("checkboxcontainer").children[i].checked;
        }
    }
    // console.log("oshrit is:");
    // console.log(oshrit);
    writeUserData(myuid,res);
}
/*
the stocks api we've downloaded, we aquired a key from Alpha vantage (the D9R3..... thing)

*/
var stocks = new Stocks('D9R3MV5JCOD9CKKS'); 
async function getstocks(id){
    console.log("obtaining "+id+"'s stocks");
    var result = await stocks.timeSeries({
        symbol: id,
        interval: 'monthly',
        amount: 100 
       });
       return result;
}
/*
returns a class with all the stocks for all companies.
looks abit like this:
{
    Blizzard:[...],
    Apple:[...],
    ...,
}
*/
async function StocksToArray(){
    let arr={};
    for(let i=0, stocknames=Object.keys(stockid);i<stocknames.length;i++){
        let data = await getstocks(stockid[stocknames[i]]);
        arr[stocknames[i]]=data;
    }
    return arr;
}

/*
This function all the stock market elements.
*/
function drawelements(){
    for(let i=0, stocknames=Object.keys(stockid);i<stocknames.length;i++){
        let res =stockdata[stocknames[i]];
        if(res){
            let reversed = res.reverse();
            let arrarr=[];
            let x=[];
            let y=[];
            for(let j=0;j<reversed.length;j++){
                arrarr.push([j,reversed[j].open]);
                x.push(j);
                y.push(reversed[j].open);
            }
            if(res.length!=0){
                //create element
                var chartname ="chart"+stocknames[i];
                var divname="index"+stocknames[i];
                var txt1 = // this is where we draw the stock elements
                `<div class="col" id="`+divname+`" style="background-image: repeating-radial-gradient(rgb(152,25 ,242 ),rgb(224,251,250),rgb(152,25 ,242 )">
                <b>`+stocknames[i]+"</b>"+`<p>open:`+res[0].open+`</p>
                <p>high:`+res[0].high+`<p>low:`+res[0].low+`</p>
                <p>close:`+res[0].close+`</p>
                <p>volume:`+res[0].volume+`</p>
                <p>date:`+res[0].date+`</p>
                <div id="`+chartname+`" style="width:600px;height:250px;"/>
                </div>
                `;              
                $(".mycontainer").append(txt1);      // Append the new elements
                plotter(chartname,x,y); 
            }else{
                var txt1 = `<div class="col" style="background:	linear-gradient(rgb(152,25 ,242 )">
                <p>Failed to load stock data</p></div>`;
                $(".mycontainer").append(txt1);
            }
        }
    }
}
//delete this.
function appendText() {
    var txt1 = "<p>Text.</p>";               // Create element with HTML  
    var txt2 = $("<p></p>").text("Text.");   // Create with jQuery
    var txt3 = document.createElement("p");  // Create with DOM
    txt3.innerHTML = "Text.";
    $("body").append(txt1, txt2, txt3);      // Append the new elements 
}

/*
displays stock elements that we're subscribed to, and hides the others.
*/
function hideunselected(selectedchoices,delay){
    console.log("In hideunselected, received:");
    console.log(selectedchoices);
    for(let i=0,choices = Object.keys(selectedchoices);i<choices.length;i++){
        let divname = "#index"+choices[i];
        if(selectedchoices[choices[i]]==true){
            console.log("Showing:"+choices[i]);
            console.log('$('+divname+').show(1000)');
            $(divname).show(delay);
        }
        else{
            console.log("Hiding:"+choices[i]);
            $(divname).hide(delay);
        }
    }
}
