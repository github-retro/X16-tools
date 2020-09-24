// Extension for exporting maps int Tiled Map Editor by Justin Baldock v1.0
// The map is saved in a BASIC data format.
// Insired by Johan Kårlin
// https://github.com/github-retro/X16-tools/tree/master/Tiled-Tools

var basicDataMapFormat = {
    name: "X16 BASIC Map",
    extension: "dat",

    write: function(map, fileName) {
		// Ask user for BASIC line start
		var basicLineStart = parseInt(tiled.prompt("BASIC Line start:", "10000"));
		
		// Create file and write width and height
        var file = new TextFile(fileName, TextFile.WriteOnly);
		file.writeLine(basicLineStart + " REM MAP WIDTH AND HEIGHT");
		basicLineStart++;
		file.writeLine(basicLineStart + " DATA " + map.width + ',' + map.height);
		basicLineStart++;
		file.writeLine(basicLineStart + " REM MAP TILE WIDTH AND HEIGHT");
		basicLineStart++;
		file.writeLine(basicLineStart + " DATA " + map.tileWidth + ',' + map.tileHeight);
		file.writeLine(basicLineStart + " REM MAP DATA IN 16 BYTE SEGMENTS");
		basicLineStart++;
		
		// Write each tile layer in map
        for (var i = 0; i < map.layerCount; ++i) {
            var layer = map.layerAt(i);
            if (layer.isTileLayer) {
				
                // Write each row in current layer
				for (y = 0; y < layer.height; ++y) {
                    
					// Write each column in current layer, create BASIC data lines with 16 elements in each
					for (x = 0; x < layer.width; x=x+16) {

						segment = " DATA ";
						for (s = 0; s < 16; ++s){
							var cell = layer.cellAt(x+s, y);
							val = cell.tileId;
							if (val == "-1"){
								val = "0";
							}
							segment = segment + val.toString(10) + ",";
 						}
						// remove the last , from the string 
						segment = segment.substring(0,segment.length - 1);
						// increase the BASIC line number and write out the data
						++basicLineStart
						file.writeLine(basicLineStart + segment);	
                    }
                }
            }
        }
        file.commit();
    }
}

tiled.registerMapFormat("X16 BASIC Map", basicDataMapFormat)
