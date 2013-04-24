$(function() {

  var duedrop = {
    add: function(drop) {
      $.post('/drop', { 'duedrop': drop }, function(data) {
        console.log(data);
      });
      $('#drop-form')[0].reset();
      $('#duedrops').after('<div class="span8 offset2"><input type="checkbox"><input class="drop" value="' + drop.text + '"><button class="close" type="button">&times;</button></div>');
    },

    remove: function(dropId) {
      $.post('/drop/remove', { 'dropId': dropId }, function(data) {
        console.log(data);
      });
      var toRemove = $('#' + dropId);
      $(toRemove).remove();
    },

    update: function(data) {
      // update
    }
  }

  $('#drop-form').submit(function(evt) {
    evt.preventDefault();
    var drop_text = $(this).find('input[name="new-drop"]').val();
    var drop = { text: drop_text };
    duedrop.add(drop);
  });

  $('.close').click(function(evt) {
    evt.preventDefault();
    var parentId = this.parentNode.parentNode.id;
    var confirmDiv = $('#' + parentId + ' > .remove');
    if (confirmDiv.css('display') === 'none') {
      confirmDiv.fadeIn(200);
    }
    else {
      confirmDiv.fadeOut(200);
    }
  });

  $('.second-thoughts').click(function(evt) {
    evt.preventDefault();
    var confirmDiv = this.parentNode.parentNode;
    $(confirmDiv).fadeOut(100);
  });

  $('.delete').click(function(evt) {
    evt.preventDefault();
    var dropId = this.parentNode.parentNode.parentNode.id;
    duedrop.remove(dropId);
  })
});