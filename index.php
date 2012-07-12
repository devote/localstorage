<!DOCTYPE html>
<html>
    <head>
        <meta charset=utf-8 />
        <title>:)</title>
		<script type="text/javascript" src="/storage.js?<?php echo time();?>"></script>

		<script type="text/javascript">
			function saveData() {
				var storageKey = document.getElementById( 'storageKey' ),
					storageValue = document.getElementById( 'storageValue' );

				if ( storageKey.value ) {
					localStorage.setItem( storageKey.value, storageValue.value );
					alert( "Data successfully stored" );
				} else {
					alert( "Please enter storage KEY item" );
				}
			}

			function loadData() {
				var storageKey = document.getElementById( 'storageKey' ),
					storageValue = document.getElementById( 'storageValue' );

				if ( storageKey.value ) {
					storageValue.value = localStorage.getItem( storageKey.value );
					alert( 'Data successfully loaded: "' + storageKey.value + ': ' + storageValue.value + '"' );
				} else {
					alert( "Please enter storage KEY item" );
				}
			}

			window.onload = function() {

				loadData();

				window.onstorage = function( e ) {

					var params = ["key","oldValue","newValue","url","storageArea"];

					var k, s = "";
					while( k = params.shift() ) {
						s += "<b>" + k + "</b>: " + e[ k ] + "<br/>";
					}
					var div = document.createElement('div');
					div.innerHTML = s;
					document.body.appendChild( div );
				}
			}
		</script>
    </head>
    <body>
		Enter KEY for store storage: <input id="storageKey" type="text" value="testKey" /><br />
		Enter Value for current KEY: <input id="storageValue" type="text" value="" /><br />
		<button onclick="saveData();">Store entered data</button>
		<button onclick="loadData();">Load from storage</button>
		<button onclick="localStorage.clear();">Clear storage</button>
    </body>
</html>