// Adobe Illustrator Script to Resize Artboard and Add Background Layer
// Written by [Your Name]
// Date: [Today's Date]

// Ensure a document is open
if (app.documents.length > 0) {
	var doc = app.activeDocument;
	var padding = 0.25; // Padding in inches

	// Convert padding to document's unit
	var paddingInPoints = UnitValue(padding, "in").as("pt");

	// Deselect any selected items
	doc.selection = null;

	// Select all artwork
	doc.pageItems.everyItem().selected = true;

	// Get the selection bounds
	var selectionBounds = doc.selection[0].visibleBounds;
	for (var i = 1; i < doc.selection.length; i++) {
		var itemBounds = doc.selection[i].visibleBounds;
		selectionBounds[0] = Math.min(selectionBounds[0], itemBounds[0]);
		selectionBounds[1] = Math.max(selectionBounds[1], itemBounds[1]);
		selectionBounds[2] = Math.max(selectionBounds[2], itemBounds[2]);
		selectionBounds[3] = Math.min(selectionBounds[3], itemBounds[3]);
	}

	// Calculate new artboard bounds with padding
	var newArtboardBounds = [
		selectionBounds[0] - paddingInPoints, // Left
		selectionBounds[1] + paddingInPoints, // Top
		selectionBounds[2] + paddingInPoints, // Right
		selectionBounds[3] - paddingInPoints, // Bottom
	];

	// Resize the active artboard
	var activeArtboard = doc.artboards[doc.artboards.getActiveArtboardIndex()];
	activeArtboard.artboardRect = newArtboardBounds;

	// Prompt user for background color
	var userColor = prompt(
		"Enter background color in hex format (e.g., #FF5733):",
		"#FFFFFF"
	);
	if (userColor) {
		// Remove the hash if present
		if (userColor[0] === "#") {
			userColor = userColor.substring(1);
		}

		// Convert hex to RGB
		var r = parseInt(userColor.substring(0, 2), 16);
		var g = parseInt(userColor.substring(2, 4), 16);
		var b = parseInt(userColor.substring(4, 6), 16);

		// Create a new RGB color
		var bgColor = new RGBColor();
		bgColor.red = r;
		bgColor.green = g;
		bgColor.blue = b;

		// Create a new layer for the background
		var bgLayer = doc.layers.add();
		bgLayer.name = "Background";

		// Create a rectangle the size of the artboard
		var bgRect = bgLayer.pathItems.rectangle(
			newArtboardBounds[1], // Top
			newArtboardBounds[0], // Left
			newArtboardBounds[2] - newArtboardBounds[0], // Width
			newArtboardBounds[1] - newArtboardBounds[3] // Height
		);

		// Set the fill color and remove the stroke
		bgRect.fillColor = bgColor;
		bgRect.stroked = false;

		// Send the background layer to the back
		bgLayer.zOrder(ZOrderMethod.SENDTOBACK);
	} else {
		alert("No color entered. Background layer not created.");
	}

	// Deselect all
	doc.selection = null;
} else {
	alert("No document open. Please open a document and try again.");
}
