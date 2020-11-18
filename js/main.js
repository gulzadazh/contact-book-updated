// контактная книжка с использованием json-server, функция удаление, 
//редактирование, пагинация, поиск

let btn = $(".btn");
let inp1 = $(".contact-input1");
let inp2 = $(".contact-input2");
let inp3 = $(".contact-input3");
let list = $(".contact-list");
let page = 1;
let pageCount = 1;
let searchValue = "";



$(".search-inp").on("input", function(e){
    searchValue = e.target.value
    render()
})

function getPagination(){
    fetch("http://localhost:3000/contacts")
    .then(res => res.json())
    .then(data => {
        pageCount = Math.ceil(data.length / 2)
        $(".pagination-page").remove()
        for(let i = pageCount; i >= 1; i--){
            $(".previous-btn").after(`
            <span class="pagination-page">
            <a href="#" alt="...">
            ${i}
            </a>
            </span>
            `)
        }
    })
}
$("body").on("click", ".pagination-page", function(event){
    page = event.target.innerText
    render()
})

btn.on("click", function(){
    if(!inp1.val().trim() || !inp2.val().trim() || !inp3.val().trim()){
        alert("Please fill up the form")
        return
    }
    let newTask = {
        contact1: inp1.val(),
        contact2: inp2.val(), 
        contact3: inp3.val()
    }
    postNewTask(newTask)
    inp1.val("")
    inp2.val("")
    inp3.val("")
})

function postNewTask(newTask){
    fetch("http://localhost:3000/contacts", {
        method: "POST",
        body: JSON.stringify(newTask),
        headers: {
            "Content-Type": "application/json;charset=utf-8"
        }
    })
    .then(() => render())
}

function render(){
    fetch(`http://localhost:3000/contacts?_page=${page}&_limit=2&q=${searchValue}`)
    .then(response => response.json())
    .then(data => {
        getPagination()
        list.html("")
        data.forEach(item => {
            list.append(`
            <li id="${item.id}">
            ${item.contact1} 
            ${item.contact2} 
            ${item.contact3}
            <button class="btn-delete">Delete</button>
            <button class="btn-edit">Edit</button>
            </li>`)
        })
    })
}

$("body").on("click", ".btn-delete", function(event){
let id = event.target.parentNode.id
fetch(`http://localhost:3000/contacts/${id}`, {
    method: "DELETE"
})
.then(() => render())
})

$("body").on("click", ".btn-edit", function(event){
    let id = event.target.parentNode.id
    fetch(`http://localhost:3000/contacts/${id}`)
    .then(res => res.json())
    .then(data => {
        $(".edit-inp1").val(data.contact1)
        $(".edit-inp2").val(data.contact2)
        $(".edit-inp3").val(data.contact3)
        $(".btn-save").attr("id", id)
        $(".main-modal").css("display", "block")
    })
})

$('.btn-save').on("click", function(event){
    let id = event.target.id
    let editvalue1 = $(".edit-inp1").val()
    let editvalue2 = $(".edit-inp2").val()
    let editvalue3 = $(".edit-inp3").val()
    let obj = {
        contact1: editvalue1,
        contact2: editvalue2,
        contact3: editvalue3
    }
    fetch(`http://localhost:3000/contacts/${id}`, {
        method: "PUT",
        body: JSON.stringify(obj),
        headers: {"Content-type": "application/json"}
    })
    .then(() => {
        render()
        $(".main-modal").css("display", "none")
    })
})


$(".next-btn").on("click", function(){
    if(page >= pageCount) return
    page++
    render()
})

$(".previous-btn").on("click", function(){
    if(page <=1) return
    page--
    render()
})

render()