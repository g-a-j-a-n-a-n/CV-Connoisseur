
async function apiSearch(searchTerm) {
    const netlifyFuncionURL = "/.netlify/functions/search?q=";
    const options = {
        method: 'GET'
    };

    const repsonse = await fetch(netlifyFuncionURL, options);
    const data = await response.json();

    console.log(data);
}

const inputBox = document.querySelector('#resumeInput');
const sendBtn = document.querySelector('#reviewBtn');
const chatArea = document.querySelector('#chatArea');


sendBtn.addEventListener('click', () => {
    let inputText = inputBox.value;
    if(inputText.trim().length === 0) {
        return; //do nothing if empty input
    } else {
        let userBubble = document.createElement('div');
        userBubble.textContent = inputText;
        userBubble.className = "bg-primary text-white p-3 rounded mb-3 ms-auto w-75"; //adds bootstrap classes to userBubble
        chatArea.appendChild(userBubble); //adds user input within the ChatArea element
        inputBox.value = "";
        setTimeout(() => {
            let aiBubble = document.createElement('div');
            aiBubble.textContent = "Fake AI response";
            aiBubble.className = "bg-light p-3 rounded mb-3 border w-75";
            chatArea.appendChild(aiBubble); //adds AI response within the ChatArea element
        }, 2000);

    }

});

const sidebar = document.querySelector('#sidebar');
const toggleBtn = document.querySelector('#toggleSidebarBtn');

//Event listener to toggle sidebar
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
});

