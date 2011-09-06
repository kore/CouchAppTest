<h2>{{name}}</h2>

<dl>
    <dt>E-Mail:</dt>
    <dd>{{email}}</dd>

    <dt>Attachements:</dt>
    <dd>
        <ul>
        {{#attachments}}
            <li><a href="/api/{{_id}}/{{name}}">{{name}}</a> ({{content_type}})</li>
        {{/attachments}}
        </ul>
    </dd>
</dl>

<fieldset>
    <form target="/api/{{_id}}" method="POST">
        <!-- Revision absolutey necessary, since we modify the document by attaching a file. -->
        <input type="hidden" name="_rev" value="{{_rev}}" />
        <input type="file" name="_attachments" />
        <input type="submit" value="Upload!" />
    </form>
</fieldset>

