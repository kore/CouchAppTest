function showBrowseUsers()
{
    setActive( "browseUsers" );
    displayTemplate( "#content", "browse_users.tpl", function() {
        // @TODO: Bind autocomplete stuff
    } );
}
