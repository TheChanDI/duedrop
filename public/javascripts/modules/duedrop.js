$(function() {

  var duedrop = {
    add: function(drop) {
      $.post('/drop', { 'duedrop': drop }, function(data) {
        // console.log(data);
      });
      $('#drop-form')[0].reset();
      $('#duedrops').after('<div class="span8 offset2"><input type="checkbox"><input class="drop" value="' + drop.text + '"><button class="close" type="button">&times;</button></div>');
    },

    remove: function(dropId) {
      $.post('/drop/remove', { 'dropId': dropId }, function(data) {
        // console.log(data);
      });
      var toRemove = $('#' + dropId);
      $(toRemove).remove();
    },

    update: function(dropId, drop) {
      $.post('/drop/update', { 'dropId': dropId,
                               'drop': drop },
        function(data) {
          // console.log(data);
      });
    }
  }

  $('#drop-form').submit(function(evt) {
    evt.preventDefault();
    var drop_text = $(this).find('input[name="new-drop"]').val();
    var drop = { text: drop_text };
    duedrop.add(drop);
  });


  // listen for changes to know whether
  // to display update buttons
  $('.drop').each(function() {
    var drop = $(this);

    drop.data('original', drop.val());
    drop.data('old', drop.val());

    drop.bind('keyup keypress input', function(evt) {
      var parentId = this.parentNode.parentNode.id;
      var confirmDiv = $('#' + parentId + ' > .update');

      if (confirmDiv.css('display') === 'none' && drop.data('original') !== drop.val()) {
        confirmDiv.fadeIn(200);
        drop.data('old', drop.val());
      }
      if (drop.data('original') === drop.val()) {
        confirmDiv.fadeOut(200);
      }
    });
  });

  $('.revert').click(function(evt) {
    evt.preventDefault();
    var confirmDiv = this.parentNode.parentNode;
    var dropId = this.parentNode.parentNode.parentNode.id;
    var revertDrop = $('#' + dropId).find('.drop');
    var original = revertDrop.data('original');
    revertDrop.val(original);
    $(confirmDiv).fadeOut(100);
  });

  $('.commit').click(function(evt) {
    evt.preventDefault();
    var dropId = this.parentNode.parentNode.parentNode.id;
    var drop = $('#' + dropId).find('.drop').val();
    duedrop.update(dropId, drop);
  });

  $('.close').click(function(evt) {
    evt.preventDefault();
    var parentId = this.parentNode.parentNode.id;
    var confirmDiv = $('#' + parentId + ' > .remove');
    if (confirmDiv.css('display') === 'none') {
      confirmDiv.fadeIn(200);
    } else {
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
  });
});