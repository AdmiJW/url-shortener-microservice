
const navbar = document.querySelector('nav');
const jumbotron = document.querySelector('.jumbotron');

const textTyperHTML = document.querySelector('#text-typer-title');

const formHTML = document.querySelector('#link_shorten_form');
const inputHTML = document.querySelector('#link__input');
const alertHTML = document.querySelector('#alert');
const alertTextHTML = document.querySelector('#alert__text');


//  Loading Messages
const LOADING_TEXTS = [
    'Travelling the Seven Seas...',
    'Generating diamond chunks...',
    'Tweeting "covfefe"...',
    '3 minutes until instant noodles are cooked...',
    "You're gonna have a bad time...",
    "Rushing B...",
    "Unblocking Cargoship from Suez Canal...",
    "Watching newest season of AOT...",
    "Waking the server up...",
    "Fighting the Ender Dragon...",
    "Connection Error!... Just Kidding",
    "The Bomb has been planted! ",
];


//====================================
//  Intersection Observer on Navbar
//====================================
const options = {
    threshold: 0.3
};

const observer = new IntersectionObserver((entries, self)=> {
    const { isIntersecting } = entries[0];
    
    if (isIntersecting) navbar.classList.remove('bg-visible');
    else navbar.classList.add('bg-visible');
}, options);

observer.observe(jumbotron);





//====================================
//  Text typer effect
//====================================
const tt = new TextTyper( textTyperHTML, {
    typeCPS: 10,
    deleteCPS: 25,
    cursorSettings: {
        blinkMode: TextTyper.CURSOR_BLINK_FLASH,
        cursorStyling: TextTyper.CURSOR_STYLE_Y
    }
});

tt.eventQueue()
    .typeText("https://www.example.com/this-is-a-very-long-url-that-is-very-hard-to-memorize")
    .standby(1000)
    .deleteChar(69)
    .standby(500)
    .typeText("admijw-simplurl.herokuapp.com/v/YES")
    .standby(5000)
    .deleteChar()
    .standby(1000)
    .loop()
    .start()



//==========================================================================================
//  Handle Link Submit - Prevent Default Behavior (no submit via POST, but use AJAX instead)
//==========================================================================================
formHTML.addEventListener('submit', (e)=> {
    e.preventDefault();
    
    const inputtedLink = inputHTML.value;

    //  Client side checking of URL
    if (!isValidHttpUrl(inputtedLink)) {
        showAlertMessage('failure', 'The link provided is not a valid URL!');
        return;
    }
    //  Check if the link is accidential click or attempts to loop back to the server
    if (inputtedLink.startsWith('https://admijw-simplurl.herokuapp.com') ) {
        showAlertMessage('failure', 'Noo don\'t loop back to myself :(');
        return;
    }

    //  Shrinks input field, show random loading text
    showAlertMessage('loading', LOADING_TEXTS[ Math.floor(Math.random() * LOADING_TEXTS.length) ] );
    inputHTML.classList.add('shrink');

    fetch('./api/shorturl/new', {
        method: 'POST',
        body: inputtedLink
    })
    .then(res => res.json() )
    .then(res => {
        //  Error occurred on the server side. Show it to the user
        if (res.error) {
            showAlertMessage('failure', `Oops, an error occurred: ${res.error}`);
        } 
        //  Otherwise, show success message, and set the link in input field
        else {
            showAlertMessage('success', 'Success! Your shortened link is as below: ');
            inputHTML.value = `https://admijw-simplurl.herokuapp.com/v/${res.short_url}`;
        }

        inputHTML.classList.remove('shrink');
    })
})




//======================================
//  Utilities 
//======================================
function isValidHttpUrl(string) {
    let url;
    try {
      url = new URL(string);
    } catch (_) {
      return false;  
    }
  
    return url.protocol === "http:" || url.protocol === "https:";
}


function showAlertMessage(status, string) {
    const statuses = ['success','failure','loading'];

    if ( statuses.indexOf(status) === -1 ) 
        throw `Invalid alertbox status! Accepted: ${statuses}`;

    alertHTML.classList.remove(...statuses);
    alertHTML.classList.add(status);
    alertTextHTML.textContent = string;
}