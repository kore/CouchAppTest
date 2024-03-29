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
                $( '#content .users a' ).bind( "click", function( e ) {
                    var userId = $( e.currentTarget ).attr( "data" );
                    displayUser( userId );
                } );
            } );

            setActive( "displayUsers" );
        }
    );
}

function showCreateUser()
{
	displayTemplate( "#content", "createUser.tpl" ,null, function(){$( "#content form" ).bind( "submit", createUser )});
            setActive( "createUser" );

}

function showCreateDocs()
{
	displayTemplate( "#content", "doc.tpl" ,null, function(){$( "#content form" ).bind( "submit", createDocuments )});
            setActive( "createDocument" );

}

function createDocuments()
{
    // function myQuery( url, callback, data, method )  
	myQuery(
        "/" + Math.random(), 
        function ( data, textStatus, jqXHR ) {
			
            console.log( data );
            refreshUserList();
        },
        JSON.stringify( {
            bs: $( 'input[name="bs"]' ).val(),
            sn: $( 'input[name="sn"]' ).val(),
			bgn: $( 'input[name="bgn"]' ).val(),
            type: "doc"
        } ),
        "PUT"
    );

    return false;
}

function createUser()
{
    // function myQuery( url, callback, data, method )

	if( ($('input[name="pass1"]').val()) !== ($('input[name="pass2"]').val()) )
	{
		alert("stop");
		return false;
	}

    myQuery(
        "/" + $( 'input[name="name"]' ).val(),
        function ( data, textStatus, jqXHR ) {
            console.log( data );
            //refreshUserList();
			
		},
        JSON.stringify( {
            name: $( 'input[name="name"]' ).val(),
            password: $( 'input[name="pass1"]' ).val(),
			email: $( 'input[name="email"]' ).val(),
            type: "user"
        } ),
        "PUT"
    );

    return false;
}

function displayUser( userId )
{
    myQuery(
        "/" +  userId + "?" + Math.random(),
        function ( data, textStatus, jqXHR ) {

            data.attachments = [];
            if ( data._attachments ) {
                $.each( data._attachments, function( key, value ) {
                    value.name = key;
                    data.attachments.push( value );
                } );
            }

            displayTemplate( "#content", "user_full.tpl", data, function() {
                $( "#content form" ).bind( "submit", function( e ) {

                    // Use the jquery.form.js function ajaxSubmit, because this functions implements MAGIC to make file uploads possible. Just trigger it an be happy.
                    $(this).ajaxSubmit( {
                        url: "/api/" + userId,
                        success: function () { displayUser( userId ); }
                    } );
                    return false;
                } )
            } );
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
    $( "#browseUsers" ).bind( "click", showBrowseUsers );

    $( "#createDocument" ).bind( "click", showCreateDocs );

    $( "#createUser" ).bind( "click", showCreateUser );

    showUserList();
    checkUserLogin();
} );

