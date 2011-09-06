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

function showUserList()
{
    myQuery(
        "/_design/ifam/_view/users?include_docs=true",
        function ( data, textStatus, jqXHR ) {
            displayTemplate( "home.tpl", data );

            $( 'ul#users a' ).bind( "click", displayUser );
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

function displayUser( e )
{
    var userId = $( e.currentTarget ).attr( "data" );

    myQuery(
        "/" +  userId,
        function ( data, textStatus, jqXHR ) {
            $( '#content' ).html( "<h2>" + data.name + "</h2>" );
        }
    );
}

function displayTemplate( template, templateData )
{
    $.get(
        "/templates/" + template,
        null,
        function ( data, textStatus, jqXHR ) {
            $( "#content" ).empty().append(
                Mustache.to_html( data, templateData )
            );
        }
    );
}

$( document ).ready( function() {

    $( "#createUser" ).bind( "submit", createUser );
    showUserList();
} );

