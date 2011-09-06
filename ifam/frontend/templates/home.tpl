<h2>Available users</h2>

<ol class="users">
{{#rows}}
    {{#doc}}
        <li><a href="#" data="{{_id}}">{{name}}</a> &lt;{{email}}&gt;</li>
    {{/doc}}
{{/rows}}
</ol>
