$(function() {

  // This is the id of input type i.e search controller
  // keyup is jQuery function which listen to our's typing on targeted id i.e input control
  $('#search').keyup(function(){

    var search_term = $(this).val();
    $.ajax({
      method: 'POST',
      url: '/api/search',
      data: {
        search_term
      },

      dataType: 'json',
      success: function(json){
        var data = json.hits.hits.map((hit) =>{
          return hit;
        });


        // This is because we want to make div  empty
        $('#searchResults').empty();

        //Now we are going to Replace the Div :)

        for(var i = 0; i < data.length; i++){

          var html = "";
              html += '<div class="col-lg-4 col-sm-6">';
              html += '<a href="/product/' + data[i]._source._id  +  '">'
              html += '<div class="thumbnail">';
              html += '<img src="' +  data[i]._source.image + '">';
              html += '<div class="caption">';
              html += '<h3>' +   data[i]._source.name  + '</h3>';
              html += '<p>' +  data[i]._source.category.name  +'</p>';
              html += '<p>$' +  data[i]._source.price + '</p>';
              html += '</div></div></a></div>';

              $('#searchResults').append(html);
        }
      },

      error: function(error){
        console.log(error);
      }

    });
  });


});
