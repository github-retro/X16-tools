// Extension for exporting maps int Tiled Map Editor by Justin Baldock v1.0
// The map is saved in a BASIC data format.
// Insired by Johan Kårlin
// https://github.com/github-retro/X16-tools/tree/master/Tiled-Tools
// 
// reference
// https://github.com/commanderx16/x16-docs

var basicDataMapFormat = {
    name: "X16 BASIC Map",
    extension: "dat",

    write: function(map, fileName) {
		// Ask user for BASIC line start
		var basicLineStart = parseInt(tiled.prompt("BASIC Line start:", "10000"));
		// Ask user for palette offset
		var paletteOffset = parseInt(tiled.prompt("Palette Offset:", "0"));
		
		// Create file and write width and height
        var file = new TextFile(fileName, TextFile.WriteOnly);
		file.writeLine(basicLineStart + " REM MAP WIDTH AND HEIGHT");
		basicLineStart++;
		file.writeLine(basicLineStart + " DATA " + map.width + ',' + map.height);
		basicLineStart++;
		file.writeLine(basicLineStart + " REM MAP TILE WIDTH AND HEIGHT");
		basicLineStart++;
		file.writeLine(basicLineStart + " DATA " + map.tileWidth + ',' + map.tileHeight);
		file.writeLine(basicLineStart + " REM MAP DATA IN 8 x 2 BYTE SEGMENTS - VERA TILE_BASE DATA");
		basicLineStart++;
		
		// Write each tile layer in map
        for (var i = 0; i < map.layerCount; ++i) {
            var layer = map.layerAt(i);
            if (layer.isTileLayer) {
				
                // Write each row in current layer
				for (y = 0; y < layer.height; ++y) {
                    
					// Write each column in current layer, create BASIC data lines with 8 elements in each
					// each element is 2 bytes
					// https://github.com/commanderx16/x16-docs/blob/master/VERA%20Programmer's%20Reference.md#tile-mode-248-bpp
					// 
					for (x = 0; x < layer.width; x=x+8) {
						// reset the linebuffer 
						linebuffer = " DATA ";
						for (s = 0; s < 8; ++s){
							var cell = layer.cellAt(x+s, y);
							// Build and write 16 bit word with information about palette, flipping and 10 bit tile id
							var word = (paletteOffset << 12) + (cell.tileId & 1023);
							if (cell.flippedVertically) {
								word += 0x0800; 
							}
							if (cell.flippedHorizontally) {
								word += 0x0400;
							}
							TileBase0 = ((word >> 8) & 0xff);
							TileBase1 = ((word >> 0) & 0xff);
							
							linebuffer = linebuffer + TileBase0.toString(10) + "," + TileBase1.toString(10) + "," ;
							
 						}
						// remove the last , from the string 
						linebuffer = linebuffer.substring(0,linebuffer.length - 1);
						// increase the BASIC line number and write out the data
						++basicLineStart
						file.writeLine(basicLineStart + linebuffer);	
                    }
                }
            }
        }
        file.commit();
    }
}

tiled.registerMapFormat("X16 BASIC Map", basicDataMapFormat)