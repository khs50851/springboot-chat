let username = prompt("아이디를 입력하세요");
let roomNum = prompt("채팅방 번호를 입력하세요");

document.querySelector("#username").innerHTML = username;

// SSE연결
const eventSource = new EventSource(`http://localhost:8080/chat/roomNum/${roomNum}`);
eventSource.onmessage = (event)=>{
    console.log(1,event);
    const data = JSON.parse(event.data);
    if(data.sender === username){ // 로그인한 유저가 보낸 메세지
        // 파란박스
        initMyMessage(data);
    }else{
        // 회색박스(왼쪽)
        initYourMessage(data);
    }
    console.log(2,data);
}

// 파란박스
function getSendMsgBox(data){

    let md = data.createdAt.substring(5,10);
    let tm = data.createdAt.substring(11,16);
    convertTime = tm + "|"+md;

    return `<div class="sent_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
    </div>`;
}

// 회색 박스
function getReceivedMsgBox(data){
    return `<div class="received_withd_msg">
    <p>${data.msg}</p>
    <span class="time_date"> ${convertTime} / <b>${data.sender}</b></span>
    </div>`;
}

// 파란박스 초기화
function initMyMessage(data){
    let chatBox = document.querySelector("#chat-box");
 
    let sendBox = document.createElement("div");
    sendBox.className = "outgoing_msg";
    sendBox.innerHTML = getSendMsgBox(data);
    chatBox.append(sendBox);
    document.documentElement.scrollTop = document.body.scrollHeight;
}

// 회색박스 초기화
function initYourMessage(data){
    let chatBox = document.querySelector("#chat-box");
 
    let receivedBox = document.createElement("div");
    receivedBox.className = "received_msg";
    receivedBox.innerHTML = getReceivedMsgBox(data);
    chatBox.append(receivedBox);

    document.documentElement.scrollTop = document.body.scrollHeight;
    
}

// chat 메세지 전송
async function addMessage(){
    let msgInput = document.querySelector("#chat-outgoing-msg"); 
 
    let chat = {
        sender:username,
        roomNum:roomNum,
        msg:msgInput.value
    }

    let response = await fetch("http://localhost:8080/chat",{
        method:"post",
        body:JSON.stringify(chat), // javascript 오브젝트를 json문자열로 변경
        headers:{
            "Content-Type":"application/json;charset=utf-8"
        }
    });

    console.log(response);

    let parseResponse = await response.json();

    console.log(parseResponse);

    msgInput.value = "";
}



document.querySelector("#chat-send").addEventListener("click",()=>{
   // alert("클릭됨");
   addMessage();

});

document.querySelector("#chat-outgoing-msg").addEventListener("keydown",(e)=>{
    console.log(e.keyCode);
    if(e.keyCode === 13){
        addMessage();
    }

});