function myQuery( url, callback, data, method, contentType )
{
    var data   = ( data   === undefined ) ? null : data;
    var method = ( method === undefined ) ? "GET" : method;
    var contentType = ( contentType === undefined ) ? "application/json" : contentType;

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
        contentType: contentType
    } );
}

function showUserList()
{
    myQuery(
        "/_design/ifam/_view/users?include_docs=true",
        function ( data, textStatus, jqXHR ) {
            displayTemplate( "#content", "home.tpl", data, function() {
                $( '#content .users a' ).bind( "click", displayUser );
            } );

            setActive( "displayUsers" );
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
            displayTemplate( "#content", "user.tpl", data );
        }
    );
}

function displayTemplate( target, template, templateData, success )
{
    $.get(
        "/templates/" + template,
        null,
        function ( data, textStatus, jqXHR ) {
            $( target ).empty().append(
                Mustache.to_html( data, templateData )
            );
            success();
        }
    );
}

function setActive( id )
{
    $( "ul.navigation li" ).removeClass( "active" );
    $( "#" + id ).addClass( "active" );
}

function checkUserLogin()
{
    myQuery(
        "/../_session",
        function ( data, textStatus, jqXHR ) {
            if ( !data.userCtx.name ) {
                displayTemplate( "#login", "login.tpl", null, function() {
                    $( "#login form" ).bind( "submit", function() {
                        myQuery(
                            "/../_session",
                            checkUserLogin,
                            {   name: $( "#login input[name='user']" ).val(),
                                password: $( "#login input[name='pass']" ).val()
                            },
                            "POST",
                            "application/x-www-form-urlencoded"
                        );

                        return false;
                    } );
                } );
            } else {
                displayTemplate( "#login", "loggedin.tpl", data.userCtx );
            }
        }
    );
}

$( document ).ready( function() {

    $( "#createUser" ).bind( "submit", createUser );

    $( "#displayUsers" ).bind( "click", showUserList );

    showUserList();
    checkUserLogin();
} );

