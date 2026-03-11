
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
        setTimeout(async () => {
            let aiBubble = document.createElement('div');
            try {
                // Notice the URL changed to Groq's endpoint
                const apiResponse = await fetch('/.netlify/functions/review', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({resume: inputText})
                });
                const data = await apiResponse.json();
                console.log(data);
                console.log("\n--- AI REVIEW ---");
                console.log(data.choices[0].message.content);
                console.log("-----------------\n");
                aiBubble.textContent = data.choices[0].message.content;
                aiBubble.className = "bg-light p-3 rounded mb-3 border w-75";
                chatArea.appendChild(aiBubble); //adds AI response within the ChatArea element
            } catch (error) {
                console.error("Error connecting to the API:", error);
            }
        }, 2000);
    }

});

const sidebar = document.querySelector('#sidebar');
const toggleBtn = document.querySelector('#toggleSidebarBtn');

//Event listener to toggle sidebar
toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('hidden');
});

