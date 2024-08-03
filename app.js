$(function() {
  let id = 1;
  const maxId = 30;

build(id);

  $('button').eq(1).click(function() {
    if (id !== maxId) {
      id += 1;
      build(id);
    } else {
      id = 1;
      build(id);
    }
  });

  $('button').eq(0).click(function() {
    if (id !== 1) {
      id -= 1;
      build(id);
    } else {
      id = maxId; 
      build(id);
    }
  });

  $('.posts').on("click", "h4", async function(){
    const postId = $(this).attr("id")
    console.log(postId)
    getModal(postId);
  });

  $(".posts").click("h3", function() {
    $(this).find("ul").slideUp();
    if ($(this).find("ul").is(":hidden")) {
      $(this).find("ul").slideDown();
    }
  });

  $(".todos").click("h3", function() {
    $(this).find("ul").slideUp();
    if ($(this).find("ul").is(":hidden")) {
      $(this).find("ul").slideDown();
    }
  });


  function getUser(id){
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url :`https://dummyjson.com/users/${id}`,
        dataType: "json",
        success:function(response){
          resolve(response)
        },
        error: function(error){
          reject(error)
        }
      })
    })
  }

  function getPosts(id){
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url :`https://dummyjson.com/users/${id}/posts`,
        dataType: "json",
        success:function(response){
          console.log(response)
          resolve(response.posts)
        },
        error: function(error){
          reject(error)
        }
      })
    })
  }

  function getTodos(id){
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url :`https://dummyjson.com/users/${id}/todos`,
        dataType: "json",
        success:function(response){
          resolve(response.todos)
        },
        error: function(error){
          reject(error)
        }
      })
    })
  }


  function getModal(postId) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: "GET",
        url: `https://dummyjson.com/posts/${postId}`,
        dataType: "json",
        success: function(response) {
          console.log(response);
  
          const modalContent = `
            <div class="modal">
              <h2>${response.title}</h2>
              <p>${response.body}</p>
              <p>Views: ${response.views}</p>
              <button class="modal-close">Close</button>
            </div>
          `;
  
          $('body').append(`
          <div class="overlay">
            ${modalContent}
          </div>
        `);

        $('.modal-close').click(function() {
          $('.overlay').remove(); 
        });
  
          resolve(response);
        },
        error: function(error) {
          reject(error);
        }
      });
    });
  }



  function build(id){
    async function userInfo(){
      const data = await getUser(id)
      $(".info__image img").attr("src", data.image);
      $(".info__content").html(`
      <h1>Name: ${data.firstName} ${data.lastName}</h1>
      <p>Age: ${data.age}</p>
      <p>Email: ${data.email}</p>
      <p>Phone: ${data.phone}</p>`
      );
      $('.posts').find('h3').text(
        `${data.firstName}'s Posts`
        )
      $('.todos').find('h3').text(
        `${data.firstName}'s Todos`
      )
    }

    async function posts(){
      const postData = await getPosts(id)
      const ulElement = $('.posts').find('ul');
      ulElement.empty(); 
      if(postData.length === 0){
  
        ulElement.html(`
        <p>User hsa no posts</p>
        `)
      }else{
      for (let i = 0; i < postData.length; i++) {
        const liElement = $('<li>')
        const postId = postData[i].id
        liElement.html(`<h4 id="${postId}">${postData[i].title}</h4>
        <p>${postData[i].body}</p>`);
        ulElement.append(liElement); 
      }
    }
    }

    async function todos(){
      const todoData = await getTodos(id)
      const ulElement = $('.todos').find('ul');
      ulElement.empty(); 
      if(todoData.length === 0){
        ulElement.html(`
        <p>User hsa no todos</p>
        `)
      }else{
      for (let i = 0; i < todoData.length; i++) {
        const liElement = $('<li>')
        liElement.text(todoData[i].todo);
        ulElement.append(liElement); 
      }
    }
    }

    posts()
    todos()
    userInfo()
    }
  }
)
