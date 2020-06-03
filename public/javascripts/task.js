
function addListeners() {
    $(".task-card").draggable({
      revert: "invalid",
      start: function() {
        $(this).addClass("selected");
      },
      stop: function() {
        $(this).removeClass("selected")
      }
    });
  
    $(".column").droppable({
      accept: ".task-card",
      drop: function(event, ui) {
        ui.draggable
          .css("left", "0")
          .css("top", "0")
          .appendTo($(this).find(".tasks"))
      }
    });
  }

$(function() {
    addListeners();
  });

  
  