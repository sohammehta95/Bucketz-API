(function($) {

    var url  = window.location.href;  
    console.log("The current URL is: " + url);
    
    //Grab the SenderId
    var curr_url = new URL(url);
    var senderId = curr_url.searchParams.get("senderId");
    console.log("The sender Id is: " + senderId);
    
    var handler = Plaid.create({
      apiVersion: 'v2',
      clientName: 'Bucketz',
      env: plaidenv,
      product: ['transactions'],
      key: publickey,
      onSuccess: function(public_token) 
      {
        $.post('/plaid/get_access_token', { public_token: public_token }, function(data) {
            if(data.error==true) 
              console.log("Check the onSuccess of Handler");
            else if(!data.error)
            {
              
              $.post('/plaid/get_all', { access_token: data.ACCESS_TOKEN, item_id:data.ITEM_ID, senderId:senderId}, function(data){
                console.log("Got it all baby!");
                window.location.replace("https://www.bucketzapp.com/close");
              });
              
              
              //CSS Stuff
              $('#container').fadeOut('fast', function() 
              {
                $('#intro').hide();
                $('#app, #steps').fadeIn('slow');
              });
            }
        });
      },
    });

    $('#link-btn').on('click', function(e) {
      console.log("The Plaid API Handle will open here!");
      handler.open();
    });

    $('#get-accounts-btn').on('click', function(e) {
       console.log("acc clicked");
      $.get('/plaid/accounts', function(data) {
            
           
        // console.log("------------------------------------");
        // console.log("The account is:");
        // console.log(data);
        // console.log("------------------------------------");   
        
        $('#get-accounts-data').slideUp(function() {
          var html = '';
          data.accounts.forEach(function(account, idx) {
            html += '<div class="inner">';
            html += '<strong>' + account.name +
              ' $' + (account.balances.available != null ? account.balances.available : account.balances.current) + '</strong><br>';
            html += account.subtype + ' ' + account.mask;
            html += '</div>';
          });

          $(this).html(html).slideDown();
        });
      });
    });

    $('#get-item-btn').on('click', function(e) {
      $.post('/plaid/item', function(data) {
        
        $('#get-item-data').slideUp(function() {
          if (data.error)
            $(this).html('<p>' + data.error + '</p>').slideDown();
          else {
            // console.log("------------------------------------");
            // console.log("The item is:");
            // console.log(data);
            // console.log("------------------------------------");
            var html = '<div class="inner">';
            html += '<p>Here\'s some basic information about your Item:</p>';
            html += '<p>Institution name:' + data.institution.name + '</p>';
            html += '<p>Billed products: ' + data.item.billed_products.join(', ') + '</p>';
            html += '<p>Available products: ' + data.item.available_products.join(', ') + '</p>';
            html += '</div>';

            $(this).html(html).slideDown();
          }
        });
      });
    });

    $('#get-transactions-btn').on('click', function(e) {
      $.post('/plaid/transactions', function(data) {
        if (data.error != null) {
          // Format the error
          var errorHtml = '<div class="inner"><p>' +
           '<strong>' + data.error.error_code + ':</strong> ' +
           data.error.error_message + '</p></div>';

          if (data.error.error_code === 'PRODUCT_NOT_READY') {
            // Add additional context for `PRODUCT_NOT_READY` errors
            errorHtml += '<div class="inner"><p>The PRODUCT_NOT_READY ' +
             'error is returned when a request to retrieve Transaction data ' +
             'is made before Plaid finishes the <a href="https://plaid.com/' +
             'docs/quickstart/#transaction-data-with-webhooks">initial ' +
             'transaction pull.</a></p></div>';
          }
          // Render the error
          $('#get-transactions-data').slideUp(function() {
            $(this).slideUp(function() {
              $(this).html(errorHtml).slideDown();
            });
          });
        } 
        else {
          //No Error
          // console.log("------------------------------------");
          //   console.log("The transactions are is:");
          //   console.log(data);
          //   console.log("------------------------------------");
          $('#get-transactions-data').slideUp(function() {
            var html = '';
            data.transactions.forEach(function(txn, idx) {
              html += '<div class="inner">';
              html += '<strong>' + txn.name + '</strong><br>';
              html += '$' + txn.amount;
              html += '<br><em>' + txn.date + '</em>';
              html += '</div>';
            });

            $(this).slideUp(function() {
              $(this).html(html).slideDown();
            });
          });
        }
      });
    });
  })(jQuery);