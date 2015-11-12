
if (Meteor.isClient) {

  Session.setDefault("queryPhrase", "");
  Session.setDefault("resultsList", []);
  
  Template.body.helpers({     
    allResults: function() {
      return Session.get("resultsList");
    }     
  });
    
  Template.body.events({
    'submit form': function(event) {
      // read user input
      var searchPhrase = event.target.queryPhrase.value;
      
      Session.set("resultsList", []);
      
      // send request and wait for the results from the server
      Meteor.call('callBing', searchPhrase, function(error, result) {
        Session.set("resultsList", result.d.results);        
      });
    
      return false; // prevent the form reload
    }
  });
}

if (Meteor.isServer) {

  Meteor.methods({
    callBing: function (searchPhrase) {
      console.log("search :" + searchPhrase);

      this.unblock();
      
      var method = "GET";
      
      var url = 'https://api.datamarket.azure.com/Bing/Search/v1/Web';
      
      var appKey = ''; //each time be careful here
      
      var authHeader = "Basic " + Base64.encode(appKey + ":" + appKey);

      var options = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader
        },
        
        query: "$format=json"
          + "&$top=20"
          + "&Query=" + "'" + searchPhrase + "'",       
      };

      var response = HTTP.call(
        method, 
        url, 
        options);

      return response.data;
    }
  });
}
