$(function() {

  var duedrop = {
    add: function(drop) {
      $.post('/drop', { 'duedrop': drop }, function(savedDrop) {
        var dropId = savedDrop._id;
        var text = savedDrop.text;
        var newDrop = $('<div class="row" id="' + dropId + '">' + 
                          '<div class="span8 offset2">' +
                            '<input type="checkbox">' +
                            '<input class="drop saved-drop" value="' + text + '">' +
                            '<button class="close" type="button">' + '&times;</button>' +
                          '</div>' +
                          '<div class="update span1">' +
                            '<div class="btn-group">' +
                              '<button class="btn revert">Undo</button>' +
                              '<button class="btn btn-inverse commit">Update</button>' +
                            '</div>' +
                          '</div>' +
                          '<div class="remove span2">' +
                            '<div class="btn-group">' +
                              '<button class="btn btn-danger delete">Delete?</button>' +
                              '<button class="btn btn-info second-thoughts">On second thought...</button>' +
                            '</div>' +
                          '</div>' +
                        '</div>');
        $('#drop-form')[0].reset();
        $('#duedrops').after(newDrop);
        $('.saved-drop').each(function() {
          bindEdits($(this));
        });
      });
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
    if (drop_text !== '') {
      var drop = { text: drop_text };
      duedrop.add(drop);
    }
  });

  // listen for changes to know whether
  // to display update buttons
  function bindEdits(drop, dropId) {
    drop.data('original', drop.val());
    drop.data('old', drop.val());

    drop.bind('keyup keypress input', function(evt) {
      var parentId = dropId || this.parentNode.parentNode.id;
      var confirmDiv = $('#' + parentId + ' > .update');

      if (confirmDiv.css('display') === 'none' && drop.data('original') !== drop.val()) {
        confirmDiv.fadeIn(200);
        drop.data('old', drop.val());
      }
      if (drop.data('original') === drop.val()) {
        confirmDiv.fadeOut(200);
      }
    });
  }

  $('.saved-drop').each(function() {
    bindEdits($(this));
  });

  $('div').on('click', '.revert', function(evt) {
    evt.preventDefault();
    var confirmDiv = this.parentNode.parentNode;
    var dropId = this.parentNode.parentNode.parentNode.id;
    var revertDrop = $('#' + dropId).find('.drop');
    var original = revertDrop.data('original');
    revertDrop.val(original);
    $(confirmDiv).fadeOut(100);
  });

  $('div').on('click', '.commit', function(evt) {
    evt.preventDefault();
    var dropId = this.parentNode.parentNode.parentNode.id;
    var confirmDiv = this.parentNode.parentNode;
    var drop = $('#' + dropId).find('.drop').val();
    duedrop.update(dropId, drop);
    $(confirmDiv).fadeOut(100);
  });

  function close(el) {
    var parentId = el.parentNode.parentNode.id;
    var confirmDiv = $('#' + parentId + ' > .remove');
    if (confirmDiv.css('display') === 'none') {
      confirmDiv.fadeIn(200);
    } else {
      confirmDiv.fadeOut(200);
    }
  }

  $('div').on('click', 'button.close', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    close(this);
  });

  $('div').on('click', '.second-thoughts', function(evt) {
    evt.preventDefault();
    evt.stopPropagation();
    var confirmDiv = this.parentNode.parentNode;
    $(confirmDiv).fadeOut(100);
  });

  $('div').on('click', '.delete', function(evt) {
    evt.preventDefault();
    var dropId = this.parentNode.parentNode.parentNode.id;
    duedrop.remove(dropId);
  });

  $('div').on('click', 'input[type="checkbox"]', function(evt) {
    evt.stopPropagation();
    var linedInput = $(this).siblings('.drop')[0]; 
    if ($(this).is(':checked')) {
      $(linedInput).css({ 'text-decoration': 'line-through' });
    } else {
      $(linedInput).css({ 'text-decoration': 'none' });
    }
  });
});