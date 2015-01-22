
/// TO DO
/// ------------------------------------------------------------------------------------------------------------
/// [ ] Enable swapping cells
/// [ ] Reset Game action
/// [ ] Finish Game action
/// [ ] Move counter
/// ------------------------------------------------------------------------------------------------------------





$(function(){
	// swappable start
	var dragging, placeholders = $();
	$.fn.sortable = function(options) {
		var method = String(options);
		return this.each(function() {
			var items = $(this).children($(this).data('items')).attr('draggable', method == 'enable');
			if (method == 'destroy') {
				items.add(this).removeData('items')
					.off('dragstart.h5s dragend.h5s selectstart.h5s dragover.h5s dragenter.h5s drop.h5s');
			}
			var index, items = $(this).children(options.items);
			var placeholder = $('<' + (/^ul|ol$/i.test(this.tagName) ? 'li' : 'div') + ' class="sortable-placeholder">');
			$(this).data('items', options.items);
			placeholders = placeholders.add(placeholder);

			// ON dragstart
			items.attr('draggable', 'true').on('dragstart.h5s', function(e) {
				items.parent().trigger('sortstart', {item: dragging});
				var dt = e.originalEvent.dataTransfer;
				index = (dragging = $(this)).addClass('sortable-dragging').index();
			}).attr('draggable', 'true').on('dragend.h5s', function() {
				dragging.removeClass('sortable-dragging').show();
				//gets rid of placeholder
				placeholders.detach();
				if (index != dragging.index()) {
					items.parent().trigger('sortupdate', {item: dragging});
				}
				dragging = null;
			}).on('selectstart.h5s', function() {
				this.dragDrop && this.dragDrop();
				return false;
			}).add([this, placeholder]).on('dragover.h5s dragenter.h5s drop.h5s', function(e) {
				if (e.type == 'drop') {
					e.stopPropagation();
					//puts dragged element after placeholder
					placeholders.filter(':visible').after(dragging);
					return false;
				}
				e.preventDefault();
				e.originalEvent.dataTransfer.dropEffect = 'move';
				if (items.is(this)) {
					console.log(this);
					dragging.hide();
					console.log('drop!');
					//swap them.  
					swapElements(dragging[0],this);

					//looks at where the target is
					$(this)[placeholder.index() < $(this).index() ? 'after' : 'before'](placeholder);
					placeholders.not(placeholder).detach();
				}
			}).on('dragleave.h5s', function(e){
				//put back everything
				swapElements(dragging[0],this);
			});
		});
	};
	function swapElements(elm1, elm2) {
	    var parent1, next1,
	        parent2, next2;

	    parent1 = elm1.parentNode;
	    next1   = elm1.nextSibling;
	    parent2 = elm2.parentNode;
	    next2   = elm2.nextSibling;

	    parent1.insertBefore(elm2, next1);
	    parent2.insertBefore(elm1, next2);
	}
	//some defaults
	var rowLength = 9;
	var pieceTypes = 4;
	var numOfBlanks = (rowLength+1) + pieceTypes;
	var numOfPieces = (rowLength+1) * (pieceTypes + 1);
	var colorsArray = ['green','blue','red','yellow'];


	//board array
	var pieces = [];
	//create arrays of numbers
	// 4 colors and 1 of blanks or 5 arrays total
	var blank = [];
	var green = [];
	var blue = []
	var red = [];
	var yellow = [];

	$(document).on('click','#startGame', function(){
		startGame();
	});

	function startGame(){
		$('#startGame').addClass('hide');
		$('#boardWrapper').append(buildBoard());
		populateBoard();
	}
	function buildBoard(){
		var html = [];
		html.push('<ul id="board" class="sortable grid">');
		for(var i = 1; i <= 5; i++){
				for(var j = 1; j <= 10; j++){
					html.push('<li class="block ' + i +'"></li>');
				}
		}
		html.push('</ul>')
		return html.join("");
	}
	function populateBoard(){
		// 4 colors
		pieces.push(green,blue,red,yellow);
		// 9 numbers per colors
		for(var i = 0; i < pieces.length;i++){
			for(var j = 1; j <= rowLength; j++){
				pieces[i].push(j);
			}
		}
		// blanks
		for(var i = 1; i <= numOfBlanks;i++){
			blank.push(i);
		}
		// ad them to master array and colors array
		pieces.push(blank);
		colorsArray.push('blank');

		//put everything in the board
		//select by index of <td>
		//randomly select from multidimensional array
		//make sure to delete from array every time. delete from top level once empty
		var x = 0
		var intervalId = setInterval(function(){
			placePiece(x);
			if(++x === numOfPieces){
				window.clearInterval(intervalId);
				finishBoard();
			}
		}, 25);

	}
	function placePiece(index){
		// random number of piece color
		var num1 = Math.floor(Math.random() * pieces.length);
		// use random type to pick color in array and get color string from color array
		var randType = pieces[num1];
		var color = colorsArray[num1];
		// random number for piece number
		var num2 = Math.floor(Math.random() * randType.length);
		// get piece from array
		var indPiece = randType[num2];
		// get color string from color array

		///get block for piece
		var $block = $('.block:eq(' + index + ')');
		

		var pieceHtml = '<div class="piece ' + color + '" data-number="' + randType[num2] + '" data-color="' + color + '"></div>';

		$block.append(pieceHtml);
		//disable blanks so they can't be moved
		if(color == 'blank'){
			$block.addClass('disabled');
		};
		randType.splice(num2, 1);
		if(randType.length == 0){
			pieces.splice(num1,1);
			colorsArray.splice(num1,1);
		}
	}

	function finishBoard(){
		// analyzeBoard();
		$('.sortable').sortable({
			items: '.block:not(.disabled)'
		}).bind('sortupdate', function() {
	    	//Triggered when the user stopped sorting and the DOM position has changed.
	    	console.log('sortupdate');
	    	// analyzeBoard();
		}).bind('sortstart', function() {
	    	//Triggered when the user starts.
	    	console.log('sortstart');
	    	// analyzePiece();
		});
	}
	// function analyzeBoard(){
	// 	console.log('analyzeboard');
	// 	//loop through pieces
	// 	//maybe put the numbers on either side of the blank as classes on it?
	// 	$('.blank').each(function(){
	// 		var $this = $(this);
	// 		var $block = $this.parent('.block')
	// 		var index = $('.block').index($block);
	// 		var right;
	// 		// console.log(index);
	// 		//we dont want to do the last of a row or the beginning of a row.  Far-rights dont need nexts and Far-lefts dont need prev and next classes
	// 		if((index+1)%(rowLength+1) != 0)
	// 		{
	// 			$right = $block.next('.block');
	// 			$rightpiece = $right.children('.piece');
	// 			$block.addClass($rightpiece.data('number') + $rightpiece.data('color'));
	// 		}
	// 		if((index)%(rowLength+1) != 0)
	// 		{
	// 			$left = $block.prev('.block');
	// 			$leftpiece = $left.children('.piece');
	// 			$block.addClass($leftpiece.data('number') + $leftpiece.data('color'));
	// 		}
	// 	});

	// 	//disable the pieces that cant be moved?  OR just leave them?
	// }
	// function analyzePiece(){
	// 	//this is where we find proper blank spaces the piece grabbed can be moved
	// 	//get dragging piece
	// 	var $handPiece = $('.sortable-dragging');
	// 	var pieceColor = $handPiece.data('color');
	// 	var pieceNumber = $handPiece.data('number');
	// 	var $targets = $('.' + pieceNumber + pieceColor);
	// 	//first disable all blocks
	// 	$('.block').sortable('disable');
	// 	//then re-enable the targets
	// 	$targets.sortable('enable');
	// 	$targets.addClass('targetBlock');

	// }
});

// So I just realized that im not making the game right.  I need to make sure the pieces are trading spaces with a blank piece.
	// 1 - change jquery.sortable to swap instead of reorder.
				// - don't reorder.  swap on target.



