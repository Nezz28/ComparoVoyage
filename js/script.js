fetch("https://jsonplaceholder.typicode.com/users")
.then(function(response){
    console.log(response)
    return response.json()

})


.then(function(data){
console.log(data)


const user = data [0]

console.log(user)

});