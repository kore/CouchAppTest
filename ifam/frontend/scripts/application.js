function myQuery( url, callback, data, method )
{
    var data   = ( data   === undefined ) ? null : data;
    var method = ( method === undefined ) ? "GET" : method;

    $.ajax( {
        type: method,
        url: "/api" + url,
        data: data,
        success: callback,
        error: function( request, textStatus, error )
            {
                var result = JSON.parse( request.responseText );
                console.log( "Error loggin in: " + result.reason );
                throw( result );
            },
        dataType: "json",
        contentType: "application/json"
    } );
}

function refreshUserList()
{
    $( 'ul#users' ).empty();
    myQuery(
        "/_design/ifam/_view/users?include_docs=true",
        function ( data, textStatus, jqXHR ) {
            $.each( data.rows, function( key, value ) {
                $( 'ul#users' ).append( "<li>"+ value.doc.name + " &lt;" + value.doc.email + "&gt;</li>" );
            } );
        }
    );
}

function createUser()
{
    // function myQuery( url, callback, data, method )
    myQuery(
        "/" + $( 'input[name="name"]' ).val(),
        function ( data, textStatus, jqXHR ) {
            console.log( data );
            refreshUserList();
        },
        JSON.stringify( {
            name: $( 'input[name="name"]' ).val(),
            email: $( 'input[name="email"]' ).val(),
            type: "user"
        } ),
        "PUT"
    );

    return false;
}

$( document ).ready( function() {

    $( "#createUser" ).bind( "submit", createUser );
    refreshUserList();
} );

