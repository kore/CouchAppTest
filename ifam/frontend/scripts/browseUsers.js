function showBrowseUsers()
{
    setActive( "browseUsers" );
    displayTemplate( "#content", "browse_users.tpl", null, function() {
        $( "#content input[name=user]" ).autocomplete( {
            delay: 200,
            minLength: 1,
            source: function ( request, response ) {
                var lastXhr = $.getJSON( '/api/_design/ifam/_view/users?startkey="' + request.term + '"&endkey="' + request.term + '\u9999"', {}, function( data, status, xhr ) {
                    if ( xhr === lastXhr ) {
                        // Refactor CouchDB return value into valid structure for the UI autocomplete widget
                        var users = [];
                        $.each( data.rows, function( key, value ) {
                            users.push( value.key );
                        } );

                        response( users );
                    }
                } );
            },
        } );

        $( "#content form" ).bind( "submit", function() {
            myQuery(
                "/" + $( "#content input[name='user']" ).val(),
                function ( data, textStatus, jqXHR ) {
                    displayTemplate( "#user", "user.tpl", data );
                }
            );

            return false;
        } );
    } );
}
