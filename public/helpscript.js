(function($) {

    var url  = window.location.href;  
    console.log("The current URL is: " + url);
    
    $('#app, #steps').fadeIn('slow');

    var loc,graph,pattern = false;
    
    $('#get-accounts-btn').on('click', function(e) {
      
      if(!loc)
      {
         $('#get-accounts-data').slideDown();
        
        $('#get-accounts-data').slideUp(function() {
          var html = ' ';
          
            html += '<div class="inner">';
            html += '1) Which Place do I spend the most money on?<br>';
            html += '2) Where can I buy less expensive coffee?<br>';
            html += '3) Which place has my highest gas spending amount on?';
            html += '</div>';

          $(this).html(html).slideDown();
        });
        loc = true;
      }
      else
      {
         $('#get-accounts-data').slideDown();
         $('#get-accounts-data').slideUp(function() { $(this).html('').slideDown(); });
         loc = false;
      }
      
    });

  $('#get-item-btn').on('click', function(e) {
      if(!graph)
      {
              
         $('#get-item-data').slideDown();
        
        $('#get-item-data').slideUp(function() {
          var html = ' ';
          
            html += '<div class="inner">';
            html += '1) Can you show me my buckets?<br>';
            html += '2) How much did I earn last month/week/year?<br>';
            html += '3) How much did I spend this month?';
            html += '</div>';

          $(this).html(html).slideDown();
        });
        graph = true;
      }
      else
      {
         $('#get-item-data').slideDown();
         $('#get-item-data').slideUp(function() { $(this).html('').slideDown(); });
         graph = false;
      }


    });
    
    
    
     $('#get-transactions-btn').on('click', function(e) {
      if(!pattern)
      {
        
        $('#get-transactions-data').slideDown();
        
        $('#get-transactions-data').slideUp(function() {
          var html = ' ';
          
            html += '<div class="inner">';
            html += '1) How much did I spend on traveling/rent/education/movies/food<br>';
            html += '2) How can I cut back on my spending?<br>';
            html += '3) Can you transfer $X from my movies budget to my rent bucket?';
            html += '</div>';

          $(this).html(html).slideDown();
        });
        pattern = true;
        
      }
      else
      {
         $('#get-transactions-data').slideDown();
         $('#get-transactions-data').slideUp(function() { $(this).html('').slideDown(); });
      }

    });
    
  })(jQuery);