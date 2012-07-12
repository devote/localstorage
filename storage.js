/*
 * localStorage for Internet Explorer 6,7 - v0.2.0
 *
 * Copyright 2012, Dmitriy Pakhtinov ( spb.piksel@gmail.com )
 *
 * http://spb-piksel.ru/
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Update: 12-07-2012
 */

(function( window, undefined ){

	var
		document = window.document,
		toString = Object.prototype.toString;

	if ( !window.localStorage ) {

		if ( window.location.hash == "#localStorageDataStoredPage" ) {

			document.write( '<link id="StorageElement" style="behavior:url(#default#userData)" />'+
				'<script type="text/javascript">'+
					'var r=[],_S=document.getElementById("StorageElement");'+
					'for(var k in window){'+
						'if(k!="r"&&k!="_S"){'+
							'r[r.length]=k;'+
						'}'+
					'}'+
					'window.onerror=function(){'+
						'return true;'+
					'};'+
					'window.onload=function(){'+
						'_S.document.body.innerHTML="";'+
					'}'+
				'</script>'+
				'<script type="text/javascript">'+
					'eval("var "+r.join("=null,")+"=null,prompt=null,alert=null,r=null;")'+
				'</script><body><noscript><noscript><noscript><noscript><plaintext><![CDATA['
			);

			return;
		}

		var iframe = document.createElement( 'iframe' );
		iframe.src = "/" + location.pathname.split( "/" ).pop() + "?" + Math.random() + "#localStorageDataStoredPage";
		iframe = document.documentElement.firstChild.appendChild( iframe ).contentWindow;

		document.attachEvent( "onreadystatechange", iframe.onload = function() {

			var storageName = 'localStorage', s = iframe["_S"],
			    currentStorage = {}, currentUpdater;

			if ( !window.localStorage && s ) {

				s.load( storageName );

				window.localStorage = {

					length: 0,

					setItem: function( name, value ) {
						try {
							if ( name !== undefined ) {
								s.setAttribute( name, value === null ? 'null' :
										( value.toString ? value.toString() : toString.call( value ) ) );
							}

							s.save( storageName );

							s.load( storageName + "URL" );
							s.setAttribute( 'docURL', document.location.href );
							s.save( storageName + "URL" );

							s.load( storageName );
						} catch( _e_ ) {
							if ( _e_.number == -2147024857 ) {
								throw {
									"number": 22,
									"message": "Quota exceed error",
									"description": "QUOTA_EXCEEDED_ERR"
								}
								throw _e_;
							}
						}

						this.length = s.XMLDocument.documentElement.attributes.length;

						currentUpdater( true );
					},

					getItem: function( name ) {
						s.load( storageName );
						return s.getAttribute( name );
					},

					removeItem: function( name ) {
						s.removeAttribute( name );
						delete currentStorage[ name ];
						this.setItem();
					},

					key: function( num ) {
						try {
							return s.XMLDocument.documentElement.attributes[ num ].name;
						} catch( _e_ ) {
							return null;
						}
					},

					clear: function() {

						var nodes = s.XMLDocument.documentElement.attributes;

						for( var i = nodes.length - 1; i >= 0; i-- ) {
							delete currentStorage[ nodes[ i ].name ];
							s.removeAttribute( nodes[ i ].name );
						}

						this.setItem();
					}
				}

				var onStorageInterval = setInterval( ( currentUpdater = function( special ) {

					s.load( storageName );

					var i, name, value, cache = [],
					    xml = s.XMLDocument.documentElement,
					    len = window.localStorage.length = xml.attributes.length;

					if ( special !== true ) {

						for( i = 0; i < len; i++ ) {

							name = xml.attributes[ i ].name;
							value = xml.attributes[ i ].value;

							if ( !( name in currentStorage ) || currentStorage[ name ] !== value ) {
								cache[ cache.length ] = {
									"key": name,
									"oldValue": name in currentStorage ? currentStorage[ name ] : null,
									"newValue": value,
									"url": "",
									"storageArea": window.localStorage
								}
							}

							delete currentStorage[ name ];
						}

						for( var i in currentStorage ) {
							if ( currentStorage.hasOwnProperty( i ) ) {
								cache[ cache.length ] = {
									"key": i,
									"oldValue": currentStorage[ i ],
									"newValue": null,
									"url": "",
									"storageArea": window.localStorage
								}

								delete currentStorage[ i ];
							}
						}
					}

					for( i = 0; i < len; i++ ) {
						currentStorage[ xml.attributes[ i ].name ] = xml.attributes[ i ].value;
					}

					if ( window.onstorage && cache.length ) {

						clearInterval( onStorageInterval );

						s.load( storageName + "URL" );
						var url = s.getAttribute( 'docURL' );
						s.load( storageName );

						while( i = cache.shift() ) {
							i["url"] = url;
							window.onstorage.call( window, i );
						}

						onStorageInterval = setInterval( currentUpdater, 300 );
					}

					return currentUpdater;

				})( true ), 300 );
			}
		});
	}

})( window );